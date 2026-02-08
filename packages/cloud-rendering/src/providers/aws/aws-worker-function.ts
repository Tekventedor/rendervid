/**
 * AWS Lambda Worker Function
 *
 * This function renders a chunk of frames for a video.
 * It is invoked by the Main function in parallel for each chunk.
 *
 * Architecture:
 * 1. Download template from S3
 * 2. Initialize Chromium from Lambda layer
 * 3. Render frames [startFrame...endFrame]
 * 4. Encode chunk with FFmpeg
 * 5. Upload chunk to S3
 * 6. Write progress to S3
 */

import { chromium } from 'playwright-core';
import type { Browser, Page } from 'playwright-core';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Template } from '@rendervid/core';
import { AWSS3Client } from './aws-s3-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { encodeChunk, getPresetForQuality, getCRFForQuality } from '../../shared/ffmpeg-encoder';
import { generateRenderHTML, getCloudBrowserArgs } from '../../shared/frame-renderer';
import type { WorkerProgress } from '../../types/job-status';

/**
 * Worker Lambda event
 */
export interface WorkerEvent {
  jobId: string;
  chunkId: number;
  startFrame: number;
  endFrame: number;
  quality: 'draft' | 'standard' | 'high';
  s3Bucket: string;
  s3Prefix: string;
  region: string;
}

/**
 * Worker Lambda handler
 */
export async function handler(event: WorkerEvent): Promise<void> {
  const { jobId, chunkId, startFrame, endFrame, quality, s3Bucket, s3Prefix, region } = event;

  console.log(`[Worker ${chunkId}] Starting render for frames ${startFrame}-${endFrame}`);

  const startTime = Date.now();

  // Initialize S3 client and state manager
  const s3Client = new AWSS3Client(region, s3Bucket);
  const stateManager = new S3StateManager(s3Client, s3Prefix);

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

    // Download template from S3
    console.log(`[Worker ${chunkId}] Downloading template...`);
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

    // Initialize Chromium from Lambda layer
    console.log(`[Worker ${chunkId}] Launching Chromium...`);
    const chromiumPath = '/opt/chromium/chromium'; // From Lambda layer

    browser = await chromium.launch({
      headless: true,
      executablePath: chromiumPath,
      args: getCloudBrowserArgs(width, height),
    });

    const page = await browser.newPage();

    // Set up page
    await page.setViewportSize({ width, height });

    // Generate and load HTML
    const html = generateRenderHTML(template);
    await page.setContent(html, { waitUntil: 'networkidle' });

    // Inject browser renderer
    await injectBrowserRenderer(page);

    // Wait for renderer to be ready
    await page.waitForFunction('window.RENDERVID_READY === true', { timeout: 10000 });

    console.log(`[Worker ${chunkId}] Rendering ${endFrame - startFrame + 1} frames...`);

    // Render frames
    for (let frame = startFrame; frame <= endFrame; frame++) {
      // Render frame
      await page.evaluate(`
        (function(frameNum) {
          if (window.__rendervidRenderFrame) {
            window.__rendervidRenderFrame(frameNum);
          }
        })(${frame})
      `);

      // Wait for rendering
      await page.evaluate(`
        new Promise(async (resolve) => {
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
          await new Promise(r => setTimeout(r, 50));
          resolve();
        })
      `);

      // Capture screenshot
      const screenshot = await page.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width, height },
      });

      frames.push(screenshot as Buffer);

      // Update progress periodically (every 10 frames)
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

    console.log(`[Worker ${chunkId}] Captured ${frames.length} frames`);

    // Close browser
    await browser.close();
    browser = null;

    // Update progress: encoding
    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'encoding',
      framesRendered: frames.length,
      totalFrames: endFrame - startFrame + 1,
      timestamp: new Date().toISOString(),
    });

    // Encode chunk with FFmpeg
    console.log(`[Worker ${chunkId}] Encoding chunk...`);
    const outputPath = `/tmp/chunk-${chunkId}.mp4`;

    await encodeChunk({
      frames,
      fps,
      outputPath,
      preset: getPresetForQuality(quality),
      crf: getCRFForQuality(quality),
      ffmpegPath: '/opt/bin/ffmpeg', // From Lambda layer
      tempDir: `/tmp/frames-${chunkId}`,
    });

    console.log(`[Worker ${chunkId}] Chunk encoded: ${outputPath}`);

    // Update progress: uploading
    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'uploading',
      framesRendered: frames.length,
      totalFrames: endFrame - startFrame + 1,
      timestamp: new Date().toISOString(),
    });

    // Upload chunk to S3
    console.log(`[Worker ${chunkId}] Uploading chunk to S3...`);
    const chunkBuffer = readFileSync(outputPath);
    await stateManager.uploadChunk(jobId, chunkId, chunkBuffer);

    // Update progress: completed
    const executionTime = Date.now() - startTime;
    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'completed',
      framesRendered: frames.length,
      totalFrames: endFrame - startFrame + 1,
      timestamp: new Date().toISOString(),
      executionTimeMs: executionTime,
    });

    console.log(`[Worker ${chunkId}] Completed in ${executionTime}ms`);
  } catch (error) {
    console.error(`[Worker ${chunkId}] Error:`, error);

    // Update progress: failed
    await stateManager.uploadWorkerProgress(jobId, {
      chunkId,
      status: 'failed',
      framesRendered: frames.length,
      totalFrames: endFrame - startFrame + 1,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });

    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Inject browser renderer bundle into page
 */
async function injectBrowserRenderer(page: Page): Promise<void> {
  try {
    // Try to load from Lambda layer or built-in location
    const possiblePaths = [
      '/opt/nodejs/browser-renderer.global.js',
      join(__dirname, 'browser-renderer.global.js'),
    ];

    let rendererCode: string | null = null;

    for (const bundlePath of possiblePaths) {
      try {
        rendererCode = readFileSync(bundlePath, 'utf-8');
        break;
      } catch {
        continue;
      }
    }

    if (!rendererCode) {
      throw new Error('Browser renderer bundle not found');
    }

    await page.addScriptTag({ content: rendererCode });
  } catch (error) {
    throw new Error(
      `Failed to load browser renderer: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Extend window type for TypeScript
declare global {
  interface Window {
    __rendervidRenderFrame?: (frame: number) => void;
    RENDERVID_READY?: boolean;
  }
}
