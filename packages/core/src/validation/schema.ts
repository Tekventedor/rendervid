import type { JSONSchema7 } from '../types';

/**
 * JSON Schema for position.
 */
export const positionSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
  },
  required: ['x', 'y'],
};

/**
 * JSON Schema for size.
 */
export const sizeSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    width: { type: 'number', minimum: 0 },
    height: { type: 'number', minimum: 0 },
  },
  required: ['width', 'height'],
};

/**
 * JSON Schema for output configuration.
 */
export const outputSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['video', 'image'] },
    width: { type: 'integer', minimum: 1, maximum: 7680 },
    height: { type: 'integer', minimum: 1, maximum: 4320 },
    fps: { type: 'integer', minimum: 1, maximum: 120 },
    duration: { type: 'number', minimum: 0 },
    backgroundColor: { type: 'string' },
  },
  required: ['type', 'width', 'height'],
};

/**
 * JSON Schema for input definition.
 */
export const inputDefinitionSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    key: { type: 'string', minLength: 1 },
    type: {
      type: 'string',
      enum: ['string', 'number', 'boolean', 'color', 'url', 'enum', 'richtext', 'date', 'array'],
    },
    label: { type: 'string' },
    description: { type: 'string' },
    required: { type: 'boolean' },
    default: {},
    validation: { type: 'object' },
    ui: { type: 'object' },
  },
  required: ['key', 'type', 'label', 'description', 'required'],
};

/**
 * JSON Schema for animation.
 */
export const animationSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['entrance', 'exit', 'emphasis', 'keyframe'] },
    effect: { type: 'string' },
    duration: { type: 'integer', minimum: 1 },
    delay: { type: 'integer', minimum: 0 },
    easing: { type: 'string' },
    keyframes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          frame: { type: 'integer', minimum: 0 },
          properties: { type: 'object' },
          easing: { type: 'string' },
        },
        required: ['frame', 'properties'],
      },
    },
    loop: { type: 'integer' },
    alternate: { type: 'boolean' },
  },
  required: ['type', 'duration'],
};

/**
 * JSON Schema for base layer properties.
 */
export const layerBaseSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    type: {
      type: 'string',
      enum: ['image', 'video', 'text', 'shape', 'audio', 'group', 'lottie', 'custom'],
    },
    name: { type: 'string' },
    position: positionSchema,
    size: sizeSchema,
    rotation: { type: 'number' },
    scale: {
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
      },
    },
    anchor: {
      type: 'object',
      properties: {
        x: { type: 'number', minimum: 0, maximum: 1 },
        y: { type: 'number', minimum: 0, maximum: 1 },
      },
    },
    from: { type: 'integer', minimum: 0 },
    duration: { type: 'integer' },
    opacity: { type: 'number', minimum: 0, maximum: 1 },
    blendMode: {
      type: 'string',
      enum: [
        'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
        'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion',
      ],
    },
    filters: { type: 'array' },
    shadow: {
      type: 'object',
      properties: {
        color: { type: 'string' },
        blur: { type: 'number', minimum: 0 },
        offsetX: { type: 'number' },
        offsetY: { type: 'number' },
      },
    },
    clipPath: { type: 'string' },
    maskLayer: { type: 'string' },
    style: { type: 'object' },
    className: { type: 'string' },
    inputKey: { type: 'string' },
    inputProperty: { type: 'string' },
    animations: { type: 'array', items: animationSchema },
    props: { type: 'object' },
    locked: { type: 'boolean' },
    hidden: { type: 'boolean' },
  },
  required: ['id', 'type', 'position', 'size'],
};

/**
 * JSON Schema for scene transition.
 */
export const transitionSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['cut', 'fade', 'slide', 'wipe', 'zoom'] },
    duration: { type: 'integer', minimum: 1 },
    direction: { type: 'string', enum: ['left', 'right', 'up', 'down'] },
    easing: { type: 'string' },
  },
  required: ['type', 'duration'],
};

/**
 * JSON Schema for scene.
 */
export const sceneSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    name: { type: 'string' },
    startFrame: { type: 'integer', minimum: 0 },
    endFrame: { type: 'integer', minimum: 1 },
    backgroundColor: { type: 'string' },
    backgroundImage: { type: 'string' },
    backgroundFit: { type: 'string', enum: ['cover', 'contain', 'fill', 'none'] },
    backgroundVideo: { type: 'string' },
    transition: transitionSchema,
    layers: {
      type: 'array',
      items: layerBaseSchema,
    },
  },
  required: ['id', 'startFrame', 'endFrame', 'layers'],
};

/**
 * JSON Schema for composition.
 */
export const compositionSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    scenes: {
      type: 'array',
      items: sceneSchema,
      minItems: 1,
    },
    assets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['image', 'video', 'audio', 'font', 'lottie'] },
          url: { type: 'string' },
          name: { type: 'string' },
        },
        required: ['id', 'type', 'url'],
      },
    },
  },
  required: ['scenes'],
};

/**
 * JSON Schema for custom component definition.
 */
export const customComponentSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['reference', 'url', 'inline'] },
    reference: { type: 'string' },
    url: { type: 'string' },
    code: { type: 'string' },
    propsSchema: { type: 'object' },
    description: { type: 'string' },
  },
  required: ['type'],
};

/**
 * Complete JSON Schema for template.
 */
export const templateSchema: JSONSchema7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Rendervid Template',
  description: 'A Rendervid video/image template',
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    version: { type: 'string' },
    author: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        url: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
    },
    tags: { type: 'array', items: { type: 'string' } },
    thumbnail: { type: 'string' },
    output: outputSchema,
    inputs: {
      type: 'array',
      items: inputDefinitionSchema,
    },
    defaults: { type: 'object' },
    customComponents: {
      type: 'object',
      additionalProperties: customComponentSchema,
    },
    composition: compositionSchema,
  },
  required: ['name', 'output', 'inputs', 'composition'],
};

/**
 * Get the template schema.
 */
export function getTemplateSchema(): JSONSchema7 {
  return templateSchema;
}

/**
 * Get schema for a specific layer type.
 */
export function getLayerSchema(type: string): JSONSchema7 | null {
  // Layer-specific props schemas would be defined here
  // For now, return the base schema
  return layerBaseSchema;
}
