# Quick Start

This guide will help you create your first video with Rendervid in just a few minutes.

## Basic Example

Here's a complete example that creates a 5-second video with animated text:

```typescript
import { RendervidEngine } from '@rendervid/core';
import { createBrowserRenderer } from '@rendervid/renderer-browser';

// Create engine and renderer
const engine = new RendervidEngine();
const renderer = createBrowserRenderer();

// Define template
const template = {
  name: 'Welcome Video',
  output: {
    type: 'video',
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
  },
  inputs: [
    {
      key: 'title',
      type: 'string',
      label: 'Title',
      description: 'The main title text',
      required: true,
    },
    {
      key: 'subtitle',
      type: 'string',
      label: 'Subtitle',
      description: 'Secondary text',
      required: false,
      default: '',
    },
  ],
  composition: {
    scenes: [
      {
        id: 'main',
        startFrame: 0,
        endFrame: 150, // 5 seconds at 30fps
        backgroundColor: '#1a1a2e',
        layers: [
          {
            id: 'title',
            type: 'text',
            position: { x: 160, y: 400 },
            size: { width: 1600, height: 150 },
            inputKey: 'title',
            props: {
              fontSize: 96,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
            animations: [
              {
                type: 'entrance',
                effect: 'fadeInUp',
                delay: 0,
                duration: 30,
                easing: 'easeOutCubic',
              },
            ],
          },
          {
            id: 'subtitle',
            type: 'text',
            position: { x: 160, y: 560 },
            size: { width: 1600, height: 80 },
            inputKey: 'subtitle',
            props: {
              fontSize: 36,
              color: '#94a3b8',
              textAlign: 'center',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
            animations: [
              {
                type: 'entrance',
                effect: 'fadeIn',
                delay: 20,
                duration: 30,
              },
            ],
          },
        ],
      },
    ],
  },
};

// Validate template
const validation = engine.validateTemplate(template);
if (!validation.valid) {
  console.error('Template validation failed:', validation.errors);
  process.exit(1);
}

// Render video
const result = await renderer.renderVideo({
  template,
  inputs: {
    title: 'Welcome to Rendervid',
    subtitle: 'Create stunning videos with code',
  },
  output: {
    format: 'mp4',
    quality: 'high',
  },
});

// Download the result
const blob = new Blob([result.data], { type: 'video/mp4' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'welcome-video.mp4';
a.click();
```

## Creating an Image

For static images, change the output type:

```typescript
const template = {
  name: 'Social Media Post',
  output: {
    type: 'image',
    width: 1080,
    height: 1080,
  },
  inputs: [
    { key: 'headline', type: 'string', label: 'Headline', required: true },
  ],
  composition: {
    scenes: [
      {
        id: 'main',
        startFrame: 0,
        endFrame: 1, // Single frame for images
        backgroundColor: '#3b82f6',
        layers: [
          {
            id: 'headline',
            type: 'text',
            position: { x: 90, y: 450 },
            size: { width: 900, height: 180 },
            inputKey: 'headline',
            props: {
              fontSize: 64,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
            },
          },
        ],
      },
    ],
  },
};

const result = await renderer.renderImage({
  template,
  inputs: { headline: 'Check this out!' },
  output: { format: 'png' },
});
```

## Using the Player for Preview

The player component provides real-time preview:

```tsx
import { Player } from '@rendervid/player';

function VideoPreview({ template, inputs }) {
  return (
    <Player
      template={template}
      inputs={inputs}
      autoPlay={true}
      loop={true}
      showControls={true}
    />
  );
}
```

## Server-Side Rendering

For Node.js environments:

```typescript
import { createNodeRenderer } from '@rendervid/renderer-node';
import { writeFileSync } from 'fs';

const renderer = createNodeRenderer({
  ffmpegPath: '/usr/bin/ffmpeg', // Optional, defaults to 'ffmpeg'
});

const result = await renderer.renderVideo({
  template,
  inputs: { title: 'Server-rendered video' },
  output: {
    format: 'mp4',
    codec: 'h264',
    quality: 'high',
  },
});

writeFileSync('output.mp4', result.data);
```

## Next Steps

- [First Template](/getting-started/first-template) - Deep dive into template structure
- [Layer Types](/templates/layers) - Explore all available layer types
- [Animations](/templates/animations) - Learn about the animation system
- [Examples](/examples/) - Browse ready-to-use templates
