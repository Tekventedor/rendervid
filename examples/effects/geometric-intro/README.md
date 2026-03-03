# Geometric Pattern Intro

> A mesmerizing intro with scattered geometric shapes that rotate in and float, followed by a bold title reveal. Modern, abstract, tech-conference aesthetic with staggered polygon animations.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 7s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"FUTURE FORWARD"` | Main Title *(required)* |
| `subtitle` | string | `"Design Conference 2025"` | Subtitle |
| `accentColor` | color | `"#6366f1"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/geometric-intro"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "FUTURE FORWARD",
    "subtitle": "Design Conference 2025",
    "accentColor": "#6366f1"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
