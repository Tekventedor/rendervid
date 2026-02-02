# TypewriterEffect Component

An enhanced typewriter effect component with advanced features including multiple cursor styles, backspace effects, word-by-word typing, and visual effects.

## Features

- **Multiple Typing Modes**: Character-by-character or word-by-word typing
- **Cursor Styles**: Bar, block, or underline cursor with customizable colors
- **Blinking Cursor**: Configurable cursor blink rate
- **Speed Control**: Preset speeds (slow, normal, fast) or custom characters per second
- **Start Delay**: Wait before starting the typing animation
- **Backspace Effect**: Delete characters with configurable speed and count
- **Sound Pulse**: Visual pulse effect on each character (simulates sound)
- **Custom Delays**: Per-character and per-word delay customization
- **Multi-line Support**: Type multiple lines of text
- **Loop Support**: Optionally loop the animation
- **Full TypeScript**: Complete type definitions

## Installation

```bash
npm install @rendervid/components
```

## Basic Usage

```tsx
import { TypewriterEffect } from '@rendervid/components';

<TypewriterEffect
  text="Hello, World!"
  frame={currentFrame}
  fps={30}
  speed="normal"
  cursor={true}
  cursorStyle="bar"
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string \| string[]` | Text to type. Single string or array of lines |
| `frame` | `number` | Current frame number |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fps` | `number` | `30` | Frames per second |
| `speed` | `'slow' \| 'normal' \| 'fast' \| number` | `'normal'` | Typing speed. Presets or characters per second |
| `cursor` | `boolean` | `true` | Show cursor |
| `cursorStyle` | `'bar' \| 'block' \| 'underline'` | `'bar'` | Cursor style |
| `cursorColor` | `string` | `'currentColor'` | Cursor color |
| `cursorBlinkRate` | `number` | `15` | Cursor blink rate in frames (0 to disable) |
| `mode` | `'characters' \| 'words'` | `'characters'` | Typing mode |
| `startDelay` | `number` | `0` | Frames to wait before starting |
| `loop` | `boolean` | `false` | Loop the animation |
| `fontSize` | `number` | `16` | Font size in pixels |
| `color` | `string` | `'#ffffff'` | Text color |
| `fontFamily` | `string` | `'monospace'` | Font family |
| `fontWeight` | `string \| number` | `'normal'` | Font weight |
| `lineHeight` | `number \| string` | `1.5` | Line height |
| `soundPulse` | `boolean` | `false` | Enable sound pulse effect |
| `soundPulseDuration` | `number` | `3` | Sound pulse duration in frames |
| `soundPulseScale` | `number` | `1.05` | Sound pulse scale factor |
| `preserveWhitespace` | `boolean` | `true` | Preserve whitespace and line breaks |
| `className` | `string` | - | CSS class name |
| `style` | `CSSProperties` | - | Inline styles |

### Advanced Props

#### Backspace Configuration

```typescript
backspace?: {
  startFrame: number;  // Frame at which to start backspacing
  count: number;       // Number of characters to delete
  speed?: number;      // Speed of backspace (characters per second)
}
```

Example:
```tsx
<TypewriterEffect
  text="This is a mistake..."
  frame={frame}
  backspace={{
    startFrame: 120,
    count: 8,
    speed: 20  // Backspace faster than typing
  }}
/>
```

#### Word Delay Configuration

```typescript
wordDelay?: {
  default: number;                  // Default delay between words in frames
  custom?: Record<number, number>;  // Custom delays for specific word indices
}
```

Example:
```tsx
<TypewriterEffect
  text="Wait... for... it!"
  frame={frame}
  mode="words"
  wordDelay={{
    default: 10,
    custom: {
      1: 30,  // Long pause after "Wait..."
      2: 30   // Long pause after "for..."
    }
  }}
/>
```

#### Custom Character Delays

```typescript
charDelays?: Record<number, number>  // Map of character index to delay in frames
```

Example:
```tsx
<TypewriterEffect
  text="Hello, World!"
  frame={frame}
  charDelays={{
    5: 20,   // Pause after "Hello"
    12: 30   // Pause at end
  }}
/>
```

## Speed Presets

| Preset | Characters per Second |
|--------|----------------------|
| `'slow'` | 5 |
| `'normal'` | 10 |
| `'fast'` | 20 |

You can also provide a custom number for precise control:
```tsx
speed={15}  // 15 characters per second
```

## Cursor Styles

### Bar (Default)
```tsx
<TypewriterEffect cursorStyle="bar" cursorColor="#00ff00" />
```
A thin vertical line cursor (classic terminal style).

### Block
```tsx
<TypewriterEffect cursorStyle="block" cursorColor="#00ff00" />
```
A solid block cursor that covers the width of a character.

### Underline
```tsx
<TypewriterEffect cursorStyle="underline" cursorColor="#00ff00" />
```
A thin horizontal line under the cursor position.

## Examples

### Example 1: Basic Typewriter

```tsx
<TypewriterEffect
  text="Hello, World!"
  frame={frame}
  fps={30}
  speed="normal"
  cursor={true}
  cursorStyle="bar"
  cursorColor="#00ff00"
  fontSize={32}
  color="#ffffff"
