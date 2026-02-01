# Progress Dashboard

Animated dashboard with multiple progress indicators.

## Preview

![Preview](preview.gif)

## Description

A comprehensive dashboard animation featuring multiple progress indicators including circular gauges, progress bars, and statistics. All elements animate in with staggered timing for a professional presentation effect.

## Features

- 16:9 aspect ratio (1920x1080)
- Multiple progress indicators
- Circular gauge animations
- Linear progress bars
- Staggered reveal timing
- 8-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `title` | string | Yes | "Performance Dashboard" | Dashboard title |
| `metric1Label` | string | No | "Completion" | First metric label |
| `metric1Value` | number | No | 85 | First metric value (%) |
| `metric2Label` | string | No | "Efficiency" | Second metric label |
| `metric2Value` | number | No | 92 | Second metric value (%) |
| `metric3Label` | string | No | "Growth" | Third metric label |
| `metric3Value` | number | No | 67 | Third metric value (%) |
| `primaryColor` | color | No | #3b82f6 | Primary accent color |
| `backgroundColor` | color | No | #0f172a | Background color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render data-visualization/progress-dashboard

# Render with custom metrics
pnpm run examples:render data-visualization/progress-dashboard \
  --input.title "Q4 Results" \
  --input.metric1Label "Sales Target" \
  --input.metric1Value 95
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 8 seconds

## Dashboard Layout

```
┌─────────────────────────────────────────┐
│           Performance Dashboard          │
├─────────────────────────────────────────┤
│   ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│   │  85%    │  │  92%    │  │  67%    │ │
│   │Completion│ │Efficiency│ │ Growth  │ │
│   └─────────┘  └─────────┘  └─────────┘ │
├─────────────────────────────────────────┤
│   Progress Bars with Labels             │
└─────────────────────────────────────────┘
```
