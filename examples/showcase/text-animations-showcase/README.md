# Text Animations Showcase

A comprehensive showcase demonstrating all 8 new text animation components from the react-bits collection.

## Preview

![Preview](preview.gif)

## Duration
18 seconds (540 frames at 30fps)

## Components Showcased

### 1. ScrambleText (0-2.25s)
- **Effect:** Matrix-style character scrambling before revealing
- **Features:** Sequential mode with alphanumeric charset
- **Color:** Bright green (#00ff88) on dark background
- **Text:** "MATRIX DECODING"

### 2. FlipText (2.25-4.5s)
- **Effect:** 3D card flip animation on Y-axis
- **Features:** Letter-by-letter flip with perspective
- **Color:** Hot pink (#ff0080)
- **Text:** "3D CARD FLIP"

### 3. FuzzyText (4.5-6.75s)
- **Effect:** Blur and opacity transition for focus reveal
- **Features:** Letter-by-letter with stagger delay
- **Color:** Cyan (#00d9ff)
- **Text:** "FOCUS REVEAL"

### 4. NeonText (6.75-9s)
- **Effect:** Glowing neon tube with pulse animation
- **Features:** Background glow and high intensity
- **Color:** Magenta (#ff00ff)
- **Text:** "NEON LIGHTS"

### 5. TextTrail (9-11.25s)
- **Effect:** Motion trail with blur following text
- **Features:** Animated movement with 10 trail copies
- **Color:** Gold (#ffdd00)
- **Text:** "VELOCITY"

### 6. LetterMorph (11.25-13.5s)
- **Effect:** Morphs from one word to another with scramble
- **Features:** Sequential letter-by-letter morphing
- **Color:** Mint green (#00ffaa)
- **Text:** "HELLO" → "WORLD"

### 7. MorphText (13.5-15.75s)
- **Effect:** Cross-fade morphing between multiple phrases
- **Features:** Loops through 3 words with blur transitions
- **Color:** Orange (#fdcb6e)
- **Text:** "AMAZING" → "STUNNING" → "BRILLIANT"

### 8. DistortText (15.75-18s)
- **Effect:** Wave distortion with sine motion
- **Features:** Continuous wave animation
- **Color:** Bright cyan (#00ffff)
- **Text:** "WAVE MOTION"

## Technical Details

- **Resolution:** 1920x1080 (Full HD)
- **Frame Rate:** 30fps
- **Total Frames:** 540
- **Scene Duration:** ~67-68 frames each (~2.25 seconds)
- **Background:** Dark (#0a0a0a)
- **Watermark:** "RenderVid by FlowHunt.io" (top right, 70% opacity)

## Rendering

```bash
# From project root
cd examples/showcase/text-animations-showcase

# Render the showcase
node render.js

# Or use the CLI
rendervid render . --output ./output.mp4
```

## Component Features Highlighted

Each component demonstrates:
- Frame-aware rendering for deterministic playback
- Custom configuration options (colors, timing, effects)
- Smooth animations at 30fps
- Professional typography and styling
- Integration with Rendervid's component system

## Use Cases

This showcase is perfect for:
- Demonstrating text animation capabilities
- Testing new components in production
- Creating promotional materials
- Showcasing framework features
- Generating preview content for documentation
