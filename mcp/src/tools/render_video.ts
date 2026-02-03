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

OUTPUT PATH REQUIREMENTS:
- macOS: Use ~/Downloads/, ~/Desktop/, or ~/Documents/
- Example: outputPath: "~/Downloads/my-video.mp4"
- Paths like /home/claude/ will be auto-corrected to Downloads folder
- File is saved locally and accessible in Finder

CRITICAL TEMPLATE RULES (Follow exactly to avoid errors):

1. TIMING IS IN FRAMES, NOT SECONDS
   - At 30 fps: 30 frames = 1 second, 150 frames = 5 seconds
   - duration: 5 means 5 SECONDS (converted to frames internally)
   - startFrame: 0, endFrame: 150 means frames 0-150 (5 seconds at 30fps)
   - Animation delay/duration are in FRAMES: delay: 30 = 1 second delay

2. ALL LAYERS MUST HAVE position AND size
   - position: { x: number, y: number } (pixels from top-left)
   - size: { width: number, height: number } (pixels)
   - Example: position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 }

3. LAYER PROPERTIES GO IN props OBJECT
   - Correct: "props": { "text": "Hello", "fontSize": 48, "color": "#ffffff" }
   - Wrong: "text": "Hello", "fontSize": 48 (these must be inside props)

4. INPUT DEFINITIONS NEED ALL REQUIRED FIELDS
   - key: unique identifier (string)
   - type: "string" | "number" | "boolean" | "color"
   - label: display name (string)
   - description: what this input does (string) - REQUIRED
   - required: true/false (boolean) - REQUIRED
   - default: default value - REQUIRED
   - Example: { "key": "title", "type": "string", "label": "Title", "description": "Main title text", "required": true, "default": "Hello" }

5. ANIMATIONS USE FRAME-BASED TIMING
   - type: "entrance" | "exit" | "emphasis"
   - effect: "fadeIn", "slideUp", "scaleIn", etc.
   - delay: number (frames to wait before starting)
   - duration: number (frames the animation lasts)
   - Example: { "type": "entrance", "effect": "fadeIn", "delay": 30, "duration": 20 }
     This means: wait 1 second (30 frames), then fade in over 0.67 seconds (20 frames)

COMPLETE TEMPLATE STRUCTURE:
{
  "name": "Video Name",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 5
  },
  "inputs": [
    {
      "key": "title",
      "type": "string",
      "label": "Title Text",
      "description": "Main title text to display",
      "required": true,
      "default": "Hello World"
    }
  ],
  "defaults": {
    "title": "Hello World"
  },
  "composition": {
    "scenes": [
      {
        "id": "main",
        "startFrame": 0,
        "endFrame": 150,
        "layers": [
          {
            "id": "background",
            "type": "shape",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 1920, "height": 1080 },
            "props": {
              "shape": "rectangle",
              "fill": "#2563eb"
            }
          },
          {
            "id": "title",
            "type": "text",
            "position": { "x": 160, "y": 440 },
            "size": { "width": 1600, "height": 200 },
            "props": {
              "text": "{{title}}",
              "fontSize": 72,
              "fontWeight": "bold",
              "color": "#ffffff",
              "textAlign": "center"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
                "delay": 30,
                "duration": 20,
                "easing": "easeOutCubic"
              }
            ]
          }
        ]
      }
    ]
  }
}

NEED MORE DETAILS? Use these tools for just-in-time documentation:
- get_component_docs({ componentType: "text" }) - Detailed component/layer documentation
- get_animation_docs({ animationType: "entrance" }) - Animation effects reference
- get_easing_docs({ category: "out" }) - Easing functions guide
- get_capabilities({}) - Full list of available features
- list_examples({}) - Browse example templates

LAYER TYPES: text, image, shape, video, audio, custom
ANIMATION TYPES: entrance, exit, emphasis
EASING CATEGORIES: basic, in, out (recommended), inout, back, bounce, elastic

VIDEO LAYER EXAMPLE (FOR VIDEO BACKGROUNDS):
{
  "id": "background-video",
  "type": "video",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 1080 },
  "props": {
    "src": "/path/to/video.mp4",
    "fit": "cover",
    "loop": true,
    "muted": true,
    "playbackRate": 1,
    "startTime": 0
  }
}

WHEN TO USE VIDEO LAYERS:
✓ Use for animated backgrounds (loops, motion footage)
✓ Local file paths: "/Users/name/Downloads/video.mp4" (absolute paths only)
✓ Always set "muted": true for background videos
✓ Use "loop": true to repeat the video
✓ Layer order matters: video background should be FIRST layer (rendered behind text/shapes)

IMAGE LAYER EXAMPLE (REQUIRED FOR PROMOTIONAL VIDEOS):
{
  "id": "product-photo",
  "type": "image",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 800, "height": 600 },
  "props": {
    "src": "https://www.photomaticai.com/images/.../image.webp",
    "fit": "cover"
  }
}

WHEN TO USE IMAGE LAYERS:
✓ ALWAYS include image layers for: promotional videos, product showcases, portfolios, presentations
✓ If creating a promo for "Product X", include actual Product X images - not just text/shapes
✓ Use Photomatic AI URLs: https://www.photomaticai.com/images/processed/...
✓ Multiple images make videos more engaging: add 2-5 image layers showing different angles/features

CRITICAL FOR IMAGE/VIDEO RENDERING:
When your template includes image or video layers, set: "renderWaitTime": 500
Media is pre-loaded during initialization, but a wait ensures proper rendering.
Example: { "template": {...}, "renderWaitTime": 500 }
Note: Video layers need 500-1000ms; images need 300-500ms; simple text templates: 100-200ms

COMMON MISTAKES TO AVOID:
❌ Creating promotional videos with ONLY text and shapes - MUST include image layers showing the actual product/content
❌ Using seconds for animation timing (use frames!)
❌ Missing size property on layers
❌ Putting layer props outside props object
❌ Missing required field in input definitions
❌ Using wrong position values (position is top-left corner, not center)
❌ endFrame less than or equal to startFrame
❌ DUPLICATE LAYER IDS: Layer IDs must be unique across ALL scenes (use "scene1-bg", "scene2-bg" not "background" in every scene)

TEMPLATE VARIABLES:
✓ Use {{variableName}} in props to reference inputs: "text": "{{title}}"
✓ Define the variable in defaults: "defaults": { "title": "Hello" }
✓ Note: "UNUSED_INPUT" warnings appear even when using {{variables}} - these can be ignored
❌ Animation delay + duration exceeding scene duration`,
  inputSchema: zodToJsonSchema(RenderVideoInputSchema),
};

export async function executeRenderVideo(args: unknown): Promise<string> {
  try {
    // Validate input
    const input = RenderVideoInputSchema.parse(args);

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
        renderTime: result.renderTime,
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
