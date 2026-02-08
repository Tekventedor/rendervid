import type { ChunkDefinition } from '../types/job-status';
import type { QualityPreset } from '../types/provider-config';

/**
 * Calculate optimal chunk distribution for parallel rendering
 *
 * @param totalFrames - Total number of frames in the video
 * @param preset - Quality preset with framesPerChunk and concurrency limits
 * @param customFramesPerChunk - Optional override for frames per chunk
 * @param customMaxConcurrency - Optional override for max concurrent workers
 * @returns Array of chunk definitions
 */
export function calculateChunks(
  totalFrames: number,
  preset: QualityPreset,
  customFramesPerChunk?: number,
  customMaxConcurrency?: number
): ChunkDefinition[] {
  const framesPerChunk = customFramesPerChunk ?? preset.framesPerChunk;
  const maxConcurrency = customMaxConcurrency ?? preset.concurrency;

  // Calculate number of chunks
  let numChunks = Math.ceil(totalFrames / framesPerChunk);

  // Cap at max concurrency
  if (numChunks > maxConcurrency) {
    numChunks = maxConcurrency;
  }

  // Recalculate frames per chunk to distribute evenly
  const actualFramesPerChunk = Math.ceil(totalFrames / numChunks);

  const chunks: ChunkDefinition[] = [];
  let currentFrame = 0;

  for (let i = 0; i < numChunks; i++) {
    const startFrame = currentFrame;
    const endFrame = Math.min(currentFrame + actualFramesPerChunk - 1, totalFrames - 1);
    const frameCount = endFrame - startFrame + 1;

    chunks.push({
      id: i,
      startFrame,
      endFrame,
      frameCount,
    });

    currentFrame = endFrame + 1;

    // Stop if we've covered all frames
    if (currentFrame >= totalFrames) {
      break;
    }
  }

  return chunks;
}

/**
 * Validate chunk definitions
 *
 * @param chunks - Array of chunk definitions
 * @param totalFrames - Expected total frames
 * @throws Error if chunks are invalid
 */
export function validateChunks(chunks: ChunkDefinition[], totalFrames: number): void {
  if (chunks.length === 0) {
    throw new Error('No chunks generated');
  }

  // Check for gaps or overlaps
  let expectedFrame = 0;
  for (const chunk of chunks) {
    if (chunk.startFrame !== expectedFrame) {
      throw new Error(
        `Chunk ${chunk.id} starts at frame ${chunk.startFrame}, expected ${expectedFrame}`
      );
    }

    if (chunk.endFrame < chunk.startFrame) {
      throw new Error(`Chunk ${chunk.id} has invalid range: ${chunk.startFrame}-${chunk.endFrame}`);
    }

    if (chunk.frameCount !== chunk.endFrame - chunk.startFrame + 1) {
      throw new Error(`Chunk ${chunk.id} has incorrect frameCount`);
    }

    expectedFrame = chunk.endFrame + 1;
  }

  // Check total coverage
  const lastChunk = chunks[chunks.length - 1];
  if (lastChunk.endFrame !== totalFrames - 1) {
    throw new Error(
      `Chunks don't cover all frames. Last chunk ends at ${lastChunk.endFrame}, expected ${totalFrames - 1}`
    );
  }
}

/**
 * Calculate estimated render time based on chunk configuration
 *
 * @param chunks - Array of chunk definitions
 * @param avgTimePerFrame - Average time to render one frame (ms)
 * @returns Estimated total render time in milliseconds
 */
export function estimateRenderTime(chunks: ChunkDefinition[], avgTimePerFrame: number): number {
  // Find the chunk with the most frames (bottleneck)
  const maxFramesInChunk = Math.max(...chunks.map((c) => c.frameCount));

  // Parallel rendering: total time = time for slowest chunk + overhead
  const renderTime = maxFramesInChunk * avgTimePerFrame;
  const overhead = 5000; // 5 seconds for startup, merge, etc.

  return renderTime + overhead;
}
