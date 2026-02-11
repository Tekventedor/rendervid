# Product Showcase

Feature your product with stunning visuals, key features, and pricing.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

A professional product showcase video with three scenes: intro with product name and tagline, features display with staggered animations, and pricing with call-to-action. Perfect for product launches and promotional content.

## Features

- 16:9 aspect ratio (1920x1080)
- 3-scene structure (intro, features, pricing)
- Radial gradient glow effects
- Staggered slide-in animations
- Scale-in text effects
- 8-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `productName` | string | Yes | "Premium Headphones" | Product name |
| `tagline` | string | No | "Experience Pure Sound" | Product tagline |
| `price` | string | No | "$299" | Product price |
| `feature1` | string | No | "Active Noise Cancellation" | First feature |
| `feature2` | string | No | "40-Hour Battery Life" | Second feature |
| `feature3` | string | No | "Premium Materials" | Third feature |
| `primaryColor` | color | No | #8b5cf6 | Accent color |
| `backgroundColor` | color | No | #09090b | Background color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render marketing/product-showcase

# Render with custom product
pnpm run examples:render marketing/product-showcase \
  --input.productName "Smart Watch Pro" \
  --input.tagline "Your Life, Simplified" \
  --input.price "$399"
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 8 seconds

## Scene Structure

| Scene | Frames | Description |
|-------|--------|-------------|
| Intro | 0-90 | Product name with glow effect and tagline |
| Features | 90-180 | Three features with staggered slide-in |
| Pricing | 180-240 | Price display with CTA |
