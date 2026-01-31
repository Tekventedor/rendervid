import { describe, it, expect } from 'vitest';
import {
  getEasing,
  getAllEasingNames,
  interpolate,
  compileAnimation,
} from '../animation';
import { getAllPresetNames, getPresetsByType, generatePresetKeyframes } from '../animation/presets';

describe('Easing Functions', () => {
  it('should return all easing names', () => {
    const names = getAllEasingNames();
    expect(names).toContain('linear');
    expect(names).toContain('easeInOutQuad');
    expect(names).toContain('easeInOutCubic');
    expect(names.length).toBe(31); // All 31 easings
  });

  it('should get linear easing', () => {
    const linear = getEasing('linear');
    expect(linear).toBeDefined();
    expect(linear(0)).toBe(0);
    expect(linear(0.5)).toBe(0.5);
    expect(linear(1)).toBe(1);
  });

  it('should get easeInQuad easing', () => {
    const easeIn = getEasing('easeInQuad');
    expect(easeIn).toBeDefined();
    expect(easeIn(0)).toBe(0);
    expect(easeIn(1)).toBe(1);
    // easeIn should be slower at start
    expect(easeIn(0.5)).toBeLessThan(0.5);
  });

  it('should get easeOutQuad easing', () => {
    const easeOut = getEasing('easeOutQuad');
    expect(easeOut).toBeDefined();
    expect(easeOut(0)).toBe(0);
    expect(easeOut(1)).toBe(1);
    // easeOut should be faster at start
    expect(easeOut(0.5)).toBeGreaterThan(0.5);
  });

  it('should fallback to linear for unknown easing', () => {
    // getEasing returns linear for unknown names
    const unknown = getEasing('unknownEasing' as any);
    expect(unknown).toBeDefined();
    expect(unknown(0.5)).toBe(0.5); // linear behavior
  });
});

describe('Interpolation', () => {
  it('should interpolate numbers', () => {
    expect(interpolate(0, 100, 0, 'linear')).toBe(0);
    expect(interpolate(0, 100, 0.5, 'linear')).toBe(50);
    expect(interpolate(0, 100, 1, 'linear')).toBe(100);
  });

  it('should interpolate with different easings', () => {
    const easeIn = interpolate(0, 100, 0.5, 'easeInQuad');
    const easeOut = interpolate(0, 100, 0.5, 'easeOutQuad');
    const linear = interpolate(0, 100, 0.5, 'linear');

    // easeIn should be less than linear at 0.5
    expect(easeIn).toBeLessThan(linear);
    // easeOut should be greater than linear at 0.5
    expect(easeOut).toBeGreaterThan(linear);
  });

  it('should handle negative values', () => {
    expect(interpolate(-100, 100, 0.5, 'linear')).toBe(0);
  });
});

describe('Animation Presets', () => {
  it('should return all preset names', () => {
    const names = getAllPresetNames();
    expect(names).toContain('fadeIn');
    expect(names).toContain('fadeOut');
    expect(names).toContain('slideInLeft');
    expect(names.length).toBeGreaterThan(20);
  });

  it('should get entrance presets', () => {
    const entrance = getPresetsByType('entrance');
    expect(entrance.length).toBeGreaterThan(5);
    expect(entrance.every(p => p.type === 'entrance')).toBe(true);
    expect(entrance.map(p => p.name)).toContain('fadeIn');
  });

  it('should get exit presets', () => {
    const exit = getPresetsByType('exit');
    expect(exit.length).toBeGreaterThan(3);
    expect(exit.every(p => p.type === 'exit')).toBe(true);
    expect(exit.map(p => p.name)).toContain('fadeOut');
  });

  it('should get emphasis presets', () => {
    const emphasis = getPresetsByType('emphasis');
    expect(emphasis.length).toBeGreaterThan(3);
    expect(emphasis.every(p => p.type === 'emphasis')).toBe(true);
  });

  it('should generate keyframes from preset', () => {
    const keyframes = generatePresetKeyframes('fadeIn', { duration: 30 });
    expect(keyframes).toBeDefined();
    expect(keyframes.length).toBeGreaterThan(0);
    expect(keyframes[0].properties).toHaveProperty('opacity');
  });
});

describe('Animation Compilation', () => {
  it('should compile keyframe array', () => {
    const keyframes = [
      { frame: 0, properties: { opacity: 0 } },
      { frame: 30, properties: { opacity: 1 } },
    ];

    const compiled = compileAnimation(keyframes, 31);
    expect(compiled).toBeDefined();

    // At frame 0, opacity should be 0
    const props0 = compiled.getPropertiesAtFrame(0);
    expect(props0.opacity).toBe(0);

    // At frame 30, opacity should be 1
    const props30 = compiled.getPropertiesAtFrame(30);
    expect(props30.opacity).toBe(1);

    // At frame 15, opacity should be ~0.5
    const props15 = compiled.getPropertiesAtFrame(15);
    expect(props15.opacity).toBeCloseTo(0.5, 1);
  });

  it('should compile preset-generated keyframes', () => {
    const keyframes = generatePresetKeyframes('fadeIn', { duration: 30 });
    const compiled = compileAnimation(keyframes, 31);

    expect(compiled).toBeDefined();
    const props0 = compiled.getPropertiesAtFrame(0);
    expect(props0.opacity).toBe(0);

    const props30 = compiled.getPropertiesAtFrame(30);
    expect(props30.opacity).toBe(1);
  });

  it('should handle multiple properties', () => {
    const keyframes = [
      { frame: 0, properties: { opacity: 0, x: -100 } },
      { frame: 30, properties: { opacity: 1, x: 0 } },
    ];

    const compiled = compileAnimation(keyframes, 31);

    const props15 = compiled.getPropertiesAtFrame(15);
    expect(props15.opacity).toBeCloseTo(0.5, 1);
    expect(props15.x).toBeCloseTo(-50, 1);
  });

  it('should clamp to first frame when before start', () => {
    const keyframes = [
      { frame: 0, properties: { opacity: 0 } },
      { frame: 30, properties: { opacity: 1 } },
    ];

    const compiled = compileAnimation(keyframes, 31);
    const propsBefore = compiled.getPropertiesAtFrame(-10);
    expect(propsBefore.opacity).toBe(0);
  });

  it('should clamp to last frame when after end', () => {
    const keyframes = [
      { frame: 0, properties: { opacity: 0 } },
      { frame: 30, properties: { opacity: 1 } },
    ];

    const compiled = compileAnimation(keyframes, 31);
    const propsAfter = compiled.getPropertiesAtFrame(100);
    expect(propsAfter.opacity).toBe(1);
  });
});
