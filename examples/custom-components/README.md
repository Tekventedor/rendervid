# Custom Components Examples

This directory contains examples demonstrating custom component usage in Rendervid templates.

## Examples

### 1. Animated Counter (`animated-counter.json`)
Shows how to create a number counting animation using inline component code.

**Features:**
- Frame-based animation
- Configurable start/end values
- Easing function for smooth animation

### 2. Progress Ring (`progress-ring.json`)
Circular progress indicator that fills based on scene progress.

**Features:**
- SVG-based rendering
- Percentage display
- Customizable colors

### 3. Typewriter Effect (`typewriter.json`)
Text that appears character by character.

**Features:**
- Character-by-character reveal
- Configurable speed
- Cursor animation

### 4. Multiple Components (`dashboard.json`)
Demonstrates using multiple custom components in a single template.

**Features:**
- Multiple inline components
- Component reuse
- Layout composition

### 5. URL Component (`url-component.json`)
Example of loading a component from an external URL.

**Features:**
- Dynamic component loading
- CDN integration
- Caching

## Running Examples

### Browser

```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/animated-counter.json';

const renderer = createBrowserRenderer();

const result = await renderer.renderVideo({
  template,
  inputs: {
    from: 0,
    to: 100
  }
});

// Download the video
const url = URL.createObjectURL(result.blob);
const a = document.createElement('a');
a.href = url;
a.download = 'counter.mp4';
a.click();
```

### Node.js

```typescript
import { createNodeRenderer } from '@rendervid/renderer-node';
import { readFileSync, writeFileSync } from 'fs';

const template = JSON.parse(
  readFileSync('./examples/custom-components/animated-counter.json', 'utf-8')
);

const renderer = createNodeRenderer();

const result = await renderer.renderVideo({
  template,
  inputs: {
    from: 0,
    to: 100
  },
  output: { path: './counter.mp4' }
});
```

## Security Note

These examples use `type: "inline"` for simplicity. In production:

- Use `type: "reference"` for pre-registered components (most secure)
- Use `type: "url"` for shared components from trusted CDNs
- Configure domain allowlists when using URL components

See [Custom Components Guide](../../docs/custom-components.md) for security best practices.
