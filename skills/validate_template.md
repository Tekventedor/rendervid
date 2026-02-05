---
name: validate_template
description: "Validate a Rendervid template JSON structure and media URLs before rendering."
tags: [validation, quality, templates, generation, json, mcp, rendervid]
category: validation
---

# validate_template

Validate a Rendervid template JSON structure and media URLs before rendering.

USE FOR:
Pre-render validation (save time), debugging template issues, checking image URL accessibility,
verifying template structure, catching syntax errors early, platform compatibility checks,
avoiding "black video" problems, ensuring media loads correctly

OUTPUT:
- valid: boolean (true/false)
- errorSummary: Quick AI-readable overview of top issues
- errors: Detailed validation errors with paths
- suggestions: Actionable steps to fix issues
- breakdown: Separate structure vs media error counts

WORKFLOW:
1. Create template → 2. validate_template → 3. Fix errors → 4. render_video

⚠️ Template can be object OR string (auto-parsed):
✅ RECOMMENDED: { "template": {"name": "Video"} }
⚠️  ALLOWED: { "template": "{\"name\":\"Video\"}" } (auto-parsed)

This tool performs comprehensive validation:

Validation checks include:
- Template structure (name, output, composition)
- Output configuration (type, dimensions, fps, duration)
- Input definitions (keys, types, defaults)
- Scene structure (IDs, frame ranges)
- Layer configuration (types, positions, sizes, props)
- Animation definitions (types, effects, timing, easing)
- Component references and props
- Data consistency (frame ranges, input references)
- **Media URL validation**:
  - Checks if image/video/audio URLs exist (HTTP HEAD request)
  - Verifies correct content-type (image/* for images, video/* for videos, audio/* for audio)
  - Returns 404, 403, or network errors BEFORE rendering starts
  - Detects invalid paths (/mnt/, /home/claude/, file://)
  - Validates all image, video, and audio layers

**IMPORTANT FOR AI AGENTS:**
Always call validate_template BEFORE calling render_video to catch:
- ❌ Broken image URLs (404, 403 errors)
- ❌ Invalid file paths (Linux paths on macOS: /mnt/, /home/claude/)
- ❌ Browser security violations (file:// URLs)
- ❌ Wrong content types (HTML page instead of image)
- ❌ Network/timeout errors
- ❌ Invalid template structure

Returns:
- valid: boolean indicating if template AND all media URLs are valid
- errorSummary: AI-friendly summary of top errors with actionable fixes
- errors: array of detailed validation errors including media URL failures
- warnings: array of warnings (e.g., local file paths that weren't checked)
- suggestions: specific actions to fix common errors
- breakdown: separate validation results for structure and media

Media validation timeout: 10 seconds per URL
Local file paths (non-http) are skipped with a warning

Use this before rendering to catch issues early, especially when:
- Using external image/video URLs (Unsplash, Pexels, custom URLs)
- Creating templates with user-provided media
- AI-generated templates with dynamic URLs
- Debugging "black video" issues
- Validating before expensive render operations

The validator provides:
1. **Error Summary**: Quick AI-readable overview of issues
2. **Detailed Errors**: Full error context with paths
3. **Suggestions**: Specific actions to resolve each error type
4. **How-To-Fix**: Direct instructions for common mistakes

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
