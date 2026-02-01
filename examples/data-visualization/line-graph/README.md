# Line Graph

Animated line graph with point-by-point reveal.

## Preview

![Preview](preview.gif)

## Description

An animated line graph that draws progressively, revealing data points one by one. Features grid lines, axis labels, and smooth line drawing animation. Ideal for showing trends, growth metrics, and time-series data.

## Features

- 16:9 aspect ratio (1920x1080)
- Progressive line drawing
- Animated data points
- Grid background
- Axis labels
- 7-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `title` | string | Yes | "Revenue Growth" | Chart title |
| `yAxisLabel` | string | No | "Revenue ($M)" | Y-axis label |
| `xAxisLabel` | string | No | "Quarter" | X-axis label |
| `lineColor` | color | No | #22c55e | Line color |
| `backgroundColor` | color | No | #0f172a | Background color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render data-visualization/line-graph

# Render with custom labels
pnpm run examples:render data-visualization/line-graph \
  --input.title "User Growth" \
  --input.yAxisLabel "Users (K)" \
  --input.xAxisLabel "Month"
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 7 seconds
