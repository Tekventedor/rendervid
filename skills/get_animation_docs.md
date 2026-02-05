---
name: get_animation_docs
description: "Get detailed documentation for Rendervid animation effects."
tags: [mcp, rendervid]
category: utilities
---

# get_animation_docs

Get detailed documentation for Rendervid animation effects.

Use this when you need to know what animation effects are available and how to use them.

Parameters:
- animationType: "entrance", "exit", "emphasis", or "all" (default: "all")
- effect: Get detailed docs for a specific effect (optional)

Examples:
- get_animation_docs({ animationType: "entrance" })
- get_animation_docs({ effect: "fadeIn" })
- get_animation_docs({}) - lists all animations

## When to Use

Use this tool when you need to:

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `animationType` | string |  | Animation type: "entrance", "exit", "emphasis", or "all" |
| `effect` | string |  | Specific animation effect name (optional) |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "animationType": {
      "type": "string",
      "description": "Animation type: \"entrance\", \"exit\", \"emphasis\", or \"all\""
    },
    "effect": {
      "type": "string",
      "description": "Specific animation effect name (optional)"
    }
  },
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

