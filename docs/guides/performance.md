# Performance Optimization Guide

Optimize rendering performance for faster video generation.

## Overview

Rendervid rendering performance depends on:

- Template complexity (layers, animations, effects)
- Output resolution and duration
- Rendering environment (browser vs Node.js)
- Hardware capabilities

## Measuring Performance

### Render Timing

```typescript
const startTime = performance.now();

const result = await renderer.renderVideo({
  template,
  inputs,
  output: { format: 'mp4' },
  onProgress: (progress) => {
    console.log(`Frame ${progress.currentFrame}/${progress.totalFrames}`);
  },
});

const duration = performance.now() - startTime;
console.log(`Rendered in ${duration}ms`);
console.log(`FPS: ${result.metadata.totalFrames / (duration / 1000)}`);
```

### Frame Metrics

```typescript
const frameMetrics: number[] = [];

await renderer.renderVideo({
  template,
  inputs,
  onFrame: (frame, timing) => {
    frameMetrics.push(timing.renderTime);
  },
});

const avgFrameTime = frameMetrics.reduce((a, b) => a + b) / frameMetrics.length;
console.log(`Average frame time: ${avgFrameTime}ms`);
```

## Template Optimization

### Reduce Layer Count

Combine static elements into single layers:

```json
// Before: Multiple layers
{
  "layers": [
    { "id": "bg1", "type": "shape", "props": { "fill": "#000" } },
    { "id": "bg2", "type": "shape", "props": { "fill": "#111" } },
    { "id": "bg3", "type": "shape", "props": { "fill": "#222" } }
  ]
}

// After: Single gradient layer
{
  "layers": [
    {
      "id": "bg",
      "type": "shape",
      "props": {
        "gradient": {
          "type": "linear",
          "colors": [
            { "offset": 0, "color": "#000" },
            { "offset": 0.5, "color": "#111" },
            { "offset": 1, "color": "#222" }
          ]
        }
      }
    }
  ]
}
```

### Optimize Images

Use appropriately sized images:

```typescript
// Pre-process images to match output dimensions
const optimizedUrl = await resizeImage(originalUrl, {
  width: template.output.width,
  height: template.output.height,
  format: 'webp',
  quality: 85,
});
```

### Use Layer Groups

Group static elements to reduce recalculation:

```json
{
  "id": "header-group",
  "type": "group",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 200 },
  "children": [
    { "id": "logo", "type": "image", "..." },
    { "id": "title", "type": "text", "..." },
    { "id": "subtitle", "type": "text", "..." }
  ]
}
```

### Limit Animation Complexity

Reduce simultaneous animations:

```json
// Less performant: All elements animate at once
{
  "layers": [
    { "animations": [{ "type": "entrance", "delay": 0 }] },
    { "animations": [{ "type": "entrance", "delay": 0 }] },
    { "animations": [{ "type": "entrance", "delay": 0 }] }
  ]
}

// More performant: Staggered animations
{
  "layers": [
    { "animations": [{ "type": "entrance", "delay": 0 }] },
    { "animations": [{ "type": "entrance", "delay": 15 }] },
    { "animations": [{ "type": "entrance", "delay": 30 }] }
  ]
}
```

### Avoid Expensive Filters

Some filters are more expensive than others:

| Filter | Performance Impact |
|--------|-------------------|
| `opacity` | Very Low |
| `brightness` | Low |
| `contrast` | Low |
| `grayscale` | Low |
| `saturate` | Low |
| `sepia` | Low |
| `hue-rotate` | Medium |
| `blur` | High |
| `drop-shadow` | High |

```json
// Avoid stacking expensive filters
{
  "filters": [
    { "type": "blur", "value": 10 },
    { "type": "drop-shadow", "value": { "offsetX": 5, "offsetY": 5, "blur": 10 } }
  ]
}

// Consider pre-applying effects to source images
```

## Custom Component Optimization

### Memoize Expensive Calculations

```tsx
import React, { useMemo } from 'react';

export function DataChart({ data, frame }: Props) {
  // Memoize data processing
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      normalized: item.value / Math.max(...data.map(d => d.value))
    }));
  }, [data]); // Only recalculate when data changes

  // Frame-based calculations stay outside memo
  const progress = Math.min(frame / 60, 1);

  return (
    <div>
      {processedData.map((item, i) => (
        <Bar key={i} height={item.normalized * progress * 100} />
      ))}
    </div>
  );
}
```

### Avoid Inline Object Creation

