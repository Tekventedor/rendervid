# TextTrail Component

A text animation component that creates a motion trail effect by rendering multiple copies of text with decreasing opacity. The trail follows the text in a specified direction, creating a dynamic motion blur or ghost effect.

## Features

- Frame-aware rendering for consistent animation
- Multiple trail copies with configurable length
- Eight directional options (horizontal, vertical, diagonal)
- Customizable opacity gradient from start to end
- Optional continuous motion animation
- Optional blur effect on trail copies
- Full typography control

## Installation

The TextTrail component is part of the `@rendervid/components` package.

```bash
npm install @rendervid/components
```

## Basic Usage

```tsx
import { TextTrail } from '@rendervid/components';

function MyVideo() {
  return (
    <TextTrail
      text="Hello World"
      frame={currentFrame}
      fps={30}
      direction="right"
      trailLength={5}
      trailSpacing={8}
    />
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Text to display with the trail effect |
| `frame` | `number` | Current frame number for animation |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fps` | `number` | `30` | Frames per second for animation timing |
| `trailLength` | `number` | `5` | Number of trail copies to render |
| `trailSpacing` | `number` | `8` | Spacing between trail copies in pixels |
| `direction` | `TrailDirection` | `"right"` | Direction of the trail |
| `startOpacity` | `number` | `1` | Starting opacity for the main text (0-1) |
| `endOpacity` | `number` | `0.1` | Ending opacity for the last trail copy (0-1) |
| `speed` | `number` | `1` | Animation speed multiplier |
| `animate` | `boolean` | `false` | Enable continuous motion animation |
| `blur` | `number` | `0` | Blur effect on trail copies in pixels |
| `fontSize` | `number` | `24` | Font size in pixels |
| `color` | `string` | `"#ffffff"` | Text color |
| `fontFamily` | `string` | `"Arial, sans-serif"` | Font family |
| `fontWeight` | `string \| number` | `"normal"` | Font weight |
| `lineHeight` | `number \| string` | `1.5` | Line height |
| `textAlign` | `"left" \| "center" \| "right" \| "justify"` | `"left"` | Text alignment |
| `letterSpacing` | `number` | `undefined` | Letter spacing in pixels |
| `textShadow` | `string` | `undefined` | CSS text shadow |
| `className` | `string` | `undefined` | CSS class name |
| `style` | `CSSProperties` | `undefined` | Inline styles |

### Trail Directions

The `direction` prop accepts the following values:

- `"left"` - Trail extends to the left
- `"right"` - Trail extends to the right
- `"up"` - Trail extends upward
- `"down"` - Trail extends downward
- `"top-left"` - Trail extends diagonally to top-left
- `"top-right"` - Trail extends diagonally to top-right
- `"bottom-left"` - Trail extends diagonally to bottom-left
- `"bottom-right"` - Trail extends diagonally to bottom-right

## Examples

### Basic Horizontal Trail

```tsx
<TextTrail
  text="Hello World"
  frame={currentFrame}
  fps={30}
  direction="right"
  trailLength={5}
  trailSpacing={8}
  fontSize={48}
  color="#ffffff"
/>
```

### Animated Diagonal Trail

```tsx
<TextTrail
  text="Speed Demon"
  frame={currentFrame}
  fps={30}
  direction="bottom-right"
  trailLength={8}
  trailSpacing={10}
  animate={true}
  speed={2}
  fontSize={56}
  color="#00ff00"
  fontWeight="bold"
/>
```

### Vertical Trail with Blur

```tsx
<TextTrail
  text="Motion Blur"
  frame={currentFrame}
  fps={30}
  direction="down"
  trailLength={6}
  trailSpacing={10}
  blur={2}
  startOpacity={1}
  endOpacity={0.1}
  fontSize={52}
  color="#ff6b6b"
/>
```

### Long Trail with Glow Effect

```tsx
<TextTrail
  text="VELOCITY"
  frame={currentFrame}
  fps={30}
  direction="right"
  trailLength={12}
  trailSpacing={5}
  startOpacity={1}
  endOpacity={0}
  blur={1.5}
  animate={true}
  speed={1.5}
  fontSize={64}
  color="#00d9ff"
  fontWeight="900"
  letterSpacing={4}
  textShadow="0 0 20px rgba(0, 217, 255, 0.8)"
/>
```

### Subtle Trail Effect

```tsx
<TextTrail
  text="Subtle Motion"
  frame={currentFrame}
  fps={30}
  direction="right"
  trailLength={4}
  trailSpacing={4}
  startOpacity={1}
  endOpacity={0.3}
  fontSize={40}
  color="#dfe6e9"
/>
```

## How It Works

The trail effect is created by:

1. **Multiple Copies**: Rendering `trailLength` copies of the text
2. **Positioning**: Each copy is offset based on the `direction` and `trailSpacing`
3. **Opacity Gradient**: Opacity decreases linearly from `startOpacity` to `endOpacity`
4. **Optional Animation**: When `animate` is enabled, the trail moves continuously
5. **Optional Blur**: Each trail copy can have increasing blur for enhanced motion effect

## Performance Considerations

- Trail copies are absolutely positioned relative to the main text
- Each copy is a separate span element
- For better performance, use lower `trailLength` values (3-8)
- Blur effects can be GPU-accelerated but may impact performance on lower-end devices

## Use Cases

- **Action Text**: Create dynamic, energetic text for action scenes
- **Speed Effects**: Emphasize speed and motion in sports or racing content
- **Sci-Fi UI**: Create futuristic interface elements
- **Music Videos**: Add rhythm and energy to lyrics
- **Title Sequences**: Create eye-catching animated titles
- **Gaming Content**: Add dynamic text effects for game-related videos

## Related Components

- **WaveText**: Creates wave motion effects on text
- **StaggerText**: Animates characters with staggered timing
- **BlurText**: Animates blur on text
- **GlitchEffect**: Creates glitch effects on elements

## TypeScript Support

The component is fully typed with TypeScript. Import the types:

```tsx
import type { TextTrailProps, TrailDirection } from '@rendervid/components';
```

## License

Part of the Rendervid project. See the main project README for license information.
