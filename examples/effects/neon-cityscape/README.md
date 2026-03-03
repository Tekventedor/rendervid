# Neon Cityscape

> A stylized cyberpunk cityscape built entirely from shapes, featuring neon-lit building silhouettes, animated rain, twinkling stars, and a glowing title. Synthwave/retrowave aesthetic with vivid pink, cyan, and purple neon accents.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 8s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"NIGHT CITY"` | Main Title *(required)* |
| `subtitle` | string | `"Welcome to the future"` | Subtitle |
| `neonColor1` | color | `"#ff00ff"` | Neon Color 1 |
| `neonColor2` | color | `"#00ffff"` | Neon Color 2 |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/neon-cityscape"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "NIGHT CITY",
    "subtitle": "Welcome to the future",
    "neonColor1": "#ff00ff"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
