import type { DocResult } from '../types.js';

export function getFontsDocs(): DocResult {
  return {
    topic: 'fonts',
    title: 'Font Configuration',
    description: 'Configure Google Fonts and custom fonts for text layers. Defined in the template.fonts field.',
    sections: [
      {
        title: 'Google Fonts',
        description: 'Load fonts from Google Fonts CDN',
        properties: {
          family: { type: 'string', required: true, description: 'Font family name', example: 'Roboto' },
          weights: { type: 'number[]', description: 'Weights to load', example: [400, 700] },
          styles: { type: 'string[]', description: 'Styles to load', example: ['normal', 'italic'] },
        },
      },
      {
        title: 'Custom Fonts',
        description: 'Load custom font files',
        properties: {
          family: { type: 'string', required: true, description: 'Font family name', example: 'MyBrand' },
          source: { type: 'string', required: true, description: 'URL to font file (woff2, woff, ttf)', example: 'https://cdn.example.com/font.woff2' },
          weight: { type: 'number', description: 'Font weight', default: 400 },
          style: { type: 'string', description: 'Font style', default: 'normal' },
        },
      },
      {
        title: 'Font Fallbacks',
        description: 'Configure fallback fonts when primary fonts fail to load',
        properties: {
          fallbacks: { type: 'Record<string, string[]>', description: 'Map of font family to fallback families', example: { Roboto: ['Arial', 'Helvetica', 'sans-serif'] } },
        },
      },
    ],
    examples: [
      {
        description: 'Template with Google Fonts',
        fonts: {
          google: [
            { family: 'Roboto', weights: [400, 700], styles: ['normal', 'italic'] },
            { family: 'Playfair Display', weights: [700] },
          ],
          fallbacks: { Roboto: ['Arial', 'sans-serif'] },
        },
      },
    ],
    tips: [
      'Fonts are loaded before rendering begins',
      'Use fontFamily in text layer props to reference loaded fonts',
      'The font catalog has 1000+ Google Fonts available',
    ],
    seeAlso: ['layer/text', 'template'],
  };
}
