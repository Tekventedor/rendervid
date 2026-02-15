// Main renderer
export { NodeRenderer, createNodeRenderer } from './NodeRenderer';

// Frame capturer
export { FrameCapturer, createFrameCapturer } from './frame-capturer';
export type { FrameCapturerConfig } from './frame-capturer';

// FFmpeg encoder
export { FFmpegEncoder, createFFmpegEncoder } from './ffmpeg-encoder';
export type { EncodeOptions, GifOptions, HardwareAccelerationOptions } from './ffmpeg-encoder';

// Image sequence exporter
export { ImageSequenceExporter, createImageSequenceExporter } from './image-sequence-exporter';
export { generateFrameFilename, validateFrameRange } from './image-sequence-exporter';

// Audio effects FFmpeg converter
export {
  buildAudioFilterGraph,
  buildTrackFilterChain,
  effectsToFFmpegFilters,
  volumeEnvelopeToFFmpeg,
  eqToFFmpeg,
  reverbToFFmpeg,
  compressorToFFmpeg,
  delayToFFmpeg,
  gainToFFmpeg,
  lowpassToFFmpeg,
  highpassToFFmpeg,
} from './audio-effects-ffmpeg';

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
  GifRenderOptions,
  ImageSequenceExportOptions,
  ImageSequenceManifest,
  ImageSequenceManifestFrame,
} from './types';
