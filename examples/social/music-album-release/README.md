# Music Album Release

Square format album release announcement with album art, pulsing glow effects, artist info, and streaming platform badges.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Square format album release announcement with album art, pulsing glow effects, artist info, and streaming platform badges.

## Features

- 1080x1080 (1:1)
- Album artwork display with layered pulsing glow rings
- Artist name and album title with text shadow effects
- Streaming platform badges for Spotify, Apple Music, YouTube Music, and Tidal
- 6-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| artistName | string | AURORA WAVES | Artist Name |
| albumTitle | string | Midnight Echoes | Album Title |
| albumArt | url | https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&h=800&fit=crop | Album Artwork |
| accentColor | color | #f43f5e | Accent Color |

## Quick Start

```bash
pnpm run examples:render social/music-album-release
```

## Output

- **Format**: MP4 video
- **Resolution**: 1080x1080
- **Frame Rate**: 30 fps
- **Duration**: 6 seconds
