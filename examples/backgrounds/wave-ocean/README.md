# Wave Ocean

Serene ocean wave background with multiple flowing layers in blue and teal. Perfect for beach, summer, and ocean-themed content.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)


This template features:
- Multiple layers of animated ocean waves
- Smooth wave motion from bottom to top
- Blue sky gradient background
- Decorative sun element
- Floating title animation
- Wave icon decoration
- Beach and ocean color palette

## Features

- WaveBackground component with 3 layers
- Flowing waves from bottom direction
- Sky-to-ocean gradient
- Gentle floating text animation
- SVG wave icon decoration
- Customizable wave colors and speed
- 6 seconds at 30fps (180 frames)

## Usage

```bash
pnpm run examples:render backgrounds/wave-ocean
```

### With Custom Values

```bash
pnpm run examples:render backgrounds/wave-ocean -- \
  --title "BEACH RESORT" \
  --subtitle "Your tropical escape" \
  --waveSpeed 0.4
```

## Inputs

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | ENDLESS SUMMER | Main title text |
| `subtitle` | string | No | Dive into paradise | Subtitle text |
| `waveColors` | array | No | See below | Array of hex color codes for waves |
| `waveSpeed` | number | No | 0.3 | Wave animation speed (0.1-2.0) |
| `waveCount` | number | No | 3 | Number of wave layers (1-3) |
| `amplitude` | number | No | 60 | Wave height in pixels (20-120) |

### Default Wave Colors

```json
["#0ea5e9", "#06b6d4", "#14b8a6"]
```

These create a sky blue to teal ocean palette.

## Customization Examples

### Tropical Paradise
```json
{
  "waveColors": ["#06b6d4", "#14b8a6", "#10b981"],
  "waveSpeed": 0.25,
  "amplitude": 70
}
```

### Deep Ocean
```json
{
  "waveColors": ["#1e40af", "#1e3a8a", "#312e81"],
  "waveSpeed": 0.2,
  "amplitude": 50
}
```

### Sunset Beach
```json
{
  "waveColors": ["#f97316", "#fb923c", "#fbbf24"],
  "waveSpeed": 0.3,
  "amplitude": 65
}
```

## Technical Details

- Resolution: 1920x1080 (Full HD)
- Frame Rate: 30fps
- Duration: 6 seconds (180 frames)
- Component: WaveBackground from @rendervid/components
- Wave Direction: bottom
- Background: Sky-to-ocean gradient (#7dd3fc to #0ea5e9)

## Animation Timeline

- **Frame 0-20**: Waves start flowing
- **Frame 20-60**: Title fades in and floats up (0.7-2s)
- **Frame 50-85**: Subtitle fades in (1.7-2.8s)
- **Frame 85-180**: All elements visible with continuous wave motion
- **Throughout**: Gentle floating animation on title (sine wave)

## Design Elements

### Sky Gradient
Creates a beautiful ocean horizon effect transitioning from light sky blue to deeper ocean blue.

### Wave Layers
Three overlapping wave layers create depth and realistic ocean movement. Each layer moves at slightly different speeds.

### Decorative Sun
A soft, glowing sun element adds warmth to the composition.

### Floating Animation
The title gently floats up and down to create a calm, ocean-like feel.

## Use Cases

- Beach resorts and hotels
- Summer events and festivals
- Travel and tourism agencies
- Vacation packages
- Ocean conservation campaigns
- Surfing and water sports
- Cruise lines
- Coastal real estate
- Wellness and spa services
- Tropical destinations
