import type { DocResult } from '../types.js';
import { TIPS } from '../descriptions.js';

export function getTemplateDocs(): DocResult {
  return {
    topic: 'template',
    title: 'Template Structure',
    description: 'A Rendervid template is a JSON object that defines the complete structure of a video or image.',
    properties: {
      name: { type: 'string', required: true, description: 'Template name', example: 'My Video' },
      description: { type: 'string', description: 'What this template creates' },
      version: { type: 'string', description: 'Semantic version', example: '1.0.0' },
      output: { type: 'OutputConfig', required: true, description: 'Output configuration (dimensions, fps, duration)' },
      inputs: { type: 'InputDefinition[]', required: true, description: 'Customizable input definitions. Use [] for static templates', example: [] },
      defaults: { type: 'Record<string, unknown>', description: 'Default values for inputs', example: { title: 'Hello World' } },
      customComponents: { type: 'Record<string, CustomComponentDefinition>', description: 'Custom React components used in this template' },
      fonts: { type: 'FontConfiguration', description: 'Google Fonts and custom font configuration' },
      composition: { type: 'Composition', required: true, description: 'Scenes and layers that make up the content' },
    },
    sections: [
      {
        title: 'Output Configuration',
        description: 'The output field controls dimensions, format, and timing',
        properties: {
          type: { type: '"video" | "image"', required: true, description: 'Output type', example: 'video' },
          width: { type: 'number', required: true, description: 'Canvas width in pixels', example: 1920 },
          height: { type: 'number', required: true, description: 'Canvas height in pixels', example: 1080 },
          fps: { type: 'number', description: 'Frames per second (video only)', default: 30, example: 30 },
          duration: { type: 'number', description: 'Duration in seconds (video only)', example: 5 },
          backgroundColor: { type: 'string', description: 'Background color', default: '#000000' },
        },
      },
      {
        title: 'Composition',
        description: 'Contains scenes array and optional assets',
        properties: {
          scenes: { type: 'Scene[]', required: true, description: 'Array of scenes in chronological order' },
          assets: { type: 'AssetDefinition[]', description: 'Global assets to preload (images, videos, audio, fonts)' },
        },
      },
    ],
    examples: [
      {
        description: 'Minimal static template',
        template: {
          name: 'Hello World',
          output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 3 },
          inputs: [],
          composition: {
            scenes: [{
              id: 'main',
              startFrame: 0,
              endFrame: 90,
              layers: [{
                id: 'title',
                type: 'text',
                position: { x: 160, y: 440 },
                size: { width: 1600, height: 200 },
                props: { text: 'Hello World', fontSize: 72, color: '#ffffff', textAlign: 'center' },
              }],
            }],
          },
        },
      },
    ],
    tips: TIPS.template,
    seeAlso: ['scene', 'layer', 'inputs', 'fonts'],
  };
}
