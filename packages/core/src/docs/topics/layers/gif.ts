import type { DocResult } from '../../types.js';

export function getGifLayerDocs(): DocResult {
  return {
    topic: 'layer/gif',
    title: 'GIF Layer',
    description: 'Animated GIF images with frame-synced playback. GIF frames are synchronized to the video timeline.',
    properties: {
      src: { type: 'string', required: true, description: 'GIF source URL or data URI', example: 'https://example.com/animation.gif' },
      fit: { type: 'string', description: 'How GIF fits in layer bounds', default: 'cover', values: ['cover', 'contain', 'fill', 'none'] },
      loop: { type: 'boolean', description: 'Loop the GIF animation', default: true },
      speed: { type: 'number', description: 'Playback speed multiplier', default: 1, example: 1.5 },
      startFrame: { type: 'number', description: 'Start from specific GIF frame', default: 0 },
    },
    examples: [
      {
        description: 'Animated sticker',
        layer: {
          id: 'sticker', type: 'gif',
          position: { x: 100, y: 100 }, size: { width: 300, height: 300 },
          props: { src: 'https://example.com/sticker.gif', fit: 'contain', loop: true },
        },
      },
    ],
    seeAlso: ['layer', 'layer/image', 'layer/lottie'],
  };
}
