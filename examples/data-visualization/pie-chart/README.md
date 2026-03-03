# Pie Chart

> Animated pie chart with segment reveals.

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
| `title` | string | `"Revenue Distribution"` | Chart Title *(required)* |
| `segment1Label` | string | `"Product Sales"` | Segment 1 Label |
| `segment1Value` | string | `"45%"` | Segment 1 Value |
| `segment2Label` | string | `"Services"` | Segment 2 Label |
| `segment2Value` | string | `"35%"` | Segment 2 Value |
| `segment3Label` | string | `"Licensing"` | Segment 3 Label |
| `segment3Value` | string | `"20%"` | Segment 3 Value |
| `backgroundColor` | color | `"#09090b"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "data-visualization/pie-chart"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "Revenue Distribution",
    "segment1Label": "Product Sales",
    "segment1Value": "45%"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
