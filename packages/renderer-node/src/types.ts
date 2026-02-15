import type { Template, ComponentRegistry, MotionBlurConfig } from '@rendervid/core';
import type { HardwareAccelerationOptions } from './ffmpeg-encoder';

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
  /** Video codec (default: 'libx264'). 'hevc' is an alias for 'libx265'. */
  codec?: 'libx264' | 'libx265' | 'hevc' | 'libvpx' | 'libvpx-vp9' | 'libaom-av1' | 'prores';
  /** Video format (default: derived from outputPath extension) */
  format?: 'mp4' | 'webm' | 'mov' | 'gif';
  /** Video quality CRF (0-51, lower is better quality, default: 23) */
  quality?: number;
  /** Video bitrate (e.g., '8M', '10M'). Overrides quality/CRF when specified. */
  bitrate?: string;
  /** Encoding preset for libx264/libx265 (default: 'medium'). Use 'slow' or 'veryslow' for better quality. */
  preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
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
  /** Playwright launch options */
  playwrightOptions?: PlaywrightLaunchOptions;
  /** Time to wait after rendering before capturing (ms, default: 50) */
  renderWaitTime?: number;
  /** Progress callback */
  onProgress?: (progress: RenderProgress) => void;
  /** Frame rendered callback */
  onFrame?: (frame: number, total: number) => void;
  /** Number of concurrent browser instances for parallel rendering (default: 1) */
  concurrency?: number;
  /** Use streaming mode (pipe frames directly to FFmpeg without writing to disk) (default: false) */
  useStreaming?: boolean;
  /** Hardware acceleration options. Set {enabled: false} to force software encoding for maximum quality. */
  hardwareAcceleration?: HardwareAccelerationOptions;
  /** Motion blur configuration (global render config) */
  motionBlur?: MotionBlurConfig;
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
  /** Playwright launch options */
  playwrightOptions?: PlaywrightLaunchOptions;
  /** Time to wait after rendering before capturing (ms, default: 50) */
  renderWaitTime?: number;
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
  /** Playwright launch options */
  playwrightOptions?: PlaywrightLaunchOptions;
  /** Time to wait after rendering before capturing (ms, default: 50) */
  renderWaitTime?: number;
  /** Progress callback */
  onProgress?: (progress: RenderProgress) => void;
}

/**
 * Playwright launch options
 */
export interface PlaywrightLaunchOptions {
  /** Path to Chrome executable */
  executablePath?: string;
  /** Run in headless mode (default: true) */
  headless?: boolean;
  /** Additional Chrome arguments */
  args?: string[];
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
  /** Hardware acceleration configuration (for backward compatibility, prefer using per-render options) */
  hardwareAcceleration?: {
    /** Enable GPU acceleration (default: auto-detect) */
    enabled?: boolean;
    /** Preferred hardware encoder (auto-detect if not specified) */
    preferredEncoder?: 'h264_nvenc' | 'hevc_nvenc' | 'h264_videotoolbox' | 'hevc_videotoolbox' | 'h264_qsv' | 'hevc_qsv' | 'h264_amf' | 'hevc_amf';
    /** Fallback to software encoding if GPU unavailable (default: true) */
    fallbackToSoftware?: boolean;
  };
}

/**
 * GPU encoding acceleration type
 * - 'auto': Automatically detect and use best available GPU encoder (default)
 * - 'nvidia': Use NVIDIA NVENC encoder
 * - 'intel': Use Intel Quick Sync Video encoder
 * - 'amd': Use AMD Advanced Media Framework encoder
 * - 'apple': Use Apple VideoToolbox encoder
 * - 'none': Disable GPU encoding, use software encoder
 */
export type GPUEncodingType = 'auto' | 'nvidia' | 'intel' | 'amd' | 'apple' | 'none';

/**
 * GPU acceleration configuration
 * Controls both GPU-accelerated rendering (via Puppeteer/Chrome) and GPU-accelerated encoding (via FFmpeg)
 */
export interface GPUConfig {
  /**
   * Enable GPU-accelerated rendering in browser (default: true)
   * Uses Chrome's GPU acceleration for faster frame rendering
   */
  rendering?: boolean;

  /**
   * GPU encoding acceleration type (default: 'auto')
   * Controls which hardware encoder to use for video encoding
   * - 'auto': Automatically detect and use best available GPU encoder
   * - 'nvidia': Force NVIDIA NVENC encoder (requires NVIDIA GPU)
   * - 'intel': Force Intel Quick Sync Video encoder (requires Intel GPU)
   * - 'amd': Force AMD AMF encoder (requires AMD GPU)
   * - 'apple': Force Apple VideoToolbox encoder (requires macOS)
   * - 'none': Disable GPU encoding, use software encoder (libx264)
   */
  encoding?: GPUEncodingType;

