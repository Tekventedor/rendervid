# Typewriter Effect Example

Text appearing character by character with cursor

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| FPS | 30 |
| Duration | 8s |
| Total Frames | 240 |

## Custom Components

### Typewriter

**Type:** `inline`
**Description:** Typewriter text effect with blinking cursor

**Code Length:** 541 characters



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

1. **typewriter-text** (custom (`Typewriter`))
   Props: text: "{{text}}", speed: "{{speed}}", color: "{{textColor}}"
2. **terminal-prompt** (text)
   Text: "$ rendervid --component typewriter"

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
pnpm tsx render-all-examples.ts typewriter

# Or use the browser renderer directly
pnpm tsx ../render-example.ts typewriter/template.json
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

- **text** (`string`) _required_ - Text to Type
- **speed** (`number`) - Characters per Second
- **textColor** (`string`) - Text Color

```typescript
await renderer.renderVideo({
  template,
  inputs: {
    text: "your-value-here",
    speed: "your-value-here",
    textColor: "your-value-here",
  }
});
```


## Technical Details


### Component Implementation

#### Typewriter

```javascript
function Typewriter(props) { const charsPerFrame = props.speed / props.fps; const visibleChars = Math.floor(props.frame * charsPerFrame); const displayText = props.text.substring(0, visibleChars); const showCursor = visibleChars < props.text.length || (props.frame % 30) < 15; return React.createElement('div', { style: { fontSize: '42px', color: props.color, fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '1.6', padding: '20px' } }, displayText, showCursor && React.createElement('spa
... [truncated]
```

Typewriter text effect with blinking cursor



### Performance

- **Render Time**: ~16 seconds (estimated)
- **Output Size**: ~50 MB (estimated)
- **Complexity**: Low (2 layers)

## Related Examples

- [All Custom Component Examples](../README.md)
- [Getting Started Examples](../../getting-started/)
- [Template Documentation](../../../docs/custom-components.md)

---

**Created with Rendervid** | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
