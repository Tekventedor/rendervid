import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { getCompositionDuration, getDefaultRegistry, TemplateProcessor } from '@rendervid/core';
import type { Template, ComponentRegistry } from '@rendervid/core';
import { FrameCapturer, createFrameCapturer } from './frame-capturer';
import { FFmpegEncoder, createFFmpegEncoder } from './ffmpeg-encoder';
import type {
  NodeRendererOptions,
  VideoRenderOptions,
  ImageRenderOptions,
  SequenceRenderOptions,
  RenderResult,
  RenderProgress,
} from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomComponentType = (props: any) => unknown;

/**
 * Node.js renderer using Puppeteer and FFmpeg
 */
export class NodeRenderer {
  private options: NodeRendererOptions;
  private ffmpegEncoder: FFmpegEncoder;
  private registry: ComponentRegistry;
  private templateProcessor: TemplateProcessor;

  constructor(options: NodeRendererOptions = {}) {
    this.options = options;
    this.ffmpegEncoder = createFFmpegEncoder(options.ffmpeg);
    this.registry = options.registry || getDefaultRegistry();
    this.templateProcessor = new TemplateProcessor();
  }

  /**
   * Get the component registry.
   */
  getRegistry(): ComponentRegistry {
    return this.registry;
  }

  /**
   * Register a custom component.
   */
  registerComponent(name: string, component: CustomComponentType): void {
    this.registry.register(name, component);
  }

  /**
   * Resolve template variables with inputs (merging defaults)
   */
  private resolveTemplate(template: Template, inputs: Record<string, unknown> = {}): Template {
    // Merge defaults with provided inputs (provided inputs take precedence)
    const mergedInputs = { ...template.defaults, ...inputs };

    // Resolve {{variable}} placeholders
    return this.templateProcessor.resolveInputs(template, mergedInputs);
  }

  /**
   * Create an async generator that yields frame buffers
   */
  private async *createFrameStream(
    capturers: FrameCapturer[],
    totalFrames: number,
    callbacks?: {
      onFrame?: (frame: number, total: number) => void;
      onProgress?: (progress: RenderProgress) => void;
      startTime?: number;
    }
  ): AsyncGenerator<Buffer> {
    const { onFrame, onProgress, startTime = Date.now() } = callbacks || {};
    const numCapturers = capturers.length;
    let completedFrames = 0;
    const renderStartTime = Date.now();

    if (numCapturers === 1) {
      // Sequential rendering
      const capturer = capturers[0];
      for (let frame = 0; frame < totalFrames; frame++) {
        const frameBuffer = await capturer.captureFrame(frame);
        yield frameBuffer;

        completedFrames++;
        if (onFrame) {
          onFrame(frame, totalFrames);
        }

        if (onProgress) {
          const elapsed = (Date.now() - startTime) / 1000;
          const fps = completedFrames / (Date.now() - renderStartTime) * 1000;
          const remainingFrames = totalFrames - completedFrames;
          const eta = fps > 0 ? remainingFrames / fps : undefined;

          onProgress({
            phase: 'rendering',
            currentFrame: completedFrames,
            totalFrames,
            percent: (completedFrames / totalFrames) * 50,
            eta,
            elapsed,
            fps,
          });
        }
      }
    } else {
      // Parallel rendering - we need to maintain frame order
      const frameBuffers: Map<number, Buffer> = new Map();
      let nextFrameToYield = 0;
      let currentFrame = 0;

      while (nextFrameToYield < totalFrames) {
        // Start batch of parallel captures
        const batch: Array<{ frame: number; capturerIndex: number }> = [];
        while (batch.length < numCapturers && currentFrame < totalFrames) {
          batch.push({ frame: currentFrame, capturerIndex: batch.length });
          currentFrame++;
        }

        // Capture batch in parallel
        await Promise.all(
          batch.map(async ({ frame, capturerIndex }) => {
            const capturer = capturers[capturerIndex];
            const frameBuffer = await capturer.captureFrame(frame);
            frameBuffers.set(frame, frameBuffer);

            if (onFrame) {
              onFrame(frame, totalFrames);
            }
          })
        );

        // Yield frames in order
        while (frameBuffers.has(nextFrameToYield)) {
          const frameBuffer = frameBuffers.get(nextFrameToYield)!;
          frameBuffers.delete(nextFrameToYield);
          yield frameBuffer;

          completedFrames++;
          nextFrameToYield++;

          if (onProgress) {
            const elapsed = (Date.now() - startTime) / 1000;
            const fps = completedFrames / (Date.now() - renderStartTime) * 1000;
            const remainingFrames = totalFrames - completedFrames;
            const eta = fps > 0 ? remainingFrames / fps : undefined;

            onProgress({
              phase: 'rendering',
              currentFrame: completedFrames,
              totalFrames,
              percent: (completedFrames / totalFrames) * 50,
              eta,
              elapsed,
              fps,
            });
          }
        }
      }
    }
  }

