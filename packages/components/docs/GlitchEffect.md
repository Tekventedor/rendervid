# GlitchEffect Component

A powerful digital distortion effect component that creates dramatic glitch effects for video content. Supports multiple glitch types with frame-accurate, deterministic animations.

## Features

- **5 Glitch Types**: slice, shift, rgb-split, noise, scramble
- **Frame-Aware**: Deterministic animations based on frame number
- **Seeded Randomness**: Consistent glitches across renders
- **Customizable Intensity**: Control effect strength (0-1)
- **Frequency Control**: Set glitches per second
- **Duration Control**: Adjust glitch duration in milliseconds
- **Composable**: Can wrap any content (text, images, etc.)
- **Layerable**: Stack multiple glitch effects

## Installation

```bash
npm install @rendervid/components
```

## Usage

### Basic Example

```tsx
import { GlitchEffect, Text } from '@rendervid/components';

function MyComponent({ frame }) {
  return (
    <GlitchEffect
      type="rgb-split"
      intensity={0.7}
      frequency={0.15}
      duration={100}
      frame={frame}
      fps={30}
    >
      <Text
        text="GLITCHY TEXT"
        fontSize={72}
        color="#00ff00"
      />
    </GlitchEffect>
  );
}
```

## Props

### GlitchEffectProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'slice' \| 'shift' \| 'rgb-split' \| 'noise' \| 'scramble'` | **required** | Type of glitch effect to apply |
| `intensity` | `number` | `0.5` | Intensity of the glitch (0-1) |
| `frequency` | `number` | `0.1` | Number of glitches per second |
| `duration` | `number` | `100` | Duration of each glitch in milliseconds |
| `frame` | `number` | **required** | Current frame number (from FrameAwareProps) |
| `fps` | `number` | `30` | Frames per second |
| `totalFrames` | `number` | optional | Total frames in animation |
| `className` | `string` | optional | CSS class name |
| `style` | `CSSProperties` | optional | Inline styles |
| `children` | `ReactNode` | optional | Content to apply glitch effect to |

## Glitch Types

### 1. Slice Effect

Cuts the content into horizontal slices and displaces them randomly.

```tsx
<GlitchEffect type="slice" intensity={0.7} frequency={0.2}>
  <YourContent />
</GlitchEffect>
```

**Best for**: VHS-style corruptions, scan line effects, retro aesthetics

**Technical details**:
- Creates 5 horizontal slices
- Each slice translates horizontally based on seeded random
- Displacement scales with intensity

### 2. Shift Effect

Randomly shifts and skews the entire content.

```tsx
<GlitchEffect type="shift" intensity={0.5} frequency={0.15}>
  <YourContent />
</GlitchEffect>
```

**Best for**: Subtle distortions, camera shake effects, instability

**Technical details**:
- Applies translateX and translateY transforms
- Adds skewX transform for warping
- All values deterministic from frame number

### 3. RGB Split Effect (Chromatic Aberration)

Separates RGB color channels with blend modes.

```tsx
<GlitchEffect type="rgb-split" intensity={0.8} frequency={0.1}>
  <YourContent />
</GlitchEffect>
```

**Best for**: Dramatic visual impact, cyberpunk aesthetic, color distortion

**Technical details**:
- Creates 3 layers (R, G, B channels)
- Each channel offset independently
- Uses screen blend mode for color mixing
- Most visually dramatic effect

### 4. Noise Effect

Adds digital noise, scanlines, and contrast/brightness variations.

```tsx
<GlitchEffect type="noise" intensity={0.9} frequency={0.25}>
  <YourContent />
</GlitchEffect>
```

**Best for**: Digital corruption, signal interference, data loss effects

**Technical details**:
- Uses SVG feTurbulence for noise generation
- Applies contrast and brightness filters
- Adds horizontal scanlines overlay
- Seeded noise pattern for consistency

### 5. Scramble Effect

Creates chaotic multi-layer fragmentation.

```tsx
<GlitchEffect type="scramble" intensity={0.6} frequency={0.12}>
  <YourContent />
</GlitchEffect>
```

**Best for**: Extreme distortion, data corruption, abstract effects

**Technical details**:
- Generates 7 distorted layers
- Each layer has unique transform, scale, rotation
- Random clip paths for fragmentation
- Mix blend modes for visual chaos

## Advanced Examples

### Layered Glitch Effects

Combine multiple glitch types for complex effects:

```tsx
<GlitchEffect type="rgb-split" intensity={0.6} frequency={0.1} frame={frame}>
  <GlitchEffect type="scramble" intensity={0.3} frequency={0.15} frame={frame}>
    <Text text="MULTI-LAYER GLITCH" fontSize={96} />
  </GlitchEffect>
</GlitchEffect>
```

