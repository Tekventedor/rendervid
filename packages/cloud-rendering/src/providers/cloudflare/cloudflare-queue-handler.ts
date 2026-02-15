/**
 * Cloudflare Queue Consumer for Chunk Distribution
 *
 * Processes queue messages for render jobs, distributing
 * chunk rendering work across Workers.
 *
 * Architecture:
 * 1. Receive batch of chunk render messages from Queue
 * 2. For each chunk: download template, render frames, encode, upload
 * 3. Notify Durable Object of chunk completion
 * 4. Durable Object triggers merge when all chunks complete
 */

import type { WorkerRenderRequest, WorkerRenderResponse, WorkerEnv } from './cloudflare-worker-function';

/**
 * Queue message batch
 */
interface MessageBatch {
  messages: QueueMessage[];
  ackAll(): void;
  retryAll(): void;
}

interface QueueMessage {
  id: string;
  body: WorkerRenderRequest;
  ack(): void;
  retry(): void;
}

/**
 * Queue consumer handler
 *
 * Processes render chunk messages from the Cloudflare Queue.
 * Each message represents a chunk of frames to render.
 */
export async function queue(
  batch: MessageBatch,
  env: WorkerEnv
): Promise<void> {
  for (const message of batch.messages) {
    try {
      const result = await processChunk(message.body, env);

      if (result.status === 'completed') {
        message.ack();
      } else {
        console.error(`[Queue] Chunk ${message.body.chunkId} failed: ${result.error}`);
        message.retry();
      }
    } catch (error) {
      console.error(`[Queue] Error processing chunk ${message.body.chunkId}:`, error);
      message.retry();
    }
  }
}

/**
 * Process a single render chunk
 */
async function processChunk(
  request: WorkerRenderRequest,
  env: WorkerEnv
): Promise<WorkerRenderResponse> {
  const { jobId, chunkId, startFrame, endFrame, quality, storagePrefix } = request;
  const startTime = Date.now();

  console.log(`[Worker ${chunkId}] Starting render for frames ${startFrame}-${endFrame}`);

  try {
    // Update progress: started
    const progressKey = `${storagePrefix}/jobs/${jobId}/progress/worker-${chunkId}.json`;
    await env.RENDER_BUCKET.put(
      progressKey,
      JSON.stringify({
        chunkId,
        status: 'started',
        framesRendered: 0,
        totalFrames: endFrame - startFrame + 1,
        timestamp: new Date().toISOString(),
      })
    );

    // Download template from R2
    const templateKey = `${storagePrefix}/jobs/${jobId}/template.json`;
    const templateObj = await env.RENDER_BUCKET.get(templateKey);

    if (!templateObj) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    const template = JSON.parse(await templateObj.text());

    // Update progress: rendering
    await env.RENDER_BUCKET.put(
      progressKey,
      JSON.stringify({
        chunkId,
        status: 'rendering',
        framesRendered: 0,
        totalFrames: endFrame - startFrame + 1,
        timestamp: new Date().toISOString(),
      })
    );

    // Render frames
    // Note: In a real Worker deployment, this would use a WASM-based
    // renderer since Workers don't have access to headless browsers.
    // The actual rendering logic would be injected at deploy time.
    const totalFrames = endFrame - startFrame + 1;

    // Simulate frame rendering (actual implementation depends on
    // the rendering strategy - could use Canvas API, WASM, or
    // offload to a browser-based rendering service)
    const frameBuffers: ArrayBuffer[] = [];
    for (let frame = startFrame; frame <= endFrame; frame++) {
      // Each frame would be rendered here
      // For now, this is a placeholder for the rendering pipeline
      frameBuffers.push(new ArrayBuffer(0));

      // Update progress periodically
      if ((frame - startFrame) % 10 === 0) {
        await env.RENDER_BUCKET.put(
          progressKey,
          JSON.stringify({
            chunkId,
            status: 'rendering',
            framesRendered: frame - startFrame + 1,
            totalFrames,
            timestamp: new Date().toISOString(),
          })
        );
      }
    }

    // Update progress: encoding
    await env.RENDER_BUCKET.put(
      progressKey,
      JSON.stringify({
        chunkId,
        status: 'encoding',
        framesRendered: totalFrames,
        totalFrames,
        timestamp: new Date().toISOString(),
      })
    );

    // Encode and upload chunk
    // Note: Encoding would use FFmpeg WASM or be delegated
    // to a service that handles video encoding
    const chunkKey = `${storagePrefix}/jobs/${jobId}/chunks/chunk-${chunkId}.mp4`;
    await env.RENDER_BUCKET.put(chunkKey, new ArrayBuffer(0));

    const executionTime = Date.now() - startTime;

    // Update progress: completed
    await env.RENDER_BUCKET.put(
      progressKey,
      JSON.stringify({
        chunkId,
        status: 'completed',
        framesRendered: totalFrames,
        totalFrames,
        timestamp: new Date().toISOString(),
        executionTimeMs: executionTime,
      })
    );

    // Notify Durable Object of chunk completion
    const coordinatorId = env.JOB_COORDINATOR.idFromName(jobId);
    const coordinator = env.JOB_COORDINATOR.get(coordinatorId);

    await coordinator.fetch(
      new Request('https://coordinator/chunk-complete', {
        method: 'POST',
        body: JSON.stringify({ chunkId, executionTimeMs: executionTime }),
      })
    );

    console.log(`[Worker ${chunkId}] Completed in ${executionTime}ms`);

    return {
      jobId,
      chunkId,
      status: 'completed',
      framesRendered: totalFrames,
      executionTimeMs: executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error(`[Worker ${chunkId}] Error:`, error);

    // Update progress: failed
    const progressKey = `${storagePrefix}/jobs/${jobId}/progress/worker-${chunkId}.json`;
    await env.RENDER_BUCKET.put(
      progressKey,
      JSON.stringify({
        chunkId,
        status: 'failed',
        framesRendered: 0,
        totalFrames: endFrame - startFrame + 1,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      })
    );

    return {
      jobId,
      chunkId,
      status: 'failed',
      framesRendered: 0,
      executionTimeMs: executionTime,
      error: errorMessage,
    };
  }
}
