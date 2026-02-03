# Rendering Examples Guide

This guide explains how to generate video previews and GIFs for all custom component examples.

## Prerequisites

1. **Node.js 20+** installed
2. **FFmpeg** installed (for GIF generation)
   ```bash
   # macOS
   brew install ffmpeg

   # Ubuntu/Debian
   sudo apt install ffmpeg

   # Windows
   choco install ffmpeg
   ```

3. **Build the project**
   ```bash
   cd /path/to/rendervid
   pnpm install
   pnpm build
   ```

## Quick Start

### Render All Examples

```bash
cd examples/custom-components
npx tsx render-all-examples.ts
```

This will:
- ✅ Render all 10 examples to MP4
- ✅ Generate optimized GIF previews (first 5 seconds)
- ✅ Skip examples that already have videos
- ⏱️ Take approximately 10-30 minutes total

### Render Specific Example

```bash
npx tsx render-all-examples.ts animated-counter
```

Available examples:
- `animated-counter` (150 frames, ~15s render time)
- `progress-ring` (150 frames, ~15s render time)
- `typewriter` (240 frames, ~25s render time)
- `dashboard` (180 frames, ~20s render time)
- `time-running-out` (480 frames @ 60fps, ~45s render time)
- `particle-explosion` (300 frames @ 60fps, ~35s render time)
- `3d-cube-rotation` (480 frames @ 60fps, ~50s render time)
- `wave-visualization` (600 frames @ 60fps, ~60s render time)
- `neon-text-effects` (360 frames @ 60fps, ~40s render time)
- `holographic-interface` (720 frames @ 60fps, ~80s render time)

## Output Files

Each example folder will contain:
- **`video.mp4`** - Full quality video (H.264)
- **`preview.gif`** - Optimized GIF preview:
  - Max 5 seconds duration
  - 15 FPS
  - 50% width scaling
  - Optimized palette

## Render Options

### Force Re-render

By default, the script skips examples that already have videos. To force re-render:

```bash
# Edit render-all-examples.ts and change:
skipIfExists: true  →  skipIfExists: false
```

Or render a specific example (which always forces re-render):
```bash
npx tsx render-all-examples.ts example-name
```

### Adjust GIF Quality

Edit `render-all-examples.ts` to customize GIF generation:

```typescript
// Current settings
const maxDuration = Math.min(5, template.output.duration);  // Max 5 seconds
const scale = Math.floor(template.output.width / 2);        // 50% width

// For higher quality (larger files)
const maxDuration = template.output.duration;  // Full duration
const scale = template.output.width;           // Full width

// For smaller files (lower quality)
const maxDuration = 3;                                      // 3 seconds max
const scale = Math.floor(template.output.width / 3);        // 33% width
```

## Estimated Render Times

| Example | Frames | FPS | Estimated Time | Output Size |
|---------|--------|-----|----------------|-------------|
| Animated Counter | 150 | 30 | ~15s | ~2 MB |
| Progress Ring | 150 | 30 | ~15s | ~2 MB |
| Typewriter | 240 | 30 | ~25s | ~3 MB |
| Dashboard | 180 | 30 | ~20s | ~2.5 MB |
| Time Running Out | 480 | 60 | ~45s | ~5 MB |
| Particle Explosion | 300 | 60 | ~35s | ~4 MB |
| 3D Cube | 480 | 60 | ~50s | ~5 MB |
| Wave Visualization | 600 | 60 | ~60s | ~7 MB |
| Neon Text | 360 | 60 | ~40s | ~4.5 MB |
| Holographic UI | 720 | 60 | ~80s | ~8 MB |

**Total:** ~6-10 minutes for all examples (sequential rendering)

## Troubleshooting

### "Module not found" errors

```bash
# Rebuild the project
cd /path/to/rendervid
pnpm build
```

### FFmpeg not found

```bash
# Check if FFmpeg is installed
ffmpeg -version

# If not, install it (see Prerequisites above)
```

### GIF generation fails

```bash
# Test FFmpeg manually
cd examples/custom-components/animated-counter
ffmpeg -i video.mp4 -vf "fps=15,scale=960:-1" -t 5 test.gif

# If this works, the render script should work too
```

### Rendering is slow

This is normal for high FPS examples (60 FPS with 300+ frames). Options:

1. **Reduce FPS for testing**
   ```typescript
   // Edit template.json temporarily
   "fps": 15  // Instead of 60
   ```

2. **Reduce duration**
   ```typescript
   "duration": 3  // Instead of 8
   ```

3. **Use lower quality for previews**
   - Reduce resolution in template
   - Lower FPS
   - Shorter duration

### Out of memory errors

For complex examples (holographic interface, wave visualization):

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npx tsx render-all-examples.ts
```

## Manual Rendering

### Using Node.js Renderer

```typescript
import { createNodeRenderer } from '@rendervid/renderer-node';
import { readFileSync } from 'fs';

const template = JSON.parse(
  readFileSync('./animated-counter/template.json', 'utf-8')
);

const renderer = createNodeRenderer();

await renderer.renderVideo({
  template,
  output: { path: './animated-counter/video.mp4' }
});
```

### Using Browser Renderer

```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import { readFileSync, writeFileSync } from 'fs';

const template = JSON.parse(
  readFileSync('./animated-counter/template.json', 'utf-8')
);

const renderer = createBrowserRenderer();

const result = await renderer.renderVideo({ template });

const buffer = Buffer.from(await result.blob.arrayBuffer());
writeFileSync('./animated-counter/video.mp4', buffer);
```

### Manual GIF Generation

```bash
# After video is rendered
cd examples/custom-components/animated-counter

# Generate optimized GIF
ffmpeg -i video.mp4 \
  -vf "fps=15,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -t 5 \
  -loop 0 \
  preview.gif
```

## CI/CD Integration

For GitHub Actions or other CI:

```yaml
name: Render Examples

on:
  push:
    paths:
      - 'examples/custom-components/*/template.json'

jobs:
  render:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install FFmpeg
        run: sudo apt-get install -y ffmpeg

      - name: Install dependencies
        run: pnpm install

      - name: Build project
        run: pnpm build

      - name: Render examples
        run: |
          cd examples/custom-components
          npx tsx render-all-examples.ts

      - name: Commit rendered files
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add examples/custom-components/*/video.mp4
          git add examples/custom-components/*/preview.gif
          git commit -m "chore: update rendered examples" || true
          git push
```

## Next Steps

After rendering:
1. ✅ Videos and GIFs are ready
2. ✅ README files reference the previews
3. ✅ Users can see visual examples on GitHub
4. ✅ Download links work for MP4 files

---

**Need help?** Check the [main README](./README.md) or [Rendervid documentation](../../README.md).
