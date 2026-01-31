import { describe, it, expect } from 'vitest';
import { validateTemplate, validateInputs, getTemplateSchema } from '../validation';
import type { Template } from '../types';

describe('Template Validation', () => {
  it('should validate a valid template', () => {
    const template: Template = {
      name: 'Test Template',
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
        fps: 30,
      },
      inputs: [],
      composition: {
        scenes: [
          {
            id: 'scene-1',
            startFrame: 0,
            endFrame: 90,
            layers: [
              {
                id: 'layer-1',
                type: 'text',
                position: { x: 100, y: 100 },
                size: { width: 800, height: 100 },
                props: {
                  text: 'Hello World',
                  fontSize: 48,
                },
              },
            ],
          },
        ],
      },
    };

    const result = validateTemplate(template);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject template without name', () => {
    const template = {
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
      },
      inputs: [],
      composition: {
        scenes: [],
      },
    };

    const result = validateTemplate(template);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject template without output', () => {
    const template = {
      name: 'Test',
      inputs: [],
      composition: {
        scenes: [],
      },
    };

    const result = validateTemplate(template);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject template with invalid layer type', () => {
    const template = {
      name: 'Test Template',
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
      },
      inputs: [],
      composition: {
        scenes: [
          {
            id: 'scene-1',
            startFrame: 0,
            endFrame: 90,
            layers: [
              {
                id: 'layer-1',
                type: 'invalidType',
                position: { x: 0, y: 0 },
                size: { width: 100, height: 100 },
                props: {},
              },
            ],
          },
        ],
      },
    };

    const result = validateTemplate(template);
    expect(result.valid).toBe(false);
  });
});

describe('Input Validation', () => {
  it('should validate inputs against template', () => {
    const template: Template = {
      name: 'Test Template',
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
      },
      inputs: [
        {
          key: 'title',
          type: 'string',
          label: 'Title',
          required: true,
        },
        {
          key: 'count',
          type: 'number',
          label: 'Count',
        },
      ],
      composition: {
        scenes: [],
      },
    };

    const validInputs = { title: 'Hello', count: 42 };
    const result = validateInputs(template, validInputs);
    expect(result.valid).toBe(true);
  });

  it('should reject missing required inputs', () => {
    const template: Template = {
      name: 'Test Template',
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
      },
      inputs: [
        {
          key: 'title',
          type: 'string',
          label: 'Title',
          required: true,
        },
      ],
      composition: {
        scenes: [],
      },
    };

    const invalidInputs = {}; // missing 'title'
    const result = validateInputs(template, invalidInputs);
    expect(result.valid).toBe(false);
  });
});

describe('Schema Generation', () => {
  it('should return template schema', () => {
    const schema = getTemplateSchema();
    expect(schema).toBeDefined();
    expect(schema.type).toBe('object');
    expect(schema.properties).toBeDefined();
    expect(schema.required).toContain('name');
    expect(schema.required).toContain('output');
    expect(schema.required).toContain('composition');
  });
});
