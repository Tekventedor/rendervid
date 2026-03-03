# Twitter Card

> Image optimized for Twitter/X cards and posts.

## Preview

*Run `node examples/render-all.mjs` to generate the preview image.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1200 × 628 |
| **Output** | Image (PNG) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `headline` | string | `"Big News!"` | Headline *(required)* |
| `body` | string | `"We have something exciting to share with you."` | Body |
| `handle` | string | `"@yourbrand"` | Handle |
| `primaryColor` | color | `"#1d9bf0"` | Primary Color |
| `backgroundColor` | color | `"#15202b"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social-media/twitter-card"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "headline": "Big News!",
    "body": "We have something exciting to share with you.",
    "handle": "@yourbrand"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
