# Line Graph

> Animated line graph with trend visualization.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 5s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"Growth Over Time"` | Chart Title *(required)* |
| `subtitle` | string | `"Monthly Active Users"` | Subtitle |
| `metric` | string | `"+127%"` | Key Metric |
| `metricLabel` | string | `"Year over Year"` | Metric Label |
| `primaryColor` | color | `"#10b981"` | Primary Color |
| `backgroundColor` | color | `"#0f172a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "data-visualization/line-graph"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "Growth Over Time",
    "subtitle": "Monthly Active Users",
    "metric": "+127%"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
