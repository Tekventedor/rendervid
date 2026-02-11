# 3D Cube Rotation

Stunning 3D cube rotation with CSS transforms using custom component

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| FPS | 60 |
| Duration | 8s |
| Total Frames | 480 |

## Custom Components

### RotatingCube

**Type:** `inline`
**Description:** 3D rotating cube with customizable face labels

**Code Length:** 2134 characters



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

### RadialGlow

**Type:** `inline`
**Description:** Pulsing radial glow effect

**Code Length:** 415 characters



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

This template uses **3 layers**:

1. **glow-background** (custom (`RadialGlow`))
2. **cube** (custom (`RotatingCube`))
   Props: label1: "{{label1}}", label2: "{{label2}}", label3: "{{label3}}", label4: "{{label4}}", label5: "{{label5}}", label6: "{{label6}}"
3. **title** (text)
   Text: "3D Transform with Custom Components"

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
pnpm tsx render-all-examples.ts 3d-cube-rotation

# Or use the browser renderer directly
pnpm tsx ../render-example.ts 3d-cube-rotation/template.json
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

- **label1** (`string`) - Face 1 Label
- **label2** (`string`) - Face 2 Label
- **label3** (`string`) - Face 3 Label
- **label4** (`string`) - Face 4 Label
- **label5** (`string`) - Face 5 Label
- **label6** (`string`) - Face 6 Label

```typescript
await renderer.renderVideo({
  template,
  inputs: {
    label1: "your-value-here",
    label2: "your-value-here",
    label3: "your-value-here",
    label4: "your-value-here",
    label5: "your-value-here",
    label6: "your-value-here",
  }
});
```


## Technical Details


### Component Implementation

#### RotatingCube

```javascript
function RotatingCube(props) { const rotationX = (props.frame / props.fps) * 30; const rotationY = (props.frame / props.fps) * 40; const size = 300; const perspective = 1200; const cubeStyle = { position: 'relative', width: size + 'px', height: size + 'px', transformStyle: 'preserve-3d', transform: 'rotateX(' + rotationX + 'deg) rotateY(' + rotationY + 'deg)', transition: 'transform 0.1s' }; const faceStyle = { position: 'absolute', width: size + 'px', height: size + 'px', display: 'flex', align
... [truncated]
```

3D rotating cube with customizable face labels

#### RadialGlow

```javascript
function RadialGlow(props) { const pulseScale = 1 + Math.sin(props.frame * 0.05) * 0.15; const opacity = 0.3 + Math.sin(props.frame * 0.08) * 0.15; return React.createElement('div', { style: { width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(138,43,226,' + opacity + ') 0%, rgba(138,43,226,0) 70%)', transform: 'scale(' + pulseScale + ')', filter: 'blur(40px)' } }); }
```

Pulsing radial glow effect



### Performance

- **Render Time**: ~32 seconds (estimated)
- **Output Size**: ~100 MB (estimated)
- **Complexity**: Low (3 layers)

## Related Examples

- [All Custom Component Examples](../README.md)
- [Getting Started Examples](../../getting-started/)
- [Template Documentation](../../../docs/custom-components.md)

---

**Created with Rendervid** | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
