import { zodToJsonSchema } from 'zod-to-json-schema';
import { RendervidEngine } from '@rendervid/core';
import { ValidateTemplateInputSchema } from '../types.js';
import { createLogger } from '../utils/logger.js';
import { validateTemplateMedia } from '../utils/validate-media.js';

const logger = createLogger('validate_template');

export const validateTemplateTool = {
  name: 'validate_template',
  description: `Validate a Rendervid template JSON structure and media URLs.

This tool performs comprehensive validation of a template to ensure it's properly formatted and ready for rendering.

Validation checks include:
- Template structure (name, output, composition)
- Output configuration (type, dimensions, fps, duration)
- Input definitions (keys, types, defaults)
- Scene structure (IDs, frame ranges)
- Layer configuration (types, positions, sizes, props)
- Animation definitions (types, effects, timing, easing)
- Component references and props
- Data consistency (frame ranges, input references)
- **Media URL validation** (NEW):
  - Checks if image/video/audio URLs exist (HTTP HEAD request)
  - Verifies correct content-type (image/* for images, video/* for videos, audio/* for audio)
  - Returns 404, 403, or network errors BEFORE rendering starts
  - Validates all image, video, and audio layers

**IMPORTANT FOR AI AGENTS:**
Always call validate_template BEFORE calling render_video to catch:
- ❌ Broken image URLs (404, 403 errors)
- ❌ Wrong content types (HTML page instead of image)
- ❌ Network/timeout errors
- ❌ Invalid template structure

Returns:
- valid: boolean indicating if template AND all media URLs are valid
- errors: array of validation errors including media URL failures
- warnings: array of warnings (e.g., local file paths that weren't checked)

Media validation timeout: 10 seconds per URL
Local file paths (non-http) are skipped with a warning

Use this before rendering to catch issues early, especially when:
- Using external image/video URLs (Unsplash, Pexels, custom URLs)
- Creating templates with user-provided media
- AI-generated templates with dynamic URLs
- Debugging "black video" issues

The validator provides detailed error messages with paths to help fix issues quickly.`,
  inputSchema: zodToJsonSchema(ValidateTemplateInputSchema),
};

export async function executeValidateTemplate(args: unknown): Promise<string> {
  try {
    // Parse input
    const input = ValidateTemplateInputSchema.parse(args);

    logger.info('Validating template');

    // Create engine instance for validation
    const engine = new RendervidEngine();

    // Validate template structure
    const result = engine.validateTemplate(input.template);

    // Validate media URLs (images, videos, audio)
    logger.info('Validating media URLs');
    const mediaValidation = await validateTemplateMedia(input.template);

    // Combine results
    const allErrors = [...(result.errors || []), ...mediaValidation.errors];
    const allWarnings = [...(result.warnings || []), ...mediaValidation.warnings];
    const isValid = result.valid && mediaValidation.valid;

    if (isValid) {
      logger.info('Template is valid', {
        warningCount: allWarnings.length,
      });

      return JSON.stringify({
        valid: true,
        message: 'Template is valid and ready to render. All media URLs are accessible.',
        warnings: allWarnings,
      }, null, 2);
    } else {
      logger.warn('Template validation failed', {
        structureErrors: result.errors?.length || 0,
        mediaErrors: mediaValidation.errors.length,
      });

      // Normalize errors to consistent format
      const normalizedErrors = allErrors.map(err =>
        typeof err === 'string' ? { message: err } : err
      );

      return JSON.stringify({
        valid: false,
        message: 'Template has validation errors. Fix these before rendering.',
        errors: allErrors,
        warnings: allWarnings,
        suggestions: generateSuggestions(normalizedErrors),
        breakdown: {
          structureValid: result.valid,
          structureErrors: result.errors?.length || 0,
          mediaValid: mediaValidation.valid,
          mediaErrors: mediaValidation.errors.length,
        },
      }, null, 2);
    }
  } catch (error) {
    logger.error('Template validation error', { error });

    const errorMessage = error instanceof Error ? error.message : String(error);

    return JSON.stringify({
      valid: false,
      error: 'Failed to validate template',
      details: errorMessage,
    }, null, 2);
  }
}

function generateSuggestions(errors: Array<{ path?: string; message: string }>): string[] {
  const suggestions: string[] = [];

  for (const error of errors) {
    const path = error.path || '';
    const message = error.message.toLowerCase();

    // Provide helpful suggestions based on common errors
    if (message.includes('required') && path.includes('output')) {
      suggestions.push('Ensure output object has type, width, and height properties');
    }

    if (message.includes('composition')) {
      suggestions.push('Check that composition object has a scenes array');
    }

    if (message.includes('scene') && message.includes('frame')) {
      suggestions.push('Verify scene frame ranges (startFrame < endFrame)');
    }

    if (message.includes('layer')) {
      suggestions.push('Check layer structure: id, type, position, size are required');
    }

    if (message.includes('animation')) {
      suggestions.push('Verify animation has type, effect, and duration properties');
    }

    if (message.includes('input')) {
      suggestions.push('Check input definitions have key, type, and label');
    }

    if (message.includes('fps') || message.includes('duration')) {
      suggestions.push('For video templates, specify fps and duration in output');
    }
  }

  // Remove duplicates
  return [...new Set(suggestions)];
}
