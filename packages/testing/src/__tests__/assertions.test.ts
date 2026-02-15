import { describe, it, expect } from 'vitest';
import {
  expectValidTemplate,
  expectInvalidTemplate,
  expectValidInputs,
  expectInvalidInputs,
  expectLayerExists,
  expectSceneCount,
} from '../assertions/template';
import {
  expectAnimationProperty,
  expectKeyframeCount,
  expectValueAtFrame,
} from '../assertions/animation';
import {
  measureRenderTime,
  expectWithinBudget,
} from '../performance/benchmark';
import {
  createMockAudioData,
  createMockTemplate,
  createMockLayer,
} from '../mocks/media';
import type { Template, Animation, Layer } from '@rendervid/core';

// ─── Mock Utilities ─────────────────────────────────────────────────────────

describe('createMockTemplate', () => {
  it('creates a valid default template', () => {
    const template = createMockTemplate();
    expect(template.name).toBe('Mock Template');
    expect(template.output.width).toBe(1920);
    expect(template.output.height).toBe(1080);
    expect(template.composition.scenes).toHaveLength(1);
  });

  it('allows overriding fields', () => {
    const template = createMockTemplate({
      name: 'Custom Template',
      output: { type: 'image', width: 800, height: 600 },
    });
    expect(template.name).toBe('Custom Template');
    expect(template.output.width).toBe(800);
    expect(template.output.type).toBe('image');
  });
});

describe('createMockLayer', () => {
  it('creates a text layer', () => {
    const layer = createMockLayer('text');
    expect(layer.type).toBe('text');
    expect((layer as any).props.text).toBe('Mock Text');
  });

  it('creates an image layer', () => {
    const layer = createMockLayer('image');
    expect(layer.type).toBe('image');
    expect((layer as any).props.src).toContain('image.png');
  });

  it('creates a shape layer', () => {
    const layer = createMockLayer('shape');
    expect(layer.type).toBe('shape');
    expect((layer as any).props.shape).toBe('rectangle');
  });

  it('creates a group layer with empty children', () => {
    const layer = createMockLayer('group');
    expect(layer.type).toBe('group');
    expect((layer as any).children).toEqual([]);
  });

  it('creates a video layer', () => {
    const layer = createMockLayer('video');
    expect(layer.type).toBe('video');
    expect((layer as any).props.src).toContain('video.mp4');
  });

  it('creates an audio layer', () => {
    const layer = createMockLayer('audio');
    expect(layer.type).toBe('audio');
    expect((layer as any).props.src).toContain('audio.mp3');
  });

  it('creates a gif layer', () => {
    const layer = createMockLayer('gif');
    expect(layer.type).toBe('gif');
  });

  it('allows overriding fields', () => {
    const layer = createMockLayer('text', { id: 'my-text' });
    expect(layer.id).toBe('my-text');
  });
});

describe('createMockAudioData', () => {
  it('creates audio data with defaults', () => {
    const audio = createMockAudioData();
    expect(audio.sampleRate).toBe(44100);
    expect(audio.numberOfChannels).toBe(2);
    expect(audio.durationInSeconds).toBe(5);
    expect(audio.channelData).toHaveLength(2);
    expect(audio.length).toBe(5 * 44100);
  });

  it('creates audio data with custom options', () => {
    const audio = createMockAudioData({
      duration: 2,
      sampleRate: 22050,
      channels: 1,
    });
    expect(audio.sampleRate).toBe(22050);
    expect(audio.numberOfChannels).toBe(1);
    expect(audio.durationInSeconds).toBe(2);
    expect(audio.channelData).toHaveLength(1);
    expect(audio.length).toBe(2 * 22050);
  });
});

// ─── Template Assertions ────────────────────────────────────────────────────

describe('expectValidTemplate', () => {
  it('does not throw for a valid template', () => {
    const template = createMockTemplate();
    expect(() => expectValidTemplate(template)).not.toThrow();
  });

  it('throws for an invalid template', () => {
    expect(() => expectValidTemplate({})).toThrow('Expected template to be valid');
  });

  it('throws for a template missing required fields', () => {
    expect(() => expectValidTemplate({ name: 'test' })).toThrow();
  });
});

describe('expectInvalidTemplate', () => {
  it('does not throw for an invalid template', () => {
    expect(() => expectInvalidTemplate({})).not.toThrow();
  });

  it('throws for a valid template', () => {
    const template = createMockTemplate();
    expect(() => expectInvalidTemplate(template)).toThrow(
      'Expected template to be invalid'
    );
  });

  it('checks specific error codes', () => {
    expect(() => expectInvalidTemplate({}, ['MISSING_REQUIRED'])).not.toThrow();
  });

  it('throws when expected error code is not found', () => {
    expect(() =>
      expectInvalidTemplate({}, ['NONEXISTENT_CODE'])
    ).toThrow('Expected error code');
  });
});

