import React, { CSSProperties } from 'react';
import { ComponentRegistry, Template, Scene, ImageLayer as ImageLayer$1, TextLayer as TextLayer$1, VideoLayer as VideoLayer$1, ShapeLayer as ShapeLayer$1, AudioLayer as AudioLayer$1, GroupLayer as GroupLayer$1, LottieLayer as LottieLayer$1, CustomLayer as CustomLayer$1, ThreeLayer as ThreeLayer$1, Layer, AnimatableProperties, LayerStyle, ResolvedStyle } from '@rendervid/core';
export { ResolvedStyle } from '@rendervid/core';
import * as react_jsx_runtime from 'react/jsx-runtime';

type CustomComponentType$3 = React.ComponentType<any>;
interface BrowserRendererOptions {
    /** Target container element */
    container?: HTMLElement;
    /** Custom component registry */
    registry?: ComponentRegistry;
    /** Whether to use WebCodecs (falls back to MediaRecorder if unavailable) */
    preferWebCodecs?: boolean;
}
interface RenderVideoOptions {
    /** Template to render */
    template: Template;
    /** Input values for template variables */
    inputs?: Record<string, unknown>;
    /** Output format */
    format?: 'mp4' | 'webm';
    /** Video bitrate in bits per second */
    bitrate?: number;
    /** Progress callback */
    onProgress?: (progress: RenderProgress) => void;
    /** Frame callback (called after each frame is captured) */
    onFrame?: (frame: number, totalFrames: number) => void;
}
interface RenderImageOptions {
    /** Template to render */
    template: Template;
    /** Input values for template variables */
    inputs?: Record<string, unknown>;
    /** Scene index to render (default: 0) */
    sceneIndex?: number;
    /** Frame to render (default: 0) */
    frame?: number;
    /** Output format */
    format?: 'png' | 'jpeg' | 'webp';
    /** Quality (0-1, only for jpeg/webp) */
    quality?: number;
}
interface RenderProgress {
    /** Current frame being rendered */
    currentFrame: number;
    /** Total frames to render */
    totalFrames: number;
    /** Progress percentage (0-100) */
    percentage: number;
    /** Current phase */
    phase: 'capturing' | 'encoding' | 'muxing' | 'complete';
    /** Estimated time remaining in seconds */
    estimatedTimeRemaining?: number;
}
interface VideoResult {
    /** Video blob */
    blob: Blob;
    /** Duration in seconds */
    duration: number;
    /** Frame count */
    frameCount: number;
    /** File size in bytes */
    size: number;
    /** MIME type */
    mimeType: string;
}
interface ImageResult {
    /** Image blob */
    blob: Blob;
    /** Width */
    width: number;
    /** Height */
    height: number;
    /** File size in bytes */
    size: number;
    /** MIME type */
    mimeType: string;
}
/**
 * Browser-based renderer for Rendervid templates.
 * Uses React for DOM rendering and WebCodecs/MediaRecorder for video encoding.
 */
declare class BrowserRenderer {
    private options;
    private container;
    private root;
    private isRendering;
    private registry;
    private processor;
    constructor(options?: BrowserRendererOptions);
    private createContainer;
    /**
     * Get the component registry.
     */
    getRegistry(): ComponentRegistry;
    /**
     * Register a custom component.
     */
    registerComponent(name: string, component: CustomComponentType$3): void;
    /**
     * Check if WebCodecs is supported for high-quality encoding.
     */
    isWebCodecsSupported(): boolean;
    /**
     * Render a template to video.
     */
    renderVideo(options: RenderVideoOptions): Promise<VideoResult>;
    private renderWithWebCodecs;
    private renderWithMediaRecorder;
    private renderFrame;
    /**
     * Render a single frame as an image.
     */
    renderImage(options: RenderImageOptions): Promise<ImageResult>;
    /**
     * Load fonts from template configuration.
     *
     * @private
     */
    private loadFonts;
    /**
     * Dispose of the renderer and clean up resources.
     */
    dispose(): void;
}
/**
 * Create a new BrowserRenderer instance.
 */
