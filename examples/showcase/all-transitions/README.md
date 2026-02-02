# Complete Scene Transitions Showcase

Comprehensive demonstration of **all 29 scene transition types** available in Rendervid.

## Preview

![Preview](preview.gif)

## What Are Scene Transitions?

Scene transitions are **not the same** as layer animations. They define how one scene transitions to the next scene at the **scene level**, creating professional transitions between different parts of your video.

Each scene can define a `transition` property that specifies how it will transition to the **next** scene.

## Usage

```bash
pnpm run examples:render showcase/all-transitions

# Or use the generate-videos script
node scripts/generate-videos.js showcase/all-transitions
```

## All 29 Transition Types

### Basic Transitions

#### 1. CUT
- **Duration:** 0 frames
- **Effect:** Instant switch with no transition
- **Use Case:** Jump cuts, dramatic scene changes

#### 2. FADE
- **Duration:** 30 frames (1 second @ 30fps)
- **Effect:** Crossfade opacity transition
- **Use Case:** Smooth transitions, time passage, mood changes

#### 3. ZOOM
- **Duration:** 30 frames
- **Effect:** Scale in/out with opacity
- **Use Case:** Focus changes, dramatic emphasis

### Directional Transitions

#### 4-7. SLIDE (left, right, up, down)
- **Duration:** 30 frames
- **Directions:** left, right, up, down
- **Effect:** Scene slides in from specified direction
- **Use Case:** Geographic movement, before/after comparisons

#### 8-11. WIPE (left, right, up, down)
- **Duration:** 30 frames
- **Directions:** left, right, up, down
- **Effect:** Directional wipe reveal
- **Use Case:** Retro films, news segments, classic presentations

#### 12-15. PUSH (left, right, up, down)
- **Duration:** 30 frames
- **Directions:** left, right, up, down
- **Effect:** Push one scene off screen while new scene follows
- **Use Case:** Continuous flow, slideshow transitions

### 3D & Rotation Transitions

#### 16. ROTATE
- **Duration:** 30 frames
- **Effect:** Rotate out/in with scale animation
- **Use Case:** Dynamic transitions, creative videos

#### 17-18. FLIP (horizontal, vertical)
- **Duration:** 30 frames
- **Directions:** left/right (horizontal), up/down (vertical)
- **Effect:** 3D card flip effect with perspective
- **Use Case:** Revealing information, card-based interfaces

#### 19-20. CUBE (horizontal, vertical)
- **Duration:** 30 frames
- **Directions:** left/right (horizontal), up/down (vertical)
- **Effect:** 3D cube rotation transition
- **Use Case:** Premium presentations, creative showcases

### Visual Effect Transitions

#### 21. BLUR
- **Duration:** 30 frames
- **Effect:** Blur out old scene, blur in new scene
- **Use Case:** Soft transitions, dream sequences

#### 22. CIRCLE
- **Duration:** 30 frames
- **Effect:** Circular reveal (contract/expand)
- **Use Case:** Focus transitions, spotlight effects

#### 23. IRIS
- **Duration:** 30 frames
- **Effect:** Classic iris in/out circle effect
- **Use Case:** Old film style, focused reveals

#### 24-25. DIAGONAL WIPE (left, right)
- **Duration:** 30 frames
- **Directions:** left (↙), right (↘)
- **Effect:** Diagonal wipe from corner to corner
- **Use Case:** Dynamic presentations, creative transitions

#### 26. CROSSZOOM
- **Duration:** 30 frames
- **Effect:** Zoom out old scene while zooming in new scene
- **Use Case:** Music videos, creative storytelling

#### 27. SWIRL
- **Duration:** 30 frames
- **Effect:** Swirl/spiral rotation with blur
- **Use Case:** Psychedelic effects, time transitions

### Special Effect Transitions

#### 28. GLITCH
- **Duration:** 30 frames
- **Effect:** Digital glitch distortion with color shift
- **Use Case:** Tech videos, error states, cyberpunk aesthetics

#### 29. DISSOLVE
- **Duration:** 30 frames
- **Effect:** Pixelated dissolve effect
- **Use Case:** Digital transitions, VHS effects

