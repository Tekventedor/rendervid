# Animation System

Rendervid provides a comprehensive animation system with 40+ preset animations, custom keyframe animations, and 30+ easing functions for creating smooth, professional motion graphics.

## Features

- ✅ **40+ Animation Presets** - Entrance, exit, and emphasis animations
- ✅ **Custom Keyframe Animations** - Full control with frame-by-frame precision
- ✅ **30+ Easing Functions** - Linear, cubic, elastic, bounce, and more
- ✅ **Multiple Animations Per Layer** - Stack entrance, exit, and emphasis animations
- ✅ **Frame-Perfect Timing** - Precise control over duration and timing
- ✅ **Type-Safe Configuration** - Full TypeScript support

## Quick Start

### Using Animation Presets

Add animations to any layer using the `animations` array:

```json
{
  "layers": [{
    "id": "title",
    "type": "text",
    "props": { "text": "Hello World" },
    "animations": [{
      "type": "entrance",
      "effect": "fadeInUp",
      "duration": 30
    }]
  }]
}
```

### Stacking Multiple Animations

Combine entrance, exit, and emphasis animations:

```json
{
  "layers": [{
    "id": "logo",
    "type": "image",
    "props": { "src": "logo.png" },
    "animations": [
      {
        "type": "entrance",
        "effect": "scaleIn",
        "duration": 30,
        "delay": 0
      },
      {
        "type": "emphasis",
        "effect": "pulse",
        "duration": 20,
        "delay": 60
      },
      {
        "type": "exit",
        "effect": "fadeOut",
        "duration": 30,
        "delay": 120
      }
    ]
  }]
}
```

## Animation Presets

### Entrance Animations (23 presets)

Animations that introduce elements into the scene.

#### Basic Entrance
- **fadeIn** - Fade from transparent to opaque
- **fadeInUp** - Fade in while moving up
- **fadeInDown** - Fade in while moving down
- **fadeInLeft** - Fade in while moving from left
- **fadeInRight** - Fade in while moving from right
- **slideInUp** - Slide in from bottom
- **slideInDown** - Slide in from top
- **slideInLeft** - Slide in from left
- **slideInRight** - Slide in from right
- **scaleIn** - Scale up from 0
- **zoomIn** - Zoom in with slight scale
- **rotateIn** - Rotate and fade in
- **bounceIn** - Bounce in with elastic effect

#### Advanced Entrance
- **flipInX** - Flip in horizontally
- **flipInY** - Flip in vertically
- **rollIn** - Roll in with rotation
- **lightSpeedIn** - Fast horizontal entrance with skew
- **swingIn** - Swing in with rotation
- **backIn** - Scale in with slight overshoot
- **elasticIn** - Elastic bounce effect
- **slideInFromTopLeft** - Diagonal slide from top-left
- **slideInFromTopRight** - Diagonal slide from top-right
- **slideInFromBottomLeft** - Diagonal slide from bottom-left
- **slideInFromBottomRight** - Diagonal slide from bottom-right

### Exit Animations (14 presets)

Animations that remove elements from the scene.

#### Basic Exit
- **fadeOut** - Fade from opaque to transparent
- **fadeOutUp** - Fade out while moving up
- **fadeOutDown** - Fade out while moving down
- **fadeOutLeft** - Fade out while moving left
- **fadeOutRight** - Fade out while moving right
- **scaleOut** - Scale down to 0
- **zoomOut** - Zoom out with slight scale

#### Advanced Exit
- **flipOutX** - Flip out horizontally
- **flipOutY** - Flip out vertically
- **rollOut** - Roll out with rotation
- **lightSpeedOut** - Fast horizontal exit with skew
- **swingOut** - Swing out with rotation
- **backOut** - Scale out with slight overshoot
- **elasticOut** - Elastic bounce exit

### Emphasis Animations (12 presets)

Looping or attention-grabbing animations for active elements.

- **pulse** - Scale up and down
- **shake** - Horizontal shaking
- **bounce** - Vertical bouncing
- **spin** - 360° rotation
- **heartbeat** - Double pulse effect
- **float** - Gentle up/down motion
- **wobble** - Rotation wobble
- **flash** - Opacity flicker
- **jello** - Elastic wiggle
- **rubberBand** - Scale stretch effect
- **tada** - Scale and rotate attention grabber
- **swing** - Pendulum swing

## Custom Keyframe Animations

For precise control, define custom keyframes:

```json
{
  "layers": [{
    "id": "custom",
    "type": "shape",
    "animations": [{
      "type": "custom",
      "keyframes": [
        {
          "frame": 0,
          "properties": { "x": 0, "y": 0, "opacity": 0 },
          "easing": "easeOutCubic"
        },
        {
          "frame": 30,
          "properties": { "x": 100, "y": 50, "opacity": 1 },
          "easing": "easeInOutCubic"
        },
        {
          "frame": 60,
          "properties": { "x": 200, "y": 0, "opacity": 0.5 }
        }
      ]
    }]
  }]
}
```

### Animatable Properties

All transform and visual properties can be animated:

