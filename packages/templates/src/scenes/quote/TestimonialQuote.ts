import type { Template, Layer, TextLayer, ShapeLayer, ImageLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Testimonial Quote scene
 */
export interface TestimonialInputs extends BaseSceneInputs {
  quote: string;
  authorName: string;
  authorTitle?: string;
  authorImage?: string;
  rating?: number;
  style?: 'card' | 'minimal' | 'bold';
}

/**
 * Testimonial Quote - Customer testimonial with author info
 */
export const TestimonialQuote: SceneTemplate<TestimonialInputs> = {
  id: 'testimonial-quote',
  name: 'Testimonial Quote',
  description: 'Display customer testimonials and reviews beautifully.',
  category: 'testimonial',
  tags: ['testimonial', 'quote', 'review', 'customer', 'social-proof'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 6,
  defaultTheme: 'elegant',
  inputs: [
    { key: 'quote', type: 'string', label: 'Quote', required: true, default: 'This product changed my life!' },
    { key: 'authorName', type: 'string', label: 'Author Name', required: true, default: 'Sarah Johnson' },
    { key: 'authorTitle', type: 'string', label: 'Author Title', default: 'CEO, TechCorp' },
    { key: 'authorImage', type: 'image', label: 'Author Photo' },
    { key: 'rating', type: 'number', label: 'Star Rating (1-5)', default: 5 },
    {
      key: 'style',
      type: 'select',
      label: 'Style',
      options: [
        { value: 'card', label: 'Card' },
        { value: 'minimal', label: 'Minimal' },
        { value: 'bold', label: 'Bold' },
      ],
      default: 'card',
    },
    { key: 'primaryColor', type: 'color', label: 'Accent Color' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
  ],
  defaults: {
    quote: 'This product completely transformed how we work. The team is incredibly supportive and the results speak for themselves.',
    authorName: 'Sarah Johnson',
    authorTitle: 'CEO, TechCorp',
    rating: 5,
    style: 'card',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 6) * fps;
    const isVertical = options.aspectRatio === '9:16';

    const accentColor = inputs.primaryColor || theme.colors.primary;
    const bgColor = inputs.backgroundColor || theme.colors.background;
    const style = inputs.style || 'card';

    const layers: Layer[] = [];

    // Background
    layers.push({
      id: 'background',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width, height },
      props: { shape: 'rectangle', fill: bgColor },
    } as ShapeLayer);

    // Card background (for card style)
    if (style === 'card') {
      const cardPadding = isVertical ? 40 : 80;
      const cardWidth = width - cardPadding * 2;
      const cardHeight = isVertical ? height * 0.6 : height * 0.65;

      layers.push({
        id: 'card',
        type: 'shape',
        position: { x: cardPadding, y: (height - cardHeight) / 2 },
        size: { width: cardWidth, height: cardHeight },
        props: {
          shape: 'rectangle',
          fill: theme.colors.surface,
          borderRadius: 24,
        },
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
    }

    // Quote mark
    const quoteMarkSize = isVertical ? 60 : 80;
    const contentX = isVertical ? 60 : 120;
    const contentY = isVertical ? height * 0.25 : height * 0.25;

    layers.push({
      id: 'quote-mark',
      type: 'text',
      position: { x: contentX, y: contentY - 20 },
      size: { width: quoteMarkSize, height: quoteMarkSize },
      props: {
        text: '"',
        fontSize: quoteMarkSize,
        fontWeight: 'bold',
        color: accentColor,
        textAlign: 'left',
        fontFamily: 'Georgia, serif',
      },
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          delay: Math.floor(fps * 0.3),
          duration: Math.floor(fps * 0.3),
        },
      ],
    } as TextLayer);

    // Quote text
    const quoteFontSize = isVertical ? 24 : 32;
    const quoteWidth = width - (isVertical ? 120 : 240);
    layers.push({
      id: 'quote-text',
      type: 'text',
      position: { x: contentX, y: contentY + quoteMarkSize - 10 },
      size: { width: quoteWidth, height: isVertical ? 200 : 150 },
      props: {
        text: inputs.quote,
        fontSize: quoteFontSize,
        fontWeight: style === 'bold' ? '600' : 'normal',
        color: theme.colors.text,
        textAlign: 'left',
        fontFamily: style === 'minimal' ? theme.typography.headingFamily : theme.typography.fontFamily,
        lineHeight: 1.6,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          delay: Math.floor(fps * 0.5),
          duration: Math.floor(fps * 0.5),
        },
      ],
    } as TextLayer);

    // Star rating
    if (inputs.rating && inputs.rating > 0) {
      const starSize = 24;
      const stars = Math.min(5, Math.max(1, inputs.rating));
      const starsY = isVertical ? height * 0.6 : height * 0.58;

      for (let i = 0; i < 5; i++) {
        layers.push({
          id: `star-${i}`,
          type: 'text',
          position: { x: contentX + i * (starSize + 4), y: starsY },
          size: { width: starSize, height: starSize },
          props: {
            text: '★',
            fontSize: starSize,
            color: i < stars ? '#FFD700' : theme.colors.textMuted,
            textAlign: 'center',
          },
          animations: [
            {
              type: 'entrance',
              effect: 'scaleIn',
              delay: Math.floor(fps * 0.8) + i * 3,
              duration: Math.floor(fps * 0.2),
              easing: 'easeOutBack',
            },
          ],
        } as TextLayer);
      }
    }

    // Author section
    const authorY = isVertical ? height * 0.72 : height * 0.68;
    const avatarSize = 60;

    // Author image
    if (inputs.authorImage) {
      layers.push({
        id: 'author-image',
        type: 'image',
        position: { x: contentX, y: authorY },
        size: { width: avatarSize, height: avatarSize },
        props: {
          src: inputs.authorImage,
          fit: 'cover',
        },
        style: { borderRadius: '50%' },
        animations: [
          {
            type: 'entrance',
            effect: 'scaleIn',
            delay: Math.floor(fps * 1.2),
            duration: Math.floor(fps * 0.3),
            easing: 'easeOutBack',
          },
        ],
      } as ImageLayer);
    }

    // Author name
    const nameX = inputs.authorImage ? contentX + avatarSize + 16 : contentX;
    layers.push({
      id: 'author-name',
      type: 'text',
      position: { x: nameX, y: authorY + (inputs.authorImage ? 8 : 0) },
      size: { width: 300, height: 30 },
      props: {
        text: inputs.authorName,
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'left',
        fontFamily: theme.typography.fontFamily,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          delay: Math.floor(fps * 1.3),
          duration: Math.floor(fps * 0.3),
        },
      ],
    } as TextLayer);

    // Author title
    if (inputs.authorTitle) {
      layers.push({
        id: 'author-title',
        type: 'text',
        position: { x: nameX, y: authorY + (inputs.authorImage ? 34 : 28) },
        size: { width: 300, height: 24 },
        props: {
          text: inputs.authorTitle,
          fontSize: 16,
          fontWeight: 'normal',
          color: theme.colors.textMuted,
          textAlign: 'left',
          fontFamily: theme.typography.fontFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 1.4),
            duration: Math.floor(fps * 0.3),
          },
        ],
      } as TextLayer);
    }

    return {
      name: 'Testimonial Quote',
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
