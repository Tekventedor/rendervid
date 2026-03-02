import type { DocResult } from '../types.js';

export function getStyleDocs(): DocResult {
  return {
    topic: 'style',
    title: 'Layer Style (Tailwind-like)',
    description: 'Tailwind-like utility style properties available on any layer via the style field.',
    sections: [
      {
        title: 'Spacing',
        description: 'Padding and margin utilities',
        properties: {
          padding: { type: 'string | number', description: 'Padding (px)', example: 16 },
          paddingX: { type: 'string | number', description: 'Horizontal padding' },
          paddingY: { type: 'string | number', description: 'Vertical padding' },
          paddingTop: { type: 'string | number', description: 'Top padding' },
          paddingRight: { type: 'string | number', description: 'Right padding' },
          paddingBottom: { type: 'string | number', description: 'Bottom padding' },
          paddingLeft: { type: 'string | number', description: 'Left padding' },
          margin: { type: 'string | number', description: 'Margin' },
          marginX: { type: 'string | number', description: 'Horizontal margin' },
          marginY: { type: 'string | number', description: 'Vertical margin' },
        },
      },
      {
        title: 'Borders',
        description: 'Border and border radius utilities',
        properties: {
          borderRadius: { type: 'string | number', description: 'Border radius (px or preset like "lg", "full")', example: 16 },
          borderWidth: { type: 'number', description: 'Border width in pixels' },
          borderColor: { type: 'string', description: 'Border color' },
          borderStyle: { type: 'string', description: 'Border style', values: ['solid', 'dashed', 'dotted', 'none'] },
        },
      },
      {
        title: 'Shadows',
        description: 'Box shadow utilities',
        properties: {
          boxShadow: { type: 'ShadowPreset | string', description: 'Box shadow', values: ['sm', 'md', 'lg', 'xl', '2xl'], example: 'lg' },
        },
      },
      {
        title: 'Backgrounds',
        description: 'Background utilities',
        properties: {
          backgroundColor: { type: 'string', description: 'Background color', example: '#1a1a2e' },
          backgroundGradient: { type: 'BackgroundGradient', description: 'Background gradient: { type, from, via?, to, direction? }' },
          backgroundImage: { type: 'string', description: 'Background image URL' },
          backgroundSize: { type: 'string', description: 'Background size', values: ['cover', 'contain', 'auto'] },
          backdropBlur: { type: 'BlurPreset | number', description: 'Backdrop blur', values: ['sm', 'md', 'lg'] },
        },
      },
      {
        title: 'Typography',
        description: 'Text styling utilities (in style, not props)',
        properties: {
          fontFamily: { type: 'string', description: 'Font family' },
          fontSize: { type: 'string | number', description: 'Font size' },
          fontWeight: { type: 'string | number', description: 'Font weight' },
          lineHeight: { type: 'string | number', description: 'Line height' },
          letterSpacing: { type: 'string | number', description: 'Letter spacing' },
          textAlign: { type: 'string', description: 'Text alignment', values: ['left', 'center', 'right', 'justify'] },
          textColor: { type: 'string', description: 'Text color' },
          textShadow: { type: 'string', description: 'Text shadow (CSS value)' },
          textDecoration: { type: 'string', description: 'Text decoration', values: ['none', 'underline', 'line-through'] },
          textTransform: { type: 'string', description: 'Text transform', values: ['none', 'uppercase', 'lowercase', 'capitalize'] },
        },
      },
      {
        title: 'Layout',
        description: 'Flexbox and grid utilities',
        properties: {
          display: { type: 'string', description: 'Display type', values: ['flex', 'grid', 'block', 'inline', 'none'] },
          flexDirection: { type: 'string', description: 'Flex direction', values: ['row', 'column', 'row-reverse', 'column-reverse'] },
          justifyContent: { type: 'string', description: 'Justify content', values: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
          alignItems: { type: 'string', description: 'Align items', values: ['start', 'center', 'end', 'stretch', 'baseline'] },
          gap: { type: 'string | number', description: 'Gap between items' },
        },
      },
      {
        title: 'Effects',
        description: 'Filter-like effects via style',
        properties: {
          blur: { type: 'BlurPreset | number', description: 'Blur effect' },
          brightness: { type: 'number', description: 'Brightness (100 = normal)', range: '0-200' },
          contrast: { type: 'number', description: 'Contrast (100 = normal)', range: '0-200' },
          grayscale: { type: 'number', description: 'Grayscale', range: '0-100' },
          saturate: { type: 'number', description: 'Saturation (100 = normal)', range: '0-200' },
          sepia: { type: 'number', description: 'Sepia tone', range: '0-100' },
          hueRotate: { type: 'number', description: 'Hue rotation', range: '0-360' },
          invert: { type: 'number', description: 'Color inversion', range: '0-100' },
        },
      },
      {
        title: 'Overflow',
        description: 'Overflow control',
        properties: {
          overflow: { type: 'string', description: 'Overflow behavior', values: ['visible', 'hidden', 'scroll', 'auto'] },
        },
      },
      {
        title: 'Raw CSS',
        description: 'Pass-through CSS properties',
        properties: {
          css: { type: 'CSSProperties', description: 'Raw React CSSProperties for anything not covered above' },
        },
      },
    ],
    seeAlso: ['layer', 'filters'],
  };
}
