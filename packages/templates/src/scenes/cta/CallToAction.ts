import type { Template, Layer, TextLayer, ShapeLayer, ImageLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Call to Action scene
 */
export interface CallToActionInputs extends BaseSceneInputs {
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaUrl?: string;
  urgencyText?: string;
  style?: 'bold' | 'elegant' | 'minimal' | 'gradient';
}

/**
 * Call To Action - Compelling CTA with urgency elements
 */
export const CallToAction: SceneTemplate<CallToActionInputs> = {
  id: 'call-to-action',
  name: 'Call To Action',
  description: 'Compelling call-to-action scene with urgency elements.',
  category: 'call-to-action',
  tags: ['cta', 'action', 'button', 'conversion', 'marketing'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 5,
  defaultTheme: 'bold',
  inputs: [
    { key: 'headline', type: 'string', label: 'Headline', required: true, default: 'Ready to Get Started?' },
    { key: 'subheadline', type: 'string', label: 'Subheadline', default: 'Join thousands of satisfied customers' },
    { key: 'ctaText', type: 'string', label: 'CTA Button Text', required: true, default: 'Start Free Trial' },
    { key: 'ctaUrl', type: 'string', label: 'CTA URL' },
    { key: 'urgencyText', type: 'string', label: 'Urgency Text', default: 'Limited time offer' },
    {
      key: 'style',
      type: 'select',
      label: 'Style',
      options: [
        { value: 'bold', label: 'Bold' },
        { value: 'elegant', label: 'Elegant' },
        { value: 'minimal', label: 'Minimal' },
        { value: 'gradient', label: 'Gradient' },
      ],
      default: 'bold',
    },
    { key: 'primaryColor', type: 'color', label: 'Primary Color' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
  ],
  defaults: {
    headline: 'Ready to Get Started?',
    subheadline: 'Join thousands of satisfied customers',
    ctaText: 'Start Free Trial',
    urgencyText: 'Limited time offer',
    style: 'bold',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 5) * fps;
    const isVertical = options.aspectRatio === '9:16';

    const primaryColor = inputs.primaryColor || theme.colors.primary;
    const bgColor = inputs.backgroundColor || theme.colors.background;
    const style = inputs.style || 'bold';

    const layers: Layer[] = [];

    // Background
    if (style === 'gradient') {
      layers.push({
        id: 'background',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width, height },
        props: {
          shape: 'rectangle',
          gradient: {
            type: 'linear',
            colors: [
              { offset: 0, color: primaryColor },
              { offset: 1, color: theme.colors.secondary || bgColor },
            ],
            angle: 135,
          },
        },
      } as ShapeLayer);
    } else {
      layers.push({
        id: 'background',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width, height },
        props: { shape: 'rectangle', fill: bgColor },
      } as ShapeLayer);
    }

    // Decorative elements for bold style
    if (style === 'bold') {
      // Top accent bar
      layers.push({
        id: 'accent-bar-top',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width, height: 8 },
        props: { shape: 'rectangle', fill: primaryColor },
        animations: [
          {
            type: 'entrance',
            effect: 'slideInLeft',
            delay: 0,
            duration: Math.floor(fps * 0.4),
          },
        ],
      } as ShapeLayer);

      // Bottom accent bar
      layers.push({
        id: 'accent-bar-bottom',
        type: 'shape',
        position: { x: 0, y: height - 8 },
        size: { width, height: 8 },
        props: { shape: 'rectangle', fill: primaryColor },
        animations: [
          {
            type: 'entrance',
            effect: 'slideInRight',
            delay: 0,
            duration: Math.floor(fps * 0.4),
          },
        ],
      } as ShapeLayer);
    }

    // Urgency badge
    if (inputs.urgencyText) {
      const badgeWidth = isVertical ? 200 : 250;
      layers.push({
        id: 'urgency-badge',
        type: 'shape',
        position: { x: (width - badgeWidth) / 2, y: isVertical ? 120 : 80 },
        size: { width: badgeWidth, height: 36 },
        props: {
          shape: 'rectangle',
          fill: style === 'gradient' ? 'rgba(255,255,255,0.2)' : primaryColor,
          borderRadius: 18,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'scaleIn',
            delay: Math.floor(fps * 0.2),
            duration: Math.floor(fps * 0.3),
            easing: 'easeOutBack',
          },
        ],
      } as ShapeLayer);

      layers.push({
        id: 'urgency-text',
        type: 'text',
        position: { x: (width - badgeWidth) / 2, y: isVertical ? 127 : 87 },
        size: { width: badgeWidth, height: 24 },
        props: {
          text: inputs.urgencyText.toUpperCase(),
          fontSize: 12,
          fontWeight: 'bold',
          color: style === 'gradient' ? '#FFFFFF' : '#FFFFFF',
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily,
          letterSpacing: 2,
        },
        from: Math.floor(fps * 0.3),
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 0.3),
            duration: Math.floor(fps * 0.2),
          },
        ],
      } as TextLayer);
    }

    // Headline
    const headlineY = isVertical ? height * 0.35 : height * 0.35;
    const headlineFontSize = isVertical ? 42 : 56;

    layers.push({
      id: 'headline',
      type: 'text',
      position: { x: width * 0.1, y: headlineY },
      size: { width: width * 0.8, height: headlineFontSize + 20 },
      props: {
        text: inputs.headline,
        fontSize: headlineFontSize,
        fontWeight: '800',
        color: style === 'gradient' ? '#FFFFFF' : theme.colors.text,
        textAlign: 'center',
        fontFamily: theme.typography.headingFamily,
        lineHeight: 1.2,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'slideInUp',
          delay: Math.floor(fps * 0.4),
          duration: Math.floor(fps * 0.5),
          easing: 'easeOutCubic',
        },
      ],
    } as TextLayer);

    // Subheadline
    if (inputs.subheadline) {
      layers.push({
        id: 'subheadline',
        type: 'text',
        position: { x: width * 0.1, y: headlineY + headlineFontSize + 20 },
        size: { width: width * 0.8, height: 40 },
        props: {
          text: inputs.subheadline,
          fontSize: isVertical ? 18 : 22,
          fontWeight: 'normal',
          color: style === 'gradient' ? 'rgba(255,255,255,0.9)' : theme.colors.textMuted,
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 0.6),
            duration: Math.floor(fps * 0.4),
          },
        ],
      } as TextLayer);
    }

    // CTA Button
    const ctaY = isVertical ? height * 0.6 : height * 0.6;
    const ctaWidth = isVertical ? width * 0.7 : 300;
    const ctaHeight = 60;

    layers.push({
      id: 'cta-bg',
      type: 'shape',
      position: { x: (width - ctaWidth) / 2, y: ctaY },
      size: { width: ctaWidth, height: ctaHeight },
      props: {
        shape: 'rectangle',
        fill: style === 'gradient' ? '#FFFFFF' : primaryColor,
        borderRadius: ctaHeight / 2,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'scaleIn',
          delay: Math.floor(fps * 0.9),
          duration: Math.floor(fps * 0.4),
          easing: 'easeOutBack',
        },
        {
          type: 'emphasis',
          effect: 'pulse',
          delay: Math.floor(fps * 2),
          duration: Math.floor(fps * 0.8),
        },
      ],
    } as ShapeLayer);

    layers.push({
      id: 'cta-text',
      type: 'text',
      position: { x: (width - ctaWidth) / 2, y: ctaY + ctaHeight / 2 - 12 },
      size: { width: ctaWidth, height: 24 },
      props: {
        text: inputs.ctaText,
        fontSize: 20,
        fontWeight: 'bold',
        color: style === 'gradient' ? primaryColor : '#FFFFFF',
        textAlign: 'center',
        fontFamily: theme.typography.fontFamily,
      },
      from: Math.floor(fps * 1.1),
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          delay: Math.floor(fps * 1.1),
          duration: Math.floor(fps * 0.3),
        },
      ],
    } as TextLayer);

    // Arrow icon after CTA
    layers.push({
      id: 'cta-arrow',
      type: 'text',
      position: { x: (width + ctaWidth) / 2 + 20, y: ctaY + ctaHeight / 2 - 15 },
      size: { width: 40, height: 30 },
      props: {
        text: '→',
        fontSize: 28,
        fontWeight: 'bold',
        color: style === 'gradient' ? '#FFFFFF' : primaryColor,
        textAlign: 'left',
      },
      animations: [
        {
          type: 'entrance',
          effect: 'slideInLeft',
          delay: Math.floor(fps * 1.3),
          duration: Math.floor(fps * 0.3),
        },
      ],
    } as TextLayer);

    return {
      name: 'Call To Action',
      output: {
        type: 'video',
        width,
        height,
        fps,
        duration: options.duration || 5,
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