declare function createBrowserRenderer(options?: BrowserRendererOptions): BrowserRenderer;

interface SceneRendererProps {
    /** Scene to render */
    scene: Scene;
    /** Current frame number */
    frame: number;
    /** Frames per second */
    fps: number;
    /** Output width */
    width: number;
    /** Output height */
    height: number;
    /** Whether the scene is playing (for audio/video sync) */
    isPlaying?: boolean;
    /** Custom component registry */
    registry?: ComponentRegistry;
}
/**
 * Renders a complete scene with all its layers.
 */
declare function SceneRenderer({ scene, frame, fps, width, height, isPlaying, registry, }: SceneRendererProps): react_jsx_runtime.JSX.Element;
interface TemplateRendererProps {
    /** Template scenes */
    scenes: Scene[];
    /** Current frame number (global) */
    frame: number;
    /** Frames per second */
    fps: number;
    /** Output width */
    width: number;
    /** Output height */
    height: number;
    /** Whether the scene is playing */
    isPlaying?: boolean;
    /** Custom component registry */
    registry?: ComponentRegistry;
}
/**
 * Renders the appropriate scene based on the current frame with transition support.
 */
declare function TemplateRenderer({ scenes, frame, fps, width, height, isPlaying, registry, }: TemplateRendererProps): react_jsx_runtime.JSX.Element;
/**
 * Calculate total duration of all scenes in seconds.
 */
declare function calculateTotalDuration(scenes: Scene[]): number;
/**
 * Calculate total frames for all scenes.
 */
declare function calculateTotalFrames(scenes: Scene[], _fps: number): number;
/**
 * Get scene at specific frame.
 */
declare function getSceneAtFrame(scenes: Scene[], frame: number, _fps: number): {
    scene: Scene;
    localFrame: number;
    sceneIndex: number;
} | null;

interface ImageLayerProps {
    layer: ImageLayer$1;
    frame: number;
    fps: number;
    sceneDuration: number;
}
declare function ImageLayer({ layer, frame, fps, sceneDuration }: ImageLayerProps): react_jsx_runtime.JSX.Element | null;

interface TextLayerProps {
    layer: TextLayer$1;
    frame: number;
    fps: number;
    sceneDuration: number;
}
declare function TextLayer({ layer, frame, fps, sceneDuration }: TextLayerProps): react_jsx_runtime.JSX.Element;

interface VideoLayerProps {
    layer: VideoLayer$1;
    frame: number;
    fps: number;
    sceneDuration: number;
    isPlaying?: boolean;
}
declare function VideoLayer({ layer, frame, fps, sceneDuration, isPlaying }: VideoLayerProps): react_jsx_runtime.JSX.Element | null;

interface ShapeLayerProps {
    layer: ShapeLayer$1;
    frame: number;
    fps: number;
    sceneDuration: number;
}
declare function ShapeLayer({ layer, frame, fps, sceneDuration }: ShapeLayerProps): react_jsx_runtime.JSX.Element;

interface AudioLayerProps {
    layer: AudioLayer$1;
    frame: number;
    fps: number;
    sceneDuration: number;
    isPlaying?: boolean;
}
declare function AudioLayer({ layer, frame, fps, sceneDuration, isPlaying }: AudioLayerProps): react_jsx_runtime.JSX.Element | null;

type CustomComponentType$2 = React.ComponentType<any>;
interface GroupLayerProps {
    layer: GroupLayer$1;
    frame: number;
    fps: number;
    sceneDuration: number;
    isPlaying?: boolean;
    registry?: Map<string, CustomComponentType$2>;
}
declare function GroupLayer({ layer, frame, fps, sceneDuration, isPlaying, registry, }: GroupLayerProps): react_jsx_runtime.JSX.Element;