  /**
   * Fallback to software rendering/encoding if GPU unavailable (default: true)
   * If true, automatically falls back to software mode when GPU acceleration fails
   * If false, throws an error when GPU acceleration is unavailable
   */
  fallback?: boolean;
}

/**
 * Options for image sequence export
 */
export interface ImageSequenceExportOptions {
  /** The template to render */
  template: Template;
  /** Input values for template variables */
  inputs?: Record<string, unknown>;
  /** Output directory path */
  outputDir: string;
  /** Naming pattern using tokens: {number}, {name}, {hash} (default: 'frame-{number}') */
  namingPattern?: string;
  /** Prefix for filenames */
  prefix?: string;
  /** Suffix for filenames (before extension) */
  suffix?: string;
  /** Image format (default: 'png') */
  format?: 'png' | 'jpeg' | 'webp';
  /** Quality for lossy formats (0-100, default: 90) */
  quality?: number;
  /** Start frame (default: 0) */
  startFrame?: number;
  /** End frame (default: total frames) */
  endFrame?: number;
  /** Number of concurrent browser instances for parallel capture (default: 1) */
  concurrency?: number;
  /** Preserve alpha channel for PNG format (default: false) */
  includeAlpha?: boolean;
  /** Embed metadata in frames via FFmpeg (default: false) */
  embedMetadata?: boolean;
  /** Generate a JSON manifest listing all exported frames (default: false) */
  generateManifest?: boolean;
  /** Playwright launch options */
  playwrightOptions?: PlaywrightLaunchOptions;
  /** Time to wait after rendering before capturing (ms, default: 50) */
  renderWaitTime?: number;
  /** Progress callback */
  onProgress?: (progress: RenderProgress) => void;
}

/**
 * Entry in the image sequence manifest
 */
export interface ImageSequenceManifestFrame {
  /** Frame number */
  frame: number;
  /** Filename */
  filename: string;
  /** File size in bytes */
  fileSize: number;
  /** Image format */
  format: 'png' | 'jpeg' | 'webp';
}

/**
 * Image sequence export manifest
 */
export interface ImageSequenceManifest {
  /** Template name */
  templateName: string;
  /** Output dimensions */
  width: number;
  /** Output dimensions */
  height: number;
  /** Frames per second */
  fps: number;
  /** Image format */
  format: 'png' | 'jpeg' | 'webp';
  /** Quality setting */
  quality: number;
  /** Total number of frames */
  totalFrames: number;
  /** Frame range */
  startFrame: number;
  /** Frame range */
  endFrame: number;
  /** Total file size in bytes */
  totalSize: number;
  /** Export timestamp */
  exportedAt: string;
  /** List of exported frames */
  frames: ImageSequenceManifestFrame[];
}

/**
 * Options for GIF rendering with optimization support
 */
export interface GifRenderOptions {
  /** The template to render */
  template: Template;
  /** Input values for template variables */
  inputs?: Record<string, unknown>;
  /** Output file path */
  outputPath: string;
  /** Number of colors (2-256, default: 256) */
  colors?: number;
  /** Dithering algorithm (default: 'floyd_steinberg') */
  dither?: 'none' | 'floyd_steinberg' | 'bayer';
  /** Loop count (0 = infinite loop, -1 = no loop, N = loop N times, default: 0) */
  loop?: number;
  /** Optimization level (default: 'basic') */
  optimizationLevel?: 'none' | 'basic' | 'aggressive';
  /** Target max file size in bytes (will adjust colors to try to meet target) */
  maxFileSize?: number;
  /** Override width (default: from template) */
  width?: number;
  /** Override height (default: from template) */
  height?: number;
  /** Override fps (default: from template) */
  fps?: number;
  /** Temporary directory for frame storage */
  tempDir?: string;
  /** Keep temporary files after rendering (default: false) */
  keepTempFiles?: boolean;
  /** Playwright launch options */
  playwrightOptions?: PlaywrightLaunchOptions;
  /** Time to wait after rendering before capturing (ms, default: 50) */
  renderWaitTime?: number;
  /** Progress callback */
  onProgress?: (progress: RenderProgress) => void;
  /** Frame rendered callback */
  onFrame?: (frame: number, total: number) => void;
  /** Number of concurrent browser instances for parallel rendering (default: 1) */
  concurrency?: number;
}

/**
 * Node renderer options
 */
export interface NodeRendererOptions {
  /** FFmpeg configuration */
  ffmpeg?: FFmpegConfig;
  /** Default Playwright options */
  playwrightOptions?: PlaywrightLaunchOptions;
  /** Default temporary directory */
  tempDir?: string;
  /** Number of concurrent browser instances for parallel rendering (default: 1) */
  concurrency?: number;
  /** Custom component registry */
  registry?: ComponentRegistry;
  /** GPU acceleration configuration */
  gpu?: GPUConfig;
  /** Component defaults manager for prop resolution and validation */
  componentDefaultsManager?: import('@rendervid/core').ComponentDefaultsManager;
}
