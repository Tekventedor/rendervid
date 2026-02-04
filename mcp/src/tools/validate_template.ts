import { zodToJsonSchema } from 'zod-to-json-schema';
import { RendervidEngine } from '@rendervid/core';
import { ValidateTemplateInputSchema } from '../types.js';
import { createLogger } from '../utils/logger.js';
import { validateTemplateMedia } from '../utils/validate-media.js';

const logger = createLogger('validate_template');

export const validateTemplateTool = {
  name: 'validate_template',
  description: `Validate a Rendervid template JSON structure and media URLs before rendering.

USE FOR:
Pre-render validation (save time), debugging template issues, checking image URL accessibility,
verifying template structure, catching syntax errors early, platform compatibility checks,
avoiding "black video" problems, ensuring media loads correctly

OUTPUT:
- valid: boolean (true/false)
- errorSummary: Quick AI-readable overview of top issues
- errors: Detailed validation errors with paths
- suggestions: Actionable steps to fix issues
- breakdown: Separate structure vs media error counts

WORKFLOW:
1. Create template → 2. validate_template → 3. Fix errors → 4. render_video

⚠️ Template can be object OR string (auto-parsed):
✅ RECOMMENDED: { "template": {"name": "Video"} }
⚠️  ALLOWED: { "template": "{\\"name\\":\\"Video\\"}" } (auto-parsed)

This tool performs comprehensive validation:

Validation checks include:
- Template structure (name, output, composition)
- Output configuration (type, dimensions, fps, duration)
- Input definitions (keys, types, defaults)
- Scene structure (IDs, frame ranges)
- Layer configuration (types, positions, sizes, props)
- Animation definitions (types, effects, timing, easing)
- Component references and props
- Data consistency (frame ranges, input references)
- **Media URL validation**:
  - Checks if image/video/audio URLs exist (HTTP HEAD request)
  - Verifies correct content-type (image/* for images, video/* for videos, audio/* for audio)
  - Returns 404, 403, or network errors BEFORE rendering starts
  - Detects invalid paths (/mnt/, /home/claude/, file://)
  - Validates all image, video, and audio layers

**IMPORTANT FOR AI AGENTS:**
Always call validate_template BEFORE calling render_video to catch:
- ❌ Broken image URLs (404, 403 errors)
- ❌ Invalid file paths (Linux paths on macOS: /mnt/, /home/claude/)
- ❌ Browser security violations (file:// URLs)
- ❌ Wrong content types (HTML page instead of image)
- ❌ Network/timeout errors
- ❌ Invalid template structure

Returns:
- valid: boolean indicating if template AND all media URLs are valid
- errorSummary: AI-friendly summary of top errors with actionable fixes
- errors: array of detailed validation errors including media URL failures
- warnings: array of warnings (e.g., local file paths that weren't checked)
- suggestions: specific actions to fix common errors
- breakdown: separate validation results for structure and media

Media validation timeout: 10 seconds per URL
Local file paths (non-http) are skipped with a warning

Use this before rendering to catch issues early, especially when:
- Using external image/video URLs (Unsplash, Pexels, custom URLs)
- Creating templates with user-provided media
- AI-generated templates with dynamic URLs
- Debugging "black video" issues
- Validating before expensive render operations

The validator provides:
1. **Error Summary**: Quick AI-readable overview of issues
2. **Detailed Errors**: Full error context with paths
3. **Suggestions**: Specific actions to resolve each error type
4. **How-To-Fix**: Direct instructions for common mistakes`,
  inputSchema: zodToJsonSchema(ValidateTemplateInputSchema),
};

export async function executeValidateTemplate(args: unknown): Promise<string> {
  try {
    // Parse input
    const input = ValidateTemplateInputSchema.parse(args);

    logger.info('Validating template');

    // Handle case where template is passed as a JSON string instead of object
    let template = input.template;
    if (typeof template === 'string') {
      logger.warn('Template was passed as string, attempting to parse as JSON');
      try {
        template = JSON.parse(template);
        logger.info('Successfully parsed template string to JSON object');
      } catch (parseError) {
        return JSON.stringify({
          valid: false,
          error: 'TEMPLATE_PARSE_ERROR',
          message: 'Template must be a JSON object, not a string. Pass the template as a JavaScript object, not a JSON string.',
          details: `Failed to parse template string: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
          howToFix: 'Instead of: {"template": "{\\"name\\":\\"...\\"}"}, use: {"template": {"name": "..."}}'
        }, null, 2);
      }
    }

    // Create engine instance for validation
    const engine = new RendervidEngine();

    // Validate template structure
    const result = engine.validateTemplate(template);

    // Validate media URLs (images, videos, audio)
    logger.info('Validating media URLs');
    const mediaValidation = await validateTemplateMedia(template);

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

      // Normalize errors to consistent format and extract clear error info
      const normalizedErrors = allErrors.map(err =>
        typeof err === 'string' ? { message: err } : err
      );

      // Create AI-friendly error summary
      const errorSummary = generateErrorSummary(normalizedErrors);

      return JSON.stringify({
        valid: false,
        message: 'Template has validation errors. Fix these before rendering.',
        errorSummary,
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

function generateErrorSummary(errors: Array<{ path?: string; message: string; code?: string }>): string {
  const summaryParts: string[] = [];

  for (const error of errors) {
    const message = error.message;
    const path = error.path || 'template';
    const code = error.code || 'VALIDATION_ERROR';

    // Extract the most important info for AI
    if (message.includes('Missing required property: inputs')) {
      summaryParts.push('❌ Missing "inputs" array. Add: "inputs": [] or "inputs": [...]');
    } else if (message.includes('Expected object, received string')) {
      summaryParts.push('❌ Template must be a JSON OBJECT, not a string. Remove quotes around the template JSON.');
    } else if (message.includes('image') && (message.includes('404') || message.includes('403'))) {
      summaryParts.push('❌ Image URL is broken or inaccessible. Use valid HTTPS URLs from Unsplash, Pexels, or Photomatic AI.');
    } else if (message.includes('/mnt/') || message.includes('/home/claude/')) {
      summaryParts.push('❌ Invalid file path. On macOS, use HTTPS URLs for images, not local paths like /mnt/ or /home/claude/');
    } else if (message.includes('file://')) {
      summaryParts.push('❌ file:// URLs are not supported due to browser security. Use HTTPS image URLs instead.');
    } else {
      // Generic error
      summaryParts.push(`❌ ${code} at ${path}: ${message.substring(0, 100)}`);
    }
  }

  return summaryParts.slice(0, 5).join('\n'); // Limit to 5 most important errors
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
      suggestions.push('The "inputs" array is required even if empty. Add: "inputs": []');
    }

    if (message.includes('fps') || message.includes('duration')) {
      suggestions.push('For video templates, specify fps and duration in output');
    }

    if (message.includes('image') || message.includes('404') || message.includes('403')) {
      suggestions.push('Image URLs must be valid HTTPS URLs. On macOS, local file paths are not supported - use online image URLs instead.');
    }
  }

  // Remove duplicates
  return [...new Set(suggestions)];
}
