# Minimalist Brand Reveal

> A clean, Apple-inspired minimalist brand reveal with elegant typography, subtle animations, and refined whitespace. Perfect for luxury brands, design agencies, and premium product launches.

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
| `brandName` | string | `"Lumiere"` | Brand Name *(required)* |
| `tagline` | string | `"Crafted with intention"` | Tagline |
| `website` | string | `"www.lumiere.design"` | Website URL |
| `accentColor` | color | `"#1a1a1a"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "cinematic/brand-reveal"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "brandName": "Lumiere",
    "tagline": "Crafted with intention",
    "website": "www.lumiere.design"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
