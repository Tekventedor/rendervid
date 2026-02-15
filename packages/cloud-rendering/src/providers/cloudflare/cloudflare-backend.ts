import { writeFileSync } from 'fs';
import type { CloudBackend } from '../../core/cloud-backend.interface';
import type { RenderOptions, RenderResult } from '../../types/render-options';
import type { JobStatus } from '../../types/job-status';
import type { CloudflareConfig } from '../../types/provider-config';
import { CloudflareR2Client } from './cloudflare-r2-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { pollJobUntilComplete } from '../../core/job-poller';

/**
 * Cloudflare Workers backend implementation
 *
 * Uses Cloudflare Workers for distributed rendering with R2 for state management.
 *
 * Architecture:
 * - Workers: Render individual chunks in parallel
 * - Queues: Distribute chunk rendering work
 * - Durable Objects: Coordinate job state and trigger merging
 * - R2: Stores templates, chunks, progress, and output
 */
export class CloudflareBackend implements CloudBackend {
  readonly name = 'Cloudflare Workers';
  readonly provider = 'cloudflare' as const;

  private r2Client: CloudflareR2Client;
  private stateManager: S3StateManager;
  private config: CloudflareConfig;

  constructor(config: CloudflareConfig) {
    this.config = config;

    // Initialize R2 client using S3-compatible API
    this.r2Client = new CloudflareR2Client(
      config.accountId,
      config.r2Bucket,
      config.r2AccessKeyId && config.r2SecretAccessKey
        ? {
            accessKeyId: config.r2AccessKeyId,
            secretAccessKey: config.r2SecretAccessKey,
          }
        : undefined,
      config.r2Endpoint
    );

    this.stateManager = new S3StateManager(
      this.r2Client,
      config.storagePrefix || 'rendervid'
    );
  }

  /**
   * Render video synchronously (wait for completion)
   */
  async renderVideo(options: RenderOptions): Promise<RenderResult> {
    const startTime = Date.now();

    // Start async render
    const jobId = await this.startRenderAsync(options);

    console.log(`[Cloudflare] Job started: ${jobId}`);
    console.log('[Cloudflare] Polling for completion...');

    // Poll until complete
    const finalStatus = await pollJobUntilComplete(
      () => this.getJobStatus(jobId),
      {
        intervalMs: 5000,
        timeoutMs: 3600000, // 1 hour
        onProgress: (status) => {
          console.log(
            `[Cloudflare] Progress: ${status.progress.toFixed(1)}% (${status.chunksCompleted}/${status.chunksTotal} chunks)`
          );
        },
      }
    );

    const renderTime = Date.now() - startTime;

    // Download to local if requested
    let localPath: string | undefined;
    if (options.downloadToLocal && options.outputPath && finalStatus.storageUrl) {
      console.log(`[Cloudflare] Downloading to ${options.outputPath}...`);
      await this.downloadVideo(finalStatus.storageUrl, options.outputPath);
      localPath = options.outputPath;
    }

    // Get completion data for metadata
    const completion = await this.stateManager.downloadCompletion(jobId);

    return {
      success: true,
      jobId,
      storageUrl: finalStatus.storageUrl!,
      localPath,
      duration: completion?.duration || 0,
      fileSize: completion?.fileSize || 0,
      renderTime,
      chunksRendered: finalStatus.chunksTotal,
    };
  }

  /**
   * Start async render job via Cloudflare Workers API
   *
   * Sends a render request to the coordinator Worker, which:
   * 1. Validates the template
   * 2. Uploads template to R2
   * 3. Calculates chunks
   * 4. Enqueues chunk messages to Cloudflare Queue
   * 5. Returns job ID
   */
  async startRenderAsync(options: RenderOptions): Promise<string> {
    const { template, inputs, quality = 'standard', framesPerChunk, maxConcurrency } = options;

    const workerName = this.config.workerName || 'rendervid-worker';
    const workerUrl = `https://${workerName}.${this.config.accountId}.workers.dev`;

    const payload = {
      action: 'start-render',
      template,
      inputs,
      quality,
      framesPerChunk,
      maxConcurrency,
      r2Bucket: this.config.r2Bucket,
      storagePrefix: this.config.storagePrefix || 'rendervid',
      queueName: this.config.queueName || 'rendervid-chunks',
      durableObjectNamespace: this.config.durableObjectNamespace,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiToken) {
      headers['Authorization'] = `Bearer ${this.config.apiToken}`;
    }

    const response = await fetch(workerUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Worker request failed (${response.status}): ${errorText}`);
    }

    const result = await response.json() as { jobId: string; chunksTotal: number };

    if (!result.jobId) {
      throw new Error('Worker returned no job ID');
    }

    return result.jobId;
  }

  /**
   * Get job status by reading R2 state
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.stateManager.getJobStatus(jobId);
  }

  /**
   * Cancel job and clean up R2 resources
   */
  async cancelJob(jobId: string): Promise<void> {
    console.log(`[Cloudflare] Cancelling job: ${jobId}`);
    await this.stateManager.deleteJob(jobId);
  }

  /**
   * Download video from R2 to local file
   */
  async downloadVideo(storageUrl: string, localPath: string): Promise<void> {
    // Parse R2 URL: r2://bucket/key or just the key
    const key = storageUrl.replace(`r2://${this.config.r2Bucket}/`, '');

    const data = await this.r2Client.download(key);
    writeFileSync(localPath, data);
  }

  /**
   * Get the underlying R2 client
   */
  getR2Client(): CloudflareR2Client {
    return this.r2Client;
  }
}
