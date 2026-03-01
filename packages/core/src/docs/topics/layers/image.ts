import type { DocResult } from '../../types.js';

export function getImageLayerDocs(): DocResult {
  return {
    topic: 'layer/image',
    title: 'Image Layer',
    description: 'Display images with fit modes. Supports URLs, local file paths (auto-converted to base64), and data URIs.',
    properties: {
      src: { type: 'string', required: true, description: 'Image source: HTTPS URL, local file path, or data URI', example: 'https://images.unsplash.com/photo-...' },
      fit: { type: 'string', description: 'How image fits in layer bounds', default: 'contain', values: ['cover', 'contain', 'fill', 'none'] },
      objectPosition: { type: 'string', description: 'CSS object-position value', example: 'center top' },
    },
    tips: [
      'Local file paths are auto-converted to base64 data URLs',
      'Large images (>500KB) are auto-resized for performance',
      'Use absolute paths for local files, not relative',
      'Set renderWaitTime: 500 when using image layers',
    ],
    examples: [
      {
        description: 'Full-bleed background image',
        layer: {
          id: 'bg', type: 'image',
          position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 },
          props: { src: 'https://images.unsplash.com/photo-example', fit: 'cover' },
        },
      },
    ],
    seeAlso: ['layer', 'layer/video', 'layer/gif'],
  };
}
