# Rendervid

A stateless, cross-platform video and image rendering engine with JSON templates and React component support.

## Features

- **Stateless Engine** - Accept JSON templates, output video/images
- **Cross-Platform** - Works in browser and Node.js
- **JSON Templates** - Easy to share, AI can generate
- **Custom React Components** - Full CSS/Tailwind support for advanced use cases
- **Rich Animation System** - 40+ presets, keyframe animations, 30+ easing functions
- **Self-Describing API** - Capabilities API for AI integration

## Packages

| Package | Description |
|---------|-------------|
| `@rendervid/core` | Core engine, types, validation |
| `@rendervid/renderer-browser` | Browser-based renderer |
| `@rendervid/renderer-node` | Node.js renderer (headless browser + FFmpeg) |
| `@rendervid/player` | React preview component |
| `@rendervid/components` | Built-in React components library |

## Quick Start

```bash
# Install core package
npm install @rendervid/core

# For browser rendering
npm install @rendervid/renderer-browser

# For server-side rendering
npm install @rendervid/renderer-node
```

## Usage

```typescript
import { RendervidEngine } from '@rendervid/core';

const engine = new RendervidEngine();

// Define a template
const template = {
  name: 'Hello World',
  output: {
    type: 'video',
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
  },
  inputs: [
    { key: 'title', type: 'string', label: 'Title', required: true },
  ],
  composition: {
    scenes: [{
      id: 'main',
      startFrame: 0,
      endFrame: 150,
      backgroundColor: '#1a1a2e',
      layers: [{
        id: 'title',
        type: 'text',
        position: { x: 960, y: 540 },
        size: { width: 1600, height: 200 },
        inputKey: 'title',
        props: {
          fontSize: 120,
          color: '#ffffff',
          textAlign: 'center',
        },
        animations: [{
          type: 'entrance',
          effect: 'fadeInUp',
          duration: 30,
        }],
      }],
    }],
  },
};

// Validate template
const validation = engine.validateTemplate(template);
if (!validation.valid) {
  console.error(validation.errors);
}

// Get capabilities (for AI integration)
const capabilities = engine.getCapabilities();
console.log(capabilities.animations); // Available animation presets
console.log(capabilities.elements);   // Available layer types

// Render video (requires renderer package)
const result = await engine.renderVideo({
  template,
  inputs: { title: 'Hello World!' },
  output: { format: 'mp4', quality: 'high' },
});
```

## Layer Types

- **image** - Display images with fit options
- **video** - Play videos with playback controls
- **text** - Rich text with typography options
- **shape** - Rectangles, ellipses, polygons, stars, paths
- **audio** - Audio with volume and fade controls
- **group** - Container for grouping layers
- **lottie** - Lottie animations
- **custom** - Custom React components

## Animation Presets

### Entrance
fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight, slideInUp, slideInDown, slideInLeft, slideInRight, scaleIn, zoomIn, rotateIn, bounceIn, and more...

### Exit
fadeOut, fadeOutUp, fadeOutDown, slideOutUp, slideOutDown, scaleOut, zoomOut, rotateOut, bounceOut, and more...

### Emphasis
pulse, shake, bounce, swing, wobble, flash, rubberBand, heartbeat, float, spin

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## License

MIT

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.
