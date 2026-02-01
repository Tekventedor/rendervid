# Core Concepts

Understanding these fundamental concepts will help you create effective templates with Rendervid.

## Stateless Architecture

Rendervid uses a stateless architecture where:

- **Templates** are pure JSON definitions
- **Inputs** are provided at render time
- **No side effects** - same inputs always produce the same output
- **Serializable** - templates can be stored, shared, and transmitted

This makes Rendervid ideal for:
- Server-side rendering at scale
- AI-generated content
- Template marketplaces
- Version-controlled designs

## Coordinate System

Rendervid uses a standard screen coordinate system:

```
(0,0) ─────────────────────► X (positive)
│
│
│
│
▼
Y (positive)
```

- **Origin (0,0)** is at the top-left corner
- **X** increases to the right
- **Y** increases downward
- All measurements are in **pixels**

### Position and Anchor

By default, a layer's `position` refers to its top-left corner. You can change this with `anchor`:

```json
{
  "position": { "x": 960, "y": 540 },
  "anchor": { "x": 0.5, "y": 0.5 }
}
```

Anchor values:
- `{ x: 0, y: 0 }` - Top-left (default)
- `{ x: 0.5, y: 0.5 }` - Center
- `{ x: 1, y: 1 }` - Bottom-right

## Frame-Based Timing

Time in Rendervid is measured in **frames**, not seconds:

```
frames = seconds * fps
```

At 30 fps:
| Seconds | Frames |
|---------|--------|
| 0.5 | 15 |
| 1 | 30 |
| 2 | 60 |
| 5 | 150 |
| 10 | 300 |

### Why Frames?

- **Precision** - Frame-accurate timing
- **Simplicity** - No floating-point issues
- **Flexibility** - Works with any frame rate

## Scenes

A video is composed of one or more **scenes**. Each scene:

- Has a unique `id`
- Defines `startFrame` and `endFrame`
- Contains its own `layers`
- Can have a background color/image
- Can transition to the next scene

```typescript
interface Scene {
  id: string;
  startFrame: number;    // Inclusive
  endFrame: number;      // Exclusive
  backgroundColor?: string;
  layers: Layer[];
  transition?: SceneTransition;
}
```

### Scene Timeline

```
Scene 1          Scene 2          Scene 3
[0───────90)[90────────180)[180────────270)
   Intro         Content          Outro
```

Scenes cannot overlap and should be in chronological order.

## Layers

Layers are the visual building blocks. They are rendered in order - later layers appear on top:

```json
{
  "layers": [
    { "id": "background", "type": "shape", ... },  // Bottom
    { "id": "image", "type": "image", ... },        // Middle
    { "id": "text", "type": "text", ... }           // Top
  ]
}
```

### Layer Types

| Type | Description |
|------|-------------|
| `text` | Text with typography options |
| `image` | Static images |
| `video` | Video clips |
| `shape` | Vector shapes |
| `audio` | Audio tracks |
| `group` | Container for nested layers |
| `lottie` | Lottie animations |
| `custom` | React components |

### Layer Timing

Layers have their own timing within a scene:

```json
{
  "id": "title",
  "type": "text",
  "from": 30,        // Start 30 frames into scene
  "duration": 60     // Visible for 60 frames
}
```

- `from` - Start frame (relative to scene start, default: 0)
- `duration` - How long visible (-1 for entire scene, default: -1)

## Input Binding

Inputs make templates dynamic. Use `inputKey` to bind a layer property:

```json
{
  "inputs": [
    { "key": "headline", "type": "string", "required": true }
  ],
  "composition": {
    "scenes": [{
      "layers": [{
        "id": "title",
        "type": "text",
        "inputKey": "headline",  // Binds props.text to headline
        "props": { "fontSize": 64 }
      }]
    }]
  }
}
```

### Template Variables

You can also use `{{variable}}` syntax within prop values:

```json
{
  "props": {
    "text": "Welcome, {{userName}}!",
    "color": "{{brandColor}}"
  }
}
```

## Animation System

Animations are applied to layers and have four categories:

### 1. Entrance Animations

Play when a layer appears:

```json
{
  "type": "entrance",
  "effect": "fadeInUp",
  "duration": 30,
  "delay": 0,
  "easing": "easeOutCubic"
}
```

### 2. Exit Animations

Play when a layer disappears:

```json
{
  "type": "exit",
  "effect": "fadeOut",
  "duration": 20
}
```

### 3. Emphasis Animations

Looping attention-grabbing effects:

```json
{
  "type": "emphasis",
  "effect": "pulse",
  "duration": 30,
  "loop": -1  // Infinite loop
}
```

### 4. Keyframe Animations

Custom property animations:

```json
{
  "type": "keyframe",
  "duration": 60,
  "keyframes": [
    { "frame": 0, "properties": { "x": 0, "opacity": 1 } },
    { "frame": 30, "properties": { "x": 100, "opacity": 0.5 }, "easing": "easeInOutQuad" },
    { "frame": 60, "properties": { "x": 0, "opacity": 1 } }
  ]
}
```

## Composition Model

The full composition hierarchy:

```
Template
├── output (dimensions, fps, duration)
├── inputs (dynamic parameters)
└── composition
    └── scenes[]
        ├── id, startFrame, endFrame
        ├── backgroundColor
        ├── transition
        └── layers[]
            ├── id, type
            ├── position, size
            ├── props (type-specific)
            ├── inputKey (binding)
            ├── animations[]
            ├── filters[]
            ├── style
            └── children[] (for groups)
```

## Capabilities API

The engine provides a self-describing API for AI integration:

```typescript
const engine = new RendervidEngine();
const caps = engine.getCapabilities();

// Available elements and their schemas
caps.elements.text.props      // Text layer properties
caps.elements.shape.props     // Shape layer properties

// Available animations
caps.animations.entrance      // ['fadeIn', 'fadeInUp', ...]
caps.animations.exit          // ['fadeOut', 'scaleOut', ...]
caps.animations.emphasis      // ['pulse', 'shake', ...]

// Available easings
caps.easings                  // ['linear', 'easeInQuad', ...]

// Available filters
caps.filters                  // ['blur', 'brightness', ...]

// Output capabilities
caps.output.video.formats     // ['mp4', 'webm', 'gif']
caps.output.video.maxWidth    // 7680
```

This enables AI systems to generate valid templates without hardcoding the schema.

## Next Steps

- [Template Schema](/templates/schema) - Complete schema reference
- [Layers](/templates/layers) - Deep dive into layer types
- [Animations](/templates/animations) - Animation reference
