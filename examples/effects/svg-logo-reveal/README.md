# SVG Logo Reveal

> Animated SVG drawing effect revealing a star logo path by path, perfect for logo reveals and brand animations.

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

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"YOUR BRAND"` | Title Text |
| `strokeColor` | color | `"#ffd700"` | Stroke Color |
| `backgroundColor` | color | `"#1a1a2e"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/svg-logo-reveal"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "YOUR BRAND",
    "strokeColor": "#ffd700",
    "backgroundColor": "#1a1a2e"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
