# Fire Explosion - GPU Particle System

Advanced GPU-accelerated particle system with 5000 particles demonstrating fire explosion effect.

## Preview

![Demo](output.gif)

[📹 Watch full video (MP4)](output.mp4)

## Features

- **5000 Particles**: GPU-accelerated rendering for high particle counts
- **Color Gradient**: Yellow → Red → Black for realistic fire effect
- **Sphere Emission**: Particles emit from spherical volume
- **Turbulence**: Random forces for chaotic motion
- **Attractors**: Upward attractor simulates heat rising
- **Rotation**: Particles rotate as they move
- **Fade In/Out**: Smooth alpha transitions

## Configuration

```json
{
  "count": 5000,
  "shape": "sphere",
  "shapeSize": 0.5,
  "color": {
    "start": "#ffff00",
    "end": "#000000"
  },
  "turbulence": 0.5,
  "attractors": [{
    "position": [0, 5, 0],
    "strength": 2
  }]
}
```

## Performance

- 60 FPS at 1920x1080
- GPU shader-based rendering
- Instanced geometry
- Optimized attribute updates

## Advanced Features

### Emission Shapes
- `point`: Single point emission
- `sphere`: Spherical volume
- `box`: Rectangular volume
- `cone`: Conical emission

### Forces
- **Gravity**: Downward force
- **Turbulence**: Random noise
- **Attractors**: Point-based forces

### Visual Effects
- Color gradients (start → end)
- Rotation and angular velocity
- Fade in/out timing
- Size variation

## Usage

```bash
npx rendervid render examples/particles/fire-explosion/template.json
```
