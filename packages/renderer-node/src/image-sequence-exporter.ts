import { promises as fs } from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { getCompositionDuration, TemplateProcessor, ComponentPropsResolver, getDefaultRegistry } from '@rendervid/core';
import type { Template, ComponentRegistry } from '@rendervid/core';
import { FrameCapturer, createFrameCapturer } from './frame-capturer';
import type {
  ImageSequenceExportOptions,
  ImageSequenceManifest,
  ImageSequenceManifestFrame,
  RenderProgress,
  RenderResult,
  GPUConfig,
} from './types';

/**
 * Generate a filename for a frame based on the naming pattern and options.
 */
export function generateFrameFilename(
  frame: number,
  options: {
    namingPattern?: string;
    prefix?: string;
    suffix?: string;
    format: 'png' | 'jpeg' | 'webp';
    templateName?: string;
  }
): string {
  const { namingPattern = 'frame-{number}', prefix = '', suffix = '', format, templateName = 'template' } = options;

  // Pad frame number to 5 digits by default
  const paddedNumber = frame.toString().padStart(5, '0');

  // Generate a hash based on frame number + template name
  const hash = createHash('md5')
    .update(`${templateName}-${frame}`)
    .digest('hex')
    .slice(0, 8);

  // Sanitize template name for use in filenames
  const safeName = templateName.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Replace tokens in the naming pattern
  let filename = namingPattern
    .replace(/\{number\}/g, paddedNumber)
    .replace(/\{name\}/g, safeName)
    .replace(/\{hash\}/g, hash);

  // Also support printf-style %05d patterns
  filename = filename.replace(/%0?(\d+)d/, (_, digits) => {
    return frame.toString().padStart(parseInt(digits) || 1, '0');
  });

  // Apply prefix and suffix
  filename = `${prefix}${filename}${suffix}`;

  // Add extension
  const ext = format === 'jpeg' ? 'jpg' : format;
  return `${filename}.${ext}`;
}

/**
 * Validate frame range against total frames.
 */
export function validateFrameRange(
  startFrame: number,
  endFrame: number,
  totalFrames: number
): { valid: boolean; error?: string } {
  if (startFrame < 0) {
    return { valid: false, error: `Start frame (${startFrame}) must be non-negative` };
  }
  if (endFrame <= startFrame) {
    return { valid: false, error: `End frame (${endFrame}) must be greater than start frame (${startFrame})` };
  }
  if (startFrame >= totalFrames) {
    return { valid: false, error: `Start frame (${startFrame}) exceeds total frames (${totalFrames})` };
  }
  if (endFrame > totalFrames) {
    return { valid: false, error: `End frame (${endFrame}) exceeds total frames (${totalFrames})` };
  }
  return { valid: true };
}

/**
 * Image sequence exporter that wraps and enhances NodeRenderer.renderSequence().
 *
 * Features:
 * - Configurable naming patterns with token support ({number}, {name}, {hash})
 * - Parallel frame capture via multiple FrameCapturer instances
 * - WebP format support
 * - Frame range selection with validation
 * - Progress reporting with ETA
 * - Output manifest file (JSON listing all exported frames with metadata)
 */
export class ImageSequenceExporter {
  private registry: ComponentRegistry;
  private templateProcessor: TemplateProcessor;
  private componentPropsResolver: ComponentPropsResolver;
  private gpuConfig: GPUConfig;

  constructor(options?: { registry?: ComponentRegistry; gpu?: GPUConfig }) {
    this.registry = options?.registry || getDefaultRegistry();
    this.templateProcessor = new TemplateProcessor();
    this.componentPropsResolver = new ComponentPropsResolver();
    this.gpuConfig = {
      rendering: options?.gpu?.rendering ?? true,
      encoding: options?.gpu?.encoding ?? 'auto',
      fallback: options?.gpu?.fallback ?? true,
    };
  }

  /**
   * Resolve template variables with inputs (same pattern as NodeRenderer)
   */
  private resolveTemplate(template: Template, inputs: Record<string, unknown> = {}): Template {
    const mergedInputs = { ...template.defaults, ...inputs };
    return this.templateProcessor.resolveInputs(template, mergedInputs);
  }

