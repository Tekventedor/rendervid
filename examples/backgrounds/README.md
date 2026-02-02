# Background Templates

A collection of stunning video templates showcasing the AuroraBackground and WaveBackground components from @rendervid/components. These templates demonstrate advanced background effects with smooth animations and professional design.

## Templates

### 1. Aurora Intro
**Path:** `backgrounds/aurora-intro`

Stunning northern lights aurora background with animated title and subtitle. Perfect for elegant introductions and brand presentations.

**Features:**
- AuroraBackground with flowing gradients
- Vibrant northern lights colors (purple, pink, blue)
- Fade-in and scale title animation
- Elegant subtitle with decorative line
- 6 seconds at 30fps

**Best For:**
- Product launches
- Brand introductions
- Event openings
- Corporate presentations

**Preview Colors:** Purple, Pink, Blue, Teal

---

### 2. Wave Ocean
**Path:** `backgrounds/wave-ocean`

Serene ocean wave background with multiple flowing layers in blue and teal. Perfect for beach, summer, and ocean-themed content.

**Features:**
- WaveBackground with 3 layers from bottom
- Sky-to-ocean gradient
- Floating text animation
- Decorative sun element
- SVG wave icon
- 6 seconds at 30fps

**Best For:**
- Beach resorts and hotels
- Summer events
- Travel and tourism
- Wellness content
- Ocean conservation

**Preview Colors:** Sky Blue, Cyan, Teal

---

### 3. Wave Energy
**Path:** `backgrounds/wave-energy`

High-energy wave background with vibrant purple/pink colors and waves from both top and bottom. Perfect for tech, gaming, and energetic content.

**Features:**
- Dual WaveBackground (top and bottom)
- Fast-moving waves
- Elastic bounce animation
- Chromatic aberration effect
- Orbiting particles
- Gradient text
- 5 seconds at 30fps

**Best For:**
- Tech product launches
- Gaming tournaments
- Music releases
- Fitness events
- Modern brand reveals

**Preview Colors:** Purple, Magenta, Hot Pink

---

## Quick Start

### Render a Template

```bash
# Aurora Intro
pnpm run examples:render backgrounds/aurora-intro

# Wave Ocean
pnpm run examples:render backgrounds/wave-ocean

# Wave Energy
pnpm run examples:render backgrounds/wave-energy
```

### Customize Values

```bash
# Custom aurora colors
pnpm run examples:render backgrounds/aurora-intro -- \
  --title "YOUR BRAND" \
  --auroraColors '["#ff6b6b", "#ee5a6f", "#c44569"]'

# Custom wave speed
pnpm run examples:render backgrounds/wave-ocean -- \
  --waveSpeed 0.5 \
  --amplitude 80

# Custom energy colors
pnpm run examples:render backgrounds/wave-energy -- \
  --waveColors '["#00ff88", "#00ffff", "#0088ff"]' \
  --waveSpeed 1.2
```

## Components Used

### AuroraBackground
Creates flowing gradient aurora/northern lights effects.

**Props:**
- `colors` - Array of hex colors for gradients
- `speed` - Animation speed multiplier
- `blur` - Blur amount in pixels
- `opacity` - Overall opacity
- `frame` - Current frame number
- `totalFrames` - Total animation frames
- `fps` - Frames per second

### WaveBackground
Creates animated fluid wave effects using SVG paths.

**Props:**
- `colors` - Array of hex colors for wave layers
- `waveCount` - Number of wave layers (1-3)
- `amplitude` - Wave height in pixels
- `frequency` - Wave frequency
- `speed` - Animation speed multiplier
- `direction` - 'top', 'bottom', or 'both'
- `opacity` - Overall opacity
- `frame` - Current frame number
- `fps` - Frames per second

## Common Input Parameters

All templates support these base parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | string | Main title text |
| `subtitle` | string | Subtitle text |
| `colors` | array | Array of hex color codes |
| `speed` | number | Animation speed (0.1-2.0) |

See individual template READMEs for complete parameter lists.

## Color Palettes

### Calm & Professional
```json
{
  "aurora": ["#667eea", "#764ba2", "#4facfe"],
  "wave": ["#0ea5e9", "#06b6d4", "#14b8a6"]
}
```

### Vibrant & Energetic
```json
{
  "aurora": ["#f093fb", "#4facfe", "#00f2fe"],
  "wave": ["#8b5cf6", "#d946ef", "#ec4899"]
}
```

### Warm & Inviting
```json
{
  "aurora": ["#ff6b6b", "#ee5a6f", "#feca57"],
  "wave": ["#f97316", "#fb923c", "#fbbf24"]
}
```

### Cool & Modern
```json
{
  "aurora": ["#00d2ff", "#3a7bd5", "#667eea"],
  "wave": ["#1e40af", "#1e3a8a", "#312e81"]
}
```

## Technical Specifications

### Video Output
- **Resolution:** 1920x1080 (Full HD)
- **Frame Rate:** 30fps
- **Format:** MP4 (H.264)
- **Duration:** 5-6 seconds

### Performance
- Frame-based animations for deterministic rendering
- No external dependencies for backgrounds
- Efficient SVG path generation for waves
- CSS-based gradients for aurora effects

## Design Philosophy

These templates follow key design principles:

1. **Simplicity** - Clean, uncluttered compositions
2. **Motion** - Smooth, purposeful animations
3. **Readability** - High contrast, legible text
4. **Flexibility** - Easy customization through props
5. **Performance** - Optimized for video rendering

## Customization Tips

### Typography
- Use system fonts for fast rendering
- Keep letter spacing generous for readability
- Consider text shadows for depth
- Maintain high contrast with background

### Colors
- Use 3-5 colors for best results
- Ensure colors complement each other
- Test with different opacity values
- Consider color psychology for your message

### Animation
- Start animations after a brief delay
- Use easing functions for natural motion
- Stagger elements for visual interest
- Keep duration appropriate for content

### Composition
- Follow rule of thirds
- Leave breathing room around text
- Use decorative elements sparingly
- Balance visual weight

## Examples in the Wild

These templates are perfect for:

- Social media posts (Instagram, TikTok, YouTube)
- Website hero sections
- Email campaigns
- Digital signage
- Presentation slides
- Advertisement intros
- Podcast visualizers
- Stream overlays

## Contributing

Have ideas for new background templates? Contributions are welcome!

1. Create a new directory under `examples/backgrounds/`
2. Include `index.tsx`, `template.json`, and `README.md`
3. Follow the existing template structure
4. Add preview images or GIFs
5. Document all customization options

## Resources

- [AuroraBackground Documentation](/packages/components/src/backgrounds/AuroraBackground.tsx)
- [WaveBackground Documentation](/packages/components/src/backgrounds/WaveBackground.tsx)
- [Component Library](/packages/components/README.md)
- [RenderVid Documentation](/README.md)

## License

MIT License - Feel free to use these templates in your projects!
