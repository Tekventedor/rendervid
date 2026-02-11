# Particle Snow Effect

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

A serene falling snow effect with multiple layers of particles creating a realistic winter scene, perfect for seasonal and holiday content.

## Features

- **Multi-Layer Snow**: Three particle layers for depth (large snow, small snow, snowflakes)
- **Gentle Movement**: Particles fall slowly with the `down` direction
- **Wrapping**: Snow wraps around creating an endless loop
- **Fade In**: Particles gently appear
- **Winter Color Palette**: Cool blues and whites
- **Frosted Content Panel**: Semi-transparent background for text
- **Decorative Snowflakes**: Star-shaped accents on the sides

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `message` | string | "Winter Wonderland" | Main message text |
| `subtitle` | string | "Season's Greetings" | Subtitle text |
| `backgroundColor` | color | #1a2332 | Top background color |
| `snowIntensity` | number | 120 | Number of large snow particles |

## Customization

### Adjusting Snow Intensity

The template includes three snow layers you can customize:

1. **Large Snow** (`snow-large`): Main visible snowflakes
   - Default count: 120 (controlled by `snowIntensity` input)
   - Size: 2-5 pixels
   - Speed: 0.5-1.5 pixels/frame

2. **Small Snow** (`snow-small`): Background depth particles
   - Count: 80 particles
   - Size: 1-2 pixels
   - Speed: 0.3-0.8 pixels/frame

3. **Snowflakes** (`snowflakes`): Star-shaped decorative particles
   - Count: 30 particles
   - Size: 3-7 pixels
   - Speed: 0.4-1 pixels/frame

### Changing Background Colors

Modify the gradient in the background layer:
```json
"colors": [
  { "offset": 0, "color": "#1a2332" },
  { "offset": 1, "color": "#0f1419" }
]
```

### Particle Colors

- Main snow: `#ffffff` (white)
- Decorative snowflakes: `#e0f2fe` (light blue)

## Technical Details

- **Duration**: 6 seconds (180 frames at 30fps)
- **Resolution**: 1920x1080
- **Components Used**:
  - `particle-system` - Three layers with different particle properties
- **Direction**: down (all particles fall downward)
- **Wrap**: Enabled (particles loop infinitely)

## Use Cases

- Winter/holiday content
- Seasonal greetings
- Christmas and New Year videos
- Weather-themed content
- Background for winter product showcases
- Calm, atmospheric transitions
- Event announcements during winter season
