import { describe, it, expect } from 'vitest';
import {
  getPreset,
  getAllPresetNames,
  getPresetsByType,
  generatePresetKeyframes,
  presets,
} from '../animation/presets';

describe('Preset Registry', () => {
  it('should contain all expected entrance presets', () => {
    const entranceNames = [
      'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight',
      'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
      'scaleIn', 'zoomIn', 'rotateIn', 'bounceIn',
      'flipInX', 'flipInY', 'rollIn', 'lightSpeedIn', 'swingIn',
      'backIn', 'elasticIn',
      'slideInFromTopLeft', 'slideInFromTopRight',
      'slideInFromBottomLeft', 'slideInFromBottomRight',
    ];

    for (const name of entranceNames) {
      expect(presets[name]).toBeDefined();
      expect(presets[name].type).toBe('entrance');
    }
  });

  it('should contain all expected exit presets', () => {
    const exitNames = [
      'fadeOut', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight',
      'scaleOut', 'zoomOut',
      'flipOutX', 'flipOutY', 'rollOut', 'lightSpeedOut',
      'swingOut', 'backOut', 'elasticOut',
    ];

    for (const name of exitNames) {
      expect(presets[name]).toBeDefined();
      expect(presets[name].type).toBe('exit');
    }
  });

  it('should contain all expected emphasis presets', () => {
    const emphasisNames = [
      'pulse', 'shake', 'bounce', 'spin', 'heartbeat', 'float',
      'wobble', 'flash', 'jello', 'rubberBand', 'tada', 'swing',
    ];

    for (const name of emphasisNames) {
      expect(presets[name]).toBeDefined();
      expect(presets[name].type).toBe('emphasis');
    }
  });
});

describe('getPreset', () => {
  it('should return a preset by name', () => {
    const preset = getPreset('fadeIn');
    expect(preset).toBeDefined();
    expect(preset!.name).toBe('fadeIn');
    expect(preset!.type).toBe('entrance');
  });

  it('should return undefined for unknown preset', () => {
    expect(getPreset('nonExistent')).toBeUndefined();
  });
});

describe('getAllPresetNames', () => {
  it('should return all preset names as strings', () => {
    const names = getAllPresetNames();
    expect(names.length).toBe(Object.keys(presets).length);
    expect(names.every(n => typeof n === 'string')).toBe(true);
  });
});

describe('getPresetsByType', () => {
  it('should filter entrance presets', () => {
    const entrance = getPresetsByType('entrance');
    expect(entrance.length).toBeGreaterThanOrEqual(24);
    expect(entrance.every(p => p.type === 'entrance')).toBe(true);
  });

  it('should filter exit presets', () => {
    const exit = getPresetsByType('exit');
    expect(exit.length).toBeGreaterThanOrEqual(14);
    expect(exit.every(p => p.type === 'exit')).toBe(true);
  });

  it('should filter emphasis presets', () => {
    const emphasis = getPresetsByType('emphasis');
    expect(emphasis.length).toBeGreaterThanOrEqual(12);
    expect(emphasis.every(p => p.type === 'emphasis')).toBe(true);
  });
});

describe('generatePresetKeyframes', () => {
  it('should return empty array for unknown preset', () => {
    const keyframes = generatePresetKeyframes('nonExistent', { duration: 30 });
    expect(keyframes).toEqual([]);
  });
});

