# Testimonial Video

Display customer testimonials with professional styling.

## Preview

![Preview](preview.gif)

## Description

A professional testimonial video template featuring customer quotes with attribution. Includes decorative quote marks, fade-in animations, and clean typography for maximum readability and impact.

## Features

- 16:9 aspect ratio (1920x1080)
- Large decorative quote marks
- Professional typography
- Fade-in text animations
- Customer attribution
- 7-second duration

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `quote` | string | Yes | "This product changed..." | Customer quote |
| `customerName` | string | No | "Sarah Johnson" | Customer name |
| `customerTitle` | string | No | "CEO, TechCorp" | Customer title |
| `rating` | number | No | 5 | Star rating (1-5) |
| `primaryColor` | color | No | #f59e0b | Accent color |
| `backgroundColor` | color | No | #0c0a09 | Background color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render marketing/testimonial-video

# Render with custom testimonial
pnpm run examples:render marketing/testimonial-video \
  --input.quote "Absolutely incredible service!" \
  --input.customerName "John Smith" \
  --input.customerTitle "Product Manager"
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 7 seconds
