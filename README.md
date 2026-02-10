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

## Custom Components

Create **dynamic, animated React components** directly in templates for effects beyond built-in components.

### Why Use Custom Components?

- ✅ **Animated counters & timers** - Smooth number animations
- ✅ **Particle systems** - Explosions, confetti, snow effects
- ✅ **Data visualizations** - Custom charts and graphs
- ✅ **3D effects** - CSS transforms and perspective
- ✅ **Physics simulations** - Gravity, collisions, motion
- ✅ **Procedural graphics** - Dynamic SVG animations

### Quick Start

```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';

// 1. Create a template with a custom component
const template = {
  name: "Animated Counter",
  output: { type: "video", width: 1920, height: 1080, fps: 30, duration: 3 },
  customComponents: {
    "Counter": {
      "type": "inline",
      "code": "function Counter(props) { const progress = Math.min(props.frame / (props.fps * 2), 1); const value = Math.floor(props.from + (props.to - props.from) * progress); return React.createElement('div', { style: { fontSize: '72px', fontWeight: 'bold', color: '#00ffff' } }, value); }"
    }
  },
  composition: {
    scenes: [{
      layers: [{
        type: "custom",
        customComponent: {
          name: "Counter",
          props: { from: 0, to: 100 }
        }
      }]
    }]
  }
};

// 2. Render the video
const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });

// 3. Download or use the video
const url = URL.createObjectURL(result.blob);
```

### Three Component Types

**1. Inline (Quick & Self-Contained)**
```json
{
  "type": "inline",
  "code": "function MyComponent(props) { return React.createElement('div', {}, props.frame); }"
}
```
✅ Best for: Simple components, prototyping, self-contained demos

**2. URL (Shared & Reusable)**
```json
{
  "type": "url",
  "url": "https://cdn.example.com/MyComponent.js"
}
```
✅ Best for: Sharing components, external libraries, team collaboration

**3. Reference (Pre-Registered)**
```json
{
  "type": "reference",
  "reference": "AnimatedChart"
}
```
✅ Best for: Production apps, type-safe components, trusted code

### Component Interface

Every custom component receives these props automatically:

```typescript
interface ComponentProps {
  frame: number;         // Current frame (0, 1, 2, ...)
  fps: number;           // Frames per second (30, 60)
  sceneDuration: number; // Total frames in scene
  layerSize: {
    width: number;
    height: number;
  };
  // + your custom props
}
```

### Input Variable Binding

Use `{{variableName}}` to make components dynamic:

```json
{
  "inputs": [
    { "key": "title", "type": "string" },
    { "key": "count", "type": "number" }
  ],
  "composition": {
    "scenes": [{
      "layers": [{
        "type": "custom",
        "customComponent": {
          "name": "Counter",
          "props": {
            "text": "{{title}}",
            "to": "{{count}}"
          }
        }
      }]
    }]
  }
}
```

```typescript
// Render with custom values
await renderer.renderVideo({
  template,
  inputs: {
    title: "Total Sales",
    count: 1000
  }
});
```

### 9 Stunning Examples

Check out production-ready examples in `examples/custom-components/`:
- **particle-explosion** - 150+ particles with physics
- **3d-cube-rotation** - CSS 3D transforms
- **wave-visualization** - Audio spectrum analyzer
- **neon-text-effects** - Realistic neon glow
- **holographic-interface** - Sci-fi UI
- And 4 more basic examples!

### Documentation

📖 **[Complete Guide](./docs/custom-components.md)** - Full technical documentation
🤖 **[AI Agent Guide](./docs/custom-components-ai-guide.md)** - For AI agents
👨‍💻 **[Development Tutorial](./examples/custom-components/DEVELOPMENT_EXAMPLE.md)** - Step-by-step
🎬 **[Examples Overview](./examples/custom-components/README.md)** - All 9 examples

## Examples

Explore our collection of ready-to-use templates:

### Getting Started

| Example | Description | Preview |
|---------|-------------|---------|
| [Hello World](./examples/getting-started/01-hello-world/) | Minimal text animation | ![](./examples/getting-started/01-hello-world/preview.gif) [SVG](./examples/getting-started/01-hello-world/preview.svg) |
| [First Video](./examples/getting-started/02-first-video/) | 5-second video with text | ![](./examples/getting-started/02-first-video/preview.gif) [SVG](./examples/getting-started/02-first-video/preview.svg) |
| [First Image](./examples/getting-started/03-first-image/) | Social media image | ![](./examples/getting-started/03-first-image/preview.png) [SVG](./examples/getting-started/03-first-image/preview.svg) |

### Social Media

