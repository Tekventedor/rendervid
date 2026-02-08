import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { CloudBackend } from '../../core/cloud-backend.interface';
import type { RenderOptions, RenderResult } from '../../types/render-options';
import type { JobStatus } from '../../types/job-status';
import type { DockerConfig } from '../../types/provider-config';
import { LocalStorage } from './local-storage';
import { S3StateManager } from '../../shared/s3-state-manager';
import { pollJobUntilComplete } from '../../core/job-poller';
import { JobQueue } from './job-queue';
import { calculateChunks } from '../../core/chunking-algorithm';

/**
 * Quality presets for Docker rendering
 */
const DOCKER_QUALITY_PRESETS = {
  draft: {
    memory: 2048,
    timeout: 300,
    concurrency: 10,
    framesPerChunk: 50,
  },
  standard: {
    memory: 4096,
    timeout: 600,
    concurrency: 20,
    framesPerChunk: 30,
  },
  high: {
    memory: 8192,
    timeout: 900,
    concurrency: 50,
    framesPerChunk: 20,
  },
};

/**
 * Docker-based local distributed rendering backend
 *
 * Uses Docker containers for workers and merger, with local filesystem storage.
 * Includes job queue for handling multiple concurrent render requests.
 */
export class DockerBackend implements CloudBackend {
  readonly name = 'Docker Local';
  readonly provider = 'docker' as const;

  private storage: LocalStorage;
  private stateManager: S3StateManager;
  private queue: JobQueue;
  private config: Required<DockerConfig>;
  private queueProcessor: NodeJS.Timeout | null = null;

  constructor(config: DockerConfig) {
    // Set defaults
    this.config = {
      workersCount: config.workersCount || 4,
      volumePath: config.volumePath,
      networkName: config.networkName || 'rendervid-network',
      projectName: config.projectName || 'rendervid',
      maxConcurrentJobs: config.maxConcurrentJobs || 10,
      queueCheckInterval: config.queueCheckInterval || 2000,
      workerImage: config.workerImage || 'rendervid-worker:latest',
      mergerImage: config.mergerImage || 'rendervid-merger:latest',
    };

    // Initialize storage
    this.storage = new LocalStorage(this.config.volumePath);
    this.stateManager = new S3StateManager(this.storage, 'rendervid');

    // Initialize job queue
    this.queue = new JobQueue(this.config.volumePath, this.config.maxConcurrentJobs);

    // Ensure Docker network exists
    this.ensureNetwork();

    // Start queue processor
    this.startQueueProcessor();
  }

