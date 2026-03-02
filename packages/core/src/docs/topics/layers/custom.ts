import type { DocResult } from '../../types.js';
import { TIPS } from '../../descriptions.js';

export function getCustomLayerDocs(): DocResult {
  return {
    topic: 'layer/custom',
    title: 'Custom Component Layer',
    description: 'Custom React components for advanced effects like counters, particles, charts, and complex animations.',
    properties: {
      customComponent: { type: 'CustomComponentRef', required: true, description: 'Reference to the component definition' },
    },
    sections: [
      {
        title: 'Custom Component Reference',
        description: 'The customComponent field on the layer',
        properties: {
          name: { type: 'string', required: true, description: 'Name matching a key in template.customComponents', example: 'AnimatedCounter' },
          props: { type: 'Record<string, unknown>', description: 'Custom props to pass to the component', example: { from: 0, to: 100 } },
        },
      },
      {
        title: 'Defining Components (template.customComponents)',
        description: 'Three methods to define custom components at the template root level',
        properties: {
          type: { type: '"inline" | "url" | "reference"', required: true, description: 'Component source type' },
          code: { type: 'string', description: 'Inline React code (for type: "inline")' },
          url: { type: 'string', description: 'HTTPS URL to component file (for type: "url")' },
          reference: { type: 'string', description: 'Pre-registered component name (for type: "reference")' },
          description: { type: 'string', description: 'What the component does' },
        },
      },
      {
        title: 'Auto-Injected Props',
        description: 'Props automatically provided to every custom component',
        properties: {
          frame: { type: 'number', description: 'Current frame number (0, 1, 2, ...)' },
          fps: { type: 'number', description: 'Video frame rate (e.g., 30)' },
          sceneDuration: { type: 'number', description: 'Total frames in the scene' },
          layerSize: { type: '{ width, height }', description: 'Layer dimensions in pixels' },
        },
      },
      {
        title: 'Inline Component Rules',
        description: 'Rules for type: "inline" components',
        tips: [
          'Use React.createElement() - NEVER use JSX (<div>, </div>)',
          'Plain function: function ComponentName(props) { ... }',
          'No imports, no exports, no async/await',
          'React is globally available',
          'Must be deterministic: same frame = same output',
          'No side effects (fetch, setTimeout, etc.)',
        ],
      },
      {
        title: 'React.createElement Quick Reference',
        description: 'Converting JSX to React.createElement',
        examples: [
          { jsx: '<div>Hello</div>', createElement: "React.createElement('div', null, 'Hello')" },
          { jsx: "<div style={{color: 'red'}}>Hello</div>", createElement: "React.createElement('div', { style: { color: 'red' } }, 'Hello')" },
          { jsx: '<div><span>{value}</span></div>', createElement: "React.createElement('div', null, React.createElement('span', null, value))" },
        ],
      },
    ],
    examples: [
      {
        description: 'Animated counter component',
        template: {
          customComponents: {
            AnimatedCounter: {
              type: 'inline',
              code: "function AnimatedCounter(props) { const progress = Math.min(props.frame / (props.fps * 2), 1); const value = Math.floor(props.from + (props.to - props.from) * progress); return React.createElement('div', { style: { fontSize: '72px', fontWeight: 'bold', color: '#00ffff' } }, value); }",
            },
          },
          composition: {
            scenes: [{
              layers: [{
                id: 'counter', type: 'custom',
                position: { x: 760, y: 440 }, size: { width: 400, height: 200 },
                customComponent: { name: 'AnimatedCounter', props: { from: 0, to: 100 } },
              }],
            }],
          },
        },
      },
    ],
    tips: TIPS.custom,
    seeAlso: ['layer', 'get_component_defaults'],
  };
}
