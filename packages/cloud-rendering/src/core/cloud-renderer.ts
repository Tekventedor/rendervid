import type { CloudBackend } from './cloud-backend.interface';
import type { RenderOptions, RenderResult } from '../types/render-options';
import type { JobStatus } from '../types/job-status';
import type { AWSConfig, AzureConfig, GCPConfig, DockerConfig, CloudflareConfig } from '../types/provider-config';

/**
 * Options for initializing CloudRenderer
 */
export interface CloudRendererOptions {
  /** Cloud provider to use */
  provider: 'aws' | 'azure' | 'gcp' | 'docker' | 'cloudflare';

  /** AWS configuration (required if provider='aws') */
  awsConfig?: AWSConfig;

  /** Azure configuration (required if provider='azure') */
  azureConfig?: AzureConfig;

  /** GCP configuration (required if provider='gcp') */
  gcpConfig?: GCPConfig;

  /** Docker configuration (required if provider='docker') */
  dockerConfig?: DockerConfig;

  /** Cloudflare configuration (required if provider='cloudflare') */
  cloudflareConfig?: CloudflareConfig;
}

/**
 * Main API for cloud-based distributed video rendering
 *
 * Supports AWS Lambda, Azure Functions, and Google Cloud Functions.
 *
 * @example
 * ```typescript
 * const renderer = new CloudRenderer({
 *   provider: 'aws',
 *   awsConfig: {
 *     region: 'us-east-1',
 *     s3Bucket: 'my-renders',
 *   },
 * });
 *
 * const result = await renderer.renderVideo({
 *   template: myTemplate,
 *   quality: 'high',
 *   downloadToLocal: true,
 *   outputPath: './output.mp4',
 * });
 * ```
 */
export class CloudRenderer {
  private backend: CloudBackend;

  constructor(options: CloudRendererOptions) {
    // Lazy load backends to avoid loading all cloud SDKs
    switch (options.provider) {
      case 'aws': {
        if (!options.awsConfig) {
          throw new Error('awsConfig is required when provider is "aws"');
        }
        // Dynamic import to avoid loading Azure/GCP dependencies
        const { AWSBackend } = require('../providers/aws/aws-backend');
        this.backend = new AWSBackend(options.awsConfig);
        break;
      }

      case 'azure': {
        if (!options.azureConfig) {
          throw new Error('azureConfig is required when provider is "azure"');
        }
        const { AzureBackend } = require('../providers/azure/azure-backend');
        this.backend = new AzureBackend(options.azureConfig);
        break;
      }

      case 'gcp': {
        if (!options.gcpConfig) {
          throw new Error('gcpConfig is required when provider is "gcp"');
        }
        const { GCPBackend } = require('../providers/gcp/gcp-backend');
        this.backend = new GCPBackend(options.gcpConfig);
        break;
      }

      case 'docker': {
        if (!options.dockerConfig) {
          throw new Error('dockerConfig is required when provider is "docker"');
        }
        const { DockerBackend } = require('../providers/docker/docker-backend');
        this.backend = new DockerBackend(options.dockerConfig);
        break;
      }

      case 'cloudflare': {
        if (!options.cloudflareConfig) {
          throw new Error('cloudflareConfig is required when provider is "cloudflare"');
        }
        const { CloudflareBackend } = require('../providers/cloudflare/cloudflare-backend');
        this.backend = new CloudflareBackend(options.cloudflareConfig);
        break;
      }

      default:
        throw new Error(`Unsupported cloud provider: ${options.provider}`);
    }
  }

  /**
   * Render video and wait for completion
   *
   * This method blocks until the render is complete. Use startRenderAsync()
   * for long-running jobs where you want to poll progress separately.
   *
   * @param options - Render options including template and quality
   * @returns Render result with storage URL and metadata
   *
   * @example
   * ```typescript
   * const result = await renderer.renderVideo({
   *   template: myTemplate,
   *   quality: 'standard',
   *   downloadToLocal: true,
   *   outputPath: './video.mp4',
   * });
   *
   * console.log(`Rendered in ${result.renderTime}ms`);
   * console.log(`Chunks: ${result.chunksRendered}`);
   * ```
   */
  async renderVideo(options: RenderOptions): Promise<RenderResult> {
    return this.backend.renderVideo(options);
  }

  /**
   * Start async render job (returns immediately with jobId)
   *
   * Use this for long-running renders where you want to poll progress
   * separately or return a job ID to the user.
   *
   * @param options - Render options including template and quality
   * @returns Job ID for polling status
   *
   * @example
   * ```typescript
   * const jobId = await renderer.startRenderAsync({
   *   template: myTemplate,
   *   quality: 'high',
   * });
   *
   * // Poll for completion
   * while (true) {
   *   const status = await renderer.getJobStatus(jobId);
   *   console.log(`Progress: ${status.progress}%`);
   *
   *   if (status.status === 'completed') break;
   *   await new Promise(resolve => setTimeout(resolve, 5000));
   * }
   * ```
   */
  async startRenderAsync(options: RenderOptions): Promise<string> {
    return this.backend.startRenderAsync(options);
  }

  /**
   * Poll job status (check cloud storage for completion)
   *
   * @param jobId - Job identifier from startRenderAsync
   * @returns Current job status with progress
   *
   * @example
   * ```typescript
   * const status = await renderer.getJobStatus('render-abc123');
   *
   * console.log(`Status: ${status.status}`);
   * console.log(`Progress: ${status.progress}%`);
   * console.log(`Chunks: ${status.chunksCompleted}/${status.chunksTotal}`);
   * ```
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.backend.getJobStatus(jobId);
  }

  /**
   * Cancel running job (delete cloud storage job folder)
   *
   * @param jobId - Job identifier to cancel
   *
   * @example
   * ```typescript
   * await renderer.cancelJob('render-abc123');
   * console.log('Job cancelled and resources cleaned up');
   * ```
   */
  async cancelJob(jobId: string): Promise<void> {
    return this.backend.cancelJob(jobId);
  }

  /**
   * Download rendered video from cloud storage to local file
   *
   * @param storageUrl - Cloud storage URL (S3/Blob/GCS)
   * @param localPath - Local file path to save to
   *
   * @example
   * ```typescript
   * await renderer.downloadVideo(
   *   's3://bucket/jobs/render-abc123/output.mp4',
   *   './my-video.mp4'
   * );
   * ```
   */
  async downloadVideo(storageUrl: string, localPath: string): Promise<void> {
    return this.backend.downloadVideo(storageUrl, localPath);
  }

  /**
   * Get the underlying cloud backend instance
   *
   * Useful for provider-specific operations not exposed by the main API.
   */
  getBackend(): CloudBackend {
    return this.backend;
  }

  /**
   * Get the cloud provider name
   */
  getProvider(): 'aws' | 'azure' | 'gcp' | 'docker' | 'cloudflare' {
    return this.backend.provider;
  }
}
