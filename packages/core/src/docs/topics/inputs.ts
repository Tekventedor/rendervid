import type { DocResult } from '../types.js';

export function getInputsDocs(): DocResult {
  return {
    topic: 'inputs',
    title: 'Template Inputs',
    description: 'Input definitions allow templates to be customized at render time. Reference inputs in layer props with {{variableName}} syntax.',
    properties: {
      key: { type: 'string', required: true, description: 'Unique input key (used as {{key}} in props)', example: 'title' },
      type: { type: 'InputType', required: true, description: 'Data type', values: ['string', 'number', 'boolean', 'color', 'url', 'enum', 'richtext', 'date', 'array'] },
      label: { type: 'string', required: true, description: 'Display label for UI', example: 'Title Text' },
      description: { type: 'string', required: true, description: 'Description for users and AI agents' },
      required: { type: 'boolean', required: true, description: 'Whether this input must be provided' },
      default: { type: 'unknown', description: 'Default value if not provided' },
      validation: { type: 'InputValidation', description: 'Validation rules' },
      ui: { type: 'InputUI', description: 'UI rendering hints' },
    },
    sections: [
      {
        title: 'Validation Rules',
        description: 'Optional validation constraints',
        properties: {
          minLength: { type: 'number', description: 'Minimum string length' },
          maxLength: { type: 'number', description: 'Maximum string length' },
          pattern: { type: 'string', description: 'Regex pattern to match' },
          min: { type: 'number', description: 'Minimum numeric value' },
          max: { type: 'number', description: 'Maximum numeric value' },
          step: { type: 'number', description: 'Step increment for numbers' },
          integer: { type: 'boolean', description: 'Must be an integer' },
          options: { type: 'EnumOption[]', description: 'Available options for enum type: { value, label }' },
          allowedTypes: { type: 'string[]', description: 'Allowed asset types for URL inputs', values: ['image', 'video', 'audio', 'font'] },
          minItems: { type: 'number', description: 'Minimum array length' },
          maxItems: { type: 'number', description: 'Maximum array length' },
        },
      },
      {
        title: 'UI Hints',
        description: 'Optional hints for UI rendering',
        properties: {
          placeholder: { type: 'string', description: 'Placeholder text' },
          helpText: { type: 'string', description: 'Help text shown below input' },
          group: { type: 'string', description: 'Group name for organizing inputs' },
          order: { type: 'number', description: 'Display order within group' },
          hidden: { type: 'boolean', description: 'Hide from UI' },
          rows: { type: 'number', description: 'Rows for multiline text' },
          accept: { type: 'string', description: 'File accept attribute' },
        },
      },
    ],
    examples: [
      {
        description: 'Text input with validation',
        input: { key: 'title', type: 'string', label: 'Title', description: 'Main title text', required: true, default: 'Hello World', validation: { minLength: 1, maxLength: 100 } },
      },
      {
        description: 'Color input',
        input: { key: 'accentColor', type: 'color', label: 'Accent Color', description: 'Primary accent color', required: false, default: '#3B82F6' },
      },
      {
        description: 'Enum input',
        input: { key: 'theme', type: 'enum', label: 'Theme', description: 'Visual theme', required: true, default: 'dark', validation: { options: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }] } },
      },
    ],
    tips: [
      'Always include "inputs": [] in templates, even with no dynamic values',
      'Use {{key}} syntax in layer props to reference inputs',
      'Set defaults in the template.defaults object',
    ],
    seeAlso: ['template'],
  };
}
