import type { DocResult } from '../types.js';
import { TRANSITION_DESCRIPTIONS } from '../descriptions.js';

export function getTransitionsDocs(): DocResult {
  return {
    topic: 'transitions',
    title: 'Scene Transitions',
    description: `${Object.keys(TRANSITION_DESCRIPTIONS).length} transition types for switching between scenes.`,
    properties: Object.fromEntries(
      Object.entries(TRANSITION_DESCRIPTIONS).map(([key, desc]) => [
        key, { type: 'TransitionType', description: desc },
      ])
    ),
    sections: [
      {
        title: 'SceneTransition Structure',
        description: 'How to configure a transition on a scene',
        properties: {
          type: { type: 'TransitionType', required: true, description: 'Transition effect type' },
          duration: { type: 'number', required: true, description: 'Duration in frames', example: 30 },
          direction: { type: '"left" | "right" | "up" | "down"', description: 'Direction for slide, wipe, push transitions' },
          easing: { type: 'string', description: 'Easing function', example: 'easeInOutCubic' },
          spring: { type: '{ mass?, stiffness?, damping? }', description: 'Spring-based timing (alternative to easing)' },
        },
      },
    ],
    examples: [
      { transition: { type: 'fade', duration: 30 } },
      { transition: { type: 'slide', duration: 20, direction: 'left', easing: 'easeOutCubic' } },
      { transition: { type: 'cube', duration: 45, easing: 'easeInOutBack' } },
    ],
    seeAlso: ['scene', 'easings'],
  };
}
