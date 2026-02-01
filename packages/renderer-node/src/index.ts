// Main renderer
export { NodeRenderer, createNodeRenderer } from './NodeRenderer';

// Frame capturer
export { FrameCapturer, createFrameCapturer } from './frame-capturer';
export type { FrameCapturerConfig } from './frame-capturer';

// FFmpeg encoder
export { FFmpegEncoder, createFFmpegEncoder } from './ffmpeg-encoder';
export type { EncodeOptions, GifOptions } from './ffmpeg-encoder';

// Types
export type {
  VideoRenderOptions,
  ImageRenderOptions,
  SequenceRenderOptions,
  PuppeteerLaunchOptions,
  RenderProgress,
  RenderResult,
  FFmpegConfig,
  NodeRendererOptions,
} from './types';
