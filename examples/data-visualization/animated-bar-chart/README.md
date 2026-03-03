# Animated Bar Chart

> Animated horizontal bar chart with staggered bar reveals.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"Market Share 2024"` | Chart Title *(required)* |
| `label1` | string | `"Product A"` | Label 1 |
| `value1` | number | `45` | Value 1 (%) |
| `label2` | string | `"Product B"` | Label 2 |
| `value2` | number | `30` | Value 2 (%) |
| `label3` | string | `"Product C"` | Label 3 |
| `value3` | number | `25` | Value 3 (%) |
| `primaryColor` | color | `"#3b82f6"` | Primary Color |
| `backgroundColor` | color | `"#0f172a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "data-visualization/animated-bar-chart"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "Market Share 2024",
    "label1": "Product A",
    "value1": 45
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
