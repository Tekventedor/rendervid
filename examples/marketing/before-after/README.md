# Before & After

Compelling before/after comparison video for transformations.

## Preview

![Preview](preview.gif)

## Description

A split-screen comparison video showing before and after states. Features a sliding reveal animation, bold labels, and dramatic transitions. Perfect for fitness, home renovation, product improvements, and any transformation content.

## Features

- 16:9 aspect ratio (1920x1080)
- Split-screen layout
- Sliding reveal animation
- Bold before/after labels
- Customizable comparison text
- 6-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `beforeLabel` | string | No | "BEFORE" | Left side label |
| `afterLabel` | string | No | "AFTER" | Right side label |
| `headline` | string | No | "The Transformation" | Main headline |
| `subtext` | string | No | "See the difference" | Supporting text |
| `beforeColor` | color | No | #64748b | Before side color |
| `afterColor` | color | No | #22c55e | After side color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render marketing/before-after

# Render with custom labels
pnpm run examples:render marketing/before-after \
  --input.headline "Kitchen Renovation" \
  --input.beforeLabel "OLD" \
  --input.afterLabel "NEW"
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 6 seconds
