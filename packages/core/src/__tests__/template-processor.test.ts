import { describe, it, expect, vi } from 'vitest';
import { TemplateProcessor } from '../template/TemplateProcessor';
import type { Template } from '../types';
import type { ComponentRegistry } from '../types/component';

function makeMinimalTemplate(overrides: Partial<Template> = {}): Template {
  return {
    name: 'Test Template',
    output: { type: 'video', width: 1920, height: 1080 },
    inputs: [],
    composition: { scenes: [] },
    ...overrides,
  };
}

function createMockRegistry(): ComponentRegistry {
  const components = new Map<string, (...args: any[]) => unknown>();
  return {
    register: vi.fn((name, component) => {
      components.set(name, component);
    }),
    get: vi.fn((name) => components.get(name)),
    list: vi.fn(() => []),
    registerFromUrl: vi.fn(async (name, _url) => {
      components.set(name, () => null);
    }),
    registerFromCode: vi.fn((name, _code) => {
      components.set(name, () => null);
    }),
    unregister: vi.fn((name) => components.delete(name)),
    has: vi.fn((name) => components.has(name)),
  };
}

describe('TemplateProcessor', () => {
  describe('loadCustomComponents', () => {
    it('should do nothing when template has no customComponents', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();
      const template = makeMinimalTemplate();

      await processor.loadCustomComponents(template, registry);
      expect(registry.register).not.toHaveBeenCalled();
    });

    it('should skip already registered components', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();
      (registry.has as any).mockReturnValue(true);

      const template = makeMinimalTemplate({
        customComponents: {
          Existing: { type: 'inline', code: 'function Existing() {}' },
        },
      });

      await processor.loadCustomComponents(template, registry);
      expect(registry.registerFromCode).not.toHaveBeenCalled();
    });

    it('should load inline component', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();

      const template = makeMinimalTemplate({
        customComponents: {
          InlineComp: { type: 'inline', code: 'function InlineComp() {}' },
        },
      });

      await processor.loadCustomComponents(template, registry);
      expect(registry.registerFromCode).toHaveBeenCalledWith(
        'InlineComp',
        'function InlineComp() {}'
      );
    });

    it('should load URL component', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();

      const template = makeMinimalTemplate({
        customComponents: {
          UrlComp: { type: 'url', url: 'https://example.com/comp.js' },
        },
      });

      await processor.loadCustomComponents(template, registry);
      expect(registry.registerFromUrl).toHaveBeenCalledWith(
        'UrlComp',
        'https://example.com/comp.js'
      );
    });

    it('should load reference component', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();
      const dummyComponent = () => null;
      (registry.get as any).mockReturnValue(dummyComponent);

      const template = makeMinimalTemplate({
        customComponents: {
          RefComp: { type: 'reference', reference: 'OriginalComp' },
        },
      });

      await processor.loadCustomComponents(template, registry);
      expect(registry.get).toHaveBeenCalledWith('OriginalComp');
      expect(registry.register).toHaveBeenCalledWith(
        'RefComp',
        dummyComponent,
        undefined
      );
    });

    it('should throw when reference component is not found', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();
      (registry.get as any).mockReturnValue(undefined);

      const template = makeMinimalTemplate({
        customComponents: {
          BadRef: { type: 'reference', reference: 'NonExistent' },
        },
      });

      await expect(
        processor.loadCustomComponents(template, registry)
      ).rejects.toThrow('Referenced component "NonExistent" not found');
    });

    it('should throw when reference is missing', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();

      const template = makeMinimalTemplate({
        customComponents: {
          NoRef: { type: 'reference' },
        },
      });

      await expect(
        processor.loadCustomComponents(template, registry)
      ).rejects.toThrow('Reference missing');
    });

    it('should throw when URL is missing', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();

      const template = makeMinimalTemplate({
        customComponents: {
          NoUrl: { type: 'url' },
        },
      });

      await expect(
        processor.loadCustomComponents(template, registry)
      ).rejects.toThrow('URL missing');
    });

    it('should throw when inline code is missing', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();

      const template = makeMinimalTemplate({
        customComponents: {
          NoCode: { type: 'inline' },
        },
      });

      await expect(
        processor.loadCustomComponents(template, registry)
      ).rejects.toThrow('Code missing');
    });

    it('should throw for unknown component type', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();

      const template = makeMinimalTemplate({
        customComponents: {
          BadType: { type: 'unknown' as any },
        },
      });

      await expect(
        processor.loadCustomComponents(template, registry)
      ).rejects.toThrow('Unknown component type');
    });

    it('should load multiple components in parallel', async () => {
      const processor = new TemplateProcessor();
      const registry = createMockRegistry();

      const template = makeMinimalTemplate({
        customComponents: {
          Comp1: { type: 'inline', code: 'function Comp1() {}' },
          Comp2: { type: 'inline', code: 'function Comp2() {}' },
          Comp3: { type: 'inline', code: 'function Comp3() {}' },
        },
      });

      await processor.loadCustomComponents(template, registry);
      expect(registry.registerFromCode).toHaveBeenCalledTimes(3);
    });
  });

  describe('resolveInputs', () => {
    it('should replace {{key}} placeholders in string values', () => {
      const processor = new TemplateProcessor();
      const template = makeMinimalTemplate({
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 90,
              layers: [
                {
                  id: 'text-1',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 800, height: 100 },
                  props: { text: '{{title}}', color: '{{color}}' },
                },
              ],
            },
          ],
        },
      });

      const resolved = processor.resolveInputs(template, {
        title: 'Hello World',
        color: '#ff0000',
      });

      const layer = resolved.composition.scenes[0].layers[0];
      expect(layer.props.text).toBe('Hello World');
      expect(layer.props.color).toBe('#ff0000');
    });

    it('should leave unresolved placeholders unchanged', () => {
      const processor = new TemplateProcessor();
      const template = makeMinimalTemplate({
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 90,
              layers: [
                {
                  id: 'text-1',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 800, height: 100 },
                  props: { text: '{{missing}}' },
                },
              ],
            },
          ],
        },
      });

      const resolved = processor.resolveInputs(template, {});
      const layer = resolved.composition.scenes[0].layers[0];
      expect(layer.props.text).toBe('{{missing}}');
    });

    it('should not mutate the original template', () => {
      const processor = new TemplateProcessor();
      const template = makeMinimalTemplate({
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 90,
              layers: [
                {
                  id: 'text-1',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 800, height: 100 },
                  props: { text: '{{title}}' },
                },
              ],
            },
          ],
        },
      });

      processor.resolveInputs(template, { title: 'Changed' });

      const layer = template.composition.scenes[0].layers[0];
      expect(layer.props.text).toBe('{{title}}');
    });

    it('should handle nested objects and arrays', () => {
      const processor = new TemplateProcessor();
      const template = makeMinimalTemplate({
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
                  props: {
                    nested: {
                      deep: '{{value}}',
                    },
                    list: ['{{a}}', '{{b}}'],
                  },
                },
              ],
            },
          ],
        },
      });

      const resolved = processor.resolveInputs(template, {
        value: 'deep_val',
        a: 'first',
        b: 'second',
      });

      const layer = resolved.composition.scenes[0].layers[0];
      expect((layer.props as any).nested.deep).toBe('deep_val');
      expect((layer.props as any).list).toEqual(['first', 'second']);
    });

    it('should convert non-string input values to strings in placeholders', () => {
      const processor = new TemplateProcessor();
      const template = makeMinimalTemplate({
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 90,
              layers: [
                {
                  id: 'text-1',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 800, height: 100 },
                  props: { text: 'Count: {{count}}' },
                },
              ],
            },
          ],
        },
      });

      const resolved = processor.resolveInputs(template, { count: 42 });
      const layer = resolved.composition.scenes[0].layers[0];
      expect(layer.props.text).toBe('Count: 42');
    });

    it('should preserve non-string primitives', () => {
      const processor = new TemplateProcessor();
      const template = makeMinimalTemplate({
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
                  props: {
                    fontSize: 48,
                    visible: true,
                    nothing: null,
                  },
                },
              ],
            },
          ],
        },
      });

      const resolved = processor.resolveInputs(template, {});
      const layer = resolved.composition.scenes[0].layers[0];
      expect((layer.props as any).fontSize).toBe(48);
      expect((layer.props as any).visible).toBe(true);
      expect((layer.props as any).nothing).toBeNull();
    });

    it('should handle multiple placeholders in one string', () => {
      const processor = new TemplateProcessor();
      const template = makeMinimalTemplate({
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 90,
              layers: [
                {
                  id: 'text-1',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 800, height: 100 },
                  props: { text: '{{greeting}}, {{name}}!' },
                },
              ],
            },
          ],
        },
      });

      const resolved = processor.resolveInputs(template, {
        greeting: 'Hello',
        name: 'World',
      });
      const layer = resolved.composition.scenes[0].layers[0];
      expect(layer.props.text).toBe('Hello, World!');
    });

    it('should also interpolate template-level string fields', () => {
      const processor = new TemplateProcessor();
      const template = makeMinimalTemplate({
        name: '{{projectName}} Video',
        description: 'A video for {{projectName}}',
      });

      const resolved = processor.resolveInputs(template, {
        projectName: 'Acme',
      });
      expect(resolved.name).toBe('Acme Video');
      expect(resolved.description).toBe('A video for Acme');
    });
  });
});
