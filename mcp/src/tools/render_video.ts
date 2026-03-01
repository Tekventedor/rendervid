import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createNodeRenderer } from '@rendervid/renderer-node';
import type { Template } from '@rendervid/core';
import { RendervidEngine, createDefaultComponentDefaultsManager, validateMotionBlurConfig } from '@rendervid/core';
import { RenderVideoInputSchema } from '../types.js';
import { createLogger } from '../utils/logger.js';
import { preprocessTemplateFiles } from '../utils/template-preprocessor.js';
import { validateTemplateForRendering } from '../utils/template-validator.js';
import { validateRenderedVideo } from '../utils/post-render-validator.js';
import * as os from 'os';
import * as path from 'path';

const logger = createLogger('render_video');

export const renderVideoTool = {
  name: 'render_video',
  description: `Render a video from a Rendervid JSON template. For videos >30s, use start_render_async.

Parameters: template (JSON object), outputPath, format (mp4/webm/mov/gif), quality (draft/standard/high/lossless), fps override, renderWaitTime, motionBlur config.
renderWaitTime auto-adjusts: 100ms for text-only, 500ms for images/video. Override manually if images don't appear (800-1000ms).

Workflow: validate_template -> render_video
Use get_docs({ topic: "overview" }) to explore all capabilities.
Use get_docs({ topic: "template" }) for template structure.
Use get_docs({ topic: "layer/text" }) etc. for layer-specific props.
Use get_docs({ topic: "animations" }) for animation presets.
Use get_example() to browse and load example templates.

Key rules:
- Pass template as JSON OBJECT, not string
- Always include "inputs": [] (even if empty)
- Template needs: name, output, inputs, composition
- Timing: output.duration is in seconds; animation delay/duration are in frames (30 frames = 1s at 30fps)
- All layers need: id (unique across all scenes), type, position {x, y}, size {width, height}
- Layer-specific properties go inside "props" object
- Scenes/layers support "hidden": true to skip during rendering
- Image/video src: use absolute local paths or HTTPS URLs (local files auto-convert to base64)
- Custom components: use React.createElement(), NOT JSX. No imports/exports.`,
  inputSchema: zodToJsonSchema(RenderVideoInputSchema),
};

