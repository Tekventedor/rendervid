import type { DocResult } from '../types.js';
import { TIPS } from '../descriptions.js';

export function getLayerBaseDocs(): DocResult {
  return {
    topic: 'layer',
    title: 'Universal Layer Properties',
    description: 'Properties available on ALL layer types. Every layer extends LayerBase.',
    sections: [
      {
        title: 'Identity',
        description: 'Required identification fields',
        properties: {
          id: { type: 'string', required: true, description: 'Unique layer identifier (must be unique across all scenes)', example: 'scene1-title' },
          type: { type: 'LayerType', required: true, description: 'Layer type', values: ['text', 'image', 'video', 'shape', 'audio', 'group', 'lottie', 'custom', 'three', 'gif', 'canvas', 'caption'] },
          name: { type: 'string', description: 'Display name (for editor UI)' },
        },
      },
      {
        title: 'Transform',
        description: 'Position, size, rotation, scale, and anchor',
        properties: {
          position: { type: '{ x: number, y: number }', required: true, description: 'Position in pixels from top-left corner', example: { x: 100, y: 200 } },
          size: { type: '{ width: number, height: number }', required: true, description: 'Dimensions in pixels', example: { width: 800, height: 600 } },
          rotation: { type: 'number', description: 'Rotation in degrees', default: 0, example: 45 },
          scale: { type: '{ x: number, y: number }', description: 'Scale multiplier (1 = 100%)', default: { x: 1, y: 1 }, example: { x: 1.5, y: 1.5 } },
          anchor: { type: '{ x: number, y: number }', description: 'Anchor point (0-1 range, 0.5 = center)', default: { x: 0.5, y: 0.5 } },
        },
      },
      {
        title: 'Timing',
        description: 'Control when layers appear within a scene',
        properties: {
          from: { type: 'number', description: 'Start frame within scene (relative to scene startFrame)', default: 0, example: 30 },
          duration: { type: 'number', description: 'Duration in frames. -1 = entire scene duration', default: -1, example: 60 },
        },
      },
      {
        title: 'Appearance',
        description: 'Visual properties',
        properties: {
          opacity: { type: 'number', description: 'Layer opacity', default: 1, range: '0-1', example: 0.8 },
          blendMode: { type: 'BlendMode', description: 'Compositing blend mode', default: 'normal', values: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion'] },
          filters: { type: 'Filter[]', description: 'CSS filters (blur, brightness, contrast, etc.). See get_docs({ topic: "filters" })' },
          shadow: { type: '{ color, blur, offsetX, offsetY }', description: 'Drop shadow effect', example: { color: 'rgba(0,0,0,0.5)', blur: 10, offsetX: 2, offsetY: 2 } },
          clipPath: { type: 'string', description: 'SVG path to clip layer to', example: 'M0,0 L100,0 L100,100 Z' },
          maskLayer: { type: 'string', description: 'ID of another layer to use as mask' },
        },
      },
      {
        title: 'Styling',
        description: 'Tailwind-like style properties',
        properties: {
          style: { type: 'LayerStyle', description: 'Tailwind-like utility styles. See get_docs({ topic: "style" })' },
          className: { type: 'string', description: 'Tailwind CSS class names' },
        },
      },
      {
        title: 'Input Binding',
        description: 'Bind layer properties to template inputs',
        properties: {
          inputKey: { type: 'string', description: 'Bind this layer to an input key' },
          inputProperty: { type: 'string', description: 'Which property to bind (default depends on layer type)' },
        },
      },
      {
        title: 'Animation',
        description: 'Animations applied to this layer',
        properties: {
          animations: { type: 'Animation[]', description: 'Array of animations. See get_docs({ topic: "animations" })' },
        },
      },
      {
        title: 'Motion Blur',
        description: 'Per-layer motion blur override',
        properties: {
          motionBlur: { type: 'MotionBlurConfig', description: 'Layer-level motion blur config. See get_docs({ topic: "motion-blur" })' },
        },
      },
      {
        title: 'Metadata',
        description: 'Editor and visibility controls',
        properties: {
          locked: { type: 'boolean', description: 'Lock layer in editor (prevents edits)', default: false },
          hidden: { type: 'boolean', description: 'Hide layer from rendering', default: false },
        },
      },
    ],
    tips: TIPS.layer,
    seeAlso: ['layer/text', 'layer/image', 'layer/video', 'layer/shape', 'layer/audio', 'layer/group', 'layer/lottie', 'layer/gif', 'layer/caption', 'layer/canvas', 'layer/three', 'layer/custom', 'animations', 'filters', 'style'],
  };
}
