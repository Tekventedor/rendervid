/**
 * Motion Blur Unit Tests
 *
 * Tests for motion blur compositor and frame renderer
 */

import { describe, it, expect, beforeEach } from 'vitest';
import sharp from 'sharp';
import { MotionBlurCompositor } from '../motion-blur-compositor';
import { MotionBlurFrameRenderer } from '../motion-blur-renderer';
import type { ResolvedMotionBlurConfig } from '@rendervid/core';
import { resolveMotionBlurConfig, validateMotionBlurConfig, mergeMotionBlurConfigs, MOTION_BLUR_QUALITY_PRESETS } from '@rendervid/core';

describe('MotionBlurConfig utilities', () => {
  describe('resolveMotionBlurConfig', () => {
    it('should use defaults when no config provided', () => {
      const resolved = resolveMotionBlurConfig();
      expect(resolved.enabled).toBe(false);
      expect(resolved.samples).toBe(10);
      expect(resolved.shutterAngle).toBe(180);
      expect(resolved.adaptive).toBe(false);
      expect(resolved.minSamples).toBe(3);
      expect(resolved.motionThreshold).toBe(0.01);
    });

    it('should apply quality preset', () => {
      const resolved = resolveMotionBlurConfig({
        enabled: true,
        quality: 'high',
      });
      expect(resolved.samples).toBe(MOTION_BLUR_QUALITY_PRESETS.high.samples);
      expect(resolved.shutterAngle).toBe(MOTION_BLUR_QUALITY_PRESETS.high.shutterAngle);
    });

    it('should allow explicit overrides of quality preset', () => {
      const resolved = resolveMotionBlurConfig({
        enabled: true,
        quality: 'low',
        samples: 20, // Override the preset
      });
      expect(resolved.samples).toBe(20); // Should use explicit value
      expect(resolved.shutterAngle).toBe(MOTION_BLUR_QUALITY_PRESETS.low.shutterAngle); // Should use preset
    });

    it('should merge custom config with defaults', () => {
      const resolved = resolveMotionBlurConfig({
        enabled: true,
        samples: 15,
      });
      expect(resolved.enabled).toBe(true);
      expect(resolved.samples).toBe(15);
      expect(resolved.shutterAngle).toBe(180); // Default
      expect(resolved.adaptive).toBe(false); // Default
    });
  });

  describe('validateMotionBlurConfig', () => {
    it('should accept valid config', () => {
      const errors = validateMotionBlurConfig({
        enabled: true,
        samples: 10,
        shutterAngle: 180,
      });
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid shutterAngle', () => {
      const errors = validateMotionBlurConfig({
        enabled: true,
        shutterAngle: 400, // > 360
      });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('shutterAngle');
    });

    it('should reject invalid samples', () => {
      const errors = validateMotionBlurConfig({
        enabled: true,
        samples: 1, // < 2
      });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('samples');
    });

    it('should reject non-integer samples', () => {
      const errors = validateMotionBlurConfig({
        enabled: true,
        samples: 10.5,
      });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('integer');
    });

    it('should reject minSamples > samples', () => {
      const errors = validateMotionBlurConfig({
        enabled: true,
        samples: 5,
        minSamples: 10,
      });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('minSamples');
    });

    it('should reject invalid motionThreshold', () => {
      const errors = validateMotionBlurConfig({
        enabled: true,
        motionThreshold: 2.0, // > 1.0
      });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('motionThreshold');
    });
  });

  describe('mergeMotionBlurConfigs', () => {
    it('should return undefined when no configs provided', () => {
      const merged = mergeMotionBlurConfigs();
      expect(merged).toBeUndefined();
    });

    it('should return global config when no overrides', () => {
      const global = { enabled: true, samples: 10 };
      const merged = mergeMotionBlurConfigs(global);
      expect(merged).toEqual(global);
    });

    it('should prioritize layer > scene > global', () => {
      const global = { enabled: true, samples: 5, shutterAngle: 90 };
      const scene = { samples: 10 };
      const layer = { shutterAngle: 180 };

      const merged = mergeMotionBlurConfigs(global, scene, layer);
      expect(merged).toEqual({
        enabled: true,
        samples: 10, // From scene
        shutterAngle: 180, // From layer
      });
    });

    it('should disable if any config explicitly disables', () => {
      const global = { enabled: true, samples: 10 };
      const scene = { enabled: false };

      const merged = mergeMotionBlurConfigs(global, scene);
      expect(merged).toEqual({ enabled: false });
    });

    it('should respect layer override to disable', () => {
      const global = { enabled: true, samples: 10 };
      const scene = { samples: 20 };
      const layer = { enabled: false };

      const merged = mergeMotionBlurConfigs(global, scene, layer);
      expect(merged).toEqual({ enabled: false });
    });
  });
});

