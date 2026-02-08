import type { Template } from '@rendervid/core';

/**
 * Simplified frame renderer for cloud functions
 *
 * This is adapted from renderer-node's FrameCapturer but optimized for
 * serverless environments (Lambda, Azure Functions, Cloud Functions).
 *
 * Key differences:
 * - Uses chromium from Lambda layers or container images
 * - Simplified initialization (no font loading or custom components)
 * - Focus on performance and reliability
 */
export interface FrameRendererConfig {
  /** Template to render */
  template: Template;

  /** Input values */
  inputs?: Record<string, unknown>;

  /** Time to wait after rendering before capturing (ms, default: 50) */
  renderWaitTime?: number;

  /** Enable GPU rendering (default: false in cloud environments) */
  useGPU?: boolean;

  /** Chromium executable path (from layer or container) */
  executablePath?: string;
}

/**
 * Frame renderer interface for cloud backends to implement
 *
 * Each cloud provider (AWS, Azure, GCP) will provide its own implementation
 * based on how Chromium is packaged (Lambda layers, containers, etc.)
 */
export interface IFrameRenderer {
  /**
   * Initialize the browser and page
   */
  initialize(): Promise<void>;

  /**
   * Capture a specific frame as PNG buffer
   */
  captureFrame(frame: number): Promise<Buffer>;

  /**
   * Capture a specific frame as JPEG buffer
   */
  captureFrameJpeg(frame: number, quality?: number): Promise<Buffer>;

  /**
   * Close the browser and clean up resources
   */
  close(): Promise<void>;
}

/**
 * Generate HTML for rendering in headless browser
 */
export function generateRenderHTML(
  template: Template,
  inputs: Record<string, unknown> = {}
): string {
  const { width, height } = template.output;

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
    window.RENDERVID_READY = false;

    // Render function that will be called for each frame
    window.renderFrame = function(frame) {
      window.RENDERVID_CURRENT_FRAME = frame;
      if (window.__rendervidRenderFrame) {
        window.__rendervidRenderFrame(frame);
      }
    };
  </script>
</body>
</html>`;
}

/**
 * Validate template before rendering (fail fast)
 */
export function validateTemplate(template: Template): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!template.output) {
    errors.push('Template missing output configuration');
  } else {
    if (!template.output.width || !template.output.height) {
      errors.push('Template missing output width/height');
    }
    if (!template.output.fps) {
      errors.push('Template missing output fps');
    }
    if (!template.output.duration) {
      errors.push('Template missing output duration');
    }
  }

  if (!template.composition?.scenes || template.composition.scenes.length === 0) {
    errors.push('Template has no scenes');
  }

  // Validate scenes
  if (template.composition?.scenes) {
    for (let i = 0; i < template.composition.scenes.length; i++) {
      const scene = template.composition.scenes[i];
      if (scene.startFrame === undefined || scene.endFrame === undefined) {
        errors.push(`Scene ${i} missing startFrame or endFrame`);
      }
      if (!scene.layers || scene.layers.length === 0) {
        errors.push(`Scene ${i} has no layers`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate total frames from template
 */
export function calculateTotalFrames(template: Template): number {
  const { duration, fps } = template.output;
  if (!duration || !fps) {
    throw new Error('Template output must have duration and fps');
  }
  return Math.ceil(duration * fps);
}

/**
 * Get browser launch arguments for cloud environments
 */
export function getCloudBrowserArgs(width: number, height: number): string[] {
  return [
    // Stability flags
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-sandbox',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',

    // Disable GPU (safer in cloud)
    '--disable-gpu',
    '--disable-webgl',
    '--disable-webgl2',

    // Performance
    '--disable-blink-features=AutomationControlled',
    '--ignore-gpu-blocklist',

    // Window size
    `--window-size=${width},${height}`,
  ];
}
