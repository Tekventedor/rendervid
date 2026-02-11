# Podcast Episode Promo

Square format podcast episode promotion with cover art, animated sound wave bars, episode details, guest info, and streaming platform badges.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Square format podcast episode promotion with cover art, animated sound wave bars, episode details, guest info, and streaming platform badges.

## Features

- 1080x1080 (1:1)
- Podcast cover art with episode number badge
- Animated sound wave bars with floating effect
- Guest name and title with playback progress bar
- 6-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| showName | string | THE CREATIVE HOUR | Show Name |
| episodeNumber | string | 47 | Episode Number |
| episodeTitle | string | Design Systems That Scale | Episode Title |
| guestName | string | Marcus Chen | Guest Name |
| coverArt | url | https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop | Podcast Cover Art |
| accentColor | color | #10b981 | Accent Color |

## Quick Start

```bash
pnpm run examples:render social/podcast-episode
```

## Output

- **Format**: MP4 video
- **Resolution**: 1080x1080
- **Frame Rate**: 30 fps
- **Duration**: 6 seconds