| Example | Dimensions | Platform | SVG |
|---------|------------|----------|-----|
| [Instagram Story](./examples/social-media/instagram-story/) | 1080x1920 | Instagram Stories | [Preview](./examples/social-media/instagram-story/preview.svg) |
| [Instagram Post](./examples/social-media/instagram-post/) | 1080x1080 | Instagram Feed | [Preview](./examples/social-media/instagram-post/preview.svg) |
| [TikTok Video](./examples/social-media/tiktok-video/) | 1080x1920 | TikTok | [Preview](./examples/social-media/tiktok-video/preview.svg) |
| [YouTube Thumbnail](./examples/social-media/youtube-thumbnail/) | 1280x720 | YouTube | [Preview](./examples/social-media/youtube-thumbnail/preview.svg) |
| [Twitter Card](./examples/social-media/twitter-card/) | 1200x630 | Twitter/X | [Preview](./examples/social-media/twitter-card/preview.svg) |
| [LinkedIn Banner](./examples/social-media/linkedin-banner/) | 1584x396 | LinkedIn | [Preview](./examples/social-media/linkedin-banner/preview.svg) |

### Marketing

| Example | Description | SVG |
|---------|-------------|-----|
| [Product Showcase](./examples/marketing/product-showcase/) | Feature product with details | [Preview](./examples/marketing/product-showcase/preview.svg) |
| [Sale Announcement](./examples/marketing/sale-announcement/) | Promotional sale video | [Preview](./examples/marketing/sale-announcement/preview.svg) |
| [Testimonial Video](./examples/marketing/testimonial-video/) | Customer testimonial | [Preview](./examples/marketing/testimonial-video/preview.svg) |
| [Before & After](./examples/marketing/before-after/) | Before/after comparison | [Preview](./examples/marketing/before-after/preview.svg) |
| [Logo Reveal](./examples/marketing/logo-reveal/) | Animated logo reveal | [Preview](./examples/marketing/logo-reveal/preview.svg) |

### Data Visualization

| Example | Description | SVG |
|---------|-------------|-----|
| [Animated Bar Chart](./examples/data-visualization/animated-bar-chart/) | Animated bar chart | [Preview](./examples/data-visualization/animated-bar-chart/preview.svg) |
| [Line Graph](./examples/data-visualization/line-graph/) | Animated line graph | [Preview](./examples/data-visualization/line-graph/preview.svg) |
| [Pie Chart](./examples/data-visualization/pie-chart/) | Pie chart reveal | [Preview](./examples/data-visualization/pie-chart/preview.svg) |
| [Counter Animation](./examples/data-visualization/counter-animation/) | Counting numbers | [Preview](./examples/data-visualization/counter-animation/preview.svg) |
| [Progress Dashboard](./examples/data-visualization/progress-dashboard/) | Progress indicators | [Preview](./examples/data-visualization/progress-dashboard/preview.svg) |

See the [examples directory](./examples/) for more details and usage instructions.

### SVG Export

All example templates include an animated SVG preview (`preview.svg`). These are lightweight, scalable, CSS-animated SVG files generated by `exportAnimatedSvg()`. To regenerate all previews:

```bash
npx tsx scripts/export-all-svgs.ts
```

## MCP Server

Enable AI agents (Claude, Cursor, Windsurf, Google Antigravite) to generate videos and images using the [Model Context Protocol](https://modelcontextprotocol.io/) server.

The MCP server exposes 6 tools:
- **render_video** - Generate videos from templates
- **render_image** - Generate images/frames
- **validate_template** - Validate template JSON
- **get_capabilities** - Discover available features
- **list_examples** - Browse 50+ example templates
- **get_example** - Load specific examples

See the [MCP server directory](./mcp/) for installation and usage instructions.

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

### Playgrounds

Interactive dev apps for testing the editor and player components with sample templates.

```bash
# Build libraries first (required on first run)
pnpm build

# Start editor playground → http://localhost:5180
pnpm --filter @rendervid/editor-playground dev

# Start player playground → http://localhost:5181
pnpm --filter @rendervid/player-playground dev

# Or start both at once
pnpm --filter @rendervid/editor-playground --filter @rendervid/player-playground --parallel dev
```

**Editor Playground** (`packages/editor-playground/`) — Full VideoEditor with template switching, undo/redo, save/export callbacks logged to the console.

**Player Playground** (`packages/player-playground/`) — Player with sidebar controls for autoplay, loop, speed (0.25x–4x), and show/hide controls. Template info panel shows dimensions, FPS, and duration.

## License

[FlowHunt Attribution License](./LICENSE) - Free for commercial and personal use with attribution

## Skills Documentation

Auto-generated MCP skills documentation is available in the [`/skills/`](./skills/) directory:

- **Individual skill docs**: Detailed documentation for each MCP tool
- **Skills registry**: Machine-readable JSON format for programmatic access
- **Examples**: Usage examples and best practices

To regenerate skills documentation:
```bash
cd mcp
pnpm build
pnpm generate:skills
```

Or use the convenience script:
```bash
./scripts/generate-all-docs.sh
```

Skills documentation is automatically updated when MCP server source code changes via GitHub Actions.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.
