import type { DocResult } from '../types.js';
import { FILTER_DESCRIPTIONS } from '../descriptions.js';

export function getFiltersDocs(): DocResult {
  return {
    topic: 'filters',
    title: 'CSS Filters',
    description: '10 filter types that can be applied to any layer via the filters[] array. Filters can be animated over time.',
    properties: Object.fromEntries(
      Object.entries(FILTER_DESCRIPTIONS).map(([key, info]) => [
        key, { type: 'FilterType', description: `${info.description}. Unit: ${info.unit}. Default: ${info.default}`, range: info.range },
      ])
    ),
    sections: [
      {
        title: 'Filter Structure',
        description: 'Each filter in the filters[] array',
        properties: {
          type: { type: 'FilterType', required: true, description: 'Filter type' },
          value: { type: 'number | string', required: true, description: 'Filter value (units depend on type)' },
          animate: { type: 'FilterAnimation', description: 'Animate filter value over time' },
        },
      },
      {
        title: 'Filter Animation',
        description: 'Animate a filter value over time',
        properties: {
          from: { type: 'number', required: true, description: 'Starting value' },
          to: { type: 'number', required: true, description: 'Ending value' },
          duration: { type: 'number', required: true, description: 'Duration in frames' },
          easing: { type: 'string', description: 'Easing function' },
        },
      },
    ],
    examples: [
      { description: 'Blur filter', filter: { type: 'blur', value: 5 } },
      { description: 'Animated brightness', filter: { type: 'brightness', value: 1, animate: { from: 0.5, to: 1.5, duration: 60, easing: 'easeInOutSine' } } },
    ],
    seeAlso: ['layer', 'style'],
  };
}