  async renderVideo(options: RenderOptions): Promise<RenderResult> {
    const startTime = Date.now();
    const jobId = await this.startRenderAsync(options);

    console.log(`[Docker] Job queued: ${jobId}`);

    const finalStatus = await pollJobUntilComplete(
      () => this.getJobStatus(jobId),
      {
        intervalMs: 2000,
        onProgress: (status) => {
          console.log(
            `[Docker] Progress: ${status.progress.toFixed(1)}% (${status.chunksCompleted}/${status.chunksTotal})`
          );
        },
      }
    );

    const renderTime = Date.now() - startTime;

    let localPath: string | undefined;
    if (options.downloadToLocal && options.outputPath && finalStatus.storageUrl) {
      // Determine output extension from template codec
      const codec = (options.template.output as any).codec || 'libx264';
      const isProRes = codec === 'prores' || codec === 'prores_ks';
      const outputExt = isProRes ? 'mov' : 'mp4';

      // For Docker, file is already local - just copy it
      const sourcePath = this.storage.getLocalPath(
        `rendervid/jobs/${jobId}/output.${outputExt}`
      );
      const { copyFileSync } = require('fs');
      copyFileSync(sourcePath, options.outputPath);
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

    // Generate job ID
    const jobId = `render-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get quality preset
    const preset = DOCKER_QUALITY_PRESETS[quality];
    const totalFrames = template.output.duration! * (template.output.fps || 30);

    // Determine codec from template output settings
    const codec = (template.output as any).codec || 'libx264';
    const isProRes = codec === 'prores' || codec === 'prores_ks';
    const outputFormat = isProRes ? 'mov' : 'mp4';

    // Create job manifest
    const chunks = calculateChunks(totalFrames, preset);

    const manifest = {
      jobId,
      template,
      inputs,
      quality,
      chunks,
      totalFrames,
      codec,
      outputFormat,
      createdAt: new Date().toISOString(),
    };

    // Save template and manifest to local storage
    await this.stateManager.uploadTemplate(jobId, template);
    await this.stateManager.uploadManifest(jobId, manifest as any);

    // Add to queue
    await this.queue.enqueue(jobId);

    console.log(`[Docker] Job ${jobId} added to queue`);

    return jobId;
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.stateManager.getJobStatus(jobId);
  }

  async cancelJob(jobId: string): Promise<void> {
    console.log(`[Docker] Cancelling job: ${jobId}`);

    // Mark as failed in queue
    await this.queue.fail(jobId, 'Cancelled by user');

    // Clean up storage
    await this.stateManager.deleteJob(jobId);
  }

  async downloadVideo(storageUrl: string, localPath: string): Promise<void> {
    // For Docker, storage is already local
    const sourcePath = storageUrl.replace('file://', '');
    const { copyFileSync } = require('fs');
    copyFileSync(sourcePath, localPath);
  }

  /**
   * Start processing queue in background
   */
  private startQueueProcessor(): void {
    this.queueProcessor = setInterval(async () => {
      try {
        const nextJob = await this.queue.dequeue();

        if (nextJob) {
          console.log(`[Docker] Starting job from queue: ${nextJob.jobId}`);
          this.processJob(nextJob.jobId).catch((error) => {
            console.error(`[Docker] Job failed:`, error);
            this.queue.fail(nextJob.jobId, error.message);
          });
        }
      } catch (error) {
        console.error('[Docker] Queue processor error:', error);
      }
    }, this.config.queueCheckInterval);
  }

  /**
   * Process a job by spawning worker containers
   */
  private async processJob(jobId: string): Promise<void> {
    const manifest = await this.stateManager.downloadManifest(jobId);

    console.log(
      `[Docker] Processing job ${jobId} with ${manifest.chunks.length} chunks`
    );

    // Spawn worker containers in parallel
    const workerPromises = manifest.chunks.map((chunk: any) =>
      this.spawnWorker(jobId, chunk.id, chunk.startFrame, chunk.endFrame)
    );

    await Promise.all(workerPromises);

    console.log(`[Docker] All workers completed for ${jobId}, starting merger...`);

    // Spawn merger container
    await this.spawnMerger(jobId);

    // Mark job as complete in queue
    await this.queue.complete(jobId);

    console.log(`[Docker] Job ${jobId} completed`);
  }

  /**
   * Spawn a worker container
   */
  private async spawnWorker(
    jobId: string,
    chunkId: number,
    startFrame: number,
    endFrame: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const containerName = `${this.config.projectName}-worker-${jobId}-${chunkId}`;

      const args = [
        'run',
        '--rm',
        '--name',
        containerName,
        '--network',
        this.config.networkName,
        '-v',
        `${this.config.volumePath}:/data`,
        '-e',
        `JOB_ID=${jobId}`,
        '-e',
        `CHUNK_ID=${chunkId}`,
        '-e',
        `START_FRAME=${startFrame}`,
        '-e',
        `END_FRAME=${endFrame}`,
        this.config.workerImage,
      ];

      const process = spawn('docker', args);

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Worker failed (chunk ${chunkId}): ${stderr}`));
        }
      });
    });
  }

  /**
   * Spawn merger container
   */
  private async spawnMerger(jobId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const containerName = `${this.config.projectName}-merger-${jobId}`;

      const args = [
        'run',
        '--rm',
        '--name',
        containerName,
        '--network',
        this.config.networkName,
        '-v',
        `${this.config.volumePath}:/data`,
        '-e',
        `JOB_ID=${jobId}`,
        this.config.mergerImage,
      ];

      const process = spawn('docker', args);

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Merger failed: ${stderr}`));
        }
      });
    });
  }

  /**
   * Ensure Docker network exists
   */
  private ensureNetwork(): void {
    const { execSync } = require('child_process');

    try {
      // Check if network exists
      execSync(`docker network inspect ${this.config.networkName}`, {
        stdio: 'ignore',
      });
    } catch {
      // Network doesn't exist, create it
      console.log(`[Docker] Creating network: ${this.config.networkName}`);
      execSync(`docker network create ${this.config.networkName}`);
    }
  }

  /**
   * Stop queue processor (cleanup)
   */
  async shutdown(): Promise<void> {
    if (this.queueProcessor) {
      clearInterval(this.queueProcessor);
      this.queueProcessor = null;
    }

    console.log('[Docker] Backend shut down');
  }

  /**
   * Get queue statistics
   */
  getQueueStats() {
    return this.queue.getStats();
  }
}
