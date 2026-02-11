# Particle Explosion Effect

Stunning particle explosion with physics simulation using custom component

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| FPS | 60 |
| Duration | 5s |
| Total Frames | 300 |

## Custom Components

### ParticleExplosion

**Type:** `inline`
**Description:** Particle explosion with physics and color cycling

**Code Length:** 1198 characters



#### Props Interface
```typescript
{
  frame: number;         // Current frame (auto)
  fps: number;           // Frames per second (auto)
  sceneDuration: number; // Total frames (auto)
  layerSize: {          // Layer dimensions (auto)
    width: number;
    height: number;
  };
  // + custom props from layer
}
```

### GlowingTitle

**Type:** `inline`
**Description:** Glowing text with pulsing effect

**Code Length:** 607 characters



#### Props Interface
```typescript
{
  frame: number;         // Current frame (auto)
  fps: number;           // Frames per second (auto)
  sceneDuration: number; // Total frames (auto)
  layerSize: {          // Layer dimensions (auto)
    width: number;
    height: number;
  };
  // + custom props from layer
}
```


## Layer Composition

This template uses **4 layers**:

1. **background-glow** (shape)
2. **particle-system** (custom (`ParticleExplosion`))
   Props: particleCount: "{{particleCount}}", explosionForce: "{{explosionForce}}"
3. **title** (custom (`GlowingTitle`))
   Props: text: "{{title}}"
4. **subtitle** (text)
   Text: "Custom Component Physics"

## Key Features

- ✅ **2 Custom Components** - Advanced React-based effects
- ✅ **Frame-Based Animation** - Smooth deterministic rendering
- ✅ **High FPS** - 60 FPS for ultra-smooth motion
- ✅ **Inline Components** - React code defined directly in template
- ✅ **Reusable** - Edit `template.json` to customize

## Usage

### Render This Example

```bash
# From the custom-components directory
pnpm tsx render-all-examples.ts particle-explosion

# Or use the browser renderer directly
pnpm tsx ../render-example.ts particle-explosion/template.json
```

### Customize

Edit `template.json` to modify:

- **Component Props** - Adjust custom component properties
- **Colors** - Change color values throughout
- **Duration** - Adjust `output.duration`
- **Resolution** - Modify `output.width` and `output.height`
- **Text** - Update any text layer content


### Input Variables

This template accepts the following inputs:

- **title** (`string`) - Title Text
- **particleCount** (`number`) - Number of Particles
- **explosionForce** (`number`) - Explosion Force

```typescript
await renderer.renderVideo({
  template,
  inputs: {
    title: "your-value-here",
    particleCount: "your-value-here",
    explosionForce: "your-value-here",
  }
});
```


## Technical Details


### Component Implementation

#### ParticleExplosion

```javascript
function ParticleExplosion(props) { const particles = []; const centerX = props.layerSize.width / 2; const centerY = props.layerSize.height / 2; const explosionStartFrame = 30; const explosionProgress = Math.max(0, props.frame - explosionStartFrame) / props.fps; const particleCount = props.particleCount || 150; for (let i = 0; i < particleCount; i++) { const angle = (i / particleCount) * Math.PI * 2; const baseSpeed = (props.explosionForce || 8) * (0.8 + Math.random() * 0.4); const speed = baseS
... [truncated]
```

Particle explosion with physics and color cycling

#### GlowingTitle

```javascript
function GlowingTitle(props) { const opacity = Math.min(1, props.frame / 20); const scale = 0.8 + Math.min(0.2, props.frame / 100); const glowIntensity = Math.sin(props.frame * 0.1) * 0.3 + 0.7; return React.createElement('div', { style: { fontSize: '72px', fontWeight: 'bold', textAlign: 'center', color: '#ffffff', textShadow: '0 0 ' + (20 * glowIntensity) + 'px rgba(255, 100, 255, 0.8), 0 0 ' + (40 * glowIntensity) + 'px rgba(100, 200, 255, 0.6), 0 0 ' + (60 * glowIntensity) + 'px rgba(255, 255
... [truncated]
```

Glowing text with pulsing effect



### Performance

- **Render Time**: ~20 seconds (estimated)
- **Output Size**: ~63 MB (estimated)
- **Complexity**: Medium (4 layers)

## Related Examples

- [All Custom Component Examples](../README.md)
- [Getting Started Examples](../../getting-started/)
- [Template Documentation](../../../docs/custom-components.md)

---

**Created with Rendervid** | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
