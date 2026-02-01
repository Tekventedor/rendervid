# Capabilities API

The Capabilities API enables AI systems and tools to discover available features at runtime.

## Overview

The capabilities API returns a comprehensive description of:
- Available layer types and their properties
- Animation presets by category
- Easing functions
- Filter types
- Output format support
- Runtime features

This self-describing interface allows AI agents to generate valid templates without hardcoding the schema.

## Usage

```typescript
import { RendervidEngine } from '@rendervid/core';

const engine = new RendervidEngine();
const capabilities = engine.getCapabilities();

console.log(capabilities.version);           // '0.1.0'
console.log(capabilities.runtime);           // 'browser' or 'node'
console.log(capabilities.animations.entrance); // ['fadeIn', 'fadeInUp', ...]
```

## EngineCapabilities Structure

```typescript
interface EngineCapabilities {
  version: string;
  elements: Record<string, ElementCapability>;
  customComponents: Record<string, ComponentInfo>;
  animations: {
    entrance: string[];
    exit: string[];
    emphasis: string[];
  };
  easings: string[];
  blendModes: string[];
  filters: string[];
  fonts: {
    builtin: string[];
    googleFonts: boolean;
    customFonts: boolean;
  };
  output: {
    video: VideoOutputCapabilities;
    image: ImageOutputCapabilities;
  };
  runtime: 'browser' | 'node';
  features: {
    tailwind: boolean;
    customComponents: boolean;
    webgl: boolean;
    webcodecs: boolean;
  };
}
```

## Elements

### ElementCapability

```typescript
interface ElementCapability {
  description: string;
  category: 'visual' | 'audio' | 'container';
  props: JSONSchema7;
  allowChildren: boolean;
  animatable: boolean;
  example: object;
}
```

### Available Elements

```typescript
const caps = engine.getCapabilities();

// Get all element types
Object.keys(caps.elements);
// ['image', 'video', 'text', 'shape', 'audio', 'group', 'lottie', 'custom']

// Get text element schema
caps.elements.text.props;
// {
//   type: 'object',
//   properties: {
//     text: { type: 'string' },
//     fontFamily: { type: 'string' },
//     fontSize: { type: 'number' },
//     ...
//   }
// }

// Get example
caps.elements.text.example;
// {
//   id: 'text-1',
//   type: 'text',
//   position: { x: 100, y: 100 },
//   size: { width: 800, height: 100 },
//   props: { text: 'Hello World', fontSize: 48, color: '#ffffff' }
// }
```

## Animations

### Animation Categories

```typescript
const caps = engine.getCapabilities();

// Entrance animations (25)
caps.animations.entrance;
// ['fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight',
//  'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
//  'scaleIn', 'scaleInUp', 'scaleInDown', 'zoomIn',
//  'rotateIn', 'rotateInClockwise', 'rotateInCounterClockwise',
//  'bounceIn', 'bounceInUp', 'bounceInDown',
//  'flipInX', 'flipInY', 'typewriter',
//  'revealLeft', 'revealRight', 'revealUp', 'revealDown']

// Exit animations (15)
caps.animations.exit;
// ['fadeOut', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight',
//  'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight',
//  'scaleOut', 'zoomOut', 'rotateOut', 'bounceOut',
//  'flipOutX', 'flipOutY']

// Emphasis animations (10)
caps.animations.emphasis;
// ['pulse', 'shake', 'bounce', 'swing', 'wobble',
//  'flash', 'rubberBand', 'heartbeat', 'float', 'spin']
```

## Easings

### Available Easings (31)

```typescript
const caps = engine.getCapabilities();

caps.easings;
// [
//   'linear',
//   'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
//   'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
//   'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
//   'easeInQuint', 'easeOutQuint', 'easeInOutQuint',
//   'easeInSine', 'easeOutSine', 'easeInOutSine',
//   'easeInExpo', 'easeOutExpo', 'easeInOutExpo',
//   'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
//   'easeInBack', 'easeOutBack', 'easeInOutBack',
//   'easeInElastic', 'easeOutElastic', 'easeInOutElastic',
//   'easeInBounce', 'easeOutBounce', 'easeInOutBounce'
// ]
```

