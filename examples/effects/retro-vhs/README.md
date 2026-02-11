# Retro VHS Effect

Nostalgic VHS/CRT retro look with scan lines, chromatic aberration text, tracking bars, timecode, and authentic video artifacts.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Nostalgic VHS/CRT retro look with scan lines, chromatic aberration text, tracking bars, timecode, and authentic video artifacts. Perfect for retro-themed intros, music videos, or throwback content.

## Features

- 1920x1080 (16:9)
- Chromatic aberration title with red/cyan offset layers
- 18 scan lines and animated tracking bars
- Flashing REC indicator, timecode, and date stamp overlays
- 8-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| title | string | REWIND | Main Title |
| subtitle | string | A Trip Down Memory Lane | Subtitle |
| dateStamp | string | JAN 15 1993 | Date Stamp |

## Quick Start

```bash
pnpm run examples:render effects/retro-vhs
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: 8 seconds
