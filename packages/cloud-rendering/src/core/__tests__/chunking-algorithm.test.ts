import { calculateChunks, validateChunks, estimateRenderTime } from '../chunking-algorithm';
import type { QualityPreset } from '../../types/provider-config';

describe('Chunking Algorithm', () => {
  const standardPreset: QualityPreset = {
    memory: 5120,
    timeout: 600,
    concurrency: 20,
    framesPerChunk: 30,
  };

  describe('calculateChunks', () => {
    it('should divide frames into equal chunks', () => {
      const totalFrames = 600;
      const chunks = calculateChunks(totalFrames, standardPreset);

      expect(chunks).toHaveLength(20); // 600 / 30 = 20 chunks
      expect(chunks[0]).toEqual({
        id: 0,
        startFrame: 0,
        endFrame: 29,
        frameCount: 30,
      });
      expect(chunks[19]).toEqual({
        id: 19,
        startFrame: 570,
        endFrame: 599,
        frameCount: 30,
      });
    });

    it('should handle frames that do not divide evenly', () => {
      const totalFrames = 650;
      const chunks = calculateChunks(totalFrames, standardPreset);

      // Should create 20 chunks (limited by concurrency)
      expect(chunks).toHaveLength(20);

      // Each chunk should have ~33 frames (650 / 20 = 32.5, rounded up)
      const lastChunk = chunks[chunks.length - 1];
      expect(lastChunk.endFrame).toBe(649); // Should cover all frames
    });

    it('should respect max concurrency limit', () => {
      const totalFrames = 3000;
      const preset: QualityPreset = {
        ...standardPreset,
        concurrency: 10,
        framesPerChunk: 50,
      };

      const chunks = calculateChunks(totalFrames, preset);

      // Should be capped at 10 chunks (concurrency limit)
      expect(chunks).toHaveLength(10);
    });

    it('should allow custom frames per chunk', () => {
      const totalFrames = 600;
      const chunks = calculateChunks(totalFrames, standardPreset, 60); // Custom 60 frames/chunk

      expect(chunks).toHaveLength(10); // 600 / 60 = 10 chunks
      expect(chunks[0].frameCount).toBe(60);
    });

    it('should allow custom max concurrency', () => {
      const totalFrames = 600;
      const chunks = calculateChunks(totalFrames, standardPreset, undefined, 5); // Max 5 workers

      expect(chunks).toHaveLength(5);
    });
  });

  describe('validateChunks', () => {
    it('should validate correct chunks', () => {
      const chunks = calculateChunks(600, standardPreset);
      expect(() => validateChunks(chunks, 600)).not.toThrow();
    });

    it('should throw on empty chunks', () => {
      expect(() => validateChunks([], 600)).toThrow('No chunks generated');
    });

    it('should throw on gaps in chunks', () => {
      const chunks = [
        { id: 0, startFrame: 0, endFrame: 29, frameCount: 30 },
        { id: 1, startFrame: 40, endFrame: 69, frameCount: 30 }, // Gap from 30-39
      ];
      expect(() => validateChunks(chunks, 70)).toThrow();
    });

    it('should throw on incomplete coverage', () => {
      const chunks = [
        { id: 0, startFrame: 0, endFrame: 29, frameCount: 30 },
        { id: 1, startFrame: 30, endFrame: 59, frameCount: 30 },
      ];
      expect(() => validateChunks(chunks, 100)).toThrow();
    });
  });

  describe('estimateRenderTime', () => {
    it('should estimate render time based on slowest chunk', () => {
      const chunks = calculateChunks(600, standardPreset);
      const avgTimePerFrame = 100; // 100ms per frame

      const estimatedTime = estimateRenderTime(chunks, avgTimePerFrame);

      // Slowest chunk has 30 frames * 100ms = 3000ms + 5000ms overhead
      expect(estimatedTime).toBe(8000);
    });
  });
});
