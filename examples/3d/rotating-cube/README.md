# 3D Rotating Cube

A 3D rotating cube with customizable colors and rotation speed, showcasing ThreeScene component capabilities.

## Preview

![Preview](./preview.gif)

[View animated SVG](preview.svg)

## Features

- 3D box geometry using CSS 3D transforms
- Multi-axis rotation animation
- Smooth entrance animation with scale effect
- Customizable cube and background colors
- Directional lighting for depth perception
- Title text overlay with slide-in animation

## Usage

```bash
pnpm run examples:render 3d/rotating-cube
```

## Inputs

| Input | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | No | 3D CUBE |
| `cubeColor` | color | No | #4c00ff |
| `backgroundColor` | color | No | #1a1a2e |

## Technical Details

- **Duration**: 5 seconds at 30fps (150 frames)
- **Resolution**: 1920x1080 (Full HD)
- **Component**: ThreeScene with box geometry
- **Rotation**: Multi-axis (X: 0.5, Y: 1, Z: 0.3 radians/sec)
- **Scale**: 1.5x for better visibility
- **Lighting**: Directional lighting with drop shadow

## Customization

You can customize this template by modifying:
- Cube color and background color
- Rotation speeds on each axis in the `rotation` prop
- Camera distance for perspective changes
- Scale factor for size adjustments
- Enable wireframe mode for a different look