## Template Configuration

```json
{
  "scenes": [
    {
      "id": "scene-1",
      "startFrame": 0,
      "endFrame": 90,
      "transition": {
        "type": "fade",
        "duration": 30
      },
      "layers": [...]
    },
    {
      "id": "scene-2",
      "startFrame": 90,
      "endFrame": 180,
      "transition": {
        "type": "slide",
        "duration": 30,
        "direction": "left"
      },
      "layers": [...]
    }
  ]
}
```

## Transition Properties

- **`type`** (required): Transition type (see list above)
- **`duration`** (required): Number of frames for the transition
- **`direction`** (optional): Direction for directional transitions
  - slide: `"left"` | `"right"` | `"up"` | `"down"`
  - wipe: `"left"` | `"right"` | `"up"` | `"down"`
  - push: `"left"` | `"right"` | `"up"` | `"down"`
  - flip: `"left"` | `"right"` (horizontal) | `"up"` | `"down"` (vertical)
  - cube: `"left"` | `"right"` (horizontal) | `"up"` | `"down"` (vertical)
  - diagonal-wipe: `"left"` | `"right"`
- **`easing`** (optional): Easing function name (future feature)

## How Transitions Work

1. The transition starts at **`scene.endFrame - transition.duration`**
2. During the transition period, **both scenes are rendered simultaneously**
3. Visual effects are applied based on the transition type
4. After the transition completes, only the new scene is visible

## Video Details

- **Duration:** 60 seconds (1800 frames @ 30fps)
- **Resolution:** 1920x1080 (Full HD)
- **Scenes:** 29 scenes (1 intro + 28 transitions)
- **Transitions:** All 29 types demonstrated

## Complete Transition List

| # | Transition | Description | Directional |
|---|------------|-------------|-------------|
| 1 | **cut** | Instant scene change | No |
| 2 | **fade** | Crossfade opacity | No |
| 3 | **zoom** | Scale in/out | No |
| 4 | **slide** | Slide from direction | ✓ (4 directions) |
| 5 | **wipe** | Directional wipe | ✓ (4 directions) |
| 6 | **push** | Push scene off | ✓ (4 directions) |
| 7 | **rotate** | Rotate with scale | No |
| 8 | **flip** | 3D flip effect | ✓ (H/V) |
| 9 | **cube** | 3D cube rotation | ✓ (H/V) |
| 10 | **blur** | Blur transition | No |
| 11 | **circle** | Circular reveal | No |
| 12 | **iris** | Iris in/out | No |
| 13 | **diagonal-wipe** | Diagonal corner wipe | ✓ (2 directions) |
| 14 | **crosszoom** | Cross zoom effect | No |
| 15 | **swirl** | Swirl/spiral effect | No |
| 16 | **glitch** | Digital glitch | No |
| 17 | **dissolve** | Pixelated dissolve | No |

**Total:** 17 base types = 29 total variations (including directional options)

## Key Differences

**❌ NOT Scene Transitions:**
- Layer entrance/exit animations (fadeIn, slideInLeft, etc.)
- Individual layer movements within a scene
- Text/component animations

**✅ Scene Transitions:**
- Entire scene-to-scene visual effects
- Smooth handoff between different content sections
- Professional video editing transitions
- Defined in each scene's `transition` property

## Use Cases by Category

### Professional/Corporate
- **cut, fade, slide, wipe** - Clean, professional transitions
- **push** - Slideshow presentations
- **blur** - Soft, elegant transitions

### Creative/Artistic
- **rotate, flip, cube** - Dynamic 3D effects
- **swirl, crosszoom** - Creative storytelling
- **diagonal-wipe** - Unique visual style

### Technical/Digital
- **glitch** - Tech videos, cyberpunk
- **dissolve** - Digital/VHS effects
- **circle, iris** - Focused reveals

### Classic/Retro
- **wipe** - Classic film style
- **iris** - Old movie aesthetic
- **diagonal-wipe** - Retro presentations

---

**Watermark:** "RenderVid by FlowHunt.io" appears in all scenes
