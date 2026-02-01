# Custom Components Guide

Create custom React components for advanced layouts and visualizations.

## Overview

Custom components extend Rendervid's capabilities by allowing you to use React for complex visual elements that would be difficult to achieve with JSON alone.

## Creating a Component

### Basic Structure

```tsx
import React from 'react';

interface MyComponentProps {
  // Your custom props
  title: string;
  value: number;

  // Rendervid provides these automatically
  frame: number;           // Current frame number
  fps: number;            // Frames per second
  width: number;          // Layer width
  height: number;         // Layer height
}

export function MyComponent({
  title,
  value,
  frame,
  fps,
  width,
  height,
}: MyComponentProps) {
  // Calculate time-based values
  const seconds = frame / fps;

  return (
    <div style={{ width, height }}>
      <h1>{title}</h1>
      <p>{value}</p>
    </div>
  );
}
```

### Required Props

Rendervid automatically passes these props to all custom components:

| Prop | Type | Description |
|------|------|-------------|
| `frame` | `number` | Current frame (0-indexed) |
| `fps` | `number` | Frames per second |
| `width` | `number` | Layer width in pixels |
| `height` | `number` | Layer height in pixels |

## Registering Components

### Using the Engine

```typescript
import { RendervidEngine } from '@rendervid/core';
import { MyComponent } from './components/MyComponent';

const engine = new RendervidEngine();

// Basic registration
engine.components.register('MyComponent', MyComponent);

// With JSON Schema for validation
engine.components.register('MyComponent', MyComponent, {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Component title' },
    value: { type: 'number', description: 'Numeric value' },
  },
  required: ['title', 'value'],
});
```

### Checking Registration

```typescript
// Check if registered
engine.components.has('MyComponent'); // true

// Get component
const Component = engine.components.get('MyComponent');

// List all components
const all = engine.components.list();
// [{ name: 'MyComponent', propsSchema: {...} }]

// Unregister
engine.components.unregister('MyComponent');
```

## Using in Templates

### Template Definition

```json
{
  "layers": [{
    "id": "custom-1",
    "type": "custom",
    "position": { "x": 100, "y": 100 },
    "size": { "width": 600, "height": 400 },
    "customComponent": {
      "name": "MyComponent",
      "props": {
        "title": "Hello",
        "value": 42
      }
    },
    "props": {}
  }]
}
```

### With Input Binding

```json
{
  "inputs": [
    { "key": "chartTitle", "type": "string", "label": "Title", "required": true }
  ],
  "composition": {
    "scenes": [{
      "layers": [{
        "id": "chart",
        "type": "custom",
        "position": { "x": 100, "y": 100 },
        "size": { "width": 800, "height": 600 },
        "customComponent": {
          "name": "Chart",
          "props": {
            "title": "{{chartTitle}}",
            "data": [10, 20, 30, 40, 50]
          }
        },
        "props": {}
      }]
    }]
  }
}
```

## Animation Techniques

### Frame-Based Animation

```tsx
export function AnimatedBox({ frame, width, height }: Props) {
  // Animation over 30 frames
  const animationDuration = 30;
  const progress = Math.min(frame / animationDuration, 1);

  // Easing function
  const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

  return (
    <div style={{
      width: width * eased,
      height: height * eased,
      backgroundColor: '#3B82F6',
      opacity: eased,
    }} />
  );
}
```

### Delayed Animation

```tsx
export function StaggeredItems({ items, frame }: Props) {
  return (
    <div>
      {items.map((item, index) => {
        const delay = index * 5; // 5 frames between each
        const itemProgress = Math.max(0, (frame - delay) / 20);
        const opacity = Math.min(itemProgress, 1);

        return (
          <div
            key={index}
            style={{
              opacity,
              transform: `translateY(${(1 - opacity) * 20}px)`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
```

### Looping Animation

```tsx
export function PulsingCircle({ frame, fps }: Props) {
  // Complete one pulse every second
  const cycleFrame = frame % fps;
  const progress = cycleFrame / fps;

  // Sine wave for smooth oscillation
  const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.1;

  return (
    <div style={{
      width: 100,
      height: 100,
      borderRadius: '50%',
      backgroundColor: '#EF4444',
      transform: `scale(${scale})`,
    }} />
  );
}
```