interface LottieLayerProps {
    layer: LottieLayer$1;
    frame: number;
    fps: number;
    sceneDuration: number;
}
declare function LottieLayer({ layer, frame, fps, sceneDuration }: LottieLayerProps): react_jsx_runtime.JSX.Element;

type CustomComponentType$1 = React.ComponentType<any>;
interface CustomLayerProps {
    layer: CustomLayer$1;
    frame: number;
    fps: number;
    sceneDuration: number;
    registry?: Map<string, CustomComponentType$1>;
}
declare function CustomLayer({ layer, frame, fps, sceneDuration, registry, }: CustomLayerProps): react_jsx_runtime.JSX.Element | null;

interface ThreeLayerProps {
    layer: ThreeLayer$1;
    frame: number;
    fps: number;
    sceneDuration: number;
}
/**
 * Three.js 3D scene layer renderer.
 * Renders a 3D scene using React Three Fiber.
 */
declare function ThreeLayer({ layer, frame, fps, sceneDuration }: ThreeLayerProps): react_jsx_runtime.JSX.Element;

type CustomComponentType = React.ComponentType<any>;
interface LayerRendererProps {
    layer: Layer;
    frame: number;
    fps: number;
    sceneDuration: number;
    isPlaying?: boolean;
    registry?: Map<string, CustomComponentType>;
}
/**
 * Renders a layer based on its type.
 */
declare function LayerRenderer({ layer, frame, fps, sceneDuration, isPlaying, registry, }: LayerRendererProps): react_jsx_runtime.JSX.Element | null;

interface UseLayerAnimationResult {
    style: CSSProperties;
    properties: AnimatableProperties;
}
/**
 * Hook to calculate animated properties for a layer at a specific frame.
 */
declare function useLayerAnimation(layer: Layer, frame: number, fps: number, sceneDuration: number): UseLayerAnimationResult;

/**
 * Resolve LayerStyle to CSSProperties.
 */
declare function resolveStyle(style: LayerStyle): CSSProperties;
/**
 * Merge className with resolved LayerStyle.
 */
declare function mergeStyles(className?: string, style?: LayerStyle): ResolvedStyle;
/**
 * Get the style class name (for external CSS class support).
 * This is a pass-through for now, but could be extended to support
 * utility class transformations (e.g., Tailwind-to-CSS).
 */
declare function getStyleClassName(className: string): string;

interface CaptureOptions {
    /** Target element to capture */
    element: HTMLElement;
    /** Output width */
    width: number;
    /** Output height */
    height: number;
    /** Background color (default: transparent) */
    backgroundColor?: string;
    /** Scale factor for high-DPI capture */
    scale?: number;
    /** Whether to use CORS for images */
    useCORS?: boolean;
    /** Proxy URL for cross-origin images */
    proxy?: string;
}
interface CaptureResult {
    /** Captured canvas element */
    canvas: HTMLCanvasElement;
    /** Capture time in milliseconds */
    captureTime: number;
}
interface FrameCapturer {
    /** Capture a single frame */
    captureFrame(options: CaptureOptions): Promise<CaptureResult>;
    /** Capture frame as ImageData */
    captureFrameData(options: CaptureOptions): Promise<ImageData>;
    /** Capture frame as Blob */
    captureFrameBlob(options: CaptureOptions, format?: string, quality?: number): Promise<Blob>;
    /** Capture frame as data URL */
    captureFrameDataURL(options: CaptureOptions, format?: string, quality?: number): Promise<string>;
}
/**
 * Frame capturer using html2canvas for DOM-to-canvas conversion.
 */
declare function createFrameCapturer(): FrameCapturer;
/**
 * Optimized capturer using OffscreenCanvas for better performance.
 * Falls back to regular canvas if OffscreenCanvas is not supported.
 */
declare function createOffscreenCapturer(): FrameCapturer;

