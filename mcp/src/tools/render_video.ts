import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createNodeRenderer } from '@rendervid/renderer-node';
import type { Template } from '@rendervid/core';
import { RendervidEngine } from '@rendervid/core';
import { RenderVideoInputSchema } from '../types.js';
import { createLogger } from '../utils/logger.js';
import * as os from 'os';
import * as path from 'path';

const logger = createLogger('render_video');

export const renderVideoTool = {
  name: 'render_video',
  description: `Generate a video file from a Rendervid JSON template.

This tool renders a complete video by:
1. Accepting a Rendervid template (JSON structure defining scenes, layers, animations)
2. Merging provided input values with template defaults
3. Rendering all frames using a headless browser
4. Encoding frames into a video file using FFmpeg

The template uses a declarative JSON format that describes:
- Output dimensions, FPS, and duration
- Dynamic inputs (variables that can be customized)
- Scenes with layers (text, images, shapes, video, audio)
- Animations (entrance, exit, emphasis effects with 40+ presets)
- Easing functions (30+ options for smooth motion)

Common use cases:
- Social media content (Instagram stories, TikTok videos, YouTube thumbnails)
- Marketing videos (product showcases, sale announcements, testimonials)
- Data visualizations (animated charts, graphs, dashboards)
- Educational content (course intros, lesson titles)

The output path will be created automatically. You can specify format, quality, and FPS.
Rendering progress is reported with frame counts and time estimates.

Example template structure:
{
  "name": "My Video",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5 },
  "inputs": [{ "key": "title", "type": "string", "label": "Title", "default": "Hello" }],
  "composition": { "scenes": [{ "id": "main", "startFrame": 0, "endFrame": 150, "layers": [...] }] }
}`,
  inputSchema: zodToJsonSchema(RenderVideoInputSchema),
};

export async function executeRenderVideo(args: unknown): Promise<string> {
  try {
    // Validate input
    const input = RenderVideoInputSchema.parse(args);

    // Validate and fix output path for macOS
    let outputPath = input.outputPath;
    if (os.platform() === 'darwin' && outputPath.startsWith('/home/')) {
      // On macOS, /home/ paths don't exist - convert to proper macOS path
      const filename = path.basename(outputPath);
      const tempDir = path.join(os.tmpdir(), 'rendervid-output');
      outputPath = path.join(tempDir, filename);

      logger.warn('Invalid path detected and corrected', {
        originalPath: input.outputPath,
        correctedPath: outputPath,
        reason: 'macOS does not use /home/ paths. Using temporary directory instead.',
      });
    }

    // Validate template before rendering
    logger.info('Validating template');
    const engine = new RendervidEngine();
    const validation = engine.validateTemplate(input.template);

    if (!validation.valid) {
      logger.warn('Template validation failed', {
        errorCount: validation.errors?.length || 0,
      });

      return JSON.stringify({
        success: false,
        error: 'Template validation failed. Please fix the errors and try again.',
        validation: {
          errors: validation.errors || [],
          warnings: validation.warnings || [],
          suggestions: generateValidationSuggestions(validation.errors || []),
        },
      }, null, 2);
    }

    if (validation.warnings && validation.warnings.length > 0) {
      logger.info('Template has warnings', {
        warningCount: validation.warnings.length,
        warnings: validation.warnings,
      });
    }

    logger.info('Starting video render', {
      outputPath: outputPath,
      format: input.format,
      quality: input.quality,
    });

    // Create renderer
    const renderer = createNodeRenderer();

    // Map quality to codec settings
    const codecSettings = getCodecSettings(input.format, input.quality);

    // Merge inputs with template defaults
    const mergedInputs = {
      ...(input.template.defaults || {}),
      ...input.inputs,
    };

    // Render video
    const result = await renderer.renderVideo({
      template: input.template as Template,
      inputs: mergedInputs,
      outputPath: outputPath,
      codec: codecSettings.codec,
      quality: codecSettings.quality,
      renderWaitTime: input.renderWaitTime,
      onProgress: (progress) => {
        logger.info('Render progress', {
          phase: progress.phase,
          percent: progress.percent?.toFixed(1),
          frame: `${progress.currentFrame}/${progress.totalFrames}`,
          eta: progress.eta ? `${progress.eta.toFixed(1)}s` : undefined,
        });
      },
    });

    if (!result.success) {
      throw new Error(result.error || 'Video rendering failed');
    }

    logger.info('Video render complete', {
      outputPath: result.outputPath,
      duration: result.duration,
      fileSize: formatFileSize(result.fileSize),
      renderTime: `${(result.renderTime / 1000).toFixed(2)}s`,
    });

    return JSON.stringify({
      success: true,
      message: `Video rendered successfully to ${result.outputPath}`,
      output: {
        path: result.outputPath,
        duration: result.duration,
        fileSize: result.fileSize,
        fileSizeFormatted: formatFileSize(result.fileSize),
        width: result.width,
        height: result.height,
        frameCount: result.frameCount,
        renderTime: result.renderTime,
        renderTimeFormatted: `${(result.renderTime / 1000).toFixed(2)}s`,
      },
    }, null, 2);
  } catch (error) {
    logger.error('Video render failed', { error });

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check for common errors and provide helpful messages
    if (errorMessage.includes('ENOENT') || errorMessage.includes('no such file')) {
      return JSON.stringify({
        success: false,
        error: 'Output directory does not exist. Please create the directory first or use an absolute path.',
        details: errorMessage,
      }, null, 2);
    }

    if (errorMessage.includes('ffmpeg')) {
      return JSON.stringify({
        success: false,
        error: 'FFmpeg not found. Please install FFmpeg to render videos.',
        details: errorMessage,
      }, null, 2);
    }

    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
        received: (e as any).received,
      }));

      return JSON.stringify({
        success: false,
        error: 'Invalid input parameters. Please fix the errors below and try again.',
        validationErrors,
        help: {
          outputPath: 'Must be a string path where the video file will be saved',
          format: 'Must be one of: mp4, webm, mov, gif',
          quality: 'Must be one of: draft, standard, high, lossless',
          template: 'Must be a valid Rendervid template object with name, output, and composition',
          inputs: 'Optional object mapping input keys to values',
        },
      }, null, 2);
    }

    return JSON.stringify({
      success: false,
      error: errorMessage,
    }, null, 2);
  }
}

