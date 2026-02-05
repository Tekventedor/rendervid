# Scene Transitions

Professional scene transition effects for smooth cuts between scenes in your videos. Rendervid includes 11 built-in transition types ranging from simple fades to complex geometric reveals.

## Features

- ✅ **11 Transition Types** - Fade, wipe, slide, zoom, and circle effects
- ✅ **Customizable Duration** - Control transition speed in frames
- ✅ **Custom Colors** - Match transition color to your design
- ✅ **Hardware Accelerated** - Smooth 60fps transitions using CSS transforms
- ✅ **Zero Configuration** - Works out of the box with sensible defaults

## Quick Start

### Using Scene Transitions

Add a transition component as the first layer in your scene:

```json
{
  "scenes": [{
    "id": "scene1",
    "startFrame": 0,
    "endFrame": 90,
    "layers": [{
      "type": "custom",
      "customComponent": {
        "name": "SceneTransition",
        "props": {
          "type": "fade",
          "duration": 30
        }
      }
    }]
  }]
}
```

## Transition Types

### Fade Transitions

#### fade
Classic fade transition - gradually reveals the scene.

```json
{
  "type": "fade",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Subtle scene changes, time lapses, mood shifts

---

### Wipe Transitions

#### wipe-left
Wipes from right to left, revealing the scene.

```json
{
  "type": "wipe-left",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Geographic transitions, directional movement

#### wipe-right
Wipes from left to right.

```json
{
  "type": "wipe-right",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Forward progression, next page effect

#### wipe-up
Wipes from bottom to top.

```json
{
  "type": "wipe-up",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Revealing content, upward progress

#### wipe-down
Wipes from top to bottom.

```json
{
  "type": "wipe-down",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Descending scenes, downward movement

---

### Slide Transitions

#### slide-left
Reveals scene by sliding from right to left (uses clip-path).

```json
{
  "type": "slide-left",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Horizontal navigation, swiping effect

#### slide-right
Reveals scene by sliding from left to right.

```json
{
  "type": "slide-right",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Backwards navigation, reverse swipe

---

### Zoom Transitions

#### zoom-in
Zooms in from small to large while fading.

```json
{
  "type": "zoom-in",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Focus attention, entering a space, close-up reveal

#### zoom-out
Zooms out from large to small while fading.

```json
{
  "type": "zoom-out",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Pulling back, revealing context, exit effect

---

### Circle Transitions

#### circle-in
Circular reveal from center, expanding outward.

```json
{
  "type": "circle-in",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Spotlight effect, focus reveal, iris open

#### circle-out
Circular reveal from edges, contracting inward.

```json
{
  "type": "circle-out",
  "duration": 30,
  "color": "#000000"
}
```

**Use cases:** Vintage effect, closing iris, vignette reveal

## Configuration Options

### Full Configuration

```typescript
interface SceneTransitionProps {
  /** Transition type */
  type:
    | 'fade'
    | 'wipe-left'
    | 'wipe-right'
    | 'wipe-up'
    | 'wipe-down'
    | 'slide-left'
    | 'slide-right'
    | 'zoom-in'
    | 'zoom-out'
    | 'circle-in'
    | 'circle-out';

  /** Transition duration in frames (default: 30) */
  duration?: number;

  /** Transition overlay color (default: '#000000') */
  color?: string;

  /** Scene width in pixels (default: 1920) */
  width?: number;

  /** Scene height in pixels (default: 1080) */
  height?: number;
}
```

## Usage Examples

### 1. Simple Fade Between Scenes

```json
{
  "scenes": [
    {
      "id": "intro",
      "startFrame": 0,
      "endFrame": 90,
      "layers": [
        { "type": "text", "props": { "text": "Scene 1" } }
      ]
    },
    {
      "id": "main",
      "startFrame": 90,
      "endFrame": 180,
      "layers": [
        {
          "type": "custom",
          "customComponent": {
            "name": "SceneTransition",
            "props": { "type": "fade", "duration": 30 }
          }
        },
        { "type": "text", "props": { "text": "Scene 2" } }
      ]
    }
  ]
}
```

### 2. Branded Wipe Transition

```json
{
  "customComponent": {
    "name": "SceneTransition",
    "props": {
      "type": "wipe-right",
      "duration": 45,
      "color": "#ff0080",
      "width": 1920,
      "height": 1080
    }
  }
}
```

### 3. Fast Cut with Zoom

```json
{
  "customComponent": {
    "name": "SceneTransition",
    "props": {
      "type": "zoom-in",
      "duration": 15,
      "color": "#ffffff"
    }
  }
}
```

### 4. Cinematic Circle Reveal

```json
{
  "customComponent": {
    "name": "SceneTransition",
    "props": {
      "type": "circle-in",
      "duration": 60,
      "color": "#000000"
    }
  }
}
```

### 5. Multi-Scene Video with Transitions

```json
{
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 12
  },
  "composition": {
    "scenes": [
      {
        "id": "scene1",
        "startFrame": 0,
        "endFrame": 90,
        "backgroundColor": "#1a1a2e",
        "layers": [
          { "type": "text", "props": { "text": "Introduction" } }
        ]
      },
      {
        "id": "scene2",
        "startFrame": 90,
        "endFrame": 180,
        "backgroundColor": "#2e1a1a",
        "layers": [
          {
            "type": "custom",
            "customComponent": {
              "name": "SceneTransition",
              "props": { "type": "wipe-left", "duration": 30 }
            }
          },
          { "type": "text", "props": { "text": "Main Content" } }
        ]
      },
      {
        "id": "scene3",
        "startFrame": 180,
        "endFrame": 270,
        "backgroundColor": "#1a2e1a",
        "layers": [
          {
            "type": "custom",
            "customComponent": {
              "name": "SceneTransition",
              "props": { "type": "zoom-in", "duration": 30 }
            }
          },
          { "type": "text", "props": { "text": "Conclusion" } }
        ]
      },
      {
        "id": "outro",
        "startFrame": 270,
        "endFrame": 360,
        "backgroundColor": "#000000",
        "layers": [
          {
            "type": "custom",
            "customComponent": {
              "name": "SceneTransition",
              "props": { "type": "fade", "duration": 30 }
            }
          },
          { "type": "text", "props": { "text": "Thank You" } }
        ]
      }
    ]
  }
}
```

## Design Guidelines

### Choosing Transition Types

**Fade** - Universal, subtle, professional
- Use for: Most scene changes, default choice
- Avoid: Repetitive use (mix with other transitions)

**Wipe** - Directional, dynamic, intentional
- Use for: Geographic changes, directional storytelling
- Avoid: Vertical video (prefer horizontal wipes)

**Slide** - Clean, modern, app-like
- Use for: UI-style videos, tutorials, step-by-step guides
- Avoid: Emotional or cinematic content

**Zoom** - Dramatic, attention-grabbing, energetic
- Use for: Reveals, focus changes, action sequences
- Avoid: Overuse (causes motion sickness)

**Circle** - Vintage, focus-driven, artistic
- Use for: Retro content, spotlight moments, artistic videos
- Avoid: Corporate or professional content

### Transition Duration

**Fast (15-20 frames at 30fps)**
- High energy content
- Quick cuts
- Music videos
- Social media shorts

**Standard (25-35 frames at 30fps)**
- Most content
- Balanced pacing
- Professional videos
- Tutorials

**Slow (40-60 frames at 30fps)**
- Emotional moments
- Dramatic reveals
- Cinematic content
- Artistic videos

### Color Selection

**Black (#000000)** - Default, classic, versatile
**White (#FFFFFF)** - Clean, modern, high-key
**Brand Color** - Reinforces identity, distinctive
**Scene-Matched** - Smooth, cohesive, subtle

## Best Practices

### 1. Position Transitions at Scene Start

Always place transition as the first layer:

```json
// ✅ Good - Transition is first layer
{
  "layers": [
    { "type": "custom", "customComponent": { "name": "SceneTransition" } },
    { "type": "text", "props": { "text": "Content" } }
  ]
}

// ❌ Bad - Transition after content
{
  "layers": [
    { "type": "text", "props": { "text": "Content" } },
    { "type": "custom", "customComponent": { "name": "SceneTransition" } }
  ]
}
```

### 2. Match Transition Duration to Content Pace

```json
// Fast-paced content
{ "type": "wipe-right", "duration": 15 }

// Standard content
{ "type": "fade", "duration": 30 }

// Slow, cinematic content
{ "type": "circle-in", "duration": 60 }
```

### 3. Vary Transition Types

Don't use the same transition for every scene:

```json
// ✅ Good - Varied transitions
[
  { "type": "fade" },
  { "type": "wipe-left" },
  { "type": "zoom-in" },
  { "type": "fade" }
]

// ❌ Boring - Same transition
[
  { "type": "fade" },
  { "type": "fade" },
  { "type": "fade" },
  { "type": "fade" }
]
```

### 4. Use Color Strategically

```json
// ✅ Good - Black for dark scenes
{ "backgroundColor": "#000000", "transition": { "color": "#000000" } }

// ✅ Good - White for light scenes
{ "backgroundColor": "#ffffff", "transition": { "color": "#ffffff" } }

// ⚠️ Jarring - Mismatch
{ "backgroundColor": "#000000", "transition": { "color": "#ffffff" } }
```

### 5. Account for Transition in Scene Duration

Ensure scenes are long enough for transitions:

```json
{
  "scenes": [
    {
      "startFrame": 0,
      "endFrame": 90,  // 3 seconds
      "layers": [
        { "type": "text", "props": { "text": "Scene 1" } }
      ]
    },
    {
      "startFrame": 90,
      "endFrame": 180,  // 3 seconds
      "layers": [
        {
          "type": "custom",
          "customComponent": {
            "name": "SceneTransition",
            "props": { "type": "fade", "duration": 30 }  // 1 second transition
          }
        },
        { "type": "text", "props": { "text": "Scene 2" } }
      ]
    }
  ]
}
```

Content is visible for: 90 frames (3s) - 30 frames (1s transition) = 60 frames (2s)

## Performance

### Hardware Acceleration

All transitions use CSS transforms and opacity, which are GPU-accelerated:

- **transform** - translateX, translateY, scale, rotate
- **opacity** - fade effects
- **clip-path** - circular and slide reveals

### Rendering Speed

Transition render times (1920x1080, 30fps):
- Fade: ~15ms per frame
- Wipe: ~18ms per frame
- Slide: ~20ms per frame
- Zoom: ~18ms per frame
- Circle: ~25ms per frame

## Browser Compatibility

| Transition | Chrome | Firefox | Safari | Edge |
|-----------|--------|---------|--------|------|
| fade | ✅ | ✅ | ✅ | ✅ |
| wipe-* | ✅ | ✅ | ✅ | ✅ |
| slide-* | ✅ | ✅ | ✅ | ✅ |
| zoom-* | ✅ | ✅ | ✅ | ✅ |
| circle-* | ✅ | ✅ | ✅ | ✅ |

### Headless Chrome
- ✅ Full transition support
- ✅ Hardware acceleration available
- ✅ Frame-perfect rendering

## Troubleshooting

### Transition Not Visible

**Problem:** Transition defined but not showing

**Solutions:**
1. Check duration > 0
2. Verify color is different from scene background
3. Ensure transition layer is first in layers array
4. Check width/height match output dimensions

### Transition Appears Choppy

**Problem:** Transition doesn't look smooth

**Solutions:**
1. Increase FPS: `output.fps = 60`
2. Reduce duration if too long
3. Check for conflicting animations on other layers
4. Verify hardware acceleration is enabled

### Transition Color Wrong

**Problem:** Transition shows wrong color

**Solutions:**
1. Check `color` prop spelling and format
2. Use hex format: `#000000` not `black`
3. Verify color has # prefix
4. Check for alpha channel (not supported)

## Examples

Complete transition examples:
- `examples/transitions/` - All 11 transition types demonstrated
- `examples/marketing/product-showcase/` - Multi-scene with transitions
- `packages/components/src/transitions/SceneTransition.tsx` - Source code

## API Reference

```typescript
// Import the component
import { SceneTransition } from '@rendervid/components';

// TypeScript definition
interface SceneTransitionProps extends AnimatedProps {
  type?: 'fade' | 'wipe-left' | 'wipe-right' | 'wipe-up' | 'wipe-down' |
         'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out' |
         'circle-in' | 'circle-out';
  duration?: number;
  color?: string;
  width?: number;
  height?: number;
}
```

See TypeScript definitions in `@rendervid/components` for complete API documentation.
