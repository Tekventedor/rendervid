import type { DocResult } from '../../types.js';

export function getLottieLayerDocs(): DocResult {
  return {
    topic: 'layer/lottie',
    title: 'Lottie Layer',
    description: 'Play Lottie/Bodymovin JSON animations with speed and direction control.',
    properties: {
      data: { type: 'object | string', required: true, description: 'Lottie JSON data object or URL to JSON file' },
      loop: { type: 'boolean', description: 'Loop animation', default: false },
      speed: { type: 'number', description: 'Playback speed multiplier', default: 1, example: 1.5 },
      direction: { type: '1 | -1', description: 'Play direction (1 = forward, -1 = reverse)', default: 1 },
    },
    tips: [
      'Use a URL string for data to load from a CDN',
      'Lottie animations are resolution-independent (vector)',
    ],
    examples: [
      {
        description: 'Lottie animation from URL',
        layer: {
          id: 'anim', type: 'lottie',
          position: { x: 100, y: 100 }, size: { width: 400, height: 400 },
          props: { data: 'https://assets.lottiefiles.com/example.json', loop: true, speed: 1 },
        },
      },
    ],
    seeAlso: ['layer', 'layer/gif'],
  };
}