## Styling Options

### Inline Styles

```tsx
<div style={{
  backgroundColor: '#1E293B',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
}} />
```

### CSS Modules

```tsx
// MyComponent.module.css
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
}

// MyComponent.tsx
import styles from './MyComponent.module.css';

export function MyComponent() {
  return <div className={styles.card} />;
}
```

### Tailwind CSS

```tsx
export function TailwindComponent() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900">Title</h2>
    </div>
  );
}
```

## Common Patterns

### Counter Animation

```tsx
interface CounterProps {
  target: number;
  duration?: number;
  frame: number;
}

export function Counter({ target, duration = 60, frame }: CounterProps) {
  const progress = Math.min(frame / duration, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  const current = Math.round(target * eased);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {current.toLocaleString()}
    </span>
  );
}
```

### Progress Bar

```tsx
interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  frame: number;
}

export function ProgressBar({
  value,
  max,
  color = '#3B82F6',
  frame,
}: ProgressBarProps) {
  const progress = Math.min(frame / 45, 1);
  const width = (value / max) * 100 * progress;

  return (
    <div style={{
      backgroundColor: '#E2E8F0',
      borderRadius: 8,
      height: 16,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${width}%`,
        height: '100%',
        backgroundColor: color,
        transition: 'width 0.1s ease-out',
      }} />
    </div>
  );
}
```

### Typewriter Effect

```tsx
interface TypewriterProps {
  text: string;
  speed?: number;
  frame: number;
}

export function Typewriter({ text, speed = 2, frame }: TypewriterProps) {
  const charsToShow = Math.floor(frame / speed);
  const displayText = text.slice(0, charsToShow);
  const showCursor = frame % 30 < 15;

  return (
    <span>
      {displayText}
      <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
    </span>
  );
}
```

## SVG Graphics

```tsx
interface GaugeProps {
  value: number;
  max: number;
  frame: number;
}

export function Gauge({ value, max, frame }: GaugeProps) {
  const progress = Math.min(frame / 60, 1);
  const angle = (value / max) * 180 * progress - 90;
  const x = 100 + Math.cos((angle * Math.PI) / 180) * 70;
  const y = 100 + Math.sin((angle * Math.PI) / 180) * 70;

  return (
    <svg width="200" height="120" viewBox="0 0 200 120">
      <path
        d="M 30 100 A 70 70 0 0 1 170 100"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M 30 100 A 70 70 0 0 1 170 100"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${(value / max) * 220 * progress} 220`}
      />
      <circle cx={x} cy={y} r="8" fill="#3B82F6" />
    </svg>
  );
}
```

## Best Practices

1. **Pure functions** - Components should be pure; same frame = same output
2. **Use frame for animation** - Never use `requestAnimationFrame` or timers
3. **Optimize renders** - Avoid expensive calculations on every frame
4. **Test at different frames** - Verify animation looks correct throughout
5. **Define schemas** - Help with validation and AI generation
6. **Document props** - Clear descriptions for each prop

## Debugging

### Preview Component

```tsx
import { Player } from '@rendervid/player';

function ComponentPreview() {
  const template = {
    name: 'Preview',
    output: { type: 'video', width: 800, height: 600, fps: 30, duration: 3 },
    inputs: [],
    composition: {
      scenes: [{
        id: 'main',
        startFrame: 0,
        endFrame: 90,
        layers: [{
          id: 'test',
          type: 'custom',
          position: { x: 0, y: 0 },
          size: { width: 800, height: 600 },
          customComponent: { name: 'MyComponent', props: { /* test props */ } },
          props: {},
        }],
      }],
    },
  };

  return <Player template={template} inputs={{}} showControls />;
}
```

## Related Documentation

- [Custom Component Example](/examples/custom-component)
- [Component Registry API](/api/core/engine#components)
- [Tailwind CSS Guide](/guides/tailwind)
