# Image Slideshow

> Create a beautiful slideshow with smooth fade transitions between images.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 12s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `image1` | url | `"https://www.photomaticai.com/images/processed/ai-generated-images/models_flux-dev_ai-image-generator_soft-retro_1970s_Soft_Retro_Living_Room.webp"` | First Image *(required)* |
| `image2` | url | `"https://www.photomaticai.com/images/processed/ai-generated-images/models_ideogram-v3-balanced_ai-image-generator_pen_Whimsical_Pencil_Cityscape.webp"` | Second Image *(required)* |
| `image3` | url | `"https://www.photomaticai.com/images/processed/styles/foqzv_Abstract_Portrait_for_a_Modern_Art_Gallery.webp"` | Third Image *(required)* |

## Usage

```bash
# Render this example
node examples/render-all.mjs "getting-started/04-image-slideshow"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "image1": "https://www.photomaticai.com/images/processed/ai-generated-images/models_flux-dev_ai-image-generator_soft-retro_1970s_Soft_Retro_Living_Room.webp",
    "image2": "https://www.photomaticai.com/images/processed/ai-generated-images/models_ideogram-v3-balanced_ai-image-generator_pen_Whimsical_Pencil_Cityscape.webp",
    "image3": "https://www.photomaticai.com/images/processed/styles/foqzv_Abstract_Portrait_for_a_Modern_Art_Gallery.webp"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
