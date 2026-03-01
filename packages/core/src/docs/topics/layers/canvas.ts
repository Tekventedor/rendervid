import type { DocResult } from '../../types.js';

export function getCanvasLayerDocs(): DocResult {
  return {
    topic: 'layer/canvas',
    title: 'Canvas Layer',
    description: 'Programmatic 2D drawing with paths, gradients, shapes, text on path, and patterns.',
    properties: {
      commands: { type: 'CanvasDrawCommand[]', required: true, description: 'Array of drawing commands to execute in order' },
      backgroundColor: { type: 'string', description: 'Canvas background color' },
      antialias: { type: 'boolean', description: 'Enable anti-aliasing', default: true },
    },
    sections: [
      {
        title: 'Draw Command Types',
        description: 'Each command in the commands array has a type and type-specific properties',
        properties: {
          path: { type: 'CanvasDrawCommand', description: 'Draw an SVG path with fill/stroke' },
          gradient: { type: 'CanvasDrawCommand', description: 'Draw a gradient (linear, radial, or conic)' },
          textOnPath: { type: 'CanvasDrawCommand', description: 'Render text along an SVG path' },
          pattern: { type: 'CanvasDrawCommand', description: 'Fill with a repeating pattern' },
          clipPath: { type: 'CanvasDrawCommand', description: 'Set clipping region using SVG path' },
          circle: { type: 'CanvasDrawCommand', description: 'Draw a circle with cx, cy, r' },
          rect: { type: 'CanvasDrawCommand', description: 'Draw a rectangle with x, y, width, height' },
          line: { type: 'CanvasDrawCommand', description: 'Draw a line from (x1,y1) to (x2,y2)' },
        },
      },
      {
        title: 'Common Command Properties',
        description: 'Properties shared across command types',
        properties: {
          type: { type: 'CanvasDrawCommandType', required: true, description: 'Command type', values: ['path', 'gradient', 'textOnPath', 'pattern', 'clipPath', 'circle', 'rect', 'line'] },
          fill: { type: 'string', description: 'Fill color' },
          stroke: { type: 'string', description: 'Stroke color' },
          strokeWidth: { type: 'number', description: 'Stroke width in pixels' },
          strokeDash: { type: 'number[]', description: 'Stroke dash pattern' },
          lineCap: { type: 'string', description: 'Line cap style', values: ['butt', 'round', 'square'] },
          lineJoin: { type: 'string', description: 'Line join style', values: ['miter', 'round', 'bevel'] },
          opacity: { type: 'number', description: 'Command opacity', range: '0-1' },
          pathData: { type: 'string', description: 'SVG path data (for path, textOnPath, clipPath commands)' },
        },
      },
      {
        title: 'Circle Properties',
        description: 'Additional properties for circle command',
        properties: {
          cx: { type: 'number', description: 'Center X coordinate' },
          cy: { type: 'number', description: 'Center Y coordinate' },
          r: { type: 'number', description: 'Radius' },
        },
      },
      {
        title: 'Rectangle Properties',
        description: 'Additional properties for rect command',
        properties: {
          x: { type: 'number', description: 'X coordinate' },
          y: { type: 'number', description: 'Y coordinate' },
          width: { type: 'number', description: 'Width' },
          height: { type: 'number', description: 'Height' },
          borderRadius: { type: 'number', description: 'Corner radius' },
        },
      },
      {
        title: 'Gradient Configuration',
        description: 'Configuration for gradient draw commands',
        properties: {
          'gradient.type': { type: 'string', required: true, description: 'Gradient type', values: ['linear', 'radial', 'conic'] },
          'gradient.stops': { type: 'GradientStop[]', required: true, description: 'Color stops: { offset: 0-1, color: string }' },
          'gradient.x0': { type: 'number', description: 'Start X (linear) or center X (radial/conic)' },
          'gradient.y0': { type: 'number', description: 'Start Y (linear) or center Y (radial/conic)' },
          'gradient.x1': { type: 'number', description: 'End X (linear)' },
          'gradient.y1': { type: 'number', description: 'End Y (linear)' },
          'gradient.r0': { type: 'number', description: 'Inner radius (radial)' },
          'gradient.r1': { type: 'number', description: 'Outer radius (radial)' },
          'gradient.startAngle': { type: 'number', description: 'Start angle in degrees (conic)' },
        },
      },
    ],
    examples: [
      {
        description: 'Canvas with circle and rectangle',
        layer: {
          id: 'drawing', type: 'canvas',
          position: { x: 0, y: 0 }, size: { width: 800, height: 600 },
          props: {
            commands: [
              { type: 'rect', x: 0, y: 0, width: 800, height: 600, fill: '#1a1a2e' },
              { type: 'circle', cx: 400, cy: 300, r: 100, fill: '#e94560', stroke: '#ffffff', strokeWidth: 2 },
            ],
          },
        },
      },
    ],
    seeAlso: ['layer', 'layer/shape'],
  };
}
