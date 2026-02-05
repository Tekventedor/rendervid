import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import type { Template, ComponentRegistry } from '@rendervid/core';
import type { PuppeteerLaunchOptions } from './types';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Configuration for the frame capturer
 */
export interface FrameCapturerConfig {
  /** Template to render */
  template: Template;
  /** Input values */
  inputs?: Record<string, unknown>;
  /** Puppeteer launch options */
  puppeteerOptions?: PuppeteerLaunchOptions;
  /** Time to wait after rendering before capturing (ms, default: 50) */
  renderWaitTime?: number;
  /** Custom component registry */
  registry?: ComponentRegistry;
  /** Enable GPU rendering in Puppeteer (default: true) */
  useGPU?: boolean;
}

/**
 * Frame capturer using Puppeteer headless browser
 */
export class FrameCapturer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: FrameCapturerConfig;
  private initialized = false;
  private renderWaitTime: number;
  private useGPU: boolean;
  private gpuFallback = false;

  constructor(config: FrameCapturerConfig) {
    this.config = config;
    this.renderWaitTime = config.renderWaitTime ?? 50;
    this.useGPU = config.useGPU ?? true;
  }

  /**
   * Initialize the browser and page
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const { puppeteerOptions = {} } = this.config;
    const { width, height } = this.config.template.output;

    // Build GPU-related flags based on configuration
    const gpuFlags = this.useGPU && !this.gpuFallback
      ? [
          '--enable-gpu',
          '--use-gl=angle',
        ]
      : [
          '--disable-gpu',
        ];

    try {
      this.browser = await puppeteer.launch({
        headless: puppeteerOptions.headless !== false,
        executablePath: puppeteerOptions.executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          ...gpuFlags,
          '--disable-web-security', // Disable CORS to allow loading external images
          '--disable-features=IsolateOrigins,site-per-process', // Required for --disable-web-security to work
          `--window-size=${width},${height}`,
          ...(puppeteerOptions.args || []),
        ],
        ignoreDefaultArgs: puppeteerOptions.ignoreDefaultArgs,
      });
    } catch (error) {
      // If GPU initialization fails and we haven't already tried fallback, retry without GPU
      if (this.useGPU && !this.gpuFallback) {
        console.error('[FrameCapturer] GPU initialization failed, falling back to software rendering:', error instanceof Error ? error.message : String(error));
        this.gpuFallback = true;
        return this.initialize();
      }
      throw error;
    }

    // Log GPU status
    if (this.useGPU && !this.gpuFallback) {
      console.error('[FrameCapturer] GPU rendering enabled');
    } else if (this.gpuFallback) {
      console.error('[FrameCapturer] GPU rendering disabled (fallback to software rendering)');
    } else {
      console.error('[FrameCapturer] GPU rendering disabled (by configuration)');
    }

    this.page = await this.browser.newPage();

    // Log browser console messages for debugging
    this.page.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warn') {
        console.error(`[Browser ${type}]`, msg.text());
      }
    });

    // Log page errors
    this.page.on('pageerror', error => {
      console.error('[Browser error]', error.message);
    });

    await this.page.setViewport({
      width,
      height,
      deviceScaleFactor: 1,
    });

    // Set up the rendering page with template HTML
    const html = this.generateRenderHTML();
    await this.page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Inject the browser renderer bundle
    await this.injectBrowserRenderer();

    // Wait for renderer to be ready
    await this.page.waitForFunction('window.RENDERVID_READY === true', {
      timeout: 10000,
    });

    // Pre-load all images from the template
    await this.preloadImages();

    this.initialized = true;
  }

  /**
   * Pre-load all media (images, videos, audio) from template
   * Based on Remotion's approach with retry mechanism and proper error handling
   */
  private async preloadImages(): Promise<void> {
    if (!this.page) return;

    const { template } = this.config;
    const mediaUrls: Array<{ url: string; type: 'image' | 'video' | 'audio' }> = [];

    // Extract ALL media URLs from all scenes (images, videos, audio)
    if (template.composition?.scenes) {
      for (const scene of template.composition.scenes) {
        if (scene.layers) {
          for (const layer of scene.layers) {
            if (layer.type === 'image' || layer.type === 'video' || layer.type === 'audio') {
              const src = (layer.props as any)?.src;
              if (src) {
                const url = String(src);
                // Skip data URLs (already embedded)
                if (!url.startsWith('data:') && !mediaUrls.some(m => m.url === url)) {
                  mediaUrls.push({ url, type: layer.type });
                }
              }
            }
          }
        }
      }
    }

    if (mediaUrls.length === 0) return;

    console.error(`[FrameCapturer] Preloading ${mediaUrls.length} media assets...`);

    // Pre-load media with retry mechanism (Remotion-style)
    await this.page.evaluate((media: Array<{ url: string; type: string }>) => {
      return Promise.all(
        media.map(({ url, type }) => {
          return new Promise<void>((resolve, reject) => {
            let retries = 0;
            const maxRetries = 3; // Match Remotion's default

            const attemptLoad = () => {
              if (type === 'image') {
                // @ts-expect-error - Image is available in browser context
                const img = new Image();
                img.crossOrigin = 'anonymous'; // Try CORS first

                img.onload = () => {
                  console.error(`[Preload] ✓ Image loaded: ${url}`);
                  resolve();
                };

                img.onerror = () => {
                  retries++;
                  if (retries <= maxRetries) {
                    // Exponential backoff: 1s, 2s, 4s (Remotion-style)
                    const delay = Math.pow(2, retries - 1) * 1000;
                    console.error(`[Preload] Retry ${retries}/${maxRetries} for ${url} in ${delay}ms`);
                    setTimeout(attemptLoad, delay);
                  } else {
                    console.error(`[Preload] ✗ Failed to load image after ${maxRetries} retries: ${url}`);
                    // Resolve anyway - don't block entire render for one image
                    resolve();
                  }
                };

                img.src = url;
              } else if (type === 'video' || type === 'audio') {
                // @ts-expect-error - Video/Audio available in browser context
                const media = type === 'video' ? document.createElement('video') : document.createElement('audio');
                media.crossOrigin = 'anonymous';
                media.preload = 'auto';

                media.onloadeddata = () => {
                  console.error(`[Preload] ✓ ${type} loaded: ${url}`);
                  resolve();
                };

                media.onerror = () => {
                  retries++;
                  if (retries <= maxRetries) {
                    const delay = Math.pow(2, retries - 1) * 1000;
                    console.error(`[Preload] Retry ${retries}/${maxRetries} for ${url} in ${delay}ms`);
                    setTimeout(attemptLoad, delay);
                  } else {
                    console.error(`[Preload] ✗ Failed to load ${type} after ${maxRetries} retries: ${url}`);
                    resolve();
                  }
                };

                media.src = url;
                media.load();
              }
            };

            attemptLoad();
          });
        })
      );
    }, mediaUrls);

    console.error(`[FrameCapturer] ✓ All media preloaded successfully`);
  }

  /**
   * Generate the HTML for rendering
   */
  private generateRenderHTML(): string {
    const { template, inputs = {}, registry } = this.config;
    const { width, height } = template.output;

    // Serialize template and inputs for the renderer
    const templateJson = JSON.stringify(template);
    const inputsJson = JSON.stringify(inputs);

    // Serialize registry component info (not the actual components, as they need to be injected separately)
    const registryInfo = registry ? JSON.stringify(registry.list().map(c => c.name)) : '[]';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob: file:; img-src * data: blob: file: 'unsafe-inline'; media-src * data: blob: file:;">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      background: #000;
    }
    #root {
      width: ${width}px;
      height: ${height}px;
      position: relative;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    window.RENDERVID_TEMPLATE = ${templateJson};
    window.RENDERVID_INPUTS = ${inputsJson};
    window.RENDERVID_CURRENT_FRAME = 0;
    window.RENDERVID_REGISTRY_COMPONENTS = ${registryInfo};
    window.RENDERVID_CUSTOM_COMPONENTS = {};

    // Render function that will be called for each frame
    window.renderFrame = function(frame) {
      window.RENDERVID_CURRENT_FRAME = frame;
      // This will be handled by the injected renderer code
      if (window.__rendervidRenderFrame) {
        window.__rendervidRenderFrame(frame);
      }
    };

    // Signal that the page is ready
    window.RENDERVID_READY = true;
  </script>
