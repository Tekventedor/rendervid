import { describe, it, expect } from 'vitest';
import { RendervidEngine } from '../engine';

describe('RendervidEngine', () => {
  it('should create engine with default options', () => {
    const engine = new RendervidEngine();
    expect(engine).toBeDefined();
  });

  it('should get capabilities', () => {
    const engine = new RendervidEngine();
    const caps = engine.getCapabilities();

    expect(caps.version).toBe('0.1.0');
    expect(caps.elements).toBeDefined();
    expect(caps.animations).toBeDefined();
    expect(caps.easings.length).toBe(31); // All 31 easings
    expect(caps.blendModes.length).toBeGreaterThan(10);
    expect(caps.filters.length).toBeGreaterThan(5);
    expect(caps.output.video.formats).toContain('mp4');
    expect(caps.output.image.formats).toContain('png');
  });

  it('should have element capabilities', () => {
    const engine = new RendervidEngine();
    const caps = engine.getCapabilities();

    expect(caps.elements.image).toBeDefined();
    expect(caps.elements.video).toBeDefined();
    expect(caps.elements.text).toBeDefined();
    expect(caps.elements.shape).toBeDefined();
    expect(caps.elements.audio).toBeDefined();
    expect(caps.elements.group).toBeDefined();
    expect(caps.elements.lottie).toBeDefined();
    expect(caps.elements.custom).toBeDefined();
  });

  it('should have animation presets', () => {
    const engine = new RendervidEngine();
    const caps = engine.getCapabilities();

    expect(caps.animations.entrance.length).toBeGreaterThan(5);
    expect(caps.animations.exit.length).toBeGreaterThan(3);
    expect(caps.animations.emphasis.length).toBeGreaterThan(3);
    expect(caps.animations.entrance).toContain('fadeIn');
    expect(caps.animations.exit).toContain('fadeOut');
  });

  it('should validate template', () => {
    const engine = new RendervidEngine();
    const template = {
      name: 'Test',
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
            layers: [],
          },
        ],
      },
    };

    const result = engine.validateTemplate(template);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid template', () => {
    const engine = new RendervidEngine();
    const result = engine.validateTemplate({ invalid: true });
    expect(result.valid).toBe(false);
  });

  it('should throw on renderVideo without renderer', async () => {
    const engine = new RendervidEngine();
    await expect(
      engine.renderVideo({
        template: {} as any,
        inputs: {},
      })
    ).rejects.toThrow('Video rendering requires a renderer package');
  });

  it('should throw on renderImage without renderer', async () => {
    const engine = new RendervidEngine();
    await expect(
      engine.renderImage({
        template: {} as any,
        inputs: {},
      })
    ).rejects.toThrow('Image rendering requires a renderer package');
  });

  it('should get template schema', () => {
    const engine = new RendervidEngine();
    const schema = engine.getTemplateSchema();

    expect(schema).toBeDefined();
    expect(schema.type).toBe('object');
    expect(schema.properties).toBeDefined();
  });

  it('should access component registry', () => {
    const engine = new RendervidEngine();
    expect(engine.components).toBeDefined();
    expect(engine.components.list()).toHaveLength(0);
  });
});
