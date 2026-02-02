# SVG Logo Reveal

Animated SVG drawing effect revealing a star logo path by path, perfect for logo reveals and brand animations.

## Preview

![Preview](./preview.gif)

## Features

- SVG path drawing animation (Vivus-style)
- One-by-one path reveal mode
- Star logo with circular border
- Customizable stroke color and background
- Smooth text entrance animations
- Clean, professional presentation

## Usage

```bash
pnpm run examples:render effects/svg-logo-reveal
```

## Inputs

| Input | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | No | YOUR BRAND |
| `strokeColor` | color | No | #ffd700 (gold) |
| `backgroundColor` | color | No | #1a1a2e |

## Technical Details

- **Duration**: 5 seconds at 30fps (150 frames)
- **Resolution**: 1920x1080 (Full HD)
- **Component**: SVGDrawing with oneByOne mode
- **Drawing Duration**: 3 seconds
- **Stroke Width**: 4px
- **Delay Between Paths**: 0.2 seconds
- **Easing**: ease-in-out for smooth motion

## SVG Content

The template includes a star logo with circular border:
- 5-pointed star path drawn first
- Circle border drawn second
- Paths animate sequentially with delay

## Customization

Replace the SVG content to animate your own logo:

1. Prepare your SVG with path elements
2. Update the `svgContent` in the template
3. Adjust `viewBox` to match your SVG dimensions
4. Modify `duration` and `delay` for timing
5. Try different animation modes:
   - `sync`: All paths draw together
   - `oneByOne`: Sequential path drawing (used here)
   - `delayed`: Staggered start, finish together

## Use Cases

- Logo reveals for brand videos
- Product launch animations
- Channel intros/outros
- Brand identity presentations
- Social media content
- Website hero animations
