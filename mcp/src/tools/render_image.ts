import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createNodeRenderer } from '@rendervid/renderer-node';
import type { Template } from '@rendervid/core';
import { createDefaultComponentDefaultsManager } from '@rendervid/core';
import { RenderImageInputSchema } from '../types.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('render_image');

export const renderImageTool = {
  name: 'render_image',
  description: `Generate a static image from a Rendervid template at a specific frame.

USE FOR:
Social media posts (Instagram, Twitter, LinkedIn), video thumbnails (YouTube, Vimeo),
blog post headers, presentation slides, infographics, quote graphics, product mockups,
preview images, marketing materials, web banners

OUTPUT:
- Format: PNG (lossless), JPEG (compressed), or WebP (modern)
- Location: Specified by outputPath parameter
- Quality: 1-100 for JPEG/WebP (default: 90)
- Frame: Captures specified frame number (default: 0)
- Max resolution: 7680x4320 (8K)

TEMPLATE:
- Same JSON structure as video templates
- Animations evaluated at specified frame
- Supports all layer types (text, image, shape, custom)
- Use output.type: "video" or "image" (both work)

TYPICAL USE:
1. Render frame 0 as thumbnail
2. Capture mid-animation frame for preview
3. Generate social media image with custom text
4. Create static graphics from animated template

⚠️ CRITICAL: Pass template as JSON OBJECT, not string
✅ CORRECT: { "template": {"name": "Image"} }`,
  inputSchema: zodToJsonSchema(RenderImageInputSchema),
};

export async function executeRenderImage(args: unknown): Promise<string> {
  try {
    // Validate input
    const input = RenderImageInputSchema.parse(args);

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

    logger.info('Starting image render', {
      outputPath: input.outputPath,
      format: input.format,
      quality: input.quality,
      frame: input.frame,
    });

    // Create component defaults manager with pre-configured components
    const defaultsManager = createDefaultComponentDefaultsManager();

    // Create renderer with component defaults enabled
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderer = createNodeRenderer({
      componentDefaultsManager: defaultsManager as any,
    });

    // Merge inputs with template defaults
    const mergedInputs = {
      ...(input.template.defaults || {}),
      ...input.inputs,
    };

    // Render image
    const result = await renderer.renderImage({
      template: input.template as Template,
      inputs: mergedInputs,
      outputPath: input.outputPath,
      format: input.format as 'png' | 'jpeg' | 'webp',
      quality: input.quality,
      frame: input.frame,
      renderWaitTime: input.renderWaitTime,
    });

    if (!result.success) {
      throw new Error(result.error || 'Image rendering failed');
    }

    logger.info('Image render complete', {
      outputPath: result.outputPath,
      fileSize: formatFileSize(result.fileSize),
      renderTime: `${(result.renderTime / 1000).toFixed(2)}s`,
    });

    return JSON.stringify({
      success: true,
      message: `Image rendered successfully to ${result.outputPath}`,
      output: {
        path: result.outputPath,
        fileSize: result.fileSize,
        fileSizeFormatted: formatFileSize(result.fileSize),
        width: result.width,
        height: result.height,
        format: input.format,
        frame: input.frame,
        renderTime: result.renderTime,
        renderTimeFormatted: `${(result.renderTime / 1000).toFixed(2)}s`,
      },
    }, null, 2);
  } catch (error) {
    logger.error('Image render failed', { error });

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check for common errors
    if (errorMessage.includes('ENOENT') || errorMessage.includes('no such file')) {
      return JSON.stringify({
        success: false,
        error: 'Output directory does not exist. Please create the directory first or use an absolute path.',
        details: errorMessage,
      }, null, 2);
    }

    if (error instanceof z.ZodError) {
      return JSON.stringify({
        success: false,
        error: 'Invalid input parameters',
        validationErrors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      }, null, 2);
    }

    return JSON.stringify({
      success: false,
      error: errorMessage,
    }, null, 2);
  }
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
