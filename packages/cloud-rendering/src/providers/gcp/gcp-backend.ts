import { writeFileSync } from 'fs';
import type { CloudBackend } from '../../core/cloud-backend.interface';
import type { RenderOptions, RenderResult } from '../../types/render-options';
import type { JobStatus } from '../../types/job-status';
import type { GCPConfig } from '../../types/provider-config';
import { GCPStorageClient } from './gcp-storage-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { pollJobUntilComplete } from '../../core/job-poller';

/**
 * Google Cloud Functions backend implementation
 */
export class GCPBackend implements CloudBackend {
  readonly name = 'Google Cloud Functions';
  readonly provider = 'gcp' as const;

  private storageClient: GCPStorageClient;
  private stateManager: S3StateManager;

  constructor(private config: GCPConfig) {
    this.storageClient = new GCPStorageClient(
      config.projectId,
      config.storageBucket,
      config.credentials
    );

    this.stateManager = new S3StateManager(
      this.storageClient,
      config.storagePrefix || 'rendervid'
    );
  }

  async renderVideo(options: RenderOptions): Promise<RenderResult> {
    const startTime = Date.now();
    const jobId = await this.startRenderAsync(options);

    console.log(`[GCP] Job started: ${jobId}`);

    const finalStatus = await pollJobUntilComplete(
      () => this.getJobStatus(jobId),
      {
        intervalMs: 5000,
        onProgress: (status) => {
          console.log(
            `[GCP] Progress: ${status.progress.toFixed(1)}% (${status.chunksCompleted}/${status.chunksTotal})`
          );
        },
      }
    );

    const renderTime = Date.now() - startTime;

    let localPath: string | undefined;
    if (options.downloadToLocal && options.outputPath && finalStatus.storageUrl) {
      await this.downloadVideo(finalStatus.storageUrl, options.outputPath);
      localPath = options.outputPath;
    }

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

  async startRenderAsync(options: RenderOptions): Promise<string> {
    const { template, inputs, quality = 'standard' } = options;

    const mainFunctionUrl = this.getFunctionUrl('main');

    const response = await fetch(mainFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template,
        inputs,
        quality,
        projectId: this.config.projectId,
        storageBucket: this.config.storageBucket,
        storagePrefix: this.config.storagePrefix || 'rendervid',
        workerFunctionUrl: this.getFunctionUrl('worker'),
      }),
    });

    if (!response.ok) {
      throw new Error(`Main function failed: ${response.statusText}`);
    }

    const result = (await response.json()) as any;
    this.startMergerMonitoring(result.jobId, result.chunksTotal);

    return result.jobId;
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.stateManager.getJobStatus(jobId);
  }

  async cancelJob(jobId: string): Promise<void> {
    console.log(`[GCP] Cancelling job: ${jobId}`);
    await this.stateManager.deleteJob(jobId);
  }

  async downloadVideo(storageUrl: string, localPath: string): Promise<void> {
    const key = storageUrl.replace(`gs://${this.config.storageBucket}/`, '');
    const data = await this.storageClient.download(key);
    writeFileSync(localPath, data);
  }

  private getFunctionUrl(functionName: string): string {
    const region = this.config.region || 'us-central1';
    return `https://${region}-${this.config.projectId}.cloudfunctions.net/${functionName}`;
  }

  private async startMergerMonitoring(jobId: string, totalChunks: number): Promise<void> {
    (async () => {
      try {
        while (true) {
          await new Promise((resolve) => setTimeout(resolve, 10000));

          const status = await this.getJobStatus(jobId);

          if (status.chunksCompleted === totalChunks) {
            console.log(`[GCP] All chunks complete for ${jobId}, invoking merger...`);

            await fetch(this.getFunctionUrl('merger'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jobId,
                projectId: this.config.projectId,
                storageBucket: this.config.storageBucket,
                storagePrefix: this.config.storagePrefix || 'rendervid',
              }),
            });

            console.log(`[GCP] Merger invoked for ${jobId}`);
            break;
          }

          if (status.status === 'failed') {
            console.error(`[GCP] Job ${jobId} failed`);
            break;
          }
        }
      } catch (error) {
        console.error(`[GCP] Merger monitoring error:`, error);
      }
    })();
  }
}