  /**
   * Render a video from a template
   */
  async renderVideo(options: VideoRenderOptions): Promise<RenderResult> {
    const startTime = Date.now();
    const {
      template,
      inputs = {},
      outputPath,
      codec = 'libx264',
      quality = 23,
      pixelFormat = 'yuv420p',
      audioCodec = 'aac',
      audioBitrate = '128k',
      tempDir,
      keepTempFiles = false,
      puppeteerOptions = this.options.puppeteerOptions,
      renderWaitTime,
      onProgress,
      onFrame,
      concurrency = this.options.concurrency || 1,
      useStreaming = false,
    } = options;

    // Resolve template variables with inputs
    const resolvedTemplate = this.resolveTemplate(template, inputs);

    const { width, height, fps = 30 } = resolvedTemplate.output;
    const totalFrames = getCompositionDuration(resolvedTemplate.composition);

    if (totalFrames === 0) {
      throw new Error('Template has no frames to render');
    }

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const capturers: FrameCapturer[] = [];
    let workDir: string | undefined;
    let framesDir: string | undefined;

    try {
      // Initialize frame capturers (multiple for parallel rendering)
      const numCapturers = Math.min(concurrency, totalFrames);
      for (let i = 0; i < numCapturers; i++) {
        const capturer = createFrameCapturer({
          template: resolvedTemplate,
          inputs: {},
          puppeteerOptions,
          renderWaitTime,
          registry: this.registry,
        });
        await capturer.initialize();
        capturers.push(capturer);
      }

      // Report preparing phase
      if (onProgress) {
        onProgress({
          phase: 'preparing',
          currentFrame: 0,
          totalFrames,
          percent: 0,
          elapsed: (Date.now() - startTime) / 1000,
        });
      }

      if (useStreaming) {
        // Streaming mode - pipe frames directly to FFmpeg
        const frameStream = this.createFrameStream(capturers, totalFrames, {
          onFrame,
          onProgress,
          startTime,
        });

        await this.ffmpegEncoder.encodeToVideoStream(frameStream, {
          outputPath,
          fps,
          width,
          height,
          codec,
          quality,
          pixelFormat,
          audioCodec,
          audioBitrate,
          onProgress: onProgress ? (progress) => {
            onProgress({
              ...progress,
              percent: 50 + (progress.percent * 0.5), // 50-100% for encoding
            });
          } : undefined,
          startTime,
          totalFrames,
        });

        // Close all capturers
        await Promise.all(capturers.map(c => c.close()));
        capturers.length = 0;
      } else {
        // Non-streaming mode - write frames to disk first
        workDir = tempDir || await fs.mkdtemp(path.join(os.tmpdir(), 'rendervid-'));
        framesDir = path.join(workDir, 'frames');
        await fs.mkdir(framesDir, { recursive: true });

        // Capture frames in parallel
        let completedFrames = 0;
        const renderStartTime = Date.now();

        if (numCapturers === 1) {
          // Single capturer - sequential rendering (original behavior)
          const capturer = capturers[0];
          for (let frame = 0; frame < totalFrames; frame++) {
            const frameBuffer = await capturer.captureFrame(frame);
            const framePath = path.join(framesDir, `frame-${frame.toString().padStart(6, '0')}.png`);
            await fs.writeFile(framePath, frameBuffer);

            completedFrames++;
            if (onFrame) {
              onFrame(frame, totalFrames);
            }

            if (onProgress) {
              const elapsed = (Date.now() - startTime) / 1000;
              const fps = completedFrames / (Date.now() - renderStartTime) * 1000;
              const remainingFrames = totalFrames - completedFrames;
              const eta = fps > 0 ? remainingFrames / fps : undefined;

              onProgress({
                phase: 'rendering',
                currentFrame: completedFrames,
                totalFrames,
                percent: (completedFrames / totalFrames) * 50, // 50% for rendering
                eta,
                elapsed,
                fps,
              });
            }
          }
        } else {
          // Parallel rendering with multiple capturers
          let currentFrame = 0;

          while (currentFrame < totalFrames) {
            // Create batch of frames to process
            const batch: Array<{ frame: number; capturerIndex: number }> = [];
            for (let i = 0; i < numCapturers && currentFrame < totalFrames; i++) {
              batch.push({ frame: currentFrame, capturerIndex: i });
              currentFrame++;
            }

            // Process batch in parallel
            await Promise.all(
              batch.map(async ({ frame, capturerIndex }) => {
                const capturer = capturers[capturerIndex];
                const frameBuffer = await capturer.captureFrame(frame);
                const framePath = path.join(framesDir!, `frame-${frame.toString().padStart(6, '0')}.png`);
                await fs.writeFile(framePath, frameBuffer);

                completedFrames++;
                if (onFrame) {
                  onFrame(frame, totalFrames);
                }

                if (onProgress) {
                  const elapsed = (Date.now() - startTime) / 1000;
                  const fps = completedFrames / (Date.now() - renderStartTime) * 1000;
                  const remainingFrames = totalFrames - completedFrames;
                  const eta = fps > 0 ? remainingFrames / fps : undefined;

                  onProgress({
                    phase: 'rendering',
                    currentFrame: completedFrames,
                    totalFrames,
                    percent: (completedFrames / totalFrames) * 50, // 50% for rendering
                    eta,
                    elapsed,
                    fps,
                  });
                }
              })
            );
          }
        }

        // Close all capturers
        await Promise.all(capturers.map(c => c.close()));
        capturers.length = 0;

        // Encode frames to video with FFmpeg
        const framePattern = path.join(framesDir, 'frame-%06d.png');

        await this.ffmpegEncoder.encodeToVideo({
          inputPattern: framePattern,
          outputPath,
          fps,
          width,
          height,
          codec,
          quality,
          pixelFormat,
          audioCodec,
          audioBitrate,
          onProgress: onProgress ? (progress) => {
            onProgress({
              ...progress,
              percent: 50 + (progress.percent * 0.5), // 50-100% for encoding
            });
          } : undefined,
          startTime,
          totalFrames,
        });

        // Clean up temp files
        if (!keepTempFiles && workDir) {
          await fs.rm(workDir, { recursive: true, force: true });
        }
      }

      // Get file stats
      const fileSize = await this.ffmpegEncoder.getFileSize(outputPath);
      const duration = totalFrames / fps;

      // Report completion
      if (onProgress) {
        onProgress({
          phase: 'complete',
          currentFrame: totalFrames,
          totalFrames,
          percent: 100,
          elapsed: (Date.now() - startTime) / 1000,
        });
      }

      return {
        success: true,
        outputPath,
        duration,
        fileSize,
        width,
        height,
        frameCount: totalFrames,
        renderTime: Date.now() - startTime,
      };
    } catch (error) {
      // Clean up on error
      await Promise.all(capturers.map(c => c.close().catch(() => {})));
      if (!keepTempFiles && workDir && tempDir !== workDir) {
        await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        outputPath,
        width,
        height,
        renderTime: Date.now() - startTime,
        error: errorMessage,
      };
    }
  }