```tsx
// Bad: Creates new object every frame
export function Box({ frame }: Props) {
  return (
    <div style={{
      width: 100,
      height: 100,
      backgroundColor: 'blue'
    }} />
  );
}

// Good: Static styles outside component
const boxStyle = {
  width: 100,
  height: 100,
  backgroundColor: 'blue'
};

export function Box({ frame }: Props) {
  return <div style={boxStyle} />;
}

// Good: Dynamic styles with useMemo
export function AnimatedBox({ frame }: Props) {
  const style = useMemo(() => ({
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    opacity: Math.min(frame / 30, 1),
  }), [frame]);

  return <div style={style} />;
}
```

### Limit SVG Complexity

```tsx
// Reduce path points for better performance
export function SimplifiedChart({ data, frame }: Props) {
  // Downsample data for rendering
  const simplified = data.filter((_, i) => i % 5 === 0);

  const path = simplified
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${d.x} ${d.y}`)
    .join(' ');

  return (
    <svg>
      <path d={path} />
    </svg>
  );
}
```

## Rendering Settings

### Adjust Quality vs Speed

```typescript
// Fast preview rendering
const preview = await renderer.renderVideo({
  template,
  inputs,
  output: {
    format: 'webm',
    quality: 'low',
  },
});

// High quality final render
const final = await renderer.renderVideo({
  template,
  inputs,
  output: {
    format: 'mp4',
    quality: 'high',
    codec: 'h264',
    bitrate: 8000000,
  },
});
```

### Lower Resolution for Development

```typescript
// Scale down during development
const devTemplate = {
  ...template,
  output: {
    ...template.output,
    width: template.output.width / 2,
    height: template.output.height / 2,
  },
};
```

### Reduce Frame Rate for Preview

```typescript
const previewTemplate = {
  ...template,
  output: {
    ...template.output,
    fps: 15, // Half of 30fps
  },
};
```

## Browser Rendering Optimization

### Use Web Workers

The browser renderer automatically uses Web Workers when available:

```typescript
const renderer = createBrowserRenderer({
  useWebWorkers: true,
  workerCount: navigator.hardwareConcurrency || 4,
});
```

### Canvas Optimization

```typescript
const renderer = createBrowserRenderer({
  canvas: {
    willReadFrequently: false, // Optimize for write-heavy operations
    alpha: false, // Disable alpha if not needed
  },
});
```

### Memory Management

```typescript
// Clear cache between renders
renderer.clearCache();

// Dispose renderer when done
renderer.dispose();
```

## Node.js Rendering Optimization

### Parallel Frame Rendering

```typescript
const renderer = createNodeRenderer({
  parallelFrames: 4, // Render 4 frames simultaneously
});
```

### Memory Limits

```typescript
const renderer = createNodeRenderer({
  maxMemory: 4 * 1024 * 1024 * 1024, // 4GB limit
});
```

### Temporary File Handling

```typescript
const renderer = createNodeRenderer({
  tempDir: '/fast-ssd/temp', // Use fast storage
  cleanupTemp: true,
});
```

## Caching Strategies

### Asset Caching

```typescript
const assetCache = new Map();

async function getCachedAsset(url: string) {
  if (!assetCache.has(url)) {
    const data = await fetch(url).then(r => r.arrayBuffer());
    assetCache.set(url, data);
  }
  return assetCache.get(url);
}
```

### Template Preprocessing

```typescript
// Preprocess template once
const processed = engine.preprocessTemplate(template);

// Reuse for multiple renders
await renderer.renderVideo({ template: processed, inputs: inputs1 });
await renderer.renderVideo({ template: processed, inputs: inputs2 });
```

## Benchmarking

### Compare Configurations

```typescript
async function benchmark(configs: RenderConfig[]) {
  const results = [];

  for (const config of configs) {
    const times = [];

    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      await renderer.renderVideo(config);
      times.push(performance.now() - start);
    }

    results.push({
      config: config.name,
      avg: times.reduce((a, b) => a + b) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
    });
  }

  return results;
}
```

## Optimization Checklist

- [ ] Use appropriately sized source images
- [ ] Minimize layer count
- [ ] Group static elements
- [ ] Stagger animations
- [ ] Avoid expensive filter stacks
- [ ] Memoize expensive component calculations
- [ ] Use static style objects
- [ ] Lower resolution/fps for development
- [ ] Enable caching
- [ ] Use appropriate quality settings
- [ ] Profile render times regularly

## Related Documentation

- [Renderer API](/api/renderer-browser/renderer)
- [Node Renderer](/api/renderer-node/renderer)
- [Template Schema](/templates/schema)
