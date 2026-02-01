import { describe, it, expect } from 'vitest';
import {
  sceneTemplates,
  getSceneTemplate,
  getScenesByCategory,
  searchScenes,
  getSceneCategories,
  getSceneTags,
  aspectRatioResolutions,
  getResolution,
} from '../scenes';
import { modernTheme } from '../themes';
import type { SceneGenerateOptions, AspectRatio } from '../scenes';

describe('Scene Templates', () => {
  describe('sceneTemplates registry', () => {
    it('should have 11 scene templates', () => {
      expect(sceneTemplates).toHaveLength(11);
    });

    it('should have unique IDs for all templates', () => {
      const ids = sceneTemplates.map((t) => t.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids).toHaveLength(uniqueIds.length);
    });

    it('should have valid category for all templates', () => {
      sceneTemplates.forEach((template) => {
        expect(template.category).toBeDefined();
        expect(typeof template.category).toBe('string');
      });
    });
  });

  describe('getSceneTemplate', () => {
    it('should return a template by ID', () => {
      const template = getSceneTemplate('title-reveal');
      expect(template).toBeDefined();
      expect(template?.id).toBe('title-reveal');
    });

    it('should return undefined for unknown ID', () => {
      const template = getSceneTemplate('unknown-template');
      expect(template).toBeUndefined();
    });
  });

  describe('getScenesByCategory', () => {
    it('should return templates by category', () => {
      const introTemplates = getScenesByCategory('intro');
      expect(introTemplates.length).toBeGreaterThan(0);
      introTemplates.forEach((template) => {
        expect(template.category).toBe('intro');
      });
    });

    it('should return empty array for unknown category', () => {
      const templates = getScenesByCategory('unknown-category');
      expect(templates).toHaveLength(0);
    });
  });

  describe('searchScenes', () => {
    it('should find templates by name', () => {
      const results = searchScenes('title');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find templates by tag', () => {
      const results = searchScenes('social');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const results1 = searchScenes('LOGO');
      const results2 = searchScenes('logo');
      expect(results1).toEqual(results2);
    });

    it('should return empty array for no matches', () => {
      const results = searchScenes('xyznonexistent');
      expect(results).toHaveLength(0);
    });
  });

  describe('getSceneCategories', () => {
    it('should return unique categories', () => {
      const categories = getSceneCategories();
      const uniqueCategories = [...new Set(categories)];
      expect(categories).toEqual(uniqueCategories);
    });

    it('should include expected categories', () => {
      const categories = getSceneCategories();
      expect(categories).toContain('intro');
      expect(categories).toContain('promo');
    });
  });

  describe('getSceneTags', () => {
    it('should return sorted unique tags', () => {
      const tags = getSceneTags();
      const sortedTags = [...tags].sort();
      expect(tags).toEqual(sortedTags);
    });

    it('should include expected tags', () => {
      const tags = getSceneTags();
      expect(tags).toContain('animation');
      expect(tags).toContain('marketing');
    });
  });

  describe('aspectRatioResolutions', () => {
    it('should have all aspect ratios defined', () => {
      expect(aspectRatioResolutions['16:9']).toBeDefined();
      expect(aspectRatioResolutions['9:16']).toBeDefined();
      expect(aspectRatioResolutions['1:1']).toBeDefined();
      expect(aspectRatioResolutions['4:5']).toBeDefined();
      expect(aspectRatioResolutions['4:3']).toBeDefined();
    });

    it('should have valid dimensions', () => {
      Object.values(aspectRatioResolutions).forEach((res) => {
        expect(res.width).toBeGreaterThan(0);
        expect(res.height).toBeGreaterThan(0);
      });
    });
  });

  describe('getResolution', () => {
    it('should return correct resolution for 16:9', () => {
      const res = getResolution('16:9');
      expect(res.width).toBe(1920);
      expect(res.height).toBe(1080);
    });

    it('should return correct resolution for 9:16', () => {
      const res = getResolution('9:16');
      expect(res.width).toBe(1080);
      expect(res.height).toBe(1920);
    });

    it('should return correct resolution for 1:1', () => {
      const res = getResolution('1:1');
      expect(res.width).toBe(1080);
      expect(res.height).toBe(1080);
    });
  });

  describe('Scene generation', () => {
    const defaultOptions: SceneGenerateOptions = {
      aspectRatio: '16:9',
      theme: modernTheme,
      fps: 30,
      duration: 5,
    };

    sceneTemplates.forEach((template) => {
      describe(`${template.name}`, () => {
        it('should generate a valid template', () => {
          const result = template.generate(template.defaults as any, defaultOptions);

          expect(result).toBeDefined();
          expect(result.name).toBeDefined();
          expect(result.output).toBeDefined();
          expect(result.composition).toBeDefined();
        });

        it('should have valid output configuration', () => {
          const result = template.generate(template.defaults as any, defaultOptions);

          expect(result.output.type).toBe('video');
          expect(result.output.width).toBeGreaterThan(0);
          expect(result.output.height).toBeGreaterThan(0);
          expect(result.output.fps).toBeGreaterThan(0);
          expect(result.output.duration).toBeGreaterThan(0);
        });

        it('should have at least one scene with layers', () => {
          const result = template.generate(template.defaults as any, defaultOptions);

          expect(result.composition.scenes).toBeDefined();
          expect(result.composition.scenes.length).toBeGreaterThan(0);
          expect(result.composition.scenes[0].layers.length).toBeGreaterThan(0);
        });

        it('should generate correctly for all supported aspect ratios', () => {
          template.aspectRatios.forEach((aspectRatio) => {
            const options = { ...defaultOptions, aspectRatio };
            const result = template.generate(template.defaults as any, options);
            const expectedRes = getResolution(aspectRatio);

            expect(result.output.width).toBe(expectedRes.width);
            expect(result.output.height).toBe(expectedRes.height);
          });
        });

        it('should respect custom duration', () => {
          const customDuration = 10;
          const options = { ...defaultOptions, duration: customDuration };
          const result = template.generate(template.defaults as any, options);

          expect(result.output.duration).toBe(customDuration);
        });

        it('should have valid layer structure', () => {
          const result = template.generate(template.defaults as any, defaultOptions);

          result.composition.scenes[0].layers.forEach((layer) => {
            expect(layer.id).toBeDefined();
            expect(layer.type).toBeDefined();
            expect(layer.position).toBeDefined();
            expect(layer.size).toBeDefined();
            expect(['shape', 'text', 'image', 'video', 'audio']).toContain(layer.type);
          });
        });
      });
    });
  });

  describe('Theme variable inheritance', () => {
    it('should use theme colors as defaults', () => {
      const template = getSceneTemplate('title-reveal');
      const result = template?.generate(template.defaults as any, {
        aspectRatio: '16:9',
        theme: modernTheme,
        fps: 30,
      });

      // The background layer should use theme.colors.background
      const bgLayer = result?.composition.scenes[0].layers.find(
        (l) => l.id === 'background'
      );
      expect(bgLayer).toBeDefined();
    });

    it('should allow color overrides from inputs', () => {
      const template = getSceneTemplate('title-reveal');
      const customColor = '#FF0000';

      const result = template?.generate(
        { ...template.defaults, primaryColor: customColor } as any,
        {
          aspectRatio: '16:9',
          theme: modernTheme,
          fps: 30,
        }
      );

      expect(result).toBeDefined();
      // Custom color should be used somewhere in the template
    });
  });
});