describe('MotionBlurCompositor', () => {
  const width = 100;
  const height = 100;

  async function createSolidColorFrame(r: number, g: number, b: number, a: number = 255): Promise<Buffer> {
    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r, g, b, alpha: a / 255 },
      },
    })
      .png()
      .toBuffer();
  }

  describe('single sample (fast path)', () => {
    it('should return input unchanged for single sample', async () => {
      const compositor = new MotionBlurCompositor({ width, height, samples: 1 });
      const input = await createSolidColorFrame(255, 0, 0);

      const result = await compositor.composite([input]);
      expect(result).toBe(input); // Same buffer reference
    });
  });

  describe('multiple samples', () => {
    it('should average two identical frames correctly', async () => {
      const compositor = new MotionBlurCompositor({ width, height, samples: 2 });
      const frame1 = await createSolidColorFrame(100, 150, 200);
      const frame2 = await createSolidColorFrame(100, 150, 200);

      const result = await compositor.composite([frame1, frame2]);

      // Result should be same color
      const { data } = await sharp(result).raw().toBuffer({ resolveWithObject: true });
      expect(data[0]).toBe(100); // R
      expect(data[1]).toBe(150); // G
      expect(data[2]).toBe(200); // B
    });

    it('should average two different frames correctly', async () => {
      const compositor = new MotionBlurCompositor({ width, height, samples: 2 });
      const frame1 = await createSolidColorFrame(100, 0, 0);
      const frame2 = await createSolidColorFrame(200, 0, 0);

      const result = await compositor.composite([frame1, frame2]);

      // Average of 100 and 200 should be 150
      const { data } = await sharp(result).raw().toBuffer({ resolveWithObject: true });
      expect(data[0]).toBeCloseTo(150, 0); // R channel
    });

    it('should average multiple samples correctly', async () => {
      const compositor = new MotionBlurCompositor({ width, height, samples: 4 });
      const frames = [
        await createSolidColorFrame(0, 0, 0),
        await createSolidColorFrame(100, 0, 0),
        await createSolidColorFrame(200, 0, 0),
        await createSolidColorFrame(255, 0, 0),
      ];

      const result = await compositor.composite(frames);

      // Average of 0, 100, 200, 255 = 138.75 ≈ 139
      const { data } = await sharp(result).raw().toBuffer({ resolveWithObject: true });
      expect(data[0]).toBeCloseTo(139, 1); // R channel
    });

    it('should handle all black frames', async () => {
      const compositor = new MotionBlurCompositor({ width, height, samples: 3 });
      const frames = [
        await createSolidColorFrame(0, 0, 0),
        await createSolidColorFrame(0, 0, 0),
        await createSolidColorFrame(0, 0, 0),
      ];

      const result = await compositor.composite(frames);

      const { data } = await sharp(result).raw().toBuffer({ resolveWithObject: true });
      expect(data[0]).toBe(0);
      expect(data[1]).toBe(0);
      expect(data[2]).toBe(0);
    });

    it('should handle all white frames', async () => {
      const compositor = new MotionBlurCompositor({ width, height, samples: 3 });
      const frames = [
        await createSolidColorFrame(255, 255, 255),
        await createSolidColorFrame(255, 255, 255),
        await createSolidColorFrame(255, 255, 255),
      ];

      const result = await compositor.composite(frames);

      const { data } = await sharp(result).raw().toBuffer({ resolveWithObject: true });
      expect(data[0]).toBe(255);
      expect(data[1]).toBe(255);
      expect(data[2]).toBe(255);
    });
  });

  describe('error handling', () => {
    it('should throw when sample count mismatch', async () => {
      const compositor = new MotionBlurCompositor({ width, height, samples: 3 });
      const frames = [
        await createSolidColorFrame(255, 0, 0),
        await createSolidColorFrame(255, 0, 0),
      ];

      await expect(compositor.composite(frames)).rejects.toThrow('Expected 3 sample buffers, got 2');
    });
  });
});

