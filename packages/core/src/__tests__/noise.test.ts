import { describe, it, expect } from 'vitest';
import {
  noise2D,
  noise3D,
  perlin2D,
  perlin3D,
  worley2D,
  worley3D,
  valueNoise2D,
  valueNoise3D,
} from '../utils/noise';

describe('Simplex Noise', () => {
  describe('noise2D', () => {
    it('should be deterministic', () => {
      const a = noise2D(42, 1.5, 2.5);
      const b = noise2D(42, 1.5, 2.5);
      expect(a).toBe(b);
    });

    it('should return values in [-1, 1]', () => {
      for (let i = 0; i < 100; i++) {
        const val = noise2D(42, i * 0.37, i * 0.53);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });

    it('should produce different results for different seeds', () => {
      // Test across multiple coordinates to confirm seeds produce different output
      let diffCount = 0;
      for (let i = 0; i < 10; i++) {
        const a = noise2D(1, i * 1.7, i * 2.3);
        const b = noise2D(999, i * 1.7, i * 2.3);
        if (a !== b) diffCount++;
      }
      expect(diffCount).toBeGreaterThan(0);
    });

    it('should accept string seeds', () => {
      const a = noise2D('hello', 1.5, 2.5);
      const b = noise2D('hello', 1.5, 2.5);
      expect(a).toBe(b);
    });
  });

  describe('noise3D', () => {
    it('should be deterministic', () => {
      const a = noise3D(42, 1.5, 2.5, 3.5);
      const b = noise3D(42, 1.5, 2.5, 3.5);
      expect(a).toBe(b);
    });

    it('should return values in [-1, 1]', () => {
      for (let i = 0; i < 100; i++) {
        const val = noise3D(42, i * 0.37, i * 0.53, i * 0.71);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });
  });
});

describe('Perlin Noise', () => {
  describe('perlin2D', () => {
    it('should be deterministic', () => {
      const a = perlin2D(42, 1.5, 2.5);
      const b = perlin2D(42, 1.5, 2.5);
      expect(a).toBe(b);
    });

    it('should return values in [-1, 1]', () => {
      for (let i = 0; i < 100; i++) {
        const val = perlin2D(42, i * 0.37, i * 0.53);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });

    it('should produce different results for different seeds', () => {
      const a = perlin2D(1, 1.5, 2.5);
      const b = perlin2D(2, 1.5, 2.5);
      expect(a).not.toBe(b);
    });

    it('should return 0 at integer coordinates', () => {
      // Perlin noise is 0 at integer grid points (dot product of gradient with zero vector)
      const val = perlin2D(42, 3, 5);
      expect(val).toBeCloseTo(0, 10);
    });
  });

  describe('perlin3D', () => {
    it('should be deterministic', () => {
      const a = perlin3D(42, 1.5, 2.5, 3.5);
      const b = perlin3D(42, 1.5, 2.5, 3.5);
      expect(a).toBe(b);
    });

    it('should return values in [-1, 1]', () => {
      for (let i = 0; i < 100; i++) {
        const val = perlin3D(42, i * 0.37, i * 0.53, i * 0.71);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });
  });
});

describe('Worley Noise', () => {
  describe('worley2D', () => {
    it('should be deterministic', () => {
      const a = worley2D(42, 1.5, 2.5);
      const b = worley2D(42, 1.5, 2.5);
      expect(a).toBe(b);
    });

    it('should return values in [-1, 1]', () => {
      for (let i = 0; i < 100; i++) {
        const val = worley2D(42, i * 0.37, i * 0.53);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });

    it('should produce different results for different seeds', () => {
      const a = worley2D(1, 1.5, 2.5);
      const b = worley2D(2, 1.5, 2.5);
      expect(a).not.toBe(b);
    });
  });

  describe('worley3D', () => {
    it('should be deterministic', () => {
      const a = worley3D(42, 1.5, 2.5, 3.5);
      const b = worley3D(42, 1.5, 2.5, 3.5);
      expect(a).toBe(b);
    });

    it('should return values in [-1, 1]', () => {
      for (let i = 0; i < 100; i++) {
        const val = worley3D(42, i * 0.37, i * 0.53, i * 0.71);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });
  });
});

describe('Value Noise', () => {
  describe('valueNoise2D', () => {
    it('should be deterministic', () => {
      const a = valueNoise2D(42, 1.5, 2.5);
      const b = valueNoise2D(42, 1.5, 2.5);
      expect(a).toBe(b);
    });

    it('should return values in [-1, 1]', () => {
      for (let i = 0; i < 100; i++) {
        const val = valueNoise2D(42, i * 0.37, i * 0.53);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });

    it('should produce different results for different seeds', () => {
      const a = valueNoise2D(1, 1.5, 2.5);
      const b = valueNoise2D(2, 1.5, 2.5);
      expect(a).not.toBe(b);
    });
  });

  describe('valueNoise3D', () => {
    it('should be deterministic', () => {
      const a = valueNoise3D(42, 1.5, 2.5, 3.5);
      const b = valueNoise3D(42, 1.5, 2.5, 3.5);
      expect(a).toBe(b);
    });

    it('should return values in [-1, 1]', () => {
      for (let i = 0; i < 100; i++) {
        const val = valueNoise3D(42, i * 0.37, i * 0.53, i * 0.71);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });
  });
});
