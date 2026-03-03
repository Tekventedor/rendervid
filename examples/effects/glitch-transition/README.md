# Glitch Transition

> Multi-layer text composition with different glitch frequencies and types creating a dynamic, chaotic visual experience.

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
| `line1` | string | `"DIGITAL"` | Line 1 *(required)* |
| `line2` | string | `"CHAOS"` | Line 2 (Main) *(required)* |
| `line3` | string | `"THEORY"` | Line 3 *(required)* |
| `tagline` | string | `"Where order meets disorder"` | Tagline |
| `backgroundColor` | color | `"#0a0a0a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/glitch-transition"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "line1": "DIGITAL",
    "line2": "CHAOS",
    "line3": "THEORY"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
