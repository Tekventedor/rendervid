import type { DocResult } from '../types.js';
import { TRANSITION_DESCRIPTIONS, TIPS } from '../descriptions.js';

export function getSceneDocs(): DocResult {
  return {
    topic: 'scene',
    title: 'Scene Configuration',
    description: 'Scenes are segments of a composition with their own layers, timing, and optional transitions.',
    properties: {
      id: { type: 'string', required: true, description: 'Unique scene identifier', example: 'intro' },
      name: { type: 'string', description: 'Display name' },
      startFrame: { type: 'number', required: true, description: 'Start frame (0-based, inclusive)', example: 0 },
      endFrame: { type: 'number', required: true, description: 'End frame (exclusive). Duration = endFrame - startFrame', example: 150 },
      backgroundColor: { type: 'string', description: 'Scene background color', example: '#1a1a2e' },
      backgroundImage: { type: 'string', description: 'Background image URL' },
      backgroundFit: { type: '"cover" | "contain" | "fill" | "none"', description: 'Background image fit mode' },
      backgroundVideo: { type: 'string', description: 'Background video URL' },
      transition: { type: 'SceneTransition', description: 'Transition to next scene' },
      motionBlur: { type: 'MotionBlurConfig', description: 'Scene-level motion blur override' },
      hidden: { type: 'boolean', description: 'Skip this scene during rendering', default: false },
      layers: { type: 'Layer[]', required: true, description: 'Layers in this scene' },
    },
    sections: [
      {
        title: 'Scene Transitions',
        description: 'Configure how one scene transitions to the next. Set on the outgoing scene.',
        properties: {
          type: { type: 'TransitionType', required: true, description: 'Transition effect type', values: Object.keys(TRANSITION_DESCRIPTIONS) },
          duration: { type: 'number', required: true, description: 'Transition duration in frames', example: 30 },
          direction: { type: '"left" | "right" | "up" | "down"', description: 'Direction for directional transitions (slide, wipe, push)' },
          easing: { type: 'string', description: 'Easing function for the transition', example: 'easeInOutCubic' },
          spring: { type: '{ mass?, stiffness?, damping? }', description: 'Spring-based timing (replaces easing)' },
        },
      },
      {
        title: 'Transition Types',
        description: `${Object.keys(TRANSITION_DESCRIPTIONS).length} available transition types`,
        properties: Object.fromEntries(
          Object.entries(TRANSITION_DESCRIPTIONS).map(([key, desc]) => [
            key,
            { type: 'TransitionType', description: desc },
          ])
        ),
      },
    ],
    examples: [
      {
        description: 'Scene with fade transition',
        scene: {
          id: 'scene-1',
          startFrame: 0,
          endFrame: 150,
          backgroundColor: '#1a1a2e',
          transition: { type: 'fade', duration: 30, easing: 'easeInOutCubic' },
          layers: [],
        },
      },
    ],
    tips: TIPS.scene,
    seeAlso: ['template', 'layer', 'transitions'],
  };
}
