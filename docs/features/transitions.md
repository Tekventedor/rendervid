# Scene Transitions

Professional scene transition effects for smooth cuts between scenes in your videos. Rendervid includes **17 built-in transition types** ranging from simple fades to complex 3D effects.

## Features

- ✅ **17 Transition Types** - Complete collection from basic to advanced effects
- ✅ **Two Usage Methods** - Scene-level (recommended) or layer-level component
- ✅ **Customizable Duration** - Control transition speed in frames
- ✅ **Direction Support** - Directional transitions (left, right, up, down)
- ✅ **Hardware Accelerated** - Smooth 60fps transitions using CSS transforms
- ✅ **Duration Compression** - Transitions overlap scenes automatically
- ✅ **Zero Configuration** - Works out of the box with sensible defaults

## Transition Quick Reference

| Transition | Complexity | Directions | Best For |
|------------|------------|------------|----------|
| **cut** | Simple | - | Jump cuts, instant switches |
| **fade** | Simple | - | Universal, subtle changes |
| **slide** | Simple | 4 | UI navigation, swiping |
| **wipe** | Simple | 4 | Directional storytelling |
| **zoom** | Simple | - | Focus changes, reveals |
| **rotate** | Medium | - | Dynamic transitions |
| **flip** | Medium | H/V | Card flips, page turns |
| **blur** | Medium | - | Soft transitions, dreams |
| **circle** | Medium | - | Spotlight, focus |
| **push** | Medium | 4 | Slideshow effects |
| **crosszoom** | Medium | - | Dramatic reveals |
| **glitch** | Complex | - | Tech, cyberpunk |
| **dissolve** | Complex | - | Vintage, pixelated |
| **cube** | Complex | H/V | Premium, 3D galleries |
| **swirl** | Complex | - | Artistic, psychedelic |
| **diagonal-wipe** | Complex | 2 | Modern, dynamic |
| **iris** | Complex | - | Cinema, vintage |

## Two Ways to Use Transitions

### Method 1: Scene-Level Transitions (Recommended)

Define transitions directly in scene configuration for automatic timing and all 17 effects:

```json
{
  "scenes": [
    {
      "id": "intro",
      "startFrame": 0,
      "endFrame": 90,
      "layers": [
        { "type": "text", "props": { "text": "Scene 1" } }
      ],
      "transition": {
        "type": "fade",
        "duration": 30,
        "easing": "easeInOutCubic"
      }
    },
    {
      "id": "main",
      "startFrame": 90,
      "endFrame": 180,
      "layers": [
        { "type": "text", "props": { "text": "Scene 2" } }
      ]
    }
  ]
}
```

**Scene Transition Configuration:**

```typescript
interface SceneTransition {
  /** Transition type (17 available) */
  type: TransitionType;
  /** Duration in frames */
  duration: number;
  /** Direction (for directional transitions) */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Easing function */
  easing?: string;
}
```

**Available Types:**
```typescript
type TransitionType =
  | 'cut'           // Instant switch
  | 'fade'          // Crossfade
  | 'slide'         // Slide in direction
  | 'wipe'          // Wipe in direction
  | 'zoom'          // Zoom in/out
  | 'rotate'        // Rotate transition
  | 'flip'          // 3D flip effect
  | 'blur'          // Blur transition
  | 'circle'        // Circular reveal
  | 'push'          // Push transition
  | 'crosszoom'     // Cross zoom effect
  | 'glitch'        // Glitch effect
  | 'dissolve'      // Dissolve effect
  | 'cube'          // 3D cube rotation
  | 'swirl'         // Swirl/spiral effect
  | 'diagonal-wipe' // Diagonal wipe
  | 'iris';         // Iris in/out
```

**Advantages:**
- ✅ All 17 transitions available
- ✅ Automatic timing management
- ✅ Duration compression model (transitions overlap scenes)
- ✅ Cleaner template structure
- ✅ Better performance

**When to use:** Default choice for most videos

---

### Method 2: SceneTransition Component

