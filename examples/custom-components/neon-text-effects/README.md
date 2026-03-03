# Neon Text Effects

> Stunning neon text with glow, flicker, and animation effects

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 6s |
| **FPS** | 60 |
| **Output** | Video (MP4) |
| **Custom Components** | NeonText, NeonBorder, ScanLine, ElectricSparks |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `mainText` | string | `"NEON NIGHTS"` | Main Text |
| `subText` | string | `"Custom Component Magic"` | Sub Text |
| `neonColor` | string | `"#ff00ff"` | Neon Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "custom-components/neon-text-effects"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "mainText": "NEON NIGHTS",
    "subText": "Custom Component Magic",
    "neonColor": "#ff00ff"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
