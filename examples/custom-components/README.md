# Custom Components Examples

This directory contains stunning examples demonstrating custom component usage in Rendervid templates. Each example is in its own folder with a complete README, video preview, and template.

## 📂 Examples Structure

Each example folder contains:
- **`template.json`** - The Rendervid template
- **`README.md`** - Complete documentation
- **`preview.gif`** - Animated preview (first 5 seconds)
- **`video.mp4`** - Full rendered video

## 🎨 Basic Examples

### [Animated Counter](./animated-counter/)
![Animated Counter](./animated-counter/preview.gif)

Simple number counting animation with easing effects.
- **Duration:** 5s | **FPS:** 30 | **Frames:** 150

**[View Details →](./animated-counter/README.md)**

---

### [Progress Ring](./progress-ring/)
![Progress Ring](./progress-ring/preview.gif)

Circular progress indicator with percentage display.
- **Duration:** 5s | **FPS:** 30 | **Frames:** 150

**[View Details →](./progress-ring/README.md)**

---

### [Typewriter Effect](./typewriter/)
![Typewriter](./typewriter/preview.gif)

Text appearing character by character with blinking cursor.
- **Duration:** 8s | **FPS:** 30 | **Frames:** 240

**[View Details →](./typewriter/README.md)**

---

### [Dashboard](./dashboard/)
![Dashboard](./dashboard/preview.gif)

Multi-component dashboard with metrics and statistics.
- **Duration:** 6s | **FPS:** 30 | **Frames:** 180

**[View Details →](./dashboard/README.md)**

---

### [Time Running Out](./time-running-out/)
![Time Running Out](./time-running-out/preview.gif)

Two animated analog clocks showing time running at 20x speed with warning text.
- **Duration:** 8s | **FPS:** 60 | **Frames:** 480

**[View Details →](./time-running-out/README.md)**

---

## 🌟 Stunning Visual Effects

### [Particle Explosion](./particle-explosion/)
![Particle Explosion](./particle-explosion/preview.gif)

Spectacular particle physics simulation with 150+ animated particles.
- **Duration:** 5s | **FPS:** 60 | **Frames:** 300

**[View Details →](./particle-explosion/README.md)**

---

### [3D Cube Rotation](./3d-cube-rotation/)
![3D Cube](./3d-cube-rotation/preview.gif)

Stunning 3D cube with CSS transforms and customizable faces.
- **Duration:** 8s | **FPS:** 60 | **Frames:** 480

**[View Details →](./3d-cube-rotation/README.md)**

---

### [Wave Visualization](./wave-visualization/)
![Wave Visualization](./wave-visualization/preview.gif)

Beautiful audio wave visualization with multiple frequency bands.
- **Duration:** 10s | **FPS:** 60 | **Frames:** 600

**[View Details →](./wave-visualization/README.md)**

---

### [Neon Text Effects](./neon-text-effects/)
![Neon Text](./neon-text-effects/preview.gif)

Stunning neon text with realistic glow, flicker, and electric effects.
- **Duration:** 6s | **FPS:** 60 | **Frames:** 360

**[View Details →](./neon-text-effects/README.md)**

---

### [Holographic Interface](./holographic-interface/)
![Holographic Interface](./holographic-interface/preview.gif)

Futuristic sci-fi holographic interface with multiple animated elements.
- **Duration:** 12s | **FPS:** 60 | **Frames:** 720

**[View Details →](./holographic-interface/README.md)**

---

## 🚀 Quick Start

### Render Any Example

```bash
# Render a specific example
cd examples/custom-components
npx tsx render-all-examples.ts animated-counter

# Render all examples
npx tsx render-all-examples.ts
```

### Use in Your Code

```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/particle-explosion/template.json';

const renderer = createBrowserRenderer();

const result = await renderer.renderVideo({
  template,
  inputs: {
    title: "AMAZING PARTICLES",
    particleCount: 200,
    explosionForce: 10
  }
});

// Download the video
const url = URL.createObjectURL(result.blob);
const a = document.createElement('a');
a.href = url;
a.download = 'particle-explosion.mp4';
a.click();
```