Add transition as a custom layer (currently supports 11 basic transitions):

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
          "duration": 30,
          "color": "#000000"
        }
      }
    }]
  }]
}
```

**Available component types:**
- fade, wipe-left, wipe-right, wipe-up, wipe-down
- slide-left, slide-right
- zoom-in, zoom-out
- circle-in, circle-out

**Advantages:**
- ✅ More control over layer placement
- ✅ Can combine with other layers
- ✅ Manual timing control

**When to use:** Special effects, custom overlays, fine-grained control

---

## Duration Compression Model

Scene-level transitions use a **duration compression model** where transitions overlap both scenes:

```
Scene 1: [====================]
                         [transition: 30 frames]
Scene 2:                 [====================]
         frame 0         60        90          150
```

The transition starts `duration` frames before Scene 1 ends. Both scenes are visible during the transition period, with the outgoing scene fading out and the incoming scene fading in.

**Benefits:**
- Smoother visual flow
- No black frames between scenes
- Natural timing feels better to viewers

---

## Transition Types

### 1. Cut Transition

**Type:** `cut`
**Complexity:** Simple
**Directions:** None

Instant switch between scenes with no animation.

```json
{
  "transition": {
    "type": "cut",
    "duration": 0
  }
}
```

**Use cases:** Jump cuts, news-style edits, fast-paced content

---

### 2. Fade Transition

**Type:** `fade`
**Complexity:** Simple
**Directions:** None

Classic crossfade - gradually transitions opacity between scenes.

```json
{
  "transition": {
    "type": "fade",
    "duration": 30
  }
}
```

**Use cases:** Subtle scene changes, time lapses, mood shifts, universal default

---

### 3. Slide Transitions

**Type:** `slide`
**Complexity:** Simple
**Directions:** `left`, `right`, `up`, `down`

Slides scenes in the specified direction with both scenes moving together.

```json
{
  "transition": {
    "type": "slide",
    "duration": 30,
    "direction": "left"
  }
}
```

**Use cases:** UI-style navigation, swiping effect, horizontal galleries

---

### 4. Wipe Transitions

**Type:** `wipe`
**Complexity:** Simple
**Directions:** `left`, `right`, `up`, `down`

Wipes from one scene to another in the specified direction using clip-path.

```json
{
  "transition": {
    "type": "wipe",
    "duration": 30,
    "direction": "right"
  }
}
```

**Use cases:** Geographic transitions, directional storytelling, revealing content

---

### 5. Zoom Transition

**Type:** `zoom`
**Complexity:** Simple
**Directions:** None

Zooms out from old scene while zooming in to new scene.

```json
{
  "transition": {
    "type": "zoom",
    "duration": 30
  }
}
```

**Use cases:** Focus attention, entering/exiting spaces, dramatic reveals

---

### 6. Rotate Transition

**Type:** `rotate`
**Complexity:** Medium
**Directions:** None

Rotates out with scale effect - creates spinning transition.

```json
{
  "transition": {
    "type": "rotate",
    "duration": 30
  }
}
```

**Use cases:** Dynamic scene changes, attention-grabbing transitions, energetic videos

---

### 7. Flip Transition

**Type:** `flip`
**Complexity:** Medium
**Directions:** `left`, `right` (horizontal), `up`, `down` (vertical)

3D flip effect - flips scenes like turning a card or page.

```json
{
  "transition": {
    "type": "flip",
    "duration": 35,
    "direction": "left"
  }
}
```

**Use cases:** Card flips, page turns, revealing hidden content, before/after comparisons

---

### 8. Blur Transition

**Type:** `blur`
**Complexity:** Medium
**Directions:** None

Blurs out old scene while blurring in new scene with opacity fade.

```json
{
  "transition": {
    "type": "blur",
    "duration": 30
  }
}
```

**Use cases:** Dream sequences, flashbacks, soft transitions, emotional moments

---

### 9. Circle Transition

**Type:** `circle`
**Complexity:** Medium
**Directions:** None

Circular reveal/contract effect using clip-path.

```json
{
  "transition": {
    "type": "circle",
    "duration": 35
  }
}
```

**Use cases:** Spotlight effect, focus moments, vintage cinema style, iris effect

---

### 10. Push Transition

**Type:** `push`
**Complexity:** Medium
**Directions:** `left`, `right`, `up`, `down`

Both scenes move together - old scene pushes out, new scene pushes in.

```json
{
  "transition": {
    "type": "push",
    "duration": 30,
    "direction": "left"
  }
}
```

**Use cases:** Slideshow effects, photo galleries, UI navigation

---

### 11. Crosszoom Transition

**Type:** `crosszoom`
**Complexity:** Medium
**Directions:** None

Old scene zooms out while new scene zooms in with opacity crossfade.

```json
{
  "transition": {
    "type": "crosszoom",
    "duration": 30
  }
}
```

**Use cases:** Dramatic reveals, focus changes, attention-grabbing transitions

---

### 12. Glitch Transition

**Type:** `glitch`
**Complexity:** Complex
**Directions:** None

Digital glitch distortion effect with random displacement and color shifts.

```json
{
  "transition": {
    "type": "glitch",
    "duration": 20
  }
}
```

**Use cases:** Tech videos, cyberpunk aesthetics, error states, digital disruption, gaming

---

### 13. Dissolve Transition

**Type:** `dissolve`
**Complexity:** Complex
**Directions:** None

Pixelated dissolve effect with progressive blur.

```json
{
  "transition": {
    "type": "dissolve",
    "duration": 30
  }
}
```

**Use cases:** Vintage effects, soft transitions, artistic videos, retro style

---

### 14. Cube Transition

**Type:** `cube`
**Complexity:** Complex
**Directions:** `left`, `right` (horizontal), `up`, `down` (vertical)

3D cube rotation effect - scenes appear on faces of a rotating cube.

```json
{
  "transition": {
    "type": "cube",
    "duration": 40,
    "direction": "left"
  }
}
```

**Use cases:** Premium presentations, 3D effects, photo galleries, high-end videos

---

### 15. Swirl Transition

**Type:** `swirl`
**Complexity:** Complex
**Directions:** None

Swirl/spiral rotation effect with blur and scale.

```json
{
  "transition": {
    "type": "swirl",
    "duration": 35
  }
}
```

**Use cases:** Artistic videos, psychedelic effects, creative content, music videos

---

### 16. Diagonal Wipe Transition

**Type:** `diagonal-wipe`
**Complexity:** Complex
**Directions:** `left` (top-left to bottom-right), `right` (top-right to bottom-left)

Diagonal wipe from corner to corner.

```json
{
  "transition": {
    "type": "diagonal-wipe",
    "duration": 30,
    "direction": "left"
  }
}
```

**Use cases:** Dynamic wipes, modern presentations, geometric transitions

---

### 17. Iris Transition

**Type:** `iris`
**Complexity:** Complex
**Directions:** None

Iris in/out circle effect - shrinking/expanding circular reveal (similar to circle but optimized for old cinema style).

```json
{
  "transition": {
    "type": "iris",
    "duration": 35
  }
}
```

**Use cases:** Vintage cinema, focus effects, classic film style, spotlight moments

---

## Design Guidelines

### Choosing Transition Types

**Simple Transitions (cut, fade, slide, wipe, zoom)**
- Use for: Most professional content, tutorials, corporate videos
- Duration: 20-30 frames standard
- Safe choice: Works everywhere

**Medium Transitions (rotate, flip, blur, circle, push, crosszoom)**
- Use for: Engaging content, social media, presentations
- Duration: 25-35 frames
- Adds personality without overwhelming

**Complex Transitions (glitch, dissolve, cube, swirl, diagonal-wipe, iris)**
- Use for: Creative content, artistic videos, special moments
- Duration: 30-45 frames
- Use sparingly - high impact

### Transition Duration

**Fast (10-20 frames at 30fps)**
- High energy content
- Quick cuts
- Music videos
- Social media shorts
- TikTok, Instagram Reels

**Standard (25-35 frames at 30fps)**
- Most content
- Balanced pacing
- Professional videos
- Tutorials
- YouTube content

**Slow (40-60 frames at 30fps)**
- Emotional moments
- Dramatic reveals
- Cinematic content
- Artistic videos
- Film-style productions

### Directional Transitions

For transitions with direction support (`slide`, `wipe`, `push`, `flip`, `cube`, `diagonal-wipe`):

**Horizontal (left/right)**
- Natural reading direction (left to right)
- Works well for timeline progressions
- Good for before/after comparisons

**Vertical (up/down)**
- Scrolling effect
- Mobile-friendly (vertical video)
- Good for lists, rankings, hierarchies

**Choosing direction:**
- **Left** - Moving forward in time/story
- **Right** - Moving backward, flashbacks
- **Up** - Elevating, improving, ascending
- **Down** - Descending, diving deeper

---

## Usage Examples

### Example 1: Multi-Scene Video with Varied Transitions

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
        "id": "intro",
        "startFrame": 0,
        "endFrame": 90,
        "backgroundColor": "#1a1a2e",
        "layers": [
          { "type": "text", "props": { "text": "Introduction" } }
        ],
        "transition": {
          "type": "fade",
          "duration": 30
        }
      },
      {
        "id": "main",
        "startFrame": 90,
        "endFrame": 180,
        "backgroundColor": "#2e1a1a",
        "layers": [
          { "type": "text", "props": { "text": "Main Content" } }
        ],
        "transition": {
          "type": "slide",
          "duration": 30,
          "direction": "left"
        }
      },
      {
        "id": "feature",
        "startFrame": 180,
        "endFrame": 270,
        "backgroundColor": "#1a2e1a",
        "layers": [
          { "type": "text", "props": { "text": "Key Feature" } }
        ],
        "transition": {
          "type": "cube",
          "duration": 40,
          "direction": "left"
        }
      },
      {
        "id": "outro",
        "startFrame": 270,
        "endFrame": 360,
        "backgroundColor": "#000000",
        "layers": [
          { "type": "text", "props": { "text": "Thank You" } }
        ]
      }
    ]
  }
}
```

