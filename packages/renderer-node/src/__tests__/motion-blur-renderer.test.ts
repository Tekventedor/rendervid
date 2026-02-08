/**
 * Motion Blur Frame Renderer Tests
 *
 * Tests for MotionBlurFrameRenderer including temporal sampling,
 * adaptive rendering, parallel rendering, and configuration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MotionBlurFrameRenderer } from '../motion-blur-renderer';
import type { ResolvedMotionBlurConfig } from '@rendervid/core';

function createConfig(overrides: Partial<ResolvedMotionBlurConfig> = {}): ResolvedMotionBlurConfig {
  return {
    enabled: true,
    samples: 4,
    shutterAngle: 180,
    quality: 'medium',
    adaptive: false,
    minSamples: 3,
    motionThreshold: 0.01,
    blurAmount: 1,
    stochastic: false,
    variableSampleRate: false,
    preview: false,
    ...overrides,
  };
}

function createMockCapturer(returnBuffer?: Buffer): any {
  const buf = returnBuffer || Buffer.from('frame-data');
  return {
    captureFrame: vi.fn().mockResolvedValue(buf),
  };
}

describe('MotionBlurFrameRenderer', () => {
  const width = 1920;
  const height = 1080;

  describe('constructor', () => {
    it('should create a renderer with valid config', () => {
      const config = createConfig();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });
      expect(renderer).toBeInstanceOf(MotionBlurFrameRenderer);
    });

    it('should store the configuration', () => {
      const config = createConfig({ samples: 8 });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });
      const returned = renderer.getConfig();
      expect(returned.motionBlur.samples).toBe(8);
      expect(returned.width).toBe(width);
      expect(returned.height).toBe(height);
    });
  });

  describe('calculateSampleOffsets (via private access)', () => {
    it('should calculate correct offsets for 180 shutter angle', () => {
      const config = createConfig({ samples: 4, shutterAngle: 180 });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const offsets = (renderer as any).calculateSampleOffsets(10);
      expect(offsets).toHaveLength(4);
      // shutterFraction = 180/360 = 0.5, blurAmount = 1 => 0.5
      // shutterStart = -0.5 * 0.5 = -0.25
      // shutterEnd = -0.25 + 0.5 = 0.25
      expect(offsets[0]).toBeCloseTo(9.75, 2);
      expect(offsets[3]).toBeCloseTo(10.25, 2);
    });

    it('should calculate correct offsets for 360 shutter angle', () => {
      const config = createConfig({ samples: 2, shutterAngle: 360, minSamples: 2 });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const offsets = (renderer as any).calculateSampleOffsets(10);
      expect(offsets).toHaveLength(2);
      expect(offsets[0]).toBeCloseTo(9.5, 2);
      expect(offsets[1]).toBeCloseTo(10.5, 2);
    });

    it('should calculate correct offsets for 90 shutter angle', () => {
      const config = createConfig({ samples: 3, shutterAngle: 90, minSamples: 2 });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const offsets = (renderer as any).calculateSampleOffsets(10);
      expect(offsets).toHaveLength(3);
      // shutterFraction = 90/360 = 0.25
      // shutterStart = -0.5 * 0.25 = -0.125
      // shutterEnd = -0.125 + 0.25 = 0.125
      expect(offsets[0]).toBeCloseTo(9.875, 2);
      expect(offsets[2]).toBeCloseTo(10.125, 2);
    });

    it('should apply blurAmount multiplier', () => {
      const config = createConfig({ samples: 2, shutterAngle: 180, blurAmount: 2, minSamples: 2 });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const offsets = (renderer as any).calculateSampleOffsets(10);
      expect(offsets).toHaveLength(2);
      // shutterFraction = 0.5 * 2 (blurAmount) = 1.0
      // shutterStart = -0.5 * 1.0 = -0.5
      // shutterEnd = -0.5 + 1.0 = 0.5
      expect(offsets[0]).toBeCloseTo(9.5, 2);
      expect(offsets[1]).toBeCloseTo(10.5, 2);
    });

    it('should produce sorted offsets without stochastic mode', () => {
      const config = createConfig({ samples: 6, shutterAngle: 180, stochastic: false });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const offsets = (renderer as any).calculateSampleOffsets(50);
      expect(offsets).toHaveLength(6);
      for (let i = 1; i < offsets.length; i++) {
        expect(offsets[i]).toBeGreaterThanOrEqual(offsets[i - 1]);
      }
    });

    it('should produce sorted offsets with stochastic mode', () => {
      const config = createConfig({ samples: 8, shutterAngle: 180, stochastic: true });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const offsets = (renderer as any).calculateSampleOffsets(50);
      expect(offsets).toHaveLength(8);
      // Stochastic mode sorts the offsets
      for (let i = 1; i < offsets.length; i++) {
        expect(offsets[i]).toBeGreaterThanOrEqual(offsets[i - 1]);
      }
    });

    it('should keep stochastic offsets within the shutter window', () => {
      const config = createConfig({ samples: 10, shutterAngle: 180, stochastic: true });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      // Run multiple times since stochastic is random
      for (let run = 0; run < 10; run++) {
        const offsets = (renderer as any).calculateSampleOffsets(20);
        // shutterFraction = 0.5, range: [19.75, 20.25]
        for (const offset of offsets) {
          expect(offset).toBeGreaterThanOrEqual(19.75);
          expect(offset).toBeLessThanOrEqual(20.25);
        }
      }
    });

    it('should handle frame 0 correctly', () => {
      const config = createConfig({ samples: 3, shutterAngle: 180 });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const offsets = (renderer as any).calculateSampleOffsets(0);
      expect(offsets).toHaveLength(3);
      expect(offsets[0]).toBeCloseTo(-0.25, 2);
      expect(offsets[2]).toBeCloseTo(0.25, 2);
    });
  });

  describe('renderBlurredFrame', () => {
    it('should capture the correct number of samples', async () => {
      const config = createConfig({ samples: 5 });
      const capturer = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      try {
        await renderer.renderBlurredFrame(10, capturer);
      } catch {
        // Expected to fail at sharp compositing with mock data
      }

      expect(capturer.captureFrame).toHaveBeenCalledTimes(5);
    });

    it('should call capturer with fractional frame times', async () => {
      const config = createConfig({ samples: 2, shutterAngle: 180, minSamples: 2 });
      const capturer = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      try {
        await renderer.renderBlurredFrame(10, capturer);
      } catch {
        // Expected to fail at compositing
      }

      // Should have been called with fractional times around frame 10
      const calls = capturer.captureFrame.mock.calls;
      expect(calls).toHaveLength(2);
      expect(calls[0][0]).toBeCloseTo(9.75, 2);
      expect(calls[1][0]).toBeCloseTo(10.25, 2);
    });
  });

  describe('renderBlurredFrameParallel', () => {
    it('should throw when no capturers provided', async () => {
      const config = createConfig();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      await expect(renderer.renderBlurredFrameParallel(10, [])).rejects.toThrow(
        'At least one capturer required'
      );
    });

    it('should distribute samples across multiple capturers', async () => {
      const config = createConfig({ samples: 4 });
      const capturer1 = createMockCapturer();
      const capturer2 = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      try {
        await renderer.renderBlurredFrameParallel(10, [capturer1, capturer2]);
      } catch {
        // Expected to fail at compositing
      }

      // 4 samples distributed across 2 capturers: 2 each
      expect(capturer1.captureFrame).toHaveBeenCalledTimes(2);
      expect(capturer2.captureFrame).toHaveBeenCalledTimes(2);
    });

    it('should distribute samples with single capturer', async () => {
      const config = createConfig({ samples: 3 });
      const capturer = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      try {
        await renderer.renderBlurredFrameParallel(10, [capturer]);
      } catch {
        // Expected to fail at compositing
      }

      expect(capturer.captureFrame).toHaveBeenCalledTimes(3);
    });
  });

  describe('shouldApplyMotionBlur', () => {
    it('should return true when adaptive is disabled', async () => {
      const config = createConfig({ adaptive: false });
      const capturer = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      const result = await renderer.shouldApplyMotionBlur(10, capturer);
      expect(result).toBe(true);
    });

    it('should return true when no previous frame provided', async () => {
      const config = createConfig({ adaptive: true });
      const capturer = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      const result = await renderer.shouldApplyMotionBlur(10, capturer, undefined);
      expect(result).toBe(true);
    });
  });

  describe('renderFrameAdaptive', () => {
    it('should call renderBlurredFrame when adaptive is disabled', async () => {
      const config = createConfig({ adaptive: false, samples: 3 });
      const capturer = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      try {
        await renderer.renderFrameAdaptive(10, capturer);
      } catch {
        // Expected to fail at compositing
      }

      // Should attempt full sample count
      expect(capturer.captureFrame).toHaveBeenCalledTimes(3);
    });
  });

  describe('getConfig', () => {
    it('should return a copy of the config', () => {
      const config = createConfig({ samples: 12 });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const returned = renderer.getConfig();
      expect(returned.motionBlur.samples).toBe(12);
      expect(returned.width).toBe(width);
      expect(returned.height).toBe(height);
    });

    it('should not allow mutation of original config', () => {
      const config = createConfig({ samples: 10 });
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const returned = renderer.getConfig();
      (returned.motionBlur as any).samples = 99;
      expect(renderer.getConfig().motionBlur.samples).toBe(10);
    });

    it('should preserve all config values', () => {
      const config = createConfig({
        enabled: true,
        samples: 16,
        shutterAngle: 270,
        quality: 'high',
        adaptive: true,
        minSamples: 5,
        motionThreshold: 0.05,
      });

      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 3840,
        height: 2160,
      });

      const returned = renderer.getConfig();
      expect(returned.motionBlur.enabled).toBe(true);
      expect(returned.motionBlur.samples).toBe(16);
      expect(returned.motionBlur.shutterAngle).toBe(270);
      expect(returned.motionBlur.quality).toBe('high');
      expect(returned.motionBlur.adaptive).toBe(true);
      expect(returned.motionBlur.minSamples).toBe(5);
      expect(returned.motionBlur.motionThreshold).toBe(0.05);
      expect(returned.width).toBe(3840);
      expect(returned.height).toBe(2160);
    });
  });

  describe('calculateOptimalSamples (via private access)', () => {
    it('should return 2 in preview mode', async () => {
      const config = createConfig({ preview: true, samples: 10 });
      const capturer = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      const result = await (renderer as any).calculateOptimalSamples(10, capturer);
      expect(result).toBe(2);
    });

    it('should return configured samples when variableSampleRate is disabled', async () => {
      const config = createConfig({ variableSampleRate: false, samples: 8 });
      const capturer = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      const result = await (renderer as any).calculateOptimalSamples(10, capturer);
      expect(result).toBe(8);
    });

    it('should return configured samples when no previous frame', async () => {
      const config = createConfig({ variableSampleRate: true, samples: 8 });
      const capturer = createMockCapturer();
      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      const result = await (renderer as any).calculateOptimalSamples(10, capturer, undefined);
      expect(result).toBe(8);
    });
  });
});