/>
```

### Example 2: Word-by-Word Typing

```tsx
<TypewriterEffect
  text="This types word by word"
  frame={frame}
  mode="words"
  speed="normal"
  wordDelay={{ default: 15 }}
  cursor={true}
/>
```

### Example 3: Multi-line Text

```tsx
<TypewriterEffect
  text={[
    "Line 1: First line",
    "Line 2: Second line",
    "Line 3: Third line"
  ]}
  frame={frame}
  fontSize={24}
  cursor={true}
/>
```

### Example 4: Backspace Effect

```tsx
<TypewriterEffect
  text="This is a typo!"
  frame={frame}
  speed="normal"
  backspace={{
    startFrame: 90,
    count: 5,
    speed: 20
  }}
  cursor={true}
/>
```

### Example 5: Sound Pulse Effect

```tsx
<TypewriterEffect
  text="Visual sound effects!"
  frame={frame}
  soundPulse={true}
  soundPulseDuration={3}
  soundPulseScale={1.1}
  cursor={true}
/>
```

### Example 6: Looping Animation

```tsx
<TypewriterEffect
  text="This loops forever"
  frame={frame}
  loop={true}
  speed="fast"
  cursor={true}
/>
```

### Example 7: Custom Character Delays

```tsx
<TypewriterEffect
  text="Hello... World!"
  frame={frame}
  charDelays={{
    5: 30,  // Long pause after "Hello"
  }}
  cursor={true}
/>
```

## Advanced Use Cases

### Simulating Typing Mistakes

```tsx
// First, type the wrong text
{frame < 180 && (
  <TypewriterEffect
    text="TypewriterEffect is amzing!"
    frame={frame}
    speed="normal"
    backspace={{
      startFrame: 120,
      count: 6,  // Delete "mzing!"
      speed: 15
    }}
  />
)}

// Then type the correct text
{frame >= 180 && (
  <TypewriterEffect
    text="TypewriterEffect is amazing!"
    frame={frame - 180}
    startDelay={0}
    speed="normal"
  />
)}
```

### Dramatic Pauses

```tsx
<TypewriterEffect
  text="Wait for it..."
  frame={frame}
  mode="words"
  wordDelay={{
    default: 10,
    custom: {
      2: 60  // Long pause before "it..."
    }
  }}
/>
```

### Terminal-Style Output

```tsx
<div style={{
  backgroundColor: '#000',
  padding: '20px',
  fontFamily: 'monospace',
  color: '#00ff00'
}}>
  <TypewriterEffect
    text={`$ npm install @rendervid/components\n> Installing...\n> Done!`}
    frame={frame}
    speed={20}
    cursor={true}
    cursorStyle="block"
    cursorColor="#00ff00"
    preserveWhitespace={true}
  />
</div>
```

## Performance Considerations

- The component recalculates visible text on every frame, which is optimized for smooth animation
- For very long texts (>1000 characters), consider breaking into multiple components
- Sound pulse effect adds a CSS transform that may impact performance on lower-end devices

## Comparison with Basic Typewriter

The enhanced TypewriterEffect provides significant improvements over the basic Typewriter component:

| Feature | Typewriter | TypewriterEffect |
|---------|-----------|------------------|
| Cursor Styles | Single character | Bar, Block, Underline |
| Typing Modes | Characters only | Characters & Words |
| Backspace | No | Yes |
| Custom Delays | No | Yes (per-char & per-word) |
| Sound Effects | No | Yes (visual pulse) |
| Multi-line | Limited | Full support |
| Loop Support | No | Yes |
| TypeScript | Basic | Full types |

## Type Definitions

```typescript
interface TypewriterEffectProps extends FrameAwareProps {
  text: string | string[];
  speed?: 'slow' | 'normal' | 'fast' | number;
  cursor?: boolean;
  cursorStyle?: 'block' | 'underline' | 'bar';
  cursorColor?: string;
  mode?: 'characters' | 'words';
  startDelay?: number;
  loop?: boolean;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  lineHeight?: number | string;
  cursorBlinkRate?: number;
  backspace?: BackspaceConfig;
  wordDelay?: WordDelayConfig;
  charDelays?: Record<number, number>;
  soundPulse?: boolean;
  soundPulseDuration?: number;
  soundPulseScale?: number;
  preserveWhitespace?: boolean;
}
```

## License

MIT
