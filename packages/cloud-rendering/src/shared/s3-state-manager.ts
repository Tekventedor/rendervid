import type {
  JobManifest,
  WorkerProgress,
  JobCompletion,
  JobStatus,
  ChunkDefinition,
} from '../types/job-status';

/**
 * Generic interface for S3-compatible object storage
 *
 * This interface abstracts AWS S3, Azure Blob Storage, and Google Cloud Storage
 * so that job state management works the same across all providers.
 */
export interface S3CompatibleStorage {
  /**
   * Upload object to storage
   */
  upload(key: string, data: Buffer | string): Promise<void>;

  /**
   * Download object from storage
   */
  download(key: string): Promise<Buffer>;

  /**
   * Check if object exists
   */
  exists(key: string): Promise<boolean>;

  /**
   * List objects with prefix
   */
  list(prefix: string): Promise<string[]>;

  /**
   * Delete object
   */
  delete(key: string): Promise<void>;

  /**
   * Delete multiple objects with prefix (recursive delete)
   */
  deletePrefix(prefix: string): Promise<void>;
}

/**
 * Manages job state in S3-compatible storage
 *
 * Uses a simple folder structure:
 * - {prefix}/jobs/{jobId}/manifest.json
 * - {prefix}/jobs/{jobId}/template.json
 * - {prefix}/jobs/{jobId}/chunks/chunk-0.mp4
 * - {prefix}/jobs/{jobId}/progress/worker-0.json
 * - {prefix}/jobs/{jobId}/output.mp4
 * - {prefix}/jobs/{jobId}/complete.json
 */
export class S3StateManager {
  constructor(
    private storage: S3CompatibleStorage,
    private keyPrefix: string = 'rendervid'
  ) {}

  /**
   * Get job key prefix
   */
  private getJobPrefix(jobId: string): string {
    return `${this.keyPrefix}/jobs/${jobId}`;
  }

  /**
   * Upload job manifest
   */
  async uploadManifest(jobId: string, manifest: JobManifest): Promise<void> {
    const key = `${this.getJobPrefix(jobId)}/manifest.json`;
    await this.storage.upload(key, JSON.stringify(manifest, null, 2));
  }

  /**
   * Download job manifest
   */
  async downloadManifest(jobId: string): Promise<JobManifest> {
    const key = `${this.getJobPrefix(jobId)}/manifest.json`;
    const data = await this.storage.download(key);
    return JSON.parse(data.toString('utf-8'));
  }

  /**
   * Upload template
   */
  async uploadTemplate(jobId: string, template: unknown): Promise<void> {
    const key = `${this.getJobPrefix(jobId)}/template.json`;
    await this.storage.upload(key, JSON.stringify(template));
  }

  /**
   * Download template
   */
  async downloadTemplate(jobId: string): Promise<unknown> {
    const key = `${this.getJobPrefix(jobId)}/template.json`;
    const data = await this.storage.download(key);
    return JSON.parse(data.toString('utf-8'));
  }

  /**
   * Upload video chunk
   */
  async uploadChunk(jobId: string, chunkId: number, chunkData: Buffer): Promise<void> {
    const key = `${this.getJobPrefix(jobId)}/chunks/chunk-${chunkId}.mp4`;
    await this.storage.upload(key, chunkData);
  }

  /**
   * Download video chunk
   */
  async downloadChunk(jobId: string, chunkId: number): Promise<Buffer> {
    const key = `${this.getJobPrefix(jobId)}/chunks/chunk-${chunkId}.mp4`;
    return this.storage.download(key);
  }

