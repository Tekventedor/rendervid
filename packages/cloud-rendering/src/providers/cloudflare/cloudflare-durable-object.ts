/**
 * Cloudflare Durable Object for Job Coordination
 *
 * Tracks job state and chunk completion across distributed Workers.
 * When all chunks complete, triggers the merge operation.
 *
 * Each render job gets its own Durable Object instance identified by jobId.
 *
 * State:
 * - jobId: string
 * - chunksTotal: number
 * - chunksCompleted: Set<number>
 * - status: 'queued' | 'rendering' | 'merging' | 'completed' | 'failed'
 * - createdAt: string
 */

import type { WorkerRenderRequest, WorkerEnv } from './cloudflare-worker-function';
import { CLOUDFLARE_QUALITY_PRESETS } from './cloudflare-worker-function';

/**
 * Durable Object state interface
 */
interface JobCoordinatorState {
  jobId: string;
  chunksTotal: number;
  chunksCompleted: number[];
  status: 'queued' | 'rendering' | 'merging' | 'completed' | 'failed';
  createdAt: string;
  quality: 'draft' | 'standard' | 'high';
  storagePrefix: string;
}

/**
 * DurableObjectState type stub
 */
interface DurableObjectState {
  storage: DurableObjectStorage;
}

interface DurableObjectStorage {
  get<T>(key: string): Promise<T | undefined>;
  put(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<boolean>;
}

/**
 * Job Coordinator Durable Object
 *
 * Coordinates a render job across multiple Workers:
 * - Initializes job with chunk definitions
 * - Enqueues chunk messages to the Queue
 * - Tracks chunk completion
 * - Triggers merge when all chunks are done
 */
export class JobCoordinator {
  private state: DurableObjectState;
  private env: WorkerEnv;

  constructor(state: DurableObjectState, env: WorkerEnv) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/init':
        return this.handleInit(request);
      case '/chunk-complete':
        return this.handleChunkComplete(request);
      case '/status':
        return this.handleStatus();
      default:
        return new Response('Not found', { status: 404 });
    }
  }

  /**
   * Initialize a new render job
   *
   * Creates chunk definitions and enqueues them to the Queue.
   */
  private async handleInit(request: Request): Promise<Response> {
    const body = await request.json() as {
      jobId: string;
      quality: 'draft' | 'standard' | 'high';
      framesPerChunk?: number;
      maxConcurrency?: number;
    };

    const { jobId, quality = 'standard', framesPerChunk, maxConcurrency } = body;
    const preset = CLOUDFLARE_QUALITY_PRESETS[quality];

    // Calculate chunks (simplified - actual implementation would
    // read totalFrames from the template in R2)
    const effectiveFramesPerChunk = framesPerChunk || preset.framesPerChunk;
    const effectiveConcurrency = maxConcurrency || preset.concurrency;

    // Store job state
    const jobState: JobCoordinatorState = {
      jobId,
      chunksTotal: 0, // Will be set after chunk calculation
      chunksCompleted: [],
      status: 'queued',
      createdAt: new Date().toISOString(),
      quality,
      storagePrefix: 'rendervid',
    };

    // Read manifest from R2 to get total frames
    const manifestKey = `${jobState.storagePrefix}/jobs/${jobId}/manifest.json`;
    const manifestObj = await this.env.RENDER_BUCKET.get(manifestKey);

    if (!manifestObj) {
      return new Response(
        JSON.stringify({ error: 'Manifest not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const manifest = JSON.parse(await manifestObj.text());
    const totalFrames = manifest.totalFrames || 300; // Default 10s at 30fps
    const chunksTotal = Math.ceil(totalFrames / effectiveFramesPerChunk);

    jobState.chunksTotal = Math.min(chunksTotal, effectiveConcurrency);

    await this.state.storage.put('jobState', jobState);

    // Create chunk messages and enqueue them
    const chunkMessages: { body: WorkerRenderRequest }[] = [];
    const actualChunksTotal = jobState.chunksTotal;
    const framesPerWorker = Math.ceil(totalFrames / actualChunksTotal);

    for (let i = 0; i < actualChunksTotal; i++) {
      const startFrame = i * framesPerWorker;
      const endFrame = Math.min(startFrame + framesPerWorker - 1, totalFrames - 1);

      chunkMessages.push({
        body: {
          jobId,
          chunkId: i,
          startFrame,
          endFrame,
          quality,
          r2Bucket: '',
          storagePrefix: jobState.storagePrefix,
        },
      });
    }

    // Send batch to Queue
    await this.env.RENDER_QUEUE.sendBatch(chunkMessages);

    // Update status to rendering
    jobState.status = 'rendering';
    await this.state.storage.put('jobState', jobState);

    return new Response(
      JSON.stringify({ chunksTotal: actualChunksTotal }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  /**
   * Handle chunk completion notification from a Worker
   */
  private async handleChunkComplete(request: Request): Promise<Response> {
    const body = await request.json() as { chunkId: number; executionTimeMs: number };
    const { chunkId } = body;

    const jobState = await this.state.storage.get<JobCoordinatorState>('jobState');

    if (!jobState) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Track completed chunk
    if (!jobState.chunksCompleted.includes(chunkId)) {
      jobState.chunksCompleted.push(chunkId);
    }

    // Check if all chunks are complete
    if (jobState.chunksCompleted.length === jobState.chunksTotal) {
      console.log(`[Coordinator] All ${jobState.chunksTotal} chunks complete for ${jobState.jobId}`);
      jobState.status = 'merging';
      await this.state.storage.put('jobState', jobState);

      // Trigger merge via a Worker request
      await this.triggerMerge(jobState);
    } else {
      await this.state.storage.put('jobState', jobState);
    }

    return new Response(
      JSON.stringify({
        chunksCompleted: jobState.chunksCompleted.length,
        chunksTotal: jobState.chunksTotal,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  /**
   * Get current job status
   */
  private async handleStatus(): Promise<Response> {
    const jobState = await this.state.storage.get<JobCoordinatorState>('jobState');

    if (!jobState) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const progress = jobState.chunksTotal > 0
      ? (jobState.chunksCompleted.length / jobState.chunksTotal) * 90
      : 0;

    return new Response(
      JSON.stringify({
        jobId: jobState.jobId,
        status: jobState.status,
        progress,
        chunksCompleted: jobState.chunksCompleted.length,
        chunksTotal: jobState.chunksTotal,
        createdAt: jobState.createdAt,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  /**
   * Trigger merge operation
   *
   * Sends a merge request to the Worker which will download all chunks
   * from R2, concatenate them, and upload the final video.
   */
  private async triggerMerge(jobState: JobCoordinatorState): Promise<void> {
    // Enqueue a merge message
    await this.env.RENDER_QUEUE.send({
      action: 'merge',
      jobId: jobState.jobId,
      chunksTotal: jobState.chunksTotal,
      storagePrefix: jobState.storagePrefix,
      quality: jobState.quality,
    });
  }
}
