# Data Visualization Dashboard

> Animated dashboard with bar chart, line chart, pie chart, and gauge components, showcasing data visualization capabilities.

## Preview

*Run `node examples/render-all.mjs` to generate the preview GIF and MP4.*

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
| `title` | string | `"Analytics Dashboard"` | Dashboard Title |
| `gaugeValue` | number | `78` | Gauge Value (0-100) |
| `backgroundColor` | color | `"#0f172a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/data-visualization"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "Analytics Dashboard",
    "gaugeValue": 78,
    "backgroundColor": "#0f172a"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
