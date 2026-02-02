---
name: render_image
description: "Generate a single image from a Rendervid template."
tags: [image, rendering, templates, generation, json, mcp, rendervid]
category: rendering
---

# render_image

Generate a single image from a Rendervid template.

This tool renders a static image by:
1. Accepting a Rendervid template (same JSON structure as video templates)
2. Rendering a specific frame (default: frame 0)
3. Exporting as PNG, JPEG, or WebP

Ideal for:
- Social media images (Instagram posts, Twitter cards, LinkedIn banners)
- Thumbnails (YouTube, blog posts, video covers)
- Static graphics (quotes, announcements, infographics)
- Previewing video frames

You can use the same template for both video and image output.
For video templates, specify which frame to capture (0-based index).
For image templates (output.type: "image"), the frame parameter is ignored.

The template format is identical to video templates, supporting:
- Multiple layers (text, images, shapes)
- Animations (will be evaluated at the specified frame)
- Dynamic inputs
- Full styling capabilities

Example use:
- Render frame 0 of a video template as a thumbnail
- Generate social media post images with custom text
- Create preview images for video content

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
| `inputs` | object |  |  |
| `outputPath` | string | ✓ |  |
| `format` | string |  |  |
| `quality` | integer |  |  |
| `frame` | integer |  |  |


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
      "default": {}
    },
    "outputPath": {
      "type": "string"
    },
    "format": {
      "type": "string",
      "enum": [
        "png",
        "jpeg",
        "webp"
      ],
      "default": "png"
    },
    "quality": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100,
      "default": 90
    },
    "frame": {
      "type": "integer",
      "minimum": 0,
      "default": 0
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
