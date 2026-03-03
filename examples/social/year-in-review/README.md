# Year in Review Stats

> Two-scene year in review template with an elegant title entrance and a grid of 4 animated stat cards. Modern gradient background with staggered bounce animations.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 10s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `year` | string | `"2024"` | Year *(required)* |
| `companyName` | string | `"Acme Corp"` | Company Name *(required)* |
| `stat1Value` | string | `"1.2M"` | Stat 1 Value |
| `stat1Label` | string | `"Active Users"` | Stat 1 Label |
| `stat2Value` | string | `"$340K"` | Stat 2 Value |
| `stat2Label` | string | `"Revenue"` | Stat 2 Label |
| `stat3Value` | string | `"98%"` | Stat 3 Value |
| `stat3Label` | string | `"Satisfaction"` | Stat 3 Label |
| `stat4Value` | string | `"52"` | Stat 4 Value |
| `stat4Label` | string | `"Countries"` | Stat 4 Label |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social/year-in-review"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "year": "2024",
    "companyName": "Acme Corp",
    "stat1Value": "1.2M"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