  /**
   * Export a template as an image sequence.
   */
  async export(options: ImageSequenceExportOptions): Promise<RenderResult> {
    const startTime = Date.now();
    const {
      template,
      inputs = {},
      outputDir,
      namingPattern = 'frame-{number}',
      prefix = '',
      suffix = '',
      format = 'png',
      quality = 90,
      startFrame: userStartFrame = 0,
      concurrency = 1,
      includeAlpha = false,
      embedMetadata = false,
      generateManifest = false,
      playwrightOptions,
      renderWaitTime,
      onProgress,
    } = options;

    // Resolve template
    const resolvedTemplate = this.resolveTemplate(template, inputs);
    const { width, height, fps = 30 } = resolvedTemplate.output;
    const totalFrames = getCompositionDuration(resolvedTemplate.composition);
    const startFrame = userStartFrame;
    const endFrame = options.endFrame ?? totalFrames;

    // Validate frame range
    const validation = validateFrameRange(startFrame, endFrame, totalFrames);
    if (!validation.valid) {
      return {
        success: false,
        outputPath: outputDir,
        width,
        height,
        renderTime: Date.now() - startTime,
        error: validation.error,
      };
    }

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    const capturers: FrameCapturer[] = [];
    const framesToRender = endFrame - startFrame;
    const manifestFrames: ImageSequenceManifestFrame[] = [];
    let totalSize = 0;
    let frameCount = 0;

    try {
      // Initialize capturers (multiple for parallel rendering)
      const numCapturers = Math.min(concurrency, framesToRender);
      for (let i = 0; i < numCapturers; i++) {
        const capturer = createFrameCapturer({
          template: resolvedTemplate,
          inputs: {},
          playwrightOptions,
          renderWaitTime,
          registry: this.registry,
          useGPU: this.gpuConfig.rendering,
        });
        await capturer.initialize();
        capturers.push(capturer);
      }

      // Report preparing phase
      if (onProgress) {
        onProgress({
          phase: 'preparing',
          currentFrame: 0,
          totalFrames: framesToRender,
          percent: 0,
          elapsed: (Date.now() - startTime) / 1000,
        });
      }

      const renderStartTime = Date.now();

      if (numCapturers === 1) {
        // Sequential rendering
        const capturer = capturers[0];
        for (let frame = startFrame; frame < endFrame; frame++) {
          const filename = generateFrameFilename(frame, {
            namingPattern,
            prefix,
            suffix,
            format,
            templateName: resolvedTemplate.name,
          });
          const filePath = path.join(outputDir, filename);

          // Capture frame in the requested format
          const imageBuffer = await this.captureInFormat(capturer, frame, format, quality);
          await fs.writeFile(filePath, imageBuffer);

          const fileSize = imageBuffer.length;
          totalSize += fileSize;
          frameCount++;

          if (generateManifest) {
            manifestFrames.push({ frame, filename, fileSize, format });
          }

          this.reportProgress(onProgress, frameCount, framesToRender, startTime, renderStartTime);
        }
      } else {
        // Parallel rendering - maintain frame order for manifest
        let currentFrame = startFrame;

        while (currentFrame < endFrame) {
          const batch: Array<{ frame: number; capturerIndex: number }> = [];
          for (let i = 0; i < numCapturers && currentFrame < endFrame; i++) {
            batch.push({ frame: currentFrame, capturerIndex: i });
            currentFrame++;
          }

          const results = await Promise.all(
            batch.map(async ({ frame, capturerIndex }) => {
              const capturer = capturers[capturerIndex];
              const filename = generateFrameFilename(frame, {
                namingPattern,
                prefix,
                suffix,
                format,
                templateName: resolvedTemplate.name,
              });
              const filePath = path.join(outputDir, filename);

              const imageBuffer = await this.captureInFormat(capturer, frame, format, quality);
              await fs.writeFile(filePath, imageBuffer);

              const fileSize = imageBuffer.length;
              return { frame, filename, fileSize, format } as ImageSequenceManifestFrame;
            })
          );

          for (const result of results) {
            totalSize += result.fileSize;
            frameCount++;
            if (generateManifest) {
              manifestFrames.push(result);
            }
          }

          this.reportProgress(onProgress, frameCount, framesToRender, startTime, renderStartTime);
        }
      }

      // Close all capturers
      await Promise.all(capturers.map(c => c.close()));
      capturers.length = 0;

      // Generate manifest file
      if (generateManifest) {
        // Sort manifest frames by frame number
        manifestFrames.sort((a, b) => a.frame - b.frame);

        const manifest: ImageSequenceManifest = {
          templateName: resolvedTemplate.name || 'untitled',
          width,
          height,
          fps,
          format,
          quality,
          totalFrames: frameCount,
          startFrame,
          endFrame,
          totalSize,
          exportedAt: new Date().toISOString(),
          frames: manifestFrames,
        };

        const manifestPath = path.join(outputDir, 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
      }

      // Report completion
      if (onProgress) {
        onProgress({
          phase: 'complete',
          currentFrame: framesToRender,
          totalFrames: framesToRender,
          percent: 100,
          elapsed: (Date.now() - startTime) / 1000,
        });
      }

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
      await Promise.all(capturers.map(c => c.close().catch(() => {})));

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
   * Capture a frame in the specified format.
   */
  private async captureInFormat(
    capturer: FrameCapturer,
    frame: number,
    format: 'png' | 'jpeg' | 'webp',
    quality: number
  ): Promise<Buffer> {
    switch (format) {
      case 'jpeg':
        return capturer.captureFrameJpeg(frame, quality);
      case 'webp':
        return capturer.captureFrameWebp(frame, quality);
      case 'png':
      default:
        return capturer.captureFrame(frame);
    }
  }

  /**
   * Report render progress with ETA calculation.
   */
  private reportProgress(
    onProgress: ((progress: RenderProgress) => void) | undefined,
    completedFrames: number,
    totalFrames: number,
    startTime: number,
    renderStartTime: number
  ): void {
    if (!onProgress) return;

    const elapsed = (Date.now() - startTime) / 1000;
    const renderElapsed = (Date.now() - renderStartTime) / 1000;
    const fps = renderElapsed > 0 ? completedFrames / renderElapsed : 0;
    const remainingFrames = totalFrames - completedFrames;
    const eta = fps > 0 ? remainingFrames / fps : undefined;

    onProgress({
      phase: 'rendering',
      currentFrame: completedFrames,
      totalFrames,
      percent: (completedFrames / totalFrames) * 100,
      eta,
      elapsed,
      fps,
    });
  }
}

/**
 * Create an image sequence exporter
 */
export function createImageSequenceExporter(options?: {
  registry?: ComponentRegistry;
  gpu?: GPUConfig;
}): ImageSequenceExporter {
  return new ImageSequenceExporter(options);
}
