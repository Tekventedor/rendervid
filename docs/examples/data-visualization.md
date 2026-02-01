# Data Visualization Examples

Animated charts and data displays using Rendervid.

## Animated Bar Chart

```json
{
  "name": "Animated Bar Chart",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5 },
  "inputs": [
    { "key": "title", "type": "string", "label": "Title", "required": true },
    {
      "key": "data",
      "type": "array",
      "label": "Data",
      "required": true,
      "validation": {
        "itemType": {
          "type": "object",
          "properties": {
            "label": { "type": "string" },
            "value": { "type": "number" }
          }
        }
      }
    }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 150,
      "backgroundColor": "#0F172A",
      "layers": [
        {
          "id": "title",
          "type": "text",
          "position": { "x": 160, "y": 80 },
          "size": { "width": 1600, "height": 80 },
          "inputKey": "title",
          "props": {
            "fontSize": 48,
            "fontWeight": "bold",
            "color": "#FFFFFF"
          },
          "animations": [
            { "type": "entrance", "effect": "fadeInDown", "duration": 20 }
          ]
        }
      ]
    }]
  }
}
```

### Using Custom Component for Bars

For dynamic data, use a custom React component:

```typescript
// BarChart.tsx
import React from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
  maxValue?: number;
  color?: string;
  frame: number;
  animationDuration?: number;
}

export function BarChart({
  data,
  maxValue,
  color = '#3B82F6',
  frame,
  animationDuration = 30,
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));
  const progress = Math.min(frame / animationDuration, 1);

  return (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end', height: '100%' }}>
      {data.map((item, index) => {
        const delay = index * 5;
        const itemProgress = Math.max(0, Math.min((frame - delay) / animationDuration, 1));
        const height = (item.value / max) * 100 * itemProgress;

        return (
          <div key={index} style={{ textAlign: 'center', flex: 1 }}>
            <div
              style={{
                height: `${height}%`,
                backgroundColor: color,
                borderRadius: '8px 8px 0 0',
                transition: 'height 0.1s',
              }}
            />
            <div style={{ color: '#94A3B8', marginTop: 16, fontSize: 24 }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

## Counter Animation

Counting number animation:

```json
{
  "name": "Counter Animation",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 4 },
  "inputs": [
    { "key": "value", "type": "number", "label": "Value", "required": true },
    { "key": "label", "type": "string", "label": "Label", "required": true },
    { "key": "prefix", "type": "string", "label": "Prefix", "default": "" },
    { "key": "suffix", "type": "string", "label": "Suffix", "default": "" }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 120,
      "backgroundColor": "#0F172A",
      "layers": [
        {
          "id": "counter",
          "type": "custom",
          "position": { "x": 560, "y": 400 },
          "size": { "width": 800, "height": 200 },
          "customComponent": {
            "name": "AnimatedCounter",
            "props": {
              "targetValue": "{{value}}",
              "prefix": "{{prefix}}",
              "suffix": "{{suffix}}",
              "duration": 60
            }
          },
          "props": {}
        },
        {
          "id": "label",
          "type": "text",
          "position": { "x": 160, "y": 620 },
          "size": { "width": 1600, "height": 80 },
          "inputKey": "label",
          "props": {
            "fontSize": 36,
            "color": "#94A3B8",
            "textAlign": "center"
          },
          "animations": [
            { "type": "entrance", "effect": "fadeIn", "delay": 30, "duration": 20 }
          ]
        }
      ]
    }]
  }
}
```

### Counter Component

```typescript
// AnimatedCounter.tsx
import React from 'react';

interface AnimatedCounterProps {
  targetValue: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  frame: number;
  color?: string;
}

export function AnimatedCounter({
  targetValue,
  prefix = '',
  suffix = '',
  duration = 60,
  frame,
  color = '#FFFFFF',
}: AnimatedCounterProps) {
  const progress = Math.min(frame / duration, 1);
  const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
  const currentValue = Math.round(targetValue * eased);

  return (
    <div style={{
      fontSize: 120,
      fontWeight: 'bold',
      color,
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums',
    }}>
      {prefix}{currentValue.toLocaleString()}{suffix}
    </div>
  );
}
```

## Progress Dashboard

Multiple progress indicators:

```json
{
  "name": "Progress Dashboard",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 6 },
  "inputs": [
    {
      "key": "metrics",
      "type": "array",
      "label": "Metrics",
      "required": true
    }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 180,
      "backgroundColor": "#0F172A",
      "layers": [
        {
          "id": "title",
          "type": "text",
          "position": { "x": 160, "y": 80 },
          "size": { "width": 1600, "height": 80 },
          "props": {
            "text": "Performance Dashboard",
            "fontSize": 48,
            "fontWeight": "bold",
            "color": "#FFFFFF"
          }
        }
      ]
    }]
  }
}
```

### Progress Bar Component

```typescript
// ProgressBar.tsx
interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  frame: number;
  delay?: number;
  duration?: number;
}

