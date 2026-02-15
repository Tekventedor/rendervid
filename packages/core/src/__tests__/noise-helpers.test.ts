import { describe, it, expect } from 'vitest';
import { noise2D, perlin2D } from '../utils/noise';
import { fbm, turbulence, ridgedNoise, domainWarp, animatedNoise } from '../utils/noise-helpers';

describe('fbm', () => {
  it('should be deterministic', () => {
    const a = fbm(noise2D, 42, 1.5, 2.5);
    const b = fbm(noise2D, 42, 1.5, 2.5);
    expect(a).toBe(b);
  });

  it('should return values in [-1, 1]', () => {
    for (let i = 0; i < 50; i++) {
      const val = fbm(noise2D, 42, i * 0.37, i * 0.53);
      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  it('should accept custom options', () => {
    const a = fbm(noise2D, 42, 1.5, 2.5, { octaves: 2, lacunarity: 3, persistence: 0.3 });
    const b = fbm(noise2D, 42, 1.5, 2.5, { octaves: 6 });
    expect(a).not.toBe(b);
  });

  it('should work with different noise functions', () => {
    const a = fbm(noise2D, 42, 1.5, 2.5);
    const b = fbm(perlin2D, 42, 1.5, 2.5);
    expect(a).not.toBe(b);
  });
});

describe('turbulence', () => {
  it('should be deterministic', () => {
    const a = turbulence(noise2D, 42, 1.5, 2.5);
    const b = turbulence(noise2D, 42, 1.5, 2.5);
    expect(a).toBe(b);
  });

  it('should return values in [-1, 1]', () => {
    for (let i = 0; i < 50; i++) {
      const val = turbulence(noise2D, 42, i * 0.37, i * 0.53);
      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);
    }
  });
});

describe('ridgedNoise', () => {
  it('should be deterministic', () => {
    const a = ridgedNoise(noise2D, 42, 1.5, 2.5);
    const b = ridgedNoise(noise2D, 42, 1.5, 2.5);
    expect(a).toBe(b);
  });

  it('should return values in [-1, 1]', () => {
    for (let i = 0; i < 50; i++) {
      const val = ridgedNoise(noise2D, 42, i * 0.37, i * 0.53);
      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);
    }
  });
});

describe('domainWarp', () => {
  it('should be deterministic', () => {
    const a = domainWarp(noise2D, 42, 1.5, 2.5);
    const b = domainWarp(noise2D, 42, 1.5, 2.5);
    expect(a).toBe(b);
  });

  it('should return values in [-1, 1]', () => {
    for (let i = 0; i < 50; i++) {
      const val = domainWarp(noise2D, 42, i * 0.37, i * 0.53);
      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  it('should produce different results with different warp amounts', () => {
    const a = domainWarp(noise2D, 42, 1.5, 2.5, 0.5);
    const b = domainWarp(noise2D, 42, 1.5, 2.5, 5.0);
    expect(a).not.toBe(b);
  });
});

describe('animatedNoise', () => {
  it('should be deterministic for the same time', () => {
    const a = animatedNoise(noise2D, 42, 1.5, 2.5, 0.5);
    const b = animatedNoise(noise2D, 42, 1.5, 2.5, 0.5);
    expect(a).toBe(b);
  });

  it('should produce different values at different times', () => {
    const a = animatedNoise(noise2D, 42, 1.5, 2.5, 0.0);
    const b = animatedNoise(noise2D, 42, 1.5, 2.5, 1.0);
    expect(a).not.toBe(b);
  });

  it('should return values in [-1, 1]', () => {
    for (let i = 0; i < 50; i++) {
      const val = animatedNoise(noise2D, 42, i * 0.37, i * 0.53, i * 0.1);
      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);
    }
  });
});
