# Animated Counter Example

Demonstrates an animated counter using inline custom component

## Preview

![Preview](preview.gif)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| FPS | 30 |
| Duration | 5s |
| Total Frames | 150 |

## Custom Components

### AnimatedCounter

**Type:** `inline`
**Description:** Animated number counter with easing

**Code Length:** 441 characters



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

1. **counter** (custom (`AnimatedCounter`))
   Props: from: "{{from}}", to: "{{to}}", color: "{{color}}"
2. **title** (text)
   Text: "Animated Counter"

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
pnpm tsx render-all-examples.ts animated-counter

# Or use the browser renderer directly
pnpm tsx ../render-example.ts animated-counter/template.json
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

- **from** (`number`) _required_ - Start Value
- **to** (`number`) _required_ - End Value
- **color** (`string`) - Text Color

```typescript
await renderer.renderVideo({
  template,
  inputs: {
    from: "your-value-here",
    to: "your-value-here",
    color: "your-value-here",
  }
});
```


## Technical Details


### Component Implementation

#### AnimatedCounter

```javascript
function AnimatedCounter(props) { const duration = 3; const totalFrames = duration * props.fps; const progress = Math.min(props.frame / totalFrames, 1); const eased = 1 - Math.pow(1 - progress, 3); const value = Math.floor(props.from + (props.to - props.from) * eased); return React.createElement('div', { style: { fontSize: '120px', fontWeight: 'bold', textAlign: 'center', color: props.color, fontFamily: 'Arial, sans-serif' } }, value); }
```

Animated number counter with easing



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
