import type { DocResult } from '../../types.js';

export function getShapeLayerDocs(): DocResult {
  return {
    topic: 'layer/shape',
    title: 'Shape Layer',
    description: 'Geometric shapes: rectangle, ellipse, polygon, star, and custom SVG paths.',
    properties: {
      shape: { type: 'ShapeType', required: true, description: 'Shape type', values: ['rectangle', 'ellipse', 'polygon', 'star', 'path'] },
      fill: { type: 'string', description: 'Fill color (hex, rgb, rgba, CSS name)', example: '#2563eb' },
      gradient: { type: 'Gradient', description: 'Fill gradient instead of solid color' },
      stroke: { type: 'string', description: 'Stroke/border color', example: '#ffffff' },
      strokeWidth: { type: 'number', description: 'Stroke width in pixels', default: 0, example: 2 },
      strokeDash: { type: 'number[]', description: 'Stroke dash pattern array', example: [10, 5] },
      borderRadius: { type: 'number', description: 'Corner radius for rectangles', default: 0, example: 16 },
      sides: { type: 'number', description: 'Number of sides (polygon only)', example: 6 },
      points: { type: 'number', description: 'Number of points (star only)', example: 5 },
      innerRadius: { type: 'number', description: 'Inner radius ratio for stars', range: '0-1', example: 0.5 },
      pathData: { type: 'string', description: 'SVG path data (path type only)', example: 'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80' },
    },
    sections: [
      {
        title: 'Gradient Configuration',
        description: 'Use a gradient fill instead of a solid color',
        properties: {
          type: { type: '"linear" | "radial"', required: true, description: 'Gradient type' },
          colors: { type: 'GradientStop[]', required: true, description: 'Array of color stops: { offset: 0-1, color: string }' },
          angle: { type: 'number', description: 'Angle in degrees (linear gradient only)', example: 45 },
        },
        examples: [
          { type: 'linear', angle: 135, colors: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }] },
        ],
      },
    ],
    examples: [
      {
        description: 'Gradient background rectangle',
        layer: {
          id: 'bg', type: 'shape',
          position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 },
          props: {
            shape: 'rectangle',
            gradient: { type: 'linear', angle: 135, colors: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }] },
          },
        },
      },
    ],
    seeAlso: ['layer', 'layer/canvas'],
  };
}
