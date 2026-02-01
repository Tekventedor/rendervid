import type { Template, Layer, TextLayer, ShapeLayer, ImageLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Social Promo scene
 */
export interface SocialPromoInputs extends BaseSceneInputs {
  headline: string;
  description?: string;
  ctaText: string;
  productImageUrl?: string;
  discount?: string;
  style?: 'sale' | 'launch' | 'announcement' | 'event';
}

/**
 * Social Promo - Eye-catching promotional content for social media
 */
export const SocialPromo: SceneTemplate<SocialPromoInputs> = {
  id: 'social-promo',
  name: 'Social Promo',
  description: 'Eye-catching promotional video for social media campaigns.',
  category: 'promo',
  tags: ['social', 'promo', 'sale', 'marketing', 'ad', 'instagram', 'tiktok'],
  aspectRatios: ['9:16', '1:1', '16:9'],
  defaultAspectRatio: '9:16',
  duration: 6,
  defaultTheme: 'bold',
  inputs: [
    { key: 'headline', type: 'string', label: 'Headline', required: true, default: 'MEGA SALE' },
    { key: 'description', type: 'string', label: 'Description', default: 'Limited time offer' },
    { key: 'ctaText', type: 'string', label: 'Call to Action', required: true, default: 'Shop Now' },
    { key: 'productImageUrl', type: 'image', label: 'Product Image' },
    { key: 'discount', type: 'string', label: 'Discount (e.g., "50% OFF")', default: '' },
    {
      key: 'style',
      type: 'select',
      label: 'Style',
      options: [
        { value: 'sale', label: 'Sale' },
        { value: 'launch', label: 'Product Launch' },
        { value: 'announcement', label: 'Announcement' },
        { value: 'event', label: 'Event' },
      ],
      default: 'sale',
    },
    { key: 'primaryColor', type: 'color', label: 'Primary Color' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
  ],
  defaults: {
    headline: 'MEGA SALE',
    description: 'Limited time offer',
    ctaText: 'Shop Now',
    discount: '50% OFF',
    style: 'sale',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 6) * fps;
    const isVertical = options.aspectRatio === '9:16';

    const primaryColor = inputs.primaryColor || theme.colors.primary;
    const bgColor = inputs.backgroundColor || theme.colors.background;

    const layers: Layer[] = [];

    // Animated gradient background
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
            { offset: 0, color: bgColor },
            { offset: 1, color: theme.colors.surface },
          ],
          angle: 135,
        },
      },
    } as ShapeLayer);

    // Decorative circles
    const circlePositions = isVertical
      ? [
          { x: -100, y: -100, size: 400 },
          { x: width - 150, y: height - 200, size: 300 },
        ]
      : [
          { x: -150, y: -150, size: 500 },
          { x: width - 200, y: height - 150, size: 350 },
        ];

    circlePositions.forEach((pos, i) => {
      layers.push({
        id: `deco-circle-${i}`,
        type: 'shape',
        position: { x: pos.x, y: pos.y },
        size: { width: pos.size, height: pos.size },
        opacity: 0.15,
        props: {
          shape: 'ellipse',
          fill: primaryColor,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'scaleIn',
            delay: i * 5,
            duration: fps,
            easing: 'easeOutExpo',
          },
        ],
      } as ShapeLayer);
    });

    // Discount badge
    if (inputs.discount) {
      const badgeSize = isVertical ? 120 : 150;
      layers.push({
        id: 'discount-badge',
        type: 'shape',
        position: { x: width - badgeSize - 30, y: 30 },
        size: { width: badgeSize, height: badgeSize },
        props: {
          shape: 'ellipse',
          fill: primaryColor,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'bounceIn',
            delay: Math.floor(fps * 0.5),
            duration: fps,
          },
        ],
      } as ShapeLayer);

      layers.push({
        id: 'discount-text',
        type: 'text',
        position: { x: width - badgeSize - 30, y: 30 + badgeSize / 2 - 20 },
        size: { width: badgeSize, height: 40 },
        props: {
          text: inputs.discount,
          fontSize: isVertical ? 18 : 22,
          fontWeight: '800',
          color: '#FFFFFF',
          textAlign: 'center',
          fontFamily: theme.typography.headingFamily,
        },
        from: Math.floor(fps * 0.6),
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 0.6),
            duration: Math.floor(fps * 0.3),
          },
        ],
      } as TextLayer);
    }

    // Product image
    if (inputs.productImageUrl) {
      const imgSize = isVertical ? width * 0.7 : height * 0.5;
      layers.push({
        id: 'product-image',
        type: 'image',
        position: {
          x: (width - imgSize) / 2,
          y: isVertical ? height * 0.25 : (height - imgSize) / 2,
        },
        size: { width: imgSize, height: imgSize },
        props: {
          src: inputs.productImageUrl,
          fit: 'contain',
        },
        animations: [
          {
            type: 'entrance',
            effect: 'zoomIn',
            delay: Math.floor(fps * 0.3),
            duration: fps,
            easing: 'easeOutBack',
          },
        ],
      } as ImageLayer);
    }

    // Headline
    const headlineY = isVertical
      ? inputs.productImageUrl ? height * 0.6 : height * 0.35
      : height * 0.15;

    layers.push({
      id: 'headline',
      type: 'text',
      position: { x: width * 0.05, y: headlineY },
      size: { width: width * 0.9, height: isVertical ? 100 : 80 },
      props: {
        text: inputs.headline,
        fontSize: isVertical ? 48 : 64,
        fontWeight: '800',
        color: theme.colors.text,
        textAlign: 'center',
        fontFamily: theme.typography.headingFamily,
        letterSpacing: 2,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'slideInUp',
          delay: Math.floor(fps * 0.8),
          duration: Math.floor(fps * 0.5),
          easing: 'easeOutCubic',
        },
      ],
    } as TextLayer);

    // Description
    if (inputs.description) {
      layers.push({
        id: 'description',
        type: 'text',
        position: { x: width * 0.1, y: headlineY + (isVertical ? 80 : 70) },
        size: { width: width * 0.8, height: 50 },
        props: {
          text: inputs.description,
          fontSize: isVertical ? 20 : 24,
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
            duration: Math.floor(fps * 0.4),
          },
        ],
      } as TextLayer);
    }

    // CTA Button
    const ctaY = isVertical ? height * 0.82 : height * 0.75;
    const ctaWidth = isVertical ? width * 0.7 : 250;
    const ctaHeight = isVertical ? 60 : 56;

    layers.push({
      id: 'cta-bg',
      type: 'shape',
      position: { x: (width - ctaWidth) / 2, y: ctaY },
      size: { width: ctaWidth, height: ctaHeight },
      props: {
        shape: 'rectangle',
        fill: primaryColor,
        borderRadius: ctaHeight / 2,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'scaleIn',
          delay: Math.floor(fps * 1.3),
          duration: Math.floor(fps * 0.4),
          easing: 'easeOutBack',
        },
        {
          type: 'emphasis',
          effect: 'pulse',
          delay: Math.floor(fps * 2.5),
          duration: fps,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: theme.typography.fontFamily,
        letterSpacing: 1,
      },
      from: Math.floor(fps * 1.5),
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          delay: Math.floor(fps * 1.5),
          duration: Math.floor(fps * 0.3),
        },
      ],
    } as TextLayer);

    return {
      name: 'Social Promo',
      output: {
        type: 'video',
        width,
        height,
        fps,
        duration: options.duration || 6,
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