describe('Entrance Preset Keyframe Generation', () => {
  it('fadeIn: opacity 0 -> 1', () => {
    const keyframes = generatePresetKeyframes('fadeIn', { duration: 30 });
    expect(keyframes).toHaveLength(2);
    expect(keyframes[0].properties.opacity).toBe(0);
    expect(keyframes[1].properties.opacity).toBe(1);
    expect(keyframes[0].frame).toBe(0);
    expect(keyframes[1].frame).toBe(30);
  });

  it('fadeInUp: opacity 0 -> 1, y 50 -> 0', () => {
    const keyframes = generatePresetKeyframes('fadeInUp', { duration: 20 });
    expect(keyframes[0].properties).toEqual({ opacity: 0, y: 50 });
    expect(keyframes[1].properties).toEqual({ opacity: 1, y: 0 });
    expect(keyframes[1].frame).toBe(20);
  });

  it('fadeInDown: y -50 -> 0', () => {
    const keyframes = generatePresetKeyframes('fadeInDown', { duration: 30 });
    expect(keyframes[0].properties.y).toBe(-50);
    expect(keyframes[1].properties.y).toBe(0);
  });

  it('fadeInLeft: x -50 -> 0', () => {
    const keyframes = generatePresetKeyframes('fadeInLeft', { duration: 30 });
    expect(keyframes[0].properties.x).toBe(-50);
    expect(keyframes[1].properties.x).toBe(0);
  });

  it('fadeInRight: x 50 -> 0', () => {
    const keyframes = generatePresetKeyframes('fadeInRight', { duration: 30 });
    expect(keyframes[0].properties.x).toBe(50);
    expect(keyframes[1].properties.x).toBe(0);
  });

  it('slideInUp: uses canvas height for offset', () => {
    const keyframes = generatePresetKeyframes('slideInUp', {
      duration: 30,
      canvasSize: { width: 1920, height: 1080 },
    });
    expect(keyframes[0].properties.y).toBe(1080);
    expect(keyframes[1].properties.y).toBe(0);
  });

  it('slideInUp: defaults to 500 without canvas size', () => {
    const keyframes = generatePresetKeyframes('slideInUp', { duration: 30 });
    expect(keyframes[0].properties.y).toBe(500);
  });

  it('slideInDown: negative offset from canvas height', () => {
    const keyframes = generatePresetKeyframes('slideInDown', {
      duration: 30,
      canvasSize: { width: 1920, height: 1080 },
    });
    expect(keyframes[0].properties.y).toBe(-1080);
  });

  it('slideInLeft: negative offset from canvas width', () => {
    const keyframes = generatePresetKeyframes('slideInLeft', {
      duration: 30,
      canvasSize: { width: 1920, height: 1080 },
    });
    expect(keyframes[0].properties.x).toBe(-1920);
  });

  it('slideInRight: positive offset from canvas width', () => {
    const keyframes = generatePresetKeyframes('slideInRight', {
      duration: 30,
      canvasSize: { width: 1920, height: 1080 },
    });
    expect(keyframes[0].properties.x).toBe(1920);
  });

  it('scaleIn: scale 0 -> 1 with opacity', () => {
    const keyframes = generatePresetKeyframes('scaleIn', { duration: 30 });
    expect(keyframes[0].properties.scaleX).toBe(0);
    expect(keyframes[0].properties.scaleY).toBe(0);
    expect(keyframes[1].properties.scaleX).toBe(1);
    expect(keyframes[1].properties.scaleY).toBe(1);
  });

  it('zoomIn: scale 0.3 -> 1', () => {
    const keyframes = generatePresetKeyframes('zoomIn', { duration: 30 });
    expect(keyframes[0].properties.scaleX).toBe(0.3);
    expect(keyframes[1].properties.scaleX).toBe(1);
  });

  it('rotateIn: rotation -180 -> 0', () => {
    const keyframes = generatePresetKeyframes('rotateIn', { duration: 30 });
    expect(keyframes[0].properties.rotation).toBe(-180);
    expect(keyframes[1].properties.rotation).toBe(0);
  });

  it('bounceIn: uses easeOutBounce by default', () => {
    const keyframes = generatePresetKeyframes('bounceIn', { duration: 45 });
    expect(keyframes[0].easing).toBe('easeOutBounce');
  });

  it('slideInFromTopLeft: negative x and y from canvas', () => {
    const keyframes = generatePresetKeyframes('slideInFromTopLeft', {
      duration: 30,
      canvasSize: { width: 1920, height: 1080 },
    });
    expect(keyframes[0].properties.x).toBe(-1920);
    expect(keyframes[0].properties.y).toBe(-1080);
  });

  it('slideInFromBottomRight: positive x and y from canvas', () => {
    const keyframes = generatePresetKeyframes('slideInFromBottomRight', {
      duration: 30,
      canvasSize: { width: 1920, height: 1080 },
    });
    expect(keyframes[0].properties.x).toBe(1920);
    expect(keyframes[0].properties.y).toBe(1080);
  });

  it('lightSpeedIn: enters from right with scale distortion', () => {
    const keyframes = generatePresetKeyframes('lightSpeedIn', {
      duration: 25,
      canvasSize: { width: 1920, height: 1080 },
    });
    expect(keyframes[0].properties.x).toBe(1920);
    expect(keyframes[0].properties.scaleX).toBe(1.5);
    expect(keyframes[1].properties.x).toBe(0);
    expect(keyframes[1].properties.scaleX).toBe(1);
  });

  it('rollIn: enters from left with rotation', () => {
    const keyframes = generatePresetKeyframes('rollIn', {
      duration: 35,
      canvasSize: { width: 800, height: 600 },
    });
    expect(keyframes[0].properties.x).toBe(-800);
    expect(keyframes[0].properties.rotation).toBe(-120);
    expect(keyframes[1].properties.x).toBe(0);
    expect(keyframes[1].properties.rotation).toBe(0);
  });
});

