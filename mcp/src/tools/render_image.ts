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
  description: `Generate a single image from a Rendervid template.

This tool renders a static image by:
1. Accepting a Rendervid template (same JSON structure as video templates)
2. Rendering a specific frame (default: frame 0)
3. Exporting as PNG, JPEG, or WebP

Ideal for:
- Social media images (Instagram posts, Twitter cards, LinkedIn banners)
- Thumbnails (YouTube, blog posts, video covers)
- Static graphics (quotes, announcements, infographics)
- Previewing video frames

You can use the same template for both video and image output.
For video templates, specify which frame to capture (0-based index).
For image templates (output.type: "image"), the frame parameter is ignored.

The template format is identical to video templates, supporting:
- Multiple layers (text, images, shapes)
- Animations (will be evaluated at the specified frame)
- Dynamic inputs
- Full styling capabilities

Example use:
- Render frame 0 of a video template as a thumbnail
- Generate social media post images with custom text
- Create preview images for video content`,
  inputSchema: zodToJsonSchema(RenderImageInputSchema),
};

export async function executeRenderImage(args: unknown): Promise<string> {
  try {
    // Validate input
    const input = RenderImageInputSchema.parse(args);

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
