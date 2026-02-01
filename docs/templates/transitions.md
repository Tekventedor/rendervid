# Scene Transitions

Transitions create smooth visual changes between scenes.

## Transition Structure

```typescript
interface SceneTransition {
  type: 'cut' | 'fade' | 'slide' | 'wipe' | 'zoom';
  duration: number;                // Duration in frames
  direction?: 'left' | 'right' | 'up' | 'down';  // For directional transitions
  easing?: string;                 // Easing function
}
```

## Transition Types

### Cut

Instant switch between scenes (no transition effect).

```json
{
  "transition": {
    "type": "cut",
    "duration": 0
  }
}
```

### Fade

Crossfade between scenes.

```json
{
  "transition": {
    "type": "fade",
    "duration": 30,
    "easing": "linear"
  }
}
```

### Slide

New scene slides in while old scene slides out.

```json
// Slide from right to left
{
  "transition": {
    "type": "slide",
    "direction": "left",
    "duration": 30,
    "easing": "easeInOutCubic"
  }
}

// Slide from bottom to top
{
  "transition": {
    "type": "slide",
    "direction": "up",
    "duration": 30
  }
}
```

### Wipe

New scene wipes over old scene.

```json
// Wipe from left
{
  "transition": {
    "type": "wipe",
    "direction": "right",
    "duration": 25
  }
}

// Wipe from top
{
  "transition": {
    "type": "wipe",
    "direction": "down",
    "duration": 25
  }
}
```

### Zoom

Zoom transition effect.

```json
{
  "transition": {
    "type": "zoom",
    "duration": 30,
    "easing": "easeInOutQuad"
  }
}
```

## Direction Options

| Direction | Description |
|-----------|-------------|
| `left` | New content enters from right, exits left |
| `right` | New content enters from left, exits right |
| `up` | New content enters from bottom, exits top |
| `down` | New content enters from top, exits bottom |

## Complete Example

```json
{
  "composition": {
    "scenes": [
      {
        "id": "intro",
        "startFrame": 0,
        "endFrame": 90,
        "backgroundColor": "#3B82F6",
        "layers": [
          {
            "id": "title",
            "type": "text",
            "position": { "x": 160, "y": 440 },
            "size": { "width": 1600, "height": 200 },
            "props": {
              "text": "Welcome",
              "fontSize": 120,
              "fontWeight": "bold",
              "color": "#FFFFFF",
              "textAlign": "center"
            }
          }
        ]
      },
      {
        "id": "content",
        "startFrame": 90,
        "endFrame": 210,
        "backgroundColor": "#8B5CF6",
        "transition": {
          "type": "fade",
          "duration": 30
        },
        "layers": [
          {
            "id": "content-title",
            "type": "text",
            "position": { "x": 160, "y": 440 },
            "size": { "width": 1600, "height": 200 },
            "props": {
              "text": "Main Content",
              "fontSize": 96,
              "fontWeight": "bold",
              "color": "#FFFFFF",
              "textAlign": "center"
            }
          }
        ]
      },
      {
        "id": "outro",
        "startFrame": 210,
        "endFrame": 300,
        "backgroundColor": "#EC4899",
        "transition": {
          "type": "slide",
          "direction": "left",
          "duration": 30,
          "easing": "easeInOutCubic"
        },
        "layers": [
          {
            "id": "outro-title",
            "type": "text",
            "position": { "x": 160, "y": 440 },
            "size": { "width": 1600, "height": 200 },
            "props": {
              "text": "Thanks!",
              "fontSize": 120,
              "fontWeight": "bold",
              "color": "#FFFFFF",
              "textAlign": "center"
            }
          }
        ]
      }
    ]
  }
}
```

## Timing Considerations

Transitions occur at the boundary between scenes:

```
Scene 1: frames 0-90    Scene 2: frames 90-180
         |___________|            |___________|
                     |<-- 30 frame fade -->|
                          overlap
```

The transition duration is taken from the beginning of the next scene. If Scene 2 has a 30-frame fade transition:
- Scene 1 renders frames 0-90
- Transition crossfades during frames 90-120
- Scene 2 renders frames 90-180

## Best Practices

1. **Keep transitions short** - 15-30 frames (0.5-1 second) is usually sufficient
2. **Match transition to content** - Use fade for calm content, slide for dynamic
3. **Be consistent** - Use the same transition style throughout a video
4. **Consider context** - Cuts work well for quick edits, fades for emotional moments
5. **Use easing** - Add easing for smoother, more natural transitions

## Easing for Transitions

Common easing choices:

| Transition | Recommended Easing |
|------------|-------------------|
| Fade | `linear` or `easeInOutSine` |
| Slide | `easeInOutCubic` or `easeOutQuart` |
| Wipe | `easeInOutQuad` |
| Zoom | `easeInOutQuad` or `easeOutExpo` |

## Related Documentation

- [Template Schema](/templates/schema) - Complete template reference
- [Animations](/templates/animations) - Layer animations
- [Scenes](/getting-started/concepts#scenes) - Scene concepts
