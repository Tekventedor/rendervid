# YouTube Subscribe Lower Third

Transparent lower third overlay with channel avatar, name, subscriber count and animated subscribe button.

## Preview

[View animated SVG](preview.svg)

## Description

A transparent lower third with channel avatar, name, subscriber count and animated subscribe button. Uses a custom React component for the animated UI. Perfect for YouTube video overlays.

## Features

- 1920x1080 (16:9)
- Transparent background for overlay use
- Animated subscribe button
- Custom React component (LowerThird)
- 6-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `channelName` | string | "FlowHunt" | Channel Name |
| `subscriberCount` | string | "202 subscribers" | Subscriber Count |
| `avatarUrl` | url | *(YouTube avatar URL)* | Avatar URL |
| `videoTitle` | string | "" | Video Title |

## Quick Start

```bash
pnpm run examples:render youtube-lower-third
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: 6 seconds
