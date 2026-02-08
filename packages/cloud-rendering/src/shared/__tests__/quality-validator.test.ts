import { validateVideoQuality } from '../quality-validator';
import type { VideoQualityMetrics } from '../quality-validator';

describe('Quality Validator', () => {
  const baseMetrics: VideoQualityMetrics = {
    duration: 10.0,
    fps: 30,
    resolution: { width: 1920, height: 1080 },
    bitrate: 5000000,
    hasAudio: true,
    fileSize: 6250000,
  };

  describe('validateVideoQuality', () => {
    it('should validate when all metrics match', () => {
      const result = validateVideoQuality(baseMetrics, {
        duration: 10.0,
        fps: 30,
        resolution: { width: 1920, height: 1080 },
        hasAudio: true,
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect duration mismatch', () => {
      const result = validateVideoQuality(baseMetrics, {
        duration: 15.0,
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Duration mismatch');
    });

    it('should allow small duration variance within tolerance', () => {
      const metrics = { ...baseMetrics, duration: 10.05 };
      const result = validateVideoQuality(metrics, {
        duration: 10.0,
      });

      expect(result.valid).toBe(true);
    });

    it('should detect fps mismatch', () => {
      const result = validateVideoQuality(baseMetrics, {
        fps: 60,
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('FPS mismatch');
    });

    it('should detect width mismatch', () => {
      const result = validateVideoQuality(baseMetrics, {
        resolution: { width: 3840, height: 1080 },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Width mismatch')])
      );
    });

    it('should detect height mismatch', () => {
      const result = validateVideoQuality(baseMetrics, {
        resolution: { width: 1920, height: 2160 },
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Height mismatch')])
      );
    });

    it('should detect audio mismatch', () => {
      const result = validateVideoQuality(baseMetrics, {
        hasAudio: false,
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Audio mismatch');
    });

    it('should report multiple errors', () => {
      const result = validateVideoQuality(baseMetrics, {
        duration: 20.0,
        fps: 60,
        hasAudio: false,
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(3);
    });

    it('should pass with empty expected metrics', () => {
      const result = validateVideoQuality(baseMetrics, {});

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle hasAudio explicitly set to true', () => {
      const result = validateVideoQuality(baseMetrics, {
        hasAudio: true,
      });

      expect(result.valid).toBe(true);
    });

    it('should handle metrics without audio', () => {
      const noAudioMetrics = { ...baseMetrics, hasAudio: false };
      const result = validateVideoQuality(noAudioMetrics, {
        hasAudio: false,
      });

      expect(result.valid).toBe(true);
    });
  });
});
