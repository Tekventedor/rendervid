# Progress Ring Example

Circular progress indicator with percentage display

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| FPS | 30 |
| Duration | 5s |
| Total Frames | 150 |

## Custom Components

### ProgressRing

**Type:** `inline`
**Description:** Circular progress ring with percentage

**Code Length:** 948 characters



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

This template uses **2 layers**:

1. **progress-ring** (custom (`ProgressRing`))
   Props: color: "{{ringColor}}", strokeWidth: "{{strokeWidth}}"
2. **label** (text)
   Text: "Loading..."

## Key Features

- ✅ **1 Custom Component** - Advanced React-based effects
- ✅ **Frame-Based Animation** - Smooth deterministic rendering
- ✅ **High FPS** - 30 FPS for smooth motion
- ✅ **Inline Components** - React code defined directly in template
- ✅ **Reusable** - Edit `template.json` to customize

## Usage

### Render This Example

```bash
# From the custom-components directory
pnpm tsx render-all-examples.ts progress-ring

# Or use the browser renderer directly
pnpm tsx ../render-example.ts progress-ring/template.json
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

- **ringColor** (`string`) - Ring Color
- **strokeWidth** (`number`) - Stroke Width

```typescript
await renderer.renderVideo({
  template,
  inputs: {
    ringColor: "your-value-here",
    strokeWidth: "your-value-here",
  }
});
```


## Technical Details


### Component Implementation

#### ProgressRing

```javascript
function ProgressRing(props) { const progress = Math.min(props.frame / props.sceneDuration, 1); const size = 300; const center = size / 2; const radius = center - props.strokeWidth / 2; const circumference = 2 * Math.PI * radius; const offset = circumference * (1 - progress); return React.createElement('svg', { width: size, height: size }, React.createElement('circle', { cx: center, cy: center, r: radius, fill: 'none', stroke: '#2a2a3e', strokeWidth: props.strokeWidth }), React.createElement('ci
... [truncated]
```

Circular progress ring with percentage



### Performance

- **Render Time**: ~10 seconds (estimated)
- **Output Size**: ~32 MB (estimated)
- **Complexity**: Low (2 layers)

## Related Examples

- [All Custom Component Examples](../README.md)
- [Getting Started Examples](../../getting-started/)
- [Template Documentation](../../../docs/custom-components.md)

---

**Created with Rendervid** | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
