# Image Slideshow

A beautiful slideshow with smooth fade transitions between images.

## Preview

![Preview](./preview.gif)

## Features

- Smooth fade transitions between images
- Ken Burns zoom effect on each slide
- Supports 3 images
- Perfect for portfolios, galleries, and memories

## Usage

```bash
pnpm run examples:render getting-started/04-image-slideshow
```

## Inputs

| Input | Type | Required | Default |
|-------|------|----------|---------|
| `image1` | image | Yes | flowhunt.io blog image |
| `image2` | image | Yes | flowhunt.io blog image |
| `image3` | image | Yes | flowhunt.io blog image |

## Customization

Replace the default images with your own URLs:

```bash
pnpm run examples:render getting-started/04-image-slideshow \
  --input image1="https://example.com/photo1.jpg" \
  --input image2="https://example.com/photo2.jpg" \
  --input image3="https://example.com/photo3.jpg"
```