export async function executeRenderVideo(args: unknown): Promise<string> {
  try {
    // Validate input
    const input = RenderVideoInputSchema.parse(args);

    // Handle case where template is passed as a JSON string instead of object
    if (typeof input.template === 'string') {
      logger.error('Template was passed as string instead of object');
      return JSON.stringify({
        success: false,
        error: 'TEMPLATE_FORMAT_ERROR',
        message: 'Template must be a JSON object, not a string.',
        howToFix: 'Instead of: {"template": "{\\"name\\":\\"...\\"}"}, use: {"template": {"name": "..."}}',
        details: 'The template parameter should be a JavaScript object, not a JSON string. Remove the surrounding quotes and escape characters.',
      }, null, 2);
    }

    // Validate motion blur configuration if provided
    if (input.motionBlur) {
      const motionBlurErrors = validateMotionBlurConfig(input.motionBlur);
      if (motionBlurErrors.length > 0) {
        logger.error('Invalid motion blur configuration', { errors: motionBlurErrors });
        return JSON.stringify({
          success: false,
          error: 'Invalid motion blur configuration',
          details: motionBlurErrors,
          suggestion: 'Check motion blur parameters: samples (2-32), shutterAngle (0-360), minSamples ≤ samples, motionThreshold (0.0001-1.0)',
        }, null, 2);
      }
    }

    // Validate and fix output path for macOS
    let outputPath = input.outputPath;
    let pathWasCorrected = false;
    let pathCorrectionMessage = '';

    // Expand tilde in path
    if (outputPath.startsWith('~/')) {
      outputPath = path.join(os.homedir(), outputPath.slice(2));
    }

    if (os.platform() === 'darwin' && outputPath.startsWith('/home/')) {
      // On macOS, /home/ paths don't exist - convert to proper macOS path
      const filename = path.basename(outputPath);
      const pathParts = outputPath.split('/').filter(Boolean);

      // Try to detect common user directories
      if (pathParts.includes('Downloads')) {
        outputPath = path.join(os.homedir(), 'Downloads', filename);
        pathCorrectionMessage = `Path corrected: /home/claude/Downloads → ${os.homedir()}/Downloads`;
      } else if (pathParts.includes('Desktop')) {
        outputPath = path.join(os.homedir(), 'Desktop', filename);
        pathCorrectionMessage = `Path corrected: /home/claude/Desktop → ${os.homedir()}/Desktop`;
      } else if (pathParts.includes('Documents')) {
        outputPath = path.join(os.homedir(), 'Documents', filename);
        pathCorrectionMessage = `Path corrected: /home/claude/Documents → ${os.homedir()}/Documents`;
      } else {
        // Default to Downloads
        outputPath = path.join(os.homedir(), 'Downloads', filename);
        pathCorrectionMessage = `Path corrected: ${input.outputPath} → ${outputPath} (using Downloads folder)`;
      }

      pathWasCorrected = true;

      logger.warn('Invalid path detected and corrected', {
        originalPath: input.outputPath,
        correctedPath: outputPath,
        reason: 'macOS does not use /home/ paths. Converted to proper macOS user directory.',
      });
    }

    // Validate template before rendering
    logger.info('Validating template');
    let validation: { valid: boolean; errors?: any[]; warnings?: any[] };

    try {
      const engine = new RendervidEngine();
      validation = engine.validateTemplate(input.template);
    } catch (validationError) {
      logger.error('Template validation threw an exception', { error: validationError });

      return JSON.stringify({
        success: false,
        error: 'Template validation failed with an unexpected error',
        details: validationError instanceof Error ? validationError.message : String(validationError),
        suggestion: 'This may indicate a malformed template structure. Please check the template format.',
      }, null, 2);
    }

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

    // Preprocess template to convert local files to data URLs
    logger.info('Preprocessing template files');
    const preprocessResult = await preprocessTemplateFiles(input.template, {
      maxBase64SizeKB: 500,
    });

    // Log conversions
    if (preprocessResult.conversions.length > 0) {
      logger.info('File conversions completed', {
        count: preprocessResult.conversions.length,
        conversions: preprocessResult.conversions.map(c => ({
          layerId: c.layerId,
          originalPath: c.originalPath,
          originalSize: `${c.originalSizeKB.toFixed(1)} KB`,
          finalSize: `${c.finalSizeKB.toFixed(1)} KB`,
          wasResized: c.wasResized,
        })),
      });
    }

    // Log warnings
    if (preprocessResult.warnings.length > 0) {
      logger.warn('File preprocessing warnings', { warnings: preprocessResult.warnings });
    }

    // Handle preprocessing errors
    if (preprocessResult.errors.length > 0) {
      logger.error('File preprocessing failed', { errors: preprocessResult.errors });
      return JSON.stringify({
        success: false,
        error: 'Failed to preprocess template files',
        details: preprocessResult.errors,
        suggestion: 'Check that all local file paths are valid and accessible.',
      }, null, 2);
    }

    const processedTemplate = preprocessResult.template;

    // Validate template for common rendering issues
    logger.info('Validating template for rendering issues');
    const renderValidation = validateTemplateForRendering(processedTemplate);

    // Log validation issues
    if (renderValidation.issues.length > 0) {
      const errors = renderValidation.issues.filter(i => i.severity === 'error');
      const warnings = renderValidation.issues.filter(i => i.severity === 'warning');

      if (errors.length > 0) {
        logger.error('Template has critical issues that will cause rendering problems', {
          errorCount: errors.length,
          errors: errors.map(e => ({
            code: e.code,
            message: e.message,
            fix: e.fix,
            location: e.location,
          })),
        });

        return JSON.stringify({
          success: false,
          error: 'Template validation failed - will cause rendering issues',
          issues: {
            errors: errors.map(e => ({
              code: e.code,
              message: e.message,
              fix: e.fix,
              location: e.location,
            })),
            warnings: warnings.map(w => ({
              code: w.code,
              message: w.message,
              fix: w.fix,
              location: w.location,
            })),
          },
          suggestion: 'Fix the errors listed above before rendering. Common issues: unsupported animations (use fadeIn/fadeOut instead of custom keyframes), elements positioned outside canvas bounds, invalid scene timing.',
        }, null, 2);
      }

      if (warnings.length > 0) {
        logger.warn('Template has warnings', {
          warningCount: warnings.length,
          warnings: warnings.map(w => ({
            code: w.code,
            message: w.message,
            fix: w.fix,
            location: w.location,
          })),
        });
      }
    }

    // Auto-adjust renderWaitTime based on template content
    let renderWaitTime = input.renderWaitTime ?? 100;
    const hasMediaLayers = detectMediaLayers(processedTemplate);

    if (hasMediaLayers && !input.renderWaitTime) {
      // Template has images/videos and user didn't specify renderWaitTime
      // Use 500ms to ensure media loads properly
      renderWaitTime = 500;
      logger.info('Auto-adjusted renderWaitTime for media layers', {
        from: 100,
        to: 500,
        reason: 'Template contains image/video/audio layers',
      });
    }

    logger.info('Starting video render', {
      outputPath: outputPath,
      format: input.format,
      quality: input.quality,
      renderWaitTime,
    });

    // Create component defaults manager with pre-configured components
    // This ensures all custom components receive proper defaults and validation
    let renderer: any;
    try {
      const defaultsManager = createDefaultComponentDefaultsManager();

      // Create renderer with component defaults enabled
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderer = createNodeRenderer({
        componentDefaultsManager: defaultsManager as any,
        gpu: { encoding: 'none' },
      });
    } catch (rendererError) {
      logger.error('Failed to create renderer', { error: rendererError });

      return JSON.stringify({
        success: false,
        error: 'Failed to initialize video renderer',
        details: rendererError instanceof Error ? rendererError.message : String(rendererError),
        suggestion: 'This may indicate a system configuration issue. Ensure ffmpeg and required dependencies are installed.',
      }, null, 2);
    }

    // Map quality to codec settings
    const codecSettings = getCodecSettings(input.format, input.quality);

    // Merge inputs with template defaults
    const mergedInputs = {
      ...(input.template.defaults || {}),
      ...input.inputs,
    };

    // Render video with timeout protection
    let result: any;
    try {
      result = await renderer.renderVideo({
        template: processedTemplate as Template,
        inputs: mergedInputs,
        outputPath: outputPath,
        codec: codecSettings.codec,
        quality: codecSettings.quality,
        preset: codecSettings.preset,
        renderWaitTime: renderWaitTime,
        motionBlur: input.motionBlur,
        useStreaming: true,
        onProgress: (progress: any) => {
          logger.info('Render progress', {
            phase: progress.phase,
            percent: progress.percent?.toFixed(1),
            frame: `${progress.currentFrame}/${progress.totalFrames}`,
            eta: progress.eta ? `${progress.eta.toFixed(1)}s` : undefined,
          });
        },
      });
    } catch (renderError) {
      logger.error('Video rendering threw an exception', { error: renderError });

      return JSON.stringify({
        success: false,
        error: 'Video rendering failed',
        details: renderError instanceof Error ? renderError.message : String(renderError),
        suggestion: 'Check template structure, ensure all media URLs are accessible, and verify system resources.',
      }, null, 2);
    }

    if (!result.success) {
      logger.error('Video rendering returned failure', { error: result.error });

      return JSON.stringify({
        success: false,
        error: result.error || 'Video rendering failed',
        details: 'The renderer completed but reported a failure status.',
      }, null, 2);
    }

    logger.info('Video render complete', {
      outputPath: result.outputPath,
      duration: result.duration,
      fileSize: formatFileSize(result.fileSize),
      renderTime: `${(result.renderTime / 1000).toFixed(2)}s`,
    });

    // Post-render validation to detect black scenes
    logger.info('Running post-render validation');
    const postValidation = await validateRenderedVideo(
      result.outputPath,
      result.duration,
      result.fps || 30
    );

    if (postValidation.hasIssues) {
      logger.warn('Post-render validation detected issues', {
        blackScenes: postValidation.blackScenes,
        lowQuality: postValidation.lowQuality,
        suggestions: postValidation.suggestions,
      });
    }

    const response: any = {
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
        renderTimeMs: result.renderTime, // Exact render time in milliseconds (for cost computation)
        renderTime: result.renderTime, // Backwards compatibility
        renderTimeFormatted: `${(result.renderTime / 1000).toFixed(2)}s`,
      },
    };

    // Add path correction info if applicable
    if (pathWasCorrected) {
      response.pathInfo = {
        corrected: true,
        message: pathCorrectionMessage,
        actualPath: result.outputPath,
        note: 'File saved to your macOS user directory. You can find it in Finder.',
      };
    }

    // Add validation warnings if any issues detected
    if (postValidation.hasIssues) {
      response.validation = {
        hasIssues: true,
        blackScenes: postValidation.blackScenes.length > 0 ? {
          frames: postValidation.blackScenes,
          message: '⚠️ BLACK SCENES DETECTED - Video may have invisible content',
        } : undefined,
        lowQuality: postValidation.lowQuality ? {
          message: 'Video file size is smaller than expected - may indicate compression issues',
        } : undefined,
        suggestions: postValidation.suggestions,
      };

      // Update message to alert about issues
      response.message = `Video rendered but validation detected issues. Check validation field for details. ${result.outputPath}`;
    }

    return JSON.stringify(response, null, 2);
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

/**
 * Detect if template has media layers (image, video, audio)
 * Used to auto-adjust renderWaitTime for proper media loading
 */
function detectMediaLayers(template: any): boolean {
  if (!template?.composition?.scenes) return false;

  for (const scene of template.composition.scenes) {
    if (!scene.layers) continue;

    for (const layer of scene.layers) {
      if (layer.type === 'image' || layer.type === 'video' || layer.type === 'audio') {
        return true;
      }
    }
  }

  return false;
}

function getCodecSettings(format: string, quality: string): {
  codec: 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores';
  quality: number;
  preset: 'fast' | 'medium' | 'slow' | 'veryslow';
} {
  const codecMap: Record<string, 'libx264' | 'libx265' | 'libvpx' | 'libvpx-vp9' | 'prores'> = {
    mp4: 'libx264',
    webm: 'libvpx-vp9',
    mov: 'libx264',
    gif: 'libx264',
  };

  const qualityMap: Record<string, number> = {
    draft: 28,
    standard: 23,
    high: 18,
    lossless: 0,
  };

  const presetMap: Record<string, 'fast' | 'medium' | 'slow' | 'veryslow'> = {
    draft: 'fast',
    standard: 'medium',
    high: 'slow',
    lossless: 'medium', // CRF 0 is mathematically lossless regardless of preset
  };

  return {
    codec: codecMap[format] || 'libx264',
    quality: qualityMap[quality] || 23,
    preset: presetMap[quality] || 'medium',
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

    // Check for duplicate layer IDs
    if (message.includes('duplicate') || message.includes('unique') || message.includes('id')) {
      suggestions.push('DUPLICATE LAYER IDS: Each layer must have a unique ID within ALL scenes. Use descriptive IDs like "scene1-background", "scene2-background" instead of just "background".');
    }

    // Check for unused inputs
    if (message.includes('unused') || message.includes('not used')) {
      suggestions.push('UNUSED INPUTS: If you\'re using {{variableName}} in props, this warning is a false positive and can be ignored. Otherwise, either add {{variableName}} references in layer props or remove unused inputs from the inputs array.');
    }

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
