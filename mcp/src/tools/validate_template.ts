import { zodToJsonSchema } from 'zod-to-json-schema';
import { RendervidEngine } from '@rendervid/core';
import { ValidateTemplateInputSchema } from '../types.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('validate_template');

export const validateTemplateTool = {
  name: 'validate_template',
  description: `Validate a Rendervid template JSON structure.

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

Returns:
- valid: boolean indicating if template is valid
- errors: array of validation errors (if any)
- warnings: array of validation warnings (if any)

Use this before rendering to catch issues early, or when:
- Creating new templates
- Modifying existing templates
- Debugging template issues
- Verifying AI-generated templates

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

    // Validate template
    const result = engine.validateTemplate(input.template);

    if (result.valid) {
      logger.info('Template is valid');

      return JSON.stringify({
        valid: true,
        message: 'Template is valid and ready to render',
        warnings: result.warnings || [],
      }, null, 2);
    } else {
      logger.warn('Template validation failed', {
        errorCount: result.errors?.length || 0,
      });

      return JSON.stringify({
        valid: false,
        message: 'Template has validation errors',
        errors: result.errors || [],
        warnings: result.warnings || [],
        suggestions: generateSuggestions(result.errors || []),
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
