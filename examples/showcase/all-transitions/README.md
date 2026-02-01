# All Scene Transitions Showcase

Demonstrates all available scene transition effects in Rendervid.

## Preview

![Preview](preview.gif)

## Usage

```bash
pnpm run examples:render showcase/all-transitions
```

## Featured Transitions

| Transition | Description |
|------------|-------------|
| fade | Smooth crossfade between scenes |
| slide (left) | New scene slides in from right |
| slide (up) | New scene slides in from bottom |
| slide (right) | New scene slides in from left |
| slide (down) | New scene slides in from top |
| zoom | Scale in/out effect |
| wipe | Directional wipe effect |
| cut | Instant scene change |

## Transition Properties

- **type**: fade, slide, zoom, wipe, cut
- **duration**: Length in frames
- **direction**: left, right, up, down (for slide/wipe)
- **easing**: Custom easing function

## Duration

- 5 transitions × ~3 seconds = 15 seconds total
