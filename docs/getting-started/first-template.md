# Your First Template

This guide walks you through creating a complete template from scratch, explaining each part in detail.

## Template Structure Overview

A Rendervid template has four main sections:

```typescript
interface Template {
  // Metadata
  name: string;
  description?: string;
  version?: string;

  // Output configuration
  output: OutputConfig;

  // Dynamic inputs
  inputs: InputDefinition[];

  // Visual composition
  composition: Composition;
}
```

## Step 1: Define Metadata

Start with basic information about your template:

```json
{
  "name": "Product Announcement",
  "description": "Animated video for announcing new products",
  "version": "1.0.0",
  "tags": ["marketing", "product", "announcement"]
}
```

## Step 2: Configure Output

Specify the video or image dimensions and format:

```json
{
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 10
  }
}
```

### Output Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'video' \| 'image'` | Output format |
| `width` | `number` | Canvas width in pixels |
| `height` | `number` | Canvas height in pixels |
| `fps` | `number` | Frames per second (video only) |
| `duration` | `number` | Duration in seconds (video only) |
| `backgroundColor` | `string` | Default background color |

### Common Dimensions

| Platform | Dimensions | Aspect Ratio |
|----------|------------|--------------|
| YouTube | 1920x1080 | 16:9 |
| Instagram Story | 1080x1920 | 9:16 |
| Instagram Post | 1080x1080 | 1:1 |
| TikTok | 1080x1920 | 9:16 |
| Twitter Card | 1200x630 | 1.91:1 |
| LinkedIn Banner | 1584x396 | 4:1 |

## Step 3: Define Inputs

Inputs make your template customizable:

```json
{
  "inputs": [
    {
      "key": "productName",
      "type": "string",
      "label": "Product Name",
      "description": "Name of the product being announced",
      "required": true
    },
    {
      "key": "productImage",
      "type": "url",
      "label": "Product Image",
      "description": "URL to product image",
      "required": true,
      "validation": {
        "allowedTypes": ["image"]
      }
    },
    {
      "key": "price",
      "type": "string",
      "label": "Price",
      "description": "Product price with currency",
      "required": false,
      "default": ""
    },
    {
      "key": "accentColor",
      "type": "color",
      "label": "Accent Color",
      "description": "Brand accent color",
      "required": false,
      "default": "#3B82F6"
    }
  ]
}
```

### Input Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text input | Titles, descriptions |
| `number` | Numeric value | Prices, counts |
| `boolean` | Toggle | Show/hide elements |
| `color` | Color picker | `#FF5500`, `rgba(...)` |
| `url` | Asset URL | Images, videos |
| `enum` | Select from options | Categories |
| `richtext` | Formatted text | HTML/Markdown |
| `date` | Date value | Event dates |
| `array` | List of values | Multiple items |

## Step 4: Create Composition

The composition contains scenes and layers:

```json
{
  "composition": {
    "scenes": [
      {
        "id": "intro",
        "startFrame": 0,
        "endFrame": 90,
        "backgroundColor": "#0F172A",
        "layers": [
          // Layers go here
        ],
        "transition": {
          "type": "fade",
          "duration": 15
        }
      },
      {
        "id": "product",
        "startFrame": 90,
        "endFrame": 210,
        "backgroundColor": "#0F172A",
        "layers": [
          // More layers
        ]
      }
    ]
  }
}
```

### Frame Calculations

At 30 fps:
- 1 second = 30 frames
- 5 seconds = 150 frames
- 10 seconds = 300 frames

Formula: `frames = seconds * fps`

## Step 5: Add Layers

Each layer represents a visual element:

