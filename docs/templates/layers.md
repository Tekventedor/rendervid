# Layer Types

Rendervid supports 8 layer types for building compositions.

## Text Layer

Display text with rich typography options.

```typescript
interface TextLayerProps {
  text: string;                    // Text content
  fontFamily?: string;             // Font family
  fontSize?: number;               // Font size in pixels
  fontWeight?: FontWeight;         // normal, bold, 100-900
  fontStyle?: 'normal' | 'italic';
  color?: string;                  // Text color
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  lineHeight?: number;             // Line height multiplier
  letterSpacing?: number;          // Letter spacing in pixels
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  stroke?: TextStroke;             // Text outline
  textShadow?: TextShadow;         // Text shadow
  backgroundColor?: string;        // Background color
  padding?: number | Padding;      // Padding
  borderRadius?: number;           // Border radius
  maxLines?: number;               // Max lines (ellipsis if exceeded)
  overflow?: 'visible' | 'hidden' | 'ellipsis';
}
```

### Example

```json
{
  "id": "headline",
  "type": "text",
  "position": { "x": 100, "y": 200 },
  "size": { "width": 800, "height": 150 },
  "props": {
    "text": "Welcome to Rendervid",
    "fontFamily": "Inter, system-ui, sans-serif",
    "fontSize": 64,
    "fontWeight": "bold",
    "color": "#FFFFFF",
    "textAlign": "center",
    "textShadow": {
      "color": "rgba(0, 0, 0, 0.5)",
      "blur": 10,
      "offsetX": 0,
      "offsetY": 4
    }
  },
  "animations": [
    { "type": "entrance", "effect": "fadeInUp", "duration": 30 }
  ]
}
```

### Font Weights

Available font weights:
- `normal` (400)
- `bold` (700)
- `100` through `900`

### Text Stroke

```json
{
  "stroke": {
    "color": "#000000",
    "width": 2
  }
}
```

## Image Layer

Display images with fit and positioning options.

```typescript
interface ImageLayerProps {
  src: string;                     // Image URL
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  objectPosition?: string;         // CSS object-position
}
```

### Fit Modes

| Mode | Description |
|------|-------------|
| `cover` | Fill bounds, crop if needed |
| `contain` | Fit within bounds, may letterbox |
| `fill` | Stretch to fill bounds |
| `none` | Original size, may overflow |

### Example

```json
{
  "id": "product-image",
  "type": "image",
  "position": { "x": 200, "y": 100 },
  "size": { "width": 600, "height": 400 },
  "props": {
    "src": "https://example.com/product.jpg",
    "fit": "cover",
    "objectPosition": "center top"
  },
  "animations": [
    { "type": "entrance", "effect": "scaleIn", "duration": 30 }
  ]
}
```

## Video Layer

Play video clips with playback controls.

```typescript
interface VideoLayerProps {
  src: string;                     // Video URL
  fit?: 'cover' | 'contain' | 'fill';
  loop?: boolean;                  // Loop playback
  muted?: boolean;                 // Mute audio
  playbackRate?: number;           // Speed (1 = normal)
  startTime?: number;              // Start time in video (seconds)
  endTime?: number;                // End time in video (seconds)
  volume?: number;                 // Volume (0-1)
}
```

### Example

```json
{
  "id": "background-video",
  "type": "video",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 1080 },
  "props": {
    "src": "https://example.com/bg-video.mp4",
    "fit": "cover",
    "loop": true,
    "muted": true,
    "playbackRate": 0.5
  }
}
```

### Video Trimming

```json
{
  "props": {
    "src": "https://example.com/video.mp4",
    "startTime": 5,    // Start at 5 seconds
    "endTime": 15      // End at 15 seconds
  }
}
```

## Shape Layer

Draw vector shapes with fill and stroke.

```typescript
interface ShapeLayerProps {
  shape: 'rectangle' | 'ellipse' | 'polygon' | 'star' | 'path';
  fill?: string;                   // Fill color
  gradient?: Gradient;             // Fill gradient
  stroke?: string;                 // Stroke color
  strokeWidth?: number;            // Stroke width
  strokeDash?: number[];           // Dash pattern
  borderRadius?: number;           // For rectangle
  sides?: number;                  // For polygon
  points?: number;                 // For star
  innerRadius?: number;            // For star (0-1)
  pathData?: string;               // SVG path data (for path type)
}

interface Gradient {
  type: 'linear' | 'radial';
  colors: GradientStop[];
  angle?: number;                  // For linear (degrees)
}

interface GradientStop {
  offset: number;                  // 0-1
  color: string;
}
```

### Rectangle

```json
{
  "id": "card",
  "type": "shape",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 400, "height": 300 },
  "props": {
    "shape": "rectangle",
    "fill": "#3B82F6",
    "borderRadius": 20
  }
}
```

### Ellipse

```json
{
  "id": "circle",
  "type": "shape",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 200, "height": 200 },
  "props": {
    "shape": "ellipse",
    "fill": "#22C55E"
  }
}
```

### Polygon

```json
{
  "id": "hexagon",
  "type": "shape",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 200, "height": 200 },
  "props": {
    "shape": "polygon",
    "sides": 6,
    "fill": "#F59E0B"
  }
}
```

### Star

```json
{
  "id": "star",
  "type": "shape",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 200, "height": 200 },
  "props": {
    "shape": "star",
    "points": 5,
    "innerRadius": 0.5,
    "fill": "#EF4444"
  }
}
```

