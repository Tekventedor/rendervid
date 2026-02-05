/**
 * Browser bundle for rendering templates in Puppeteer
 * This code gets injected into the headless browser page
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { TemplateRenderer } from '@rendervid/renderer-browser';
import type { Template } from '@rendervid/core';
import { getDefaultRegistry } from '@rendervid/core';

// Fix React Three Fiber compatibility with bundled React
// React Three Fiber needs access to React internals
if (typeof window !== 'undefined') {
  // Ensure React is available globally for React Three Fiber
  (window as any).React = React;

  // Ensure React internals are accessible
  if (React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    const internals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as any;

    // Add ReactCurrentBatchConfig if missing (React 19 compatibility)
    if (!internals.ReactCurrentBatchConfig) {
      internals.ReactCurrentBatchConfig = { transition: null };
    }
  }
}

// Import all custom components from @rendervid/components
import {
  AuroraBackground,
  WaveBackground,
  ParticleSystem,
  GlitchEffect,
  ThreeScene,
  LottieAnimation,
  SVGDrawing,
  TypewriterEffect,
  MetaBalls,
  BlurText,
  WaveText,
  StaggerText,
  RevealText,
  BounceText,
  SplitText,
  ShinyText,
  ScrambleText,
  FlipText,
  FuzzyText,
  NeonText,
  TextTrail,
  LetterMorph,
  MorphText,
  DistortText,
} from '@rendervid/components';

// Extend window interface
declare global {
  interface Window {
    RENDERVID_TEMPLATE: Template;
    RENDERVID_INPUTS: Record<string, unknown>;
    RENDERVID_CURRENT_FRAME: number;
    RENDERVID_READY: boolean;
    RENDERVID_WEBGL_AVAILABLE: boolean;
    __rendervidRenderFrame: (frame: number) => void;
    __rendervidRoot: ReturnType<typeof createRoot> | null;
  }
}

/**
 * Check if WebGL is available in the current browser context.
 * This is critical for Three.js rendering.
 */
function checkWebGLAvailability(): boolean {
  console.error('[WebGL] Starting WebGL availability check...');

  try {
    console.error('[WebGL] Creating canvas element...');
    const canvas = document.createElement('canvas');
    console.error('[WebGL] Canvas created successfully');

    console.error('[WebGL] Attempting to get WebGL context...');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    console.error('[WebGL] Context result:', gl ? 'SUCCESS' : 'NULL');

    if (!gl) {
      console.error('[WebGL] WebGL context not available');
      return false;
    }

    // Log WebGL info for debugging
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      console.error('[WebGL] Renderer:', renderer);
    }

    console.error('[WebGL] WebGL is available');
    return true;
  } catch (error) {
    console.error('[WebGL] Error checking WebGL availability:', error);
    return false;
  }
}

// Initialize the renderer when the script loads
console.error('[BrowserBundle] Script loaded, starting initialization...');

(function initRenderer() {
  console.error('[BrowserBundle] IIFE executing...');
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('[BrowserBundle] Root element not found!');
    return;
  }
  console.error('[BrowserBundle] Root element found, checking WebGL...');

  // Check WebGL availability for Three.js rendering
  window.RENDERVID_WEBGL_AVAILABLE = checkWebGLAvailability();
  console.error('[BrowserBundle] WebGL check complete, result:', window.RENDERVID_WEBGL_AVAILABLE);

  // Get the default registry and register all custom components
  const registry = getDefaultRegistry();

  // Register background components
  registry.register('AuroraBackground', AuroraBackground as never);
  registry.register('WaveBackground', WaveBackground as never);

  // Register effect components
  registry.register('ParticleSystem', ParticleSystem as never);
  registry.register('GlitchEffect', GlitchEffect as never);
  registry.register('ThreeScene', ThreeScene as never);
  registry.register('LottieAnimation', LottieAnimation as never);
  registry.register('SVGDrawing', SVGDrawing as never);
  registry.register('TypewriterEffect', TypewriterEffect as never);
  registry.register('MetaBalls', MetaBalls as never);

  // Register text animation components
  registry.register('BlurText', BlurText as never);
  registry.register('WaveText', WaveText as never);
  registry.register('StaggerText', StaggerText as never);
  registry.register('RevealText', RevealText as never);
  registry.register('BounceText', BounceText as never);
  registry.register('SplitText', SplitText as never);
  registry.register('ShinyText', ShinyText as never);
  registry.register('ScrambleText', ScrambleText as never);
  registry.register('FlipText', FlipText as never);
  registry.register('FuzzyText', FuzzyText as never);
  registry.register('NeonText', NeonText as never);
  registry.register('TextTrail', TextTrail as never);
  registry.register('LetterMorph', LetterMorph as never);
  registry.register('MorphText', MorphText as never);
  registry.register('DistortText', DistortText as never);

  console.log('Registered custom components:', registry.list().map(c => c.name));

  // Process inline custom components from template
  const template = window.RENDERVID_TEMPLATE;
  if (template?.customComponents) {
    Object.entries(template.customComponents).forEach(([name, def]: [string, any]) => {
      if (def.type === 'inline' && def.code) {
        try {
          // Create component from inline code
          // The code string should define a function that returns a React element
          // eslint-disable-next-line no-new-func
          const componentFn = new Function('React', 'props', `return (${def.code})(props)`);
          const Component = (props: any) => componentFn(React, props);
          registry.register(name, Component as never);
          console.log(`Registered inline custom component: ${name}`);
        } catch (error) {
          console.error(`Failed to register inline component ${name}:`, error);
        }
      }
    });
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

    // Check if template uses Three.js layers
    const hasThreeLayers = template.composition.scenes.some(scene =>
      scene.layers?.some(layer => layer.type === 'three')
    );

    if (hasThreeLayers && !window.RENDERVID_WEBGL_AVAILABLE) {
      console.error('[Render] Template contains Three.js layers but WebGL is not available');
      console.error('[Render] Three.js layers will not render correctly');
    }

    // Render the template at the current frame with the registry
    root.render(
      <React.StrictMode>
        <TemplateRenderer
          scenes={template.composition.scenes}
          frame={frame}
          fps={fps}
          width={width}
          height={height}
          isPlaying={false}
          registry={registry}
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
