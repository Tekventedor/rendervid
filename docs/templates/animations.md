# Animations

Rendervid provides a powerful animation system with presets and custom keyframes.

## Animation Structure

```typescript
interface Animation {
  type: 'entrance' | 'exit' | 'emphasis' | 'keyframe';
  effect?: string;           // Preset name (for entrance/exit/emphasis)
  duration: number;          // Duration in frames
  delay?: number;            // Delay before start (frames)
  easing?: string;           // Easing function
  keyframes?: Keyframe[];    // For keyframe type
  loop?: number;             // Loop count (-1 = infinite)
  alternate?: boolean;       // Alternate direction on loop
}
```

## Entrance Animations

Play when a layer first appears.

| Effect | Description |
|--------|-------------|
| `fadeIn` | Fade from transparent |
| `fadeInUp` | Fade in while moving up |
| `fadeInDown` | Fade in while moving down |
| `fadeInLeft` | Fade in while moving from left |
| `fadeInRight` | Fade in while moving from right |
| `slideInUp` | Slide in from bottom |
| `slideInDown` | Slide in from top |
| `slideInLeft` | Slide in from left |
| `slideInRight` | Slide in from right |
| `scaleIn` | Scale up from 0 |
| `scaleInUp` | Scale up while moving up |
| `scaleInDown` | Scale up while moving down |
| `zoomIn` | Zoom in from small |
| `rotateIn` | Rotate while fading in |
| `rotateInClockwise` | Rotate clockwise |
| `rotateInCounterClockwise` | Rotate counter-clockwise |
| `bounceIn` | Bounce in effect |
| `bounceInUp` | Bounce in from below |
| `bounceInDown` | Bounce in from above |
| `flipInX` | Flip in horizontally |
| `flipInY` | Flip in vertically |
| `typewriter` | Character-by-character reveal |
| `revealLeft` | Reveal from left |
| `revealRight` | Reveal from right |
| `revealUp` | Reveal from bottom |
| `revealDown` | Reveal from top |

### Example

```json
{
  "animations": [
    {
      "type": "entrance",
      "effect": "fadeInUp",
      "duration": 30,
      "delay": 0,
      "easing": "easeOutCubic"
    }
  ]
}
```

## Exit Animations

Play when a layer is about to disappear.

| Effect | Description |
|--------|-------------|
| `fadeOut` | Fade to transparent |
| `fadeOutUp` | Fade out while moving up |
| `fadeOutDown` | Fade out while moving down |
| `fadeOutLeft` | Fade out while moving left |
| `fadeOutRight` | Fade out while moving right |
| `slideOutUp` | Slide out to top |
| `slideOutDown` | Slide out to bottom |
| `slideOutLeft` | Slide out to left |
| `slideOutRight` | Slide out to right |
| `scaleOut` | Scale down to 0 |
| `zoomOut` | Zoom out to small |
| `rotateOut` | Rotate while fading out |
| `bounceOut` | Bounce out effect |
| `flipOutX` | Flip out horizontally |
| `flipOutY` | Flip out vertically |

### Example

```json
{
  "animations": [
    {
      "type": "entrance",
      "effect": "fadeIn",
      "duration": 20
    },
    {
      "type": "exit",
      "effect": "fadeOutDown",
      "duration": 20
    }
  ]
}
```

## Emphasis Animations

Looping attention-grabbing effects.

| Effect | Description |
|--------|-------------|
| `pulse` | Scale up and down |
| `shake` | Horizontal shake |
| `bounce` | Vertical bounce |
| `swing` | Pendulum swing |
| `wobble` | Wobbly rotation |
| `flash` | Flashing opacity |
| `rubberBand` | Elastic stretch |
| `heartbeat` | Double pulse like heartbeat |
| `float` | Gentle floating motion |
| `spin` | Continuous rotation |

### Example

```json
{
  "animations": [
    {
      "type": "entrance",
      "effect": "scaleIn",
      "duration": 30
    },
    {
      "type": "emphasis",
      "effect": "pulse",
      "delay": 30,
      "duration": 45,
      "loop": -1
    }
  ]
}
```

## Keyframe Animations

Create custom animations with full control.

```typescript
interface Keyframe {
  frame: number;                // Frame number (relative to animation start)
  properties: AnimatableProperties;
  easing?: string;              // Easing to next keyframe
}

interface AnimatableProperties {
  x?: number;                   // X position offset
  y?: number;                   // Y position offset
  scaleX?: number;              // X scale
  scaleY?: number;              // Y scale
  rotation?: number;            // Rotation in degrees
  opacity?: number;             // Opacity (0-1)
  [key: string]: number;        // Additional numeric properties
}
```

### Example: Custom Float Animation

```json
{
  "animations": [
    {
      "type": "keyframe",
      "duration": 120,
      "loop": -1,
      "keyframes": [
        {
          "frame": 0,
          "properties": { "y": 0, "rotation": 0 }
        },
        {
          "frame": 30,
          "properties": { "y": -15, "rotation": 2 },
          "easing": "easeInOutSine"
        },
        {
          "frame": 60,
          "properties": { "y": 0, "rotation": 0 },
          "easing": "easeInOutSine"
        },
        {
          "frame": 90,
          "properties": { "y": -10, "rotation": -2 },
          "easing": "easeInOutSine"
        },
        {
          "frame": 120,
          "properties": { "y": 0, "rotation": 0 },
          "easing": "easeInOutSine"
        }
      ]
    }
  ]
}
```

### Example: Scale and Rotate

