# Blog Promo

> Blog post promotion card with featured image, title, and CTA.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `category` | string | `"MARKETING"` | Category |
| `title` | string | `"10 Strategies to Boost Your Social Media Engagement"` | Blog Title *(required)* |
| `excerpt` | string | `"Discover proven tactics to increase your audience engagement."` | Excerpt |
| `cta` | string | `"Read Article"` | CTA |
| `featuredImage` | url | `"https://www.photomaticai.com/images/ai-generated-images/models_ideogram-v2a_ai-image-generator_sleek-desig_Futuristic_3D_Workspace_Design.webp"` | Featured Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "content/blog-promo"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "category": "MARKETING",
    "title": "10 Strategies to Boost Your Social Media Engagement",
    "excerpt": "Discover proven tactics to increase your audience engagement."
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
