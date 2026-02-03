# @rendervid/renderer-browser

Browser-based renderer for Rendervid templates. Renders videos and images using React, WebCodecs, and MediaRecorder APIs.

## Installation

```bash
npm install @rendervid/renderer-browser
# or
yarn add @rendervid/renderer-browser
# or
pnpm add @rendervid/renderer-browser
```

## Quick Start

### Render a Video

```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';

const renderer = createBrowserRenderer();

const template = {
  name: "Hello World",
  output: {
    type: "video",
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5
  },
  composition: {
    scenes: [{
      id: "main",
      layers: [{
        type: "text",
        props: {
          text: "Hello, Rendervid!",
          fontSize: 72,
          color: "#ffffff"
        },
        position: { x: 960, y: 540 }
      }]
    }]
  }
};

const result = await renderer.renderVideo({ template });

// Download the video
const url = URL.createObjectURL(result.blob);
const a = document.createElement('a');
a.href = url;
a.download = 'video.mp4';
a.click();
```

### Render an Image

```typescript
const result = await renderer.renderImage({
  template,
  frame: 0,
  format: 'png'
});

// Use the image
const imageUrl = URL.createObjectURL(result.blob);
```

## Custom Components

Create dynamic, animated components directly in templates:

```typescript
const template = {
  customComponents: {
    "AnimatedCounter": {
      type: "inline",
      code: `function AnimatedCounter(props) {
        const progress = Math.min(props.frame / (props.fps * 2), 1);
        const value = Math.floor(props.from + (props.to - props.from) * progress);
        return React.createElement('div', {
          style: { fontSize: '72px', fontWeight: 'bold', color: '#00ffff' }
        }, value);
      }`
    }
  },
  composition: {
    scenes: [{
      layers: [{
        type: "custom",
        customComponent: {
          name: "AnimatedCounter",
          props: { from: 0, to: 100 }
        }
      }]
    }]
  }
};
```

### Component Interface

All custom components receive:

```typescript
interface ComponentProps {
  frame: number;         // Current frame number
  fps: number;           // Frames per second
  sceneDuration: number; // Total scene frames
  layerSize: {
    width: number;
    height: number;
  };
  // + your custom props
}
```

### With Input Variables

```typescript
const template = {
  inputs: [
    { key: "userName", type: "string" },
    { key: "score", type: "number" }
  ],
  composition: {
    scenes: [{
      layers: [{
        type: "text",
        props: {
          text: "{{userName}}: {{score}} points"
        }
      }]
    }]
  }
};

const result = await renderer.renderVideo({
  template,
  inputs: {
    userName: "Alice",
    score: 1000
  }
});
```

## API Reference

### createBrowserRenderer(options?)

Creates a new browser renderer instance.

```typescript
const renderer = createBrowserRenderer({
  container?: HTMLElement,      // Custom render container
  registry?: ComponentRegistry, // Custom component registry
  preferWebCodecs?: boolean     // Use WebCodecs (default: true)
});
```

### renderer.renderVideo(options)

Renders a video from a template.

```typescript
const result = await renderer.renderVideo({
  template: Template,           // Required: Template to render
  inputs?: Record<string, any>, // Optional: Input values
  format?: 'mp4' | 'webm',     // Optional: Output format (default: 'mp4')
  bitrate?: number,            // Optional: Video bitrate
  onProgress?: (progress) => void,  // Optional: Progress callback
  onFrame?: (frame, total) => void  // Optional: Frame callback
});

// Result
{
  blob: Blob,
  duration: number,
  frameCount: number,
  size: number,
  mimeType: string
}
```

### renderer.renderImage(options)

Renders a single frame as an image.

```typescript
const result = await renderer.renderImage({
  template: Template,           // Required: Template to render
  inputs?: Record<string, any>, // Optional: Input values
  sceneIndex?: number,         // Optional: Scene index (default: 0)
  frame?: number,              // Optional: Frame number (default: 0)
  format?: 'png' | 'jpeg' | 'webp', // Optional: Format (default: 'png')
  quality?: number             // Optional: Quality 0-1 (default: 0.95)
});

// Result
{
  blob: Blob,
  width: number,
  height: number,
  size: number,
  mimeType: string
}
```

### renderer.registerComponent(name, component)

Register a custom component for use in templates.

