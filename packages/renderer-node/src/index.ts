// Main renderer
export { NodeRenderer, createNodeRenderer } from './NodeRenderer';

// Frame capturer
export { FrameCapturer, createFrameCapturer } from './frame-capturer';
export type { FrameCapturerConfig } from './frame-capturer';

// FFmpeg encoder
export { FFmpegEncoder, createFFmpegEncoder } from './ffmpeg-encoder';
export type { EncodeOptions, GifOptions, HardwareAccelerationOptions } from './ffmpeg-encoder';

// GPU detector
export {
  detectGPUCapabilities,
  isGPUEncoderAvailable,
  getGPUDescription,
} from './gpu-detector';
export type { GPUVendor, HardwareEncoder, GPUInfo } from './gpu-detector';

// Types
export type {
  VideoRenderOptions,
  ImageRenderOptions,
  SequenceRenderOptions,
  PlaywrightLaunchOptions,
  RenderProgress,
  RenderResult,
  FFmpegConfig,
  NodeRendererOptions,
  GPUConfig,
  GPUEncodingType,
} from './types';
