# Particle Explosion Effect

## Preview

![Preview](preview.gif)

A dramatic explosion effect with radial particles bursting from the center in multiple colors, followed by impactful text reveal.

## Features

- **Radial Burst**: Particles explode outward from the center
- **Multi-Color Particles**: Red, yellow, and orange particles for depth
- **Multiple Particle Types**: Circles, stars, and squares
- **Center Glow**: Radial gradient glow at the explosion center
- **Fade Out Effect**: Particles fade as they travel
- **Text Reveal**: Message appears after the explosion

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `message` | string | "BOOM!" | Main message text |
| `subtitle` | string | "Make an Impact" | Subtitle text |
| `backgroundColor` | color | #0a0a0a | Background color |

## Customization

### Changing Explosion Colors

Modify the particle colors in each particle system layer:
- Red particles: `#ff6b6b`
- Yellow particles: `#ffd93d`
- Orange particles: `#ff9500`

### Adjusting Explosion Intensity

Control the explosion by modifying these properties:
- `count`: Number of particles (more = denser)
- `speed`: How fast particles travel outward
- `lifetime`: How long particles exist before fading

### Center Glow Colors

Customize the radial gradient in the center-glow layer:
```json
"colors": [
  { "offset": 0, "color": "#ffffff" },
  { "offset": 0.3, "color": "#ff6b6b" },
  { "offset": 0.6, "color": "#ffd93d" },
  { "offset": 1, "color": "transparent" }
]
```

## Technical Details

- **Duration**: 5 seconds (150 frames at 30fps)
- **Resolution**: 1920x1080
- **Components Used**:
  - `particle-system` - Three layers with different colors and types
- **Particle Types**: circle, star, square
- **Direction**: radial (explodes from center)

## Use Cases

- Action video intros
- Gaming content
- Product launch announcements
- Impact moments in presentations
- Highlight reels
- Celebration sequences
