# SVGDrawing Component

The `SVGDrawing` component animates SVG path drawing using stroke-dasharray and stroke-dashoffset, similar to the popular Vivus.js library but designed specifically for frame-aware video rendering with Rendervid.

## Features

- Frame-aware animation for consistent video rendering
- Multiple animation modes: `sync`, `oneByOne`, `delayed`
- Support for easing functions: `linear`, `ease-in`, `ease-out`, `ease-in-out`
- Handles multiple paths in a single SVG
- Customizable stroke properties (color, width)
- Works with nested groups and complex SVG structures
- TypeScript support with full type definitions

## Installation

The component is included in the `@rendervid/components` package:

```bash
npm install @rendervid/components
```

## Basic Usage

```tsx
import { SVGDrawing } from '@rendervid/components';

function MyVideo() {
  return (
    <SVGDrawing
      duration={2}
      mode="sync"
      strokeColor="#00ff00"
      strokeWidth={2}
      frame={currentFrame}
      fps={30}
    >
      <svg viewBox="0 0 200 200">
        <path d="M 20 100 L 180 100" />
        <circle cx="100" cy="100" r="60" fill="none" />
      </svg>
    </SVGDrawing>
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `duration` | `number` | Duration in seconds to complete the drawing animation |
| `frame` | `number` | Current frame number (from AnimatedProps) |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'sync' \| 'oneByOne' \| 'delayed'` | `'sync'` | Animation mode for multiple paths |
| `strokeColor` | `string` | `undefined` | Override stroke color for all paths |
| `strokeWidth` | `number` | `2` | Stroke width for all paths |
| `delay` | `number` | `0.1` | Delay between paths (in seconds) for `oneByOne` and `delayed` modes |
| `easing` | `'linear' \| 'ease-in' \| 'ease-out' \| 'ease-in-out'` | `'ease-in-out'` | Easing function for animation |
| `width` | `number \| string` | `'100%'` | Width of the SVG viewport |
| `height` | `number \| string` | `'100%'` | Height of the SVG viewport |
| `viewBox` | `string` | `undefined` | SVG viewBox attribute |
| `preserveAspectRatio` | `string` | `'xMidYMid meet'` | SVG preserveAspectRatio attribute |
| `fps` | `number` | `30` | Frames per second (from AnimatedProps) |
| `children` | `ReactNode` | `undefined` | SVG content to animate |
| `src` | `string` | `undefined` | SVG file URL (not yet implemented) |

## Animation Modes

### Sync Mode (`mode="sync"`)

All paths animate simultaneously at the same rate.

```tsx
<SVGDrawing duration={2} mode="sync" frame={frame} fps={30}>
  <svg viewBox="0 0 100 100">
    <path d="M 10 10 L 90 10" />
    <path d="M 90 10 L 90 90" />
    <path d="M 90 90 L 10 90" />
  </svg>
</SVGDrawing>
```

### One By One Mode (`mode="oneByOne"`)

Paths animate sequentially, one after another. The `delay` prop is ignored in this mode as the timing is calculated based on the duration divided by the number of paths.

```tsx
<SVGDrawing duration={3} mode="oneByOne" frame={frame} fps={30}>
  <svg viewBox="0 0 100 100">
    <path d="M 10 10 L 90 10" />
    <path d="M 90 10 L 90 90" />
    <path d="M 90 90 L 10 90" />
    <path d="M 10 90 L 10 10" />
  </svg>
</SVGDrawing>
```

### Delayed Mode (`mode="delayed"`)

Paths start with staggered delays (controlled by the `delay` prop) but all finish at the same time.

```tsx
<SVGDrawing
  duration={2.5}
  mode="delayed"
  delay={0.2}
  frame={frame}
  fps={30}
>
  <svg viewBox="0 0 200 150">
    <path d="M 20 75 Q 50 20, 100 75" />
    <path d="M 20 100 Q 50 150, 100 100" />
    <path d="M 20 50 Q 50 5, 100 50" />
  </svg>
</SVGDrawing>
```

## Easing Functions

The component supports four easing functions:

