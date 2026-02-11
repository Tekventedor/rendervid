# Fashion Lookbook

Elegant high-fashion editorial lookbook with three scenes: hero reveal, collection details, and shop CTA.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Elegant high-fashion editorial lookbook with three scenes: hero reveal, collection details, and shop CTA. Minimal design with serif typography and gold accents.

## Features

- 1920x1080 (16:9)
- Three-scene editorial layout with hero, details, and CTA
- Gold accent lines and elegant corner decorations
- Serif typography with wide letter spacing and image support
- 9-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| collectionName | string | ETHEREAL | Collection Name |
| season | string | AUTUMN / WINTER | Season |
| year | string | 2026 | Year |
| designerName | string | CLAIRE FONTAINE | Designer Name |
| description | string | A meditation on texture and form. Flowing silhouettes meet structured tailoring in a palette inspired by autumn's quiet elegance. | Collection Description |
| heroImage | url | hero.jpg | Hero Image |
| detailImage | url | detail.jpg | Detail Image |
| website | string | www.maisoneclat.com | Website URL |

## Quick Start

```bash
pnpm run examples:render fashion/lookbook
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: 9 seconds
