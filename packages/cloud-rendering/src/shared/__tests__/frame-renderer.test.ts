import {
  generateRenderHTML,
  validateTemplate,
  calculateTotalFrames,
  getCloudBrowserArgs,
} from '../frame-renderer';
import type { Template } from '@rendervid/core';

describe('Frame Renderer', () => {
  const validTemplate: Template = {
    name: 'Test Template',
    inputs: [],
    output: {
      type: 'video' as const,
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 10,
    },
    composition: {
      scenes: [
        {
          id: 'scene1',
          startFrame: 0,
          endFrame: 299,
          layers: [
            {
              id: 'text1',
              type: 'text' as const,
              position: { x: 960, y: 540 },
              size: { width: 800, height: 100 },
              props: { text: 'Hello', fontSize: 48, color: '#fff' },
            },
          ],
        },
      ],
    },
  };

  describe('generateRenderHTML', () => {
    it('should generate HTML with correct dimensions', () => {
      const html = generateRenderHTML(validTemplate);

      expect(html).toContain('width: 1920px');
      expect(html).toContain('height: 1080px');
    });

    it('should embed template as JSON', () => {
      const html = generateRenderHTML(validTemplate);

      expect(html).toContain('window.RENDERVID_TEMPLATE');
      expect(html).toContain(JSON.stringify(validTemplate));
    });

    it('should embed inputs as JSON', () => {
      const inputs = { title: 'Test', color: '#ff0000' };
      const html = generateRenderHTML(validTemplate, inputs);

      expect(html).toContain('window.RENDERVID_INPUTS');
      expect(html).toContain(JSON.stringify(inputs));
    });

    it('should set default empty inputs', () => {
      const html = generateRenderHTML(validTemplate);

      expect(html).toContain('window.RENDERVID_INPUTS = {}');
    });

    it('should include render frame function', () => {
      const html = generateRenderHTML(validTemplate);

      expect(html).toContain('window.renderFrame');
      expect(html).toContain('window.RENDERVID_CURRENT_FRAME');
      expect(html).toContain('window.RENDERVID_READY');
    });
  });

  describe('validateTemplate', () => {
    it('should validate a correct template', () => {
      const result = validateTemplate(validTemplate);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report missing output', () => {
      const template = { composition: validTemplate.composition } as Template;

      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Template missing output configuration');
    });

    it('should report missing width/height', () => {
      const template: Template = {
        name: 'Test Template',
        inputs: [],
        output: { type: 'video' as const, width: 0, height: 0, fps: 30, duration: 10 },
        composition: validTemplate.composition,
      };

      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Template missing output width/height');
    });

    it('should report missing fps', () => {
      const template: Template = {
        name: 'Test Template',
        inputs: [],
        output: { type: 'video' as const, width: 1920, height: 1080, fps: 0, duration: 10 },
        composition: validTemplate.composition,
      };

      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Template missing output fps');
    });

    it('should report missing duration', () => {
      const template: Template = {
        name: 'Test Template',
        inputs: [],
        output: { type: 'video' as const, width: 1920, height: 1080, fps: 30 },
        composition: validTemplate.composition,
      };

      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Template missing output duration');
    });

    it('should report missing scenes', () => {
      const template: Template = {
        name: 'Test Template',
        inputs: [],
        output: validTemplate.output,
        composition: { scenes: [] },
      };

      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Template has no scenes');
    });

    it('should report scenes with missing frame range', () => {
      const template: Template = {
        name: 'Test Template',
        inputs: [],
        output: validTemplate.output,
        composition: {
          scenes: [
            {
              id: 's1',
              layers: [
                {
                  id: 'l1',
                  type: 'text' as const,
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  props: { text: 'Hi', fontSize: 24, color: '#000' },
                },
              ],
            } as any,
          ],
        },
      };

      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('Scene 0 missing startFrame or endFrame'),
        ])
      );
    });

    it('should report scenes with no layers', () => {
      const template: Template = {
        name: 'Test Template',
        inputs: [],
        output: validTemplate.output,
        composition: {
          scenes: [
            {
              id: 's1',
              startFrame: 0,
              endFrame: 29,
              layers: [],
            },
          ],
        },
      };

      const result = validateTemplate(template);

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Scene 0 has no layers')])
      );
    });
  });

  describe('calculateTotalFrames', () => {
    it('should calculate total frames from duration and fps', () => {
      const result = calculateTotalFrames(validTemplate);
      expect(result).toBe(300); // 10s * 30fps
    });

    it('should throw when duration is missing', () => {
      const template: Template = {
        name: 'Test Template',
        inputs: [],
        output: { type: 'video' as const, width: 1920, height: 1080, fps: 30 },
        composition: validTemplate.composition,
      };

      expect(() => calculateTotalFrames(template)).toThrow(
        'Template output must have duration and fps'
      );
    });

    it('should ceil for fractional frames', () => {
      const template: Template = {
        name: 'Test Template',
        inputs: [],
        output: { type: 'video' as const, width: 1920, height: 1080, fps: 30, duration: 10.1 },
        composition: validTemplate.composition,
      };

      const result = calculateTotalFrames(template);
      expect(result).toBe(303); // ceil(10.1 * 30) = 303
    });
  });

  describe('getCloudBrowserArgs', () => {
    it('should return browser arguments with correct window size', () => {
      const args = getCloudBrowserArgs(1920, 1080);

      expect(args).toContain('--no-sandbox');
      expect(args).toContain('--disable-gpu');
      expect(args).toContain('--disable-dev-shm-usage');
      expect(args).toContain('--window-size=1920,1080');
    });

    it('should include all required stability flags', () => {
      const args = getCloudBrowserArgs(800, 600);

      expect(args).toContain('--disable-setuid-sandbox');
      expect(args).toContain('--disable-web-security');
      expect(args).toContain('--window-size=800,600');
    });
  });
});