### Example 2: Tech Video with Glitch Transitions

```json
{
  "scenes": [
    {
      "id": "section1",
      "startFrame": 0,
      "endFrame": 120,
      "transition": {
        "type": "glitch",
        "duration": 20
      }
    },
    {
      "id": "section2",
      "startFrame": 120,
      "endFrame": 240,
      "transition": {
        "type": "glitch",
        "duration": 20
      }
    }
  ]
}
```

### Example 3: Cinematic Video with Slow Transitions

```json
{
  "scenes": [
    {
      "id": "opening",
      "startFrame": 0,
      "endFrame": 150,
      "transition": {
        "type": "iris",
        "duration": 60,
        "easing": "easeInOutQuad"
      }
    },
    {
      "id": "climax",
      "startFrame": 150,
      "endFrame": 300,
      "transition": {
        "type": "blur",
        "duration": 45
      }
    }
  ]
}
```

---

## Best Practices

### 1. Vary Transition Types

Don't use the same transition for every scene:

```json
// ✅ Good - Varied transitions
{
  "scenes": [
    { "transition": { "type": "fade" } },
    { "transition": { "type": "slide", "direction": "left" } },
    { "transition": { "type": "zoom" } },
    { "transition": { "type": "fade" } }
  ]
}

// ❌ Boring - Same transition repeatedly
{
  "scenes": [
    { "transition": { "type": "fade" } },
    { "transition": { "type": "fade" } },
    { "transition": { "type": "fade" } },
    { "transition": { "type": "fade" } }
  ]
}
```