describe('expectValidInputs', () => {
  it('does not throw for valid inputs', () => {
    const template = createMockTemplate({
      inputs: [
        { key: 'title', type: 'string', label: 'Title', required: true },
      ],
    });
    expect(() =>
      expectValidInputs(template, { title: 'Hello' })
    ).not.toThrow();
  });

  it('throws for missing required input', () => {
    const template = createMockTemplate({
      inputs: [
        { key: 'title', type: 'string', label: 'Title', required: true },
      ],
    });
    expect(() => expectValidInputs(template, {})).toThrow(
      'Expected inputs to be valid'
    );
  });
});

describe('expectInvalidInputs', () => {
  it('does not throw for invalid inputs', () => {
    const template = createMockTemplate({
      inputs: [
        { key: 'title', type: 'string', label: 'Title', required: true },
      ],
    });
    expect(() => expectInvalidInputs(template, {})).not.toThrow();
  });

  it('throws for valid inputs', () => {
    const template = createMockTemplate({
      inputs: [
        { key: 'title', type: 'string', label: 'Title', required: true },
      ],
    });
    expect(() =>
      expectInvalidInputs(template, { title: 'Hello' })
    ).toThrow('Expected inputs to be invalid');
  });

  it('checks specific error codes', () => {
    const template = createMockTemplate({
      inputs: [
        { key: 'title', type: 'string', label: 'Title', required: true },
      ],
    });
    expect(() =>
      expectInvalidInputs(template, {}, ['MISSING_REQUIRED_INPUT'])
    ).not.toThrow();
  });
});

describe('expectLayerExists', () => {
  it('does not throw when layer exists', () => {
    const layer = createMockLayer('text', { id: 'my-layer' });
    const template = createMockTemplate({
      composition: {
        scenes: [
          { id: 'scene-1', startFrame: 0, endFrame: 300, layers: [layer] },
        ],
      },
    });
    expect(() => expectLayerExists(template, 'my-layer')).not.toThrow();
  });

  it('throws when layer does not exist', () => {
    const template = createMockTemplate();
    expect(() => expectLayerExists(template, 'nonexistent')).toThrow(
      'Expected layer with id "nonexistent" to exist'
    );
  });

  it('finds layers in nested groups', () => {
    const childLayer = createMockLayer('text', { id: 'nested-layer' });
    const groupLayer = createMockLayer('group', {
      id: 'group-1',
    }) as any;
    groupLayer.children = [childLayer];

    const template = createMockTemplate({
      composition: {
        scenes: [
          { id: 'scene-1', startFrame: 0, endFrame: 300, layers: [groupLayer] },
        ],
      },
    });
    expect(() => expectLayerExists(template, 'nested-layer')).not.toThrow();
  });
});

describe('expectSceneCount', () => {
  it('does not throw for correct count', () => {
    const template = createMockTemplate();
    expect(() => expectSceneCount(template, 1)).not.toThrow();
  });

  it('throws for incorrect count', () => {
    const template = createMockTemplate();
    expect(() => expectSceneCount(template, 3)).toThrow(
      'Expected template to have 3 scene(s), but found 1'
    );
  });
});

// ─── Animation Assertions ───────────────────────────────────────────────────

describe('expectAnimationProperty', () => {
  it('does not throw when property exists in keyframes', () => {
    const layer = createMockLayer('text', {
      id: 'animated-text',
      animations: [
        {
          type: 'keyframe',
          duration: 30,
          keyframes: [
            { frame: 0, properties: { opacity: 0 } },
            { frame: 30, properties: { opacity: 1 } },
          ],
        },
      ],
    });
    expect(() => expectAnimationProperty(layer, 'opacity')).not.toThrow();
  });

  it('throws when layer has no animations', () => {
    const layer = createMockLayer('text', { id: 'static-text' });
    expect(() => expectAnimationProperty(layer, 'opacity')).toThrow(
      'Expected layer "static-text" to have animations'
    );
  });

  it('throws when property is not animated', () => {
    const layer = createMockLayer('text', {
      id: 'animated-text',
      animations: [
        {
          type: 'keyframe',
          duration: 30,
          keyframes: [
            { frame: 0, properties: { x: 0 } },
            { frame: 30, properties: { x: 100 } },
          ],
        },
      ],
    });
    expect(() => expectAnimationProperty(layer, 'opacity')).toThrow(
      'Expected layer "animated-text" to have an animation on property "opacity"'
    );
  });

  it('detects properties from preset animations', () => {
    const layer = createMockLayer('text', {
      id: 'fade-text',
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          duration: 30,
        },
      ],
    });
    expect(() => expectAnimationProperty(layer, 'opacity')).not.toThrow();
  });
});

