---
name: get_component_docs
description: "Get detailed documentation for a specific Rendervid component/layer type."
tags: [mcp, rendervid]
category: utilities
---

# get_component_docs

Get detailed documentation for a specific Rendervid component/layer type.

Use this tool when you need detailed information about how to use a specific component.
This is more token-efficient than loading all documentation at once.

Available component types:
- text: Text layers with custom styling
- image: Image layers with various fit modes
- shape: Geometric shapes (rectangle, ellipse, triangle, star, polygon)
- video: Video layers with playback control
- audio: Audio layers for background music/effects
- custom: Custom React components

Example: get_component_docs({ componentType: "text" })

## When to Use

Use this tool when you need to:

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `componentType` | string | ✓ | The component/layer type to get documentation for |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "componentType": {
      "type": "string",
      "description": "The component/layer type to get documentation for"
    }
  },
  "required": [
    "componentType"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

## Examples


## Related Tools


## Error Handling

This tool provides detailed error messages when:
- Invalid template structure
- Missing required parameters
- Unsupported formats or options
- File system errors

Always check the returned error messages for troubleshooting guidance.

## Best Practices

