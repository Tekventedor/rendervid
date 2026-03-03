# HEVC Encoding Demo

> Demonstrates H.265/HEVC encoding with Rendervid for high-quality, efficient video output.

## Preview

*Run `node examples/render-all.mjs` to generate the preview GIF and MP4.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 4s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"H.265 / HEVC"` | Title *(required)* |
| `subtitle` | string | `"High Efficiency Video Coding"` | Subtitle |

## Usage

```bash
# Render this example
node examples/render-all.mjs "advanced/hevc-encoding"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "H.265 / HEVC",
    "subtitle": "High Efficiency Video Coding"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