describe('expectKeyframeCount', () => {
  it('does not throw for correct keyframe count', () => {
    const layer = createMockLayer('text', {
      id: 'animated-text',
      animations: [
        {
          type: 'keyframe',
          duration: 60,
          keyframes: [
            { frame: 0, properties: { opacity: 0 } },
            { frame: 30, properties: { opacity: 0.5 } },
            { frame: 60, properties: { opacity: 1 } },
          ],
        },
      ],
    });
    expect(() => expectKeyframeCount(layer, 'opacity', 3)).not.toThrow();
  });

  it('throws for incorrect keyframe count', () => {
    const layer = createMockLayer('text', {
      id: 'animated-text',
      animations: [
        {
          type: 'keyframe',
          duration: 30,
          keyframes: [
            { frame: 0, properties: { opacity: 0 } },
            { frame: 30, properties: { opacity: 1 } },
          ],
        },
      ],
    });
    expect(() => expectKeyframeCount(layer, 'opacity', 5)).toThrow(
      'Expected 5 keyframe(s) for property "opacity"'
    );
  });

  it('throws when layer has no animations', () => {
    const layer = createMockLayer('text', { id: 'static' });
    expect(() => expectKeyframeCount(layer, 'opacity', 2)).toThrow(
      'Expected layer "static" to have animations'
    );
  });
});

describe('expectValueAtFrame', () => {
  it('checks exact keyframe values', () => {
    const anim: Animation = {
      type: 'keyframe',
      duration: 60,
      keyframes: [
        { frame: 0, properties: { opacity: 0, x: 100 } },
        { frame: 30, properties: { opacity: 0.5 } },
        { frame: 60, properties: { opacity: 1 } },
      ],
    };
    expect(() =>
      expectValueAtFrame(anim, 0, { opacity: 0, x: 100 })
    ).not.toThrow();
    expect(() =>
      expectValueAtFrame(anim, 30, { opacity: 0.5 })
    ).not.toThrow();
  });

  it('throws for wrong value at keyframe', () => {
    const anim: Animation = {
      type: 'keyframe',
      duration: 30,
      keyframes: [
        { frame: 0, properties: { opacity: 0 } },
        { frame: 30, properties: { opacity: 1 } },
      ],
    };
    expect(() =>
      expectValueAtFrame(anim, 0, { opacity: 1 })
    ).toThrow('Expected property "opacity" to be 1 at frame 0, but got 0');
  });

  it('throws for frames between keyframes', () => {
    const anim: Animation = {
      type: 'keyframe',
      duration: 60,
      keyframes: [
        { frame: 0, properties: { opacity: 0 } },
        { frame: 60, properties: { opacity: 1 } },
      ],
    };
    expect(() =>
      expectValueAtFrame(anim, 15, { opacity: 0.25 })
    ).toThrow('falls between keyframes');
  });

  it('throws when animation has no keyframes', () => {
    const anim: Animation = {
      type: 'entrance',
      effect: 'fadeIn',
      duration: 30,
    };
    expect(() =>
      expectValueAtFrame(anim, 0, { opacity: 0 })
    ).toThrow('animation has no keyframes');
  });
});

// ─── Performance Utilities ──────────────────────────────────────────────────

describe('measureRenderTime', () => {
  it('measures execution time', async () => {
    const result = await measureRenderTime(
      async () => {
        // Simulate some work
        await new Promise((resolve) => setTimeout(resolve, 5));
      },
      { runs: 3, warmup: 0 }
    );

    expect(result.runs).toBe(3);
    expect(result.avg).toBeGreaterThan(0);
    expect(result.min).toBeGreaterThan(0);
    expect(result.max).toBeGreaterThanOrEqual(result.min);
    expect(result.avg).toBeGreaterThanOrEqual(result.min);
    expect(result.avg).toBeLessThanOrEqual(result.max);
  });
});

describe('expectWithinBudget', () => {
  it('does not throw when within budget', () => {
    expect(() => expectWithinBudget(50, 100)).not.toThrow();
  });

  it('does not throw at exact budget', () => {
    expect(() => expectWithinBudget(100, 100)).not.toThrow();
  });

  it('throws when over budget', () => {
    expect(() => expectWithinBudget(150, 100)).toThrow(
      'Performance budget exceeded'
    );
  });
});
