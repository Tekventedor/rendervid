# Image Sequence Demo

> A simple template for demonstrating image sequence export.

## Preview

*Run `node examples/render-all.mjs` to generate the preview GIF and MP4.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1280 × 720 |
| **Duration** | 2s |
| **FPS** | 24 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"Image Sequence Export"` | Title |

## Usage

```bash
# Render this example
node examples/render-all.mjs "advanced/image-sequence"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "Image Sequence Export"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