interface WebCodecsEncoderOptions {
    /** Output width */
    width: number;
    /** Output height */
    height: number;
    /** Frame rate */
    fps: number;
    /** Bitrate in bits per second */
    bitrate?: number;
    /** Codec to use (default: 'avc1.42001f' for H.264) */
    codec?: string;
    /** Hardware acceleration preference */
    hardwareAcceleration?: 'no-preference' | 'prefer-hardware' | 'prefer-software';
    /** Latency mode */
    latencyMode?: 'quality' | 'realtime';
}
interface EncodedChunk {
    /** Chunk data */
    data: Uint8Array;
    /** Timestamp in microseconds */
    timestamp: number;
    /** Duration in microseconds */
    duration: number;
    /** Whether this is a keyframe */
    isKeyframe: boolean;
}
interface WebCodecsEncoder {
    /** Check if WebCodecs is supported */
    isSupported(): boolean;
    /** Initialize the encoder */
    initialize(): Promise<void>;
    /** Encode a frame */
    encodeFrame(frame: VideoFrame | ImageBitmap | HTMLCanvasElement, timestamp: number): Promise<void>;
    /** Flush remaining frames */
    flush(): Promise<void>;
    /** Get encoded chunks */
    getChunks(): EncodedChunk[];
    /** Close the encoder */
    close(): void;
    /** Get encoder configuration */
    getConfig(): VideoEncoderConfig;
}
/**
 * Check if WebCodecs API is supported in the current environment.
 */
declare function isWebCodecsSupported(): boolean;
/**
 * Get recommended codec for the given configuration.
 */
declare function getRecommendedCodec(width: number, height: number): string;
/**
 * Create a WebCodecs-based video encoder.
 */
declare function createWebCodecsEncoder(options: WebCodecsEncoderOptions): WebCodecsEncoder;
/**
 * Create a VideoFrame from an HTMLCanvasElement.
 */
declare function canvasToVideoFrame(canvas: HTMLCanvasElement, timestamp: number, fps: number): VideoFrame;

interface MediaRecorderEncoderOptions {
    /** Canvas to record from */
    canvas: HTMLCanvasElement;
    /** Frame rate */
    fps: number;
    /** Video bitrate in bits per second */
    videoBitrate?: number;
    /** Audio bitrate in bits per second */
    audioBitrate?: number;
    /** MIME type (default: 'video/webm;codecs=vp9') */
    mimeType?: string;
    /** Audio tracks to include */
    audioTracks?: MediaStreamTrack[];
}
interface MediaRecorderEncoder {
    /** Check if the MIME type is supported */
    isSupported(): boolean;
    /** Start recording */
    start(): void;
    /** Stop recording */
    stop(): Promise<Blob>;
    /** Pause recording */
    pause(): void;
    /** Resume recording */
    resume(): void;
    /** Get current state */
    getState(): RecordingState;
    /** Add audio track */
    addAudioTrack(track: MediaStreamTrack): void;
}
/**
 * Get the best supported MIME type for video recording.
 */
declare function getBestMimeType(): string;
/**
 * Check if MediaRecorder is supported.
 */
declare function isMediaRecorderSupported(): boolean;
/**
 * Create a MediaRecorder-based video encoder.
 * This is a fallback for browsers that don't support WebCodecs.
 */
declare function createMediaRecorderEncoder(options: MediaRecorderEncoderOptions): MediaRecorderEncoder;
/**
 * Create a canvas-based frame-by-frame recorder.
 * This provides more control over frame timing compared to MediaRecorder.
 */
interface FrameByFrameRecorderOptions {
    /** Output width */
    width: number;
    /** Output height */
    height: number;
    /** Frame rate */
    fps: number;
    /** MIME type for frames (default: 'image/webp') */
    frameMimeType?: string;
    /** Frame quality (0-1) */
    frameQuality?: number;
}
interface FrameByFrameRecorder {
    /** Add a frame */
    addFrame(canvas: HTMLCanvasElement): Promise<void>;
    /** Get all frames as blobs */
    getFrames(): Blob[];
    /** Get frame count */
    getFrameCount(): number;
    /** Clear all frames */
    clear(): void;
}
declare function createFrameByFrameRecorder(options: FrameByFrameRecorderOptions): FrameByFrameRecorder;

