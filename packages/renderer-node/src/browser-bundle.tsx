/**
 * Browser bundle for rendering templates in Puppeteer
 * This code gets injected into the headless browser page
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { TemplateRenderer } from '@rendervid/renderer-browser';
import type { Template } from '@rendervid/core';
import { getDefaultRegistry } from '@rendervid/core';

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
