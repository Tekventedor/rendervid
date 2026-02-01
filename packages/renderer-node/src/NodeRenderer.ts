import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { getCompositionDuration } from '@rendervid/core';
import type { Template } from '@rendervid/core';
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

/**
 * Node.js renderer using Puppeteer and FFmpeg
 */
export class NodeRenderer {
  private options: NodeRendererOptions;
  private ffmpegEncoder: FFmpegEncoder;

  constructor(options: NodeRendererOptions = {}) {
    this.options = options;
    this.ffmpegEncoder = createFFmpegEncoder(options.ffmpeg);
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
      onProgress,
      onFrame,
    } = options;

    const { width, height, fps = 30 } = template.output;
    const totalFrames = getCompositionDuration(template.composition);

    if (totalFrames === 0) {
      throw new Error('Template has no frames to render');
    }

    // Create temp directory
    const workDir = tempDir || await fs.mkdtemp(path.join(os.tmpdir(), 'rendervid-'));
    const framesDir = path.join(workDir, 'frames');
    await fs.mkdir(framesDir, { recursive: true });

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    let capturer: FrameCapturer | null = null;

    try {
      // Initialize frame capturer
      capturer = createFrameCapturer({
        template,
        inputs,
        puppeteerOptions,
      });
      await capturer.initialize();

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

      // Capture all frames
      for (let frame = 0; frame < totalFrames; frame++) {
        const frameBuffer = await capturer.captureFrame(frame);
        const framePath = path.join(framesDir, `frame-${frame.toString().padStart(6, '0')}.png`);
        await fs.writeFile(framePath, frameBuffer);

        if (onFrame) {
          onFrame(frame, totalFrames);
        }

        if (onProgress) {
          const elapsed = (Date.now() - startTime) / 1000;
          const fps = frame / elapsed;
          const remainingFrames = totalFrames - frame - 1;
          const eta = fps > 0 ? remainingFrames / fps : undefined;

          onProgress({
            phase: 'rendering',
            currentFrame: frame + 1,
            totalFrames,
            percent: ((frame + 1) / totalFrames) * 50, // 50% for rendering
            eta,
            elapsed,
            fps,
          });
        }
      }

      // Close capturer
      await capturer.close();
      capturer = null;

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

      // Get file stats
      const fileSize = await this.ffmpegEncoder.getFileSize(outputPath);
      const duration = totalFrames / fps;

      // Clean up temp files
      if (!keepTempFiles) {
        await fs.rm(workDir, { recursive: true, force: true });
      }

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
      if (capturer) {
        await capturer.close().catch(() => {});
      }
      if (!keepTempFiles && tempDir !== workDir) {
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
    } = options;

    const { width, height } = template.output;

    // Determine format from extension if not specified
    const ext = path.extname(outputPath).toLowerCase().slice(1);
    const imageFormat = format || (ext as 'png' | 'jpeg' | 'webp') || 'png';

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    let capturer: FrameCapturer | null = null;

    try {
      // Initialize frame capturer
      capturer = createFrameCapturer({
        template,
        inputs,
        puppeteerOptions,
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
      onProgress,
    } = options;

    const { width, height, fps = 30 } = template.output;
    const totalFrames = getCompositionDuration(template.composition);
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
        template,
        inputs,
        puppeteerOptions,
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
