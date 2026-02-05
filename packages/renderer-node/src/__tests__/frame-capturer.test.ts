import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Template } from '@rendervid/core';
import puppeteer from 'puppeteer';

// Mock puppeteer
vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn(),
  },
}));

// Mock fs for browser renderer bundle
vi.mock('fs', () => ({
  readFileSync: vi.fn((path: string) => {
    // Mock the browser renderer bundle
    if (path.includes('browser-renderer.global.js')) {
      return '// Mock browser renderer code\nwindow.__rendervidRenderFrame = () => {};';
    }
    throw new Error(`File not found: ${path}`);
  }),
}));

// Import after mocks are set up
import { createFrameCapturer, FrameCapturer } from '../frame-capturer';

describe('FrameCapturer - GPU Configuration', () => {
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
          endFrame: 30,
          layers: [],
        },
      ],
    },
  };

  let mockPage: any;
  let mockBrowser: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create fresh mocks for each test
    mockPage = {
      setViewport: vi.fn().mockResolvedValue(undefined),
      setContent: vi.fn().mockResolvedValue(undefined),
      addScriptTag: vi.fn().mockResolvedValue(undefined),
      evaluate: vi.fn().mockResolvedValue(undefined),
      waitForFunction: vi.fn().mockResolvedValue(undefined),
      screenshot: vi.fn().mockResolvedValue(Buffer.from('fake-image')),
      on: vi.fn(),
    };

    mockBrowser = {
      newPage: vi.fn().mockResolvedValue(mockPage),
      close: vi.fn().mockResolvedValue(undefined),
    };

    vi.mocked(puppeteer.launch).mockResolvedValue(mockBrowser as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GPU Configuration', () => {
    it('should enable GPU with SwiftShader for WebGL by default', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
      });

      await capturer.initialize();

      expect(puppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.arrayContaining([
            '--enable-gpu',
            '--use-gl=swiftshader',
            '--enable-webgl',
            '--enable-webgl2',
          ]),
        })
      );

      expect(puppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.not.arrayContaining([
            '--disable-gpu',
          ]),
        })
      );

      await capturer.close();
    });

    it('should disable GPU and WebGL when useGPU is false', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: false,
      });

      await capturer.initialize();

      expect(puppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.arrayContaining([
            '--disable-gpu',
            '--disable-webgl',
            '--disable-webgl2',
          ]),
        })
      );

      expect(puppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.not.arrayContaining([
            '--enable-gpu',
            '--use-gl=swiftshader',
          ]),
        })
      );

      await capturer.close();
    });

    it('should explicitly enable GPU with WebGL when useGPU is true', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: true,
      });

      await capturer.initialize();

      expect(puppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.arrayContaining([
            '--enable-gpu',
            '--use-gl=swiftshader',
            '--enable-webgl',
            '--enable-webgl2',
          ]),
        })
      );

      await capturer.close();
    });

    it('should fallback to software rendering on GPU initialization error', async () => {
      // Mock puppeteer to fail on first call (GPU enabled) and succeed on second call (GPU disabled)
      vi.mocked(puppeteer.launch)
        .mockRejectedValueOnce(new Error('GPU initialization failed'))
        .mockResolvedValueOnce(mockBrowser as any);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: true,
      });

      await capturer.initialize();

      // Should have been called twice - first with GPU, then without
      expect(puppeteer.launch).toHaveBeenCalledTimes(2);

      // First call should have GPU enabled with WebGL
      expect(puppeteer.launch).toHaveBeenNthCalledWith(1,
        expect.objectContaining({
          args: expect.arrayContaining([
            '--enable-gpu',
            '--use-gl=swiftshader',
            '--enable-webgl',
            '--enable-webgl2',
          ]),
        })
      );

      // Second call should have GPU disabled (fallback)
      expect(puppeteer.launch).toHaveBeenNthCalledWith(2,
        expect.objectContaining({
          args: expect.arrayContaining([
            '--disable-gpu',
          ]),
        })
      );

      // Should have logged error about fallback (not warn)
      // The code uses console.error for this message

      consoleWarnSpy.mockRestore();
      await capturer.close();
    });

    it('should not retry fallback if GPU is already disabled', async () => {
      vi.mocked(puppeteer.launch).mockRejectedValueOnce(new Error('Initialization failed'));

      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: false,
      });

      await expect(capturer.initialize()).rejects.toThrow('Initialization failed');

      // Should only be called once since GPU was already disabled
      expect(puppeteer.launch).toHaveBeenCalledTimes(1);
    });

    it('should log GPU status on successful initialization', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: true,
      });

      await capturer.initialize();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('GPU rendering enabled')
      );

      consoleErrorSpy.mockRestore();
      await capturer.close();
    });

    it('should log when GPU is disabled by configuration', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: false,
      });

      await capturer.initialize();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('GPU rendering disabled (by configuration)')
      );

      consoleErrorSpy.mockRestore();
      await capturer.close();
    });

    it('should log when GPU fallback occurs', async () => {
      vi.mocked(puppeteer.launch)
        .mockRejectedValueOnce(new Error('GPU error'))
        .mockResolvedValueOnce(mockBrowser as any);

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: true,
      });

      await capturer.initialize();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('GPU rendering disabled (fallback to software rendering)')
      );

      consoleErrorSpy.mockRestore();
      await capturer.close();
    });
  });

  describe('Backward Compatibility', () => {
    it('should work with existing code that does not specify useGPU', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
        inputs: { title: 'Test' },
        renderWaitTime: 100,
      });

      await capturer.initialize();

      // Should default to GPU enabled with WebGL support
      expect(puppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.arrayContaining([
            '--enable-gpu',
            '--use-gl=swiftshader',
            '--enable-webgl',
            '--enable-webgl2',
          ]),
        })
      );

      expect(capturer.getPage()).not.toBeNull();
      await capturer.close();
    });

    it('should maintain all existing configuration options', async () => {
      const customArgs = ['--custom-arg'];
      const capturer = createFrameCapturer({
        template: mockTemplate,
        inputs: { title: 'Test' },
        puppeteerOptions: {
          headless: false,
          executablePath: '/custom/chrome',
          args: customArgs,
        },
        renderWaitTime: 200,
      });

      await capturer.initialize();

      expect(puppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          headless: false,
          executablePath: '/custom/chrome',
          args: expect.arrayContaining(customArgs),
        })
      );

      await capturer.close();
    });

    it('should preserve standard browser flags', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
      });

      await capturer.initialize();

      // Should include standard flags
      expect(puppeteer.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.arrayContaining([
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            `--window-size=${mockTemplate.output.width},${mockTemplate.output.height}`,
          ]),
        })
      );

      await capturer.close();
    });
  });

  describe('Frame Capture', () => {
    it('should capture frames correctly with GPU enabled', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: true,
      });

      await capturer.initialize();
      const buffer = await capturer.captureFrame(0);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(mockPage.evaluate).toHaveBeenCalled();
      expect(mockPage.screenshot).toHaveBeenCalled();

      await capturer.close();
    });

    it('should capture frames correctly with GPU disabled', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: false,
      });

      await capturer.initialize();
      const buffer = await capturer.captureFrame(0);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(mockPage.evaluate).toHaveBeenCalled();
      expect(mockPage.screenshot).toHaveBeenCalled();

      await capturer.close();
    });

    it('should capture JPEG frames with GPU enabled', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: true,
      });

      await capturer.initialize();
      const buffer = await capturer.captureFrameJpeg(0, 80);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(mockPage.screenshot).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'jpeg',
          quality: 80,
        })
      );

      await capturer.close();
    });
  });

  describe('Cleanup', () => {
    it('should close browser properly after GPU initialization', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: true,
      });

      await capturer.initialize();
      await capturer.close();

      expect(mockBrowser.close).toHaveBeenCalled();
      expect(capturer.getPage()).toBeNull();
    });

    it('should close browser properly after GPU fallback', async () => {
      vi.mocked(puppeteer.launch)
        .mockRejectedValueOnce(new Error('GPU error'))
        .mockResolvedValueOnce(mockBrowser as any);

      vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});

      const capturer = createFrameCapturer({
        template: mockTemplate,
        useGPU: true,
      });

      await capturer.initialize();
      await capturer.close();

      expect(mockBrowser.close).toHaveBeenCalled();
      expect(capturer.getPage()).toBeNull();
    });

    it('should handle double initialization gracefully', async () => {
      const capturer = createFrameCapturer({
        template: mockTemplate,
      });

      await capturer.initialize();
      await capturer.initialize(); // Second call should be no-op

      // Should only launch once
      expect(puppeteer.launch).toHaveBeenCalledTimes(1);

      await capturer.close();
    });
  });
});
