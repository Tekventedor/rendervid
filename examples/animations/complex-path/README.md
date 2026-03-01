# Complex Path Animation

Demonstrates advanced keyframe animation system with 30+ easing functions.

## Preview

![Demo](output.gif)

[📹 Watch full video (MP4)](output.mp4)

## Features

- Multiple easing functions on single object
- Complex motion paths
- Rotation and scale animations
- Smooth transitions

## Easing Functions (30+)

### Linear
- `linear` - Constant speed

### Quadratic
- `easeInQuad` - Accelerating from zero
- `easeOutQuad` - Decelerating to zero
- `easeInOutQuad` - Acceleration until halfway, then deceleration

### Cubic
- `easeInCubic` - Accelerating from zero (cubic)
- `easeOutCubic` - Decelerating to zero (cubic)
- `easeInOutCubic` - Acceleration until halfway, then deceleration (cubic)

### Quartic
- `easeInQuart` - Accelerating from zero (quartic)
- `easeOutQuart` - Decelerating to zero (quartic)
- `easeInOutQuart` - Acceleration until halfway, then deceleration (quartic)

### Quintic
- `easeInQuint` - Accelerating from zero (quintic)
- `easeOutQuint` - Decelerating to zero (quintic)
- `easeInOutQuint` - Acceleration until halfway, then deceleration (quintic)

### Sinusoidal
- `easeInSine` - Accelerating using sine wave
- `easeOutSine` - Decelerating using sine wave
- `easeInOutSine` - Accelerating until halfway, then decelerating (sine)

### Exponential
- `easeInExpo` - Accelerating exponentially
- `easeOutExpo` - Decelerating exponentially
- `easeInOutExpo` - Exponential acceleration/deceleration

### Circular
- `easeInCirc` - Accelerating using circular function
- `easeOutCirc` - Decelerating using circular function
- `easeInOutCirc` - Circular acceleration/deceleration

### Back
- `easeInBack` - Back up slightly before moving forward
- `easeOutBack` - Overshoot target before settling
- `easeInOutBack` - Back up and overshoot

### Elastic
- `easeInElastic` - Elastic effect at start
- `easeOutElastic` - Elastic bounce at end
- `easeInOutElastic` - Elastic at both ends

### Bounce
- `easeInBounce` - Bouncing effect at start
- `easeOutBounce` - Bouncing effect at end
- `easeInOutBounce` - Bouncing at both ends

## Advanced Features

### Loop & Ping-Pong
```json
{
  "property": "position.x",
  "keyframes": [...],
  "loop": true,
  "pingPong": true
}
```

### Vector Properties
Animate 3D vectors (position, rotation, scale):
```json
{
  "property": "position",
  "keyframes": [
    { "frame": 0, "value": [0, 0, 0] },
    { "frame": 60, "value": [5, 3, -2] }
  ]
}
```

## Usage

```bash
npx rendervid render examples/animations/complex-path/template.json
```
