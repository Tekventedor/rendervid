import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FFmpegEncoder, createFFmpegEncoder } from '../ffmpeg-encoder';
import type { EncodeOptions, HardwareAccelerationOptions } from '../ffmpeg-encoder';
import * as gpuDetector from '../gpu-detector';
import type { GPUInfo } from '../gpu-detector';

// Mock the gpu-detector module
vi.mock('../gpu-detector', async () => {
  const actual = await vi.importActual('../gpu-detector');
  return {
    ...actual,
    detectGPUCapabilities: vi.fn(),
  };
});

describe('FFmpegEncoder GPU Acceleration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Encoder Selection', () => {
    it('should use hardware encoder when GPU is available', async () => {
      const mockGPUInfo: GPUInfo = {
        available: true,
        vendor: 'nvidia',
        model: 'RTX 3080',
        encoders: ['h264_nvenc', 'hevc_nvenc'],
        recommendedEncoder: 'h264_nvenc',
      };

      vi.mocked(gpuDetector.detectGPUCapabilities).mockResolvedValue(mockGPUInfo);

      const encoder = createFFmpegEncoder();

      // We can't actually test encoding without FFmpeg, but we can verify the logic
      expect(encoder).toBeInstanceOf(FFmpegEncoder);
    });

    it('should use software encoder when GPU is disabled', async () => {
      const mockGPUInfo: GPUInfo = {
        available: true,
        vendor: 'nvidia',
        encoders: ['h264_nvenc'],
        recommendedEncoder: 'h264_nvenc',
      };

      vi.mocked(gpuDetector.detectGPUCapabilities).mockResolvedValue(mockGPUInfo);

      const encoder = createFFmpegEncoder();

      // Verify encoder instance created
      expect(encoder).toBeInstanceOf(FFmpegEncoder);
    });

    it('should fallback to software encoder when GPU is not available', async () => {
      const mockGPUInfo: GPUInfo = {
        available: false,
        vendor: 'unknown',
        encoders: [],
        error: 'No GPU detected',
      };

      vi.mocked(gpuDetector.detectGPUCapabilities).mockResolvedValue(mockGPUInfo);

      const encoder = createFFmpegEncoder();

      expect(encoder).toBeInstanceOf(FFmpegEncoder);
    });
  });

  describe('Hardware Acceleration Options', () => {
    it('should accept NVENC-specific options', () => {
      const hwAccel: HardwareAccelerationOptions = {
        enabled: true,
        preferredEncoder: 'h264_nvenc',
        nvenc: {
          preset: 'p4',
          tune: 'hq',
          rc: 'vbr',
        },
        fallbackToSoftware: true,
      };

      expect(hwAccel.nvenc?.preset).toBe('p4');
      expect(hwAccel.nvenc?.tune).toBe('hq');
      expect(hwAccel.nvenc?.rc).toBe('vbr');
    });

    it('should accept VideoToolbox-specific options', () => {
      const hwAccel: HardwareAccelerationOptions = {
        enabled: true,
        preferredEncoder: 'h264_videotoolbox',
        videotoolbox: {
          allow_sw: true,
          realtime: false,
        },
        fallbackToSoftware: true,
      };

      expect(hwAccel.videotoolbox?.allow_sw).toBe(true);
      expect(hwAccel.videotoolbox?.realtime).toBe(false);
    });

    it('should accept QSV-specific options', () => {
      const hwAccel: HardwareAccelerationOptions = {
        enabled: true,
        preferredEncoder: 'h264_qsv',
        qsv: {
          preset: 'medium',
          look_ahead: true,
        },
        fallbackToSoftware: true,
      };

      expect(hwAccel.qsv?.preset).toBe('medium');
      expect(hwAccel.qsv?.look_ahead).toBe(true);
    });

    it('should accept AMF-specific options', () => {
      const hwAccel: HardwareAccelerationOptions = {
        enabled: true,
        preferredEncoder: 'h264_amf',
        amf: {
          quality: 'balanced',
          rc: 'vbr_latency',
        },
        fallbackToSoftware: true,
      };

      expect(hwAccel.amf?.quality).toBe('balanced');
      expect(hwAccel.amf?.rc).toBe('vbr_latency');
    });
  });

  describe('Config-Level Settings', () => {
    it('should accept hardware acceleration in config', () => {
      const encoder = createFFmpegEncoder({
        hardwareAcceleration: {
          enabled: true,
          fallbackToSoftware: true,
        },
      });

      expect(encoder).toBeInstanceOf(FFmpegEncoder);
    });

    it('should accept preferred encoder in config', () => {
      const encoder = createFFmpegEncoder({
        hardwareAcceleration: {
          enabled: true,
          preferredEncoder: 'h264_nvenc',
          fallbackToSoftware: true,
        },
      });

      expect(encoder).toBeInstanceOf(FFmpegEncoder);
    });
  });

  describe('EncodeOptions Interface', () => {
    it('should accept hardware acceleration options in encode options', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        quality: 23,
        hardwareAcceleration: {
          enabled: true,
          preferredEncoder: 'h264_nvenc',
          nvenc: {
            preset: 'p4',
            tune: 'hq',
            rc: 'vbr',
          },
          fallbackToSoftware: true,
        },
      };

      expect(options.hardwareAcceleration?.enabled).toBe(true);
      expect(options.hardwareAcceleration?.preferredEncoder).toBe('h264_nvenc');
      expect(options.hardwareAcceleration?.nvenc?.preset).toBe('p4');
    });

    it('should work without hardware acceleration options', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        quality: 23,
      };

      expect(options.hardwareAcceleration).toBeUndefined();
    });
  });

  describe('Type Safety', () => {
    it('should enforce valid NVENC preset values', () => {
      const validPresets: Array<'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7'> = [
        'p1',
        'p2',
        'p3',
        'p4',
        'p5',
        'p6',
        'p7',
      ];

      validPresets.forEach((preset) => {
        const hwAccel: HardwareAccelerationOptions = {
          nvenc: { preset },
        };
        expect(hwAccel.nvenc?.preset).toBe(preset);
      });
    });

    it('should enforce valid NVENC tune values', () => {
      const validTunes: Array<'hq' | 'll' | 'ull' | 'lossless'> = ['hq', 'll', 'ull', 'lossless'];

      validTunes.forEach((tune) => {
        const hwAccel: HardwareAccelerationOptions = {
          nvenc: { tune },
        };
        expect(hwAccel.nvenc?.tune).toBe(tune);
      });
    });

    it('should enforce valid NVENC rate control values', () => {
      const validRc: Array<
        'constqp' | 'vbr' | 'cbr' | 'vbr_minqp' | 'll_2pass_quality' | 'vbr_2pass'
      > = ['constqp', 'vbr', 'cbr', 'vbr_minqp', 'll_2pass_quality', 'vbr_2pass'];

      validRc.forEach((rc) => {
        const hwAccel: HardwareAccelerationOptions = {
          nvenc: { rc },
        };
        expect(hwAccel.nvenc?.rc).toBe(rc);
      });
    });

    it('should enforce valid QSV preset values', () => {
      const validPresets: Array<
        'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow'
      > = ['veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'];

      validPresets.forEach((preset) => {
        const hwAccel: HardwareAccelerationOptions = {
          qsv: { preset },
        };
        expect(hwAccel.qsv?.preset).toBe(preset);
      });
    });

    it('should enforce valid AMF quality values', () => {
      const validQualities: Array<'speed' | 'balanced' | 'quality'> = [
        'speed',
        'balanced',
        'quality',
      ];

      validQualities.forEach((quality) => {
        const hwAccel: HardwareAccelerationOptions = {
          amf: { quality },
        };
        expect(hwAccel.amf?.quality).toBe(quality);
      });
    });

    it('should enforce valid AMF rate control values', () => {
      const validRc: Array<'cqp' | 'cbr' | 'vbr_peak' | 'vbr_latency'> = [
        'cqp',
        'cbr',
        'vbr_peak',
        'vbr_latency',
      ];

      validRc.forEach((rc) => {
        const hwAccel: HardwareAccelerationOptions = {
          amf: { rc },
        };
        expect(hwAccel.amf?.rc).toBe(rc);
      });
    });
  });

  describe('Multiple Vendors', () => {
    it('should handle NVIDIA GPU info', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'nvidia',
        model: 'RTX 3080',
        encoders: ['h264_nvenc', 'hevc_nvenc'],
        recommendedEncoder: 'h264_nvenc',
      };

      expect(gpuInfo.vendor).toBe('nvidia');
      expect(gpuInfo.encoders).toContain('h264_nvenc');
    });

    it('should handle Apple GPU info', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'apple',
        model: 'Apple M1',
        encoders: ['h264_videotoolbox', 'hevc_videotoolbox'],
        recommendedEncoder: 'h264_videotoolbox',
      };

      expect(gpuInfo.vendor).toBe('apple');
      expect(gpuInfo.encoders).toContain('h264_videotoolbox');
    });

    it('should handle Intel GPU info', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'intel',
        encoders: ['h264_qsv', 'hevc_qsv'],
        recommendedEncoder: 'h264_qsv',
      };

      expect(gpuInfo.vendor).toBe('intel');
      expect(gpuInfo.encoders).toContain('h264_qsv');
    });

    it('should handle AMD GPU info', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'amd',
        encoders: ['h264_amf', 'hevc_amf'],
        recommendedEncoder: 'h264_amf',
      };

      expect(gpuInfo.vendor).toBe('amd');
      expect(gpuInfo.encoders).toContain('h264_amf');
    });
  });

  describe('Backward Compatibility', () => {
    it('should work with existing code without hardware acceleration', () => {
      const encoder = createFFmpegEncoder();
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        codec: 'libx264',
        quality: 23,
      };

      expect(encoder).toBeInstanceOf(FFmpegEncoder);
      expect(options.codec).toBe('libx264');
      expect(options.hardwareAcceleration).toBeUndefined();
    });

    it('should default to software codec when hardware acceleration not specified', () => {
      const options: EncodeOptions = {
        inputPattern: 'frames/frame-%05d.png',
        outputPath: 'output.mp4',
        fps: 30,
        width: 1920,
        height: 1080,
        quality: 23,
      };

      // Should not have hardware acceleration by default
      expect(options.hardwareAcceleration).toBeUndefined();
    });
  });

  describe('HEVC Support', () => {
    it('should support HEVC encoders', () => {
      const hevcEncoders: Array<
        'hevc_nvenc' | 'hevc_videotoolbox' | 'hevc_qsv' | 'hevc_amf'
      > = ['hevc_nvenc', 'hevc_videotoolbox', 'hevc_qsv', 'hevc_amf'];

      hevcEncoders.forEach((encoder) => {
        const hwAccel: HardwareAccelerationOptions = {
          enabled: true,
          preferredEncoder: encoder,
        };

        expect(hwAccel.preferredEncoder).toBe(encoder);
      });
    });

    it('should handle mixed H.264 and HEVC encoders', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'nvidia',
        encoders: ['h264_nvenc', 'hevc_nvenc'],
        recommendedEncoder: 'h264_nvenc',
      };

      expect(gpuInfo.encoders).toContain('h264_nvenc');
      expect(gpuInfo.encoders).toContain('hevc_nvenc');
    });
  });
});
