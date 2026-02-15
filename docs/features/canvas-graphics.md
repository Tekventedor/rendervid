# Advanced 2D Graphics

Rendervid provides a comprehensive set of canvas drawing utilities and data visualization components for creating rich 2D graphics in your video compositions.

## Canvas Layer Type

The `canvas` layer type allows you to define vector graphics using drawing commands:

```json
{
  "type": "canvas",
  "id": "my-canvas",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 800, "height": 600 },
  "props": {
    "commands": [
      {
        "type": "rect",
        "x": 10,
        "y": 10,
        "width": 200,
        "height": 100,
        "fill": "#3b82f6",
        "borderRadius": 8
      },
      {
        "type": "circle",
        "cx": 400,
        "cy": 300,
        "r": 50,
        "fill": "#ef4444",
        "stroke": "#ffffff",
        "strokeWidth": 2
      },
      {
        "type": "path",
        "pathData": "M 100 200 C 150 100 250 100 300 200",
        "stroke": "#10b981",
        "strokeWidth": 3
      }
    ]
  }
}
```

### Drawing Command Types

| Command | Description |
|---------|------------|
| `path` | Draw an SVG-like path |
| `gradient` | Draw a gradient fill |
| `textOnPath` | Render text along a path |
| `pattern` | Apply a pattern fill |
| `clipPath` | Clip to an arbitrary path |
| `circle` | Draw a circle |
| `rect` | Draw a rectangle |
| `line` | Draw a line segment |

## Canvas Drawing Utilities

Import from `@rendervid/core`:

```typescript
import {
  drawPath,
  drawGradient,
  drawTextOnPath,
  createPattern,
  applyClipPath,
  createCanvasGradient,
  drawCircle,
  drawRoundedRect,
} from '@rendervid/core';
```

### drawPath

Draw an SVG path string on a Canvas 2D context:

```typescript
drawPath(ctx, 'M 10 10 L 100 100 L 10 100 Z', {
  fill: '#3b82f6',
  stroke: '#1e40af',
  strokeWidth: 2,
  opacity: 0.8,
  lineCap: 'round',
  lineJoin: 'round',
  strokeDash: [5, 3],
});
```

### drawGradient

Fill a rectangular area with a gradient:

```typescript
drawGradient(ctx, {
  type: 'linear',  // 'linear' | 'radial' | 'conic'
  stops: [
    { offset: 0, color: '#ff0000' },
    { offset: 0.5, color: '#00ff00' },
    { offset: 1, color: '#0000ff' },
  ],
  x0: 0, y0: 0,
  x1: 400, y1: 0,
}, { x: 0, y: 0, width: 400, height: 300 });
```

### drawTextOnPath

Render text along an SVG path:

```typescript
drawTextOnPath(ctx, 'Hello World!', 'M 50 200 C 150 50 350 50 450 200', {
  fontSize: 24,
  fontFamily: 'Arial',
  fontWeight: 'bold',
  fill: '#ffffff',
  letterSpacing: 2,
});
```

### createPattern

Create a repeating pattern fill:

```typescript
const pattern = createPattern(ctx, imageElement, 'repeat');
if (pattern) {
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, 800, 600);
}
```

### applyClipPath

Clip rendering to an arbitrary path:

```typescript
ctx.save();
applyClipPath(ctx, 'M 100 0 L 200 200 L 0 200 Z');
// Draw within the clipped region
drawGradient(ctx, gradientConfig, bounds);
ctx.restore();
```

## Data Visualization Components

Import chart components from `@rendervid/components`:

```typescript
import { BarChart, LineChart, PieChart, Gauge } from '@rendervid/components';
```

All chart components accept animation props (`frame`, `fps`, `totalFrames`) and render using SVG for compatibility with the browser renderer.

### BarChart

```tsx
<BarChart
  data={[120, 200, 150, 300, 180]}
  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
  colors={['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']}
  width={800}
  height={400}
  animationDuration={30}
  showValues={true}
  showLabels={true}
  easing="easeOut"
  frame={frame}
/>
```

### LineChart

```tsx
<LineChart
  data={[10, 25, 15, 30, 20, 35]}
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  color="#10b981"
  smooth={true}
  fillArea={true}
  showPoints={true}
  showGrid={true}
  animationDuration={60}
  frame={frame}
/>
```

### PieChart

```tsx
<PieChart
  data={[
    { value: 30, label: 'Desktop' },
    { value: 50, label: 'Mobile' },
    { value: 20, label: 'Tablet' },
  ]}
  innerRadius={0.5}  // 0 for pie, >0 for donut
  animationDuration={60}
  showPercentages={true}
  frame={frame}
/>
```

### Gauge

```tsx
<Gauge
  value={75}
  min={0}
  max={100}
  size={300}
  color="#3b82f6"
  strokeWidth={20}
  showValue={true}
  suffix="%"
  label="Performance"
  animationDuration={60}
  roundCaps={true}
  gradientColors={['#3b82f6', '#10b981']}
  frame={frame}
/>
```

#### Gauge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Current gauge value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `size` | `number` | `300` | Width and height |
| `color` | `string` | `'#3b82f6'` | Fill color |
| `trackColor` | `string` | `'rgba(255,255,255,0.1)'` | Background track color |
| `strokeWidth` | `number` | `20` | Arc thickness |
| `startAngle` | `number` | `135` | Start angle (degrees) |
| `sweepAngle` | `number` | `270` | Total sweep angle |
| `animationDuration` | `number` | `60` | Animation frames |
| `showValue` | `boolean` | `true` | Show center value |
| `suffix` | `string` | `''` | Value suffix |
| `prefix` | `string` | `''` | Value prefix |
| `decimals` | `number` | `0` | Decimal places |
| `label` | `string` | - | Label below value |
| `roundCaps` | `boolean` | `true` | Round line caps |
| `gradientColors` | `string[]` | - | Gradient fill |

## Template Example

Use data visualization in a template:

```json
{
  "name": "Data Visualization Dashboard",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 5
  },
  "composition": {
    "scenes": [
      {
        "id": "dashboard",
        "duration": 150,
        "layers": [
          {
            "type": "custom",
            "id": "gauge",
            "position": { "x": 100, "y": 100 },
            "size": { "width": 300, "height": 300 },
            "customComponent": {
              "name": "Gauge",
              "props": {
                "value": 85,
                "suffix": "%",
                "label": "CPU Usage",
                "gradientColors": ["#3b82f6", "#ef4444"]
              }
            }
          }
        ]
      }
    ]
  }
}
```
