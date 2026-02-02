---
name: render_video
description: Generate a video file from a Rendervid JSON template.

This tool renders a complete video by:
1. Accepting a Rendervid template (JSON structure defining scenes, layers, animations)
2. Merging provided input values with template defaults
3. Rendering all frames using a headless browser
4. Encoding frames into a video file using FFmpeg

The template uses a declarative JSON format that describes:
- Output dimensions, FPS, and duration
- Dynamic inputs (variables that can be customized)
- Scenes with layers (text, images, shapes, video, audio)
- Animations (entrance, exit, emphasis effects with 40+ presets)
- Easing functions (30+ options for smooth motion)

Common use cases:
- Social media content (Instagram stories, TikTok videos, YouTube thumbnails)
- Marketing videos (product showcases, sale announcements, testimonials)
- Data visualizations (animated charts, graphs, dashboards)
- Educational content (course intros, lesson titles)

The output path will be created automatically. You can specify format, quality, and FPS.
Rendering progress is reported with frame counts and time estimates.

Example template structure:
{
  "name": "My Video",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5 },
  "inputs": [{ "key": "title", "type": "string", "label": "Title", "default": "Hello" }],
  "composition": { "scenes": [{ "id": "main", "startFrame": 0, "endFrame": 150, "layers": [...] }] }
}
tags: [video, rendering, templates, generation, json, mcp, rendervid]
category: rendering
---

# render_video

Generate a video file from a Rendervid JSON template.

This tool renders a complete video by:
1. Accepting a Rendervid template (JSON structure defining scenes, layers, animations)
2. Merging provided input values with template defaults
3. Rendering all frames using a headless browser
4. Encoding frames into a video file using FFmpeg

The template uses a declarative JSON format that describes:
- Output dimensions, FPS, and duration
- Dynamic inputs (variables that can be customized)
- Scenes with layers (text, images, shapes, video, audio)
- Animations (entrance, exit, emphasis effects with 40+ presets)
- Easing functions (30+ options for smooth motion)

Common use cases:
- Social media content (Instagram stories, TikTok videos, YouTube thumbnails)
- Marketing videos (product showcases, sale announcements, testimonials)
- Data visualizations (animated charts, graphs, dashboards)
- Educational content (course intros, lesson titles)

The output path will be created automatically. You can specify format, quality, and FPS.
Rendering progress is reported with frame counts and time estimates.

Example template structure:
{
  "name": "My Video",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5 },
  "inputs": [{ "key": "title", "type": "string", "label": "Title", "default": "Hello" }],
  "composition": { "scenes": [{ "id": "main", "startFrame": 0, "endFrame": 150, "layers": [...] }] }
}

## When to Use

Use this tool when you need to:
- Generate video files from JSON templates
- Create animated content programmatically
- Export videos in various formats (MP4, WebM, MOV, GIF)
- Apply custom animations and effects

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template` | object | ✓ |  |
| `inputs` | object |  |  |
| `outputPath` | string | ✓ |  |
| `format` | string |  |  |
| `quality` | string |  |  |
| `fps` | integer |  |  |


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
        "mp4",
        "webm",
        "mov",
        "gif"
      ],
      "default": "mp4"
    },
    "quality": {
      "type": "string",
      "enum": [
        "draft",
        "standard",
        "high",
        "lossless"
      ],
      "default": "high"
    },
    "fps": {
      "type": "integer",
      "exclusiveMinimum": 0
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

### Basic Video Generation

```json
{
  "template": {
    "name": "Hello World",
    "output": {
      "type": "video",
      "width": 1920,
      "height": 1080,
      "fps": 30,
      "duration": 5
    },
    "composition": {
      "scenes": [{
        "id": "main",
        "startFrame": 0,
        "endFrame": 150,
        "layers": [{
          "id": "text",
          "type": "text",
          "props": { "text": "Hello World!" }
        }]
      }]
    }
  },
  "inputs": {},
  "format": "mp4",
  "quality": "high"
}
```

## Related Tools

- [`render_image`](./render_image.md)
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
