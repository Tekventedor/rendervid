# Layer Types

Rendervid supports 8 layer types for composing rich video and image content. Each layer type has specific properties and use cases for building professional motion graphics.

## Layer Types Overview

| Type | Description | Use Cases |
|------|-------------|-----------|
| **image** | Static or animated images | Photos, logos, graphics, backgrounds |
| **video** | Video playback with controls | Video clips, b-roll, background videos |
| **text** | Rich text with typography | Titles, captions, labels, descriptions |
| **shape** | Vector shapes and paths | Backgrounds, overlays, dividers, icons |
| **audio** | Audio tracks with fade controls | Music, sound effects, voiceovers |
| **group** | Container for multiple layers | Organizing layers, clipping masks |
| **lottie** | Lottie animation playback | Animated icons, illustrations, effects |
| **custom** | Custom React components | Advanced effects, data viz, 3D scenes |

## Common Layer Properties

All layers share these common properties:

```typescript
interface LayerBase {
  id: string;                    // Unique identifier
  type: LayerType;               // Layer type
  name?: string;                 // Display name

  // Transform
  position: { x: number, y: number };  // Position in pixels
  size: { width: number, height: number };  // Dimensions in pixels
  rotation?: number;             // Rotation in degrees
  scale?: { x: number, y: number };  // Scale multiplier (1 = 100%)
  anchor?: { x: number, y: number };  // Anchor point (0-1)

  // Timing
  from?: number;                 // Start frame within scene
  duration?: number;             // Duration in frames (-1 = entire scene)

  // Visual
  opacity?: number;              // Opacity (0-1)
  visible?: boolean;             // Visibility toggle
  blendMode?: BlendMode;         // Compositing blend mode
  shadow?: Shadow;               // Drop shadow
  filters?: Filter[];            // Visual filters

  // Animation
  animations?: Animation[];      // Layer animations

  // Binding
  inputKey?: string;             // Bind to template input variable
}
```

## Image Layer

Display static or animated images with fit options.

### Properties

```typescript
interface ImageLayerProps {
  src: string;                   // Image source URL or data URL
  fit?: 'cover' | 'contain' | 'fill' | 'none';  // Default: 'cover'
  objectPosition?: string;       // CSS object-position value
}
```

### Fit Modes

**cover** - Fill bounds, crop if needed (default)
**contain** - Fit inside bounds, may have gaps
**fill** - Stretch to fill bounds exactly
**none** - Original size, no scaling

### Example: Logo Image

```json
{
  "type": "image",
  "id": "logo",
  "position": { "x": 960, "y": 100 },
  "size": { "width": 400, "height": 200 },
  "props": {
    "src": "https://example.com/logo.png",
    "fit": "contain"
  }
}
```

### Example: Background Image

```json
{
  "type": "image",
  "id": "background",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 1080 },
  "props": {
    "src": "https://example.com/bg.jpg",
    "fit": "cover"
  },
  "opacity": 0.3
}
```

### Example: Animated Logo Entrance

```json
{
  "type": "image",
  "id": "animated-logo",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 600, "height": 300 },
  "props": {
    "src": "logo.png",
    "fit": "contain"
  },
  "animations": [{
    "type": "entrance",
    "effect": "scaleIn",
    "duration": 30,
    "easing": "easeOutBack"
  }]
}
```

## Video Layer

Play video clips with playback controls and timing.

### Properties

```typescript
interface VideoLayerProps {
  src: string;                   // Video source URL
  fit?: 'cover' | 'contain' | 'fill';  // Default: 'cover'
  loop?: boolean;                // Loop playback (default: false)
  muted?: boolean;               // Mute audio (default: false)
  playbackRate?: number;         // Playback speed (default: 1)
  startTime?: number;            // Start time in video (seconds)
  endTime?: number;              // End time in video (seconds)
  volume?: number;               // Volume 0-1 (default: 1)
}
```

### Example: Background Video

```json
{
  "type": "video",
  "id": "bg-video",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 1080 },
  "props": {
    "src": "https://example.com/background.mp4",
    "fit": "cover",
    "loop": true,
    "muted": true
  }
}
```

### Example: Video Clip with Trim

```json
{
  "type": "video",
  "id": "clip",
  "position": { "x": 200, "y": 200 },
  "size": { "width": 1520, "height": 680 },
  "props": {
    "src": "video.mp4",
    "startTime": 5,
    "endTime": 15,
    "volume": 0.8
  }
}
```

### Example: Slow Motion Effect

