# Instagram Story

> Vertical video template optimized for Instagram Stories and Reels.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1920 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `headline` | string | `"New Drop"` | Headline *(required)* |
| `subheadline` | string | `"Limited Edition"` | Subheadline |
| `ctaText` | string | `"Swipe Up"` | Call to Action |
| `primaryColor` | color | `"#ec4899"` | Primary Color |
| `backgroundColor` | color | `"#0f0f0f"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social-media/instagram-story"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "headline": "New Drop",
    "subheadline": "Limited Edition",
    "ctaText": "Swipe Up"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
