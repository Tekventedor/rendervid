# HEVC/H.265 Encoding

Rendervid supports H.265/HEVC (High Efficiency Video Coding) for video output, providing better compression efficiency compared to H.264 at equivalent visual quality.

## Quick Start

```typescript
import { createNodeRenderer } from '@rendervid/renderer-node';

const renderer = createNodeRenderer();

// Using the 'hevc' alias
const result = await renderer.renderVideo({
  template,
  outputPath: 'output.mp4',
  codec: 'hevc',
});

// Or using the FFmpeg codec name directly
const result2 = await renderer.renderVideo({
  template,
  outputPath: 'output.mp4',
  codec: 'libx265',
});
```

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `codec` | `'hevc'` \| `'libx265'` | `'libx264'` | Select HEVC encoding |
| `quality` | `number` (0-51) | `28` | CRF value. Lower = better quality, larger file |
| `preset` | `string` | `'medium'` | Encoding speed/quality tradeoff |
| `bitrate` | `string` | - | Target bitrate (e.g., `'10M'`). Overrides CRF |
| `pixelFormat` | `string` | `'yuv420p'` | Pixel format |

### Presets

Presets control the encoding speed vs compression efficiency tradeoff:

| Preset | Speed | File Size |
|--------|-------|-----------|
| `ultrafast` | Fastest | Largest |
| `superfast` | Very fast | Very large |
| `veryfast` | Fast | Large |
| `faster` | Above average | Above average |
| `fast` | Slightly faster | Slightly larger |
| `medium` | Balanced | Balanced |
| `slow` | Slow | Smaller |
| `slower` | Very slow | Very small |
| `veryslow` | Slowest | Smallest |

## HEVC vs H.264

HEVC provides approximately 50% better compression at equivalent visual quality. The default CRF values reflect this:

- **H.264 default CRF**: 23
- **HEVC default CRF**: 28

A CRF of 28 in HEVC produces visually similar quality to CRF 23 in H.264, but with a smaller file size.

## Apple/QuickTime Compatibility

Rendervid automatically adds the `-tag:v hvc1` flag when encoding with HEVC. This ensures compatibility with Apple devices and QuickTime Player, which require the `hvc1` tag to play HEVC content.

## Hardware-Accelerated HEVC Encoding

When GPU encoding is enabled, Rendervid automatically selects the appropriate HEVC hardware encoder based on the detected GPU:

| GPU Vendor | Hardware Encoder | Configuration |
|------------|-----------------|---------------|
| NVIDIA | `hevc_nvenc` | `gpu: { encoding: 'nvidia' }` |
| Apple | `hevc_videotoolbox` | `gpu: { encoding: 'apple' }` |
| Intel | `hevc_qsv` | `gpu: { encoding: 'intel' }` |
| AMD | `hevc_amf` | `gpu: { encoding: 'amd' }` |

### Auto-Detection

```typescript
const renderer = createNodeRenderer({
  gpu: {
    encoding: 'auto', // Auto-detect best GPU encoder
    fallback: true,    // Fall back to software if GPU unavailable
  },
});

await renderer.renderVideo({
  template,
  outputPath: 'output.mp4',
  codec: 'hevc',
});
```

### Explicit Vendor Selection

```typescript
const renderer = createNodeRenderer({
  gpu: {
    encoding: 'apple', // Force Apple VideoToolbox
  },
});

await renderer.renderVideo({
  template,
  outputPath: 'output.mp4',
  codec: 'hevc',
});
```

## Advanced Configuration

### High Quality HEVC

```typescript
await renderer.renderVideo({
  template,
  outputPath: 'output.mp4',
  codec: 'hevc',
  quality: 20,      // Lower CRF for higher quality
  preset: 'slow',   // Better compression
});
```

### HEVC with Target Bitrate

```typescript
await renderer.renderVideo({
  template,
  outputPath: 'output.mp4',
  codec: 'hevc',
  bitrate: '10M', // Target 10 Mbps
});
```

### HEVC with Explicit Hardware Acceleration

```typescript
await renderer.renderVideo({
  template,
  outputPath: 'output.mp4',
  codec: 'hevc',
  hardwareAcceleration: {
    enabled: true,
    preferredEncoder: 'hevc_nvenc',
    nvenc: {
      preset: 'p4',
      tune: 'hq',
    },
    fallbackToSoftware: true,
  },
});
```