interface MuxerOptions {
    /** Output width */
    width: number;
    /** Output height */
    height: number;
    /** Frame rate */
    fps: number;
    /** Video codec (default: 'avc') */
    videoCodec?: 'avc' | 'hevc' | 'vp9' | 'av1';
    /** Audio codec (default: 'aac') */
    audioCodec?: 'aac' | 'opus';
    /** Audio sample rate */
    audioSampleRate?: number;
    /** Number of audio channels */
    audioChannels?: number;
}
interface AudioChunk {
    /** Audio data */
    data: Uint8Array;
    /** Timestamp in microseconds */
    timestamp: number;
    /** Duration in microseconds */
    duration: number;
}
interface VideoMuxer {
    /** Add video chunk */
    addVideoChunk(chunk: EncodedChunk): void;
    /** Add audio chunk */
    addAudioChunk(chunk: AudioChunk): void;
    /** Finalize and get output */
    finalize(): Uint8Array;
    /** Get estimated file size */
    getEstimatedSize(): number;
}
/**
 * Create an MP4 muxer for combining video and audio streams.
 */
declare function createMp4Muxer(options: MuxerOptions): VideoMuxer;
/**
 * Create a WebM muxer for VP9/Opus content.
 * This is a simpler alternative when WebM output is acceptable.
 */
interface WebMMuxerOptions {
    /** Output width */
    width: number;
    /** Output height */
    height: number;
    /** Frame rate */
    fps: number;
}
declare function createWebMMuxer(_options: WebMMuxerOptions): VideoMuxer;
/**
 * Helper to convert Blob to ArrayBuffer.
 */
declare function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
/**
 * Helper to convert ArrayBuffer to Blob.
 */
declare function arrayBufferToBlob(buffer: ArrayBuffer, mimeType: string): Blob;
/**
 * Download a blob as a file.
 */
declare function downloadBlob(blob: Blob, filename: string): void;
/**
 * Download an ArrayBuffer as a file.
 */
declare function downloadArrayBuffer(buffer: ArrayBuffer, filename: string, mimeType: string): void;

export { type AudioChunk, AudioLayer, type AudioLayerProps, BrowserRenderer, type BrowserRendererOptions, type CaptureOptions, type CaptureResult, CustomLayer, type CustomLayerProps, type EncodedChunk, type FrameByFrameRecorder, type FrameByFrameRecorderOptions, type FrameCapturer, GroupLayer, type GroupLayerProps, ImageLayer, type ImageLayerProps, type ImageResult, LayerRenderer, type LayerRendererProps, LottieLayer, type LottieLayerProps, type MediaRecorderEncoder, type MediaRecorderEncoderOptions, type MuxerOptions, type RenderImageOptions, type RenderProgress, type RenderVideoOptions, SceneRenderer, type SceneRendererProps, ShapeLayer, type ShapeLayerProps, TemplateRenderer, type TemplateRendererProps, TextLayer, type TextLayerProps, ThreeLayer, type ThreeLayerProps, type UseLayerAnimationResult, VideoLayer, type VideoLayerProps, type VideoMuxer, type VideoResult, type WebCodecsEncoder, type WebCodecsEncoderOptions, type WebMMuxerOptions, arrayBufferToBlob, blobToArrayBuffer, calculateTotalDuration, calculateTotalFrames, canvasToVideoFrame, createBrowserRenderer, createFrameByFrameRecorder, createFrameCapturer, createMediaRecorderEncoder, createMp4Muxer, createOffscreenCapturer, createWebCodecsEncoder, createWebMMuxer, downloadArrayBuffer, downloadBlob, getBestMimeType, getRecommendedCodec, getSceneAtFrame, getStyleClassName, isMediaRecorderSupported, isWebCodecsSupported, mergeStyles, resolveStyle, useLayerAnimation };
