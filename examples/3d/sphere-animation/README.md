# 3D Sphere Animation

A wireframe sphere with smooth rotation and futuristic styling, perfect for tech and sci-fi content.

## Preview

![Preview](./preview.gif)

## Features

- 3D wireframe sphere using CSS 3D transforms
- Slow, elegant rotation on multiple axes
- Futuristic dark background with gradient accents
- Modern typography with animated title and subtitle
- Colored accent line for visual interest
- Ambient lighting for consistent glow

## Usage

```bash
pnpm run examples:render 3d/sphere-animation
```

## Inputs

| Input | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | No | FUTURISTIC TECH |
| `subtitle` | string | No | Next Generation 3D |
| `sphereColor` | color | No | #00ffff (cyan) |
| `accentColor` | color | No | #ff00ff (magenta) |

## Technical Details

- **Duration**: 6 seconds at 30fps (180 frames)
- **Resolution**: 1920x1080 (Full HD)
- **Component**: ThreeScene with sphere geometry
- **Wireframe**: Enabled for grid effect
- **Rotation**: Slow multi-axis (X: 0.2, Y: 0.4 radians/sec)
- **Scale**: 2x for impressive presence
- **Lighting**: Ambient lighting for even glow

## Design Notes

This template uses a dark, sci-fi aesthetic with:
- Wireframe sphere for technological feel
- Cyan/magenta color scheme (customizable)
- Subtle background gradients for depth
- Clean, modern typography with wide letter spacing
- Staggered entrance animations for professional flow

## Customization

Modify the template to:
- Change sphere and accent colors for different moods
- Adjust rotation speeds for faster/slower movement
- Try different geometry types (box, torus, plane)
- Disable wireframe for solid sphere
- Change background colors and gradient positions
