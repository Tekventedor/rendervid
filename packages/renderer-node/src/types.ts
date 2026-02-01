import type { Template } from '@rendervid/core';

/**
 * Options for video rendering
 */
export interface VideoRenderOptions {
  /** The template to render */
  template: Template;
  /** Input values for template variables */
  inputs?: Record<string, unknown>;
  /** Output file path */
  outputPath: string;
  /** Video codec (default: 'libx264') */
  codec?: 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores';
  /** Video format (default: derived from outputPath extension) */
  format?: 'mp4' | 'webm' | 'mov' | 'gif';
  /** Video quality CRF (0-51, lower is better quality, default: 23) */
  quality?: number;
  /** Audio codec (default: 'aac') */
  audioCodec?: 'aac' | 'mp3' | 'opus' | 'none';
  /** Audio bitrate (default: '128k') */
  audioBitrate?: string;
  /** Whether to include audio (default: true) */
  includeAudio?: boolean;
  /** Pixel format (default: 'yuv420p') */
  pixelFormat?: string;
  /** Temporary directory for frame storage */
  tempDir?: string;
  /** Keep temporary files after rendering (default: false) */
  keepTempFiles?: boolean;
  /** Puppeteer launch options */
  puppeteerOptions?: PuppeteerLaunchOptions;
  /** Progress callback */
  onProgress?: (progress: RenderProgress) => void;
  /** Frame rendered callback */
  onFrame?: (frame: number, total: number) => void;
}

/**
 * Options for image rendering
 */
export interface ImageRenderOptions {
  /** The template to render */
  template: Template;
  /** Input values for template variables */
  inputs?: Record<string, unknown>;
  /** Output file path */
  outputPath: string;
  /** Image format (default: derived from outputPath extension) */
  format?: 'png' | 'jpeg' | 'webp';
  /** Quality for lossy formats (0-100, default: 90) */
  quality?: number;
  /** Frame to render (default: 0) */
  frame?: number;
  /** Puppeteer launch options */
  puppeteerOptions?: PuppeteerLaunchOptions;
}

/**
 * Options for sequence rendering (frame sequence)
 */
export interface SequenceRenderOptions {
  /** The template to render */
  template: Template;
  /** Input values for template variables */
  inputs?: Record<string, unknown>;
  /** Output directory path */
  outputDir: string;
  /** Filename pattern (default: 'frame-%05d.png') */
  pattern?: string;
  /** Image format (default: 'png') */
  format?: 'png' | 'jpeg' | 'webp';
  /** Quality for lossy formats (0-100, default: 90) */
  quality?: number;
  /** Start frame (default: 0) */
  startFrame?: number;
  /** End frame (default: total frames) */
  endFrame?: number;
  /** Puppeteer launch options */
  puppeteerOptions?: PuppeteerLaunchOptions;
  /** Progress callback */
  onProgress?: (progress: RenderProgress) => void;
}

/**
 * Puppeteer launch options
 */
export interface PuppeteerLaunchOptions {
  /** Path to Chrome executable */
  executablePath?: string;
  /** Run in headless mode (default: true) */
  headless?: boolean;
  /** Additional Chrome arguments */
  args?: string[];
  /** Ignore default args */
  ignoreDefaultArgs?: string[] | boolean;
}

/**
 * Render progress information
 */
export interface RenderProgress {
  /** Current phase */
  phase: 'preparing' | 'rendering' | 'encoding' | 'complete';
  /** Current frame being rendered/encoded */
  currentFrame: number;
  /** Total frames to render */
  totalFrames: number;
  /** Progress percentage (0-100) */
  percent: number;
  /** Estimated time remaining in seconds */
  eta?: number;
  /** Elapsed time in seconds */
  elapsed: number;
  /** Current FPS (frames per second) */
  fps?: number;
}

/**
 * Result of a render operation
 */
export interface RenderResult {
  /** Whether the render was successful */
  success: boolean;
  /** Output file path */
  outputPath: string;
  /** Duration in seconds */
  duration?: number;
  /** File size in bytes */
  fileSize?: number;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Frame count (for video) */
  frameCount?: number;
  /** Render time in milliseconds */
  renderTime: number;
  /** Error message if failed */
  error?: string;
}

/**
 * FFmpeg configuration
 */
export interface FFmpegConfig {
  /** Path to FFmpeg binary */
  ffmpegPath?: string;
  /** Path to FFprobe binary */
  ffprobePath?: string;
}

/**
 * Node renderer options
 */
export interface NodeRendererOptions {
  /** FFmpeg configuration */
  ffmpeg?: FFmpegConfig;
  /** Default Puppeteer options */
  puppeteerOptions?: PuppeteerLaunchOptions;
  /** Default temporary directory */
  tempDir?: string;
}