  /**
   * Render a single image from a template
   */
  async renderImage(options: ImageRenderOptions): Promise<RenderResult> {
    const startTime = Date.now();
    const {
      template,
      inputs = {},
      outputPath,
      format,
      quality = 90,
      frame = 0,
      puppeteerOptions = this.options.puppeteerOptions,
      renderWaitTime,
    } = options;

    // Resolve template variables with inputs
    const resolvedTemplate = this.resolveTemplate(template, inputs);

    const { width, height } = resolvedTemplate.output;

    // Determine format from extension if not specified
    const ext = path.extname(outputPath).toLowerCase().slice(1);
    const imageFormat = format || (ext as 'png' | 'jpeg' | 'webp') || 'png';

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    let capturer: FrameCapturer | null = null;

    try {
      // Initialize frame capturer
      capturer = createFrameCapturer({
        template: resolvedTemplate,
        inputs: {},
        puppeteerOptions,
        renderWaitTime,
        registry: this.registry,
      });
      await capturer.initialize();

      // Capture the frame
      let imageBuffer: Buffer;
      if (imageFormat === 'jpeg') {
        imageBuffer = await capturer.captureFrameJpeg(frame, quality);
      } else {
        imageBuffer = await capturer.captureFrame(frame);
      }

      // Write to file
      await fs.writeFile(outputPath, imageBuffer);

      // Add metadata to the image
      try {
        await this.ffmpegEncoder.addImageMetadata(outputPath);
      } catch (error) {
        // If metadata fails, continue (image is still valid)
        console.warn('Failed to add metadata to image:', error);
      }

      // Close capturer
      await capturer.close();

      // Get file size
      const stats = await fs.stat(outputPath);

      return {
        success: true,
        outputPath,
        fileSize: stats.size,
        width,
        height,
        renderTime: Date.now() - startTime,
      };
    } catch (error) {
      if (capturer) {
        await capturer.close().catch(() => {});
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        outputPath,
        width,
        height,
        renderTime: Date.now() - startTime,
        error: errorMessage,
      };
    }
  }

