# YouTube Thumbnail

> Eye-catching thumbnail optimized for YouTube videos.

## Preview

*Run `node examples/render-all.mjs` to generate the preview image.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1280 × 720 |
| **Output** | Image (PNG) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"10 TIPS"` | Title *(required)* |
| `subtitle` | string | `"You Need to Know"` | Subtitle |
| `badge` | string | `"NEW"` | Badge Text |
| `primaryColor` | color | `"#ef4444"` | Primary Color |
| `backgroundColor` | color | `"#18181b"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social-media/youtube-thumbnail"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "10 TIPS",
    "subtitle": "You Need to Know",
    "badge": "NEW"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
