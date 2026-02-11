# Audio Wave Visualization

Beautiful audio wave visualization with multiple frequency bands

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| FPS | 60 |
| Duration | 10s |
| Total Frames | 600 |

## Custom Components

### AudioWave

**Type:** `inline`
**Description:** Animated audio wave bars with reflection

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

### CircularSpectrum

**Type:** `inline`
**Description:** Circular audio spectrum analyzer

**Code Length:** 1267 characters



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

### PulsingText

**Type:** `inline`
**Description:** Text with pulsing animation

**Code Length:** 471 characters



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

This template uses **7 layers**:

1. **background-gradient** (shape)
2. **circular-spectrum** (custom (`CircularSpectrum`))
3. **audio-wave** (custom (`AudioWave`))
   Props: color1: "{{waveColor1}}", color2: "{{waveColor2}}"
4. **track-name** (custom (`PulsingText`))
   Props: text: "{{trackName}}", fontSize: "64px", color: "#ffffff"
5. **artist-name** (text)
   Text: "{{artist}}"
6. **now-playing** (shape)
7. **now-playing-text** (text)
   Text: "NOW PLAYING"

## Key Features

- ✅ **3 Custom Components** - Advanced React-based effects
- ✅ **Frame-Based Animation** - Smooth deterministic rendering
- ✅ **High FPS** - 60 FPS for ultra-smooth motion
- ✅ **Inline Components** - React code defined directly in template
- ✅ **Reusable** - Edit `template.json` to customize

## Usage

### Render This Example

```bash
# From the custom-components directory
pnpm tsx render-all-examples.ts wave-visualization

# Or use the browser renderer directly
pnpm tsx ../render-example.ts wave-visualization/template.json
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

- **trackName** (`string`) - Track Name
- **artist** (`string`) - Artist Name
- **waveColor1** (`string`) - Wave Color 1
- **waveColor2** (`string`) - Wave Color 2

```typescript
await renderer.renderVideo({
  template,
  inputs: {
    trackName: "your-value-here",
    artist: "your-value-here",
    waveColor1: "your-value-here",
    waveColor2: "your-value-here",
  }
});
```


## Technical Details


### Component Implementation

#### AudioWave

```javascript
function AudioWave(props) { const width = props.layerSize.width; const height = props.layerSize.height; const numBars = 80; const bars = []; const centerY = height / 2; for (let i = 0; i < numBars; i++) { const x = (i / numBars) * width; const freq = Math.sin(props.frame * 0.1 + i * 0.3) * 0.5 + 0.5; const freq2 = Math.sin(props.frame * 0.15 + i * 0.2 + 1) * 0.3 + 0.3; const barHeight = (freq * 150 + freq2 * 100) * (1 + Math.sin(props.frame * 0.05) * 0.3); const barWidth = width / numBars * 0.8;
... [truncated]
```

Animated audio wave bars with reflection

#### CircularSpectrum

```javascript
function CircularSpectrum(props) { const centerX = props.layerSize.width / 2; const centerY = props.layerSize.height / 2; const numBars = 60; const radius = 180; const bars = []; for (let i = 0; i < numBars; i++) { const angle = (i / numBars) * Math.PI * 2; const freq = Math.sin(props.frame * 0.12 + i * 0.4) * 0.5 + 0.5; const length = freq * 120 + 40; const x1 = centerX + Math.cos(angle) * radius; const y1 = centerY + Math.sin(angle) * radius; const x2 = centerX + Math.cos(angle) * (radius + le
... [truncated]
```

Circular audio spectrum analyzer

#### PulsingText

```javascript
function PulsingText(props) { const scale = 1 + Math.sin(props.frame * 0.08) * 0.05; const opacity = 0.9 + Math.sin(props.frame * 0.12) * 0.1; return React.createElement('div', { style: { fontSize: props.fontSize || '48px', fontWeight: 'bold', color: props.color || '#ffffff', textAlign: 'center', transform: 'scale(' + scale + ')', opacity: opacity, textShadow: '0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)', letterSpacing: '4px' } }, props.text); }
```

Text with pulsing animation



### Performance

- **Render Time**: ~40 seconds (estimated)
- **Output Size**: ~125 MB (estimated)
- **Complexity**: High (7 layers)

## Related Examples

- [All Custom Component Examples](../README.md)
- [Getting Started Examples](../../getting-started/)
- [Template Documentation](../../../docs/custom-components.md)

---

**Created with Rendervid** | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
