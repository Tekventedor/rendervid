# Glitch Reveal

> Dramatic reveal effect where text starts heavily glitched and gradually becomes clear through multiple glitch type transitions.

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
| **Custom Components** | GlitchRevealText |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `text` | string | `"TRANSMISSION INCOMING"` | Initial Text *(required)* |
| `finalText` | string | `"MESSAGE DECODED"` | Final Text *(required)* |
| `backgroundColor` | color | `"#000000"` | Background Color |
| `textColor` | color | `"#ffffff"` | Text Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/glitch-reveal"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "text": "TRANSMISSION INCOMING",
    "finalText": "MESSAGE DECODED",
    "backgroundColor": "#000000"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