- **`linear`**: Constant speed throughout
- **`ease-in`**: Starts slow, ends fast
- **`ease-out`**: Starts fast, ends slow
- **`ease-in-out`**: Starts slow, speeds up in middle, ends slow

```tsx
<SVGDrawing
  duration={2}
  easing="ease-out"
  frame={frame}
  fps={30}
>
  {/* SVG content */}
</SVGDrawing>
```

## Advanced Examples

### Drawing a Star

```tsx
const starPath = "M 100 20 L 120 80 L 180 80 L 130 120 L 150 180 L 100 140 L 50 180 L 70 120 L 20 80 L 80 80 Z";

<SVGDrawing
  duration={2}
  mode="sync"
  strokeColor="#ffaa00"
  strokeWidth={3}
  easing="linear"
  frame={frame}
  fps={30}
>
  <svg viewBox="0 0 200 200">
    <path d={starPath} fill="none" />
  </svg>
</SVGDrawing>
```

### Drawing Text/Logo

```tsx
<SVGDrawing
  duration={3}
  mode="oneByOne"
  strokeColor="#ffffff"
  strokeWidth={4}
  frame={frame}
  fps={30}
>
  <svg viewBox="0 0 400 150">
    {/* Letter R */}
    <path d="M 20 120 L 20 30 L 60 30 Q 80 30, 80 50 Q 80 70, 60 70 L 20 70 M 60 70 L 80 120" />
    {/* Letter E */}
    <path d="M 120 120 L 120 30 L 160 30 M 120 75 L 150 75 M 120 120 L 160 120" />
    {/* Letter N */}
    <path d="M 200 120 L 200 30 L 240 120 L 240 30" />
  </svg>
</SVGDrawing>
```

### Nested Groups

The component automatically extracts paths from nested `<g>` groups:

```tsx
<SVGDrawing
  duration={3}
  mode="delayed"
  delay={0.15}
  frame={frame}
  fps={30}
>
  <svg viewBox="0 0 200 200">
    <g id="top">
      <path d="M 50 100 L 100 50" />
      <path d="M 100 50 L 150 100" />
    </g>
    <g id="bottom">
      <path d="M 150 100 L 100 150" />
      <path d="M 100 150 L 50 100" />
    </g>
  </svg>
</SVGDrawing>
```

## How It Works

The component uses the SVG stroke-dasharray and stroke-dashoffset technique:

1. Each path's total length is approximated
2. `strokeDasharray` is set to the path length
3. `strokeDashoffset` is animated from the path length to 0
4. Progress is calculated based on the current frame: `progress = frame / (duration * fps)`
5. Easing is applied to the progress value
6. Different modes control how multiple paths are animated

## Integration with Rendervid

The SVGDrawing component is registered in the default component registry:

```typescript
import { defaultRegistry } from '@rendervid/components';

const SVGDrawing = defaultRegistry.get('svg-drawing');
```

It can be used in video compositions like any other Rendervid component:

```tsx
import { Video } from '@rendervid/core';
import { SVGDrawing } from '@rendervid/components';

export default function MyVideo() {
  return (
    <Video width={1920} height={1080} fps={30} duration={5}>
      <SVGDrawing
        duration={3}
        mode="oneByOne"
        strokeColor="#00ff00"
        strokeWidth={3}
        frame={0}
        fps={30}
      >
        <svg viewBox="0 0 500 500">
          <path d="M 50 250 Q 150 100, 250 250 T 450 250" fill="none" />
        </svg>
      </SVGDrawing>
    </Video>
  );
}
```

## Limitations

- SVG loading from URL (`src` prop) is not yet implemented
- Path length calculation is an approximation (may not be pixel-perfect for complex paths)
- Only `<path>` elements are animated; other SVG elements (rect, circle, line) need to be converted to paths
- Fill animations are not supported (only stroke drawing)

## Future Enhancements

- Load SVG from external URLs
- More accurate path length calculation
- Support for additional SVG elements (convert to paths automatically)
- Fill reveal animations
- Custom timing functions/bezier curves
- Reverse animation support

## See Also

- [Vivus.js](https://maxwellito.github.io/vivus/) - Inspiration for this component
- [Rendervid Documentation](https://github.com/rendervid/rendervid)
- [SVG Paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
