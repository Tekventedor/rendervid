# Travel Destination Card

Full HD travel destination showcase with large background image, dark overlay gradient, location details, star ratings, pricing, and a Book Now CTA.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Full HD travel destination showcase with large background image, dark overlay gradient, location details, star ratings, pricing, and a Book Now CTA.

## Features

- 1920x1080 (16:9)
- Full-bleed background image with dark gradient overlays
- Animated star rating display with amber accents
- Price card with glassmorphism effect and Book Now CTA
- 7-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| destination | string | Santorini | Destination Name |
| country | string | Greece, Mediterranean | Country / Region |
| price | string | From $299/night | Price |
| rating | string | 4.8 | Rating (e.g. 4.8) |
| backgroundImage | url | https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&h=1080&fit=crop | Destination Photo |

## Quick Start

```bash
pnpm run examples:render social/travel-destination
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: 7 seconds
