import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { Template } from '@rendervid/core';

// Mock fs for browser renderer bundle
vi.mock('fs', () => ({
  readFileSync: vi.fn((path: string) => {
    // Mock the browser renderer bundle
    if (path.includes('browser-renderer.global.js')) {
      return '// Mock browser renderer code\nwindow.__rendervidRenderFrame = () => {};';
    }
    throw new Error(`File not found: ${path}`);
  }),
  promises: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
    stat: vi.fn().mockResolvedValue({ size: 1024 }),
  },
}));

// Properly mock fluent-ffmpeg
vi.mock('fluent-ffmpeg', () => {
  const mockFfmpeg: any = vi.fn().mockReturnValue({
    input: vi.fn().mockReturnThis(),
    inputFPS: vi.fn().mockReturnThis(),
    videoCodec: vi.fn().mockReturnThis(),
    audioCodec: vi.fn().mockReturnThis(),
    audioBitrate: vi.fn().mockReturnThis(),
    outputOptions: vi.fn().mockReturnThis(),
    size: vi.fn().mockReturnThis(),
    output: vi.fn().mockReturnThis(),
    complexFilter: vi.fn().mockReturnThis(),
    on: vi.fn().mockImplementation(function (this: any, event: string, callback: any) {
      if (event === 'end') {
        setTimeout(() => callback(), 0);
      }
      return this;
    }),
    run: vi.fn(),
  });

  mockFfmpeg.setFfmpegPath = vi.fn();
  mockFfmpeg.setFfprobePath = vi.fn();
  mockFfmpeg.ffprobe = vi.fn((path: string, callback: any) => {
    callback(null, { format: { duration: 10 } });
  });
  mockFfmpeg.getAvailableFormats = vi.fn((callback: any) => callback(null));

  return { default: mockFfmpeg };
});

// Properly mock puppeteer
vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        setViewport: vi.fn().mockResolvedValue(undefined),
        setContent: vi.fn().mockResolvedValue(undefined),
        addScriptTag: vi.fn().mockResolvedValue(undefined),
        evaluate: vi.fn().mockResolvedValue(undefined),
        waitForFunction: vi.fn().mockResolvedValue(undefined),
        screenshot: vi.fn().mockResolvedValue(Buffer.from('fake-image')),
        on: vi.fn(), // Add the 'on' method for event listeners
      }),
      close: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

// Import after mocks are set up
import { NodeRenderer, createNodeRenderer } from '../NodeRenderer';
import { createFrameCapturer, FrameCapturer } from '../frame-capturer';
import { createFFmpegEncoder, FFmpegEncoder } from '../ffmpeg-encoder';

describe('NodeRenderer', () => {
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
          endFrame: 90,
          layers: [
            {
              id: 'text-1',
              type: 'text',
              position: { x: 100, y: 100 },
              size: { width: 800, height: 100 },
              props: {
                text: 'Hello World',
                fontSize: 48,
              },
            },
          ],
        },
      ],
    },
  };

  describe('createNodeRenderer', () => {
    it('should create a NodeRenderer instance', () => {
      const renderer = createNodeRenderer();
      expect(renderer).toBeInstanceOf(NodeRenderer);
    });

    it('should accept options', () => {
      const renderer = createNodeRenderer({
        ffmpeg: {
          ffmpegPath: '/custom/ffmpeg',
        },
        tempDir: '/custom/temp',
      });
      expect(renderer).toBeInstanceOf(NodeRenderer);
    });
  });

  describe('checkAvailability', () => {
    it('should check FFmpeg and Puppeteer availability', async () => {
      const renderer = createNodeRenderer();
      const availability = await renderer.checkAvailability();

      expect(availability).toHaveProperty('ffmpeg');
      expect(availability).toHaveProperty('puppeteer');
      expect(typeof availability.ffmpeg).toBe('boolean');
      expect(typeof availability.puppeteer).toBe('boolean');
    });
  });

  describe('renderImage', () => {
    it('should attempt to render a single frame as an image', async () => {
      const renderer = createNodeRenderer();

      const result = await renderer.renderImage({
        template: mockTemplate,
        outputPath: '/output/frame.png',
        frame: 0,
      });

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('outputPath');
      expect(result).toHaveProperty('width', 1920);
      expect(result).toHaveProperty('height', 1080);
      expect(result).toHaveProperty('renderTime');
    });
  });
});

describe('FrameCapturer', () => {
  const mockTemplate: Template = {
    name: 'Test Template',
    output: {
      type: 'video',
      width: 800,
      height: 600,
      fps: 30,
    },
    inputs: [],
    composition: {
      scenes: [
        {
          id: 'scene-1',
          startFrame: 0,
          endFrame: 30,
          layers: [],
        },
      ],
    },
  };

  it('should create a frame capturer', () => {
    const capturer = createFrameCapturer({
      template: mockTemplate,
    });
    expect(capturer).toBeInstanceOf(FrameCapturer);
  });

  it('should initialize with template config', async () => {
    const capturer = createFrameCapturer({
      template: mockTemplate,
      inputs: { title: 'Test' },
    });

    await capturer.initialize();
    expect(capturer.getPage()).not.toBeNull();
    await capturer.close();
  });

  it('should capture frames as buffers', async () => {
    const capturer = createFrameCapturer({
      template: mockTemplate,
    });

    await capturer.initialize();
    const buffer = await capturer.captureFrame(0);
    expect(buffer).toBeInstanceOf(Buffer);
    await capturer.close();
  });

  it('should close cleanly', async () => {
    const capturer = createFrameCapturer({
      template: mockTemplate,
    });

    await capturer.initialize();
    await capturer.close();
    expect(capturer.getPage()).toBeNull();
  });
});

describe('FFmpegEncoder', () => {
  it('should create an FFmpeg encoder', () => {
    const encoder = createFFmpegEncoder();
    expect(encoder).toBeInstanceOf(FFmpegEncoder);
  });

  it('should accept custom paths', () => {
    const encoder = createFFmpegEncoder({
      ffmpegPath: '/custom/ffmpeg',
      ffprobePath: '/custom/ffprobe',
    });
    expect(encoder).toBeInstanceOf(FFmpegEncoder);
  });

  it('should check FFmpeg availability', async () => {
    const encoder = createFFmpegEncoder();
    const available = await encoder.checkFFmpeg();
    expect(typeof available).toBe('boolean');
  });
});
