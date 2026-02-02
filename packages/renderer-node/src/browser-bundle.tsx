/**
 * Browser bundle for rendering templates in Puppeteer
 * This code gets injected into the headless browser page
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { TemplateRenderer } from '@rendervid/renderer-browser';
import type { Template } from '@rendervid/core';

// Extend window interface
declare global {
  interface Window {
    RENDERVID_TEMPLATE: Template;
    RENDERVID_INPUTS: Record<string, unknown>;
    RENDERVID_CURRENT_FRAME: number;
    RENDERVID_READY: boolean;
    __rendervidRenderFrame: (frame: number) => void;
    __rendervidRoot: ReturnType<typeof createRoot> | null;
  }
}

// Initialize the renderer when the script loads
(function initRenderer() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  // Create React root
  const root = createRoot(rootElement);
  window.__rendervidRoot = root;

  // Set up the render function
  window.__rendervidRenderFrame = function(frame: number) {
    window.RENDERVID_CURRENT_FRAME = frame;

    const template = window.RENDERVID_TEMPLATE;
    const inputs = window.RENDERVID_INPUTS || {};

    if (!template?.composition?.scenes) {
      console.error('Invalid template');
      return;
    }

    const { width, height, fps = 30 } = template.output;

    // Render the template at the current frame
    root.render(
      <React.StrictMode>
        <TemplateRenderer
          scenes={template.composition.scenes}
          frame={frame}
          fps={fps}
          width={width}
          height={height}
          isPlaying={false}
        />
      </React.StrictMode>
    );
  };

  // Signal that the renderer is ready
  window.RENDERVID_READY = true;

  // Render initial frame
  if (window.RENDERVID_CURRENT_FRAME !== undefined) {
    window.__rendervidRenderFrame(window.RENDERVID_CURRENT_FRAME);
  }
})();
