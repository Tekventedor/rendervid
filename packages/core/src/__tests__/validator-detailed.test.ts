import { describe, it, expect } from 'vitest';
import { validateTemplate, validateInputs } from '../validation/validator';
import type { Template } from '../types';

function makeValidTemplate(overrides: Partial<Template> = {}): Template {
  return {
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
          layers: [],
        },
      ],
    },
    ...overrides,
  };
}

describe('validateTemplate - Semantic Validations', () => {
  describe('scene overlap detection', () => {
    it('should detect overlapping scenes', () => {
      const template = makeValidTemplate({
        composition: {
          scenes: [
            { id: 'scene-1', startFrame: 0, endFrame: 100, layers: [] },
            { id: 'scene-2', startFrame: 50, endFrame: 150, layers: [] },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'SCENE_OVERLAP')).toBe(true);
    });

    it('should allow non-overlapping scenes', () => {
      const template = makeValidTemplate({
        composition: {
          scenes: [
            { id: 'scene-1', startFrame: 0, endFrame: 90, layers: [] },
            { id: 'scene-2', startFrame: 90, endFrame: 180, layers: [] },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.valid).toBe(true);
    });

    it('should allow scenes with gaps', () => {
      const template = makeValidTemplate({
        composition: {
          scenes: [
            { id: 'scene-1', startFrame: 0, endFrame: 90, layers: [] },
            { id: 'scene-2', startFrame: 120, endFrame: 210, layers: [] },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.valid).toBe(true);
    });
  });

  describe('duplicate layer ID detection', () => {
    it('should detect duplicate layer IDs', () => {
      const template = makeValidTemplate({
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 90,
              layers: [
                { id: 'layer-1', type: 'text', position: { x: 0, y: 0 }, size: { width: 100, height: 100 }, props: {} },
                { id: 'layer-1', type: 'text', position: { x: 0, y: 0 }, size: { width: 100, height: 100 }, props: {} },
              ],
            },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'DUPLICATE_LAYER_ID')).toBe(true);
    });

    it('should detect duplicates across scenes', () => {
      const template = makeValidTemplate({
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 90,
              layers: [
                { id: 'shared-id', type: 'text', position: { x: 0, y: 0 }, size: { width: 100, height: 100 }, props: {} },
              ],
            },
            {
              id: 'scene-2',
              startFrame: 90,
              endFrame: 180,
              layers: [
                { id: 'shared-id', type: 'text', position: { x: 0, y: 0 }, size: { width: 100, height: 100 }, props: {} },
              ],
            },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'DUPLICATE_LAYER_ID')).toBe(true);
    });
  });

  describe('duplicate scene ID detection', () => {
    it('should detect duplicate scene IDs', () => {
      const template = makeValidTemplate({
        composition: {
          scenes: [
            { id: 'same-id', startFrame: 0, endFrame: 90, layers: [] },
            { id: 'same-id', startFrame: 90, endFrame: 180, layers: [] },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'DUPLICATE_SCENE_ID')).toBe(true);
    });
  });

  describe('unused input warnings', () => {
    it('should warn about unused inputs', () => {
      const template = makeValidTemplate({
        inputs: [
          { key: 'title', type: 'string', label: 'Title', description: 'The title', required: true },
        ],
        composition: {
          scenes: [
            { id: 'scene-1', startFrame: 0, endFrame: 90, layers: [] },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.valid).toBe(true); // warnings don't invalidate
      expect(result.warnings.some(w => w.code === 'UNUSED_INPUT')).toBe(true);
    });

    it('should not warn when input is used via inputKey', () => {
      const template = makeValidTemplate({
        inputs: [
          { key: 'title', type: 'string', label: 'Title', description: 'The title', required: true },
        ],
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
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  inputKey: 'title',
                  props: {},
                },
              ],
            },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.warnings.filter(w => w.code === 'UNUSED_INPUT')).toHaveLength(0);
    });
  });

  describe('custom component reference validation', () => {
    it('should error when custom layer references undefined component', () => {
      const template = makeValidTemplate({
        customComponents: {
          ExistingComp: { type: 'inline', code: 'function() {}' },
        },
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 90,
              layers: [
                {
                  id: 'layer-1',
                  type: 'custom',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  customComponent: { name: 'NonExistentComp' },
                  props: {},
                },
              ],
            },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'UNKNOWN_COMPONENT')).toBe(true);
    });

    it('should pass when custom layer references defined component', () => {
      const template = makeValidTemplate({
        customComponents: {
          MyComp: { type: 'inline', code: 'function() {}' },
        },
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 90,
              layers: [
                {
                  id: 'layer-1',
                  type: 'custom',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  customComponent: { name: 'MyComp' },
                  props: {},
                },
              ],
            },
          ],
        },
      });

      const result = validateTemplate(template);
      expect(result.valid).toBe(true);
    });
  });
});

describe('validateInputs - Detailed', () => {
  describe('type validation', () => {
    it('should reject string input with number value', () => {
      const template = makeValidTemplate({
        inputs: [
          { key: 'name', type: 'string', label: 'Name', description: 'Name', required: true },
        ],
      });

      const result = validateInputs(template, { name: 42 });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_INPUT_TYPE')).toBe(true);
    });

    it('should reject number input with string value', () => {
      const template = makeValidTemplate({
        inputs: [
          { key: 'count', type: 'number', label: 'Count', description: 'Count', required: true },
        ],
      });

      const result = validateInputs(template, { count: 'five' });
      expect(result.valid).toBe(false);
    });

    it('should accept boolean input', () => {
      const template = makeValidTemplate({
        inputs: [
          { key: 'enabled', type: 'boolean', label: 'Enabled', description: 'Enable', required: false },
        ],
      });

      const result = validateInputs(template, { enabled: true });
      expect(result.valid).toBe(true);
    });

    it('should accept color as string', () => {
      const template = makeValidTemplate({
        inputs: [
          { key: 'bg', type: 'color', label: 'Background', description: 'BG color', required: false },
        ],
      });

      const result = validateInputs(template, { bg: '#ff0000' });
      expect(result.valid).toBe(true);
    });

    it('should accept array input', () => {
      const template = makeValidTemplate({
        inputs: [
          { key: 'tags', type: 'array', label: 'Tags', description: 'Tag list', required: false },
        ],
      });

      const result = validateInputs(template, { tags: ['a', 'b'] });
      expect(result.valid).toBe(true);
    });

    it('should accept date as string', () => {
      const template = makeValidTemplate({
        inputs: [
          { key: 'date', type: 'date', label: 'Date', description: 'A date', required: false },
        ],
      });

      const result = validateInputs(template, { date: '2025-01-01' });
      expect(result.valid).toBe(true);
    });

    it('should accept enum as string', () => {
      const template = makeValidTemplate({
        inputs: [
          { key: 'size', type: 'enum', label: 'Size', description: 'Size', required: false },
        ],
      });

      const result = validateInputs(template, { size: 'large' });
      expect(result.valid).toBe(true);
    });
  });

  describe('validation rules', () => {
    it('should validate minLength for strings', () => {
      const template = makeValidTemplate({
        inputs: [
          {
            key: 'name',
            type: 'string',
            label: 'Name',
            description: 'Name',
            required: true,
            validation: { minLength: 3 },
          },
        ],
      });

      const result = validateInputs(template, { name: 'ab' });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'STRING_TOO_SHORT')).toBe(true);
    });

    it('should validate maxLength for strings', () => {
      const template = makeValidTemplate({
        inputs: [
          {
            key: 'name',
            type: 'string',
            label: 'Name',
            description: 'Name',
            required: true,
            validation: { maxLength: 5 },
          },
        ],
      });

      const result = validateInputs(template, { name: 'toolongname' });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'STRING_TOO_LONG')).toBe(true);
    });

    it('should validate pattern for strings', () => {
      const template = makeValidTemplate({
        inputs: [
          {
            key: 'code',
            type: 'string',
            label: 'Code',
            description: 'Code',
            required: true,
            validation: { pattern: '^[A-Z]{3}$' },
          },
        ],
      });

      expect(validateInputs(template, { code: 'ABC' }).valid).toBe(true);
      expect(validateInputs(template, { code: 'abc' }).valid).toBe(false);
    });

    it('should validate min/max for numbers', () => {
      const template = makeValidTemplate({
        inputs: [
          {
            key: 'age',
            type: 'number',
            label: 'Age',
            description: 'Age',
            required: true,
            validation: { min: 0, max: 120 },
          },
        ],
      });

      expect(validateInputs(template, { age: 25 }).valid).toBe(true);
      expect(validateInputs(template, { age: -1 }).valid).toBe(false);
      expect(validateInputs(template, { age: 200 }).valid).toBe(false);
    });

    it('should validate integer constraint', () => {
      const template = makeValidTemplate({
        inputs: [
          {
            key: 'count',
            type: 'number',
            label: 'Count',
            description: 'Count',
            required: true,
            validation: { integer: true },
          },
        ],
      });

      expect(validateInputs(template, { count: 5 }).valid).toBe(true);
      expect(validateInputs(template, { count: 5.5 }).valid).toBe(false);
    });

    it('should validate array minItems/maxItems', () => {
      const template = makeValidTemplate({
        inputs: [
          {
            key: 'items',
            type: 'array',
            label: 'Items',
            description: 'Items',
            required: true,
            validation: { minItems: 1, maxItems: 3 },
          },
        ],
      });

      expect(validateInputs(template, { items: [] }).valid).toBe(false);
      expect(validateInputs(template, { items: ['a'] }).valid).toBe(true);
      expect(validateInputs(template, { items: ['a', 'b', 'c', 'd'] }).valid).toBe(false);
    });

    it('should validate options (enum)', () => {
      const template = makeValidTemplate({
        inputs: [
          {
            key: 'size',
            type: 'string',
            label: 'Size',
            description: 'Size',
            required: true,
            validation: {
              options: [
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ],
            },
          },
        ],
      });

      expect(validateInputs(template, { size: 'medium' }).valid).toBe(true);
      expect(validateInputs(template, { size: 'huge' }).valid).toBe(false);
    });
  });

  describe('unknown input warnings', () => {
    it('should warn about inputs not defined in template', () => {
      const template = makeValidTemplate({ inputs: [] });
      const result = validateInputs(template, { extra: 'value' });
      expect(result.valid).toBe(true); // warnings don't fail validation
      expect(result.warnings.some(w => w.code === 'UNKNOWN_INPUT')).toBe(true);
    });
  });

  describe('optional inputs', () => {
    it('should skip validation for optional inputs that are undefined', () => {
      const template = makeValidTemplate({
        inputs: [
          {
            key: 'optional',
            type: 'number',
            label: 'Optional',
            description: 'Optional',
            required: false,
            validation: { min: 0 },
          },
        ],
      });

      const result = validateInputs(template, {});
      expect(result.valid).toBe(true);
    });

    it('should skip validation for optional inputs that are null', () => {
      const template = makeValidTemplate({
        inputs: [
          {
            key: 'optional',
            type: 'number',
            label: 'Optional',
            description: 'Optional',
            required: false,
          },
        ],
      });

      const result = validateInputs(template, { optional: null });
      expect(result.valid).toBe(true);
    });
  });
});
