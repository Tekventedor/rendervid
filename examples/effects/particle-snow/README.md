# Particle Snow Effect

> Gentle falling snow particles with winter-themed text overlay, perfect for seasonal content.

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
| **Custom Components** | particle-system |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `message` | string | `"Winter Wonderland"` | Message Text *(required)* |
| `subtitle` | string | `"Season's Greetings"` | Subtitle Text |
| `backgroundColor` | color | `"#1a2332"` | Background Color |
| `snowIntensity` | number | `120` | Snow Intensity |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/particle-snow"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "message": "Winter Wonderland",
    "subtitle": "Season's Greetings",
    "backgroundColor": "#1a2332"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
