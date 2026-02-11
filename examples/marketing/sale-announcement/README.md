# Sale Announcement

Eye-catching promotional video for sales and special offers.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

A dynamic sale announcement video with bold typography, animated discount display, and urgency-building elements. Features gradient backgrounds, pulsing effects, and staggered text reveals.

## Features

- 16:9 aspect ratio (1920x1080)
- Bold, attention-grabbing typography
- Animated percentage display
- Pulsing emphasis effects
- Gradient backgrounds
- 6-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `headline` | string | Yes | "MEGA SALE" | Main headline |
| `discount` | string | No | "50% OFF" | Discount amount |
| `subtext` | string | No | "Limited Time Only" | Supporting text |
| `ctaText` | string | No | "Shop Now" | Call to action |
| `primaryColor` | color | No | #ef4444 | Accent color |
| `backgroundColor` | color | No | #0f0f0f | Background color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render marketing/sale-announcement

# Render with custom sale
pnpm run examples:render marketing/sale-announcement \
  --input.headline "BLACK FRIDAY" \
  --input.discount "70% OFF" \
  --input.subtext "This Weekend Only"
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 6 seconds