function getCodecSettings(format: string, quality: string): { codec: 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores'; quality: number } {
  // Map format and quality to codec settings
  const codecMap: Record<string, 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores'> = {
    mp4: 'libx264',
    webm: 'libvpx-vp9',
    mov: 'libx264',
    gif: 'libx264', // GIF not directly supported by these codecs, will need special handling
  };

  const qualityMap: Record<string, number> = {
    draft: 28,      // Lower quality, faster
    standard: 23,   // Balanced
    high: 18,       // Higher quality
    lossless: 0,    // Lossless
  };

  return {
    codec: codecMap[format] || 'libx264',
    quality: qualityMap[quality] || 23,
  };
}

function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function generateValidationSuggestions(errors: Array<{ path?: string; message: string }>): string[] {
  const suggestions: string[] = [];

  for (const error of errors) {
    const path = error.path || '';
    const message = error.message.toLowerCase();

    // Provide helpful suggestions based on common errors
    if (message.includes('required') && path.includes('output')) {
      suggestions.push('Ensure output object has required properties: type, width, height. For video output, also include fps and duration.');
    }

    if (message.includes('composition')) {
      suggestions.push('Check that composition object exists and has a scenes array with at least one scene.');
    }

    if (message.includes('scene') && message.includes('frame')) {
      suggestions.push('Verify scene frame ranges: startFrame must be less than endFrame. Calculate endFrame = fps * duration for the scene.');
    }

    if (message.includes('layer')) {
      suggestions.push('Each layer must have: id (unique string), type (text/image/shape/video/audio/custom), position {x, y}, and size {width, height}.');
    }

    if (message.includes('animation')) {
      suggestions.push('Animation structure: type (entrance/exit/emphasis), effect (fadeIn/slideUp/etc), startFrame, endFrame, easing (optional).');
    }

    if (message.includes('input') && !message.includes('invalid')) {
      suggestions.push('Input definitions need: key (string), type (string/number/boolean/color), label (string), and optional default value.');
    }

    if (message.includes('fps')) {
      suggestions.push('FPS must be a positive integer, typically 24, 30, or 60 for video output.');
    }

    if (message.includes('duration')) {
      suggestions.push('Duration must be a positive number in seconds. Total frames = fps * duration.');
    }

    if (message.includes('width') || message.includes('height')) {
      suggestions.push('Width and height must be positive integers (pixels). Common resolutions: 1920x1080 (Full HD), 1280x720 (HD), 3840x2160 (4K).');
    }

    if (message.includes('position')) {
      suggestions.push('Position requires x and y coordinates (numbers). Origin (0,0) is top-left corner.');
    }

    if (message.includes('size')) {
      suggestions.push('Size requires width and height (positive numbers). Dimensions are in pixels.');
    }

    if (message.includes('color')) {
      suggestions.push('Color formats: "#RRGGBB" hex, "rgb(r,g,b)", "rgba(r,g,b,a)", or CSS color names.');
    }

    if (message.includes('font')) {
      suggestions.push('Use built-in fonts (Inter, Roboto, etc.) or any Google Fonts name. Set fontFamily property on text layers.');
    }

    if (message.includes('src') || message.includes('url')) {
      suggestions.push('Image/video src must be a valid URL (http/https) or local file path. Ensure the resource is accessible.');
    }
  }

  // Remove duplicates
  return [...new Set(suggestions)];
}
