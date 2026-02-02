# All Scene Transitions Showcase

Demonstrates all available **scene-level transitions** in Rendervid with proper implementation.

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

## Transition Types Demonstrated

### 1. CUT (Instant Switch)
- **Duration:** 0 frames
- **Effect:** Instant cut with no transition
- **Use Case:** Jump cuts, dramatic scene changes

### 2. FADE (Crossfade)
- **Duration:** 30 frames (1 second @ 30fps)
- **Effect:** Outgoing scene fades out while incoming scene fades in
- **Use Case:** Smooth, elegant transitions; time passage

### 3. SLIDE LEFT
- **Duration:** 30 frames
- **Direction:** left (scene slides in from right →)
- **Effect:** Entire scene slides horizontally
- **Use Case:** Geographic movement, progression

### 4. SLIDE UP
- **Duration:** 30 frames
- **Direction:** up (scene slides in from bottom ↑)
- **Effect:** Entire scene slides vertically
- **Use Case:** Revealing content, upward progression

### 5. ZOOM
- **Duration:** 30 frames
- **Effect:** Outgoing scene zooms out while incoming scene zooms in
- **Use Case:** Focus changes, dramatic emphasis

## Template Configuration

```json
{
  "scenes": [
    {
      "id": "intro",
      "startFrame": 0,
      "endFrame": 90,
      "transition": {
        "type": "cut",
        "duration": 0
      },
      "layers": [...]
    },
    {
      "id": "fade-scene",
      "startFrame": 90,
      "endFrame": 180,
      "transition": {
        "type": "fade",
        "duration": 30
      },
      "layers": [...]
    },
    {
      "id": "slide-scene",
      "startFrame": 180,
      "endFrame": 270,
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

- **`type`** (required): `"cut"` | `"fade"` | `"slide"` | `"wipe"` | `"zoom"`
- **`duration`** (required): Number of frames for the transition
- **`direction`** (optional): `"left"` | `"right"` | `"up"` | `"down"` (for slide/wipe transitions)
- **`easing`** (optional): Easing function name (future feature)

## How Transitions Work

1. The transition starts at **`scene.endFrame - transition.duration`**
2. During the transition period, **both scenes are rendered simultaneously**
3. Visual effects are applied based on the transition type
4. After the transition completes, only the new scene is visible

## Video Details

- **Duration:** 18 seconds (540 frames @ 30fps)
- **Resolution:** 1920x1080 (Full HD)
- **Scenes:** 6 scenes
- **Transitions:** CUT → FADE → SLIDE LEFT → SLIDE UP → ZOOM

## Available Transition Types

| Transition | Description | Directions |
|------------|-------------|------------|
| **cut** | Instant scene change (no animation) | N/A |
| **fade** | Smooth crossfade opacity transition | N/A |
| **slide** | Scenes slide in specified direction | left, right, up, down |
| **zoom** | Scale in/out with opacity | N/A |
| **wipe** | Directional wipe effect | left, right, up, down |

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

## Use Cases

- **Cut**: Quick scene changes, music videos, action sequences
- **Fade**: Documentary transitions, storytelling, mood changes
- **Slide**: Location changes, before/after comparisons, tutorials
- **Zoom**: Focus transitions, dramatic reveals
- **Wipe**: Retro films, news segments, classic presentations

---

**Watermark:** "RenderVid by FlowHunt.io" appears in all scenes
