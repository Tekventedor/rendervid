import type { DocResult } from '../../types.js';
import { TIPS } from '../../descriptions.js';

export function getVideoLayerDocs(): DocResult {
  return {
    topic: 'layer/video',
    title: 'Video Layer',
    description: 'Video playback with timing, speed, volume, and fit controls.',
    properties: {
      src: { type: 'string', required: true, description: 'Video source URL or local file path', example: '/Users/name/video.mp4' },
      fit: { type: 'string', description: 'How video fits in layer bounds', default: 'contain', values: ['cover', 'contain', 'fill'] },
      loop: { type: 'boolean', description: 'Loop video playback', default: false },
      muted: { type: 'boolean', description: 'Mute audio track', default: false },
      playbackRate: { type: 'number', description: 'Playback speed multiplier (1 = normal)', default: 1, example: 0.5 },
      startTime: { type: 'number', description: 'Start playback at this time in seconds', default: 0, example: 5 },
      endTime: { type: 'number', description: 'Stop playback at this time in seconds' },
      volume: { type: 'number', description: 'Audio volume', default: 1, range: '0-1' },
    },
    tips: TIPS.video,
    examples: [
      {
        description: 'Background video layer',
        layer: {
          id: 'bg-video', type: 'video',
          position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 },
          props: { src: '/path/to/video.mp4', fit: 'cover', muted: true, loop: true },
        },
      },
    ],
    seeAlso: ['layer', 'layer/image', 'layer/audio'],
  };
}
