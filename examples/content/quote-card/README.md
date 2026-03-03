# Quote Card

> Eye-catching quote card for sharing inspirational quotes on social media.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1080 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `quote` | string | `"The only way to do great work is to love what you do."` | Quote *(required)* |
| `author` | string | `"- Steve Jobs"` | Author |
| `backgroundColor` | color | `"#7c3aed"` | Background Color |
| `backgroundImage` | url | `"https://www.photomaticai.com/images/processed/styles/foqzv_Abstract_Portrait_for_a_Modern_Art_Gallery.webp"` | Background Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "content/quote-card"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "quote": "The only way to do great work is to love what you do.",
    "author": "- Steve Jobs",
    "backgroundColor": "#7c3aed"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
