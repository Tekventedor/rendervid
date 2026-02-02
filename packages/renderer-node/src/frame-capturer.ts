import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import type { Template } from '@rendervid/core';
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
        `--window-size=${width},${height}`,
        ...(puppeteerOptions.args || []),
      ],
      ignoreDefaultArgs: puppeteerOptions.ignoreDefaultArgs,
    });

    this.page = await this.browser.newPage();
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

    this.initialized = true;
  }

  /**
   * Generate the HTML for rendering
   */
  private generateRenderHTML(): string {
    const { template, inputs = {} } = this.config;
    const { width, height } = template.output;

    // Serialize template and inputs for the renderer
    const templateJson = JSON.stringify(template);
    const inputsJson = JSON.stringify(inputs);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

      // Add debugging info to the page
      await this.page.evaluate(`console.log('Browser renderer injected successfully')`);
    } catch (error) {
      throw new Error(
        `Failed to load browser renderer bundle: ${error instanceof Error ? error.message : String(error)}`
      );
    }
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