**Transform Properties:**
- `x`, `y` - Position offsets (pixels)
- `scaleX`, `scaleY` - Scale multipliers (0.5 = 50%, 2 = 200%)
- `rotation` - Rotation angle (degrees)
- `skewX`, `skewY` - Skew angles (degrees)

**Visual Properties:**
- `opacity` - Transparency (0 = invisible, 1 = opaque)
- `blur` - Blur radius (pixels)
- `brightness` - Brightness multiplier (0-2)
- `contrast` - Contrast multiplier (0-2)
- `saturate` - Saturation multiplier (0-2)

## Easing Functions

Control animation acceleration with easing functions:

### Linear
- **linear** - Constant speed

### Cubic Bezier
- **easeInCubic** - Start slow, accelerate
- **easeOutCubic** - Start fast, decelerate
- **easeInOutCubic** - Slow start and end

### Quadratic
- **easeInQuad** - Gentle acceleration
- **easeOutQuad** - Gentle deceleration
- **easeInOutQuad** - Gentle ease both ends

### Quartic
- **easeInQuart** - Strong acceleration
- **easeOutQuart** - Strong deceleration
- **easeInOutQuart** - Strong ease both ends

### Quintic
- **easeInQuint** - Very strong acceleration
- **easeOutQuint** - Very strong deceleration
- **easeInOutQuint** - Very strong ease both ends

### Sine
- **easeInSine** - Smooth acceleration
- **easeOutSine** - Smooth deceleration
- **easeInOutSine** - Smooth ease both ends

### Exponential
- **easeInExpo** - Explosive acceleration
- **easeOutExpo** - Explosive deceleration
- **easeInOutExpo** - Explosive ease both ends

### Circular
- **easeInCirc** - Circular acceleration
- **easeOutCirc** - Circular deceleration
- **easeInOutCirc** - Circular ease both ends

### Back
- **easeInBack** - Overshoot then snap
- **easeOutBack** - Overshoot at end
- **easeInOutBack** - Overshoot both ends

### Elastic
- **easeInElastic** - Elastic bounce acceleration
- **easeOutElastic** - Elastic bounce deceleration
- **easeInOutElastic** - Elastic bounce both ends

### Bounce
- **easeInBounce** - Bouncing acceleration
- **easeOutBounce** - Bouncing deceleration
- **easeInOutBounce** - Bouncing both ends

## Configuration Options

### Animation Definition

```typescript
interface Animation {
  type: 'entrance' | 'exit' | 'emphasis' | 'custom';
  effect?: AnimationPreset;        // Required for entrance/exit/emphasis
  duration?: number;                // Animation length in frames
  delay?: number;                   // Delay before animation starts (frames)
  easing?: string;                  // Easing function name
  keyframes?: Keyframe[];           // Required for custom animations
}
```

### Keyframe Definition

```typescript
interface Keyframe {
  frame: number;                    // Frame number (0-based)
  properties: Record<string, number>; // Properties to animate
  easing?: string;                  // Easing function for this segment
}
```

## Usage Examples

### 1. Hero Text Entrance

```json
{
  "layers": [{
    "type": "text",
    "props": {
      "text": "Welcome",
      "fontSize": 120,
      "fontWeight": 700
    },
    "animations": [{
      "type": "entrance",
      "effect": "fadeInUp",
      "duration": 45,
      "easing": "easeOutBack"
    }]
  }]
}
```

### 2. Logo Reveal with Pulse

```json
{
  "layers": [{
    "type": "image",
    "props": { "src": "logo.png" },
    "animations": [
      {
        "type": "entrance",
        "effect": "scaleIn",
        "duration": 30,
        "easing": "easeOutElastic"
      },
      {
        "type": "emphasis",
        "effect": "pulse",
        "duration": 40,
        "delay": 30
      }
    ]
  }]
}
```

### 3. Bouncing Button

```json
{
  "layers": [{
    "type": "shape",
    "props": {
      "shape": "rectangle",
      "fill": "#ff0080",
      "borderRadius": 20
    },
    "animations": [{
      "type": "emphasis",
      "effect": "bounce",
      "duration": 50
    }]
  }]
}
```

### 4. Custom Path Animation

```json
{
  "layers": [{
    "type": "shape",
    "animations": [{
      "type": "custom",
      "keyframes": [
        { "frame": 0, "properties": { "x": 0, "y": 0 }, "easing": "easeInOutCubic" },
        { "frame": 30, "properties": { "x": 200, "y": -100 }, "easing": "easeInOutCubic" },
        { "frame": 60, "properties": { "x": 400, "y": 0 }, "easing": "easeInOutCubic" },
        { "frame": 90, "properties": { "x": 600, "y": 100 }, "easing": "easeInOutCubic" },
        { "frame": 120, "properties": { "x": 800, "y": 0 } }
      ]
    }]
  }]
}
```

### 5. Sequence of Animations

```json
{
  "layers": [{
    "type": "text",
    "props": { "text": "Click Me!" },
    "animations": [
      { "type": "entrance", "effect": "fadeIn", "duration": 15, "delay": 0 },
      { "type": "emphasis", "effect": "tada", "duration": 30, "delay": 15 },
      { "type": "emphasis", "effect": "pulse", "duration": 20, "delay": 45 },
      { "type": "exit", "effect": "fadeOut", "duration": 15, "delay": 135 }
    ]
  }]
}
```

