# Glitch Transition

A multi-layer text composition with varied glitch effects creating a dynamic, edgy visual.

## Overview

This template showcases multiple text layers, each with different glitch types and frequencies, creating a complex and visually striking composition. Text appears in staggered sequence with each layer experiencing its own unique glitch pattern. The varying frequencies create moments where multiple glitches happen simultaneously, producing dramatic bursts of digital chaos.

## Features

- **Multi-Layer Composition**: 4 independent text layers
- **Varied Glitch Types**: RGB Split, Slice, Scramble, and Shift effects
- **Different Frequencies**: Each layer glitches at its own rate
- **Staggered Entrance**: Layers appear in sequence
- **Gradient Text**: Colorful gradient fills on each line
- **Animated Background**: Moving accent bars
- **Corner Accents**: Color-coordinated corner brackets
- **Center Lines**: Expanding horizontal accent lines
- **Scanlines & Vignette**: Atmospheric overlays
- **Subtle Noise**: Light texture overlay
- **Pulsing Center Dot**: Subtle focal point

## Customization

### Inputs

- **Line 1** (required): Top text (e.g., "DIGITAL")
- **Line 2** (required): Main/middle text, largest size (e.g., "CHAOS")
- **Line 3** (required): Third text (e.g., "THEORY")
- **Tagline** (optional): Subtitle text below (e.g., "Where order meets disorder")
- **Background Color** (optional): Base background color (default: #0a0a0a - near black)

### Pre-Designed Color Schemes

Each line has a fixed gradient color scheme optimized for visual impact:
- **Line 1**: Pink gradient (#ff0080 to #ff00ff)
- **Line 2**: Cyan gradient (#00ffff to #0080ff)
- **Line 3**: Yellow-orange gradient (#ffff00 to #ff8000)
- **Tagline**: White (#ffffff)

Corner accents match the line colors for visual cohesion.

## Technical Details

- **Duration**: 6 seconds (180 frames at 30fps)
- **Resolution**: 1920x1080 (Full HD)
- **Glitch Types Used**: RGB Split, Slice, Scramble, Shift

### Layer Configuration

| Layer | Glitch Type | Intensity | Frequency | Duration | Character |
|-------|------------|-----------|-----------|----------|-----------|
| Line 1 | RGB Split | 0.7 | 0.3/sec | 100ms | High energy, frequent |
| Line 2 | Slice | 0.8 | 0.18/sec | 120ms | Strong, moderate |
| Line 3 | Scramble | 0.5 | 0.12/sec | 80ms | Moderate, occasional |
| Tagline | Shift | 0.4 | 0.08/sec | 60ms | Subtle, rare |

### Appearance Timeline

- **Frame 0**: Background and animated bars visible
- **Frame 0**: Line 1 appears with RGB split glitches
- **Frame 10**: Top-left corner bracket fades in
- **Frame 20**: Line 2 appears with slice glitches
- **Frame 30**: Top-right corner bracket fades in
- **Frame 40**: Line 3 appears with scramble glitches
- **Frame 50**: Bottom-left corner bracket fades in
- **Frame 70**: Tagline appears with shift glitches
- **Frame 70**: Bottom-right corner bracket fades in

### Glitch Synchronization

With different frequencies, layers create natural "glitch storms" when multiple effects trigger simultaneously. This happens approximately:
- Every 3-5 seconds: 2 layers glitch together
- Every 8-12 seconds: 3+ layers glitch together
- Creates organic rhythm without manual timing

## Use Cases

- Music video intros
- Gaming content transitions
- Tech brand presentations
- Cyberpunk aesthetics
- Electronic music visuals
- Digital art showcases
- Product launch videos
- Event announcements
- Stream transitions
- YouTube channel intros

## Typography Tips

1. **Keep it short**: 1-2 words per line works best
2. **Line 2 dominance**: Main word should be on Line 2 (largest)
3. **Complementary words**: Choose words that build a concept
4. **Uppercase**: All caps maintains visual consistency
5. **Bold fonts**: Heavy fonts show glitch effects better

## Example Combinations

**Gaming Stream**
```
line1: "LEVEL"
line2: "UP"
line3: "GAMING"
tagline: "Next level content"
```

**Music Producer**
```
line1: "BEAT"
line2: "MAKER"
line3: "STUDIO"
tagline: "Where sound becomes art"
```

**Tech Channel**
```
line1: "CODE"
line2: "BREAK"
line3: "TECH"
tagline: "Breaking down complexity"
```

**Cybersecurity**
```
line1: "CYBER"
line2: "DEFENSE"
line3: "FORCE"
tagline: "Protecting digital frontiers"
```

**Art/Design**
```
line1: "PIXEL"
line2: "PERFECT"
line3: "DESIGN"
tagline: "Digital creativity unleashed"
```

## Visual Characteristics

**High Energy**
- Multiple simultaneous glitches
- Bright, contrasting colors
- Constant motion (animated bars)
- Dynamic feel throughout

**Layered Depth**
- Staggered entrance creates depth
- Vignette adds focus
- Overlapping elements build complexity
- Foreground/background separation

**Cyberpunk Aesthetic**
- Neon color palette
- Glitch distortions
- Grid/tech elements
- Scanline effects

## Performance Considerations

- **Most Complex Template**: Uses 4 independent GlitchEffect instances
- **CPU Usage**: Moderate to high during rendering
- **Export Quality**: Maintains quality in final render
- **Real-time Preview**: May lag on slower machines
- **Optimization**: All effects are deterministic and cache-friendly

## Animation Behavior

**Predictable yet Random**
- Glitches use seeded randomness
- Same result every render
- Feels organic despite being deterministic
- Different each layer due to phase offsets

**Visual Rhythm**
- Fast frequency on Line 1 (0.3/sec) = energetic
- Medium on Line 2 (0.18/sec) = present but controlled
- Slow on Line 3 (0.12/sec) = subtle
- Very slow on tagline (0.08/sec) = barely noticeable

## Customization Tips

1. **Background**: Dark backgrounds make glitch colors pop
2. **Tagline**: Keep it under 6 words for readability
3. **Word length**: Vary lengths across lines for visual interest
4. **Testing**: Preview full duration to see glitch interactions
5. **Color contrast**: Default colors already optimized

## Technical Notes

**Gradient Colors**
- Each line uses 2-3 color stops
- GradientText component handles blending
- Colors chosen for maximum glitch visibility

**Accent Elements**
- Corner brackets reinforce frame
- Center lines guide eye to center
- Animated bars add motion
- All timed to complement text appearance

**Layering Order** (bottom to top)
1. Background gradient
2. Animated bars
3. Accent elements
4. Text layers (with glitches)
5. Overlays (scanlines, vignette, noise)

## Related Templates

- **glitch-title**: Single title with glitches (simpler)
- **glitch-reveal**: Progressive reveal effect
- **kinetic-typography**: Multi-word without glitches

## Advanced Modifications

For developers wanting to customize:

- Adjust phase offsets for different timing
- Modify frequency values for glitch density
- Change gradient color arrays for different palettes
- Add more text layers (consider performance)
- Customize corner bracket animations
- Adjust vignette/overlay intensities

## Export Recommendations

- **Codec**: H.264 for best compatibility
- **Bitrate**: Higher bitrate recommended (10-15 Mbps)
- **Quality**: Use high quality setting to preserve glitch details
- **Format**: MP4 for web, ProRes for editing
