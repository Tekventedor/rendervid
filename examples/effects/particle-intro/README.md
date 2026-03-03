# Particle Intro Animation

> Particle-based intro animation with aurora background, floating particles with connections, and title text appearing through particles.

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
| **Custom Components** | aurora-background, particle-system |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"WELCOME"` | Title Text *(required)* |
| `subtitle` | string | `"To the Future"` | Subtitle Text |
| `particleColor` | color | `"#ffffff"` | Particle Color |
| `particleCount` | number | `80` | Particle Count |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/particle-intro"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "WELCOME",
    "subtitle": "To the Future",
    "particleColor": "#ffffff"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
