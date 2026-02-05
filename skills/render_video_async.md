---
name: check_render_status
description: "Check the status of an async video render job started with start_render_async."
tags: [video, rendering, mcp, rendervid]
category: rendering
---

# check_render_status

Check the status of an async video render job started with start_render_async.

RETURNS:
- status: "queued" | "rendering" | "completed" | "failed"
- progress: percentage (0-100)
- currentFrame / totalFrames
- eta: estimated time remaining (seconds)
- outputPath: available when completed
- error: available if failed

## When to Use

Use this tool when you need to:

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jobId` | string | ✓ | Job ID returned from start_render_async |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "jobId": {
      "type": "string",
      "description": "Job ID returned from start_render_async"
    }
  },
  "required": [
    "jobId"
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

- Validate templates before rendering to catch errors early
- Use appropriate quality settings for your use case
- Monitor file sizes for web delivery
- Handle errors gracefully in production
