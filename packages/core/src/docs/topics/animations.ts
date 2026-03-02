import type { DocResult } from '../types.js';
import { getPresetsByType, getAllPresetNames } from '../../animation/index.js';
import { TIPS } from '../descriptions.js';

export function getAnimationsDocs(): DocResult {
  const entrance = getPresetsByType('entrance');
  const exit = getPresetsByType('exit');
  const emphasis = getPresetsByType('emphasis');

  return {
    topic: 'animations',
    title: 'Animation Presets',
    description: `${getAllPresetNames().length} animation presets organized by type. Animations are applied to layers via the animations[] array.`,
    sections: [
      {
        title: 'Animation Structure',
        description: 'How to add animations to a layer',
        properties: {
          type: { type: '"entrance" | "exit" | "emphasis" | "keyframe"', required: true, description: 'Animation category' },
          effect: { type: 'string', description: 'Preset effect name (for entrance/exit/emphasis)' },
          duration: { type: 'number', required: true, description: 'Duration in frames' },
          delay: { type: 'number', description: 'Delay before animation starts (frames)', default: 0 },
          easing: { type: 'string', description: 'Easing function', default: 'easeOutCubic for entrance, easeInCubic for exit' },
          loop: { type: 'number', description: 'Loop count (-1 for infinite)', default: 1 },
          alternate: { type: 'boolean', description: 'Alternate direction on loop', default: false },
        },
        examples: [
          { type: 'entrance', effect: 'fadeIn', delay: 30, duration: 20, easing: 'easeOutCubic' },
        ],
      },
      {
        title: 'Entrance Presets',
        description: `${entrance.length} entrance animations that introduce elements`,
        properties: Object.fromEntries(
          entrance.map(p => [p.name, { type: 'preset', description: `Duration: ${p.defaultDuration}f, Easing: ${p.defaultEasing}` }])
        ),
      },
      {
        title: 'Exit Presets',
        description: `${exit.length} exit animations that remove elements`,
        properties: Object.fromEntries(
          exit.map(p => [p.name, { type: 'preset', description: `Duration: ${p.defaultDuration}f, Easing: ${p.defaultEasing}` }])
        ),
      },
      {
        title: 'Emphasis Presets',
        description: `${emphasis.length} emphasis animations that draw attention`,
        properties: Object.fromEntries(
          emphasis.map(p => [p.name, { type: 'preset', description: `Duration: ${p.defaultDuration}f, Easing: ${p.defaultEasing}` }])
        ),
      },
      {
        title: 'Keyframe Animations',
        description: 'Custom keyframe-based animations for full control',
        properties: {
          'keyframes[].frame': { type: 'number', required: true, description: 'Frame number relative to animation start' },
          'keyframes[].properties': { type: 'AnimatableProperties', required: true, description: 'Properties at this keyframe: x, y, scaleX, scaleY, rotation, opacity' },
          'keyframes[].easing': { type: 'string', description: 'Easing to next keyframe', default: 'linear' },
        },
        examples: [
          {
            type: 'keyframe', duration: 60,
            keyframes: [
              { frame: 0, properties: { opacity: 0, y: 50 } },
              { frame: 30, properties: { opacity: 1, y: 0 }, easing: 'easeOutCubic' },
              { frame: 60, properties: { opacity: 1, y: 0 } },
            ],
          },
        ],
      },
    ],
    tips: TIPS.animations,
    seeAlso: ['easings', 'layer'],
  };
}
