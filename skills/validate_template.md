---
name: validate_template
description: Validate a Rendervid template JSON structure.

This tool performs comprehensive validation of a template to ensure it's properly formatted and ready for rendering.

Validation checks include:
- Template structure (name, output, composition)
- Output configuration (type, dimensions, fps, duration)
- Input definitions (keys, types, defaults)
- Scene structure (IDs, frame ranges)
- Layer configuration (types, positions, sizes, props)
- Animation definitions (types, effects, timing, easing)
- Component references and props
- Data consistency (frame ranges, input references)

Returns:
- valid: boolean indicating if template is valid
- errors: array of validation errors (if any)
- warnings: array of validation warnings (if any)

Use this before rendering to catch issues early, or when:
- Creating new templates
- Modifying existing templates
- Debugging template issues
- Verifying AI-generated templates

The validator provides detailed error messages with paths to help fix issues quickly.
tags: [validation, quality, templates, generation, json, mcp, rendervid]
category: validation
---

# validate_template

Validate a Rendervid template JSON structure.

This tool performs comprehensive validation of a template to ensure it's properly formatted and ready for rendering.

Validation checks include:
- Template structure (name, output, composition)
- Output configuration (type, dimensions, fps, duration)
- Input definitions (keys, types, defaults)
- Scene structure (IDs, frame ranges)
- Layer configuration (types, positions, sizes, props)
- Animation definitions (types, effects, timing, easing)
- Component references and props
- Data consistency (frame ranges, input references)

Returns:
- valid: boolean indicating if template is valid
- errors: array of validation errors (if any)
- warnings: array of validation warnings (if any)

Use this before rendering to catch issues early, or when:
- Creating new templates
- Modifying existing templates
- Debugging template issues
- Verifying AI-generated templates

The validator provides detailed error messages with paths to help fix issues quickly.

## When to Use

Use this tool when you need to:
- Validate template JSON structure before rendering
- Catch errors early in the development process
- Get detailed error messages and suggestions
- Ensure template compatibility

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template` | any |  |  |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "template": {}
  },
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

## Examples


## Related Tools

- [`render_video`](./render_video.md)
- [`render_image`](./render_image.md)
- [`get_capabilities`](./get_capabilities.md)

## Error Handling

This tool provides detailed error messages when:
- Invalid template structure
- Missing required parameters
- Unsupported formats or options
- File system errors

Always check the returned error messages for troubleshooting guidance.

## Best Practices

- Always validate templates before rendering
- Read error messages carefully for quick fixes
- Check warnings for potential issues
- Use validation during development
