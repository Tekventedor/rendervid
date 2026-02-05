import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  fontSourceSchema,
  fontFamilySchema,
  fontConfigurationSchema,
  templateSchema,
} from '../validation/schema';

const ajv = new Ajv();
addFormats(ajv);

describe('Font Validation Schema', () => {
  describe('fontSourceSchema', () => {
    it('should validate valid font source with URL', () => {
      const validate = ajv.compile(fontSourceSchema);
      const valid = validate({
        url: 'https://fonts.gstatic.com/inter.woff2',
        weight: 400,
        style: 'normal',
      });
      expect(valid).toBe(true);
    });

    it('should validate font source with local', () => {
      const validate = ajv.compile(fontSourceSchema);
      const valid = validate({
        local: 'Inter',
        url: 'fallback.woff2',
        weight: 700,
      });
      expect(valid).toBe(true);
    });

    it('should validate font source with local array', () => {
      const validate = ajv.compile(fontSourceSchema);
      const valid = validate({
        local: ['Inter', 'Inter-Regular'],
        url: 'fallback.woff2',
      });
      expect(valid).toBe(true);
    });

    it('should validate font source with format', () => {
      const validate = ajv.compile(fontSourceSchema);
      const valid = validate({
        url: 'font.ttf',
        format: 'truetype',
        weight: 400,
      });
      expect(valid).toBe(true);
    });

    it('should reject invalid weight', () => {
      const validate = ajv.compile(fontSourceSchema);
      const valid = validate({
        url: 'font.woff2',
        weight: 450,
      });
      expect(valid).toBe(false);
    });

    it('should reject invalid style', () => {
      const validate = ajv.compile(fontSourceSchema);
      const valid = validate({
        url: 'font.woff2',
        style: 'bold',
      });
      expect(valid).toBe(false);
    });
  });

  describe('fontFamilySchema', () => {
    it('should validate valid font family', () => {
      const validate = ajv.compile(fontFamilySchema);
      const valid = validate({
        family: 'Inter',
        sources: [
          { url: 'inter-regular.woff2', weight: 400 },
          { url: 'inter-bold.woff2', weight: 700 },
        ],
      });
      expect(valid).toBe(true);
    });

    it('should validate font family with all optional fields', () => {
      const validate = ajv.compile(fontFamilySchema);
      const valid = validate({
        family: 'Roboto',
        sources: [{ url: 'roboto.woff2' }],
        display: 'swap',
        fallback: ['Arial', 'sans-serif'],
        preload: true,
      });
      expect(valid).toBe(true);
    });

    it('should reject empty sources array', () => {
      const validate = ajv.compile(fontFamilySchema);
      const valid = validate({
        family: 'Inter',
        sources: [],
      });
      expect(valid).toBe(false);
    });

    it('should reject missing family', () => {
      const validate = ajv.compile(fontFamilySchema);
      const valid = validate({
        sources: [{ url: 'font.woff2' }],
      });
      expect(valid).toBe(false);
    });

    it('should reject invalid display value', () => {
      const validate = ajv.compile(fontFamilySchema);
      const valid = validate({
        family: 'Inter',
        sources: [{ url: 'font.woff2' }],
        display: 'immediate',
      });
      expect(valid).toBe(false);
    });
  });

  describe('fontConfigurationSchema', () => {
    it('should validate valid font configuration', () => {
      const validate = ajv.compile(fontConfigurationSchema);
      const valid = validate({
        families: [
          {
            family: 'Inter',
            sources: [{ url: 'inter.woff2' }],
          },
        ],
      });
      expect(valid).toBe(true);
    });

    it('should validate font configuration with basePath', () => {
      const validate = ajv.compile(fontConfigurationSchema);
      const valid = validate({
        families: [
          {
            family: 'Inter',
            sources: [{ url: 'inter.woff2' }],
          },
        ],
        basePath: '/fonts',
      });
      expect(valid).toBe(true);
    });

    it('should validate multiple font families', () => {
      const validate = ajv.compile(fontConfigurationSchema);
      const valid = validate({
        families: [
          {
            family: 'Inter',
            sources: [{ url: 'inter.woff2' }],
          },
          {
            family: 'Roboto',
            sources: [{ url: 'roboto.woff2' }],
          },
        ],
      });
      expect(valid).toBe(true);
    });

    it('should reject empty families array', () => {
      const validate = ajv.compile(fontConfigurationSchema);
      const valid = validate({
        families: [],
      });
      expect(valid).toBe(false);
    });

    it('should reject missing families', () => {
      const validate = ajv.compile(fontConfigurationSchema);
      const valid = validate({
        basePath: '/fonts',
      });
      expect(valid).toBe(false);
    });
  });

  describe('templateSchema with fonts', () => {
    it('should validate template without fonts (backward compatibility)', () => {
      const validate = ajv.compile(templateSchema);
      const valid = validate({
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
              id: 'scene1',
              startFrame: 0,
              endFrame: 150,
              layers: [],
            },
          ],
        },
      });
      expect(valid).toBe(true);
    });

    it('should validate template with fonts', () => {
      const validate = ajv.compile(templateSchema);
      const valid = validate({
        name: 'Test Template',
        output: {
          type: 'video',
          width: 1920,
          height: 1080,
        },
        inputs: [],
        fonts: {
          families: [
            {
              family: 'Inter',
              sources: [
                { url: 'inter-regular.woff2', weight: 400 },
                { url: 'inter-bold.woff2', weight: 700 },
              ],
              fallback: ['Arial', 'sans-serif'],
            },
          ],
        },
        composition: {
          scenes: [
            {
              id: 'scene1',
              startFrame: 0,
              endFrame: 150,
              layers: [],
            },
          ],
        },
      });
      expect(valid).toBe(true);
      if (!valid) {
        console.log('Validation errors:', validate.errors);
      }
    });

    it('should reject template with invalid font configuration', () => {
      const validate = ajv.compile(templateSchema);
      const valid = validate({
        name: 'Test Template',
        output: {
          type: 'video',
          width: 1920,
          height: 1080,
        },
        inputs: [],
        fonts: {
          families: [], // Empty array should fail
        },
        composition: {
          scenes: [
            {
              id: 'scene1',
              startFrame: 0,
              endFrame: 150,
              layers: [],
            },
          ],
        },
      });
      expect(valid).toBe(false);
    });
  });
});
