# Particle Intro Animation

## Preview

![Preview](preview.gif)

A stunning particle-based intro animation featuring an aurora background with floating particles connected by lines, and title text appearing through the particle field.

## Features

- **Aurora Background**: Flowing gradient background with organic motion
- **Particle System**: Floating particles with random movement
- **Particle Connections**: Lines drawn between nearby particles
- **Text Reveal**: Title and subtitle appearing with scale and fade animations
- **Customizable**: Adjust particle count, colors, and text

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | string | "WELCOME" | Main title text |
| `subtitle` | string | "To the Future" | Subtitle text |
| `particleColor` | color | #ffffff | Color of particles and connections |
| `particleCount` | number | 80 | Number of particles to render |

## Customization

### Changing Colors

You can customize the aurora background colors by modifying the `colors` array in the aurora-background component:

```json
"colors": ["#667eea", "#764ba2", "#f093fb", "#4facfe"]
```

### Adjusting Particle Behavior

Modify these properties in the particle-system component:
- `speed`: Control particle movement speed
- `connectionDistance`: Adjust when particles connect
- `size`: Change particle size range
- `opacity`: Adjust particle visibility

## Technical Details

- **Duration**: 6 seconds (180 frames at 30fps)
- **Resolution**: 1920x1080
- **Components Used**:
  - `aurora-background` - Animated gradient background
  - `particle-system` - Particle effects with connections

## Use Cases

- Product launches
- Brand introductions
- Event opening sequences
- YouTube intro sequences
- Presentation openings