describe('Exit Preset Keyframe Generation', () => {
  it('fadeOut: opacity 1 -> 0', () => {
    const keyframes = generatePresetKeyframes('fadeOut', { duration: 30 });
    expect(keyframes[0].properties.opacity).toBe(1);
    expect(keyframes[1].properties.opacity).toBe(0);
  });

  it('fadeOutUp: y 0 -> -50', () => {
    const keyframes = generatePresetKeyframes('fadeOutUp', { duration: 30 });
    expect(keyframes[0].properties.y).toBe(0);
    expect(keyframes[1].properties.y).toBe(-50);
  });

  it('fadeOutDown: y 0 -> 50', () => {
    const keyframes = generatePresetKeyframes('fadeOutDown', { duration: 30 });
    expect(keyframes[1].properties.y).toBe(50);
  });

  it('fadeOutLeft: x 0 -> -50', () => {
    const keyframes = generatePresetKeyframes('fadeOutLeft', { duration: 30 });
    expect(keyframes[1].properties.x).toBe(-50);
  });

  it('fadeOutRight: x 0 -> 50', () => {
    const keyframes = generatePresetKeyframes('fadeOutRight', { duration: 30 });
    expect(keyframes[1].properties.x).toBe(50);
  });

  it('scaleOut: scale 1 -> 0', () => {
    const keyframes = generatePresetKeyframes('scaleOut', { duration: 30 });
    expect(keyframes[0].properties.scaleX).toBe(1);
    expect(keyframes[1].properties.scaleX).toBe(0);
  });

  it('zoomOut: scale 1 -> 0.3', () => {
    const keyframes = generatePresetKeyframes('zoomOut', { duration: 30 });
    expect(keyframes[1].properties.scaleX).toBe(0.3);
  });

  it('rollOut: exits to right with rotation', () => {
    const keyframes = generatePresetKeyframes('rollOut', {
      duration: 35,
      canvasSize: { width: 800, height: 600 },
    });
    expect(keyframes[1].properties.x).toBe(800);
    expect(keyframes[1].properties.rotation).toBe(120);
  });

  it('lightSpeedOut: exits to right with scale distortion', () => {
    const keyframes = generatePresetKeyframes('lightSpeedOut', {
      duration: 25,
      canvasSize: { width: 1920, height: 1080 },
    });
    expect(keyframes[1].properties.x).toBe(1920);
    expect(keyframes[1].properties.scaleX).toBe(0.7);
  });
});

