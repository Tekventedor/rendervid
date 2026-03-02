# Complex Motion - Multiple Behaviors

Demonstrates 15+ behavior presets with multiple behaviors per object.

## Preview

![Demo](output.gif)

[📹 Watch full video (MP4)](output.mp4)

**Note**: This video shows a text-based demonstration. The actual 3D rendering (physics simulation, GPU particles, etc.) requires WebGL which is not available in headless video generation. All gaming features are fully implemented in code - see `packages/physics/`, `packages/renderer-browser/src/particles/`, `packages/renderer-browser/src/animation/`, and `packages/renderer-browser/src/behaviors/`.

## Features

- 5 objects with different behaviors
- Multiple behaviors combined
- Real-time procedural motion
- No keyframes required

## Available Behaviors (15+)

### Motion Patterns
- **orbit** - Circular motion around center
- **spiral** - Helical upward motion
- **figure8** - Figure-eight pattern
- **pendulum** - Swinging motion
- **patrol** - Move between waypoints

### Transformations
- **spin** - Continuous rotation
- **wobble** - Tilting motion
- **shake** - Random jittering
- **pulse** - Scale pulsing
- **breathe** - Slow scale animation

### Physics-Based
- **bounce** - Bouncing motion
- **float** - Floating up/down
- **wave** - Sine wave motion
- **hover** - Hovering with wobble

### Interactive
- **follow** - Follow target position
- **lookAt** - Orient toward target

## Configuration

```json
{
  "behaviors": [
    {
      "type": "spiral",
      "params": {
        "radius": 5,
        "height": 10,
        "speed": 1
      }
    },
    {
      "type": "wobble",
      "params": {
        "amount": 0.3,
        "speed": 3
      }
    }
  ]
}
```

## Combining Behaviors

Multiple behaviors can be applied to the same object:

```json
{
  "behaviors": [
    { "type": "float", "params": { "amplitude": 2 } },
    { "type": "spin", "params": { "speed": 1 } },
    { "type": "pulse", "params": { "min": 0.8, "max": 1.2 } }
  ]
}
```

## Parameters

Each behavior has customizable parameters:

### Orbit
- `radius`: Distance from center
- `speed`: Rotation speed
- `axis`: Rotation axis (x/y/z)

### Spiral
- `radius`: Spiral radius
- `height`: Vertical range
- `speed`: Movement speed

### Pulse
- `min`: Minimum scale
- `max`: Maximum scale
- `speed`: Pulsing speed

### Wobble
- `amount`: Wobble intensity
- `speed`: Wobble frequency

### Float
- `amplitude`: Vertical range
- `speed`: Float speed
- `offset`: Starting height

## Usage

```bash
npx rendervid render examples/behaviors/complex-motion/template.json
```
