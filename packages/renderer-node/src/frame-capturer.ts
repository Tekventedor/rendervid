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

  constructor(config: FrameCapturerConfig) {
    this.config = config;
    this.renderWaitTime = config.renderWaitTime ?? 50;
  }

  /**
   * Initialize the browser and page
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const { puppeteerOptions = {} } = this.config;
    const { width, height } = this.config.template.output;

    this.browser = await puppeteer.launch({
      headless: puppeteerOptions.headless !== false,
      executablePath: puppeteerOptions.executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security', // Disable CORS to allow loading external images
        '--disable-features=IsolateOrigins,site-per-process', // Required for --disable-web-security to work
        `--window-size=${width},${height}`,
        ...(puppeteerOptions.args || []),
      ],
      ignoreDefaultArgs: puppeteerOptions.ignoreDefaultArgs,
    });

    this.page = await this.browser.newPage();

    // Log browser console messages for debugging
    this.page.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warn') {
        console.log(`[Browser ${type}]`, msg.text());
      }
    });

    // Log page errors
    this.page.on('pageerror', error => {
      console.log('[Browser error]', error.message);
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
   * Pre-load all image URLs from the template to avoid loading delays during frame capture
   */
  private async preloadImages(): Promise<void> {
    if (!this.page) return;

    const { template } = this.config;
    const imageUrls: string[] = [];

    // Extract all image URLs from all scenes
    if (template.composition?.scenes) {
      for (const scene of template.composition.scenes) {
        if (scene.layers) {
          for (const layer of scene.layers) {
            if (layer.type === 'image' && layer.props?.src) {
              const src = String(layer.props.src);
              if (!imageUrls.includes(src)) {
                imageUrls.push(src);
              }
            }
          }
        }
      }
    }

    if (imageUrls.length === 0) return;

    // Pre-load images in the browser
    await this.page.evaluate((urls: string[]) => {
      return Promise.all(
        urls.map(url => {
          return new Promise<void>((resolve) => {
            // @ts-expect-error - Image is available in browser context, not Node.js
            const img = new Image();
            // Don't set crossOrigin to avoid CORS issues with null origin
            img.onload = () => resolve();
            img.onerror = () => {
              console.warn(`Failed to preload image: ${url}`);
              resolve(); // Don't fail the whole process if one image fails
            };
            img.src = url;
          });
        })
      );
    }, imageUrls);
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
  <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; img-src * data: blob: 'unsafe-inline';">
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
      await this.page.evaluate(`console.log('Browser renderer injected successfully')`);
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
        console.log('Custom components ready:', window.RENDERVID_REGISTRY_COMPONENTS);
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

    // Wait for React to complete rendering
    // Use string template to avoid TypeScript type-checking browser APIs
    await this.page.evaluate(`
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, ${this.renderWaitTime});
          });
        });
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

    // Wait for React to complete rendering
    // Use string template to avoid TypeScript type-checking browser APIs
    await this.page.evaluate(`
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, ${this.renderWaitTime});
          });
        });
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
