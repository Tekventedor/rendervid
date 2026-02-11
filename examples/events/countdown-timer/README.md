# Event Countdown Timer

Animated event countdown with flip-style time display, decorative star particles, gradient background, and event details.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Animated event countdown with flip-style time display, decorative star particles, gradient background, and event details. Uses a custom component for the countdown cards.

## Features

- 1920x1080 (16:9)
- Custom flip-style countdown component with days, hours, minutes, and seconds
- Decorative star particles with pulsing animations
- Gradient background with purple-to-blue color scheme
- 8-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| eventName | string | INNOVATION SUMMIT | Event Name |
| eventDate | string | MARCH 15, 2026 | Event Date |
| venue | string | Moscone Center, San Francisco | Venue |
| website | string | innovationsummit.io | Website |
| accentColor | color | #a855f7 | Accent Color |

## Quick Start

```bash
pnpm run examples:render events/countdown-timer
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: 8 seconds
