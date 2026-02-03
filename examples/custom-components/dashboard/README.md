# Dashboard with Multiple Components

Demonstrates using multiple custom components in a single template

## Preview

![Preview](preview.gif)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| FPS | 30 |
| Duration | 6s |
| Total Frames | 180 |

## Custom Components

### Counter

**Type:** `inline`
**Description:** Animated counter with optional currency formatting

**Code Length:** 520 characters



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

### ProgressBar

**Type:** `inline`
**Description:** Horizontal progress bar with delay support

**Code Length:** 723 characters



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

### Badge

**Type:** `inline`
**Description:** Badge with scale-in animation

**Code Length:** 330 characters



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

### MetricCard

**Type:** `inline`
**Description:** Card container with slide-up animation

**Code Length:** 421 characters



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

1. **title** (text)
   Text: "Performance Dashboard"
2. **card-1-bg** (shape)
3. **users-label** (text)
   Text: "Total Users"
4. **users-counter** (custom (`Counter`))
   Props: from: 0, to: "{{usersCount}}", color: "#4ecdc4", format: "number"
5. **users-badge** (custom (`Badge`))
   Props: text: "Active", color: "#4ecdc4"
6. **card-2-bg** (shape)
7. **revenue-label** (text)
   Text: "Revenue"
8. **revenue-counter** (custom (`Counter`))
   Props: from: 0, to: "{{revenueAmount}}", color: "#f7b731", format: "currency"
9. **revenue-badge** (custom (`Badge`))
   Props: text: "This Month", color: "#f7b731"
10. **card-3-bg** (shape)
11. **conversion-label** (text)
   Text: "Conversion Rate"
12. **conversion-progress** (custom (`ProgressBar`))
   Props: value: "{{conversionRate}}", color: "#5f27cd", delay: 0.5
13. **conversion-text** (text)
   Text: "{{conversionRate}}%"
14. **footer** (text)
   Text: "Generated with Rendervid Custom Components"

## Key Features

- ✅ **5 Custom Components** - Advanced React-based effects
- ✅ **Frame-Based Animation** - Smooth deterministic rendering
- ✅ **High FPS** - 30 FPS for smooth motion
- ✅ **Inline Components** - React code defined directly in template
- ✅ **Reusable** - Edit `template.json` to customize

## Usage

### Render This Example

```bash
# From the custom-components directory
pnpm tsx render-all-examples.ts dashboard

# Or use the browser renderer directly
pnpm tsx ../render-example.ts dashboard/template.json
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

- **usersCount** (`number`) - Users Count
- **revenueAmount** (`number`) - Revenue
- **conversionRate** (`number`) - Conversion Rate %

```typescript
await renderer.renderVideo({
  template,
  inputs: {
    usersCount: "your-value-here",
    revenueAmount: "your-value-here",
    conversionRate: "your-value-here",
  }
});
```


## Technical Details


### Component Implementation

#### Counter

```javascript
function Counter(props) { const duration = 2.5; const totalFrames = duration * props.fps; const progress = Math.min(props.frame / totalFrames, 1); const eased = 1 - Math.pow(1 - progress, 3); const value = Math.floor(props.from + (props.to - props.from) * eased); const formatted = props.format === 'currency' ? '$' + value.toLocaleString() : value.toLocaleString(); return React.createElement('div', { style: { fontSize: '56px', fontWeight: 'bold', color: props.color, fontFamily: 'Arial, sans-serif
... [truncated]
```

Animated counter with optional currency formatting

#### ProgressBar

```javascript
function ProgressBar(props) { const duration = 2; const totalFrames = duration * props.fps; const delay = props.delay || 0; const delayFrames = delay * props.fps; const effectiveFrame = Math.max(0, props.frame - delayFrames); const progress = Math.min(effectiveFrame / totalFrames, 1); const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2; return React.createElement('div', { style: { width: '100%', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1
... [truncated]
```

Horizontal progress bar with delay support

#### Badge

```javascript
function Badge(props) { const scale = props.frame < 10 ? props.frame / 10 : 1; return React.createElement('div', { style: { display: 'inline-block', padding: '12px 24px', backgroundColor: props.color, color: 'white', borderRadius: '24px', fontSize: '20px', fontWeight: 'bold', transform: 'scale(' + scale + ')' } }, props.text); }
```

Badge with scale-in animation

#### MetricCard

```javascript
function MetricCard(props) { const slideProgress = Math.min(props.frame / 20, 1); const opacity = slideProgress; const translateY = (1 - slideProgress) * 30; return React.createElement('div', { style: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255, 255, 255, 0.1)', opacity: opacity, transform: 'translateY(' + translateY + 'px)' } }, props.children); }
```

Card container with slide-up animation



### Performance

- **Render Time**: ~12 seconds (estimated)
- **Output Size**: ~38 MB (estimated)
- **Complexity**: High (14 layers)

## Related Examples

- [All Custom Component Examples](../README.md)
- [Getting Started Examples](../../getting-started/)
- [Template Documentation](../../../docs/custom-components.md)

---

**Created with Rendervid** | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
