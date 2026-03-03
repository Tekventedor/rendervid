# Glitch Title

> Cyberpunk-style title card with dramatic RGB split and scramble glitch effects. Perfect for tech content, gaming videos, or edgy introductions.

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
| **Custom Components** | GlitchText |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"SYSTEM BREACH"` | Main Title *(required)* |
| `subtitle` | string | `"Access Granted"` | Subtitle |
| `accentColor` | color | `"#00ff00"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/glitch-title"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "SYSTEM BREACH",
    "subtitle": "Access Granted",
    "accentColor": "#00ff00"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