</body>
</html>`;
  }

  /**
   * Inject the browser renderer bundle into the page
   */
  private async injectBrowserRenderer(): Promise<void> {
    if (!this.page) {
      throw new Error('Frame capturer not initialized');
    }

    try {
      // Try multiple potential paths for the bundle
      const possiblePaths = [
        join(__dirname, 'browser-renderer.global.js'),
        join(__dirname, '..', 'dist', 'browser-renderer.global.js'),
        join(process.cwd(), 'node_modules', '@rendervid', 'renderer-node', 'dist', 'browser-renderer.global.js'),
      ];

      let rendererCode: string | null = null;
      let usedPath: string | null = null;

      for (const bundlePath of possiblePaths) {
        try {
          rendererCode = readFileSync(bundlePath, 'utf-8');
          usedPath = bundlePath;
          break;
        } catch {
          // Try next path
          continue;
        }
      }

      if (!rendererCode) {
        throw new Error(
          `Browser renderer bundle not found. Tried paths:\n${possiblePaths.join('\n')}\n` +
          'Make sure to build the package with: pnpm build'
        );
      }

      // Inject the renderer code
      await this.page.addScriptTag({ content: rendererCode });

      // Inject custom components from registry
      await this.injectCustomComponents();

      // Add debugging info to the page
      await this.page.evaluate(`console.error('Browser renderer injected successfully')`);
    } catch (error) {
      throw new Error(
        `Failed to load browser renderer bundle: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Inject custom components from the registry into the page.
   * Note: This requires components to be serializable or pre-bundled.
   * For now, we'll inject component names and the renderer will need to handle them.
   */
  private async injectCustomComponents(): Promise<void> {
    if (!this.page) {
      throw new Error('Frame capturer not initialized');
    }

    const { registry } = this.config;
    if (!registry) {
      return;
    }

    // For Node.js environment, we can't directly serialize React components
    // The components need to be available in the browser bundle or injected as code strings
    // This is a placeholder for future implementation where components can be bundled
    // For now, we'll just make sure the registry info is available
    await this.page.evaluate(`
      (function() {
        // Components will be available through the global RENDERVID_CUSTOM_COMPONENTS
        // This will be populated by the application code that registers components
        console.error('Custom components ready:', window.RENDERVID_REGISTRY_COMPONENTS);
      })();
    `);
  }

  /**
   * Inject custom renderer code into the page (for advanced use cases)
   */
  async injectRenderer(rendererCode: string): Promise<void> {
    if (!this.page) {
      throw new Error('Frame capturer not initialized');
    }

    await this.page.addScriptTag({ content: rendererCode });
  }

  /**
   * Capture a specific frame
   */
  async captureFrame(frame: number): Promise<Buffer> {
    if (!this.page) {
      throw new Error('Frame capturer not initialized');
    }

    // Call the render function for this frame
    await this.page.evaluate((frameNum) => {
      // @ts-expect-error - window extensions are defined in the browser context
      if (window.__rendervidRenderFrame) {
        // @ts-expect-error - window extensions are defined in the browser context
        window.__rendervidRenderFrame(frameNum);
        // @ts-expect-error - window extensions are defined in the browser context
      } else if (window.renderFrame) {
        // Fallback for custom renderer
        // @ts-expect-error - window extensions are defined in the browser context
        window.renderFrame(frameNum);
      }
    }, frame);

    // Wait for React to render, then wait for ALL media to load (Remotion-style)
    await this.page.evaluate(`
      new Promise(async (resolve) => {
        // Wait for React rendering
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

        // Wait for all images in DOM to load
        const images = Array.from(document.querySelectorAll('img'));
        const imagePromises = images.map(img => {
          if (img.complete && img.naturalWidth > 0) {
            return Promise.resolve(); // Already loaded
          }
          return new Promise((resolveImg) => {
            img.onload = () => resolveImg();
            img.onerror = () => {
              console.error('[Frame] Image failed to load:', img.src);
              resolveImg(); // Continue anyway
            };
            // Timeout after 5 seconds per image
            setTimeout(resolveImg, 5000);
          });
        });

        // Wait for all videos in DOM to be ready
        const videos = Array.from(document.querySelectorAll('video'));
        const videoPromises = videos.map(video => {
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
            return Promise.resolve();
          }
          return new Promise((resolveVideo) => {
            video.onloadeddata = () => resolveVideo();
            video.onerror = () => {
              console.error('[Frame] Video failed to load:', video.src);
              resolveVideo();
            };
            setTimeout(resolveVideo, 5000);
          });
        });

        // Wait for all media to load
        await Promise.all([...imagePromises, ...videoPromises]);

        // Additional safety delay
        await new Promise(r => setTimeout(r, ${this.renderWaitTime}));

        resolve();
      })
    `);

    // Take screenshot
    const screenshot = await this.page.screenshot({
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: this.config.template.output.width,
        height: this.config.template.output.height,
      },
    });

    return screenshot as Buffer;
  }

  /**
   * Capture a frame as JPEG
   */
  async captureFrameJpeg(frame: number, quality = 90): Promise<Buffer> {
    if (!this.page) {
      throw new Error('Frame capturer not initialized');
    }

    // Call the render function for this frame
    await this.page.evaluate((frameNum) => {
      // @ts-expect-error - window extensions are defined in the browser context
      if (window.__rendervidRenderFrame) {
        // @ts-expect-error - window extensions are defined in the browser context
        window.__rendervidRenderFrame(frameNum);
        // @ts-expect-error - window extensions are defined in the browser context
      } else if (window.renderFrame) {
        // Fallback for custom renderer
        // @ts-expect-error - window extensions are defined in the browser context
        window.renderFrame(frameNum);
      }
    }, frame);

    // Wait for React to render, then wait for ALL media to load (Remotion-style)
    await this.page.evaluate(`
      new Promise(async (resolve) => {
        // Wait for React rendering
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

        // Wait for all images in DOM to load
        const images = Array.from(document.querySelectorAll('img'));
        const imagePromises = images.map(img => {
          if (img.complete && img.naturalWidth > 0) {
            return Promise.resolve(); // Already loaded
          }
          return new Promise((resolveImg) => {
            img.onload = () => resolveImg();
            img.onerror = () => {
              console.error('[Frame] Image failed to load:', img.src);
              resolveImg(); // Continue anyway
            };
            // Timeout after 5 seconds per image
            setTimeout(resolveImg, 5000);
          });
        });

        // Wait for all videos in DOM to be ready
        const videos = Array.from(document.querySelectorAll('video'));
        const videoPromises = videos.map(video => {
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
            return Promise.resolve();
          }
          return new Promise((resolveVideo) => {
            video.onloadeddata = () => resolveVideo();
            video.onerror = () => {
              console.error('[Frame] Video failed to load:', video.src);
              resolveVideo();
            };
            setTimeout(resolveVideo, 5000);
          });
        });

        // Wait for all media to load
        await Promise.all([...imagePromises, ...videoPromises]);

        // Additional safety delay
        await new Promise(r => setTimeout(r, ${this.renderWaitTime}));

        resolve();
      })
    `);

    // Take screenshot
    const screenshot = await this.page.screenshot({
      type: 'jpeg',
      quality,
      clip: {
        x: 0,
        y: 0,
        width: this.config.template.output.width,
        height: this.config.template.output.height,
      },
    });

    return screenshot as Buffer;
  }

  /**
   * Get the page instance for advanced operations
   */
  getPage(): Page | null {
    return this.page;
  }

  /**
   * Close the browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.initialized = false;
    }
  }
}

/**
 * Create a frame capturer
 */
export function createFrameCapturer(config: FrameCapturerConfig): FrameCapturer {
  return new FrameCapturer(config);
}
