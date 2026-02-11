# Logo Reveal

Animated logo reveal with professional effects.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

A sleek logo reveal animation with particle effects, glow, and smooth scaling. Features a building anticipation with light streaks before the logo appears, followed by a tagline fade-in. Perfect for brand intros and video openings.

## Features

- 16:9 aspect ratio (1920x1080)
- Particle/light streak effects
- Scale-in logo animation
- Glow effect behind logo
- Tagline fade-in
- 5-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `brandName` | string | Yes | "BRAND" | Brand/company name |
| `tagline` | string | No | "Innovation Redefined" | Brand tagline |
| `primaryColor` | color | No | #3b82f6 | Accent color |
| `backgroundColor` | color | No | #030712 | Background color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render marketing/logo-reveal

# Render with custom brand
pnpm run examples:render marketing/logo-reveal \
  --input.brandName "ACME" \
  --input.tagline "Building Tomorrow"
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 5 seconds

## Animation Timeline

| Time | Element | Animation |
|------|---------|-----------|
| 0.0s | Light streaks | Fade in and move |
| 0.5s | Glow effect | Scale and pulse |
| 1.0s | Brand name | Scale in with bounce |
| 2.0s | Tagline | Fade in |
