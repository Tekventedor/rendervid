# Installation

Rendervid is distributed as multiple packages so you can install only what you need.

## Requirements

- **Node.js** 20.0.0 or higher
- **pnpm** 9.0.0 or higher (recommended) or npm/yarn

## Core Package

The core package provides types, validation, and the engine interface:

```bash
# Using pnpm (recommended)
pnpm add @rendervid/core

# Using npm
npm install @rendervid/core

# Using yarn
yarn add @rendervid/core
```

## Browser Rendering

For rendering videos and images in the browser:

```bash
pnpm add @rendervid/core @rendervid/renderer-browser
```

This package uses:
- **WebCodecs API** for high-performance video encoding (Chrome 94+, Edge 94+)
- **MediaRecorder** as a fallback for older browsers
- **Canvas API** for frame rendering

## Server-Side Rendering

For rendering on the server with Node.js:

```bash
pnpm add @rendervid/core @rendervid/renderer-node
```

Additional requirements:
- **FFmpeg** must be installed and available in PATH
- **Puppeteer** is used for headless browser rendering

### Installing FFmpeg

::: code-group

```bash [macOS]
brew install ffmpeg
```

```bash [Ubuntu/Debian]
sudo apt update
sudo apt install ffmpeg
```

```bash [Windows]
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

:::

## Preview Player

For real-time preview in React applications:

```bash
pnpm add @rendervid/core @rendervid/player
```

## Pre-built Templates

For access to themes and scene templates:

```bash
pnpm add @rendervid/templates
```

## Full Installation

To install all packages:

```bash
pnpm add @rendervid/core @rendervid/renderer-browser @rendervid/renderer-node @rendervid/player @rendervid/templates
```

## TypeScript Support

All packages include TypeScript declarations. No additional `@types/*` packages are needed.

```typescript
import type { Template, Layer, Animation } from '@rendervid/core';
```

## Verify Installation

```typescript
import { RendervidEngine } from '@rendervid/core';

const engine = new RendervidEngine();
const capabilities = engine.getCapabilities();

console.log('Rendervid version:', capabilities.version);
console.log('Available animations:', capabilities.animations);
console.log('Available easings:', capabilities.easings);
```

## Next Steps

- [Quick Start](/getting-started/quick-start) - Create your first video
- [First Template](/getting-started/first-template) - Understand template structure
- [Concepts](/getting-started/concepts) - Learn the core concepts