describe('Emphasis Preset Keyframe Generation', () => {
  it('pulse: scales up and back to 1', () => {
    const keyframes = generatePresetKeyframes('pulse', { duration: 30 });
    expect(keyframes).toHaveLength(3);
    expect(keyframes[0].properties.scaleX).toBe(1);
    expect(keyframes[1].properties.scaleX).toBe(1.1);
    expect(keyframes[2].properties.scaleX).toBe(1);
  });

  it('shake: oscillates x position', () => {
    const keyframes = generatePresetKeyframes('shake', { duration: 30 });
    expect(keyframes).toHaveLength(11);
    expect(keyframes[0].properties.x).toBe(0);
    expect(keyframes[keyframes.length - 1].properties.x).toBe(0);
    // Should have alternating positive and negative x values
    expect(keyframes[1].properties.x).toBe(-10);
    expect(keyframes[2].properties.x).toBe(10);
  });

  it('spin: rotation 0 -> 360', () => {
    const keyframes = generatePresetKeyframes('spin', { duration: 30 });
    expect(keyframes[0].properties.rotation).toBe(0);
    expect(keyframes[1].properties.rotation).toBe(360);
  });

  it('heartbeat: has multiple scale peaks', () => {
    const keyframes = generatePresetKeyframes('heartbeat', { duration: 30 });
    expect(keyframes.length).toBeGreaterThanOrEqual(5);
    expect(keyframes[0].properties.scaleX).toBe(1);
    expect(keyframes[1].properties.scaleX).toBe(1.3); // first beat
    expect(keyframes[2].properties.scaleX).toBe(1);
    expect(keyframes[3].properties.scaleX).toBe(1.3); // second beat
  });

  it('float: subtle y movement', () => {
    const keyframes = generatePresetKeyframes('float', { duration: 60 });
    expect(keyframes).toHaveLength(3);
    expect(keyframes[0].properties.y).toBe(0);
    expect(keyframes[1].properties.y).toBe(-10);
    expect(keyframes[2].properties.y).toBe(0);
  });

  it('bounce: y movement with bounce easing', () => {
    const keyframes = generatePresetKeyframes('bounce', { duration: 30 });
    expect(keyframes[0].properties.y).toBe(0);
    expect(keyframes[1].properties.y).toBe(-30);
    expect(keyframes[2].properties.y).toBe(0);
  });

  it('wobble: alternating x and rotation', () => {
    const keyframes = generatePresetKeyframes('wobble', { duration: 40 });
    expect(keyframes.length).toBeGreaterThanOrEqual(8);
    expect(keyframes[0].properties.x).toBe(0);
    expect(keyframes[0].properties.rotation).toBe(0);
    expect(keyframes[keyframes.length - 1].properties.x).toBe(0);
    expect(keyframes[keyframes.length - 1].properties.rotation).toBe(0);
  });

  it('flash: opacity flickers', () => {
    const keyframes = generatePresetKeyframes('flash', { duration: 20 });
    expect(keyframes).toHaveLength(5);
    expect(keyframes[0].properties.opacity).toBe(1);
    expect(keyframes[1].properties.opacity).toBe(0);
    expect(keyframes[2].properties.opacity).toBe(1);
    expect(keyframes[3].properties.opacity).toBe(0);
    expect(keyframes[4].properties.opacity).toBe(1);
  });

  it('jello: alternating scaleX/scaleY distortion', () => {
    const keyframes = generatePresetKeyframes('jello', { duration: 40 });
    expect(keyframes.length).toBeGreaterThanOrEqual(7);
    // Starts and ends at scale 1
    expect(keyframes[0].properties.scaleX).toBe(1);
    expect(keyframes[keyframes.length - 1].properties.scaleX).toBe(1);
  });

  it('rubberBand: extreme scaleX/scaleY distortion', () => {
    const keyframes = generatePresetKeyframes('rubberBand', { duration: 40 });
    expect(keyframes[1].properties.scaleX).toBe(1.25);
    expect(keyframes[1].properties.scaleY).toBe(0.75);
    expect(keyframes[keyframes.length - 1].properties.scaleX).toBe(1);
  });

  it('tada: scale + rotation combo', () => {
    const keyframes = generatePresetKeyframes('tada', { duration: 40 });
    expect(keyframes.length).toBeGreaterThanOrEqual(10);
    expect(keyframes[0].properties.rotation).toBe(0);
    expect(keyframes[keyframes.length - 1].properties.rotation).toBe(0);
    // Mid-animation should have alternating rotation
    expect(keyframes[3].properties.rotation).toBe(3);
    expect(keyframes[4].properties.rotation).toBe(-3);
  });

  it('swing: rotation pendulum effect', () => {
    const keyframes = generatePresetKeyframes('swing', { duration: 40 });
    expect(keyframes).toHaveLength(5);
    expect(keyframes[0].properties.rotation).toBe(0);
    expect(keyframes[1].properties.rotation).toBe(15);
    expect(keyframes[2].properties.rotation).toBe(-10);
    expect(keyframes[3].properties.rotation).toBe(5);
    expect(keyframes[4].properties.rotation).toBe(0);
  });
});

describe('Preset Defaults', () => {
  it('each preset should have a name, type, defaultDuration, and defaultEasing', () => {
    for (const [key, preset] of Object.entries(presets)) {
      expect(preset.name).toBe(key);
      expect(['entrance', 'exit', 'emphasis']).toContain(preset.type);
      expect(preset.defaultDuration).toBeGreaterThan(0);
      expect(typeof preset.defaultEasing).toBe('string');
      expect(typeof preset.generate).toBe('function');
    }
  });

  it('entrance presets should use easeOut-family by default', () => {
    const entrance = getPresetsByType('entrance');
    for (const preset of entrance) {
      expect(preset.defaultEasing).toMatch(/easeOut/);
    }
  });

  it('exit presets should use easeIn-family by default', () => {
    const exit = getPresetsByType('exit');
    for (const preset of exit) {
      expect(preset.defaultEasing).toMatch(/easeIn/);
    }
  });

  it('custom easing should override defaults', () => {
    const keyframes = generatePresetKeyframes('fadeIn', {
      duration: 30,
      easing: 'linear',
    });
    expect(keyframes[0].easing).toBe('linear');
  });
});
