/**
 * Cloudflare Worker Function (Render Worker)
 *
 * This is the Worker entry point for frame rendering.
 * It handles incoming render chunk requests from the Queue consumer.
 *
 * Architecture:
 * 1. Receive chunk render request from Queue
 * 2. Download template from R2
 * 3. Render frames [startFrame...endFrame]
 * 4. Encode chunk with FFmpeg (via WASM)
 * 5. Upload chunk to R2
 * 6. Update progress in R2
 * 7. Notify Durable Object of chunk completion
 */

/**
 * Worker request payload for rendering a chunk
 */
export interface WorkerRenderRequest {
  jobId: string;
  chunkId: number;
  startFrame: number;
  endFrame: number;
  quality: 'draft' | 'standard' | 'high';
  r2Bucket: string;
  storagePrefix: string;
}

/**
 * Worker response for a completed chunk
 */
export interface WorkerRenderResponse {
  jobId: string;
  chunkId: number;
  status: 'completed' | 'failed';
  framesRendered: number;
  executionTimeMs: number;
  error?: string;
}

/**
 * Cloudflare Worker environment bindings
 */
export interface WorkerEnv {
  /** R2 bucket binding */
  RENDER_BUCKET: R2Bucket;

  /** Queue producer binding */
  RENDER_QUEUE: Queue;

  /** Durable Object namespace binding */
  JOB_COORDINATOR: DurableObjectNamespace;

  /** API token for authentication */
  API_TOKEN?: string;
}

/**
 * R2Bucket type stub for environments without Cloudflare Workers types
 */
interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | string): Promise<R2Object>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; cursor?: string }): Promise<R2Objects>;
}

interface R2Object {
  key: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
}

interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
}

/**
 * Queue type stub
 */
interface Queue {
  send(message: unknown): Promise<void>;
  sendBatch(messages: { body: unknown }[]): Promise<void>;
}

/**
 * DurableObjectNamespace type stub
 */
interface DurableObjectNamespace {
  idFromName(name: string): DurableObjectId;
  get(id: DurableObjectId): DurableObjectStub;
}

interface DurableObjectId {
  toString(): string;
}

interface DurableObjectStub {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}

/**
 * Quality presets for Cloudflare Workers
 *
 * Workers have a 128MB memory limit and 30s CPU time limit (paid plan),
 * so presets are tuned accordingly.
 */
export const CLOUDFLARE_QUALITY_PRESETS = {
  draft: {
    memory: 128,
    timeout: 30,
    concurrency: 10,
    framesPerChunk: 30,
  },
  standard: {
    memory: 128,
    timeout: 30,
    concurrency: 20,
    framesPerChunk: 20,
  },
  high: {
    memory: 128,
    timeout: 30,
    concurrency: 50,
    framesPerChunk: 10,
  },
};

/**
 * Worker fetch handler
 *
 * Handles HTTP requests to the Worker for starting render jobs
 * and checking job status.
 */
export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (env.API_TOKEN && authHeader !== `Bearer ${env.API_TOKEN}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const payload = await request.json() as Record<string, unknown>;
      const action = payload.action as string;

      switch (action) {
        case 'start-render':
          return handleStartRender(payload, env);
        case 'get-status':
          return handleGetStatus(payload, env);
        default:
          return new Response(`Unknown action: ${action}`, { status: 400 });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

/**
 * Handle start-render action
 */
async function handleStartRender(
  payload: Record<string, unknown>,
  env: WorkerEnv
): Promise<Response> {
  const jobId = `render-${crypto.randomUUID()}`;
  const template = payload.template;
  const storagePrefix = (payload.storagePrefix as string) || 'rendervid';

  // Upload template to R2
  const templateKey = `${storagePrefix}/jobs/${jobId}/template.json`;
  await env.RENDER_BUCKET.put(templateKey, JSON.stringify(template));

  // Create and upload manifest
  const manifest = {
    jobId,
    template,
    quality: payload.quality || 'standard',
    storagePrefix,
    status: 'queued',
    createdAt: new Date().toISOString(),
    provider: 'cloudflare',
  };

  const manifestKey = `${storagePrefix}/jobs/${jobId}/manifest.json`;
  await env.RENDER_BUCKET.put(manifestKey, JSON.stringify(manifest, null, 2));

  // Notify Durable Object to coordinate the job
  const coordinatorId = env.JOB_COORDINATOR.idFromName(jobId);
  const coordinator = env.JOB_COORDINATOR.get(coordinatorId);

  const coordResponse = await coordinator.fetch(
    new Request('https://coordinator/init', {
      method: 'POST',
      body: JSON.stringify({
        jobId,
        quality: payload.quality || 'standard',
        framesPerChunk: payload.framesPerChunk,
        maxConcurrency: payload.maxConcurrency,
      }),
    })
  );

  const coordResult = await coordResponse.json() as { chunksTotal: number };

  return new Response(
    JSON.stringify({
      jobId,
      chunksTotal: coordResult.chunksTotal,
      status: 'queued',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Handle get-status action
 */
async function handleGetStatus(
  payload: Record<string, unknown>,
  env: WorkerEnv
): Promise<Response> {
  const jobId = payload.jobId as string;
  const storagePrefix = (payload.storagePrefix as string) || 'rendervid';

  // Check for completion marker
  const completeKey = `${storagePrefix}/jobs/${jobId}/complete.json`;
  const completeObj = await env.RENDER_BUCKET.get(completeKey);

  if (completeObj) {
    const completion = JSON.parse(await completeObj.text());
    return new Response(JSON.stringify(completion), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check Durable Object for current status
  const coordinatorId = env.JOB_COORDINATOR.idFromName(jobId);
  const coordinator = env.JOB_COORDINATOR.get(coordinatorId);

  const statusResponse = await coordinator.fetch(
    new Request('https://coordinator/status', { method: 'GET' })
  );

  const status = await statusResponse.json();

  return new Response(JSON.stringify(status), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