```json
{
  "layers": [
    {
      "id": "background",
      "type": "shape",
      "position": { "x": 0, "y": 0 },
      "size": { "width": 1920, "height": 1080 },
      "props": {
        "shape": "rectangle",
        "gradient": {
          "type": "linear",
          "colors": [
            { "offset": 0, "color": "#0F172A" },
            { "offset": 1, "color": "#1E293B" }
          ],
          "angle": 135
        }
      }
    },
    {
      "id": "product-image",
      "type": "image",
      "position": { "x": 710, "y": 200 },
      "size": { "width": 500, "height": 500 },
      "inputKey": "productImage",
      "props": {
        "fit": "contain"
      },
      "animations": [
        {
          "type": "entrance",
          "effect": "scaleIn",
          "delay": 0,
          "duration": 30,
          "easing": "easeOutBack"
        }
      ]
    },
    {
      "id": "product-name",
      "type": "text",
      "position": { "x": 160, "y": 750 },
      "size": { "width": 1600, "height": 100 },
      "inputKey": "productName",
      "props": {
        "fontSize": 64,
        "fontWeight": "bold",
        "color": "#FFFFFF",
        "textAlign": "center"
      },
      "animations": [
        {
          "type": "entrance",
          "effect": "fadeInUp",
          "delay": 15,
          "duration": 25
        }
      ]
    },
    {
      "id": "price-tag",
      "type": "text",
      "position": { "x": 160, "y": 860 },
      "size": { "width": 1600, "height": 60 },
      "inputKey": "price",
      "props": {
        "fontSize": 36,
        "fontWeight": "600",
        "textAlign": "center"
      },
      "style": {
        "textColor": "{{accentColor}}"
      },
      "animations": [
        {
          "type": "entrance",
          "effect": "fadeIn",
          "delay": 30,
          "duration": 20
        }
      ]
    }
  ]
}
```

### Layer Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `type` | `LayerType` | Layer type (text, image, etc.) |
| `position` | `{ x, y }` | Position in pixels |
| `size` | `{ width, height }` | Dimensions in pixels |
| `props` | `object` | Type-specific properties |
| `inputKey` | `string` | Bind to input value |
| `animations` | `Animation[]` | Animation effects |
| `style` | `LayerStyle` | Tailwind-like styles |
| `from` | `number` | Start frame (relative to scene) |
| `duration` | `number` | Duration in frames |
| `opacity` | `number` | Opacity (0-1) |
| `rotation` | `number` | Rotation in degrees |
| `scale` | `{ x, y }` | Scale multiplier |

## Complete Example

Here's the full template:

```json
{
  "name": "Product Announcement",
  "description": "Animated video for announcing new products",
  "version": "1.0.0",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 7
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
      "key": "productImage",
      "type": "url",
      "label": "Product Image",
      "description": "URL to product image",
      "required": true
    },
    {
      "key": "price",
      "type": "string",
      "label": "Price",
      "description": "Product price",
      "required": false,
      "default": ""
    }
  ],
  "composition": {
    "scenes": [
      {
        "id": "main",
        "startFrame": 0,
        "endFrame": 210,
        "backgroundColor": "#0F172A",
        "layers": [
          {
            "id": "product-image",
            "type": "image",
            "position": { "x": 710, "y": 150 },
            "size": { "width": 500, "height": 500 },
            "inputKey": "productImage",
            "props": { "fit": "contain" },
            "animations": [
              { "type": "entrance", "effect": "scaleIn", "delay": 0, "duration": 30 }
            ]
          },
          {
            "id": "product-name",
            "type": "text",
            "position": { "x": 160, "y": 700 },
            "size": { "width": 1600, "height": 100 },
            "inputKey": "productName",
            "props": {
              "fontSize": 64,
              "fontWeight": "bold",
              "color": "#FFFFFF",
              "textAlign": "center"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeInUp", "delay": 20, "duration": 25 }
            ]
          },
          {
            "id": "price",
            "type": "text",
            "position": { "x": 160, "y": 820 },
            "size": { "width": 1600, "height": 60 },
            "inputKey": "price",
            "props": {
              "fontSize": 36,
              "fontWeight": "600",
              "color": "#3B82F6",
              "textAlign": "center"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 40, "duration": 20 }
            ]
          }
        ]
      }
    ]
  }
}
```

## Using the Template

```typescript
import { RendervidEngine } from '@rendervid/core';
import { createBrowserRenderer } from '@rendervid/renderer-browser';

const engine = new RendervidEngine();
const renderer = createBrowserRenderer();

// Validate
const result = engine.validateTemplate(template);
if (!result.valid) {
  console.error(result.errors);
}

// Render
const video = await renderer.renderVideo({
  template,
  inputs: {
    productName: 'Amazing Widget Pro',
    productImage: 'https://example.com/widget.png',
    price: '$99.99',
  },
});
```

## Next Steps

- [Concepts](/getting-started/concepts) - Understand core concepts
- [Layers](/templates/layers) - Explore all layer types
- [Animations](/templates/animations) - Master the animation system