```json
{
  "type": "video",
  "id": "slow-mo",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 1080 },
  "props": {
    "src": "action.mp4",
    "playbackRate": 0.5,
    "muted": false
  }
}
```

## Text Layer

Render rich text with full typography control.

### Properties

```typescript
interface TextLayerProps {
  text: string;                  // Text content
  fontFamily?: string;           // Font family name
  fontSize?: number;             // Font size in pixels (default: 48)
  fontWeight?: FontWeight;       // Font weight (default: 'normal')
  fontStyle?: 'normal' | 'italic';  // Font style
  color?: string;                // Text color (default: '#ffffff')
  textAlign?: 'left' | 'center' | 'right' | 'justify';  // Horizontal align
  verticalAlign?: 'top' | 'middle' | 'bottom';  // Vertical align
  lineHeight?: number;           // Line height multiplier (default: 1.2)
  letterSpacing?: number;        // Letter spacing in pixels
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  stroke?: TextStroke;           // Text stroke/outline
  textShadow?: TextShadow;       // Text shadow
  backgroundColor?: string;      // Background color
  padding?: number | Padding;    // Padding in pixels
  borderRadius?: number;         // Border radius
  maxLines?: number;             // Maximum lines
  overflow?: 'visible' | 'hidden' | 'ellipsis';  // Overflow behavior
}
```

### Example: Hero Title

```json
{
  "type": "text",
  "id": "title",
  "position": { "x": 960, "y": 400 },
  "size": { "width": 1600, "height": 300 },
  "props": {
    "text": "Welcome to the Future",
    "fontFamily": "Roboto",
    "fontSize": 120,
    "fontWeight": "700",
    "color": "#ffffff",
    "textAlign": "center",
    "textShadow": {
      "color": "#000000",
      "blur": 10,
      "offsetX": 0,
      "offsetY": 4
    }
  }
}
```

### Example: Label with Background

```json
{
  "type": "text",
  "id": "label",
  "position": { "x": 960, "y": 900 },
  "size": { "width": 400, "height": 80 },
  "props": {
    "text": "NEW",
    "fontSize": 36,
    "fontWeight": "bold",
    "color": "#ffffff",
    "textAlign": "center",
    "verticalAlign": "middle",
    "backgroundColor": "#ff0080",
    "padding": 20,
    "borderRadius": 40
  }
}
```

### Example: Outlined Text

```json
{
  "type": "text",
  "id": "outlined",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 1200, "height": 200 },
  "props": {
    "text": "BOLD",
    "fontSize": 150,
    "fontWeight": "900",
    "color": "transparent",
    "textAlign": "center",
    "stroke": {
      "color": "#ffffff",
      "width": 4
    }
  }
}
```

## Shape Layer

Render vector shapes with fills and strokes.

### Properties

```typescript
interface ShapeLayerProps {
  shape: 'rectangle' | 'ellipse' | 'polygon' | 'star' | 'path';
  fill?: string;                 // Fill color
  gradient?: Gradient;           // Fill gradient
  stroke?: string;               // Stroke color
  strokeWidth?: number;          // Stroke width in pixels
  strokeDash?: number[];         // Dash pattern
  borderRadius?: number;         // Border radius (rectangle only)
  sides?: number;                // Number of sides (polygon)
  points?: number;               // Number of points (star)
  innerRadius?: number;          // Inner radius ratio 0-1 (star)
  pathData?: string;             // SVG path data (path type)
}
```

### Example: Rounded Rectangle

```json
{
  "type": "shape",
  "id": "card",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 800, "height": 400 },
  "props": {
    "shape": "rectangle",
    "fill": "#1a1a2e",
    "borderRadius": 20,
    "stroke": "#ffffff",
    "strokeWidth": 2
  }
}
```

### Example: Circle

```json
{
  "type": "shape",
  "id": "circle",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 200, "height": 200 },
  "props": {
    "shape": "ellipse",
    "fill": "#ff0080"
  }
}
```

### Example: Star

```json
{
  "type": "shape",
  "id": "star",
  "position": { "x": 1700, "y": 200 },
  "size": { "width": 150, "height": 150 },
  "props": {
    "shape": "star",
    "points": 5,
    "innerRadius": 0.5,
    "fill": "#ffaa00"
  }
}
```

### Example: Gradient Background

```json
{
  "type": "shape",
  "id": "gradient-bg",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 1920, "height": 1080 },
  "props": {
    "shape": "rectangle",
    "gradient": {
      "type": "linear",
      "angle": 45,
      "colors": [
        { "offset": 0, "color": "#1a1a2e" },
        { "offset": 1, "color": "#4c00ff" }
      ]
    }
  }
}
```