export function ProgressBar({
  value,
  max,
  label,
  color = '#3B82F6',
  frame,
  delay = 0,
  duration = 45,
}: ProgressBarProps) {
  const progress = Math.max(0, Math.min((frame - delay) / duration, 1));
  const width = (value / max) * 100 * progress;

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
        color: '#94A3B8',
        fontSize: 18,
      }}>
        <span>{label}</span>
        <span>{Math.round(width)}%</span>
      </div>
      <div style={{
        backgroundColor: '#1E293B',
        borderRadius: 8,
        height: 16,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${width}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: 8,
        }} />
      </div>
    </div>
  );
}
```

## Pie Chart

Animated pie chart segments:

```json
{
  "name": "Pie Chart",
  "output": { "type": "video", "width": 1080, "height": 1080, "fps": 30, "duration": 5 },
  "inputs": [
    { "key": "title", "type": "string", "label": "Title", "required": true },
    { "key": "data", "type": "array", "label": "Segments", "required": true }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 150,
      "backgroundColor": "#0F172A",
      "layers": [
        {
          "id": "title",
          "type": "text",
          "position": { "x": 90, "y": 80 },
          "size": { "width": 900, "height": 80 },
          "inputKey": "title",
          "props": {
            "fontSize": 42,
            "fontWeight": "bold",
            "color": "#FFFFFF",
            "textAlign": "center"
          }
        },
        {
          "id": "chart",
          "type": "custom",
          "position": { "x": 240, "y": 200 },
          "size": { "width": 600, "height": 600 },
          "customComponent": {
            "name": "PieChart",
            "props": {
              "data": "{{data}}"
            }
          },
          "props": {}
        }
      ]
    }]
  }
}
```

## Line Graph

```json
{
  "name": "Line Graph",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 6 },
  "inputs": [
    { "key": "title", "type": "string", "label": "Title", "required": true },
    { "key": "dataPoints", "type": "array", "label": "Data Points", "required": true }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 180,
      "backgroundColor": "#0F172A",
      "layers": [
        {
          "id": "title",
          "type": "text",
          "position": { "x": 160, "y": 60 },
          "size": { "width": 1600, "height": 80 },
          "inputKey": "title",
          "props": {
            "fontSize": 48,
            "fontWeight": "bold",
            "color": "#FFFFFF"
          }
        },
        {
          "id": "graph",
          "type": "custom",
          "position": { "x": 160, "y": 180 },
          "size": { "width": 1600, "height": 800 },
          "customComponent": {
            "name": "LineGraph",
            "props": {
              "data": "{{dataPoints}}",
              "showGrid": true,
              "showDots": true,
              "animated": true
            }
          },
          "props": {}
        }
      ]
    }]
  }
}
```

## Rendering Data Visualizations

```typescript
import { RendervidEngine } from '@rendervid/core';
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import { BarChart } from './components/BarChart';
import { AnimatedCounter } from './components/AnimatedCounter';

// Register custom components
const engine = new RendervidEngine();
engine.components.register('BarChart', BarChart);
engine.components.register('AnimatedCounter', AnimatedCounter);

const renderer = createBrowserRenderer({
  componentRegistry: engine.components,
});

// Render
const result = await renderer.renderVideo({
  template: barChartTemplate,
  inputs: {
    title: 'Monthly Sales',
    data: [
      { label: 'Jan', value: 120 },
      { label: 'Feb', value: 150 },
      { label: 'Mar', value: 180 },
      { label: 'Apr', value: 165 },
      { label: 'May', value: 210 },
    ],
  },
});
```

## Tips for Data Visualization

1. **Stagger animations** - Animate elements sequentially for clarity
2. **Use appropriate easing** - `easeOutCubic` for counting, `easeOutBack` for emphasis
3. **Consistent colors** - Use theme colors for brand consistency
4. **Clear labels** - Ensure text is readable at video resolution
5. **Consider duration** - Allow enough time for viewers to read values

## Related Documentation

- [Custom Components Guide](/guides/custom-components)
- [Animation Reference](/templates/animations)
- [Examples Overview](/examples/)
