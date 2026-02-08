import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { writeFileSync } from 'fs';
import type { CloudBackend } from '../../core/cloud-backend.interface';
import type { RenderOptions, RenderResult } from '../../types/render-options';
import type { JobStatus } from '../../types/job-status';
import type { AWSConfig } from '../../types/provider-config';
import { AWSS3Client } from './aws-s3-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { pollJobUntilComplete } from '../../core/job-poller';
import type { MainEvent, MainResponse } from './aws-main-function';
import type { MergerEvent } from './aws-merger-function';

/**
 * AWS Lambda backend implementation
 *
 * Uses AWS Lambda for distributed rendering with S3 for state management.
 *
 * Architecture:
 * - Main Lambda: Coordinates the render job
 * - Worker Lambdas: Render individual chunks in parallel
 * - Merger Lambda: Concatenates chunks into final video
 * - S3: Stores templates, chunks, progress, and output
 */
export class AWSBackend implements CloudBackend {
  readonly name = 'AWS Lambda';
  readonly provider = 'aws' as const;

  private lambdaClient: LambdaClient;
  private s3Client: AWSS3Client;
  private stateManager: S3StateManager;

  constructor(private config: AWSConfig) {
    // Initialize AWS SDK clients
    this.lambdaClient = new LambdaClient({
      region: config.region,
      credentials: config.credentials,
    });

    this.s3Client = new AWSS3Client(
      config.region,
      config.s3Bucket,
      config.credentials
    );

    this.stateManager = new S3StateManager(
      this.s3Client,
      config.s3Prefix || 'rendervid'
    );
  }

  /**
   * Render video synchronously (wait for completion)
   */
  async renderVideo(options: RenderOptions): Promise<RenderResult> {
    const startTime = Date.now();

    // Start async render
    const jobId = await this.startRenderAsync(options);

    console.log(`[AWS] Job started: ${jobId}`);
    console.log('[AWS] Polling for completion...');

    // Poll until complete
    const finalStatus = await pollJobUntilComplete(
      () => this.getJobStatus(jobId),
      {
        intervalMs: 5000,
        timeoutMs: 3600000, // 1 hour
        onProgress: (status) => {
          console.log(
            `[AWS] Progress: ${status.progress.toFixed(1)}% (${status.chunksCompleted}/${status.chunksTotal} chunks)`
          );
        },
      }
    );

    const renderTime = Date.now() - startTime;

    // Download to local if requested
    let localPath: string | undefined;
    if (options.downloadToLocal && options.outputPath && finalStatus.storageUrl) {
      console.log(`[AWS] Downloading to ${options.outputPath}...`);
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
   * Start async render job (returns immediately with job ID)
   */
  async startRenderAsync(options: RenderOptions): Promise<string> {
    const { template, inputs, quality = 'standard', framesPerChunk, maxConcurrency } = options;

    // Invoke main Lambda function
    const mainEvent: MainEvent = {
      template,
      inputs,
      quality,
      framesPerChunk,
      maxConcurrency,
      s3Bucket: this.config.s3Bucket,
      s3Prefix: this.config.s3Prefix || 'rendervid',
      region: this.config.region,
      workerFunctionName: this.config.workerFunctionName || 'rendervid-worker',
    };

    const response = await this.lambdaClient.send(
      new InvokeCommand({
        FunctionName: this.config.mainFunctionName || 'rendervid-main',
        InvocationType: 'RequestResponse', // Synchronous - wait for job to be queued
        Payload: Buffer.from(JSON.stringify(mainEvent)),
      })
    );

    if (!response.Payload) {
      throw new Error('Main Lambda returned no payload');
    }

    const result: MainResponse = JSON.parse(Buffer.from(response.Payload).toString());

    // Start monitoring for completion to trigger merger
    this.startMergerMonitoring(result.jobId, result.chunksTotal);

    return result.jobId;
  }

  /**
   * Get job status by reading S3 state
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.stateManager.getJobStatus(jobId);
  }

  /**
   * Cancel job and clean up resources
   */
  async cancelJob(jobId: string): Promise<void> {
    console.log(`[AWS] Cancelling job: ${jobId}`);
    await this.stateManager.deleteJob(jobId);
  }

  /**
   * Download video from S3 to local file
   */
  async downloadVideo(storageUrl: string, localPath: string): Promise<void> {
    // Parse S3 URL: s3://bucket/key or just the key
    const key = storageUrl.replace(`s3://${this.config.s3Bucket}/`, '');

    const data = await this.s3Client.download(key);
    writeFileSync(localPath, data);
  }

  /**
   * Start monitoring job and invoke merger when all chunks complete
   *
   * This is a simple polling mechanism. In production, you might use:
   * - S3 Event Notifications -> SNS -> Lambda
   * - EventBridge scheduled rule
   * - Step Functions state machine
   */
  private async startMergerMonitoring(jobId: string, totalChunks: number): Promise<void> {
    // Run in background (don't await)
    (async () => {
      try {
        // Poll every 10 seconds to check if all chunks are done
        while (true) {
          await new Promise((resolve) => setTimeout(resolve, 10000));

          const status = await this.getJobStatus(jobId);

          // Check if all chunks are complete
          if (status.chunksCompleted === totalChunks) {
            console.log(`[AWS] All chunks complete for ${jobId}, invoking merger...`);

            // Invoke merger Lambda
            const mergerEvent: MergerEvent = {
              jobId,
              s3Bucket: this.config.s3Bucket,
              s3Prefix: this.config.s3Prefix || 'rendervid',
              region: this.config.region,
            };

            await this.lambdaClient.send(
              new InvokeCommand({
                FunctionName: this.config.mergerFunctionName || 'rendervid-merger',
                InvocationType: 'Event', // Async
                Payload: Buffer.from(JSON.stringify(mergerEvent)),
              })
            );

            console.log(`[AWS] Merger invoked for ${jobId}`);
            break;
          }

          // Stop if job failed
          if (status.status === 'failed') {
            console.error(`[AWS] Job ${jobId} failed, stopping merger monitoring`);
            break;
          }
        }
      } catch (error) {
        console.error(`[AWS] Merger monitoring error for ${jobId}:`, error);
      }
    })();
  }
}
