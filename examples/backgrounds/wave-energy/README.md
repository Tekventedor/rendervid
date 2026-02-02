# Wave Energy

High-energy wave background with vibrant purple/pink colors and waves from both top and bottom. Perfect for tech, gaming, and energetic content.

## Preview

This template features:
- Dual wave systems (top and bottom) for maximum impact
- Fast-moving waves with vibrant purple/pink gradients
- Elastic bounce animation on entrance
- Glitch-style chromatic aberration effect
- Pulse animation on title
- Gradient text effect
- Orbiting energy particles
- Modern tech aesthetic

## Features

- WaveBackground component with 'both' direction
- Two independent wave systems at different speeds
- Dynamic text animations with elastic easing
- Gradient text with background clip
- Chromatic aberration shadow effect
- Animated particle system
- Vignette overlay for depth
- 5 seconds at 30fps (150 frames)

## Usage

```bash
pnpm run examples:render backgrounds/wave-energy
```

### With Custom Values

```bash
pnpm run examples:render backgrounds/wave-energy -- \
  --title "LEVEL UP" \
  --subtitle "YOUR GAME" \
  --tagline "Competitive Gaming Platform" \
  --waveSpeed 1.2
```

## Inputs

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | UNLEASH | Main title (first line) |
| `subtitle` | string | Yes | THE POWER | Subtitle (second line) |
| `tagline` | string | No | Next Generation Technology | Tagline text |
| `waveColors` | array | No | See below | Array of hex color codes for waves |
| `waveSpeed` | number | No | 0.8 | Wave animation speed (0.3-2.0) |
| `waveCount` | number | No | 3 | Number of wave layers (1-3) |
| `amplitude` | number | No | 70 | Wave height in pixels (40-120) |

### Default Wave Colors

```json
["#8b5cf6", "#d946ef", "#ec4899"]
```

These create a vibrant purple-to-pink energy palette.

## Customization Examples

### Neon Gaming
```json
{
  "waveColors": ["#00ff88", "#00ffff", "#0088ff"],
  "waveSpeed": 1.2,
  "amplitude": 80
}
```

### Fire Energy
```json
{
  "waveColors": ["#ff6b00", "#ff0066", "#cc00ff"],
  "waveSpeed": 1.0,
  "amplitude": 90
}
```

### Electric Blue
```json
{
  "waveColors": ["#0066ff", "#00ccff", "#6600ff"],
  "waveSpeed": 0.9,
  "amplitude": 75
}
```

### Cyber Purple
```json
{
  "waveColors": ["#8b5cf6", "#7c3aed", "#6d28d9"],
  "waveSpeed": 1.1,
  "amplitude": 85
}
```

## Technical Details

- Resolution: 1920x1080 (Full HD)
- Frame Rate: 30fps
- Duration: 5 seconds (150 frames)
- Component: WaveBackground from @rendervid/components
- Wave Direction: both (top and bottom simultaneously)
- Background: Dark radial gradient (#1a0a2e to #0a0a0a)

## Animation Timeline

- **Frame 0-10**: Waves begin moving
- **Frame 10-35**: Title bounces in with elastic easing (0.3-1.2s)
- **Frame 25-45**: Subtitle enters (0.8-1.5s)
- **Frame 50-80**: Tagline fades in (1.7-2.7s)
- **Throughout**: Continuous pulse, particle orbits, and wave motion
- **Throughout**: Chromatic glitch effect on title

## Special Effects

### Elastic Bounce
The title uses an elastic easing function for a punchy, energetic entrance that overshoots and bounces back.

### Chromatic Aberration
A glitch-style shadow effect creates RGB color separation for a modern, digital aesthetic.

### Gradient Text
The subtitle uses CSS background-clip for a smooth purple-to-pink gradient fill.

### Pulse Effect
Subtle continuous scaling creates an alive, breathing effect on the title.

### Particle System
Six orbiting particles circle the text, adding movement and energy.

### Dual Wave System
Waves come from both top and bottom at different speeds, creating a sandwich effect and maximum visual impact.

## Use Cases

- Tech product launches
- Gaming tournaments and events
- Music festival announcements
- Fitness and sports content
- Modern brand reveals
- App launches
- Streaming overlays
- E-sports branding
- Concert promotions
- High-energy advertisements
- YouTube intros for tech/gaming channels
- Podcast intros
- Award show graphics
