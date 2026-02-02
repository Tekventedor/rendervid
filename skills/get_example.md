---
name: get_example
description: "Load a specific example template by path."
tags: [templates, examples, json, mcp, rendervid]
category: examples
---

# get_example

Load a specific example template by path.

This tool retrieves a complete example template including:
- template: The full Rendervid JSON template ready to use
- readme: Documentation explaining how the template works (if available)
- path: The example path for reference

The template can be used immediately with render_video or render_image tools.
You can also modify the template's inputs or structure before rendering.

**Example paths format:**
category/example-name

**Common examples:**
- getting-started/01-hello-world: Simplest template, animated text
- getting-started/02-first-video: Basic 5-second video
- social-media/instagram-story: 1080x1920 Instagram story template
- social-media/youtube-thumbnail: 1280x720 YouTube thumbnail
- marketing/product-showcase: Product feature video
- data-visualization/animated-bar-chart: Animated bar chart

**Using the template:**
1. Load example: get_example({ examplePath: "category/name" })
2. Review template structure and inputs
3. Customize inputs with your own values
4. Render with render_video or render_image

**Customizing:**
Templates have an "inputs" array defining what can be customized.
Each input has a key, type, label, and default value.
Pass your custom values to the inputs parameter when rendering.

Example:
{
  "inputs": [
    { "key": "title", "type": "string", "default": "Hello" },
    { "key": "color", "type": "color", "default": "#3B82F6" }
  ]
}

Render with: { inputs: { title: "My Title", color: "#FF0000" } }

## When to Use

Use this tool when you need to:
- Load a specific example template
- View example documentation
- Understand template structure
- Use as a starting point for custom templates

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `examplePath` | string | ✓ |  |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "examplePath": {
      "type": "string"
    }
  },
  "required": [
    "examplePath"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

## Examples


## Related Tools

- [`list_examples`](./list_examples.md)
- [`render_video`](./render_video.md)
- [`render_image`](./render_image.md)

## Error Handling

This tool provides detailed error messages when:
- Invalid template structure
- Missing required parameters
- Unsupported formats or options
- File system errors

Always check the returned error messages for troubleshooting guidance.

## Best Practices

