---
name: render_image
description: "Generate a static image from a Rendervid template at a specific frame."
tags: [image, rendering, templates, generation, json, mcp, rendervid]
category: rendering
---

# render_image

Generate a static image from a Rendervid template at a specific frame.

USE FOR:
Social media posts (Instagram, Twitter, LinkedIn), video thumbnails (YouTube, Vimeo),
blog post headers, presentation slides, infographics, quote graphics, product mockups,
preview images, marketing materials, web banners

OUTPUT:
- Format: PNG (lossless), JPEG (compressed), or WebP (modern)
- Location: Specified by outputPath parameter
- Quality: 1-100 for JPEG/WebP (default: 90)
- Frame: Captures specified frame number (default: 0)
- Max resolution: 7680x4320 (8K)

TEMPLATE REQUIREMENTS:
- Same JSON structure as video templates
- Animations evaluated at specified frame
- Supports all layer types (text, image, shape, custom)
- Use output.type: "video" or "image" (both work)
- ⚠️ MUST include "inputs": [] field (even if empty for static templates)

REQUIRED TEMPLATE FIELDS:
{
  "name": "string",           // Template name (REQUIRED)
  "output": { ... },           // Output configuration (REQUIRED)
  "inputs": [],                // Input definitions (REQUIRED - use [] if no dynamic inputs)
  "composition": { ... }       // Scenes and layers (REQUIRED)
}

TYPICAL USE:
1. Render frame 0 as thumbnail
2. Capture mid-animation frame for preview
3. Generate social media image with custom text
4. Create static graphics from animated template

⚠️ CRITICAL: Pass template as JSON OBJECT, not string
✅ CORRECT: { "template": {"name": "Image", "inputs": [], ...} }
❌ COMMON ERROR: Missing "inputs" field - always include it!

## When to Use

Use this tool when you need to:
- Generate static images from templates
- Create thumbnails or preview images
- Export frames at specific timestamps
- Generate images in PNG, JPEG, or WebP formats

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template` | object | ✓ |  |
| `inputs` | object |  | Template variables. Example: {"title": "Hello World"} |
| `outputPath` | string | ✓ | Output file path. Use ~/Downloads/, ~/Desktop/, or ~/Documents/ on macOS |
| `format` | string |  | Image format. png = Lossless (default), jpeg = Compressed/smaller, webp = Modern/efficient |
| `quality` | integer |  | Quality for JPEG/WebP. 1-100. Higher = better quality, larger file. Default: 90 |
| `frame` | integer |  | Frame number to capture (0-based). 0 = first frame, N = frame after N frames |
| `renderWaitTime` | integer |  | Wait time in ms before capturing. 100 = fast/default, 200 = text-only, 500-800 = with complex images |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "template": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "version": {
          "type": "string"
        },
        "output": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "video",
                "image"
              ]
            },
            "width": {
              "type": "integer",
              "exclusiveMinimum": 0
            },
            "height": {
              "type": "integer",
              "exclusiveMinimum": 0
            },
            "fps": {
              "type": "integer",
              "exclusiveMinimum": 0
            },
            "duration": {
              "type": "number",
              "exclusiveMinimum": 0
            }
          },
          "required": [
            "type",
            "width",
            "height"
          ],
          "additionalProperties": false
        },
        "inputs": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "key": {
                "type": "string"
              },
              "type": {
                "type": "string"
              },
              "label": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "required": {
                "type": "boolean"
              },
              "default": {}
            },
            "required": [
              "key",
              "type",
              "label"
            ],
            "additionalProperties": false
          }
        },
        "defaults": {
          "type": "object",
          "additionalProperties": {}
        },
        "composition": {
          "type": "object",
          "properties": {
            "scenes": {
              "type": "array"
            }
          },
          "required": [
            "scenes"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "name",
        "output",
        "composition"
      ],
      "additionalProperties": false
    },
    "inputs": {
      "type": "object",
      "additionalProperties": {},
      "default": {},
      "description": "Template variables. Example: {\"title\": \"Hello World\"}"
    },
    "outputPath": {
      "type": "string",
      "description": "Output file path. Use ~/Downloads/, ~/Desktop/, or ~/Documents/ on macOS"
    },
    "format": {
      "type": "string",
      "enum": [
        "png",
        "jpeg",
        "webp"
      ],
      "default": "png",
      "description": "Image format. png = Lossless (default), jpeg = Compressed/smaller, webp = Modern/efficient"
    },
    "quality": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100,
      "default": 90,
      "description": "Quality for JPEG/WebP. 1-100. Higher = better quality, larger file. Default: 90"
    },
    "frame": {
      "type": "integer",
      "minimum": 0,
      "default": 0,
      "description": "Frame number to capture (0-based). 0 = first frame, N = frame after N frames"
    },
    "renderWaitTime": {
      "type": "integer",
      "exclusiveMinimum": 0,
      "default": 100,
      "description": "Wait time in ms before capturing. 100 = fast/default, 200 = text-only, 500-800 = with complex images"
    }
  },
  "required": [
    "template",
    "outputPath"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

## Examples


## Related Tools

- [`render_video`](./render_video.md)
- [`validate_template`](./validate_template.md)
- [`get_example`](./get_example.md)

## Error Handling

This tool provides detailed error messages when:
- Invalid template structure
- Missing required parameters
- Unsupported formats or options
- File system errors

Always check the returned error messages for troubleshooting guidance.

## Best Practices

- Validate templates before rendering to catch errors early
- Use appropriate quality settings for your use case
- Monitor file sizes for web delivery
- Handle errors gracefully in production
