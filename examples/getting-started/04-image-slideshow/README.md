# Image Slideshow

A beautiful slideshow with smooth fade transitions between images.

## Preview

![Preview](./preview.gif)

[View animated SVG](preview.svg)

[Download MP4](./video.mp4)

## Features

- Smooth fade transitions between images
- Ken Burns zoom effect on each slide
- Supports 3 images
- Perfect for portfolios, galleries, and memories

## Usage

```bash
npx tsx examples/getting-started/04-image-slideshow/render.ts
```

## Inputs

| Input | Type | Required | Default |
|-------|------|----------|---------|
| `image1` | string | Yes | photomaticai.com sample image |
| `image2` | string | Yes | photomaticai.com sample image |
| `image3` | string | Yes | photomaticai.com sample image |

## Customization

Replace the default images with your own URLs:

```bash
pnpm run examples:render getting-started/04-image-slideshow \
  --input image1="https://example.com/photo1.jpg" \
  --input image2="https://example.com/photo2.jpg" \
  --input image3="https://example.com/photo3.jpg"
```