### Example: Polygon

```json
{
  "type": "shape",
  "id": "hexagon",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 300, "height": 300 },
  "props": {
    "shape": "polygon",
    "sides": 6,
    "fill": "#00ffff",
    "stroke": "#ffffff",
    "strokeWidth": 4
  }
}
```

## Audio Layer

Play audio tracks with volume and fade controls.

### Properties

```typescript
interface AudioLayerProps {
  src: string;                   // Audio source URL
  volume?: number;               // Volume 0-1 (default: 1)
  loop?: boolean;                // Loop playback (default: false)
  startTime?: number;            // Start time in audio (seconds)
  fadeIn?: number;               // Fade in duration (frames)
  fadeOut?: number;              // Fade out duration (frames)
}
```

### Example: Background Music

```json
{
  "type": "audio",
  "id": "music",
  "props": {
    "src": "https://example.com/music.mp3",
    "volume": 0.5,
    "loop": true,
    "fadeIn": 30,
    "fadeOut": 30
  }
}
```

### Example: Sound Effect

```json
{
  "type": "audio",
  "id": "whoosh",
  "from": 60,
  "duration": 15,
  "props": {
    "src": "whoosh.mp3",
    "volume": 0.8
  }
}
```

### Example: Voiceover with Trim

```json
{
  "type": "audio",
  "id": "narration",
  "props": {
    "src": "voiceover.mp3",
    "startTime": 5,
    "volume": 1,
    "fadeIn": 10,
    "fadeOut": 20
  }
}
```

## Group Layer

Container for organizing and clipping multiple layers.

### Properties

```typescript
interface GroupLayerProps {
  clip?: boolean;                // Clip children to group bounds (default: false)
}
```

### Example: Grouped Layers

```json
{
  "type": "group",
  "id": "card-group",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 800, "height": 400 },
  "props": {
    "clip": true
  },
  "layers": [
    {
      "type": "shape",
      "id": "bg",
      "position": { "x": 0, "y": 0 },
      "size": { "width": 800, "height": 400 },
      "props": {
        "shape": "rectangle",
        "fill": "#1a1a2e",
        "borderRadius": 20
      }
    },
    {
      "type": "text",
      "id": "title",
      "position": { "x": 400, "y": 100 },
      "size": { "width": 700, "height": 100 },
      "props": {
        "text": "Card Title",
        "fontSize": 48,
        "textAlign": "center"
      }
    }
  ]
}
```

### Example: Clipping Mask

```json
{
  "type": "group",
  "id": "mask",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 600, "height": 600 },
  "rotation": 45,
  "props": {
    "clip": true
  },
  "layers": [
    {
      "type": "image",
      "id": "photo",
      "position": { "x": 300, "y": 300 },
      "size": { "width": 800, "height": 800 },
      "props": {
        "src": "photo.jpg",
        "fit": "cover"
      }
    }
  ]
}
```

## Lottie Layer

Play Lottie animations (After Effects exports).

### Properties

```typescript
interface LottieLayerProps {
  data: object | string;         // Lottie JSON or URL
  loop?: boolean;                // Loop animation (default: false)
  speed?: number;                // Playback speed multiplier (default: 1)
  direction?: 1 | -1;            // Play direction (1 = forward, -1 = reverse)
}
```

### Example: Animated Icon

```json
{
  "type": "lottie",
  "id": "icon",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 400, "height": 400 },
  "props": {
    "data": "https://example.com/animation.json",
    "loop": true,
    "speed": 1
  }
}
```

### Example: Loading Spinner

```json
{
  "type": "lottie",
  "id": "spinner",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 200, "height": 200 },
  "props": {
    "data": { /* Lottie JSON data */ },
    "loop": true,
    "speed": 1.5
  }
}
```

## Custom Layer

Render custom React components for advanced effects.

### Properties

```typescript
interface CustomLayerProps {
  [key: string]: unknown;        // Custom props passed to component
}

interface CustomComponentRef {
  name: string;                  // Component name
  props: Record<string, unknown>;  // Component props
}
```

### Example: 3D Scene

```json
{
  "type": "custom",
  "id": "3d-cube",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 600, "height": 600 },
  "customComponent": {
    "name": "ThreeScene",
    "props": {
      "geometry": "box",
      "color": "#ff0080",
      "rotation": { "y": 1 }
    }
  }
}
```

