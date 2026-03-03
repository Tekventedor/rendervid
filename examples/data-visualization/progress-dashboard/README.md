# Progress Dashboard

> Dashboard with animated progress indicators and KPIs.

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
| `title` | string | `"Q4 Performance"` | Dashboard Title *(required)* |
| `kpi1Label` | string | `"Revenue Target"` | KPI 1 Label |
| `kpi1Value` | string | `"87%"` | KPI 1 Value |
| `kpi2Label` | string | `"Customer Satisfaction"` | KPI 2 Label |
| `kpi2Value` | string | `"94%"` | KPI 2 Value |
| `kpi3Label` | string | `"Team Efficiency"` | KPI 3 Label |
| `kpi3Value` | string | `"78%"` | KPI 3 Value |
| `backgroundColor` | color | `"#0a0a0a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "data-visualization/progress-dashboard"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "Q4 Performance",
    "kpi1Label": "Revenue Target",
    "kpi1Value": "87%"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
