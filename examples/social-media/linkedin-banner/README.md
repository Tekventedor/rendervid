# LinkedIn Banner

> Professional banner image for LinkedIn company pages and profiles.

## Preview

*Run `node examples/render-all.mjs` to generate the preview image.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1584 × 396 |
| **Output** | Image (PNG) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `companyName` | string | `"Your Company"` | Company Name *(required)* |
| `tagline` | string | `"Building the future of technology"` | Tagline |
| `ctaText` | string | `"We're Hiring!"` | CTA Text |
| `primaryColor` | color | `"#0a66c2"` | Primary Color |
| `backgroundColor` | color | `"#1b1f23"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social-media/linkedin-banner"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "companyName": "Your Company",
    "tagline": "Building the future of technology",
    "ctaText": "We're Hiring!"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