### SVG Path

```json
{
  "id": "custom-shape",
  "type": "shape",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 200, "height": 200 },
  "props": {
    "shape": "path",
    "pathData": "M 10 80 Q 95 10 180 80",
    "stroke": "#8B5CF6",
    "strokeWidth": 4,
    "fill": "transparent"
  }
}
```

### Gradients

```json
{
  "props": {
    "shape": "rectangle",
    "gradient": {
      "type": "linear",
      "colors": [
        { "offset": 0, "color": "#3B82F6" },
        { "offset": 0.5, "color": "#8B5CF6" },
        { "offset": 1, "color": "#EC4899" }
      ],
      "angle": 45
    }
  }
}
```

### Dashed Stroke

```json
{
  "props": {
    "shape": "rectangle",
    "fill": "transparent",
    "stroke": "#FFFFFF",
    "strokeWidth": 2,
    "strokeDash": [10, 5]
  }
}
```

## Audio Layer

Add audio tracks with volume and fade controls.

```typescript
interface AudioLayerProps {
  src: string;                     // Audio URL
  volume?: number;                 // Volume (0-1)
  loop?: boolean;                  // Loop audio
  startTime?: number;              // Start time in audio (seconds)
  fadeIn?: number;                 // Fade in duration (frames)
  fadeOut?: number;                // Fade out duration (frames)
}
```

### Example

```json
{
  "id": "background-music",
  "type": "audio",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 0, "height": 0 },
  "props": {
    "src": "https://example.com/music.mp3",
    "volume": 0.5,
    "loop": true,
    "fadeIn": 30,
    "fadeOut": 60
  }
}
```

::: tip
Audio layers don't have visual output, but still require position and size (use 0,0).
:::

## Group Layer

Container for grouping and transforming multiple layers together.

```typescript
interface GroupLayerProps {
  clip?: boolean;                  // Clip children to group bounds
}

interface GroupLayer extends LayerBase {
  type: 'group';
  props: GroupLayerProps;
  children: Layer[];
}
```

### Example

```json
{
  "id": "card-group",
  "type": "group",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 400, "height": 300 },
  "props": {
    "clip": true
  },
  "children": [
    {
      "id": "card-bg",
      "type": "shape",
      "position": { "x": 0, "y": 0 },
      "size": { "width": 400, "height": 300 },
      "props": { "shape": "rectangle", "fill": "#1E293B" }
    },
    {
      "id": "card-title",
      "type": "text",
      "position": { "x": 20, "y": 20 },
      "size": { "width": 360, "height": 50 },
      "props": { "text": "Card Title", "fontSize": 24, "color": "#FFFFFF" }
    }
  ],
  "animations": [
    { "type": "entrance", "effect": "slideInRight", "duration": 30 }
  ]
}
```

::: info
Child layer positions are relative to the group's position.
:::

## Lottie Layer

Play Lottie animations.

```typescript
interface LottieLayerProps {
  data: object | string;           // Lottie JSON data or URL
  loop?: boolean;                  // Loop animation
  speed?: number;                  // Playback speed multiplier
  direction?: 1 | -1;              // 1 = forward, -1 = reverse
}
```

### Example with URL

```json
{
  "id": "loading",
  "type": "lottie",
  "position": { "x": 860, "y": 440 },
  "size": { "width": 200, "height": 200 },
  "props": {
    "data": "https://example.com/animation.json",
    "loop": true,
    "speed": 1
  }
}
```

### Example with Inline Data

```json
{
  "id": "icon",
  "type": "lottie",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 100, "height": 100 },
  "props": {
    "data": { "v": "5.5.2", "fr": 30, ... },
    "loop": false
  }
}
```

## Custom Layer

Render custom React components.

```typescript
interface CustomLayerProps {
  [key: string]: unknown;          // Any props for the component
}

interface CustomLayer extends LayerBase {
  type: 'custom';
  props: CustomLayerProps;
  customComponent: {
    name: string;                  // Component name
    props: Record<string, unknown>;
  };
}
```

### Example

```json
{
  "id": "chart",
  "type": "custom",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 600, "height": 400 },
  "customComponent": {
    "name": "AnimatedChart",
    "props": {
      "data": [10, 25, 30, 45, 60],
      "chartType": "bar",
      "color": "#3B82F6"
    }
  },
  "props": {}
}
```

### Registering Components

```typescript
import { RendervidEngine } from '@rendervid/core';

const engine = new RendervidEngine();

// Register a custom component
engine.components.register('AnimatedChart', MyChartComponent, {
  type: 'object',
  properties: {
    data: { type: 'array' },
    chartType: { type: 'string', enum: ['bar', 'line', 'pie'] },
    color: { type: 'string' }
  }
});
```

## Layer Summary

| Type | Description | Use Case |
|------|-------------|----------|
| `text` | Rich text | Titles, labels, paragraphs |
| `image` | Static images | Photos, icons, logos |
| `video` | Video clips | B-roll, backgrounds |
| `shape` | Vector shapes | Backgrounds, decorations |
| `audio` | Audio tracks | Music, voiceover |
| `group` | Container | Organize layers, shared transforms |
| `lottie` | Lottie animations | Icons, illustrations |
| `custom` | React components | Charts, complex layouts |

## Related Documentation

- [Template Schema](/templates/schema) - Complete template reference
- [Animations](/templates/animations) - Animation system
- [Filters](/templates/filters) - Filter effects
- [Styles](/templates/styles) - Styling options