### 2. Match Transitions to Content Pace

```json
// Fast-paced social media
{ "type": "wipe", "duration": 15, "direction": "left" }

// Standard corporate video
{ "type": "fade", "duration": 30 }

// Slow cinematic film
{ "type": "iris", "duration": 60 }
```

### 3. Use Complex Transitions Sparingly

Reserve complex transitions (glitch, cube, swirl) for special moments:

```json
{
  "scenes": [
    { "transition": { "type": "fade" } },        // Normal
    { "transition": { "type": "slide" } },       // Normal
    { "transition": { "type": "cube" } },        // 🌟 Special moment!
    { "transition": { "type": "fade" } },        // Back to normal
  ]
}
```

### 4. Consider Scene Duration

Ensure scenes are long enough for transitions:

- **Minimum scene duration:** 60 frames (2 seconds at 30fps)
- **With 30-frame transition:** Need at least 90 frames (3 seconds)
- **Safe practice:** Scene duration should be at least 2x transition duration

```json
{
  "scenes": [
    {
      "startFrame": 0,
      "endFrame": 90,      // 3 seconds
      "transition": {
        "type": "fade",
        "duration": 30      // 1 second - OK!
      }
    },
    {
      "startFrame": 90,
      "endFrame": 120,     // Only 1 second scene
      "transition": {
        "type": "cube",
        "duration": 40      // ⚠️ Transition longer than scene!
      }
    }
  ]
}
```