```json
{
  "animations": [
    {
      "type": "keyframe",
      "duration": 60,
      "keyframes": [
        {
          "frame": 0,
          "properties": { "scaleX": 0.5, "scaleY": 0.5, "rotation": -180, "opacity": 0 }
        },
        {
          "frame": 30,
          "properties": { "scaleX": 1.1, "scaleY": 1.1, "rotation": 10, "opacity": 1 },
          "easing": "easeOutBack"
        },
        {
          "frame": 60,
          "properties": { "scaleX": 1, "scaleY": 1, "rotation": 0, "opacity": 1 },
          "easing": "easeOutQuad"
        }
      ]
    }
  ]
}
```

## Easing Functions

### Basic

| Easing | Description |
|--------|-------------|
| `linear` | Constant speed |

### Quadratic

| Easing | Description |
|--------|-------------|
| `easeInQuad` | Slow start |
| `easeOutQuad` | Slow end |
| `easeInOutQuad` | Slow start and end |

### Cubic

| Easing | Description |
|--------|-------------|
| `easeInCubic` | Slower start |
| `easeOutCubic` | Slower end |
| `easeInOutCubic` | Slower start and end |

### Quartic

| Easing | Description |
|--------|-------------|
| `easeInQuart` | Even slower start |
| `easeOutQuart` | Even slower end |
| `easeInOutQuart` | Even slower start and end |

### Quintic

| Easing | Description |
|--------|-------------|
| `easeInQuint` | Very slow start |
| `easeOutQuint` | Very slow end |
| `easeInOutQuint` | Very slow start and end |

### Sine

| Easing | Description |
|--------|-------------|
| `easeInSine` | Gentle start |
| `easeOutSine` | Gentle end |
| `easeInOutSine` | Gentle start and end |

### Exponential

| Easing | Description |
|--------|-------------|
| `easeInExpo` | Sharp start |
| `easeOutExpo` | Sharp end |
| `easeInOutExpo` | Sharp start and end |

### Circular

| Easing | Description |
|--------|-------------|
| `easeInCirc` | Circular start |
| `easeOutCirc` | Circular end |
| `easeInOutCirc` | Circular start and end |

### Back (Overshoot)

| Easing | Description |
|--------|-------------|
| `easeInBack` | Pull back before start |
| `easeOutBack` | Overshoot at end |
| `easeInOutBack` | Pull back and overshoot |

### Elastic

| Easing | Description |
|--------|-------------|
| `easeInElastic` | Elastic pull at start |
| `easeOutElastic` | Elastic bounce at end |
| `easeInOutElastic` | Elastic at both ends |

### Bounce

| Easing | Description |
|--------|-------------|
| `easeInBounce` | Bounce at start |
| `easeOutBounce` | Bounce at end |
| `easeInOutBounce` | Bounce at both ends |

### Custom Easing

Use cubic-bezier notation:

```json
{
  "easing": "cubic-bezier(0.25, 0.1, 0.25, 1)"
}
```

Or spring physics:

```json
{
  "easing": "spring(1, 100, 10)"
}
```

## Multiple Animations

Layers can have multiple animations:

```json
{
  "animations": [
    {
      "type": "entrance",
      "effect": "fadeIn",
      "duration": 20
    },
    {
      "type": "keyframe",
      "duration": 60,
      "delay": 20,
      "loop": -1,
      "keyframes": [
        { "frame": 0, "properties": { "y": 0 } },
        { "frame": 30, "properties": { "y": -10 }, "easing": "easeInOutSine" },
        { "frame": 60, "properties": { "y": 0 }, "easing": "easeInOutSine" }
      ]
    },
    {
      "type": "exit",
      "effect": "fadeOut",
      "duration": 20
    }
  ]
}
```

## Animation Timing

### Delay

Start animation after a delay:

```json
{
  "type": "entrance",
  "effect": "fadeIn",
  "delay": 30,
  "duration": 20
}
```

### Staggered Animations

Create staggered effects by using different delays:

```json
{
  "layers": [
    {
      "id": "item-1",
      "animations": [{ "type": "entrance", "effect": "fadeInUp", "delay": 0, "duration": 20 }]
    },
    {
      "id": "item-2",
      "animations": [{ "type": "entrance", "effect": "fadeInUp", "delay": 5, "duration": 20 }]
    },
    {
      "id": "item-3",
      "animations": [{ "type": "entrance", "effect": "fadeInUp", "delay": 10, "duration": 20 }]
    }
  ]
}
```

## Looping

### Finite Loops

```json
{
  "type": "emphasis",
  "effect": "pulse",
  "duration": 30,
  "loop": 3
}
```

### Infinite Loops

```json
{
  "type": "emphasis",
  "effect": "spin",
  "duration": 60,
  "loop": -1
}
```

### Alternating Direction

```json
{
  "type": "keyframe",
  "duration": 60,
  "loop": -1,
  "alternate": true,
  "keyframes": [
    { "frame": 0, "properties": { "x": 0 } },
    { "frame": 60, "properties": { "x": 100 } }
  ]
}
```

## Best Practices

1. **Keep durations reasonable** - 15-30 frames for quick effects, 30-60 for emphasis
2. **Use appropriate easing** - `easeOut` for entrances, `easeIn` for exits
3. **Stagger animations** - Add 3-5 frame delays between sequential elements
4. **Avoid over-animation** - Less is more; too many animations distract
5. **Match emphasis to content** - Use `pulse` for CTAs, `float` for decorative elements

## Related Documentation

- [Layers](/templates/layers) - Layer types
- [Transitions](/templates/transitions) - Scene transitions
- [Filters](/templates/filters) - Filter effects
