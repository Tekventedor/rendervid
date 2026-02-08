/**
 * AWS Lambda Merger Function
 *
 * This function is triggered when all worker chunks are complete.
 * It concatenates the chunks into a final video.
 *
 * Architecture:
 * 1. Download all chunks from S3
 * 2. Concatenate with FFmpeg (copy codec, no re-encoding)
 * 3. Upload final video to S3
 * 4. Write completion marker
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { AWSS3Client } from './aws-s3-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { mergeChunks, getVideoDuration } from '../../shared/ffmpeg-merger';
import type { JobCompletion } from '../../types/job-status';

/**
 * Merger Lambda event
 */
export interface MergerEvent {
  jobId: string;
  s3Bucket: string;
  s3Prefix: string;
  region: string;
}

/**
 * Merger Lambda handler
 */
export async function handler(event: MergerEvent): Promise<void> {
  const { jobId, s3Bucket, s3Prefix, region } = event;

  console.log(`[Merger] Starting merge for job ${jobId}`);

  const startTime = Date.now();

  // Initialize S3 client and state manager
  const s3Client = new AWSS3Client(region, s3Bucket);
  const stateManager = new S3StateManager(s3Client, s3Prefix);

  // Create temp directory
  const tempDir = `/tmp/merge-${jobId}`;
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  const chunkPaths: string[] = [];

  try {
    // Get manifest
    console.log('[Merger] Loading manifest...');
    const manifest = await stateManager.downloadManifest(jobId);

    // Check if all chunks are uploaded
    const chunkIds = await stateManager.listChunks(jobId);
    console.log(`[Merger] Found ${chunkIds.length}/${manifest.chunks.length} chunks`);

    if (chunkIds.length !== manifest.chunks.length) {
      throw new Error(
        `Not all chunks are ready. Expected ${manifest.chunks.length}, found ${chunkIds.length}`
      );
    }

    // Download all chunks from S3
    console.log('[Merger] Downloading chunks...');
    for (const chunkId of chunkIds) {
      const chunkData = await stateManager.downloadChunk(jobId, chunkId);
      const chunkPath = `${tempDir}/chunk-${chunkId}.mp4`;
      writeFileSync(chunkPath, chunkData);
      chunkPaths.push(chunkPath);
      console.log(`[Merger] Downloaded chunk ${chunkId} (${(chunkData.length / 1024 / 1024).toFixed(2)} MB)`);
    }

    // Concatenate chunks with FFmpeg
    console.log('[Merger] Concatenating chunks...');
    const outputPath = `${tempDir}/output.mp4`;

    await mergeChunks({
      chunkPaths,
      outputPath,
      ffmpegPath: '/opt/bin/ffmpeg', // From Lambda layer
      tempDir,
    });

    console.log(`[Merger] Concatenation complete: ${outputPath}`);

    // Get video metadata
    const outputBuffer = readFileSync(outputPath);
    const duration = await getVideoDuration(outputPath, '/opt/bin/ffprobe');

    console.log(`[Merger] Final video: ${(outputBuffer.length / 1024 / 1024).toFixed(2)} MB, ${duration}s`);

    // Upload final video to S3
    console.log('[Merger] Uploading final video to S3...');
    await stateManager.uploadOutput(jobId, outputBuffer);

    const outputUrl = s3Client.getUrl(stateManager.getOutputUrl(jobId));

    // Write completion marker
    const executionTime = Date.now() - startTime;
    const completion: JobCompletion = {
      status: 'completed',
      outputUrl,
      fileSize: outputBuffer.length,
      duration,
      renderTime: executionTime,
      chunksRendered: manifest.chunks.length,
      completedAt: new Date().toISOString(),
    };

    await stateManager.uploadCompletion(jobId, completion);

    console.log(`[Merger] Job completed in ${executionTime}ms`);
    console.log(`[Merger] Output URL: ${outputUrl}`);
  } catch (error) {
    console.error('[Merger] Error:', error);

    // Write failure completion marker
    const completion: JobCompletion = {
      status: 'failed',
      outputUrl: '',
      fileSize: 0,
      duration: 0,
      renderTime: Date.now() - startTime,
      chunksRendered: 0,
      completedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    };

    await stateManager.uploadCompletion(jobId, completion);

    throw error;
  } finally {
    // Clean up temp files
    for (const chunkPath of chunkPaths) {
      try {
        unlinkSync(chunkPath);
      } catch {
        // Ignore cleanup errors
      }
    }

    try {
      unlinkSync(`${tempDir}/output.mp4`);
    } catch {
      // Ignore cleanup errors
    }
  }
}
