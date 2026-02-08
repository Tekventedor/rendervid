/**
 * Azure Merger Function
 * Concatenates video chunks into final output
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { AzureBlobClient } from './azure-blob-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { mergeChunks, getVideoDuration } from '../../shared/ffmpeg-merger';
import type { JobCompletion } from '../../types/job-status';

export interface MergerRequest {
  jobId: string;
  storageAccount: string;
  storageContainer: string;
  storageConnectionString: string;
  storagePrefix: string;
}

export async function mergerHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = (await request.json()) as MergerRequest;
  const { jobId, storageAccount, storageContainer, storageConnectionString, storagePrefix } = body;

  context.log(`[Merger] Starting merge for job ${jobId}`);

  const startTime = Date.now();
  const blobClient = new AzureBlobClient(storageConnectionString, storageContainer, storageAccount);
  const stateManager = new S3StateManager(blobClient, storagePrefix);

  const tempDir = `/tmp/merge-${jobId}`;
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  const chunkPaths: string[] = [];

  try {
    const manifest = await stateManager.downloadManifest(jobId);
    const chunkIds = await stateManager.listChunks(jobId);

    if (chunkIds.length !== manifest.chunks.length) {
      throw new Error(`Not all chunks ready: ${chunkIds.length}/${manifest.chunks.length}`);
    }

    context.log('[Merger] Downloading chunks...');
    for (const chunkId of chunkIds) {
      const chunkData = await stateManager.downloadChunk(jobId, chunkId);
      const chunkPath = `${tempDir}/chunk-${chunkId}.mp4`;
      writeFileSync(chunkPath, chunkData);
      chunkPaths.push(chunkPath);
    }

    context.log('[Merger] Concatenating chunks...');
    const outputPath = `${tempDir}/output.mp4`;

    await mergeChunks({
      chunkPaths,
      outputPath,
      tempDir,
    });

    const outputBuffer = readFileSync(outputPath);
    const duration = await getVideoDuration(outputPath);

    context.log('[Merger] Uploading final video...');
    await stateManager.uploadOutput(jobId, outputBuffer);

    const outputUrl = blobClient.getUrl(stateManager.getOutputUrl(jobId));

    const completion: JobCompletion = {
      status: 'completed',
      outputUrl,
      fileSize: outputBuffer.length,
      duration,
      renderTime: Date.now() - startTime,
      chunksRendered: manifest.chunks.length,
      completedAt: new Date().toISOString(),
    };

    await stateManager.uploadCompletion(jobId, completion);

    context.log(`[Merger] Completed in ${completion.renderTime}ms`);

    return {
      status: 200,
      jsonBody: { success: true, outputUrl },
    };
  } catch (error) {
    context.error('[Merger] Error:', error);

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

    return {
      status: 500,
      jsonBody: { success: false, error: error instanceof Error ? error.message : String(error) },
    };
  } finally {
    chunkPaths.forEach((path) => {
      try {
        unlinkSync(path);
      } catch {}
    });
  }
}

app.http('MergerConcat', {
  methods: ['POST'],
  authLevel: 'function',
  handler: mergerHandler,
});
