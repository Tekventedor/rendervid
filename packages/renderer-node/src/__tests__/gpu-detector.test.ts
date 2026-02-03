import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exec } from 'child_process';
import {
  detectGPUCapabilities,
  isGPUEncoderAvailable,
  getGPUDescription,
  type GPUInfo,
  type HardwareEncoder,
} from '../gpu-detector';

// Mock child_process exec
vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

describe('GPU Detector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('detectGPUCapabilities', () => {
    it('should detect NVIDIA GPU with NVENC encoder', async () => {
      const mockFFmpegOutput = `Encoders:
 V..... libx264              libx264 H.264 / AVC
 V..... h264_nvenc           NVIDIA NVENC H.264 encoder
 V..... hevc_nvenc           NVIDIA NVENC hevc encoder
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(true);
      expect(result.vendor).toBe('nvidia');
      expect(result.encoders).toContain('h264_nvenc');
      expect(result.encoders).toContain('hevc_nvenc');
      expect(result.recommendedEncoder).toBe('h264_nvenc');
      expect(result.error).toBeUndefined();
    });

    it('should detect Apple VideoToolbox encoder on macOS', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'darwin' });

      const mockFFmpegOutput = `Encoders:
 V..... libx264              libx264 H.264 / AVC
 V..... h264_videotoolbox    VideoToolbox H.264 Encoder
 V..... hevc_videotoolbox    VideoToolbox H.265 Encoder
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(true);
      expect(result.vendor).toBe('apple');
      expect(result.encoders).toContain('h264_videotoolbox');
      expect(result.encoders).toContain('hevc_videotoolbox');
      expect(result.recommendedEncoder).toBe('h264_videotoolbox');

      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });

    it('should detect Intel Quick Sync Video encoder', async () => {
      const mockFFmpegOutput = `Encoders:
 V..... libx264              libx264 H.264 / AVC
 V..... h264_qsv             H.264 / AVC / MPEG-4 AVC (Intel Quick Sync Video)
 V..... hevc_qsv             HEVC (Intel Quick Sync Video)
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(true);
      expect(result.vendor).toBe('intel');
      expect(result.encoders).toContain('h264_qsv');
      expect(result.encoders).toContain('hevc_qsv');
      expect(result.recommendedEncoder).toBe('h264_qsv');
    });

    it('should detect AMD AMF encoder', async () => {
      const mockFFmpegOutput = `Encoders:
 V..... libx264              libx264 H.264 / AVC
 V..... h264_amf             AMD AMF H.264 Encoder
 V..... hevc_amf             AMD AMF HEVC encoder
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(true);
      expect(result.vendor).toBe('amd');
      expect(result.encoders).toContain('h264_amf');
      expect(result.encoders).toContain('hevc_amf');
      expect(result.recommendedEncoder).toBe('h264_amf');
    });

    it('should handle no hardware encoders available', async () => {
      const mockFFmpegOutput = `Encoders:
 V..... libx264              libx264 H.264 / AVC
 V..... libx265              libx265 H.265 / HEVC
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(false);
      expect(result.vendor).toBe('unknown');
      expect(result.encoders).toHaveLength(0);
      expect(result.recommendedEncoder).toBeUndefined();
    });

    it('should handle FFmpeg command failure gracefully', async () => {
      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(new Error('FFmpeg not found'), null);
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(false);
      expect(result.vendor).toBe('unknown');
      expect(result.encoders).toHaveLength(0);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('FFmpeg not found');
    });

    it('should use custom FFmpeg path when provided', async () => {
      const customPath = '/custom/path/to/ffmpeg';
      const mockFFmpegOutput = `Encoders:
 V..... libx264              libx264 H.264 / AVC
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        expect(command).toContain(customPath);
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      await detectGPUCapabilities(customPath);

      expect(exec).toHaveBeenCalledWith(
        expect.stringContaining(customPath),
        expect.any(Function)
      );
    });

    it('should detect multiple hardware encoders', async () => {
      const mockFFmpegOutput = `Encoders:
 V..... libx264              libx264 H.264 / AVC
 V..... h264_nvenc           NVIDIA NVENC H.264 encoder
 V..... h264_qsv             H.264 (Intel Quick Sync Video)
 V..... h264_amf             AMD AMF H.264 Encoder
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(true);
      expect(result.encoders.length).toBeGreaterThanOrEqual(3);
      expect(result.encoders).toContain('h264_nvenc');
      expect(result.encoders).toContain('h264_qsv');
      expect(result.encoders).toContain('h264_amf');
      // NVIDIA should be prioritized
      expect(result.vendor).toBe('nvidia');
      expect(result.recommendedEncoder).toBe('h264_nvenc');
    });
  });

  describe('isGPUEncoderAvailable', () => {
    it('should return true when encoder is available', async () => {
      const mockFFmpegOutput = `Encoders:
 V..... libx264              libx264 H.264 / AVC
 V..... h264_nvenc           NVIDIA NVENC H.264 encoder
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await isGPUEncoderAvailable('h264_nvenc');

      expect(result).toBe(true);
    });

    it('should return false when encoder is not available', async () => {
      const mockFFmpegOutput = `Encoders:
 V..... libx264              libx264 H.264 / AVC
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await isGPUEncoderAvailable('h264_nvenc');

      expect(result).toBe(false);
    });

    it('should return false when FFmpeg command fails', async () => {
      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(new Error('Command failed'), null);
        return {} as any;
      });

      const result = await isGPUEncoderAvailable('h264_nvenc');

      expect(result).toBe(false);
    });

    it('should check specific encoder types', async () => {
      const encoders: HardwareEncoder[] = [
        'h264_nvenc',
        'hevc_nvenc',
        'h264_videotoolbox',
        'hevc_videotoolbox',
        'h264_qsv',
        'hevc_qsv',
        'h264_amf',
        'hevc_amf',
      ];

      for (const encoder of encoders) {
        const mockFFmpegOutput = `Encoders:
 V..... ${encoder}           Hardware encoder
`;

        vi.mocked(exec).mockImplementation((command: string, callback: any) => {
          callback(null, { stdout: mockFFmpegOutput, stderr: '' });
          return {} as any;
        });

        const result = await isGPUEncoderAvailable(encoder);
        expect(result).toBe(true);
      }
    });

    it('should use custom FFmpeg path when provided', async () => {
      const customPath = '/custom/ffmpeg';
      const mockFFmpegOutput = `Encoders:
 V..... h264_nvenc           NVIDIA NVENC H.264 encoder
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        expect(command).toContain(customPath);
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      await isGPUEncoderAvailable('h264_nvenc', customPath);

      expect(exec).toHaveBeenCalledWith(
        expect.stringContaining(customPath),
        expect.any(Function)
      );
    });
  });

  describe('getGPUDescription', () => {
    it('should return description for available NVIDIA GPU', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'nvidia',
        model: 'RTX 3080',
        encoders: ['h264_nvenc', 'hevc_nvenc'],
        recommendedEncoder: 'h264_nvenc',
      };

      const description = getGPUDescription(gpuInfo);

      expect(description).toContain('NVIDIA');
      expect(description).toContain('RTX 3080');
      expect(description).toContain('h264_nvenc');
    });

    it('should return description for Apple GPU', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'apple',
        model: 'Apple M1',
        encoders: ['h264_videotoolbox'],
        recommendedEncoder: 'h264_videotoolbox',
      };

      const description = getGPUDescription(gpuInfo);

      expect(description).toContain('APPLE');
      expect(description).toContain('Apple M1');
      expect(description).toContain('h264_videotoolbox');
    });

    it('should return description for GPU without model info', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'intel',
        encoders: ['h264_qsv'],
        recommendedEncoder: 'h264_qsv',
      };

      const description = getGPUDescription(gpuInfo);

      expect(description).toContain('INTEL');
      expect(description).toContain('h264_qsv');
      expect(description).not.toContain('undefined');
    });

    it('should return description for unavailable GPU', () => {
      const gpuInfo: GPUInfo = {
        available: false,
        vendor: 'unknown',
        encoders: [],
      };

      const description = getGPUDescription(gpuInfo);

      expect(description).toContain('not available');
    });

    it('should include error message when present', () => {
      const gpuInfo: GPUInfo = {
        available: false,
        vendor: 'unknown',
        encoders: [],
        error: 'FFmpeg not found',
      };

      const description = getGPUDescription(gpuInfo);

      expect(description).toContain('not available');
      expect(description).toContain('FFmpeg not found');
    });

    it('should show encoder count when no recommended encoder', () => {
      const gpuInfo: GPUInfo = {
        available: true,
        vendor: 'nvidia',
        encoders: ['h264_nvenc', 'hevc_nvenc', 'h264_qsv'],
      };

      const description = getGPUDescription(gpuInfo);

      expect(description).toContain('3 encoder(s) available');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty FFmpeg output', async () => {
      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: '', stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(false);
      expect(result.encoders).toHaveLength(0);
    });

    it('should handle malformed FFmpeg output', async () => {
      const mockFFmpegOutput = `Some random output
that doesn't match expected format
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(false);
      expect(result.vendor).toBe('unknown');
    });

    it('should handle mixed encoder types correctly', async () => {
      const mockFFmpegOutput = `Encoders:
 A..... aac                  AAC (Advanced Audio Coding)
 V..... libx264              libx264 H.264 / AVC
 V..... h264_nvenc           NVIDIA NVENC H.264 encoder
 S..... ass                  ASS (Advanced SSA) subtitle
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.available).toBe(true);
      expect(result.encoders).toContain('h264_nvenc');
      // Should not include audio or subtitle encoders
      expect(result.encoders.every((e: string) => e.includes('h264') || e.includes('hevc'))).toBe(true);
    });
  });

  describe('Platform Detection', () => {
    it('should prioritize VideoToolbox on macOS', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'darwin' });

      const mockFFmpegOutput = `Encoders:
 V..... h264_videotoolbox    VideoToolbox H.264 Encoder
 V..... h264_nvenc           NVIDIA NVENC H.264 encoder
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.vendor).toBe('apple');
      expect(result.recommendedEncoder).toBe('h264_videotoolbox');

      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });

    it('should detect NVIDIA on Linux', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'linux' });

      const mockFFmpegOutput = `Encoders:
 V..... h264_nvenc           NVIDIA NVENC H.264 encoder
`;

      vi.mocked(exec).mockImplementation((command: string, callback: any) => {
        callback(null, { stdout: mockFFmpegOutput, stderr: '' });
        return {} as any;
      });

      const result = await detectGPUCapabilities();

      expect(result.vendor).toBe('nvidia');

      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });
  });
});
