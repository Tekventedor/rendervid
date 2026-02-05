---
name: get_component_defaults
description: "Get default values, validation schemas, and configuration for custom components."
tags: [templates, mcp, rendervid]
category: utilities
---

# get_component_defaults

Get default values, validation schemas, and configuration for custom components.

This tool shows you:
- Available custom components with pre-configured defaults
- Default values for each component's props
- Validation rules (types, ranges, enums)
- Required vs optional props
- Examples of how to use each component

Use this when:
1. Creating custom component layers in templates
2. Understanding what default values are available
3. Learning validation constraints for props
4. Getting examples of proper component configuration

Available pre-configured components:
- AnimatedLineChart: Animated line charts with gradients
- AuroraBackground: Northern lights/aurora effect
- WaveBackground: Fluid wave animations

Example: get_component_defaults({ componentName: "AnimatedLineChart" })
Or: get_component_defaults({}) to list all components

## When to Use

Use this tool when you need to:

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `componentName` | string |  | Name of a specific custom component to get defaults for (e.g., "AnimatedLineChart"). If not provided, lists all available components. |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "componentName": {
      "type": "string",
      "description": "Name of a specific custom component to get defaults for (e.g., \"AnimatedLineChart\"). If not provided, lists all available components."
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

