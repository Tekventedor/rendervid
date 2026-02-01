import type { Template, Scene, Layer, TextLayer, ShapeLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Title Reveal scene
 */
export interface TitleRevealInputs extends BaseSceneInputs {
  headline: string;
  subtitle?: string;
  tagline?: string;
}

/**
 * Title Reveal - Animated title with line reveals
 * Perfect for video intros, YouTube videos, presentations
 */
export const TitleReveal: SceneTemplate<TitleRevealInputs> = {
  id: 'title-reveal',
  name: 'Title Reveal',
  description: 'Elegant title animation with animated line reveals. Perfect for video intros.',
  category: 'intro',
  tags: ['title', 'intro', 'reveal', 'elegant', 'professional'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 4,
  defaultTheme: 'modern',
  inputs: [
    { key: 'headline', type: 'string', label: 'Headline', required: true, default: 'Your Title Here' },
    { key: 'subtitle', type: 'string', label: 'Subtitle', default: 'Supporting text goes here' },
    { key: 'tagline', type: 'string', label: 'Tagline', default: '' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
    { key: 'primaryColor', type: 'color', label: 'Accent Color' },
  ],
  defaults: {
    headline: 'Your Title Here',
    subtitle: 'Supporting text goes here',
    tagline: '',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 4) * fps;
    const isVertical = options.aspectRatio === '9:16';

    const bgColor = inputs.backgroundColor || theme.colors.background;
    const accentColor = inputs.primaryColor || theme.colors.primary;

    const layers: Layer[] = [];

    // Background
    layers.push({
      id: 'background',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width, height },
      props: { shape: 'rectangle', fill: bgColor },
    } as ShapeLayer);

    // Accent line (animates in)
    const lineWidth = isVertical ? 60 : 120;
    const lineHeight = 4;
    layers.push({
      id: 'accent-line',
      type: 'shape',
      position: { x: (width - lineWidth) / 2, y: height / 2 - 60 },
      size: { width: lineWidth, height: lineHeight },
      props: { shape: 'rectangle', fill: accentColor, borderRadius: 2 },
      animations: [
        {
          type: 'entrance',
          effect: 'scaleIn',
          delay: 0,
          duration: Math.floor(fps * 0.5),
          easing: 'easeOutCubic',
        },
      ],
    } as ShapeLayer);

    // Headline
    const headlineFontSize = isVertical ? 48 : 72;
    layers.push({
      id: 'headline',
      type: 'text',
      position: { x: width * 0.1, y: height / 2 - 30 },
      size: { width: width * 0.8, height: headlineFontSize * 1.5 },
      props: {
        text: inputs.headline || 'Your Title Here',
        fontSize: headlineFontSize,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        fontFamily: theme.typography.headingFamily,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          delay: Math.floor(fps * 0.3),
          duration: Math.floor(fps * 0.6),
          easing: 'easeOutCubic',
        },
        {
          type: 'entrance',
          effect: 'slideInUp',
          delay: Math.floor(fps * 0.3),
          duration: Math.floor(fps * 0.6),
          easing: 'easeOutCubic',
        },
      ],
    } as TextLayer);

    // Subtitle
    if (inputs.subtitle) {
      const subtitleFontSize = isVertical ? 24 : 32;
      layers.push({
        id: 'subtitle',
        type: 'text',
        position: { x: width * 0.1, y: height / 2 + headlineFontSize },
        size: { width: width * 0.8, height: subtitleFontSize * 2 },
        props: {
          text: inputs.subtitle,
          fontSize: subtitleFontSize,
          fontWeight: 'normal',
          color: theme.colors.textMuted,
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 0.6),
            duration: Math.floor(fps * 0.5),
            easing: 'easeOutCubic',
          },
        ],
      } as TextLayer);
    }

    // Tagline at bottom
    if (inputs.tagline) {
      layers.push({
        id: 'tagline',
        type: 'text',
        position: { x: width * 0.1, y: height - 100 },
        size: { width: width * 0.8, height: 40 },
        props: {
          text: inputs.tagline,
          fontSize: 18,
          fontWeight: '500',
          color: accentColor,
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily,
          letterSpacing: 4,
        },
        from: Math.floor(fps * 0.8),
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 0.8),
            duration: Math.floor(fps * 0.5),
          },
        ],
      } as TextLayer);
    }

    return {
      name: 'Title Reveal',
      output: {
        type: 'video',
        width,
        height,
        fps,
        duration: options.duration || 4,
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
