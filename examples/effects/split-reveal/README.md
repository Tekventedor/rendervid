# Split Screen Reveal

Clean, modern split-screen comparison with a before/after reveal.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Clean, modern split-screen comparison with a before/after reveal. Scene 1 shows side-by-side images with labels and a sliding divider. Scene 2 transitions to a full reveal with statistics and branding. Ideal for product comparisons, transformations, and case studies.

## Features

- 1920x1080 (16:9)
- Two-scene layout with comparison and reveal transitions
- Before/after panels with color-coded labels and sliding divider
- Animated statistics with bounce-in effects
- 8-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| title | string | THE TRANSFORMATION | Title |
| beforeLabel | string | BEFORE | Before Label |
| afterLabel | string | AFTER | After Label |
| beforeImage | url | | Before Image URL |
| afterImage | url | | After Image URL |
| stat1 | string | +250% Growth | Statistic 1 |
| stat2 | string | 98% Satisfaction | Statistic 2 |

## Quick Start

```bash
pnpm run examples:render effects/split-reveal
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: 8 seconds
