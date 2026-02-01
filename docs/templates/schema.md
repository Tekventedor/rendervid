# Template Schema

Complete reference for the Rendervid template JSON schema.

## Template Object

The root template object:

```typescript
interface Template {
  // Required
  name: string;
  output: OutputConfig;
  inputs: InputDefinition[];
  composition: Composition;

  // Optional metadata
  id?: string;
  description?: string;
  version?: string;
  author?: TemplateAuthor;
  tags?: string[];
  thumbnail?: string;
  defaults?: Record<string, unknown>;
  customComponents?: Record<string, CustomComponentDefinition>;
}
```

## OutputConfig

Defines the output format and dimensions:

```typescript
interface OutputConfig {
  type: 'video' | 'image';
  width: number;              // Canvas width in pixels
  height: number;             // Canvas height in pixels
  fps?: number;               // Frames per second (video only, default: 30)
  duration?: number;          // Duration in seconds (video only)
  backgroundColor?: string;   // Default background (default: '#000000')
}
```

### Example: Video Output

```json
{
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 10,
    "backgroundColor": "#0F172A"
  }
}
```

### Example: Image Output

```json
{
  "output": {
    "type": "image",
    "width": 1080,
    "height": 1080,
    "backgroundColor": "#FFFFFF"
  }
}
```

### Standard Dimensions

| Use Case | Width | Height | Aspect Ratio |
|----------|-------|--------|--------------|
| 4K | 3840 | 2160 | 16:9 |
| Full HD | 1920 | 1080 | 16:9 |
| HD | 1280 | 720 | 16:9 |
| Instagram Story | 1080 | 1920 | 9:16 |
| Instagram Square | 1080 | 1080 | 1:1 |
| TikTok/Reels | 1080 | 1920 | 9:16 |
| YouTube Thumbnail | 1280 | 720 | 16:9 |
| Twitter Card | 1200 | 630 | 1.91:1 |
| LinkedIn Banner | 1584 | 396 | 4:1 |

## Composition

The composition contains all scenes:

```typescript
interface Composition {
  scenes: Scene[];
  assets?: AssetDefinition[];
}
```

### Asset Preloading

Define assets to preload before rendering:

```json
{
  "composition": {
    "assets": [
      { "id": "logo", "type": "image", "url": "/assets/logo.png" },
      { "id": "bgMusic", "type": "audio", "url": "/assets/music.mp3" },
      { "id": "intro", "type": "video", "url": "/assets/intro.mp4" }
    ],
    "scenes": [...]
  }
}
```

Asset types: `image`, `video`, `audio`, `font`, `lottie`

## Scene

A scene is a segment of the timeline:

```typescript
interface Scene {
  id: string;                      // Unique identifier
  name?: string;                   // Display name
  startFrame: number;              // Start frame (inclusive)
  endFrame: number;                // End frame (exclusive)
  backgroundColor?: string;        // Scene background color
  backgroundImage?: string;        // Background image URL
  backgroundFit?: 'cover' | 'contain' | 'fill' | 'none';
  backgroundVideo?: string;        // Background video URL
  layers: Layer[];                 // Layers in this scene
  transition?: SceneTransition;    // Transition to next scene
}
```

### Scene Example

```json
{
  "scenes": [
    {
      "id": "intro",
      "name": "Introduction",
      "startFrame": 0,
      "endFrame": 90,
      "backgroundColor": "#1a1a2e",
      "layers": [
        { "id": "title", "type": "text", ... }
      ],
      "transition": {
        "type": "fade",
        "duration": 30
      }
    },
    {
      "id": "main",
      "name": "Main Content",
      "startFrame": 90,
      "endFrame": 180,
      "backgroundImage": "https://example.com/bg.jpg",
      "backgroundFit": "cover",
      "layers": [...]
    }
  ]
}
```

## SceneTransition

Transitions between scenes:

```typescript
interface SceneTransition {
  type: 'cut' | 'fade' | 'slide' | 'wipe' | 'zoom';
  duration: number;           // Duration in frames
  direction?: 'left' | 'right' | 'up' | 'down';  // For directional transitions
  easing?: string;            // Easing function
}
```

### Transition Examples

```json
// Simple fade
{ "type": "fade", "duration": 30 }

// Slide from right
{ "type": "slide", "direction": "left", "duration": 30 }

// Wipe from bottom
{ "type": "wipe", "direction": "up", "duration": 20 }

// Zoom transition
{ "type": "zoom", "duration": 25, "easing": "easeInOutQuad" }

// Instant cut
{ "type": "cut", "duration": 0 }
```

## Layer Base

All layers share these base properties:

