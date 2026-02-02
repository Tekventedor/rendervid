# Effects Templates

This directory contains advanced video templates showcasing various effects components from the @rendervid/components library.

## Glitch Effect Templates

Three templates demonstrating the powerful `GlitchEffect` component with different use cases and aesthetics.

### 1. Glitch Title (`glitch-title/`)

**Cyberpunk-style title card with dramatic glitch effects**

A static title intro with intense RGB split and scramble glitch effects. Perfect for tech content, gaming videos, or any project needing an edgy, cyberpunk aesthetic.

**Key Features:**
- RGB Split glitch on main title
- Scramble effect on subtitle
- Neon green accent colors (customizable)
- Dark gradient background with grid overlay
- Animated accent bars with glow
- Corner bracket UI elements
- Scanline and vignette effects

**Best For:** Gaming intros, tech tutorials, cyberpunk content, hacker-themed videos

**Duration:** 6 seconds

---

### 2. Glitch Reveal (`glitch-reveal/`)

**Progressive reveal from chaos to clarity**

Text starts completely glitched and gradually becomes clear through multiple glitch type transitions. Simulates decoding, signal clearing, or data decryption.

**Key Features:**
- Decreasing glitch intensity (100% → 0%)
- Transitions through all 5 glitch types
- Dual text system (initial → final)
- Animated scan line
- Progress indicator bars
- Stage labels (INITIALIZING, PROCESSING, etc.)
- Dynamic noise overlay

**Best For:** Data decryption sequences, transmission effects, dramatic reveals, sci-fi interfaces

**Duration:** 6 seconds

**Glitch Timeline:**
1. Scramble (0-20%) - Most chaotic
2. Noise (20-40%) - Digital corruption
3. RGB Split (40-60%) - Color separation
4. Shift (60-80%) - Position shifts
5. Slice (80-100%) - Subtle displacement

---

### 3. Glitch Transition (`glitch-transition/`)

**Multi-layer composition with varied glitch frequencies**

Multiple text layers each with different glitch types and frequencies creating complex visual dynamics. Layers glitch independently, sometimes creating dramatic simultaneous bursts.

**Key Features:**
- 4 independent text layers
- Different glitch types per layer (RGB Split, Slice, Scramble, Shift)
- Varied frequencies (0.3, 0.18, 0.12, 0.08 per second)
- Staggered entrance timing
- Gradient text colors
- Animated background bars
- Color-coordinated corner accents
- Pulsing center dot

**Best For:** Music video intros, gaming transitions, tech presentations, YouTube channel intros

**Duration:** 6 seconds

**Layer Configuration:**
- Line 1: RGB Split, high frequency (pink gradient)
- Line 2: Slice, medium frequency (cyan gradient)
- Line 3: Scramble, low frequency (yellow gradient)
- Tagline: Shift, very low frequency (white)

---

## Glitch Types Reference

All templates use the `GlitchEffect` component which supports 5 glitch types:

1. **Slice** - Horizontal slices with displacement (VHS-style)
2. **Shift** - Position and skew transformations
3. **RGB Split** - Chromatic aberration (most dramatic)
4. **Noise** - Digital noise with scanlines
5. **Scramble** - Chaotic multi-layer fragmentation

## Component Information

These templates use the following components:
- `GlitchEffect` - Core glitch effects wrapper
- `Text` - Basic text rendering
- `GradientText` - Multi-color gradient text
- `Shape` - Geometric shapes for accents

## Technical Notes

**Performance:**
- All glitch effects use deterministic, seeded randomness
- Frame-accurate timing ensures consistency
- Optimized for video export
- May be CPU-intensive during real-time preview

**Customization:**
- Each template has TypeScript source (`.tsx`)
- JSON config for metadata and defaults
- Comprehensive README with usage examples
- Easy to modify timing, colors, and text

## Usage

These are TypeScript/TSX templates that can be rendered using the rendervid CLI:

```bash
# Render with default values
rendervid render examples/effects/glitch-title

# Render with custom values
rendervid render examples/effects/glitch-title \
  --title "YOUR TITLE" \
  --subtitle "Your Subtitle" \
  --accentColor "#ff00ff"
```

## Other Effect Templates

This directory also contains templates for:
- **Particle Effects** - ParticleSystem component demos
- **Typewriter Effects** - TypewriterEffect component demos
- **SVG Effects** - SVGDrawing component demos
- **Metaball Effects** - Advanced shader effects

## Resources

- [GlitchEffect Documentation](/packages/components/docs/GlitchEffect.md)
- [GlitchEffect Examples](/packages/components/examples/glitch-effect-example.tsx)
- [Component Registry](/packages/components/src/registry/)

## Contributing

When adding new effect templates:
1. Create a new directory with descriptive name
2. Include `template.tsx`, `template.json`, and `README.md`
3. Follow existing structure and naming conventions
4. Document all customization options
5. Provide usage examples and best practices

## License

Part of the rendervid examples collection.
