# Neon Text Effects

Stunning neon text with glow, flicker, and animation effects

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| FPS | 60 |
| Duration | 6s |
| Total Frames | 360 |

## Custom Components

### NeonText

**Type:** `inline`
**Description:** Neon text with realistic flicker and glow

**Code Length:** 819 characters



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

### NeonBorder

**Type:** `inline`
**Description:** Pulsing neon border frame

**Code Length:** 630 characters



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

### ScanLine

**Type:** `inline`
**Description:** Scanning line effect for retro look

**Code Length:** 334 characters



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

### ElectricSparks

**Type:** `inline`
**Description:** Random electric sparks effect

**Code Length:** 674 characters



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

This template uses **8 layers**:

1. **grid-background** (shape)
2. **border-frame** (custom (`NeonBorder`))
   Props: width: "1200px", height: "600px", color: "#00ffff"
3. **main-text** (custom (`NeonText`))
   Props: text: "{{mainText}}", fontSize: "120px", color: "{{neonColor}}", letterSpacing: "16px"
4. **sub-text** (custom (`NeonText`))
   Props: text: "{{subText}}", fontSize: "36px", color: "#00ffff", letterSpacing: "8px"
5. **scan-line** (custom (`ScanLine`))
6. **electric-sparks** (custom (`ElectricSparks`))
   Props: color: "#00ffff"
7. **corner-accent-1** (shape)
8. **corner-accent-2** (shape)

## Key Features

- ✅ **5 Custom Components** - Advanced React-based effects
- ✅ **Frame-Based Animation** - Smooth deterministic rendering
- ✅ **High FPS** - 60 FPS for ultra-smooth motion
- ✅ **Inline Components** - React code defined directly in template
- ✅ **Reusable** - Edit `template.json` to customize

## Usage

### Render This Example

```bash
# From the custom-components directory
pnpm tsx render-all-examples.ts neon-text-effects

# Or use the browser renderer directly
pnpm tsx ../render-example.ts neon-text-effects/template.json
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

- **mainText** (`string`) - Main Text
- **subText** (`string`) - Sub Text
- **neonColor** (`string`) - Neon Color

```typescript
await renderer.renderVideo({
  template,
  inputs: {
    mainText: "your-value-here",
    subText: "your-value-here",
    neonColor: "your-value-here",
  }
});
```


## Technical Details


### Component Implementation

#### NeonText

```javascript
function NeonText(props) { const flicker = Math.random() > 0.95 ? 0.7 : 1; const pulseIntensity = Math.sin(props.frame * 0.1) * 0.2 + 0.8; const glowSize = 30 * pulseIntensity * flicker; const color = props.color || '#ff00ff'; const textShadow = '0 0 ' + glowSize + 'px ' + color + ',' + '0 0 ' + (glowSize * 2) + 'px ' + color + ',' + '0 0 ' + (glowSize * 3) + 'px ' + color + ',' + '0 0 ' + (glowSize * 1.5) + 'px #fff'; const fadeIn = Math.min(1, props.frame / 40); const letterSpacing = props.let
... [truncated]
```

Neon text with realistic flicker and glow

#### NeonBorder

```javascript
function NeonBorder(props) { const pulseScale = 1 + Math.sin(props.frame * 0.08) * 0.02; const glowIntensity = Math.sin(props.frame * 0.12) * 0.3 + 0.7; const color = props.color || '#00ffff'; const shadowBlur = 20 * glowIntensity; const boxShadow = 'inset 0 0 ' + shadowBlur + 'px ' + color + ',' + '0 0 ' + shadowBlur + 'px ' + color + ',' + '0 0 ' + (shadowBlur * 2) + 'px ' + color; return React.createElement('div', { style: { width: props.width || '600px', height: props.height || '400px', bord
... [truncated]
```

Pulsing neon border frame

#### ScanLine

```javascript
function ScanLine(props) { const position = (props.frame * 4) % props.layerSize.height; return React.createElement('div', { style: { width: '100%', height: '3px', background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))', position: 'absolute', top: position + 'px', opacity: 0.4 } }); }
```

Scanning line effect for retro look

#### ElectricSparks

```javascript
function ElectricSparks(props) { const sparks = []; const numSparks = 8; for (let i = 0; i < numSparks; i++) { const active = (props.frame + i * 10) % 60 < 5; if (active) { const x = Math.random() * props.layerSize.width; const y = Math.random() * props.layerSize.height; const size = 2 + Math.random() * 3; const opacity = Math.random() * 0.8 + 0.2; sparks.push(React.createElement('circle', { key: i, cx: x, cy: y, r: size, fill: props.color || '#00ffff', opacity: opacity, filter: 'blur(1px)' }));
... [truncated]
```

Random electric sparks effect



### Performance

- **Render Time**: ~24 seconds (estimated)
- **Output Size**: ~75 MB (estimated)
- **Complexity**: High (8 layers)

## Related Examples

- [All Custom Component Examples](../README.md)
- [Getting Started Examples](../../getting-started/)
- [Template Documentation](../../../docs/custom-components.md)

---

**Created with Rendervid** | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
