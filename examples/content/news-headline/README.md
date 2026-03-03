# News Headline

> Breaking news style announcement with bold typography.

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
| `badge` | string | `"BREAKING NEWS"` | Badge |
| `headline` | string | `"Major Tech Company Announces Revolutionary AI Platform"` | Headline *(required)* |
| `subheadline` | string | `"Industry experts predict significant impact on global markets"` | Subheadline |
| `source` | string | `"TECH NEWS"` | Source |
| `featuredImage` | url | `"https://www.photomaticai.com/images/processed/ai-generated-images/models_ideogram-v2_ai-image-generator_cinematic-3d_Futuristic_City_Skyline_at_Sunset.webp"` | Featured Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "content/news-headline"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "badge": "BREAKING NEWS",
    "headline": "Major Tech Company Announces Revolutionary AI Platform",
    "subheadline": "Industry experts predict significant impact on global markets"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
