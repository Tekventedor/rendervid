---
name: get_capabilities
description: Discover all available features and capabilities of the Rendervid engine.

This tool returns a comprehensive overview of what Rendervid can do, including:

**Layer Types:**
- text: Rich text with typography, fonts, alignment
- image: Display images with fit options (cover, contain, fill)
- video: Play video clips with timing controls
- shape: Rectangles, ellipses, polygons, stars, paths
- audio: Background music and sound effects
- group: Container for organizing layers
- lottie: Lottie animations
- custom: Custom React components

**Animation Presets (40+):**
- Entrance: fadeIn, slideIn, zoomIn, bounceIn, rotateIn, etc.
- Exit: fadeOut, slideOut, zoomOut, bounceOut, rotateOut, etc.
- Emphasis: pulse, shake, bounce, swing, wobble, flash, etc.

**Easing Functions (30+):**
- Linear, ease, easeIn, easeOut, easeInOut
- Cubic bezier variants (Quad, Cubic, Quart, Quint, Sine, Expo, Circ, Back, Elastic, Bounce)
- Custom cubic-bezier and spring functions

**Output Formats:**
- Video: MP4, WebM, MOV, GIF
- Image: PNG, JPEG, WebP
- Codecs: H.264, H.265, VP8, VP9, AV1, ProRes

**Styling Features:**
- Blend modes (multiply, screen, overlay, etc.)
- Filters (blur, brightness, grayscale, etc.)
- Fonts (built-in, Google Fonts, custom fonts)
- Tailwind CSS support

Use this to understand what's possible when creating templates, especially for AI-generated content.
The capabilities object includes detailed schemas and examples for each element type.
tags: [discovery, metadata, templates, generation, mcp, rendervid]
category: discovery
---

# get_capabilities

Discover all available features and capabilities of the Rendervid engine.

This tool returns a comprehensive overview of what Rendervid can do, including:

**Layer Types:**
- text: Rich text with typography, fonts, alignment
- image: Display images with fit options (cover, contain, fill)
- video: Play video clips with timing controls
- shape: Rectangles, ellipses, polygons, stars, paths
- audio: Background music and sound effects
- group: Container for organizing layers
- lottie: Lottie animations
- custom: Custom React components

**Animation Presets (40+):**
- Entrance: fadeIn, slideIn, zoomIn, bounceIn, rotateIn, etc.
- Exit: fadeOut, slideOut, zoomOut, bounceOut, rotateOut, etc.
- Emphasis: pulse, shake, bounce, swing, wobble, flash, etc.

**Easing Functions (30+):**
- Linear, ease, easeIn, easeOut, easeInOut
- Cubic bezier variants (Quad, Cubic, Quart, Quint, Sine, Expo, Circ, Back, Elastic, Bounce)
- Custom cubic-bezier and spring functions

**Output Formats:**
- Video: MP4, WebM, MOV, GIF
- Image: PNG, JPEG, WebP
- Codecs: H.264, H.265, VP8, VP9, AV1, ProRes

**Styling Features:**
- Blend modes (multiply, screen, overlay, etc.)
- Filters (blur, brightness, grayscale, etc.)
- Fonts (built-in, Google Fonts, custom fonts)
- Tailwind CSS support

Use this to understand what's possible when creating templates, especially for AI-generated content.
The capabilities object includes detailed schemas and examples for each element type.

## When to Use

Use this tool when you need to:
- Discover available Rendervid features
- Learn about supported layer types and animations
- Check available output formats
- Understand engine limitations

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|


## Input Schema

```json
{
  "type": "object",
  "properties": {}
}
```

## Examples


## Related Tools

- [`validate_template`](./validate_template.md)
- [`list_examples`](./list_examples.md)

## Error Handling

This tool provides detailed error messages when:
- Invalid template structure
- Missing required parameters
- Unsupported formats or options
- File system errors

Always check the returned error messages for troubleshooting guidance.

## Best Practices

