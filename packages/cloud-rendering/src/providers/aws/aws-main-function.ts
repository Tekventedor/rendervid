/**
 * AWS Lambda Main Function (Coordinator)
 *
 * This function orchestrates the distributed rendering process:
 * 1. Validate template (fail fast)
 * 2. Upload template to S3
 * 3. Calculate chunks based on quality preset
 * 4. Create job manifest in S3
 * 5. Invoke N worker Lambda functions in parallel
 * 6. Return job ID immediately
 *
 * The merger function will be triggered when all workers complete.
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { chromium } from 'playwright-core';
import { v4 as uuidv4 } from 'uuid';
import type { Template } from '@rendervid/core';
import { AWSS3Client } from './aws-s3-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { calculateChunks, validateChunks } from '../../core/chunking-algorithm';
import { validateTemplate, calculateTotalFrames } from '../../shared/frame-renderer';
import type { JobManifest } from '../../types/job-status';
import type { WorkerEvent } from './aws-worker-function';

/**
 * Quality presets for AWS Lambda
 */
const AWS_QUALITY_PRESETS = {
  draft: {
    memory: 3008,
    timeout: 300,
    concurrency: 10,
    framesPerChunk: 50,
  },
  standard: {
    memory: 5120,
    timeout: 600,
    concurrency: 20,
    framesPerChunk: 30,
  },
  high: {
    memory: 10240,
    timeout: 900,
    concurrency: 50,
    framesPerChunk: 20,
  },
};

/**
 * Main Lambda event
 */
export interface MainEvent {
  template: Template;
  inputs?: Record<string, unknown>;
  quality?: 'draft' | 'standard' | 'high';
  framesPerChunk?: number;
  maxConcurrency?: number;
  s3Bucket: string;
  s3Prefix: string;
  region: string;
  workerFunctionName: string;
}

/**
 * Main Lambda response
 */
export interface MainResponse {
  jobId: string;
  totalFrames: number;
  chunksTotal: number;
  status: 'validating' | 'queued';
}

/**
 * Main Lambda handler
 */
export async function handler(event: MainEvent): Promise<MainResponse> {
  const {
    template,
    inputs = {},
    quality = 'standard',
    framesPerChunk,
    maxConcurrency,
    s3Bucket,
    s3Prefix,
    region,
    workerFunctionName,
  } = event;

  console.log('[Main] Starting render job...');
  console.log(`[Main] Quality: ${quality}`);

  const startTime = Date.now();

  // Generate unique job ID
  const jobId = `render-${uuidv4()}`;
  console.log(`[Main] Job ID: ${jobId}`);

  // Initialize S3 client and state manager
  const s3Client = new AWSS3Client(region, s3Bucket);
  const stateManager = new S3StateManager(s3Client, s3Prefix);

  try {
    // CRITICAL: Validate template first (fail fast)
    console.log('[Main] Validating template...');
    const validation = validateTemplate(template);

    if (!validation.valid) {
      const errorMsg = `Invalid template: ${validation.errors.join(', ')}`;
      console.error('[Main]', errorMsg);
      throw new Error(errorMsg);
    }

    // Dry-run template build in headless browser
    console.log('[Main] Testing template build...');
    await validateTemplateBuild(template);

    console.log('[Main] ✓ Template validation passed');

    // Calculate total frames
    const totalFrames = calculateTotalFrames(template);
    const fps = template.output.fps;

    if (!fps) {
      throw new Error('Template output.fps is required');
    }

    console.log(`[Main] Total frames: ${totalFrames} (${totalFrames / fps}s at ${fps}fps)`);

    // Get quality preset
    const preset = AWS_QUALITY_PRESETS[quality];

    // Calculate chunks
    const chunks = calculateChunks(totalFrames, preset, framesPerChunk, maxConcurrency);
    validateChunks(chunks, totalFrames);

    console.log(`[Main] Chunks: ${chunks.length} (${chunks[0].frameCount} frames each)`);

    // Upload template to S3
    console.log('[Main] Uploading template to S3...');
    await stateManager.uploadTemplate(jobId, template);

    // Create job manifest
    const manifest: JobManifest = {
      jobId,
      totalFrames,
      fps,
      chunks,
      status: 'validating',
      createdAt: new Date().toISOString(),
      validatedAt: new Date().toISOString(),
      quality,
      provider: 'aws',
    };

    await stateManager.uploadManifest(jobId, manifest);

    console.log('[Main] Job manifest created');

    // Invoke worker Lambda functions in parallel
    console.log(`[Main] Invoking ${chunks.length} worker functions...`);

    const lambdaClient = new LambdaClient({ region });

    const workerInvocations = chunks.map((chunk) => {
      const workerEvent: WorkerEvent = {
        jobId,
        chunkId: chunk.id,
        startFrame: chunk.startFrame,
        endFrame: chunk.endFrame,
        quality,
        s3Bucket,
        s3Prefix,
        region,
      };

      return lambdaClient.send(
        new InvokeCommand({
          FunctionName: workerFunctionName,
          InvocationType: 'Event', // Async invocation
          Payload: Buffer.from(JSON.stringify(workerEvent)),
        })
      );
    });

    // Fire all workers in parallel
    await Promise.all(workerInvocations);

    // Update manifest status to 'queued'
    manifest.status = 'rendering';
    await stateManager.uploadManifest(jobId, manifest);

    const executionTime = Date.now() - startTime;
    console.log(`[Main] Workers invoked successfully in ${executionTime}ms`);

    return {
      jobId,
      totalFrames,
      chunksTotal: chunks.length,
      status: 'queued',
    };
  } catch (error) {
    console.error('[Main] Error:', error);
    throw error;
  }
}

/**
 * Validate template build in headless browser (fail fast)
 */
async function validateTemplateBuild(template: Template): Promise<void> {
  let browser = null;

  try {
    const chromiumPath = '/opt/chromium/chromium'; // From Lambda layer

    browser = await chromium.launch({
      headless: true,
      executablePath: chromiumPath,
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();

    // Try to render frame 0
    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <div id="root"></div>
          <script>
            window.RENDERVID_TEMPLATE = ${JSON.stringify(template)};
            window.RENDERVID_READY = false;
          </script>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle', timeout: 5000 });

    // If we get here without errors, template builds successfully
    await browser.close();
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw new Error(`Template build failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
