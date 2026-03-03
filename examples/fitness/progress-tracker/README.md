# Progress Tracker

> Weekly or monthly fitness progress visualization.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1080 |
| **Duration** | 8s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `header` | string | `"Weekly Progress"` | Header *(required)* |
| `period` | string | `"Week 4 of 12"` | Period |
| `mainStatValue` | string | `"-8 lbs"` | Main Stat Value *(required)* |
| `mainStatLabel` | string | `"Total Weight Lost"` | Main Stat Label |
| `motivation` | string | `"Keep pushing! You're doing great!"` | Motivation |

## Usage

```bash
# Render this example
node examples/render-all.mjs "fitness/progress-tracker"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "header": "Weekly Progress",
    "period": "Week 4 of 12",
    "mainStatValue": "-8 lbs"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
