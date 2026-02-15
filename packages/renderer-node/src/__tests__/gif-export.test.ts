import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FFmpegEncoder, createFFmpegEncoder } from '../ffmpeg-encoder';
import type { GifOptions } from '../ffmpeg-encoder';
import type { GifRenderOptions } from '../types';

describe('GIF Export', () => {
  describe('GifOptions Interface', () => {
    it('should accept basic GIF options', () => {
      const options: GifOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.gif',
        fps: 15,
      };

      expect(options.inputPattern).toBe('frames/frame-%05d.png');
      expect(options.outputPath).toBe('output.gif');
      expect(options.fps).toBe(15);
    });

    it('should accept all GIF options including new fields', () => {
      const onProgress = vi.fn();
      const options: GifOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.gif',
        fps: 15,
        width: 480,
        height: 360,
        colors: 128,
        dither: 'floyd_steinberg',
        loop: 0,
        optimizationLevel: 'aggressive',
        onProgress,
        totalFrames: 90,
      };

      expect(options.loop).toBe(0);
      expect(options.optimizationLevel).toBe('aggressive');
      expect(options.onProgress).toBe(onProgress);
      expect(options.totalFrames).toBe(90);
    });

    it('should support loop values', () => {
      const infiniteLoop: GifOptions = {
        inputPattern: 'frames/%05d.png',
        outputPath: 'out.gif',
        fps: 10,
        loop: 0,
      };
      expect(infiniteLoop.loop).toBe(0);

      const noLoop: GifOptions = {
        inputPattern: 'frames/%05d.png',
        outputPath: 'out.gif',
        fps: 10,
        loop: -1,
      };
      expect(noLoop.loop).toBe(-1);

      const threeLoops: GifOptions = {
        inputPattern: 'frames/%05d.png',
        outputPath: 'out.gif',
        fps: 10,
        loop: 3,
      };
      expect(threeLoops.loop).toBe(3);
    });

    it('should support all optimization levels', () => {
      const levels: Array<'none' | 'basic' | 'aggressive'> = [
        'none',
        'basic',
        'aggressive',
      ];

      levels.forEach((level) => {
        const options: GifOptions = {
          inputPattern: 'frames/%05d.png',
          outputPath: 'out.gif',
          fps: 10,
          optimizationLevel: level,
        };
        expect(options.optimizationLevel).toBe(level);
      });
    });

    it('should support all dither options', () => {
      const dithers: Array<'none' | 'floyd_steinberg' | 'bayer'> = [
        'none',
        'floyd_steinberg',
        'bayer',
      ];

      dithers.forEach((dither) => {
        const options: GifOptions = {
          inputPattern: 'frames/%05d.png',
          outputPath: 'out.gif',
          fps: 10,
          dither,
        };
        expect(options.dither).toBe(dither);
      });
    });
  });

  describe('GifRenderOptions Interface', () => {
    it('should accept GIF render options with maxFileSize', () => {
      const template = {
        name: 'test',
        output: { type: 'video' as const, width: 480, height: 480, fps: 15, duration: 3 },
        composition: { scenes: [] },
      };

      const options: GifRenderOptions = {
        template,
        outputPath: 'output.gif',
        colors: 128,
        dither: 'floyd_steinberg',
        loop: 0,
        optimizationLevel: 'aggressive',
        maxFileSize: 5 * 1024 * 1024, // 5MB
      };

      expect(options.maxFileSize).toBe(5 * 1024 * 1024);
      expect(options.colors).toBe(128);
      expect(options.loop).toBe(0);
    });

    it('should accept optional width/height/fps overrides', () => {
      const template = {
        name: 'test',
        output: { type: 'video' as const, width: 1920, height: 1080, fps: 30, duration: 3 },
        composition: { scenes: [] },
      };

      const options: GifRenderOptions = {
        template,
        outputPath: 'output.gif',
        width: 480,
        height: 270,
        fps: 15,
      };

      expect(options.width).toBe(480);
      expect(options.height).toBe(270);
      expect(options.fps).toBe(15);
    });
  });

  describe('FFmpegEncoder GIF', () => {
    it('should create an encoder instance', () => {
      const encoder = createFFmpegEncoder();
      expect(encoder).toBeInstanceOf(FFmpegEncoder);
    });

    it('should have encodeToGif method', () => {
      const encoder = createFFmpegEncoder();
      expect(typeof encoder.encodeToGif).toBe('function');
    });
  });

  describe('Progress Callback', () => {
    it('should accept progress callback in GIF options', () => {
      const progressEvents: Array<{ frame: number; percent: number }> = [];
      const onProgress = vi.fn((progress) => {
        progressEvents.push({
          frame: progress.currentFrame,
          percent: progress.percent,
        });
      });

      const options: GifOptions = {
        inputPattern: 'frames/%05d.png',
        outputPath: 'out.gif',
        fps: 10,
        onProgress,
        totalFrames: 30,
      };

      expect(options.onProgress).toBe(onProgress);
      expect(options.totalFrames).toBe(30);

      // Simulate a progress call
      onProgress({
        phase: 'encoding',
        currentFrame: 15,
        totalFrames: 30,
        percent: 50,
        elapsed: 1.5,
        fps: 10,
      });

      expect(progressEvents).toHaveLength(1);
      expect(progressEvents[0].percent).toBe(50);
    });
  });

  describe('Backward Compatibility', () => {
    it('should work with original GifOptions without new fields', () => {
      const options: GifOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.gif',
        fps: 15,
        width: 320,
        height: 240,
        colors: 256,
        dither: 'floyd_steinberg',
      };

      // New fields should be undefined
      expect(options.loop).toBeUndefined();
      expect(options.optimizationLevel).toBeUndefined();
      expect(options.onProgress).toBeUndefined();
      expect(options.totalFrames).toBeUndefined();
    });
  });
});
