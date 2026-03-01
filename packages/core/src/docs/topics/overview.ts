import type { DocResult } from '../types.js';
import { LAYER_DESCRIPTIONS, TRANSITION_DESCRIPTIONS } from '../descriptions.js';
import { getAllPresetNames, getPresetsByType, getAllEasingNames } from '../../animation/index.js';

export function getOverviewDocs(): DocResult {
  const entranceCount = getPresetsByType('entrance').length;
  const exitCount = getPresetsByType('exit').length;
  const emphasisCount = getPresetsByType('emphasis').length;
  const easingCount = getAllEasingNames().length;
  const transitionCount = Object.keys(TRANSITION_DESCRIPTIONS).length;

  return {
    topic: 'overview',
    title: 'Rendervid Overview',
    description: 'Rendervid is a programmatic video/image generation engine. Templates are JSON objects with scenes, layers, animations, and inputs.',
    sections: [
      {
        title: 'Layer Types',
        description: '12 layer types available',
        properties: Object.fromEntries(
          Object.entries(LAYER_DESCRIPTIONS).map(([key, desc]) => [
            key,
            { type: 'layer', description: desc },
          ])
        ),
      },
      {
        title: 'Capabilities Summary',
        description: 'Animation presets, easings, transitions, and output formats',
        properties: {
          animationPresets: { type: 'number', description: `${entranceCount + exitCount + emphasisCount} total: ${entranceCount} entrance, ${exitCount} exit, ${emphasisCount} emphasis` },
          easingFunctions: { type: 'number', description: `${easingCount} built-in easings + custom cubic-bezier() and spring()` },
          sceneTransitions: { type: 'number', description: `${transitionCount} transition types between scenes` },
          videoFormats: { type: 'string', description: 'MP4, WebM, MOV, GIF' },
          imageFormats: { type: 'string', description: 'PNG, JPEG, WebP' },
          maxResolution: { type: 'string', description: '7680x4320 (8K)' },
        },
      },
    ],
    tips: [
      'Start with get_docs({ topic: "template" }) to learn the template structure',
      'Use get_docs({ topic: "layer/<type>" }) for layer-specific properties',
      'Use get_docs({ topic: "animations" }) for animation presets',
    ],
    seeAlso: ['template', 'layer', 'animations', 'easings', 'transitions'],
  };
}
