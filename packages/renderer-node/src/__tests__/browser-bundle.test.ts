/**
 * Browser Bundle Tests
 *
 * Tests for the browser bundle module that gets injected into Puppeteer.
 * Since the browser-bundle.tsx relies on DOM/browser APIs (React, createRoot, etc.),
 * we test the structural aspects and exports that are testable in a node environment.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Browser Bundle', () => {
  const bundlePath = path.resolve(__dirname, '../browser-bundle.tsx');

  describe('File structure', () => {
    it('should exist as a source file', () => {
      expect(fs.existsSync(bundlePath)).toBe(true);
    });

    it('should contain React imports', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain("import React from 'react'");
      expect(content).toContain("import { createRoot } from 'react-dom/client'");
    });

    it('should import TemplateRenderer from browser renderer', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain("import { TemplateRenderer } from '@rendervid/renderer-browser'");
    });

    it('should import core types', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain("import type { Template } from '@rendervid/core'");
      expect(content).toContain("import { getDefaultRegistry } from '@rendervid/core'");
    });

    it('should import custom components from @rendervid/components', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain("from '@rendervid/components'");
      expect(content).toContain('AuroraBackground');
      expect(content).toContain('WaveBackground');
      expect(content).toContain('ParticleSystem');
      expect(content).toContain('GlitchEffect');
      expect(content).toContain('ThreeScene');
      expect(content).toContain('LottieAnimation');
      expect(content).toContain('SVGDrawing');
      expect(content).toContain('TypewriterEffect');
      expect(content).toContain('MetaBalls');
    });

    it('should import text animation components', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('BlurText');
      expect(content).toContain('WaveText');
      expect(content).toContain('StaggerText');
      expect(content).toContain('RevealText');
      expect(content).toContain('BounceText');
      expect(content).toContain('SplitText');
      expect(content).toContain('ShinyText');
      expect(content).toContain('ScrambleText');
      expect(content).toContain('FlipText');
      expect(content).toContain('FuzzyText');
      expect(content).toContain('NeonText');
      expect(content).toContain('TextTrail');
      expect(content).toContain('LetterMorph');
      expect(content).toContain('MorphText');
      expect(content).toContain('DistortText');
    });
  });

  describe('Window interface declarations', () => {
    it('should declare RENDERVID_TEMPLATE on window', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('RENDERVID_TEMPLATE');
    });

    it('should declare RENDERVID_INPUTS on window', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('RENDERVID_INPUTS');
    });

    it('should declare RENDERVID_CURRENT_FRAME on window', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('RENDERVID_CURRENT_FRAME');
    });

    it('should declare RENDERVID_READY on window', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('RENDERVID_READY');
    });

    it('should declare RENDERVID_WEBGL_AVAILABLE on window', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('RENDERVID_WEBGL_AVAILABLE');
    });

    it('should declare __rendervidRenderFrame on window', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('__rendervidRenderFrame');
    });

    it('should declare __rendervidRoot on window', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('__rendervidRoot');
    });
  });

  describe('WebGL availability check', () => {
    it('should define checkWebGLAvailability function', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('function checkWebGLAvailability');
    });

    it('should check for webgl2, webgl, and experimental-webgl contexts', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain("'webgl2'");
      expect(content).toContain("'webgl'");
      expect(content).toContain("'experimental-webgl'");
    });

    it('should check for WEBGL_debug_renderer_info extension', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('WEBGL_debug_renderer_info');
    });
  });

  describe('Component registration', () => {
    it('should register background components', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain("registry.register('AuroraBackground'");
      expect(content).toContain("registry.register('WaveBackground'");
    });

    it('should register effect components', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain("registry.register('ParticleSystem'");
      expect(content).toContain("registry.register('GlitchEffect'");
      expect(content).toContain("registry.register('ThreeScene'");
      expect(content).toContain("registry.register('LottieAnimation'");
      expect(content).toContain("registry.register('SVGDrawing'");
      expect(content).toContain("registry.register('TypewriterEffect'");
      expect(content).toContain("registry.register('MetaBalls'");
    });

    it('should register text animation components', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain("registry.register('BlurText'");
      expect(content).toContain("registry.register('WaveText'");
      expect(content).toContain("registry.register('StaggerText'");
      expect(content).toContain("registry.register('RevealText'");
      expect(content).toContain("registry.register('BounceText'");
      expect(content).toContain("registry.register('SplitText'");
      expect(content).toContain("registry.register('ShinyText'");
      expect(content).toContain("registry.register('ScrambleText'");
      expect(content).toContain("registry.register('FlipText'");
      expect(content).toContain("registry.register('FuzzyText'");
      expect(content).toContain("registry.register('NeonText'");
      expect(content).toContain("registry.register('TextTrail'");
      expect(content).toContain("registry.register('LetterMorph'");
      expect(content).toContain("registry.register('MorphText'");
      expect(content).toContain("registry.register('DistortText'");
    });
  });

  describe('Render function', () => {
    it('should define the render frame function', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('window.__rendervidRenderFrame = function(frame: number)');
    });

    it('should use React.StrictMode for rendering', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('React.StrictMode');
    });

    it('should render TemplateRenderer with required props', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('<TemplateRenderer');
      expect(content).toContain('scenes={');
      expect(content).toContain('frame={');
      expect(content).toContain('fps={');
      expect(content).toContain('width={');
      expect(content).toContain('height={');
      expect(content).toContain('registry={');
    });

    it('should check for Three.js layers and WebGL availability', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('hasThreeLayers');
      expect(content).toContain("layer.type === 'three'");
      expect(content).toContain('RENDERVID_WEBGL_AVAILABLE');
    });
  });

  describe('Custom component support', () => {
    it('should handle inline custom components from template', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('customComponents');
      expect(content).toContain("def.type === 'inline'");
      expect(content).toContain('def.code');
    });
  });

  describe('React Three Fiber compatibility', () => {
    it('should set React as a global for React Three Fiber', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('(window as any).React = React');
    });

    it('should handle ReactCurrentBatchConfig for React 19 compat', () => {
      const content = fs.readFileSync(bundlePath, 'utf-8');
      expect(content).toContain('ReactCurrentBatchConfig');
    });
  });
});
