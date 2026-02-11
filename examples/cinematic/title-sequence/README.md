# Cinematic Title Sequence

An elegant, film-style title sequence with golden accents, letterbox bars, and slow cinematic animations.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

An elegant, film-style title sequence with golden accents, letterbox bars, and slow cinematic animations. Perfect for movie trailers, short films, and premium video intros.

## Features

- 1920x1080 (16:9)
- Golden decorative lines and diamond accent elements
- Letterbox bars with dark vignette overlays
- Director credit and "Coming Soon" text with staggered fade-ins
- 8-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| title | string | THE LAST HORIZON | Title |
| subtitle | string | Every ending is a new beginning | Subtitle |
| director | string | JAMES CARTER | Director Name |
| accentColor | color | #d4a574 | Accent Color |

## Quick Start

```bash
pnpm run examples:render cinematic/title-sequence
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: 8 seconds
