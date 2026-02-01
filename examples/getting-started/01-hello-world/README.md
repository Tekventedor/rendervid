# Hello World

The simplest Rendervid template - your first animated video!

## Preview

![Preview](preview.gif)

## Description

This example creates a 3-second video with animated text that fades in and pulses. It's the perfect starting point to understand Rendervid's template structure.

## Features

- 16:9 aspect ratio (1920x1080)
- Fade-in text animation
- Pulse emphasis effect
- Customizable colors and text

## Template Structure

```
template.json
├── output          → Video settings (size, fps, duration)
├── inputs          → User-configurable values
└── composition
    └── scenes
        └── layers  → Visual elements (background, text)
```

## Inputs

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `message` | string | Yes | "Hello, World!" | The text to display |
| `backgroundColor` | color | No | #1a1a2e | Background color |
| `textColor` | color | No | #ffffff | Text color |

## Quick Start

```bash
# Render with defaults
pnpm run examples:render getting-started/01-hello-world

# Render with custom message
pnpm run examples:render getting-started/01-hello-world \
  --input.message "Welcome to Rendervid!"

# Render with custom colors
pnpm run examples:render getting-started/01-hello-world \
  --input.message "Custom Colors" \
  --input.backgroundColor "#0f172a" \
  --input.textColor "#3b82f6"
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 3 seconds

## Understanding the Template

### 1. Output Configuration

```json
"output": {
  "type": "video",
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "duration": 3
}
```

This defines a 3-second Full HD video at 30 frames per second.

### 2. Inputs

Inputs let users customize the template without editing the JSON:

```json
"inputs": [
  {
    "key": "message",
    "type": "string",
    "label": "Message",
    "default": "Hello, World!"
  }
]
```

### 3. Layers

Layers are the visual elements of your video:

```json
"layers": [
  {
    "id": "background",
    "type": "shape",
    "props": { "shape": "rectangle", "fill": "{{backgroundColor}}" }
  },
  {
    "id": "message",
    "type": "text",
    "props": { "text": "{{message}}", "fontSize": 96 }
  }
]
```

### 4. Animations

Animations bring your layers to life:

```json
"animations": [
  {
    "type": "entrance",
    "effect": "fadeIn",
    "delay": 0,
    "duration": 30
  }
]
```

- `delay`: When the animation starts (in frames)
- `duration`: How long it lasts (in frames)
- At 30 fps: 30 frames = 1 second

## Next Steps

- Try [02-first-video](../02-first-video/) for a more complete example
- Explore [animation presets](../../../packages/core/src/animation/presets.ts)
- Learn about [layer types](../../../packages/core/src/types/layer.ts)

## Template JSON

<details>
<summary>View full template</summary>

```json
{
  "name": "Hello World",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 3
  },
  "inputs": [
    {
      "key": "message",
      "type": "string",
      "label": "Message",
      "default": "Hello, World!"
    }
  ],
  "composition": {
    "scenes": [
      {
        "id": "main",
        "startFrame": 0,
        "endFrame": 90,
        "layers": [
          {
            "id": "background",
            "type": "shape",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 1920, "height": 1080 },
            "props": { "shape": "rectangle", "fill": "#1a1a2e" }
          },
          {
            "id": "message",
            "type": "text",
            "position": { "x": 160, "y": 440 },
            "size": { "width": 1600, "height": 200 },
            "props": {
              "text": "Hello, World!",
              "fontSize": 96,
              "fontWeight": "bold",
              "color": "#ffffff",
              "textAlign": "center"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 30 }
            ]
          }
        ]
      }
    ]
  }
}
```

</details>
