import type { RenderOptions, RenderResult } from '../types/render-options';
import type { JobStatus } from '../types/job-status';

/**
 * Base interface for all cloud rendering backends
 *
 * Implementations: AWSBackend, AzureBackend, GCPBackend
 */
export interface CloudBackend {
  /** Backend name for logging */
  readonly name: string;

  /** Cloud provider identifier */
  readonly provider: 'aws' | 'azure' | 'gcp' | 'docker' | 'cloudflare';

  /**
   * Render video synchronously (waits for completion)
   *
   * @param options - Render options including template and quality
   * @returns Render result with storage URL and metadata
   */
  renderVideo(options: RenderOptions): Promise<RenderResult>;

  /**
   * Start asynchronous render job (returns immediately)
   *
   * @param options - Render options including template and quality
   * @returns Job ID for polling status
   */
  startRenderAsync(options: RenderOptions): Promise<string>;

  /**
   * Get status of a running or completed job
   *
   * @param jobId - Job identifier from startRenderAsync
   * @returns Current job status with progress
   */
  getJobStatus(jobId: string): Promise<JobStatus>;

  /**
   * Cancel a running job and clean up resources
   *
   * @param jobId - Job identifier to cancel
   */
  cancelJob(jobId: string): Promise<void>;

  /**
   * Download rendered video from cloud storage to local file
   *
   * @param storageUrl - Cloud storage URL (S3/Blob/GCS)
   * @param localPath - Local file path to save to
   */
  downloadVideo(storageUrl: string, localPath: string): Promise<void>;
}
