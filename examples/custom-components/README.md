# Custom Components Examples

This directory contains stunning examples demonstrating custom component usage in Rendervid templates.

## 🎨 Basic Examples

### 1. Animated Counter (`animated-counter.json`)
Simple number counting animation with easing effects.

**Features:**
- Frame-based animation
- Configurable start/end values
- Smooth easing function
- Input variable binding

**Duration:** 5 seconds | **FPS:** 30

---

### 2. Progress Ring (`progress-ring.json`)
Circular progress indicator with percentage display.

**Features:**
- SVG-based rendering
- Animated percentage counter
- Customizable colors and stroke width
- Scene progress tracking

**Duration:** 5 seconds | **FPS:** 30

---

### 3. Typewriter Effect (`typewriter.json`)
Text appearing character by character with blinking cursor.

**Features:**
- Character-by-character reveal
- Configurable typing speed
- Blinking cursor animation
- Terminal-style design

**Duration:** 8 seconds | **FPS:** 30

---

### 4. Dashboard (`dashboard.json`)
Multi-component dashboard with metrics and statistics.

**Features:**
- Multiple custom components
- Animated counters and progress bars
- Badge components
- Professional layout

**Duration:** 6 seconds | **FPS:** 30

---

### 5. Time Running Out (`time-running-out.json`)
Two animated analog clocks showing time running at 20x speed with dramatic warning text.

**Features:**
- Animated analog clock with SVG rendering
- Component reusability (same clock, different colors)
- Hour, minute, and second hands with smooth animation
- Dynamic glow effects
- Frame-based time calculation

**Duration:** 8 seconds | **FPS:** 60

**Customizable:**
- Clock speed multiplier
- Clock colors
- Warning text

---

## 🌟 Stunning Visual Effects

### 6. Particle Explosion (`particle-explosion.json`)
Spectacular particle physics simulation with color cycling.

**Features:**
- 150+ animated particles
- Physics-based motion
- Color hue rotation
- Gravity simulation
- Glowing title effect

**Duration:** 5 seconds | **FPS:** 60

**Customizable:**
- Particle count (50-300)
- Explosion force (1-15)
- Title text

---

### 7. 3D Cube Rotation (`3d-cube-rotation.json`)
Stunning 3D cube with CSS transforms and face customization.

**Features:**
- Real 3D perspective rendering
- Smooth rotation animation
- 6 customizable faces
- Gradient backgrounds per face
- Pulsing radial glow

**Duration:** 8 seconds | **FPS:** 60

**Customizable:**
- All 6 face labels
- Rotation speed (implicit in frame rate)

---

### 8. Wave Visualization (`wave-visualization.json`)
Beautiful audio wave visualization with multiple frequency bands.

**Features:**
- Dual wave systems (bar + circular)
- 80 animated frequency bars
- Circular spectrum analyzer
- Reflection effects
- Pulsing title text
- "Now Playing" badge

**Duration:** 10 seconds | **FPS:** 60

**Customizable:**
- Track name
- Artist name
- Wave colors (gradient)

---

### 9. Neon Text Effects (`neon-text-effects.json`)
Stunning neon text with realistic glow, flicker, and electric effects.

**Features:**
- Realistic neon glow
- Random flicker effect
- Pulsing neon border frame
- Scanning line (retro CRT effect)
- Electric sparks
- Corner accents

**Duration:** 6 seconds | **FPS:** 60

**Customizable:**
- Main text
- Sub text
- Neon color

---

### 10. Holographic Interface (`holographic-interface.json`)
Futuristic sci-fi holographic interface with multiple animated elements.

**Features:**
- Animated hexagon grid pattern
- Binary data streams (left & right)
- Holographic text with glitch effect
- Rotating radar scan display
- Circular progress indicator
- Corner frame decorations
- Status badge

**Duration:** 12 seconds | **FPS:** 60

**Customizable:**
- System name
- Status text
- Completion percentage

---

## 🚀 Running Examples

### Browser

```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/time-running-out.json';

const renderer = createBrowserRenderer();

const result = await renderer.renderVideo({
  template
  // No inputs needed - component props are in the template
});

// Download the video
const url = URL.createObjectURL(result.blob);
const a = document.createElement('a');
a.href = url;
a.download = 'particle-explosion.mp4';
a.click();
```

### Node.js

```typescript
import { createNodeRenderer } from '@rendervid/renderer-node';
import { readFileSync } from 'fs';

const template = JSON.parse(
  readFileSync('./examples/custom-components/holographic-interface.json', 'utf-8')
);

const renderer = createNodeRenderer();

await renderer.renderVideo({
  template,
  inputs: {
    systemName: "NEXUS SYSTEM",
    statusText: "ONLINE",
    completionPercent: 87
  },
  output: { path: './holographic-interface.mp4' }
});
```

### Command Line

```bash
# Validate all examples
pnpm examples:validate

# Render a specific example
pnpm examples:render particle-explosion

# Generate preview images for all examples
pnpm examples:generate-previews
```

## 🎯 Performance Tips

### For 60 FPS Examples
The stunning visual effects (particles, 3D, waves, neon, holographic) use 60 FPS for smooth animation. These may take longer to render:

- **Particle Explosion:** ~30-60 seconds to render
- **3D Cube Rotation:** ~20-40 seconds to render
- **Wave Visualization:** ~40-80 seconds to render
- **Neon Text Effects:** ~20-40 seconds to render
- **Holographic Interface:** ~60-120 seconds to render

### Optimization Options
To speed up rendering during development:

```typescript
// Reduce FPS for faster preview
template.output.fps = 30;

// Reduce duration
template.output.duration = 3;

// Reduce particle count
inputs.particleCount = 50;
```

## 🔒 Security Note

These examples use `type: "inline"` for simplicity and self-contained demos. In production:

- ✅ Use `type: "reference"` for pre-registered components (most secure)
- ✅ Use `type: "url"` for shared components from trusted CDNs
- ⚠️ Avoid `type: "inline"` in production
- 🔐 Configure domain allowlists when using URL components

See [Custom Components Guide](../../docs/custom-components.md) for security best practices.

## 📚 Learn More

- [Custom Components Guide](../../docs/custom-components.md) - Complete documentation
- [Template Schema](../../docs/template-schema.md) - Template structure reference
- [Animation System](../../docs/animation.md) - Animation presets and keyframes

## 🎬 Example Categories

| Category | Examples | Complexity | FPS |
|----------|----------|------------|-----|
| **Basic** | Counter, Progress Ring, Typewriter, Dashboard | Simple | 30 |
| **Visual Effects** | Particle Explosion, 3D Cube, Waves, Neon, Holographic | Advanced | 60 |

## 💡 Tips for Creating Your Own

1. **Start with basic examples** to understand the component interface
2. **Use frame-based animation** for deterministic results
3. **Keep components pure** (no side effects, no external state)
4. **Test with different frame rates** to ensure smooth animation
5. **Use input variables** for reusability
6. **Add visual polish** with shadows, glows, and blur effects
7. **Consider performance** - complex components may take longer to render

## 🐛 Troubleshooting

### Component doesn't appear
- Check component name matches exactly (case-sensitive)
- Verify component is in `customComponents` object
- Check layer `type` is set to `"custom"`

### Animation not smooth
- Increase FPS (30 → 60)
- Use frame-based calculations instead of random values
- Reduce complexity (fewer particles/elements)

### Rendering takes too long
- Decrease FPS for testing
- Reduce duration
- Simplify component logic
- Reduce number of animated elements

---

**Created with Rendervid Custom Components** 🎥✨
