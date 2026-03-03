# Agency Portfolio Reel

> A dynamic 3-scene agency portfolio reel with bold typography, geometric accents, and staggered animations. Scene 1: Agency intro, Scene 2: Services showcase, Scene 3: Contact CTA. Perfect for digital agencies, design studios, and creative portfolios.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 9s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `agencyName` | string | `"PIXEL FORGE"` | Agency Name *(required)* |
| `tagline` | string | `"We Create Digital Experiences"` | Tagline |
| `email` | string | `"hello@pixelforge.studio"` | Email |
| `website` | string | `"pixelforge.studio"` | Website |
| `accentColor` | color | `"#3b82f6"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "tech/agency-reel"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "agencyName": "PIXEL FORGE",
    "tagline": "We Create Digital Experiences",
    "email": "hello@pixelforge.studio"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
