import type { Template, Layer, TextLayer, ShapeLayer, ImageLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Product Showcase scene
 */
export interface ProductShowcaseInputs extends BaseSceneInputs {
  productName: string;
  productImage: string;
  tagline?: string;
  price?: string;
  features?: string[];
  style?: 'minimal' | 'elegant' | 'bold' | 'tech';
}

/**
 * Product Showcase - Feature product with details
 */
export const ProductShowcase: SceneTemplate<ProductShowcaseInputs> = {
  id: 'product-showcase',
  name: 'Product Showcase',
  description: 'Showcase your product with stunning visuals and key features.',
  category: 'promo',
  tags: ['product', 'showcase', 'ecommerce', 'marketing', 'feature'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 6,
  defaultTheme: 'elegant',
  inputs: [
    { key: 'productName', type: 'string', label: 'Product Name', required: true, default: 'Premium Product' },
    { key: 'productImage', type: 'image', label: 'Product Image', required: true },
    { key: 'tagline', type: 'string', label: 'Tagline', default: 'Innovation meets design' },
    { key: 'price', type: 'string', label: 'Price', default: '$99' },
    { key: 'primaryColor', type: 'color', label: 'Primary Color' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
    {
      key: 'style',
      type: 'select',
      label: 'Style',
      options: [
        { value: 'minimal', label: 'Minimal' },
        { value: 'elegant', label: 'Elegant' },
        { value: 'bold', label: 'Bold' },
        { value: 'tech', label: 'Tech' },
      ],
      default: 'elegant',
    },
  ],
  defaults: {
    productName: 'Premium Product',
    productImage: '',
    tagline: 'Innovation meets design',
    price: '$99',
    style: 'elegant',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 6) * fps;
    const isVertical = options.aspectRatio === '9:16';

    const primaryColor = inputs.primaryColor || theme.colors.primary;
    const bgColor = inputs.backgroundColor || theme.colors.background;
    const style = inputs.style || 'elegant';

    const layers: Layer[] = [];

    // Background
    layers.push({
      id: 'background',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width, height },
      props: {
        shape: 'rectangle',
        gradient: style === 'tech'
          ? { type: 'linear', colors: [{ offset: 0, color: '#0f0f23' }, { offset: 1, color: '#1a1a3e' }], angle: 180 }
          : style === 'bold'
          ? { type: 'linear', colors: [{ offset: 0, color: primaryColor }, { offset: 1, color: bgColor }], angle: 135 }
          : undefined,
        fill: style === 'tech' || style === 'bold' ? undefined : bgColor,
      },
    } as ShapeLayer);

    // Decorative elements
    if (style === 'elegant') {
      // Subtle gradient overlay
      layers.push({
        id: 'gradient-overlay',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width, height },
        opacity: 0.1,
        props: {
          shape: 'rectangle',
          gradient: {
            type: 'radial',
            colors: [
              { offset: 0, color: primaryColor },
              { offset: 1, color: 'transparent' },
            ],
          },
        },
      } as ShapeLayer);
    }

    if (style === 'tech') {
      // Grid pattern simulation
      for (let i = 0; i < 5; i++) {
        layers.push({
          id: `grid-h-${i}`,
          type: 'shape',
          position: { x: 0, y: height * 0.2 * i },
          size: { width, height: 1 },
          opacity: 0.1,
          props: { shape: 'rectangle', fill: primaryColor },
        } as ShapeLayer);

        layers.push({
          id: `grid-v-${i}`,
          type: 'shape',
          position: { x: width * 0.2 * i, y: 0 },
          size: { width: 1, height },
          opacity: 0.1,
          props: { shape: 'rectangle', fill: primaryColor },
        } as ShapeLayer);
      }
    }

    // Product image
    if (inputs.productImage) {
      const imgSize = isVertical ? width * 0.7 : height * 0.6;
      const imgX = isVertical ? (width - imgSize) / 2 : width * 0.55;
      const imgY = isVertical ? height * 0.15 : (height - imgSize) / 2;

      layers.push({
        id: 'product-image',
        type: 'image',
        position: { x: imgX, y: imgY },
        size: { width: imgSize, height: imgSize },
        props: {
          src: inputs.productImage,
          fit: 'contain',
        },
        animations: [
          {
            type: 'entrance',
            effect: style === 'bold' ? 'zoomIn' : 'fadeIn',
            delay: Math.floor(fps * 0.3),
            duration: Math.floor(fps * 0.6),
            easing: 'easeOutCubic',
          },
        ],
      } as ImageLayer);

      // Shadow/glow under product
      if (style !== 'minimal') {
        layers.splice(layers.length - 1, 0, {
          id: 'product-shadow',
          type: 'shape',
          position: { x: imgX + imgSize * 0.15, y: imgY + imgSize * 0.9 },
          size: { width: imgSize * 0.7, height: imgSize * 0.15 },
          opacity: 0.3,
          props: {
            shape: 'ellipse',
            gradient: {
              type: 'radial',
              colors: [
                { offset: 0, color: style === 'tech' ? primaryColor : 'rgba(0,0,0,0.5)' },
                { offset: 1, color: 'transparent' },
              ],
            },
          },
          animations: [
            {
              type: 'entrance',
              effect: 'fadeIn',
              delay: Math.floor(fps * 0.5),
              duration: Math.floor(fps * 0.5),
            },
          ],
        } as ShapeLayer);
      }
    }

    // Product name
    const textX = isVertical ? width * 0.1 : width * 0.05;
    const textY = isVertical ? height * 0.6 : height * 0.3;
    const textWidth = isVertical ? width * 0.8 : width * 0.45;

    layers.push({
      id: 'product-name',
      type: 'text',
      position: { x: textX, y: textY },
      size: { width: textWidth, height: 60 },
      props: {
        text: inputs.productName,
        fontSize: isVertical ? 36 : 48,
        fontWeight: 'bold',
        color: style === 'bold' ? '#FFFFFF' : theme.colors.text,
        textAlign: isVertical ? 'center' : 'left',
        fontFamily: theme.typography.headingFamily,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'slideInUp',
          delay: Math.floor(fps * 0.5),
          duration: Math.floor(fps * 0.4),
          easing: 'easeOutCubic',
        },
      ],
    } as TextLayer);

    // Tagline
    if (inputs.tagline) {
      layers.push({
        id: 'tagline',
        type: 'text',
        position: { x: textX, y: textY + 55 },
        size: { width: textWidth, height: 40 },
        props: {
          text: inputs.tagline,
          fontSize: isVertical ? 18 : 22,
          fontWeight: 'normal',
          color: style === 'bold' ? 'rgba(255,255,255,0.8)' : theme.colors.textMuted,
          textAlign: isVertical ? 'center' : 'left',
          fontFamily: theme.typography.fontFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 0.7),
            duration: Math.floor(fps * 0.4),
          },
        ],
      } as TextLayer);
    }

    // Price
    if (inputs.price) {
      const priceY = isVertical ? height * 0.78 : textY + 110;

      layers.push({
        id: 'price',
        type: 'text',
        position: { x: textX, y: priceY },
        size: { width: textWidth, height: 50 },
        props: {
          text: inputs.price,
          fontSize: isVertical ? 42 : 48,
          fontWeight: 'bold',
          color: primaryColor,
          textAlign: isVertical ? 'center' : 'left',
          fontFamily: theme.typography.headingFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'scaleIn',
            delay: Math.floor(fps * 1.0),
            duration: Math.floor(fps * 0.4),
            easing: 'easeOutBack',
          },
        ],
      } as TextLayer);
    }

    // Features list
    if (inputs.features && inputs.features.length > 0) {
      const featureStartY = isVertical ? height * 0.85 : textY + 170;
      inputs.features.slice(0, 3).forEach((feature, i) => {
        layers.push({
          id: `feature-${i}`,
          type: 'text',
          position: { x: textX, y: featureStartY + i * 30 },
          size: { width: textWidth, height: 28 },
          props: {
            text: `✓ ${feature}`,
            fontSize: 16,
            fontWeight: '500',
            color: style === 'bold' ? 'rgba(255,255,255,0.9)' : theme.colors.text,
            textAlign: isVertical ? 'center' : 'left',
            fontFamily: theme.typography.fontFamily,
          },
          animations: [
            {
              type: 'entrance',
              effect: 'slideInLeft',
              delay: Math.floor(fps * 1.2) + i * 8,
              duration: Math.floor(fps * 0.3),
              easing: 'easeOutCubic',
            },
          ],
        } as TextLayer);
      });
    }

    return {
      name: 'Product Showcase',
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
