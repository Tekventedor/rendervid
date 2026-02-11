# Holographic Interface

Futuristic holographic interface with multiple animated elements

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| FPS | 60 |
| Duration | 12s |
| Total Frames | 720 |

## Custom Components

### HexagonGrid

**Type:** `inline`
**Description:** Animated hexagonal grid pattern

**Code Length:** 966 characters



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

### DataStream

**Type:** `inline`
**Description:** Flowing binary data stream

**Code Length:** 852 characters



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

### CircularProgress

**Type:** `inline`
**Description:** Animated circular progress indicator

**Code Length:** 1415 characters



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

### HolographicText

**Type:** `inline`
**Description:** Holographic text with glitch effect

**Code Length:** 665 characters



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

### RadarScan

**Type:** `inline`
**Description:** Animated radar scanning display

**Code Length:** 1493 characters



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

This template uses **14 layers**:

1. **hexagon-background** (custom (`HexagonGrid`))
2. **data-stream-left** (custom (`DataStream`))
3. **data-stream-right** (custom (`DataStream`))
4. **main-title** (custom (`HolographicText`))
   Props: text: "{{systemName}}", fontSize: "84px"
5. **status-badge** (shape)
6. **status-text** (text)
   Text: "{{statusText}}"
7. **radar-display** (custom (`RadarScan`))
8. **progress-display** (custom (`CircularProgress`))
   Props: value: "{{completionPercent}}"
9. **radar-label** (text)
   Text: "NETWORK SCAN"
10. **progress-label** (text)
   Text: "COMPLETION"
11. **corner-frame-1** (shape)
12. **corner-frame-2** (shape)
13. **corner-frame-3** (shape)
14. **corner-frame-4** (shape)

## Key Features

- ✅ **6 Custom Components** - Advanced React-based effects
- ✅ **Frame-Based Animation** - Smooth deterministic rendering
- ✅ **High FPS** - 60 FPS for ultra-smooth motion
- ✅ **Inline Components** - React code defined directly in template
- ✅ **Reusable** - Edit `template.json` to customize

## Usage

### Render This Example

```bash
# From the custom-components directory
pnpm tsx render-all-examples.ts holographic-interface

# Or use the browser renderer directly
pnpm tsx ../render-example.ts holographic-interface/template.json
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

- **systemName** (`string`) - System Name
- **statusText** (`string`) - Status
- **completionPercent** (`number`) - Completion Percentage

```typescript
await renderer.renderVideo({
  template,
  inputs: {
    systemName: "your-value-here",
    statusText: "your-value-here",
    completionPercent: "your-value-here",
  }
});
```


## Technical Details


### Component Implementation

#### HexagonGrid

```javascript
function HexagonGrid(props) { const hexagons = []; const rows = 6; const cols = 10; const size = 40; const spacing = size * 1.8; for (let row = 0; row < rows; row++) { for (let col = 0; col < cols; col++) { const x = col * spacing + (row % 2 ? spacing / 2 : 0); const y = row * spacing * 0.866; const opacity = Math.sin(props.frame * 0.05 + row * 0.3 + col * 0.2) * 0.3 + 0.4; const points = []; for (let i = 0; i < 6; i++) { const angle = (Math.PI / 3) * i; const px = x + size * Math.cos(angle); co
... [truncated]
```

Animated hexagonal grid pattern

#### DataStream

```javascript
function DataStream(props) { const lines = []; const numLines = 5; for (let i = 0; i < numLines; i++) { const yOffset = (props.frame * 3 + i * 80) % (props.layerSize.height + 200) - 100; const chars = '01'; const text = Array(40).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(''); const opacity = Math.max(0, Math.min(1, 1 - Math.abs(yOffset - props.layerSize.height / 2) / 300)); lines.push(React.createElement('div', { key: i, style: { position: 'absolute', top: yOffset +
... [truncated]
```

Flowing binary data stream

#### CircularProgress

```javascript
function CircularProgress(props) { const animationProgress = Math.min(1, props.frame / (props.fps * 3)); const targetValue = props.value || 75; const currentValue = Math.floor(animationProgress * targetValue); const size = 200; const strokeWidth = 8; const radius = (size - strokeWidth) / 2; const circumference = 2 * Math.PI * radius; const offset = circumference * (1 - currentValue / 100); const pulseScale = 1 + Math.sin(props.frame * 0.1) * 0.03; return React.createElement('div', { style: { wid
... [truncated]
```

Animated circular progress indicator

#### HolographicText

```javascript
function HolographicText(props) { const glitch = Math.random() > 0.97; const offsetX = glitch ? (Math.random() - 0.5) * 4 : 0; const opacity = glitch ? 0.8 : 1; const scanline = props.frame % 60 < 30 ? 1 : 0.95; return React.createElement('div', { style: { position: 'relative' } }, React.createElement('div', { style: { fontSize: props.fontSize || '72px', fontWeight: 'bold', color: '#00ffaa', textAlign: 'center', textShadow: '0 0 10px #00ffaa, 2px 2px 0 rgba(0, 255, 255, 0.3), -2px -2px 0 rgba(25
... [truncated]
```

Holographic text with glitch effect

#### RadarScan

```javascript
function RadarScan(props) { const rotation = (props.frame * 2) % 360; const size = 300; const radius = size / 2; return React.createElement('svg', { width: size, height: size }, React.createElement('defs', {}, React.createElement('radialGradient', { id: 'radarGradient' }, React.createElement('stop', { offset: '0%', stopColor: '#00ffaa', stopOpacity: 0.8 }), React.createElement('stop', { offset: '100%', stopColor: '#00ffaa', stopOpacity: 0 }))), React.createElement('circle', { cx: radius, cy: rad
... [truncated]
```

Animated radar scanning display



### Performance

- **Render Time**: ~48 seconds (estimated)
- **Output Size**: ~150 MB (estimated)
- **Complexity**: High (14 layers)

## Related Examples

- [All Custom Component Examples](../README.md)
- [Getting Started Examples](../../getting-started/)
- [Template Documentation](../../../docs/custom-components.md)

---

**Created with Rendervid** | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
