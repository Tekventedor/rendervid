import type { DocResult } from '../../types.js';
import { TIPS } from '../../descriptions.js';

export function getTextLayerDocs(): DocResult {
  return {
    topic: 'layer/text',
    title: 'Text Layer',
    description: 'Rich text with typography, fonts, alignment, spans, and text effects.',
    properties: {
      text: { type: 'string', required: true, description: 'Text content. Use {{variableName}} for dynamic values', example: '{{title}}' },
      fontFamily: { type: 'string', description: 'Font family name. Supports Google Fonts', default: 'Inter', example: 'Roboto' },
      fontSize: { type: 'number', description: 'Font size in pixels', default: 16, example: 48 },
      fontWeight: { type: 'string | number', description: 'Font weight', default: 'normal', values: ['normal', 'bold', '100-900'] },
      fontStyle: { type: '"normal" | "italic"', description: 'Font style', default: 'normal' },
      color: { type: 'string', description: 'Text color (hex, rgb, rgba, CSS name)', default: '#000000', example: '#ffffff' },
      textAlign: { type: 'string', description: 'Horizontal alignment', default: 'left', values: ['left', 'center', 'right', 'justify'] },
      verticalAlign: { type: 'string', description: 'Vertical alignment within layer bounds', values: ['top', 'middle', 'bottom'] },
      lineHeight: { type: 'number', description: 'Line height multiplier', default: 1.2, example: 1.5 },
      letterSpacing: { type: 'number', description: 'Letter spacing in pixels', default: 0, example: 2 },
      textTransform: { type: 'string', description: 'Text case transformation', values: ['none', 'uppercase', 'lowercase', 'capitalize'] },
      textDecoration: { type: 'string', description: 'Text decoration', values: ['none', 'underline', 'line-through'] },
      stroke: { type: '{ color: string, width: number }', description: 'Text stroke/outline', example: { color: '#000000', width: 2 } },
      textShadow: { type: '{ color, blur, offsetX, offsetY }', description: 'Text shadow effect', example: { color: 'rgba(0,0,0,0.5)', blur: 4, offsetX: 2, offsetY: 2 } },
      backgroundColor: { type: 'string', description: 'Background color behind text', example: 'rgba(0,0,0,0.5)' },
      padding: { type: 'number | { top, right, bottom, left }', description: 'Padding around text', example: 16 },
      borderRadius: { type: 'number', description: 'Border radius for background', example: 8 },
      maxLines: { type: 'number', description: 'Maximum lines (truncates with ellipsis if exceeded)', example: 3 },
      overflow: { type: 'string', description: 'Overflow behavior', values: ['visible', 'hidden', 'ellipsis'] },
      spans: { type: 'TextSpan[]', description: 'Rich text spans with per-span styling. Overrides text property when provided' },
    },
    sections: [
      {
        title: 'TextSpan Properties',
        description: 'Each span in the spans[] array can override these text properties',
        properties: {
          text: { type: 'string', required: true, description: 'Text content for this span' },
          fontFamily: { type: 'string', description: 'Override font family' },
          fontSize: { type: 'number', description: 'Override font size' },
          fontWeight: { type: 'string', description: 'Override font weight' },
          fontStyle: { type: '"normal" | "italic"', description: 'Override font style' },
          color: { type: 'string', description: 'Override text color' },
          letterSpacing: { type: 'number', description: 'Override letter spacing' },
          backgroundColor: { type: 'string', description: 'Highlight background color' },
          textDecoration: { type: 'string', description: 'Override text decoration' },
          stroke: { type: '{ color, width }', description: 'Override text stroke' },
          textShadow: { type: '{ color, blur, offsetX, offsetY }', description: 'Override text shadow' },
        },
      },
    ],
    examples: [
      {
        description: 'Basic text layer',
        layer: {
          id: 'title', type: 'text',
          position: { x: 160, y: 440 }, size: { width: 1600, height: 200 },
          props: { text: 'Hello World', fontSize: 72, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
        },
      },
      {
        description: 'Rich text with spans',
        layer: {
          id: 'rich', type: 'text',
          position: { x: 100, y: 300 }, size: { width: 800, height: 200 },
          props: {
            text: '',
            spans: [
              { text: 'Bold ', fontWeight: 'bold', color: '#ff0000' },
              { text: 'and ', color: '#ffffff' },
              { text: 'Italic', fontStyle: 'italic', color: '#00ff00' },
            ],
          },
        },
      },
    ],
    tips: TIPS.text,
    seeAlso: ['layer', 'fonts', 'animations'],
  };
}
