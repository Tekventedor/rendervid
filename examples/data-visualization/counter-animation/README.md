# Counter Animation

Animated counting numbers with formatting.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Dynamic number counter animation that counts up from zero to a target value. Features large typography, optional formatting (currency, percentage), and smooth easing. Perfect for showcasing statistics, achievements, and KPIs.

## Features

- 16:9 aspect ratio (1920x1080)
- Smooth counting animation
- Number formatting support
- Large, impactful typography
- Optional prefix/suffix
- 5-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `title` | string | Yes | "Total Revenue" | Counter title |
| `targetValue` | number | Yes | 1000000 | Target number |
| `prefix` | string | No | "$" | Number prefix |
| `suffix` | string | No | "" | Number suffix |
| `primaryColor` | color | No | #22c55e | Number color |
| `backgroundColor` | color | No | #0f172a | Background color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render data-visualization/counter-animation

# Render with custom counter
pnpm run examples:render data-visualization/counter-animation \
  --input.title "Happy Customers" \
  --input.targetValue 50000 \
  --input.prefix "" \
  --input.suffix "+"
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 5 seconds
