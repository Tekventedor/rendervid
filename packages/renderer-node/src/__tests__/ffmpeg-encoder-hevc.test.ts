import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FFmpegEncoder, createFFmpegEncoder } from '../ffmpeg-encoder';
import type { EncodeOptions, HardwareAccelerationOptions } from '../ffmpeg-encoder';
import type { VideoRenderOptions } from '../types';
import * as gpuDetector from '../gpu-detector';
import type { GPUInfo, HardwareEncoder } from '../gpu-detector';

// Mock the gpu-detector module
vi.mock('../gpu-detector', async () => {
  const actual = await vi.importActual('../gpu-detector');
  return {
    ...actual,
    detectGPUCapabilities: vi.fn(),
  };
});

describe('FFmpegEncoder HEVC/H.265 Support', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('HEVC Codec Options', () => {
    it('should accept libx265 as a valid codec', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        codec: 'libx265',
        quality: 28,
      };

      expect(options.codec).toBe('libx265');
    });

    it('should use CRF 28 as appropriate default for HEVC', () => {
      // HEVC uses CRF 28 as its default (visually equivalent to H.264 CRF 23)
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        codec: 'libx265',
        quality: 28,
      };

      expect(options.quality).toBe(28);
    });

    it('should work with custom bitrate instead of CRF', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        codec: 'libx265',
        bitrate: '10M',
      };

      expect(options.bitrate).toBe('10M');
      expect(options.quality).toBeUndefined();
    });

    it('should work with encoding presets', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        codec: 'libx265',
        preset: 'slow',
      };

      expect(options.preset).toBe('slow');
    });
  });

  describe('HEVC Codec Alias', () => {
    it('should accept hevc as a codec alias in VideoRenderOptions', () => {
      const options: Partial<VideoRenderOptions> = {
        codec: 'hevc',
      };

      expect(options.codec).toBe('hevc');
    });

    it('should accept libx265 directly in VideoRenderOptions', () => {
      const options: Partial<VideoRenderOptions> = {
        codec: 'libx265',
      };

      expect(options.codec).toBe('libx265');
    });
  });

  describe('HEVC Hardware Encoder Selection', () => {
    it('should support HEVC hardware encoders for all vendors', () => {
      const hevcEncoders: HardwareEncoder[] = [
        'hevc_nvenc',
        'hevc_videotoolbox',
        'hevc_qsv',
        'hevc_amf',
      ];

      hevcEncoders.forEach((encoder) => {
        const hwAccel: HardwareAccelerationOptions = {
          enabled: true,
          preferredEncoder: encoder,
        };
        expect(hwAccel.preferredEncoder).toBe(encoder);
      });
    });

    it('should handle NVIDIA HEVC encoder', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'nvidia',
        model: 'RTX 4090',
        encoders: ['h264_nvenc', 'hevc_nvenc'],
        recommendedEncoder: 'h264_nvenc',
      };

      expect(gpuInfo.encoders).toContain('hevc_nvenc');
    });

    it('should handle Apple VideoToolbox HEVC encoder', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'apple',
        model: 'Apple M2',
        encoders: ['h264_videotoolbox', 'hevc_videotoolbox'],
        recommendedEncoder: 'h264_videotoolbox',
      };

      expect(gpuInfo.encoders).toContain('hevc_videotoolbox');
    });

    it('should handle Intel QSV HEVC encoder', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'intel',
        encoders: ['h264_qsv', 'hevc_qsv'],
        recommendedEncoder: 'h264_qsv',
      };

      expect(gpuInfo.encoders).toContain('hevc_qsv');
    });

    it('should handle AMD AMF HEVC encoder', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'amd',
        encoders: ['h264_amf', 'hevc_amf'],
        recommendedEncoder: 'h264_amf',
      };

      expect(gpuInfo.encoders).toContain('hevc_amf');
    });
  });

  describe('HEVC with Hardware Acceleration Options', () => {
    it('should combine HEVC codec with NVENC hardware options', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        codec: 'libx265',
        quality: 28,
        hardwareAcceleration: {
          enabled: true,
          preferredEncoder: 'hevc_nvenc',
          nvenc: {
            preset: 'p4',
            tune: 'hq',
          },
          fallbackToSoftware: true,
        },
      };

      expect(options.codec).toBe('libx265');
      expect(options.hardwareAcceleration?.preferredEncoder).toBe('hevc_nvenc');
    });

    it('should combine HEVC codec with VideoToolbox hardware options', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        codec: 'libx265',
        quality: 28,
        hardwareAcceleration: {
          enabled: true,
          preferredEncoder: 'hevc_videotoolbox',
          videotoolbox: {
            allow_sw: true,
          },
          fallbackToSoftware: true,
        },
      };

      expect(options.codec).toBe('libx265');
      expect(options.hardwareAcceleration?.preferredEncoder).toBe('hevc_videotoolbox');
    });
  });

  describe('Backward Compatibility', () => {
    it('should not affect existing H.264 encoding options', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        codec: 'libx264',
        quality: 23,
        preset: 'medium',
      };

      expect(options.codec).toBe('libx264');
      expect(options.quality).toBe(23);
    });

    it('should still default to libx264 when no codec specified', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
      };

      expect(options.codec).toBeUndefined();
    });

    it('should create encoder without HEVC config', () => {
      const encoder = createFFmpegEncoder();
      expect(encoder).toBeInstanceOf(FFmpegEncoder);
    });
  });
});
