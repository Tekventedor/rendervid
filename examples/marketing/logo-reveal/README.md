# Logo Reveal

> Animated logo reveal with dramatic entrance effects.

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
| `brandName` | string | `"BRAND"` | Brand Name *(required)* |
| `tagline` | string | `"Your tagline here"` | Tagline |
| `style` | string | `"minimal"` | Style |
| `primaryColor` | color | `"#3b82f6"` | Primary Color |
| `backgroundColor` | color | `"#030712"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "marketing/logo-reveal"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "brandName": "BRAND",
    "tagline": "Your tagline here",
    "style": "minimal"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
