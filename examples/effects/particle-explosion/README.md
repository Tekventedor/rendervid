# Particle Explosion Effect

> Dramatic explosion effect with radial particles bursting from the center, followed by text reveal.

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
| **Custom Components** | particle-system |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `message` | string | `"BOOM!"` | Message Text *(required)* |
| `subtitle` | string | `"Make an Impact"` | Subtitle Text |
| `backgroundColor` | color | `"#0a0a0a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/particle-explosion"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "message": "BOOM!",
    "subtitle": "Make an Impact",
    "backgroundColor": "#0a0a0a"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