```typescript
interface LayerBase {
  // Required
  id: string;                      // Unique identifier
  type: LayerType;                 // Layer type
  position: { x: number; y: number };
  size: { width: number; height: number };

  // Transform
  rotation?: number;               // Rotation in degrees
  scale?: { x: number; y: number }; // Scale multiplier (1 = 100%)
  anchor?: { x: number; y: number }; // Anchor point (0-1, 0.5 = center)

  // Timing
  from?: number;                   // Start frame within scene (default: 0)
  duration?: number;               // Duration in frames (-1 = entire scene)

  // Appearance
  opacity?: number;                // 0-1 (default: 1)
  blendMode?: BlendMode;           // Compositing mode
  filters?: Filter[];              // CSS filters
  shadow?: Shadow;                 // Drop shadow
  clipPath?: string;               // SVG clip path
  maskLayer?: string;              // Mask layer ID

  // Styling
  style?: LayerStyle;              // Tailwind-like styles
  className?: string;              // Tailwind class names

  // Data binding
  inputKey?: string;               // Bind to input
  inputProperty?: string;          // Which property to bind

  // Animation
  animations?: Animation[];        // Animation effects

  // Editor
  locked?: boolean;                // Locked in editor
  hidden?: boolean;                // Hidden from render
}
```

### Blend Modes

Available blend modes:
- `normal`
- `multiply`
- `screen`
- `overlay`
- `darken`
- `lighten`
- `color-dodge`
- `color-burn`
- `hard-light`
- `soft-light`
- `difference`
- `exclusion`

### Shadow

```json
{
  "shadow": {
    "color": "rgba(0, 0, 0, 0.5)",
    "blur": 10,
    "offsetX": 5,
    "offsetY": 5
  }
}
```

## TemplateAuthor

Author information:

```typescript
interface TemplateAuthor {
  name: string;
  url?: string;
  email?: string;
}
```

## CustomComponentDefinition

Define custom React components:

```typescript
interface CustomComponentDefinition {
  type: 'reference' | 'url' | 'inline';
  reference?: string;         // Pre-registered component name
  url?: string;               // URL to load component from
  code?: string;              // Inline code (deprecated)
  propsSchema?: JSONSchema7;  // Props validation schema
  description?: string;       // Component description
}
```

### Example

```json
{
  "customComponents": {
    "AnimatedChart": {
      "type": "reference",
      "reference": "AnimatedChart",
      "description": "Animated bar/line/pie chart component"
    },
    "RemoteComponent": {
      "type": "url",
      "url": "https://example.com/components/Chart.js",
      "propsSchema": {
        "type": "object",
        "properties": {
          "data": { "type": "array" },
          "chartType": { "type": "string" }
        }
      }
    }
  }
}
```

## Complete Template Example

```json
{
  "name": "Product Launch",
  "description": "Animated product launch announcement",
  "version": "1.0.0",
  "author": {
    "name": "Rendervid",
    "url": "https://rendervid.dev"
  },
  "tags": ["marketing", "product", "launch"],
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 10
  },
  "inputs": [
    {
      "key": "productName",
      "type": "string",
      "label": "Product Name",
      "description": "Name of the product",
      "required": true
    },
    {
      "key": "tagline",
      "type": "string",
      "label": "Tagline",
      "description": "Product tagline",
      "required": false,
      "default": "Introducing something amazing"
    },
    {
      "key": "productImage",
      "type": "url",
      "label": "Product Image",
      "description": "Product image URL",
      "required": true
    }
  ],
  "defaults": {
    "productName": "New Product",
    "tagline": "Introducing something amazing"
  },
  "composition": {
    "scenes": [
      {
        "id": "reveal",
        "startFrame": 0,
        "endFrame": 300,
        "backgroundColor": "#0F172A",
        "layers": [
          {
            "id": "bg-gradient",
            "type": "shape",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 1920, "height": 1080 },
            "props": {
              "shape": "rectangle",
              "gradient": {
                "type": "radial",
                "colors": [
                  { "offset": 0, "color": "#1E293B" },
                  { "offset": 1, "color": "#0F172A" }
                ]
              }
            }
          },
          {
            "id": "product",
            "type": "image",
            "position": { "x": 710, "y": 150 },
            "size": { "width": 500, "height": 500 },
            "inputKey": "productImage",
            "props": { "fit": "contain" },
            "animations": [
              {
                "type": "entrance",
                "effect": "scaleIn",
                "duration": 40,
                "easing": "easeOutBack"
              }
            ]
          },
          {
            "id": "name",
            "type": "text",
            "position": { "x": 160, "y": 700 },
            "size": { "width": 1600, "height": 100 },
            "inputKey": "productName",
            "props": {
              "fontSize": 72,
              "fontWeight": "bold",
              "color": "#FFFFFF",
              "textAlign": "center"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeInUp",
                "delay": 20,
                "duration": 30
              }
            ]
          },
          {
            "id": "tagline",
            "type": "text",
            "position": { "x": 160, "y": 820 },
            "size": { "width": 1600, "height": 60 },
            "inputKey": "tagline",
            "props": {
              "fontSize": 28,
              "color": "#94A3B8",
              "textAlign": "center"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
                "delay": 40,
                "duration": 25
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Related Documentation

- [Layers](/templates/layers) - All layer types and properties
- [Animations](/templates/animations) - Animation system reference
- [Inputs](/templates/inputs) - Input definitions
- [Filters](/templates/filters) - Filter effects
- [Styles](/templates/styles) - Styling options
