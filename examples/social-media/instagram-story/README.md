# Instagram Story

Vertical video template optimized for Instagram Stories and Reels.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Eye-catching vertical video with gradient glows, animated text, and a pulsing CTA button. Perfect for product launches, announcements, and promotional content.

## Features

- 9:16 aspect ratio (1080x1920)
- Gradient glow effects
- Staggered text animations
- Pulsing CTA button
- 6-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `headline` | string | Yes | "New Drop" | Main headline |
| `subheadline` | string | No | "Limited Edition" | Supporting text |
| `ctaText` | string | No | "Swipe Up" | CTA button text |
| `primaryColor` | color | No | #ec4899 | Accent color |
| `backgroundColor` | color | No | #0f0f0f | Background |

## Quick Start

```bash
pnpm run examples:render social-media/instagram-story
```

## Output

- **Format**: MP4 video
- **Resolution**: 1080x1920
- **Frame Rate**: 30 fps
- **Duration**: 6 seconds
