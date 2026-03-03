# First Image

> Generate a social media image with text overlay - perfect for thumbnails and posts.

## Preview

*Run `node examples/render-all.mjs` to generate the preview image.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1200 × 630 |
| **Output** | Image (PNG) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `headline` | string | `"Your Amazing Content"` | Headline *(required)* |
| `tagline` | string | `"Click to learn more"` | Tagline |
| `brandName` | string | `"Your Brand"` | Brand Name |
| `primaryColor` | color | `"#8b5cf6"` | Primary Color |
| `backgroundColor` | color | `"#18181b"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "getting-started/03-first-image"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "headline": "Your Amazing Content",
    "tagline": "Click to learn more",
    "brandName": "Your Brand"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
