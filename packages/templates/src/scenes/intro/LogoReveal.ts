import type { Template, Layer, ImageLayer, ShapeLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Logo Reveal scene
 */
export interface LogoRevealInputs extends BaseSceneInputs {
  logoUrl: string;
  brandName?: string;
  tagline?: string;
  style?: 'minimal' | 'particles' | 'glitch' | 'zoom';
}

/**
 * Logo Reveal - Animated logo entrance with various styles
 */
export const LogoReveal: SceneTemplate<LogoRevealInputs> = {
  id: 'logo-reveal',
  name: 'Logo Reveal',
  description: 'Stunning logo reveal animation with multiple style options.',
  category: 'logo-reveal',
  tags: ['logo', 'intro', 'brand', 'reveal', 'animation'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 3,
  defaultTheme: 'modern',
  inputs: [
    { key: 'logoUrl', type: 'image', label: 'Logo Image', required: true },
    { key: 'brandName', type: 'string', label: 'Brand Name' },
    { key: 'tagline', type: 'string', label: 'Tagline' },
    {
      key: 'style',
      type: 'select',
      label: 'Animation Style',
      options: [
        { value: 'minimal', label: 'Minimal' },
        { value: 'particles', label: 'Particles' },
        { value: 'glitch', label: 'Glitch' },
        { value: 'zoom', label: 'Zoom' },
      ],
      default: 'minimal',
    },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
  ],
  defaults: {
    logoUrl: '',
    brandName: '',
    tagline: '',
    style: 'minimal',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 3) * fps;
    const style = inputs.style || 'minimal';

    const bgColor = inputs.backgroundColor || theme.colors.background;
    const layers: Layer[] = [];

    // Background
    layers.push({
      id: 'background',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width, height },
      props: { shape: 'rectangle', fill: bgColor },
    } as ShapeLayer);

    // Glow effect behind logo
    if (style !== 'minimal') {
      layers.push({
        id: 'glow',
        type: 'shape',
        position: { x: width / 2 - 150, y: height / 2 - 150 },
        size: { width: 300, height: 300 },
        opacity: 0.3,
        props: {
          shape: 'ellipse',
          gradient: {
            type: 'radial',
            colors: [
              { offset: 0, color: theme.colors.primary },
              { offset: 1, color: 'transparent' },
            ],
          },
        },
        animations: [
          {
            type: 'entrance',
            effect: 'scaleIn',
            delay: 0,
            duration: Math.floor(fps * 0.8),
            easing: 'easeOutExpo',
          },
        ],
      } as ShapeLayer);
    }

    // Logo
    const logoSize = Math.min(width, height) * 0.25;
    const logoAnimations: any[] = [];

    switch (style) {
      case 'zoom':
        logoAnimations.push({
          type: 'entrance',
          effect: 'zoomIn',
          delay: 0,
          duration: Math.floor(fps * 0.6),
          easing: 'easeOutBack',
        });
        break;
      case 'glitch':
        logoAnimations.push({
          type: 'entrance',
          effect: 'fadeIn',
          delay: 0,
          duration: Math.floor(fps * 0.3),
        });
        logoAnimations.push({
          type: 'emphasis',
          effect: 'shake',
          delay: Math.floor(fps * 0.2),
          duration: Math.floor(fps * 0.3),
        });
        break;
      case 'particles':
        logoAnimations.push({
          type: 'entrance',
          effect: 'scaleIn',
          delay: Math.floor(fps * 0.3),
          duration: Math.floor(fps * 0.5),
          easing: 'easeOutElastic',
        });
        break;
      default: // minimal
        logoAnimations.push({
          type: 'entrance',
          effect: 'fadeIn',
          delay: Math.floor(fps * 0.2),
          duration: Math.floor(fps * 0.6),
          easing: 'easeOutCubic',
        });
    }

    if (inputs.logoUrl) {
      layers.push({
        id: 'logo',
        type: 'image',
        position: { x: (width - logoSize) / 2, y: (height - logoSize) / 2 - 30 },
        size: { width: logoSize, height: logoSize },
        props: {
          src: inputs.logoUrl,
          fit: 'contain',
        },
        animations: logoAnimations,
      } as ImageLayer);
    }

    // Brand name
    if (inputs.brandName) {
      layers.push({
        id: 'brand-name',
        type: 'text',
        position: { x: width * 0.1, y: height / 2 + logoSize / 2 + 20 },
        size: { width: width * 0.8, height: 60 },
        props: {
          text: inputs.brandName,
          fontSize: 32,
          fontWeight: 'bold',
          color: theme.colors.text,
          textAlign: 'center',
          fontFamily: theme.typography.headingFamily,
          letterSpacing: 2,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 0.8),
            duration: Math.floor(fps * 0.5),
          },
          {
            type: 'entrance',
            effect: 'slideInUp',
            delay: Math.floor(fps * 0.8),
            duration: Math.floor(fps * 0.5),
            easing: 'easeOutCubic',
          },
        ],
      });
    }

    // Tagline
    if (inputs.tagline) {
      layers.push({
        id: 'tagline',
        type: 'text',
        position: { x: width * 0.1, y: height / 2 + logoSize / 2 + 70 },
        size: { width: width * 0.8, height: 40 },
        props: {
          text: inputs.tagline,
          fontSize: 18,
          fontWeight: 'normal',
          color: theme.colors.textMuted,
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 1.0),
            duration: Math.floor(fps * 0.5),
          },
        ],
      });
    }

    return {
      name: 'Logo Reveal',
      output: {
        type: 'video',
        width,
        height,
        fps,
        duration: options.duration || 3,
      },
      inputs: [],
      composition: {
        scenes: [
          {
            id: 'main',
            startFrame: 0,
            endFrame: totalFrames,
            layers,
          },
        ],
      },
    };
  },
};