### 5. Match Direction to Content Flow

```json
// Timeline moving forward
{ "type": "slide", "direction": "left" }

// Going back to previous topic
{ "type": "slide", "direction": "right" }

// Revealing something above
{ "type": "wipe", "direction": "up" }

// Descending into detail
{ "type": "push", "direction": "down" }
```

---

## Performance

### Hardware Acceleration

All 17 transitions use GPU-accelerated CSS properties:

- **transform** - translateX, translateY, scale, rotate, rotateX, rotateY, perspective
- **opacity** - fade effects
- **clip-path** - circular, wipe, and geometric reveals
- **filter** - blur, hue-rotate effects

### Rendering Speed

Average render times (1920x1080, 30fps):

| Transition | Render Time | Performance |
|------------|-------------|-------------|
| cut, fade | ~15ms/frame | Excellent |
| slide, wipe, zoom | ~18ms/frame | Excellent |
| rotate, push | ~20ms/frame | Very Good |
| flip, cube | ~25ms/frame | Very Good |
| circle, iris, diagonal-wipe | ~25ms/frame | Very Good |
| blur, crosszoom, dissolve, swirl | ~28ms/frame | Good |
| glitch | ~30ms/frame | Good |

All transitions render at stable 60fps on modern hardware.

---

## Browser Compatibility

| Transition | Chrome | Firefox | Safari | Edge | Headless |
|------------|--------|---------|--------|------|----------|
| All 17 types | ✅ | ✅ | ✅ | ✅ | ✅ |

**Headless Chrome (for rendering):**
- ✅ Full support for all 17 transitions
- ✅ Hardware acceleration available
- ✅ Frame-perfect rendering
- ✅ No visual differences from headed mode

---

## Troubleshooting

### Transition Not Visible

**Problem:** Transition defined but not showing

**Solutions:**
1. Verify `duration > 0`
2. Check transition is defined on first scene (not the last)
3. Ensure scenes don't overlap
4. Verify scene has enough frames for transition

### Transition Appears Choppy

**Problem:** Transition doesn't look smooth

**Solutions:**
1. Increase FPS: `"fps": 60`
2. Reduce transition duration if too long
3. Check for conflicting layer animations
4. Verify hardware acceleration is enabled
5. Use simpler transitions for better performance

### Wrong Transition Direction

**Problem:** Transition goes opposite direction

**Solutions:**
1. Check `direction` parameter: `"left"` slides from right to left
2. Remember: direction indicates where content moves TO, not FROM
3. Test both directions to find desired effect

### Scene Too Short for Transition

**Problem:** Transition cuts off abruptly

**Solutions:**
1. Increase scene duration: `endFrame - startFrame ≥ duration * 2`
2. Reduce transition duration
3. Remove transition from very short scenes

---

## Examples

Complete transition examples:
- `examples/showcase/all-transitions/` - All 17 transition types demonstrated
- `examples/marketing/product-showcase/` - Multi-scene with professional transitions
- `packages/renderer-browser/src/renderer/SceneRenderer.tsx` - Source code implementation

---

## API Reference

### Scene-Level Transition API

```typescript
interface Scene {
  id: string;
  startFrame: number;
  endFrame: number;
  layers: Layer[];
  transition?: SceneTransition;
}

interface SceneTransition {
  /** Transition type (17 available) */
  type: TransitionType;
  /** Duration in frames */
  duration: number;
  /** Direction (for directional transitions) */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Easing function */
  easing?: string;
}

type TransitionType =
  | 'cut' | 'fade' | 'slide' | 'wipe' | 'zoom'
  | 'rotate' | 'flip' | 'blur' | 'circle' | 'push'
  | 'crosszoom' | 'glitch' | 'dissolve' | 'cube'
  | 'swirl' | 'diagonal-wipe' | 'iris';
```

### Component-Level Transition API

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

See TypeScript definitions in `@rendervid/core` and `@rendervid/components` for complete API documentation.

---

**Next:** See [examples/showcase/all-transitions/](../../examples/showcase/all-transitions/) for a working demo of all 17 transition types.