  /**
   * List all chunks for a job
   */
  async listChunks(jobId: string): Promise<number[]> {
    const prefix = `${this.getJobPrefix(jobId)}/chunks/`;
    const keys = await this.storage.list(prefix);

    // Extract chunk IDs from keys like "chunks/chunk-0.mp4"
    const chunkIds = keys
      .map((key) => {
        const match = key.match(/chunk-(\d+)\.mp4$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((id): id is number => id !== null)
      .sort((a, b) => a - b);

    return chunkIds;
  }

  /**
   * Upload worker progress
   */
  async uploadWorkerProgress(jobId: string, progress: WorkerProgress): Promise<void> {
    const key = `${this.getJobPrefix(jobId)}/progress/worker-${progress.chunkId}.json`;
    await this.storage.upload(key, JSON.stringify(progress, null, 2));
  }

  /**
   * Download worker progress
   */
  async downloadWorkerProgress(jobId: string, chunkId: number): Promise<WorkerProgress | null> {
    const key = `${this.getJobPrefix(jobId)}/progress/worker-${chunkId}.json`;
    try {
      const data = await this.storage.download(key);
      return JSON.parse(data.toString('utf-8'));
    } catch {
      return null;
    }
  }

  /**
   * List all worker progress files
   */
  async listWorkerProgress(jobId: string): Promise<WorkerProgress[]> {
    const prefix = `${this.getJobPrefix(jobId)}/progress/`;
    const keys = await this.storage.list(prefix);

    const progressList: WorkerProgress[] = [];
    for (const key of keys) {
      try {
        const data = await this.storage.download(key);
        const progress = JSON.parse(data.toString('utf-8'));
        progressList.push(progress);
      } catch {
        // Skip invalid progress files
      }
    }

    return progressList;
  }

  /**
   * Upload final output video
   */
  async uploadOutput(jobId: string, videoData: Buffer): Promise<void> {
    const key = `${this.getJobPrefix(jobId)}/output.mp4`;
    await this.storage.upload(key, videoData);
  }

  /**
   * Download final output video
   */
  async downloadOutput(jobId: string): Promise<Buffer> {
    const key = `${this.getJobPrefix(jobId)}/output.mp4`;
    return this.storage.download(key);
  }

  /**
   * Get output URL
   */
  getOutputUrl(jobId: string): string {
    return `${this.keyPrefix}/jobs/${jobId}/output.mp4`;
  }

  /**
   * Upload completion marker
   */
  async uploadCompletion(jobId: string, completion: JobCompletion): Promise<void> {
    const key = `${this.getJobPrefix(jobId)}/complete.json`;
    await this.storage.upload(key, JSON.stringify(completion, null, 2));
  }

  /**
   * Check if job is complete
   */
  async isComplete(jobId: string): Promise<boolean> {
    const key = `${this.getJobPrefix(jobId)}/complete.json`;
    return this.storage.exists(key);
  }

  /**
   * Download completion data
   */
  async downloadCompletion(jobId: string): Promise<JobCompletion | null> {
    const key = `${this.getJobPrefix(jobId)}/complete.json`;
    try {
      const data = await this.storage.download(key);
      return JSON.parse(data.toString('utf-8'));
    } catch {
      return null;
    }
  }

  /**
   * Get job status by reading manifest and progress files
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    // Check if job is complete
    const completion = await this.downloadCompletion(jobId);
    if (completion) {
      return {
        jobId,
        status: completion.status === 'completed' ? 'completed' : 'failed',
        progress: completion.status === 'completed' ? 100 : 0,
        chunksCompleted: 0,
        chunksTotal: 0,
        storageUrl: completion.outputUrl,
        error: completion.error,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date(completion.completedAt),
      };
    }

    // Get manifest
    const manifest = await this.downloadManifest(jobId);

    // Get worker progress
    const progressList = await this.listWorkerProgress(jobId);
    const completedChunks = progressList.filter((p) => p.status === 'completed').length;

    // Calculate progress
    const progress = (completedChunks / manifest.chunks.length) * 90; // 0-90% for rendering, 90-100% for merging

    // Determine status
    let status: JobStatus['status'] = 'rendering';
    if (manifest.status === 'validating') {
      status = 'validating';
    } else if (completedChunks === manifest.chunks.length) {
      status = 'merging';
    } else if (completedChunks === 0) {
      status = 'queued';
    }

    return {
      jobId,
      status,
      progress,
      chunksCompleted: completedChunks,
      chunksTotal: manifest.chunks.length,
      createdAt: new Date(manifest.createdAt),
      updatedAt: new Date(),
    };
  }

  /**
   * Delete all job data (cancel job)
   */
  async deleteJob(jobId: string): Promise<void> {
    const prefix = this.getJobPrefix(jobId);
    await this.storage.deletePrefix(prefix);
  }

  /**
   * Check if all chunks are uploaded
   */
  async areAllChunksUploaded(jobId: string, chunks: ChunkDefinition[]): Promise<boolean> {
    const uploadedChunkIds = await this.listChunks(jobId);
    return uploadedChunkIds.length === chunks.length;
  }
}
