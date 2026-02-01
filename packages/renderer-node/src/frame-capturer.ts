import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import type { Template } from '@rendervid/core';
import type { PuppeteerLaunchOptions } from './types';

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
}

/**
 * Frame capturer using Puppeteer headless browser
 */
export class FrameCapturer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: FrameCapturerConfig;
  private initialized = false;

  constructor(config: FrameCapturerConfig) {
    this.config = config;
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
   * Inject the renderer code into the page
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
    await this.page.evaluate(`
      if (window.renderFrame) {
        window.renderFrame(${frame});
      }
    `);

    // Wait a tick for React to render
    await this.page.evaluate(`new Promise((r) => requestAnimationFrame(() => r()))`);

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
    await this.page.evaluate(`
      if (window.renderFrame) {
        window.renderFrame(${frame});
      }
    `);

    // Wait a tick for React to render
    await this.page.evaluate(`new Promise((r) => requestAnimationFrame(() => r()))`);

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