### Example: Scene Transition

```json
{
  "type": "custom",
  "id": "transition",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 1080 },
  "customComponent": {
    "name": "SceneTransition",
    "props": {
      "type": "fade",
      "duration": 30
    }
  }
}
```

### Example: Counter Animation

```json
{
  "type": "custom",
  "id": "counter",
  "position": { "x": 960, "y": 540 },
  "size": { "width": 400, "height": 200 },
  "customComponent": {
    "name": "Counter",
    "props": {
      "from": 0,
      "to": 100,
      "duration": 60
    }
  }
}
```

## Layer Ordering and Z-Index

Layers are rendered in order:
1. Earlier layers in the array render first (bottom)
2. Later layers render on top
3. Use `opacity` and `blendMode` for compositing

```json
{
  "layers": [
    { "id": "background" },    // Renders first (bottom)
    { "id": "middle" },        // Renders second
    { "id": "foreground" }     // Renders last (top)
  ]
}
```

## Blend Modes

Composite layers using blend modes:

- **normal** - Standard compositing (default)
- **multiply** - Multiply colors (darkens)
- **screen** - Screen colors (lightens)
- **overlay** - Overlay effect
- **darken** - Keep darker pixels
- **lighten** - Keep lighter pixels
- **color-dodge** - Color dodge effect
- **color-burn** - Color burn effect
- **hard-light** - Hard light effect
- **soft-light** - Soft light effect
- **difference** - Difference blend
- **exclusion** - Exclusion blend

```json
{
  "type": "shape",
  "blendMode": "multiply",
  "opacity": 0.5
}
```

## Best Practices

### 1. Use Appropriate Layer Types

```json
// ✅ Good - Use text layer for text
{ "type": "text", "props": { "text": "Title" } }

// ❌ Bad - Don't use image layer for text
{ "type": "image", "props": { "src": "text-image.png" } }
```

### 2. Optimize Layer Count

Keep layer count reasonable for performance:
- **< 10 layers** - Excellent performance
- **10-30 layers** - Good performance
- **30-50 layers** - Acceptable performance
- **> 50 layers** - Consider optimizing

### 3. Position Layers Efficiently

Use groups to organize related layers:

```json
{
  "type": "group",
  "id": "card",
  "layers": [
    { "id": "background" },
    { "id": "title" },
    { "id": "description" },
    { "id": "button" }
  ]
}
```

### 4. Set Proper Timing

Use `from` and `duration` for precise timing:

```json
{
  "id": "layer1",
  "from": 0,        // Starts at frame 0
  "duration": 60    // Lasts 60 frames (2 seconds at 30fps)
}
```

### 5. Use Input Binding

Make layers dynamic with input variables:

```json
{
  "inputs": [
    { "key": "userName", "type": "string" }
  ],
  "layers": [{
    "type": "text",
    "inputKey": "userName",
    "props": { "text": "{{userName}}" }
  }]
}
```

## Performance Tips

1. **Optimize images** - Use appropriate resolution (don't use 4K images for 1080p output)
2. **Minimize video layers** - Video decoding is expensive
3. **Use shapes over images** - Shapes are faster than images for simple graphics
4. **Group static layers** - Group layers that don't animate together
5. **Limit simultaneous animations** - Too many animations at once can slow rendering

## Browser Compatibility

| Layer Type | Chrome | Firefox | Safari | Edge |
|-----------|--------|---------|--------|------|
| image | ✅ | ✅ | ✅ | ✅ |
| video | ✅ | ✅ | ✅ | ✅ |
| text | ✅ | ✅ | ✅ | ✅ |
| shape | ✅ | ✅ | ✅ | ✅ |
| audio | ✅ | ✅ | ✅ | ✅ |
| group | ✅ | ✅ | ✅ | ✅ |
| lottie | ✅ | ✅ | ✅ | ✅ |
| custom | ✅ | ✅ | ✅ | ✅ |

## Examples

Complete layer type examples:
- `examples/layers/` - Individual layer type demonstrations
- `examples/marketing/product-showcase/` - Multi-layer composition
- `packages/core/src/types/layer.ts` - TypeScript definitions

## API Reference

See TypeScript definitions in `@rendervid/core` for complete layer type documentation:
- `Layer` - Base layer interface
- `ImageLayerProps`, `VideoLayerProps`, `TextLayerProps`, etc. - Layer-specific props
- `LayerType` - Available layer types
- `BlendMode` - Compositing blend modes
