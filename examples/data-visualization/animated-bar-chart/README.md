# Animated Bar Chart

Animated horizontal bar chart with staggered bar reveals.

## Preview

![Preview](preview.gif)

## Description

A professional animated bar chart with horizontal bars that slide in with staggered timing. Features customizable labels, values, and colors. Perfect for presenting market share, survey results, or any comparative data.

## Features

- 16:9 aspect ratio (1920x1080)
- Horizontal bar layout
- Staggered slide-in animations
- Percentage value labels
- Customizable colors per bar
- 6-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `title` | string | Yes | "Market Share 2024" | Chart title |
| `label1` | string | No | "Product A" | First bar label |
| `value1` | number | No | 45 | First bar value (%) |
| `label2` | string | No | "Product B" | Second bar label |
| `value2` | number | No | 30 | Second bar value (%) |
| `label3` | string | No | "Product C" | Third bar label |
| `value3` | number | No | 25 | Third bar value (%) |
| `primaryColor` | color | No | #3b82f6 | Primary bar color |
| `backgroundColor` | color | No | #0f172a | Background color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render data-visualization/animated-bar-chart

# Render with custom data
pnpm run examples:render data-visualization/animated-bar-chart \
  --input.title "Browser Market Share" \
  --input.label1 "Chrome" \
  --input.value1 65 \
  --input.label2 "Safari" \
  --input.value2 20
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 6 seconds

## Animation Timeline

| Time | Element | Animation |
|------|---------|-----------|
| 0.0s | Title | Fade in |
| 0.5s | Bar 1 track | Fade in |
| 1.0s | Bar 1 fill | Slide in from left |
| 1.2s | Bar 2 track | Fade in |
| 1.7s | Bar 2 fill | Slide in from left |
| 1.5s | Bar 3 track | Fade in |
| 2.3s | Bar 3 fill | Slide in from left |