### Sequenced Glitch Types

Switch glitch types over time:

```tsx
function SequencedGlitch({ frame }) {
  const glitchType =
    frame < 90 ? 'slice' :
    frame < 180 ? 'shift' :
    frame < 270 ? 'rgb-split' :
    frame < 360 ? 'noise' : 'scramble';

  return (
    <GlitchEffect type={glitchType} intensity={0.7} frame={frame}>
      <Text text={`Current: ${glitchType}`} fontSize={64} />
    </GlitchEffect>
  );
}
```

### Variable Intensity

Animate intensity over time:

```tsx
function PulsingGlitch({ frame }) {
  const intensity = 0.3 + Math.sin(frame * 0.1) * 0.4; // 0.3-0.7 range

  return (
    <GlitchEffect type="rgb-split" intensity={intensity} frame={frame}>
      <Text text="PULSING GLITCH" fontSize={72} />
    </GlitchEffect>
  );
}
```

### Custom Frequency Pattern

Create specific glitch timing:

```tsx
<GlitchEffect
  type="rgb-split"
  intensity={0.8}
  frequency={0.3}  // Glitch 0.3 times per second (every ~3.3 seconds)
  duration={50}    // Each glitch lasts 50ms
  frame={frame}
>
  <YourContent />
</GlitchEffect>
```

## Performance Considerations

1. **CPU-Intensive Effects**:
   - `scramble` and `noise` are the most CPU-intensive
   - `slice` and `shift` are relatively lightweight
   - `rgb-split` is moderate

2. **Rendering Tips**:
   - Lower `intensity` reduces visual complexity
   - Reduce `frequency` for fewer glitch occurrences
   - Consider simpler effects for real-time playback

3. **Video Rendering**:
   - All effects are deterministic and render consistently
   - Frame-accurate timing ensures smooth exports
   - No performance concerns for offline rendering

## Technical Details

### Deterministic Randomness

The component uses seeded random number generation based on frame number to ensure:
- Glitches appear at the same time in every render
- Random values are consistent across renders
- Perfect for video export and reproducible results

```typescript
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
```

### Glitch Timing

Glitches are scheduled based on:
1. `frequency`: How many glitches per second
2. `duration`: How long each glitch lasts
3. `frame` and `fps`: Current time position

The component calculates cycle intervals and uses seeded random to place glitches within each cycle.

### CSS Techniques

- **Slice**: `clip-path` and `transform: translateX`
- **Shift**: `transform: translate` and `skew`
- **RGB Split**: Multiple absolute positioned divs with `mix-blend-mode: screen`
- **Noise**: SVG filters (`feTurbulence`) and CSS filters
- **Scramble**: Complex transforms with `clip-path` polygons

## Registry Information

The component is automatically registered in the default registry:

```typescript
registry.register(GlitchEffect, {
  id: 'glitch-effect',
  name: 'Glitch Effect',
  description: 'Creates digital distortion effects with multiple glitch types',
  category: 'effects',
  tags: ['glitch', 'distortion', 'digital', 'vhs', 'corruption', 'effect', 'animation'],
  animated: true,
  version: '0.1.0',
});
```

## Examples

See `/packages/components/examples/glitch-effect-example.tsx` for complete examples including:
- All 5 glitch types demonstrated
- Layered effects
- Sequenced effects
- Integration with other components

## Related Components

- **Text**: Basic text component for glitch content
- **GradientText**: Gradient text that looks great with glitches
- **Image**: Apply glitches to images
- **TypewriterEffect**: Combine with typewriter for glitchy typing

## Tips and Tricks

1. **Cyberpunk Aesthetic**: Use `rgb-split` with neon colors
2. **VHS Effect**: Use `slice` with low intensity
3. **Data Corruption**: Use `noise` or `scramble` with high intensity
4. **Subtle Enhancement**: Low intensity (0.2-0.4) with infrequent glitches
5. **Dramatic Impact**: High intensity (0.7-1.0) `rgb-split` or `scramble`

## Browser Compatibility

- Modern browsers with CSS transforms support
- SVG filters for noise effect
- Blend modes for RGB split effect
- No browser-specific code or vendor prefixes needed

## TypeScript Support

Full TypeScript definitions included:

```typescript
export type GlitchType = 'slice' | 'shift' | 'rgb-split' | 'noise' | 'scramble';

export interface GlitchEffectProps extends AnimatedProps {
  type: GlitchType;
  intensity?: number;
  frequency?: number;
  duration?: number;
}
```

## License

Part of the @rendervid/components package.
