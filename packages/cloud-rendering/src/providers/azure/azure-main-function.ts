/**
 * Azure Main Function (Coordinator)
 * Similar to AWS Main but uses Azure Functions HTTP triggers
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { v4 as uuidv4 } from 'uuid';
import type { Template } from '@rendervid/core';
import { AzureBlobClient } from './azure-blob-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { calculateChunks, validateChunks } from '../../core/chunking-algorithm';
import { validateTemplate, calculateTotalFrames } from '../../shared/frame-renderer';
import type { JobManifest } from '../../types/job-status';

const AZURE_QUALITY_PRESETS = {
  draft: { memory: 4096, timeout: 300, concurrency: 10, framesPerChunk: 50 },
  standard: { memory: 8192, timeout: 600, concurrency: 20, framesPerChunk: 30 },
  high: { memory: 16384, timeout: 900, concurrency: 50, framesPerChunk: 20 },
};

export interface MainRequest {
  template: Template;
  inputs?: Record<string, unknown>;
  quality?: 'draft' | 'standard' | 'high';
  storageAccount: string;
  storageContainer: string;
  storageConnectionString: string;
  storagePrefix: string;
  workerFunctionUrl: string;
}

export async function mainHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = (await request.json()) as MainRequest;
  const { template, quality = 'standard', storageAccount, storageContainer, storageConnectionString, storagePrefix, workerFunctionUrl } = body;

  context.log('[Main] Starting render job...');

  const jobId = `render-${uuidv4()}`;
  context.log(`[Main] Job ID: ${jobId}`);

  const blobClient = new AzureBlobClient(storageConnectionString, storageContainer, storageAccount);
  const stateManager = new S3StateManager(blobClient, storagePrefix);

  try {
    const validation = validateTemplate(template);
    if (!validation.valid) {
      throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
    }

    const totalFrames = calculateTotalFrames(template);
    const fps = template.output.fps!;
    const preset = AZURE_QUALITY_PRESETS[quality];
    const chunks = calculateChunks(totalFrames, preset);
    validateChunks(chunks, totalFrames);

    await stateManager.uploadTemplate(jobId, template);

    const manifest: JobManifest = {
      jobId,
      totalFrames,
      fps,
      chunks,
      status: 'rendering',
      createdAt: new Date().toISOString(),
      validatedAt: new Date().toISOString(),
      quality,
      provider: 'azure',
    };

    await stateManager.uploadManifest(jobId, manifest);

    // Invoke workers via HTTP (Azure Functions HTTP trigger)
    const workerInvocations = chunks.map((chunk) =>
      fetch(workerFunctionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          chunkId: chunk.id,
          startFrame: chunk.startFrame,
          endFrame: chunk.endFrame,
          quality,
          storageAccount,
          storageContainer,
          storageConnectionString,
          storagePrefix,
        }),
      })
    );

    await Promise.all(workerInvocations);

    context.log('[Main] Workers invoked successfully');

    return {
      status: 200,
      jsonBody: { jobId, totalFrames, chunksTotal: chunks.length, status: 'queued' },
    };
  } catch (error) {
    context.error('[Main] Error:', error);
    return {
      status: 500,
      jsonBody: { error: error instanceof Error ? error.message : String(error) },
    };
  }
}

app.http('MainCoordinator', {
  methods: ['POST'],
  authLevel: 'function',
  handler: mainHandler,
});
