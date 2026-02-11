# Aurora Intro

Stunning northern lights aurora background with animated title and subtitle. Perfect for elegant introductions and brand presentations.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)


This template features:
- Flowing aurora borealis (northern lights) effect
- Smooth gradient animations with vibrant colors
- Centered title with fade-in and scale animation
- Elegant subtitle with slide-up effect
- Decorative line accent
- Customizable colors and animation speed

## Features

- AuroraBackground component with multiple gradient layers
- Dreamy blur and glow effects
- Frame-based deterministic animations
- Professional typography with text shadows
- Fully customizable colors, speed, and text
- 6 seconds at 30fps (180 frames)

## Usage

```bash
pnpm run examples:render backgrounds/aurora-intro
```

### With Custom Values

```bash
pnpm run examples:render backgrounds/aurora-intro -- \
  --title "YOUR BRAND" \
  --subtitle "Crafting Excellence" \
  --speed 1.2
```

## Inputs

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | WELCOME | Main title text |
| `subtitle` | string | No | Experience the Magic | Subtitle text |
| `auroraColors` | array | No | See below | Array of hex color codes |
| `speed` | number | No | 0.8 | Aurora animation speed (0.1-2.0) |
| `blur` | number | No | 40 | Blur amount in pixels (10-80) |
| `opacity` | number | No | 0.6 | Aurora opacity (0.1-1.0) |

### Default Colors

```json
["#667eea", "#764ba2", "#f093fb", "#4facfe", "#00f2fe"]
```

These create a purple-pink-blue northern lights palette.

## Customization Examples

### Warm Sunset Aurora
```json
{
  "auroraColors": ["#ff6b6b", "#ee5a6f", "#c44569", "#f8b500", "#feca57"],
  "speed": 0.6
}
```

### Cool Ice Aurora
```json
{
  "auroraColors": ["#00d2ff", "#3a7bd5", "#00f2fe", "#4facfe", "#667eea"],
  "speed": 1.0,
  "opacity": 0.7
}
```

### Emerald Green Aurora
```json
{
  "auroraColors": ["#11998e", "#38ef7d", "#06beb6", "#48bb78", "#2f855a"],
  "speed": 0.9
}
```

## Technical Details

- Resolution: 1920x1080 (Full HD)
- Frame Rate: 30fps
- Duration: 6 seconds (180 frames)
- Component: AuroraBackground from @rendervid/components
- Background Color: #0a0a1f (deep navy)

## Animation Timeline

- **Frame 0-30**: Aurora animation starts
- **Frame 30-75**: Title fades in and scales up (1-2.5s)
- **Frame 60-90**: Subtitle fades in and slides up (2-3s)
- **Frame 90-180**: All elements fully visible with flowing aurora

## Use Cases

- Product launches
- Brand introductions
- Event openings
- Conference presentations
- Social media announcements
- YouTube intros
- Corporate videos
- App launch videos
