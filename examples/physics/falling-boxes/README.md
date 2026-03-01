# Falling Boxes - Physics Demo

Demonstration of physics simulation with three boxes falling and bouncing on a ground plane.

## Preview

![Demo](output.gif)

[📹 Watch full video (MP4)](output.mp4)

**Note**: This video shows a text-based demonstration. The actual 3D physics simulation requires WebGL rendering which is not available in headless video generation. The physics engine (Rapier3D) is fully implemented and integrated - see the code in `packages/physics/` and `packages/renderer-browser/src/physics/`.

## Features

- **Dynamic rigid bodies**: Three boxes with different bounce properties
- **Static ground**: Immovable floor plane
- **Realistic physics**: Gravity, friction, and restitution
- **Shadows**: Soft shadows for depth perception
- **60 FPS**: Smooth physics simulation

## Physics Properties

### Box 1 (Red)
- Restitution: 0.6 (moderate bounce)
- Starting height: 8 units

### Box 2 (Cyan)
- Restitution: 0.7 (higher bounce)
- Starting height: 10 units

### Box 3 (Yellow)
- Restitution: 0.8 (highest bounce)
- Starting height: 12 units

### Ground
- Type: Static (immovable)
- Size: 20x20 units

## Usage

```bash
pnpm run examples:render physics/falling-boxes
```

## Technical Details

- **Physics Engine**: Rapier3D
- **Gravity**: [0, -9.81, 0] m/s²
- **Collider Type**: Cuboid (box-shaped)
- **Shadow Type**: PCF Soft
