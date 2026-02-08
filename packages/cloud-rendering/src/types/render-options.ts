import type { Template } from '@rendervid/core';

/**
 * Options for rendering a video in the cloud
 */
export interface RenderOptions {
  /** The template to render */
  template: Template;

  /** Input data to inject into the template */
  inputs?: Record<string, unknown>;

  /** Quality preset: draft (fast), standard (balanced), high (slow but best quality) */
  quality?: 'draft' | 'standard' | 'high';

  /** If true, download the rendered video from cloud storage to local filesystem */
  downloadToLocal?: boolean;

  /** Local file path where the video should be saved (requires downloadToLocal=true) */
  outputPath?: string;

  /** Custom frames per chunk (overrides quality preset) */
  framesPerChunk?: number;

  /** Maximum number of concurrent workers (overrides quality preset) */
  maxConcurrency?: number;
}

/**
 * Result of a cloud rendering operation
 */
export interface RenderResult {
  /** Whether the render succeeded */
  success: boolean;

  /** Cloud storage URL where the rendered video is stored (S3, Blob, or GCS) */
  storageUrl: string;

  /** Local file path if downloadToLocal was true */
  localPath?: string;

  /** Video duration in seconds */
  duration: number;

  /** File size in bytes */
  fileSize: number;

  /** Total render time in milliseconds (from job start to completion) */
  renderTime: number;

  /** Number of parallel chunks that were rendered */
  chunksRendered: number;

  /** Error message if success=false */
  error?: string;

  /** Job ID for tracking */
  jobId: string;
}
