import { describe, it, expect } from 'vitest';
import type {
  VideoRenderOptions,
  ImageRenderOptions,
  SequenceRenderOptions,
  PuppeteerLaunchOptions,
  RenderProgress,
  RenderResult,
  FFmpegConfig,
  NodeRendererOptions,
} from '../types';
import type { Template } from '@rendervid/core';

describe('Renderer Node Types', () => {
  const mockTemplate: Template = {
    name: 'Test Template',
    output: {
      type: 'video',
      width: 1920,
      height: 1080,
      fps: 30,
    },
    inputs: [],
    composition: {
      scenes: [
        {
          id: 'scene-1',
          startFrame: 0,
          endFrame: 300,
          layers: [],
        },
      ],
    },
  };

  describe('VideoRenderOptions', () => {
    it('should define minimal video render options', () => {
      const options: VideoRenderOptions = {
        template: mockTemplate,
        outputPath: '/output/video.mp4',
      };

      expect(options.template).toBe(mockTemplate);
      expect(options.outputPath).toBe('/output/video.mp4');
    });

    it('should define full video render options', () => {
      const onProgress = (progress: RenderProgress) => {};
      const onFrame = (frame: number, total: number) => {};

      const options: VideoRenderOptions = {
        template: mockTemplate,
        inputs: { title: 'Hello' },
        outputPath: '/output/video.mp4',
        codec: 'libx264',
        format: 'mp4',
        quality: 23,
        audioCodec: 'aac',
        audioBitrate: '192k',
        includeAudio: true,
        pixelFormat: 'yuv420p',
        tempDir: '/tmp/render',
        keepTempFiles: false,
        puppeteerOptions: { headless: true },
        onProgress,
        onFrame,
      };

      expect(options.codec).toBe('libx264');
      expect(options.quality).toBe(23);
      expect(options.includeAudio).toBe(true);
    });

    it('should support different codecs', () => {
      const codecs: VideoRenderOptions['codec'][] = [
        'libx264',
        'libx265',
        'libvpx',
        'libvpx-vp9',
        'prores',
      ];

      codecs.forEach((codec) => {
        const options: VideoRenderOptions = {
          template: mockTemplate,
          outputPath: '/output/video.mp4',
          codec,
        };
        expect(options.codec).toBe(codec);
      });
    });

    it('should support different formats', () => {
      const formats: VideoRenderOptions['format'][] = ['mp4', 'webm', 'mov', 'gif'];

      formats.forEach((format) => {
        const options: VideoRenderOptions = {
          template: mockTemplate,
          outputPath: '/output/video.' + format,
          format,
        };
        expect(options.format).toBe(format);
      });
    });
  });

  describe('ImageRenderOptions', () => {
    it('should define minimal image render options', () => {
      const options: ImageRenderOptions = {
        template: mockTemplate,
        outputPath: '/output/image.png',
      };

      expect(options.template).toBe(mockTemplate);
      expect(options.outputPath).toBe('/output/image.png');
    });

    it('should define full image render options', () => {
      const options: ImageRenderOptions = {
        template: mockTemplate,
        inputs: { title: 'Hello' },
        outputPath: '/output/image.jpeg',
        format: 'jpeg',
        quality: 95,
        frame: 150,
        puppeteerOptions: { headless: true },
      };

      expect(options.format).toBe('jpeg');
      expect(options.quality).toBe(95);
      expect(options.frame).toBe(150);
    });

    it('should support different formats', () => {
      const formats: ImageRenderOptions['format'][] = ['png', 'jpeg', 'webp'];

      formats.forEach((format) => {
        const options: ImageRenderOptions = {
          template: mockTemplate,
          outputPath: '/output/image.' + format,
          format,
        };
        expect(options.format).toBe(format);
      });
    });
  });

  describe('SequenceRenderOptions', () => {
    it('should define minimal sequence render options', () => {
      const options: SequenceRenderOptions = {
        template: mockTemplate,
        outputDir: '/output/frames',
      };

      expect(options.template).toBe(mockTemplate);
      expect(options.outputDir).toBe('/output/frames');
    });

    it('should define full sequence render options', () => {
      const onProgress = (progress: RenderProgress) => {};

      const options: SequenceRenderOptions = {
        template: mockTemplate,
        inputs: { title: 'Hello' },
        outputDir: '/output/frames',
        pattern: 'frame-%06d.png',
        format: 'png',
        quality: 100,
        startFrame: 0,
        endFrame: 150,
        puppeteerOptions: { headless: true },
        onProgress,
      };

      expect(options.pattern).toBe('frame-%06d.png');
      expect(options.startFrame).toBe(0);
      expect(options.endFrame).toBe(150);
    });
  });

  describe('PuppeteerLaunchOptions', () => {
    it('should define puppeteer options', () => {
      const options: PuppeteerLaunchOptions = {
        executablePath: '/path/to/chrome',
        headless: true,
        args: ['--no-sandbox', '--disable-gpu'],
        ignoreDefaultArgs: ['--disable-extensions'],
      };

      expect(options.executablePath).toBe('/path/to/chrome');
      expect(options.headless).toBe(true);
      expect(options.args).toHaveLength(2);
    });
  });

  describe('RenderProgress', () => {
    it('should define render progress with all phases', () => {
      const phases: RenderProgress['phase'][] = [
        'preparing',
        'rendering',
        'encoding',
        'complete',
      ];

      phases.forEach((phase) => {
        const progress: RenderProgress = {
          phase,
          currentFrame: 100,
          totalFrames: 300,
          percent: 33.33,
          elapsed: 10,
        };
        expect(progress.phase).toBe(phase);
      });
    });

    it('should include optional eta and fps', () => {
      const progress: RenderProgress = {
        phase: 'rendering',
        currentFrame: 100,
        totalFrames: 300,
        percent: 33.33,
        eta: 20,
        elapsed: 10,
        fps: 10,
      };

      expect(progress.eta).toBe(20);
      expect(progress.fps).toBe(10);
    });
  });

  describe('RenderResult', () => {
    it('should define successful render result', () => {
      const result: RenderResult = {
        success: true,
        outputPath: '/output/video.mp4',
        duration: 10,
        fileSize: 1024000,
        width: 1920,
        height: 1080,
        frameCount: 300,
        renderTime: 5000,
      };

      expect(result.success).toBe(true);
      expect(result.duration).toBe(10);
      expect(result.frameCount).toBe(300);
    });

    it('should define failed render result', () => {
      const result: RenderResult = {
        success: false,
        outputPath: '/output/video.mp4',
        width: 1920,
        height: 1080,
        renderTime: 100,
        error: 'FFmpeg not found',
      };

      expect(result.success).toBe(false);
      expect(result.error).toBe('FFmpeg not found');
    });
  });

  describe('FFmpegConfig', () => {
    it('should define FFmpeg config', () => {
      const config: FFmpegConfig = {
        ffmpegPath: '/usr/local/bin/ffmpeg',
        ffprobePath: '/usr/local/bin/ffprobe',
      };

      expect(config.ffmpegPath).toBe('/usr/local/bin/ffmpeg');
      expect(config.ffprobePath).toBe('/usr/local/bin/ffprobe');
    });
  });

  describe('NodeRendererOptions', () => {
    it('should define full node renderer options', () => {
      const options: NodeRendererOptions = {
        ffmpeg: {
          ffmpegPath: '/usr/local/bin/ffmpeg',
        },
        puppeteerOptions: {
          headless: true,
        },
        tempDir: '/tmp/rendervid',
      };

      expect(options.ffmpeg?.ffmpegPath).toBe('/usr/local/bin/ffmpeg');
      expect(options.puppeteerOptions?.headless).toBe(true);
      expect(options.tempDir).toBe('/tmp/rendervid');
    });
  });
});
