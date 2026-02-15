import { describe, it, expect } from 'vitest';
import { generateFrameFilename, validateFrameRange } from '../image-sequence-exporter';
import type { ImageSequenceManifest } from '../types';

describe('ImageSequenceExporter', () => {
  describe('generateFrameFilename', () => {
    it('should generate default frame filenames with padded numbers', () => {
      const filename = generateFrameFilename(0, { format: 'png' });
      expect(filename).toBe('frame-00000.png');
    });

    it('should generate filenames with correct padding for larger frame numbers', () => {
      const filename = generateFrameFilename(42, { format: 'png' });
      expect(filename).toBe('frame-00042.png');
    });

    it('should support jpeg format with .jpg extension', () => {
      const filename = generateFrameFilename(1, { format: 'jpeg' });
      expect(filename).toBe('frame-00001.jpg');
    });

    it('should support webp format', () => {
      const filename = generateFrameFilename(1, { format: 'webp' });
      expect(filename).toBe('frame-00001.webp');
    });

    it('should apply prefix', () => {
      const filename = generateFrameFilename(5, { format: 'png', prefix: 'output_' });
      expect(filename).toBe('output_frame-00005.png');
    });

    it('should apply suffix', () => {
      const filename = generateFrameFilename(5, { format: 'png', suffix: '_final' });
      expect(filename).toBe('frame-00005_final.png');
    });

    it('should apply both prefix and suffix', () => {
      const filename = generateFrameFilename(5, { format: 'png', prefix: 'render_', suffix: '_v2' });
      expect(filename).toBe('render_frame-00005_v2.png');
    });

    it('should support custom naming pattern with {number}', () => {
      const filename = generateFrameFilename(10, {
        format: 'png',
        namingPattern: 'shot-{number}',
      });
      expect(filename).toBe('shot-00010.png');
    });

    it('should support custom naming pattern with {name}', () => {
      const filename = generateFrameFilename(0, {
        format: 'png',
        namingPattern: '{name}-{number}',
        templateName: 'My Template',
      });
      expect(filename).toBe('My_Template-00000.png');
    });

    it('should support custom naming pattern with {hash}', () => {
      const filename = generateFrameFilename(0, {
        format: 'png',
        namingPattern: '{hash}',
        templateName: 'test',
      });
      // Hash should be 8 characters
      expect(filename).toMatch(/^[a-f0-9]{8}\.png$/);
    });

    it('should support printf-style %05d patterns', () => {
      const filename = generateFrameFilename(7, {
        format: 'png',
        namingPattern: 'frame_%05d',
      });
      expect(filename).toBe('frame_00007.png');
    });

    it('should generate consistent hashes for the same input', () => {
      const f1 = generateFrameFilename(5, { format: 'png', namingPattern: '{hash}', templateName: 'test' });
      const f2 = generateFrameFilename(5, { format: 'png', namingPattern: '{hash}', templateName: 'test' });
      expect(f1).toBe(f2);
    });

    it('should generate different hashes for different frames', () => {
      const f1 = generateFrameFilename(0, { format: 'png', namingPattern: '{hash}', templateName: 'test' });
      const f2 = generateFrameFilename(1, { format: 'png', namingPattern: '{hash}', templateName: 'test' });
      expect(f1).not.toBe(f2);
    });
  });

  describe('validateFrameRange', () => {
    it('should validate a valid frame range', () => {
      const result = validateFrameRange(0, 30, 30);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate a partial frame range', () => {
      const result = validateFrameRange(10, 20, 30);
      expect(result.valid).toBe(true);
    });

    it('should reject negative start frame', () => {
      const result = validateFrameRange(-1, 10, 30);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('-1');
    });

    it('should reject end frame equal to start frame', () => {
      const result = validateFrameRange(10, 10, 30);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('greater than');
    });

    it('should reject end frame less than start frame', () => {
      const result = validateFrameRange(20, 10, 30);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('greater than');
    });

    it('should reject start frame beyond total frames', () => {
      const result = validateFrameRange(30, 40, 30);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds total');
    });

    it('should reject end frame beyond total frames', () => {
      const result = validateFrameRange(0, 31, 30);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds total');
    });

    it('should accept single frame range', () => {
      const result = validateFrameRange(0, 1, 30);
      expect(result.valid).toBe(true);
    });
  });

  describe('ImageSequenceManifest type', () => {
    it('should be structurally valid', () => {
      const manifest: ImageSequenceManifest = {
        templateName: 'Test Template',
        width: 1920,
        height: 1080,
        fps: 30,
        format: 'png',
        quality: 90,
        totalFrames: 90,
        startFrame: 0,
        endFrame: 90,
        totalSize: 1024000,
        exportedAt: '2026-01-01T00:00:00.000Z',
        frames: [
          {
            frame: 0,
            filename: 'frame-00000.png',
            fileSize: 11378,
            format: 'png',
          },
        ],
      };

      expect(manifest.templateName).toBe('Test Template');
      expect(manifest.frames).toHaveLength(1);
      expect(manifest.frames[0].frame).toBe(0);
    });
  });
});
