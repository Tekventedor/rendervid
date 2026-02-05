---
name: get_easing_docs
description: "Get documentation for easing functions (motion curves)."
tags: [mcp, rendervid]
category: utilities
---

# get_easing_docs

Get documentation for easing functions (motion curves).

Easing functions control the speed/acceleration of animations over time.

Categories:
- basic: Simple linear easing
- in: Start slow, end fast (acceleration)
- out: Start fast, end slow (deceleration) - RECOMMENDED for most animations
- inout: Start and end slow, fast in middle
- back: Overshoot and return (anticipation/follow-through)
- bounce: Bouncing effect
- elastic: Springy, elastic effect

Examples:
- get_easing_docs({ category: "out" }) - Most commonly used
- get_easing_docs({ category: "all" }) - List all easings

## When to Use

Use this tool when you need to:

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string |  | Easing category: "basic", "in", "out", "inout", "back", "bounce", "elastic", or "all" |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "description": "Easing category: \"basic\", \"in\", \"out\", \"inout\", \"back\", \"bounce\", \"elastic\", or \"all\""
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

