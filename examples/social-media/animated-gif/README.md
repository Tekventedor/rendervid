# Animated GIF

Optimized animated GIF template for social media and web use.

## Description

Compact animated GIF with bold typography and smooth entrance animations. Optimized for small file sizes while maintaining visual quality, making it ideal for social media posts, email campaigns, and web content.

## Features

- 1:1 aspect ratio (480x480)
- Optimized for GIF format (15fps, reduced colors)
- Smooth entrance animations
- Customizable colors and text
- 3-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `headline` | string | Yes | "Check This Out" | Main headline |
| `subtitle` | string | No | "Something amazing is happening" | Supporting text |
| `accentColor` | color | No | #f97316 | Accent color |
| `backgroundColor` | color | No | #18181b | Background |

## Quick Start

```bash
pnpm run examples:render social-media/animated-gif
```

## GIF Optimization

This example uses the `getGifOptimizationPreset('social')` preset which configures:

- **Max file size**: 8MB (Twitter/X limit)
- **Colors**: 128 (good balance of quality and size)
- **FPS**: 15 (smooth enough for most animations)
- **Dither**: Floyd-Steinberg (best quality dithering)

You can also use `'web'` or `'email'` presets for different use cases.