  /**
   * Render a sequence of frames from a template
   */
  async renderSequence(options: SequenceRenderOptions): Promise<RenderResult> {
    const startTime = Date.now();
    const {
      template,
      inputs = {},
      outputDir,
      pattern = 'frame-%05d.png',
      format = 'png',
      quality = 90,
      startFrame = 0,
      puppeteerOptions = this.options.puppeteerOptions,
      renderWaitTime,
      onProgress,
    } = options;

    // Resolve template variables with inputs
    const resolvedTemplate = this.resolveTemplate(template, inputs);

    const { width, height, fps = 30 } = resolvedTemplate.output;
    const totalFrames = getCompositionDuration(resolvedTemplate.composition);
    const endFrame = options.endFrame ?? totalFrames;

    if (startFrame >= endFrame) {
      throw new Error('Start frame must be less than end frame');
    }

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    let capturer: FrameCapturer | null = null;
    let totalSize = 0;
    let frameCount = 0;

    try {
      // Initialize frame capturer
      capturer = createFrameCapturer({
        template: resolvedTemplate,
        inputs: {},
        puppeteerOptions,
        renderWaitTime,
        registry: this.registry,
      });
      await capturer.initialize();

      // Capture frames
      for (let frame = startFrame; frame < endFrame; frame++) {
        // Generate filename from pattern
        const filename = pattern.replace(/%0?(\d+)d/, (_, digits) => {
          return frame.toString().padStart(parseInt(digits) || 1, '0');
        });
        const filePath = path.join(outputDir, filename);

        // Capture frame
        let imageBuffer: Buffer;
        if (format === 'jpeg') {
          imageBuffer = await capturer.captureFrameJpeg(frame, quality);
        } else {
          imageBuffer = await capturer.captureFrame(frame);
        }

        // Write to file
        await fs.writeFile(filePath, imageBuffer);
        totalSize += imageBuffer.length;
        frameCount++;

        // Report progress
        if (onProgress) {
          const elapsed = (Date.now() - startTime) / 1000;
          const fps = frameCount / elapsed;
          const remainingFrames = endFrame - frame - 1;
          const eta = fps > 0 ? remainingFrames / fps : undefined;

          onProgress({
            phase: 'rendering',
            currentFrame: frameCount,
            totalFrames: endFrame - startFrame,
            percent: (frameCount / (endFrame - startFrame)) * 100,
            eta,
            elapsed,
            fps,
          });
        }
      }

      // Close capturer
      await capturer.close();

      return {
        success: true,
        outputPath: outputDir,
        fileSize: totalSize,
        width,
        height,
        frameCount,
        renderTime: Date.now() - startTime,
      };
    } catch (error) {
      if (capturer) {
        await capturer.close().catch(() => {});
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        outputPath: outputDir,
        width,
        height,
        frameCount,
        renderTime: Date.now() - startTime,
        error: errorMessage,
      };
    }
  }

  /**
   * Check if the renderer is available (FFmpeg and Puppeteer)
   */
  async checkAvailability(): Promise<{
    ffmpeg: boolean;
    puppeteer: boolean;
  }> {
    const ffmpegAvailable = await this.ffmpegEncoder.checkFFmpeg();

    // Check Puppeteer by trying to launch
    let puppeteerAvailable = false;
    try {
      const puppeteer = await import('puppeteer');
      const browser = await puppeteer.default.launch({ headless: true });
      await browser.close();
      puppeteerAvailable = true;
    } catch {
      puppeteerAvailable = false;
    }

    return {
      ffmpeg: ffmpegAvailable,
      puppeteer: puppeteerAvailable,
    };
  }
}

/**
 * Create a Node.js renderer
 */
export function createNodeRenderer(options: NodeRendererOptions = {}): NodeRenderer {
  return new NodeRenderer(options);
}
