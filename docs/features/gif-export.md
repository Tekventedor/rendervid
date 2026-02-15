# GIF Export

Rendervid supports exporting animations as optimized GIF files with palette-based encoding, progress tracking, and size optimization utilities.

## Features

- Palette-based GIF encoding with FFmpeg palettegen/paletteuse
- Configurable color count, dithering, and loop behavior
- Progress callback support during encoding
- Optimization presets for social media, web, and email
- File size estimation and auto-optimization
- Automatic GIF routing when output path ends in `.gif`

## Quick Start

### Using renderGif

```typescript
import { createNodeRenderer } from '@rendervid/renderer-node';

const renderer = createNodeRenderer();

const result = await renderer.renderGif({
  template,
  outputPath: 'output.gif',
  colors: 128,
  dither: 'floyd_steinberg',
  loop: 0,              // Infinite loop
  optimizationLevel: 'basic',
  onProgress: (progress) => {
    console.log(`${progress.phase}: ${Math.round(progress.percent)}%`);
  },
});
```

### Automatic Routing via renderVideo

When the output path ends in `.gif` or format is set to `'gif'`, `renderVideo` automatically routes to the GIF encoder:

```typescript
const result = await renderer.renderVideo({
  template,
  outputPath: 'output.gif',  // Automatically uses GIF encoder
});
```

## GIF Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colors` | number | 256 | Number of palette colors (2-256) |
| `dither` | string | `'floyd_steinberg'` | Dithering algorithm |
| `loop` | number | 0 | Loop count (0=infinite, -1=no loop) |
| `optimizationLevel` | string | `'basic'` | Optimization level |
| `maxFileSize` | number | - | Target max file size in bytes |
| `width` | number | template | Override output width |
| `height` | number | template | Override output height |
| `fps` | number | template | Override frame rate |

### Dithering Algorithms

- `'floyd_steinberg'` - Best quality, error-diffusion dithering (default)
- `'bayer'` - Ordered dithering, produces a cross-hatch pattern
- `'none'` - No dithering, may show color banding

### Optimization Levels

- `'none'` - No optimization, standard palettegen/paletteuse
- `'basic'` - Full-frame palette statistics (default)
- `'aggressive'` - Diff-based palette stats and rectangle diff mode for smaller file sizes

## Optimization Utilities

### Estimate File Size

```typescript
import { estimateGifFileSize } from '@rendervid/core';

const estimatedBytes = estimateGifFileSize(
  480,   // width
  480,   // height
  45,    // frameCount
  128    // colors
);
console.log(`Estimated size: ${(estimatedBytes / 1024).toFixed(0)}KB`);
```

### Auto-Calculate Colors for Target Size

```typescript
import { calculateOptimalColors } from '@rendervid/core';

const optimalColors = calculateOptimalColors(
  5 * 1024 * 1024,  // targetSizeBytes (5MB)
  480,               // width
  480,               // height
  45                 // frameCount
);
console.log(`Optimal colors: ${optimalColors}`);
```

### Use Presets

```typescript
import { getGifOptimizationPreset } from '@rendervid/core';

const preset = getGifOptimizationPreset('social');
// { maxWidth: 480, maxHeight: 480, fps: 15, colors: 128,
//   dither: 'floyd_steinberg', maxFileSize: 8388608, loop: 0 }

const webPreset = getGifOptimizationPreset('web');
// { maxWidth: 640, maxHeight: 480, fps: 20, colors: 256, ... }

const emailPreset = getGifOptimizationPreset('email');
// { maxWidth: 320, maxHeight: 240, fps: 10, colors: 64, ... }
```

## Using maxFileSize

When `maxFileSize` is set in `GifRenderOptions`, the renderer automatically calculates the optimal color count to try to keep the file under the target size:

```typescript
const result = await renderer.renderGif({
  template,
  outputPath: 'output.gif',
  maxFileSize: 1 * 1024 * 1024, // Target 1MB
});
```

## Progress Tracking

The progress callback fires during both the rendering and encoding phases:

```typescript
await renderer.renderGif({
  template,
  outputPath: 'output.gif',
  onProgress: (progress) => {
    // progress.phase: 'preparing' | 'rendering' | 'encoding' | 'complete'
    // progress.percent: 0-100
    // progress.currentFrame: current frame number
    // progress.totalFrames: total frames
    // progress.fps: current encoding speed
    // progress.eta: estimated seconds remaining
  },
});
```