## 📊 Examples Overview

| Example | Complexity | FPS | Duration | Frames | Features |
|---------|-----------|-----|----------|--------|----------|
| [Animated Counter](./animated-counter/) | Low | 30 | 5s | 150 | Easing, inputs |
| [Progress Ring](./progress-ring/) | Low | 30 | 5s | 150 | SVG, progress |
| [Typewriter](./typewriter/) | Low | 30 | 8s | 240 | Text animation |
| [Dashboard](./dashboard/) | Medium | 30 | 6s | 180 | Multi-component |
| [Time Running Out](./time-running-out/) | Medium | 60 | 8s | 480 | Analog clocks |
| [Particle Explosion](./particle-explosion/) | High | 60 | 5s | 300 | Physics, 150+ particles |
| [3D Cube](./3d-cube-rotation/) | High | 60 | 8s | 480 | CSS 3D transforms |
| [Wave Visualization](./wave-visualization/) | High | 60 | 10s | 600 | Spectrum analyzer |
| [Neon Text](./neon-text-effects/) | High | 60 | 6s | 360 | Glow effects |
| [Holographic UI](./holographic-interface/) | Very High | 60 | 12s | 720 | Multi-element sci-fi |

## 🎯 Performance Tips

### Rendering Times (Estimated)

- **Basic Examples** (30 FPS): ~10-30 seconds per example
- **High FPS Examples** (60 FPS): ~30-120 seconds per example
- **Complex Examples**: Up to 2-3 minutes

### Optimization Options

Speed up rendering during development:

```typescript
// Reduce FPS for faster preview
template.output.fps = 15;

// Reduce duration
template.output.duration = 3;

// Reduce complexity (e.g., particle count)
inputs.particleCount = 50;
```

## 🔒 Security Note

These examples use `type: "inline"` for simplicity and self-contained demos. In production:

- ✅ Use `type: "reference"` for pre-registered components (most secure)
- ✅ Use `type: "url"` for shared components from trusted CDNs
- ⚠️ Avoid `type: "inline"` in production environments
- 🔐 Configure domain allowlists when using URL components

See [Custom Components Guide](../../docs/custom-components.md) for security best practices.

## 📚 Documentation

- **[Custom Components Guide](../../docs/custom-components.md)** - Complete technical documentation
- **[AI Agent Guide](../../docs/custom-components-ai-guide.md)** - Guide for AI agents
- **[Development Tutorial](./time-running-out/README.md)** - Step-by-step example
- **[Template Schema](../../docs/template-schema.md)** - Template structure reference

## 💡 Creating Your Own

1. **Start with a basic example** to understand the component interface
2. **Use frame-based animation** for deterministic, smooth results
3. **Keep components pure** (no side effects, no external state)
4. **Test with different frame rates** (30 FPS vs 60 FPS)
5. **Use input variables** for reusability
6. **Add visual polish** with shadows, glows, blur effects
7. **Consider performance** - complex components take longer to render

## 🐛 Troubleshooting

### Component doesn't appear
- Check component name matches exactly (case-sensitive)
- Verify component is in `customComponents` object
- Ensure layer `type` is set to `"custom"`

### Animation not smooth
- Increase FPS (30 → 60)
- Use frame-based calculations instead of random values
- Reduce complexity (fewer particles/elements)

### Rendering takes too long
- Decrease FPS for testing (60 → 30 or 15)
- Reduce duration
- Simplify component logic
- Reduce number of animated elements

### GIF generation fails
- Ensure FFmpeg is installed: `brew install ffmpeg` (macOS)
- Check MP4 file exists first
- Try reducing GIF dimensions or FPS

## 🔧 Scripts

This directory includes helpful scripts:

- **`render-all-examples.ts`** - Render all examples (or specific ones)
- **`generate-readmes.ts`** - Generate README files from templates
- Individual example folders may include `demo.js` or `render.ts` scripts

---

**Created with Rendervid** 🎥✨ | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
