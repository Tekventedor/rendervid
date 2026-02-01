---
layout: home

hero:
  name: Rendervid
  text: Video & Image Rendering Engine
  tagline: Stateless, cross-platform rendering with JSON templates and React component support
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/installation
    - theme: alt
      text: View on GitHub
      link: https://github.com/QualityUnit/rendervid

features:
  - icon: "\U0001F4DD"
    title: JSON Templates
    details: Define videos and images using simple, shareable JSON templates. Easy to generate with AI or build programmatically.
  - icon: "\U0001F3A8"
    title: Rich Animation System
    details: 25+ entrance/exit presets, 10+ emphasis animations, 31 easing functions, and full keyframe support.
  - icon: "\u2699\uFE0F"
    title: Cross-Platform
    details: Render in the browser using WebCodecs or on the server with Node.js and FFmpeg.
  - icon: "\u269B\uFE0F"
    title: React Components
    details: Use custom React components with full CSS and Tailwind support for advanced layouts.
  - icon: "\U0001F916"
    title: AI-Ready
    details: Self-describing Capabilities API enables AI agents to generate templates automatically.
  - icon: "\U0001F4E6"
    title: Modular Packages
    details: Use only what you need - core types, browser renderer, Node.js renderer, or preview player.
---

## Quick Example

```typescript
import { RendervidEngine } from '@rendervid/core';

const engine = new RendervidEngine();

const template = {
  name: 'Hello World',
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 5 },
  inputs: [
    { key: 'title', type: 'string', label: 'Title', required: true }
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

// Validate and render
const validation = engine.validateTemplate(template);
if (validation.valid) {
  const result = await engine.renderVideo({
    template,
    inputs: { title: 'Hello World!' },
  });
}
```

## Packages

| Package | Description |
|---------|-------------|
| [@rendervid/core](/api/core/engine) | Core engine, types, validation |
| [@rendervid/renderer-browser](/api/renderer-browser/renderer) | Browser-based renderer with WebCodecs |
| [@rendervid/renderer-node](/api/renderer-node/renderer) | Node.js renderer with FFmpeg |
| [@rendervid/player](/api/player/player) | React preview component |
| [@rendervid/templates](/api/templates/overview) | Pre-built themes and scene templates |

## Layer Types

Rendervid supports 8 layer types:

- **text** - Rich text with typography options
- **image** - Display images with fit options
- **video** - Play videos with playback controls
- **shape** - Rectangles, ellipses, polygons, stars, paths
- **audio** - Audio with volume and fade controls
- **group** - Container for grouping layers
- **lottie** - Lottie animations
- **custom** - Custom React components
