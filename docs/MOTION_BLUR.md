# Motion Blur Documentation

Complete guide to using motion blur in Rendervid for cinematic video rendering.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Configuration](#configuration)
4. [Advanced Features](#advanced-features)
5. [Performance Optimization](#performance-optimization)
6. [API Reference](#api-reference)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Examples](#examples)

## Overview

Motion blur simulates the natural blur that occurs when objects move quickly in front of a camera. Rendervid implements motion blur using **temporal supersampling**: rendering multiple sub-frames at fractional time offsets, then compositing them with weighted averaging.

### Why Use Motion Blur?

✅ **Benefits:**
- More realistic and professional-looking animations
- Smoother motion without strobing
- Cinematic quality matching professional cameras
- Natural feel for fast-moving content

❌ **Trade-offs:**
- Increased render time (linear with sample count)
- Higher memory usage during rendering
- Not suitable for all content types

## Quick Start

### Basic Usage

```javascript
import { createNodeRenderer } from '@rendervid/renderer-node';

const renderer = createNodeRenderer();
await renderer.renderVideo({
  template: yourTemplate,
  outputPath: './output.mp4',
  motionBlur: {
    enabled: true,
    quality: 'medium'  // 10 samples, ~10× slower
  }
});
```

### MCP Server Usage

```json
{
  "template": { /* your template */ },
  "outputPath": "~/Downloads/video.mp4",
  "motionBlur": {
    "enabled": true,
    "quality": "high"
  }
}
```

## Configuration

### Quality Presets (Recommended)

The simplest way to configure motion blur is using quality presets:

| Quality | Samples | Render Time | Use Case |
|---------|---------|-------------|----------|
| `low` | 5 | ~5× | Quick previews, testing |
| `medium` | 10 | ~10× | Standard production (default) |
| `high` | 16 | ~16× | Cinematic quality |
| `ultra` | 32 | ~32× | Maximum smoothness |

**Example:**
```json
{
  "motionBlur": {
    "enabled": true,
    "quality": "high"
  }
}
```

### All Configuration Options

```typescript
interface MotionBlurConfig {
  // Basic Settings
  enabled: boolean;                    // Enable/disable motion blur
  quality?: 'low' | 'medium' | 'high' | 'ultra';  // Quality preset

  // Manual Control
  samples?: number;                    // 2-32 temporal samples (default: 10)
  shutterAngle?: number;              // 0-360° exposure angle (default: 180)

  // Performance Optimization
  adaptive?: boolean;                  // Reduce samples on static frames (default: false)
  minSamples?: number;                // Minimum for adaptive mode (default: 3)
  motionThreshold?: number;           // Motion detection sensitivity (default: 0.01)
  variableSampleRate?: boolean;       // Auto-adjust samples per frame (default: false)
  maxSamples?: number;                // Maximum for variable rate (default: samples)
  preview?: boolean;                  // Fast preview mode, 2 samples (default: false)

  // Quality Enhancement
  stochastic?: boolean;               // Random sampling to reduce banding (default: false)

  // Fine-Tuning
  blurAmount?: number;                // Blur multiplier, 0-2 (default: 1.0)
  blurAxis?: 'x' | 'y' | 'both';     // Blur direction (default: 'both')
}
```

### Configuration Hierarchy

Motion blur can be configured at three levels with descending priority:

1. **Layer Level** - Highest priority, overrides all
2. **Scene Level** - Overrides global
3. **Global Level** - Base configuration

**Example:**
```json
{
  "motionBlur": {
    "enabled": true,
    "quality": "medium"
  },
  "composition": {
    "scenes": [
      {
        "id": "action",
        "motionBlur": { "quality": "high" },  // Scene override
        "layers": [
          { "id": "hero" },  // Inherits: high quality
          {
            "id": "ui",
            "motionBlur": { "enabled": false }  // Layer override: disabled
          }
        ]
      }
    ]
  }
}
```

## Advanced Features

### 1. Adaptive Sampling

Automatically reduces sample count on static/slow-moving frames to save render time.

**Configuration:**
```json
{
  "motionBlur": {
    "enabled": true,
    "samples": 16,
    "adaptive": true,
    "minSamples": 4,
    "motionThreshold": 0.01
  }
}
```

**How it works:**
1. Compares each frame with the previous frame
2. Calculates pixel difference (0-1)
3. If difference < threshold: uses `minSamples`
4. Otherwise: uses full `samples`

**Benefits:**
- 30-50% time reduction on mixed content
- Maintains quality on motion, saves time on statics
- Automatic detection, no manual marking

**Limitations:**
- Requires previous frame (first frame always uses full samples)
- May miss subtle motion if threshold too high
- Small overhead for motion detection

### 2. Variable Sample Rate

Auto-adjusts sample count per frame based on motion magnitude.

**Configuration:**
```json
{
  "motionBlur": {
    "enabled": true,
    "samples": 8,              // Minimum samples
    "maxSamples": 24,          // Maximum samples
    "variableSampleRate": true,
    "motionThreshold": 0.01
  }
}
```

**How it works:**
1. Calculates motion magnitude for each frame
2. Maps magnitude to sample count:
   - Low motion (< threshold): `samples`
   - High motion (> threshold × 3): `maxSamples`
   - Medium motion: interpolated
3. Adjusts samples dynamically per frame

**Benefits:**
- Optimizes sample count automatically
- Better quality on fast motion
- Better performance on slow motion
- More efficient than fixed samples

**Use Cases:**
- Videos with varying speed
- Camera pans with acceleration
- Mixed action/static scenes

### 3. Stochastic Sampling

Adds random jitter to sample times to reduce banding artifacts.

**Configuration:**
```json
{
  "motionBlur": {
    "enabled": true,
    "samples": 10,
    "stochastic": true
  }
}
```

**How it works:**
1. Distributes samples evenly (as usual)
2. Adds random jitter within ±50% of sample spacing
3. Sorts samples to maintain temporal order
4. Composites with equal weights

**Benefits:**
- Reduces visible banding in gradients
- More natural-looking blur
- Minimal performance cost
- Works with any sample count

**Trade-offs:**
- Slight temporal noise (usually imperceptible)
- Random result (not reproducible)

### 4. Preview Mode

Ultra-fast mode using minimal samples for quick iteration.

**Configuration:**
```json
{
  "motionBlur": {
    "enabled": true,
    "preview": true  // Forces 2 samples regardless of other settings
  }
}
```

**Benefits:**
- ~2× render time vs no blur (vs 10× for normal)
- Quick feedback during editing
- Shows blur effect without waiting

**Use Cases:**
- Interactive editing
- Layout preview
- Quick tests
- Development

**Limitations:**
- Low quality blur
- Visible strobing on fast motion
- For preview only, not production

### 5. Per-Layer Blur Control

Fine-tune blur amount and direction per layer.

**Blur Amount:**
```json
{
  "id": "hero",
  "motionBlur": {
    "enabled": true,
    "blurAmount": 1.5  // 50% more blur than normal
  }
}
```

**Blur Axis:**
```json
{
  "id": "horizontal-slide",
  "motionBlur": {
    "enabled": true,
    "blurAxis": "x"  // Only blur horizontally
  }
}
```

**Use Cases:**
- **blurAmount:**
  - Emphasize fast-moving hero elements (> 1.0)
  - Reduce blur on UI elements (0.5)
  - Disable blur completely (0.0)
- **blurAxis:**
  - Horizontal pans (x only)
  - Vertical scrolls (y only)
  - Directional emphasis

### 6. Shutter Angle

Controls the amount of blur by simulating camera shutter opening.

**Values:**
- **180°** - Cinematic standard (half-frame exposure)
- **360°** - Maximum blur (full-frame exposure)
- **90°** - Fast shutter, minimal blur
- **0°** - No blur (but wastes samples)

**Examples:**
```json
// Cinematic (default)
{ "shutterAngle": 180 }

// Maximum blur
{ "shutterAngle": 360 }

// Minimal blur
{ "shutterAngle": 90 }
```

**Relationship to Real Cameras:**
- Film cameras typically use 180° shutter
- Faster shutter (< 180°) = sharper, less natural
- Slower shutter (> 180°) = more blur, dreamy effect

## Performance Optimization

### Render Time Impact

**Formula:** `renderTime = baseTime × effectiveSamples`

**Examples (1080p @ 30fps, 5s video):**
| Configuration | Base | Time | Slowdown |
|--------------|------|------|----------|
| No blur | 2 min | 2 min | 1× |
| 5 samples | 2 min | 10 min | 5× |
| 10 samples | 2 min | 20 min | 10× |
| 16 samples | 2 min | 32 min | 16× |
| Adaptive (avg 7) | 2 min | 14 min | 7× |
| Variable (avg 12) | 2 min | 24 min | 12× |

### Memory Usage

**Formula:** `memory = width × height × 4 bytes × samples`

**Examples:**
| Resolution | Samples | Memory/Frame |
|-----------|---------|--------------|
| 1920×1080 | 8 | 64 MB |
| 1920×1080 | 16 | 128 MB |
| 3840×2160 | 8 | 256 MB |
| 3840×2160 | 16 | 512 MB |

**Tips:**
- Monitor system memory with high sample counts
- Use lower resolution for high sample testing
- Consider streaming mode for long videos

### Optimization Strategies

**1. Use Preview Mode During Development**
```json
{ "preview": true }  // 2× slowdown instead of 10×
```

**2. Enable Adaptive Sampling**
```json
{
  "adaptive": true,
  "minSamples": 3,
  "motionThreshold": 0.015  // Slightly higher = more aggressive
}
```

**3. Use Variable Sample Rate**
```json
{
  "variableSampleRate": true,
  "samples": 6,      // Minimum
  "maxSamples": 18   // Maximum
}
```

**4. Disable for UI Layers**
```json
{
  "id": "ui-button",
  "motionBlur": { "enabled": false }
}
```

**5. Scene-Level Configuration**
```json
{
  "scenes": [
    { "id": "static-title", "motionBlur": { "enabled": false } },
    { "id": "action", "motionBlur": { "quality": "high" } }
  ]
}
```

**6. Use Async Rendering for Long Videos**
```javascript
// For videos > 30s with motion blur
await renderer.startRenderAsync({ /* config */ });
```

**7. Adjust Concurrency**
```json
{
  "concurrency": 4,  // Render 4 samples in parallel
  "motionBlur": { "samples": 12 }
}
```

**8. Use Lower Quality for Tests**
```json
{ "quality": "low" }  // 5 samples for quick tests
```

## API Reference

### Types

```typescript
// Main configuration interface
interface MotionBlurConfig {
  enabled: boolean;
  shutterAngle?: number;        // 0-360°, default: 180
  samples?: number;             // 2-32, default: 10
  quality?: MotionBlurQuality;
  adaptive?: boolean;           // default: false
  minSamples?: number;          // default: 3
  motionThreshold?: number;     // 0-1, default: 0.01
  stochastic?: boolean;         // default: false
  blurAmount?: number;          // 0-2, default: 1.0
  blurAxis?: 'x' | 'y' | 'both'; // default: 'both'
  variableSampleRate?: boolean; // default: false
  maxSamples?: number;          // default: samples
  preview?: boolean;            // default: false
}

// Quality presets
type MotionBlurQuality = 'low' | 'medium' | 'high' | 'ultra';

// Quality preset values
const MOTION_BLUR_QUALITY_PRESETS = {
  low: { samples: 5, shutterAngle: 180 },
  medium: { samples: 10, shutterAngle: 180 },
  high: { samples: 16, shutterAngle: 180 },
  ultra: { samples: 32, shutterAngle: 180 },
};
```

### Functions

```typescript
// Resolve configuration with defaults
function resolveMotionBlurConfig(
  config?: MotionBlurConfig
): ResolvedMotionBlurConfig;

// Validate configuration
function validateMotionBlurConfig(
  config: MotionBlurConfig
): string[];  // Returns array of error messages

// Merge multiple configs (layer > scene > global)
function mergeMotionBlurConfigs(
  global?: MotionBlurConfig,
  scene?: MotionBlurConfig,
  layer?: MotionBlurConfig
): MotionBlurConfig | undefined;
```

### Render Options

```typescript
interface VideoRenderOptions {
  template: Template;
  inputs?: Record<string, unknown>;
  outputPath: string;
  motionBlur?: MotionBlurConfig;  // Global configuration
  // ... other options
}
```

### Layer Configuration

```typescript
interface LayerBase {
  id: string;
  type: LayerType;
  // ... other properties
  motionBlur?: MotionBlurConfig;  // Layer-level override
}
```

### Scene Configuration

```typescript
interface Scene {
  id: string;
  startFrame: number;
  endFrame: number;
  // ... other properties
  motionBlur?: MotionBlurConfig;  // Scene-level config
  layers: Layer[];
}
```

## Best Practices

### 1. Start with Quality Presets

```json
// Good: Simple and clear
{ "enabled": true, "quality": "medium" }

// Avoid: Manual tuning without reason
{ "enabled": true, "samples": 11, "shutterAngle": 175 }
```

### 2. Use Hierarchy Effectively

```json
{
  // Global: reasonable default
  "motionBlur": { "enabled": true, "quality": "medium" },
  "composition": {
    "scenes": [
      {
        // Scene: high quality for action
        "motionBlur": { "quality": "high" },
        "layers": [
          // UI: disable blur
          { "id": "ui", "motionBlur": { "enabled": false } }
        ]
      },
      {
        // Static scene: disable
        "motionBlur": { "enabled": false }
      }
    ]
  }
}
```

### 3. Enable Adaptive Sampling

```json
{
  "motionBlur": {
    "enabled": true,
    "quality": "high",
    "adaptive": true,  // 30-50% time savings
    "minSamples": 4
  }
}
```

### 4. Use Preview Mode During Development

```javascript
// Development
await render({ motionBlur: { enabled: true, preview: true } });

// Production
await render({ motionBlur: { enabled: true, quality: "high" } });
```

### 5. Disable for UI Elements

```json
{
  "layers": [
    { "id": "hero", /* blur enabled */ },
    { "id": "button", "motionBlur": { "enabled": false } },
    { "id": "text-overlay", "motionBlur": { "enabled": false } }
  ]
}
```

### 6. Match Content Speed to Samples

| Motion Speed | Recommended Samples |
|-------------|---------------------|
| Slow (< 100px/sec) | 5-8 samples |
| Medium (100-300px/sec) | 10-12 samples |
| Fast (> 300px/sec) | 16-24 samples |
| Ultra-fast (> 500px/sec) | 24-32 samples |

### 7. Consider File Size

Motion blur often compresses better (smoother gradients), but:
- Use appropriate bitrate: `8M` for 1080p
- Enable hardware acceleration: `hardwareAcceleration: { enabled: false }` for quality
- Use software encoding for best quality

## Troubleshooting

### Problem: Render is Too Slow

**Solutions:**
1. Use preview mode: `{ preview: true }`
2. Enable adaptive sampling: `{ adaptive: true }`
3. Use lower quality: `{ quality: "low" }`
4. Disable for UI layers
5. Use async rendering: `startRenderAsync()`
6. Increase concurrency: `{ concurrency: 8 }`

### Problem: Not Enough Blur

**Solutions:**
1. Increase samples: `{ samples: 16 }`
2. Increase shutter angle: `{ shutterAngle: 270 }`
3. Increase blur amount: `{ blurAmount: 1.5 }`
4. Check adaptive isn't too aggressive: `{ motionThreshold: 0.005 }`

### Problem: Too Much Blur

**Solutions:**
1. Decrease samples: `{ samples: 6 }`
2. Decrease shutter angle: `{ shutterAngle: 90 }`
3. Decrease blur amount: `{ blurAmount: 0.5 }`

### Problem: Banding Artifacts

**Solutions:**
1. Enable stochastic sampling: `{ stochastic: true }`
2. Increase samples: `{ samples: 16 }`
3. Check video encoding settings: use higher bitrate

### Problem: Motion Blur Not Showing

**Check:**
1. Is `enabled: true`?
2. Are objects actually moving? (check animations)
3. Is motion fast enough? (slow motion needs fewer samples)
4. Is layer-level config disabling it?
5. Check console logs for warnings

### Problem: Inconsistent Blur Quality

**Solutions:**
1. Disable adaptive: `{ adaptive: false }`
2. Disable variable rate: `{ variableSampleRate: false }`
3. Use fixed samples throughout
4. Check for layer-level overrides

### Problem: Out of Memory

**Solutions:**
1. Reduce samples: `{ samples: 8 }`
2. Lower resolution
3. Use streaming mode: `{ useStreaming: true }`
4. Increase system memory
5. Render in smaller chunks

## Examples

See `/examples/motion-blur/` for complete examples:

1. **basic.json** - Simple motion blur demonstration
2. **comparison.json** - Side-by-side with/without blur
3. **advanced.json** - All advanced features
4. **variable-rate.json** - Variable sample rate demo
5. **stochastic.json** - Stochastic sampling demo

### Example: Simple Setup

```json
{
  "motionBlur": {
    "enabled": true,
    "quality": "medium"
  }
}
```

### Example: High Quality Production

```json
{
  "motionBlur": {
    "enabled": true,
    "quality": "high",
    "adaptive": true,
    "stochastic": true
  }
}
```

### Example: Mixed Scene Quality

```json
{
  "composition": {
    "scenes": [
      {
        "id": "title",
        "motionBlur": { "enabled": false }
      },
      {
        "id": "action",
        "motionBlur": { "quality": "ultra", "adaptive": true }
      },
      {
        "id": "credits",
        "motionBlur": { "quality": "low" }
      }
    ]
  }
}
```

### Example: Per-Layer Control

```json
{
  "layers": [
    {
      "id": "background",
      "motionBlur": { "blurAmount": 0.5 }
    },
    {
      "id": "hero",
      "motionBlur": { "blurAmount": 1.5, "stochastic": true }
    },
    {
      "id": "ui",
      "motionBlur": { "enabled": false }
    }
  ]
}
```

---

## Additional Resources

- **Examples:** `/examples/motion-blur/`
- **API Reference:** See type definitions in `@rendervid/core`
- **Performance Guide:** See "Performance Optimization" section
- **GitHub Issue:** #26 for technical details

## Support

For issues or questions:
- Check the troubleshooting section above
- Review examples in `/examples/motion-blur/`
- Report bugs at https://github.com/anthropics/rendervid/issues
