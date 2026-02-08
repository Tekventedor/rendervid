import { writeFileSync } from 'fs';
import type { CloudBackend } from '../../core/cloud-backend.interface';
import type { RenderOptions, RenderResult } from '../../types/render-options';
import type { JobStatus } from '../../types/job-status';
import type { AzureConfig } from '../../types/provider-config';
import { AzureBlobClient } from './azure-blob-client';
import { S3StateManager } from '../../shared/s3-state-manager';
import { pollJobUntilComplete } from '../../core/job-poller';
import type { MainRequest } from './azure-main-function';
import type { MergerRequest } from './azure-merger-function';

/**
 * Azure Functions backend implementation
 */
export class AzureBackend implements CloudBackend {
  readonly name = 'Azure Functions';
  readonly provider = 'azure' as const;

  private blobClient: AzureBlobClient;
  private stateManager: S3StateManager;

  constructor(private config: AzureConfig) {
    if (!config.storageConnectionString) {
      throw new Error('Azure storage connection string is required');
    }

    this.blobClient = new AzureBlobClient(
      config.storageConnectionString,
      config.storageContainer,
      config.storageAccount
    );

    this.stateManager = new S3StateManager(
      this.blobClient,
      config.storagePrefix || 'rendervid'
    );
  }

  async renderVideo(options: RenderOptions): Promise<RenderResult> {
    const startTime = Date.now();
    const jobId = await this.startRenderAsync(options);

    console.log(`[Azure] Job started: ${jobId}`);

    const finalStatus = await pollJobUntilComplete(
      () => this.getJobStatus(jobId),
      {
        intervalMs: 5000,
        onProgress: (status) => {
          console.log(
            `[Azure] Progress: ${status.progress.toFixed(1)}% (${status.chunksCompleted}/${status.chunksTotal})`
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

    const mainFunctionUrl = this.getFunctionUrl('MainCoordinator');

    const mainRequest: MainRequest = {
      template,
      inputs,
      quality,
      storageAccount: this.config.storageAccount,
      storageContainer: this.config.storageContainer,
      storageConnectionString: this.config.storageConnectionString!,
      storagePrefix: this.config.storagePrefix || 'rendervid',
      workerFunctionUrl: this.getFunctionUrl('WorkerRenderer'),
    };

    const response = await fetch(mainFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mainRequest),
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
    console.log(`[Azure] Cancelling job: ${jobId}`);
    await this.stateManager.deleteJob(jobId);
  }

  async downloadVideo(storageUrl: string, localPath: string): Promise<void> {
    const key = storageUrl.split('/').pop()!;
    const data = await this.blobClient.download(key);
    writeFileSync(localPath, data);
  }

  private getFunctionUrl(functionName: string): string {
    const appName = this.config.functionAppName || 'rendervid-functions';
    return `https://${appName}.azurewebsites.net/api/${functionName}`;
  }

  private async startMergerMonitoring(jobId: string, totalChunks: number): Promise<void> {
    (async () => {
      try {
        while (true) {
          await new Promise((resolve) => setTimeout(resolve, 10000));

          const status = await this.getJobStatus(jobId);

          if (status.chunksCompleted === totalChunks) {
            console.log(`[Azure] All chunks complete for ${jobId}, invoking merger...`);

            const mergerRequest: MergerRequest = {
              jobId,
              storageAccount: this.config.storageAccount,
              storageContainer: this.config.storageContainer,
              storageConnectionString: this.config.storageConnectionString!,
              storagePrefix: this.config.storagePrefix || 'rendervid',
            };

            await fetch(this.getFunctionUrl('MergerConcat'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(mergerRequest),
            });

            console.log(`[Azure] Merger invoked for ${jobId}`);
            break;
          }

          if (status.status === 'failed') {
            console.error(`[Azure] Job ${jobId} failed`);
            break;
          }
        }
      } catch (error) {
        console.error(`[Azure] Merger monitoring error:`, error);
      }
    })();
  }
}

