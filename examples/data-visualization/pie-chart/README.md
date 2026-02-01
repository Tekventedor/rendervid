# Pie Chart

Animated pie chart with segment reveal.

## Preview

![Preview](preview.gif)

## Description

A dynamic pie chart animation where segments appear one by one with rotation and scale effects. Features a legend, percentage labels, and smooth transitions between segments.

## Features

- 16:9 aspect ratio (1920x1080)
- Sequential segment reveals
- Rotation animations
- Percentage labels
- Animated legend
- 6-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `title` | string | Yes | "Budget Allocation" | Chart title |
| `segment1Label` | string | No | "Marketing" | First segment label |
| `segment1Value` | number | No | 35 | First segment value (%) |
| `segment2Label` | string | No | "Development" | Second segment label |
| `segment2Value` | number | No | 40 | Second segment value (%) |
| `segment3Label` | string | No | "Operations" | Third segment label |
| `segment3Value` | number | No | 25 | Third segment value (%) |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render data-visualization/pie-chart

# Render with custom data
pnpm run examples:render data-visualization/pie-chart \
  --input.title "Time Spent" \
  --input.segment1Label "Work" \
  --input.segment1Value 50
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 6 seconds
