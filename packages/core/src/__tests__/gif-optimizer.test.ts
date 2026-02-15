import { describe, it, expect } from 'vitest';
import {
  estimateGifFileSize,
  calculateOptimalColors,
  getGifOptimizationPreset,
} from '../utils/gif-optimizer';

describe('GIF Optimizer', () => {
  describe('estimateGifFileSize', () => {
    it('should return 0 for invalid inputs', () => {
      expect(estimateGifFileSize(0, 100, 10)).toBe(0);
      expect(estimateGifFileSize(100, 0, 10)).toBe(0);
      expect(estimateGifFileSize(100, 100, 0)).toBe(0);
      expect(estimateGifFileSize(100, 100, 10, 0)).toBe(0);
      expect(estimateGifFileSize(-1, 100, 10)).toBe(0);
    });

    it('should return a positive estimate for valid inputs', () => {
      const size = estimateGifFileSize(320, 240, 30, 256);
      expect(size).toBeGreaterThan(0);
    });

    it('should increase with more frames', () => {
      const size10 = estimateGifFileSize(320, 240, 10, 256);
      const size100 = estimateGifFileSize(320, 240, 100, 256);
      expect(size100).toBeGreaterThan(size10);
    });

    it('should increase with larger dimensions', () => {
      const sizeSmall = estimateGifFileSize(160, 120, 30, 256);
      const sizeLarge = estimateGifFileSize(640, 480, 30, 256);
      expect(sizeLarge).toBeGreaterThan(sizeSmall);
    });

    it('should increase with more colors', () => {
      const sizeFew = estimateGifFileSize(320, 240, 30, 16);
      const sizeMany = estimateGifFileSize(320, 240, 30, 256);
      expect(sizeMany).toBeGreaterThan(sizeFew);
    });

    it('should clamp colors to valid range', () => {
      const size256 = estimateGifFileSize(320, 240, 30, 256);
      const size512 = estimateGifFileSize(320, 240, 30, 512);
      // 512 gets clamped to 256
      expect(size512).toBe(size256);
    });

    it('should default to 256 colors', () => {
      const sizeDefault = estimateGifFileSize(320, 240, 30);
      const size256 = estimateGifFileSize(320, 240, 30, 256);
      expect(sizeDefault).toBe(size256);
    });
  });

  describe('calculateOptimalColors', () => {
    it('should return 2 for invalid inputs', () => {
      expect(calculateOptimalColors(0, 320, 240, 30)).toBe(2);
      expect(calculateOptimalColors(1000, 0, 240, 30)).toBe(2);
      expect(calculateOptimalColors(1000, 320, 0, 30)).toBe(2);
      expect(calculateOptimalColors(1000, 320, 240, 0)).toBe(2);
    });

    it('should return a value between 2 and 256', () => {
      const colors = calculateOptimalColors(1024 * 1024, 320, 240, 30);
      expect(colors).toBeGreaterThanOrEqual(2);
      expect(colors).toBeLessThanOrEqual(256);
    });

    it('should return 256 for very large target sizes', () => {
      // 100MB target for a small GIF should allow max colors
      const colors = calculateOptimalColors(100 * 1024 * 1024, 100, 100, 10);
      expect(colors).toBe(256);
    });

    it('should return fewer colors for smaller target sizes', () => {
      const colorsLarge = calculateOptimalColors(10 * 1024 * 1024, 640, 480, 100);
      const colorsSmall = calculateOptimalColors(100 * 1024, 640, 480, 100);
      expect(colorsSmall).toBeLessThanOrEqual(colorsLarge);
    });

    it('should produce estimates under the target size', () => {
      const targetSize = 500 * 1024; // 500KB
      const colors = calculateOptimalColors(targetSize, 320, 240, 30);
      const estimated = estimateGifFileSize(320, 240, 30, colors);
      expect(estimated).toBeLessThanOrEqual(targetSize);
    });
  });

  describe('getGifOptimizationPreset', () => {
    it('should return a valid preset for social', () => {
      const preset = getGifOptimizationPreset('social');
      expect(preset.maxWidth).toBe(480);
      expect(preset.maxHeight).toBe(480);
      expect(preset.fps).toBe(15);
      expect(preset.colors).toBe(128);
      expect(preset.dither).toBe('floyd_steinberg');
      expect(preset.maxFileSize).toBe(8 * 1024 * 1024);
      expect(preset.loop).toBe(0);
    });

    it('should return a valid preset for web', () => {
      const preset = getGifOptimizationPreset('web');
      expect(preset.maxWidth).toBe(640);
      expect(preset.maxHeight).toBe(480);
      expect(preset.fps).toBe(20);
      expect(preset.colors).toBe(256);
      expect(preset.maxFileSize).toBe(5 * 1024 * 1024);
    });

    it('should return a valid preset for email', () => {
      const preset = getGifOptimizationPreset('email');
      expect(preset.maxWidth).toBe(320);
      expect(preset.maxHeight).toBe(240);
      expect(preset.fps).toBe(10);
      expect(preset.colors).toBe(64);
      expect(preset.dither).toBe('bayer');
      expect(preset.maxFileSize).toBe(1 * 1024 * 1024);
    });

    it('should return smaller sizes for email than web', () => {
      const email = getGifOptimizationPreset('email');
      const web = getGifOptimizationPreset('web');
      expect(email.maxFileSize).toBeLessThan(web.maxFileSize);
      expect(email.maxWidth).toBeLessThan(web.maxWidth);
      expect(email.colors).toBeLessThan(web.colors);
    });
  });
});
