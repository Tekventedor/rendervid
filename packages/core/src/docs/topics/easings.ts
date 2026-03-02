import type { DocResult } from '../types.js';
import { getAllEasingNames } from '../../animation/index.js';
import { EASING_RECOMMENDATIONS } from '../descriptions.js';

export function getEasingsDocs(): DocResult {
  const allNames = getAllEasingNames();

  // Group by category
  const categories: Record<string, string[]> = {
    basic: allNames.filter(n => n === 'linear'),
    quad: allNames.filter(n => n.includes('Quad')),
    cubic: allNames.filter(n => n.includes('Cubic')),
    quart: allNames.filter(n => n.includes('Quart')),
    quint: allNames.filter(n => n.includes('Quint')),
    sine: allNames.filter(n => n.includes('Sine')),
    expo: allNames.filter(n => n.includes('Expo')),
    circ: allNames.filter(n => n.includes('Circ')),
    back: allNames.filter(n => n.includes('Back')),
    elastic: allNames.filter(n => n.includes('Elastic')),
    bounce: allNames.filter(n => n.includes('Bounce')),
  };

  return {
    topic: 'easings',
    title: 'Easing Functions',
    description: `${allNames.length} built-in easing functions that control animation acceleration. Also supports custom cubic-bezier() and spring().`,
    sections: [
      ...Object.entries(categories).map(([cat, names]) => ({
        title: cat.charAt(0).toUpperCase() + cat.slice(1),
        description: `${names.length} easing(s)`,
        properties: Object.fromEntries(
          names.map(n => {
            const direction = n.includes('InOut') ? 'in-out' : n.includes('Out') ? 'out (decelerate)' : n.includes('In') ? 'in (accelerate)' : 'constant';
            return [n, { type: 'EasingName', description: direction }];
          })
        ),
      })),
      {
        title: 'Custom Easings',
        description: 'Beyond presets, you can use custom easing values',
        properties: {
          'cubic-bezier': { type: 'string', description: 'Custom cubic bezier curve', example: 'cubic-bezier(0.25, 0.1, 0.25, 1)' },
          spring: { type: 'string', description: 'Spring physics-based easing', example: 'spring(1, 100, 10)' },
        },
      },
    ],
    tips: [
      'easeOutCubic is the best default for entrance animations',
      'easeInCubic is the best default for exit animations',
      'easeInOutCubic works well for emphasis animations',
      'easeOutBack adds a playful overshoot effect',
      'linear is best for continuous rotations',
    ],
    items: Object.entries(EASING_RECOMMENDATIONS).map(([use, easing]) => ({ useCase: use, recommended: easing })),
    seeAlso: ['animations'],
  };
}