describe('MotionBlurFrameRenderer', () => {
  const width = 1920;
  const height = 1080;

  function createMockCapturer(): any {
    return {
      captureFrame: async (frame: number) => {
        // Return a simple buffer (mock)
        return Buffer.from(`frame-${frame}`);
      },
    };
  }

  describe('temporal sample calculation', () => {
    it('should calculate correct sample offsets for 180° shutter', () => {
      const config: ResolvedMotionBlurConfig = {
        enabled: true,
        samples: 4,
        shutterAngle: 180,
        quality: 'medium',
        adaptive: false,
        minSamples: 3,
        motionThreshold: 0.01,
        blurAmount: 1,
        stochastic: false,
      };

      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      // Access private method via type assertion
      const offsets = (renderer as any).calculateSampleOffsets(10);

      // For 180° shutter (0.5 fraction), centered at frame 10:
      // shutterStart = -0.5 * 0.5 = -0.25
      // shutterEnd = -0.25 + 0.5 = 0.25
      // Samples distributed evenly: 10-0.25=9.75 to 10+0.25=10.25

      expect(offsets).toHaveLength(4);
      expect(offsets[0]).toBeCloseTo(9.75, 2);
      expect(offsets[3]).toBeCloseTo(10.25, 2);
    });

    it('should calculate correct sample offsets for 360° shutter', () => {
      const config: ResolvedMotionBlurConfig = {
        enabled: true,
        samples: 2,
        shutterAngle: 360,
        quality: 'medium',
        adaptive: false,
        minSamples: 2,
        motionThreshold: 0.01,
        blurAmount: 1,
        stochastic: false,
      };

      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const offsets = (renderer as any).calculateSampleOffsets(10);

      // For 360° shutter (1.0 fraction), centered at frame 10:
      // shutterStart = -0.5 * 1.0 = -0.5
      // shutterEnd = -0.5 + 1.0 = 0.5
      // Range: 10-0.5=9.5 to 10+0.5=10.5

      expect(offsets).toHaveLength(2);
      expect(offsets[0]).toBeCloseTo(9.5, 2);
      expect(offsets[1]).toBeCloseTo(10.5, 2);
    });

    it('should calculate correct sample offsets for 90° shutter', () => {
      const config: ResolvedMotionBlurConfig = {
        enabled: true,
        samples: 3,
        shutterAngle: 90,
        quality: 'low',
        adaptive: false,
        minSamples: 2,
        motionThreshold: 0.01,
        blurAmount: 1,
        stochastic: false,
      };

      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const offsets = (renderer as any).calculateSampleOffsets(10);

      // For 90° shutter (0.25 fraction), centered at frame 10:
      // shutterStart = -0.5 * 0.25 = -0.125
      // shutterEnd = -0.125 + 0.25 = 0.125
      // Range: 10-0.125=9.875 to 10+0.125=10.125

      expect(offsets).toHaveLength(3);
      expect(offsets[0]).toBeCloseTo(9.875, 2);
      expect(offsets[2]).toBeCloseTo(10.125, 2);
    });
  });

  describe('renderBlurredFrame', () => {
    it('should capture and composite correct number of samples', async () => {
      const config: ResolvedMotionBlurConfig = {
        enabled: true,
        samples: 3,
        shutterAngle: 180,
        quality: 'medium',
        adaptive: false,
        minSamples: 2,
        motionThreshold: 0.01,
      };

      const capturer = createMockCapturer();
      let captureCount = 0;
      capturer.captureFrame = async (frame: number) => {
        captureCount++;
        return Buffer.from(`frame-${frame}`);
      };

      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width: 100,
        height: 100,
      });

      // Note: This will fail at compositing since we're using mock buffers,
      // but we can test that it tries to capture the right number of samples
      try {
        await renderer.renderBlurredFrame(10, capturer);
      } catch (e) {
        // Expected to fail at sharp compositing with mock data
      }

      expect(captureCount).toBe(3);
    });
  });

  describe('getConfig', () => {
    it('should return readonly copy of config', () => {
      const config: ResolvedMotionBlurConfig = {
        enabled: true,
        samples: 10,
        shutterAngle: 180,
        quality: 'medium',
        adaptive: false,
        minSamples: 3,
        motionThreshold: 0.01,
      };

      const renderer = new MotionBlurFrameRenderer({
        motionBlur: config,
        width,
        height,
      });

      const returned = renderer.getConfig();
      expect(returned.motionBlur.samples).toBe(10);

      // Should not affect original
      (returned.motionBlur as any).samples = 20;
      expect(renderer.getConfig().motionBlur.samples).toBe(10);
    });
  });
});
