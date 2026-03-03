# Counter Animation

> Animated counting numbers for statistics and metrics.

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
| `title` | string | `"Our Impact"` | Title |
| `stat1Value` | string | `"10M+"` | Stat 1 Value |
| `stat1Label` | string | `"Users"` | Stat 1 Label |
| `stat2Value` | string | `"150+"` | Stat 2 Value |
| `stat2Label` | string | `"Countries"` | Stat 2 Label |
| `stat3Value` | string | `"99.9%"` | Stat 3 Value |
| `stat3Label` | string | `"Uptime"` | Stat 3 Label |
| `primaryColor` | color | `"#06b6d4"` | Primary Color |
| `backgroundColor` | color | `"#0f172a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "data-visualization/counter-animation"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "Our Impact",
    "stat1Value": "10M+",
    "stat1Label": "Users"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
