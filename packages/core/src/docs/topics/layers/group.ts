import type { DocResult } from '../../types.js';

export function getGroupLayerDocs(): DocResult {
  return {
    topic: 'layer/group',
    title: 'Group Layer',
    description: 'Container for organizing and optionally clipping child layers. Children inherit the group\'s coordinate space.',
    properties: {
      clip: { type: 'boolean', description: 'Clip children to group bounds', default: false },
    },
    tips: [
      'Group layers have a children[] array instead of just props',
      'Children are positioned relative to the group\'s position',
      'Set clip: true to hide content that extends beyond group bounds',
      'Groups can be animated as a unit (all children move together)',
    ],
    examples: [
      {
        description: 'Clipped group with children',
        layer: {
          id: 'card', type: 'group',
          position: { x: 100, y: 100 }, size: { width: 400, height: 300 },
          props: { clip: true },
          children: [
            { id: 'card-bg', type: 'shape', position: { x: 0, y: 0 }, size: { width: 400, height: 300 }, props: { shape: 'rectangle', fill: '#ffffff', borderRadius: 16 } },
            { id: 'card-text', type: 'text', position: { x: 20, y: 20 }, size: { width: 360, height: 260 }, props: { text: 'Card content', fontSize: 24, color: '#000000' } },
          ],
        },
      },
    ],
    seeAlso: ['layer'],
  };
}