## Performance Tips

### 1. Use Preset Animations

Preset animations are optimized and tested:

```json
// ✅ Good - Uses optimized preset
{ "type": "entrance", "effect": "fadeInUp", "duration": 30 }

// ❌ Slower - Custom keyframes for same effect
{
  "type": "custom",
  "keyframes": [
    { "frame": 0, "properties": { "opacity": 0, "y": 50 } },
    { "frame": 30, "properties": { "opacity": 1, "y": 0 } }
  ]
}
```

### 2. Minimize Simultaneous Animations

Limit active animations for smooth playback:

```json
// ✅ Good - Sequential animations
{
  "animations": [
    { "type": "entrance", "effect": "fadeIn", "delay": 0 },
    { "type": "emphasis", "effect": "pulse", "delay": 30 }
  ]
}
```

### 3. Choose Efficient Easing

Simpler easing functions perform better:

**Fast:** `linear`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
**Moderate:** `easeInOutBack`, `easeInOutSine`
**Slower:** `easeInElastic`, `easeOutElastic`, `easeInBounce`

### 4. Optimize Duration

Shorter animations = better performance:

```json
// ✅ Good - Quick 30-frame animation
{ "type": "entrance", "effect": "fadeIn", "duration": 30 }

// ⚠️ Slower - Long 120-frame animation
{ "type": "entrance", "effect": "fadeIn", "duration": 120 }
```

## Programmatic API

### Access Animation Presets

```typescript
import {
  getPreset,
  getAllPresetNames,
  getPresetsByType,
  generatePresetKeyframes
} from '@rendervid/core';

// Get specific preset
const fadeIn = getPreset('fadeIn');
console.log(fadeIn.defaultDuration); // 30
console.log(fadeIn.defaultEasing);   // "easeOutCubic"

// Get all preset names
const allPresets = getAllPresetNames();
console.log(allPresets); // ["fadeIn", "fadeInUp", ...]

// Filter by type
const entrancePresets = getPresetsByType('entrance'); // 23 presets
const exitPresets = getPresetsByType('exit');         // 14 presets
const emphasisPresets = getPresetsByType('emphasis'); // 12 presets

// Generate keyframes
const keyframes = generatePresetKeyframes('fadeInUp', {
  duration: 30,
  easing: 'easeOutCubic',
  layerSize: { width: 1920, height: 1080 },
  canvasSize: { width: 1920, height: 1080 }
});
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Transform Animations | ✅ | ✅ | ✅ | ✅ |
| Opacity Animations | ✅ | ✅ | ✅ | ✅ |
| Filter Animations | ✅ | ✅ | ✅ | ✅ |
| Cubic Bezier Easing | ✅ | ✅ | ✅ | ✅ |

### Headless Chrome (Puppeteer)
- ✅ Full animation support
- ✅ Hardware acceleration available
- ✅ Frame-accurate rendering
- ✅ All easing functions supported

## Troubleshooting

### Animation Not Playing

**Problem:** Animation defined but not visible

**Solutions:**
1. Check `delay` - animation may not have started yet
2. Verify `duration` is reasonable (not 0 or too short)
3. Ensure layer is visible during animation frames
4. Check console for validation errors

```typescript
// Debug animation timing
console.log('Scene duration:', scene.endFrame - scene.startFrame);
console.log('Animation starts at:', animation.delay || 0);
console.log('Animation ends at:', (animation.delay || 0) + animation.duration);
```

### Animation Feels Choppy

**Problem:** Animation doesn't look smooth

**Solutions:**
1. Increase FPS: `output.fps = 60` (default is 30)
2. Use appropriate easing function (avoid `linear`)
3. Check duration isn't too short (min 15 frames at 30fps)
4. Verify no conflicting animations

### Custom Keyframes Not Working

**Problem:** Custom animation not rendering correctly

**Solutions:**
1. Ensure keyframes are in ascending frame order
2. First keyframe must start at frame 0
3. Check property names are correct (case-sensitive)
4. Verify property values are numbers, not strings

```json
// ✅ Correct
{
  "keyframes": [
    { "frame": 0, "properties": { "opacity": 0 } },
    { "frame": 30, "properties": { "opacity": 1 } }
  ]
}

// ❌ Wrong - frame order, missing frame 0
{
  "keyframes": [
    { "frame": 30, "properties": { "opacity": 1 } },
    { "frame": 0, "properties": { "opacity": 0 } }
  ]
}
```

## Examples

See complete examples in:
- `examples/animations/` - All animation presets demonstrated
- `examples/marketing/logo-reveal/` - Logo animation sequence
- `examples/social-media/instagram-story/` - Text animations
- `packages/core/src/animation/presets.ts` - Preset implementation source

## API Reference

- **Animation Interface** - Animation configuration types
- **Keyframe Interface** - Custom keyframe definition
- **Animation Presets** - Complete preset reference
- **Easing Functions** - Available easing function list

See TypeScript definitions in `@rendervid/core` for complete API documentation.
