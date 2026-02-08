/**
 * @rendervid/cloud-rendering
 *
 * Multi-cloud distributed video rendering for Rendervid.
 * Supports AWS Lambda, Azure Functions, and Google Cloud Functions.
 */

// Main API
export { CloudRenderer } from './core/cloud-renderer';
export type { CloudRendererOptions } from './core/cloud-renderer';

// Types
export type { RenderOptions, RenderResult } from './types/render-options';
export type { JobStatus, JobManifest, ChunkDefinition, WorkerProgress, JobCompletion } from './types/job-status';
export type {
  AWSConfig,
  AzureConfig,
  GCPConfig,
  QualityPreset,
  ProviderPresets,
} from './types/provider-config';

// Interfaces
export type { CloudBackend } from './core/cloud-backend.interface';

// Utilities
export { calculateChunks, validateChunks, estimateRenderTime } from './core/chunking-algorithm';
export { pollJobUntilComplete, calculateEstimatedTimeRemaining } from './core/job-poller';
export type { JobPollerOptions } from './core/job-poller';

// Configuration loaders
export {
  loadAWSConfig,
  loadAzureConfig,
  loadGCPConfig,
  loadDefaultProviderConfig,
} from './shared/config-loader';

// Shared utilities (for custom implementations)
export {
  validateTemplate,
  calculateTotalFrames,
  generateRenderHTML,
  getCloudBrowserArgs,
} from './shared/frame-renderer';
export type { FrameRendererConfig, IFrameRenderer } from './shared/frame-renderer';

export { encodeChunk, getPresetForQuality, getCRFForQuality } from './shared/ffmpeg-encoder';
export type { EncodeChunkOptions } from './shared/ffmpeg-encoder';

export { mergeChunks, addAudioToVideo, getVideoDuration } from './shared/ffmpeg-merger';
export type { MergeChunksOptions, AddAudioOptions } from './shared/ffmpeg-merger';

export { S3StateManager } from './shared/s3-state-manager';
export type { S3CompatibleStorage } from './shared/s3-state-manager';

// AWS-specific exports
export { AWSS3Client } from './providers/aws/aws-s3-client';
export { AWSBackend } from './providers/aws/aws-backend';
export type { MainEvent, MainResponse } from './providers/aws/aws-main-function';
export type { WorkerEvent } from './providers/aws/aws-worker-function';
export type { MergerEvent } from './providers/aws/aws-merger-function';

// Azure-specific exports
export { AzureBlobClient } from './providers/azure/azure-blob-client';
export { AzureBackend } from './providers/azure/azure-backend';

// GCP-specific exports
export { GCPStorageClient } from './providers/gcp/gcp-storage-client';
export { GCPBackend } from './providers/gcp/gcp-backend';

// Error handling & reliability
export { retryWithBackoff, isRetryableError } from './core/retry-handler';
export type { RetryOptions } from './core/retry-handler';
export { logger } from './shared/logger';
export type { LogLevel, LogContext } from './shared/logger';

// Quality validation
export { getVideoMetrics, validateVideoQuality } from './shared/quality-validator';
export type { VideoQualityMetrics } from './shared/quality-validator';
