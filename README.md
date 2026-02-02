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

## Examples

Explore our collection of ready-to-use templates:

### Getting Started

| Example | Description | Preview |
|---------|-------------|---------|
| [Hello World](./examples/getting-started/01-hello-world/) | Minimal text animation | ![](./examples/getting-started/01-hello-world/preview.gif) |
| [First Video](./examples/getting-started/02-first-video/) | 5-second video with text | ![](./examples/getting-started/02-first-video/preview.gif) |
| [First Image](./examples/getting-started/03-first-image/) | Social media image | ![](./examples/getting-started/03-first-image/preview.png) |

### Social Media

| Example | Dimensions | Platform |
|---------|------------|----------|
| [Instagram Story](./examples/social-media/instagram-story/) | 1080x1920 | Instagram Stories |
| [Instagram Post](./examples/social-media/instagram-post/) | 1080x1080 | Instagram Feed |
| [TikTok Video](./examples/social-media/tiktok-video/) | 1080x1920 | TikTok |
| [YouTube Thumbnail](./examples/social-media/youtube-thumbnail/) | 1280x720 | YouTube |
| [Twitter Card](./examples/social-media/twitter-card/) | 1200x630 | Twitter/X |
| [LinkedIn Banner](./examples/social-media/linkedin-banner/) | 1584x396 | LinkedIn |

### Marketing

| Example | Description |
|---------|-------------|
| [Product Showcase](./examples/marketing/product-showcase/) | Feature product with details |
| [Sale Announcement](./examples/marketing/sale-announcement/) | Promotional sale video |
| [Testimonial Video](./examples/marketing/testimonial-video/) | Customer testimonial |
| [Before & After](./examples/marketing/before-after/) | Before/after comparison |
| [Logo Reveal](./examples/marketing/logo-reveal/) | Animated logo reveal |

### Data Visualization

| Example | Description |
|---------|-------------|
| [Animated Bar Chart](./examples/data-visualization/animated-bar-chart/) | Animated bar chart |
| [Line Graph](./examples/data-visualization/line-graph/) | Animated line graph |
| [Pie Chart](./examples/data-visualization/pie-chart/) | Pie chart reveal |
| [Counter Animation](./examples/data-visualization/counter-animation/) | Counting numbers |
| [Progress Dashboard](./examples/data-visualization/progress-dashboard/) | Progress indicators |

See the [examples directory](./examples/) for more details and usage instructions.

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