```typescript
function MyComponent(props) {
  return <div>{props.frame}</div>;
}

renderer.registerComponent('MyComponent', MyComponent);

// Now use in templates with type: "reference"
{
  "customComponents": {
    "Counter": {
      "type": "reference",
      "reference": "MyComponent"
    }
  }
}
```

### renderer.getRegistry()

Get the component registry.

```typescript
const registry = renderer.getRegistry();

// Register from URL
await registry.registerFromUrl('Chart', 'https://cdn.example.com/Chart.js');

// Register from code
registry.registerFromCode('Simple', 'function Simple(props) { ... }');

// Set allowed domains for security
registry.setAllowedDomains(['cdn.example.com']);
```

### renderer.isWebCodecsSupported()

Check if WebCodecs API is supported.

```typescript
if (renderer.isWebCodecsSupported()) {
  console.log('High-quality encoding available!');
}
```

### renderer.dispose()

Clean up renderer resources.

```typescript
renderer.dispose();
```

## Examples

### Progress Callback

```typescript
await renderer.renderVideo({
  template,
  onProgress: (progress) => {
    console.log(`${progress.percentage.toFixed(1)}% complete`);
    console.log(`Frame ${progress.currentFrame}/${progress.totalFrames}`);
    console.log(`Phase: ${progress.phase}`);
    console.log(`ETA: ${progress.estimatedTimeRemaining}s`);
  }
});
```

### Multiple Custom Components

```typescript
const template = {
  customComponents: {
    "Counter": { type: "inline", code: "..." },
    "ProgressBar": { type: "inline", code: "..." },
    "Chart": { type: "url", url: "https://..." }
  },
  composition: {
    scenes: [{
      layers: [
        { type: "custom", customComponent: { name: "Counter", props: {...} } },
        { type: "custom", customComponent: { name: "ProgressBar", props: {...} } },
        { type: "custom", customComponent: { name: "Chart", props: {...} } }
      ]
    }]
  }
};
```

### Particle System Example

```typescript
const particleSystem = {
  customComponents: {
    "Particles": {
      type: "inline",
      code: `function Particles(props) {
        const particles = [];
        for (let i = 0; i < 100; i++) {
          const angle = (i / 100) * Math.PI * 2;
          const distance = props.frame * 3;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          particles.push(
            React.createElement('circle', {
              key: i,
              cx: x + props.layerSize.width / 2,
              cy: y + props.layerSize.height / 2,
              r: 3,
              fill: 'hsl(' + (i * 3.6) + ', 100%, 60%)'
            })
          );
        }
        return React.createElement('svg', {
          width: props.layerSize.width,
          height: props.layerSize.height
        }, ...particles);
      }`
    }
  }
};
```

## Browser Support

- Chrome 94+ (WebCodecs support)
- Firefox 90+ (MediaRecorder fallback)
- Safari 14+ (MediaRecorder fallback)
- Edge 94+ (WebCodecs support)

## Performance Tips

1. **Use WebCodecs when available** - Much faster and higher quality
2. **Optimize custom components** - Keep render logic simple
3. **Reduce particle counts** - Start small, increase gradually
4. **Use appropriate FPS** - 30 FPS for most content, 60 FPS for smooth effects
5. **Enable progress callbacks** - Monitor rendering progress

## Security

### Custom Components

- **Inline components** are validated against dangerous patterns (eval, innerHTML, etc.)
- **URL components** must use HTTPS
- **Domain allowlist** available for production: `registry.setAllowedDomains(['trusted.com'])`
- **Reference components** are pre-registered and fully trusted

### Best Practices

1. Use `type: "reference"` for production (most secure)
2. Use `type: "url"` only from trusted CDNs
3. Avoid `type: "inline"` in production
4. Always validate user inputs
5. Configure domain allowlists

## Troubleshooting

### Video encoding fails
- Check if WebCodecs is supported
- Try fallback to MediaRecorder
- Reduce video dimensions or duration

### Custom component not rendering
- Verify component name matches exactly
- Check component code for syntax errors
- Ensure component is in `customComponents` object

### Slow rendering
- Reduce FPS (60 → 30)
- Simplify custom components
- Reduce particle counts
- Use smaller dimensions

## Documentation

- [Complete Custom Components Guide](../../docs/custom-components.md)
- [AI Agent Guide](../../docs/custom-components-ai-guide.md)
- [Development Tutorial](../../examples/custom-components/DEVELOPMENT_EXAMPLE.md)
- [9 Example Templates](../../examples/custom-components/)

## License

Same as Rendervid project - check repository LICENSE file.