## Filters

### Available Filters (10)

```typescript
const caps = engine.getCapabilities();

caps.filters;
// ['blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate',
//  'invert', 'opacity', 'saturate', 'sepia', 'drop-shadow']
```

## Blend Modes

```typescript
const caps = engine.getCapabilities();

caps.blendModes;
// ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
//  'color-dodge', 'color-burn', 'hard-light', 'soft-light',
//  'difference', 'exclusion']
```

## Output Capabilities

### Video Output

```typescript
const caps = engine.getCapabilities();

caps.output.video;
// {
//   formats: ['mp4', 'webm', 'mov', 'gif'],
//   codecs: ['h264', 'h265', 'vp8', 'vp9', 'av1', 'prores'],
//   maxWidth: 7680,
//   maxHeight: 4320,
//   maxDuration: 3600,  // seconds
//   maxFps: 120
// }
```

### Image Output

```typescript
caps.output.image;
// {
//   formats: ['png', 'jpeg', 'webp'],
//   maxWidth: 7680,
//   maxHeight: 4320
// }
```

## Fonts

```typescript
const caps = engine.getCapabilities();

caps.fonts;
// {
//   builtin: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'],
//   googleFonts: true,
//   customFonts: true
// }
```

## Runtime Features

```typescript
const caps = engine.getCapabilities();

caps.features;
// {
//   tailwind: true,
//   customComponents: true,
//   webgl: true,        // Browser only
//   webcodecs: true     // Browser only, Chrome 94+
// }

caps.runtime;  // 'browser' or 'node'
```

## Custom Components

```typescript
const engine = new RendervidEngine();

// Register custom components
engine.components.register('MyChart', ChartComponent, {
  type: 'object',
  properties: {
    data: { type: 'array' },
    chartType: { type: 'string', enum: ['bar', 'line', 'pie'] }
  }
});

const caps = engine.getCapabilities();

caps.customComponents;
// {
//   MyChart: {
//     name: 'MyChart',
//     propsSchema: { type: 'object', properties: { ... } }
//   }
// }
```

## AI Integration Example

```typescript
import { RendervidEngine } from '@rendervid/core';

const engine = new RendervidEngine();
const caps = engine.getCapabilities();

// Generate prompt for AI
const systemPrompt = `
You are a video template generator. Create Rendervid JSON templates.

Available layer types: ${Object.keys(caps.elements).join(', ')}

Available entrance animations: ${caps.animations.entrance.join(', ')}
Available exit animations: ${caps.animations.exit.join(', ')}
Available emphasis animations: ${caps.animations.emphasis.join(', ')}

Available easings: ${caps.easings.join(', ')}

Output constraints:
- Max video size: ${caps.output.video.maxWidth}x${caps.output.video.maxHeight}
- Max duration: ${caps.output.video.maxDuration} seconds
- Max FPS: ${caps.output.video.maxFps}

Example text layer:
${JSON.stringify(caps.elements.text.example, null, 2)}
`;

// Use with AI API
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Create a 10-second promotional video template for a new product launch' }
  ]
});
```

## Capability Checking

```typescript
import { RendervidEngine } from '@rendervid/core';

function checkRequirements(engine: RendervidEngine) {
  const caps = engine.getCapabilities();

  // Check WebCodecs support (for browser rendering)
  if (caps.runtime === 'browser' && !caps.features.webcodecs) {
    console.warn('WebCodecs not supported, using MediaRecorder fallback');
  }

  // Check for required animation
  const requiredAnimation = 'bounceIn';
  if (!caps.animations.entrance.includes(requiredAnimation)) {
    throw new Error(`Animation '${requiredAnimation}' not available`);
  }

  // Check output format support
  const requiredFormat = 'webm';
  if (!caps.output.video.formats.includes(requiredFormat)) {
    throw new Error(`Output format '${requiredFormat}' not supported`);
  }

  return true;
}
```

## Related Documentation

- [RendervidEngine](/api/core/engine) - Engine API
- [AI Integration Guide](/guides/ai-integration) - Using with AI
- [Animations](/templates/animations) - Animation reference
