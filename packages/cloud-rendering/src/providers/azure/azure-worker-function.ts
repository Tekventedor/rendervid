/**
 * Azure Worker Function
 *
 * This function renders a chunk of frames for a video.
 * Similar to AWS Lambda worker but runs in Azure Functions.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { chromium } from 'playwright-core';
import type { Browser } from 'playwright-core';
import { readFileSync } from 'fs';
import type { Template } from '@rendervid/core';
import { AzureBlobClient } from './azure-blob-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { encodeChunk, getPresetForQuality, getCRFForQuality } from '../../shared/ffmpeg-encoder';
import { generateRenderHTML, getCloudBrowserArgs } from '../../shared/frame-renderer';
import type { WorkerProgress } from '../../types/job-status';

/**
 * Worker request body
 */
export interface WorkerRequest {
  jobId: string;
  chunkId: number;
  startFrame: number;
  endFrame: number;
  quality: 'draft' | 'standard' | 'high';
  storageAccount: string;
  storageContainer: string;
  storageConnectionString: string;
  storagePrefix: string;
}

/**
 * Worker Azure Function handler
 */
export async function workerHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = (await request.json()) as WorkerRequest;
  const {
    jobId,
    chunkId,
    startFrame,
    endFrame,
    quality,
    storageAccount,
    storageContainer,
    storageConnectionString,
    storagePrefix,
  } = body;

  context.log(`[Worker ${chunkId}] Starting render for frames ${startFrame}-${endFrame}`);

  const startTime = Date.now();

  // Initialize Blob Storage client
  const blobClient = new AzureBlobClient(storageConnectionString, storageContainer, storageAccount);
  const stateManager = new S3StateManager(blobClient, storagePrefix);

  let browser: Browser | null = null;
  const frames: Buffer[] = [];

  try {
    // Update progress: started
    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'started',
      framesRendered: 0,
      totalFrames: endFrame - startFrame + 1,
      timestamp: new Date().toISOString(),
    });

    // Download template
    context.log(`[Worker ${chunkId}] Downloading template...`);
    const template = (await stateManager.downloadTemplate(jobId)) as Template;
    const { width, height } = template.output;
    const fps = template.output.fps;

    if (!width || !height || !fps) {
      throw new Error('Template output must have width, height, and fps');
    }

    // Update progress: rendering
    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'rendering',
      framesRendered: 0,
      totalFrames: endFrame - startFrame + 1,
      timestamp: new Date().toISOString(),
    });

    // Initialize Chromium (from container)
    context.log(`[Worker ${chunkId}] Launching Chromium...`);

    browser = await chromium.launch({
      headless: true,
      args: getCloudBrowserArgs(width, height),
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width, height });

    // Load HTML
    const html = generateRenderHTML(template);
    await page.setContent(html, { waitUntil: 'networkidle' });

    // Inject browser renderer (simplified for Azure)
    await page.addScriptTag({
      content: `window.RENDERVID_READY = true;`,
    });

    context.log(`[Worker ${chunkId}] Rendering ${endFrame - startFrame + 1} frames...`);

    // Render frames
    for (let frame = startFrame; frame <= endFrame; frame++) {
      await page.evaluate(`
        (function(frameNum) {
          if (window.__rendervidRenderFrame) {
            window.__rendervidRenderFrame(frameNum);
          }
        })(${frame})
      `);

      await page.evaluate(`
        new Promise(async (resolve) => {
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
          await new Promise(r => setTimeout(r, 50));
          resolve();
        })
      `);

      const screenshot = await page.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width, height },
      });

      frames.push(screenshot as Buffer);

      if ((frame - startFrame) % 10 === 0) {
        await stateManager.uploadWorkerProgress(jobId, {
          chunkId,
          status: 'rendering',
          framesRendered: frame - startFrame + 1,
          totalFrames: endFrame - startFrame + 1,
          timestamp: new Date().toISOString(),
        });
      }
    }

    context.log(`[Worker ${chunkId}] Captured ${frames.length} frames`);

    await browser.close();
    browser = null;

    // Encode chunk
    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'encoding',
      framesRendered: frames.length,
      totalFrames: endFrame - startFrame + 1,
      timestamp: new Date().toISOString(),
    });

    context.log(`[Worker ${chunkId}] Encoding chunk...`);
    const outputPath = `/tmp/chunk-${chunkId}.mp4`;

    await encodeChunk({
      frames,
      fps,
      outputPath,
      preset: getPresetForQuality(quality),
      crf: getCRFForQuality(quality),
      tempDir: `/tmp/frames-${chunkId}`,
    });

    // Upload chunk
    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'uploading',
      framesRendered: frames.length,
      totalFrames: endFrame - startFrame + 1,
      timestamp: new Date().toISOString(),
    });

    context.log(`[Worker ${chunkId}] Uploading chunk...`);
    const chunkBuffer = readFileSync(outputPath);
    await stateManager.uploadChunk(jobId, chunkId, chunkBuffer);

    // Complete
    const executionTime = Date.now() - startTime;
    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'completed',
      framesRendered: frames.length,
      totalFrames: endFrame - startFrame + 1,
      timestamp: new Date().toISOString(),
      executionTimeMs: executionTime,
    });

    context.log(`[Worker ${chunkId}] Completed in ${executionTime}ms`);

    return {
      status: 200,
      jsonBody: { success: true, chunkId, executionTime },
    };
  } catch (error) {
    context.error(`[Worker ${chunkId}] Error:`, error);

    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'failed',
      framesRendered: frames.length,
      totalFrames: endFrame - startFrame + 1,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });

    return {
      status: 500,
      jsonBody: { success: false, error: error instanceof Error ? error.message : String(error) },
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Register function
app.http('WorkerRenderer', {
  methods: ['POST'],
  authLevel: 'function',
  handler: workerHandler,
});
