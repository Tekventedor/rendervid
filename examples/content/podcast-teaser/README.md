# Podcast Teaser

> Episode preview with audio waveform visual effect.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1080 |
| **Duration** | 8s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `podcastName` | string | `"TECH TALKS"` | Podcast Name *(required)* |
| `episodeTitle` | string | `"The Future of AI in Marketing"` | Episode Title *(required)* |
| `guestName` | string | `"with Sarah Johnson, CMO at TechCorp"` | Guest Name |
| `cta` | string | `"Listen Now"` | CTA |
| `podcastImage` | url | `"https://www.photomaticai.com/images/processed/ai-generated-images/models_ideogram-v2-turbo_ai-image-generator_abstra_Surreal_Abstract_Film_Dreamscape.webp"` | Podcast Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "content/podcast-teaser"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "podcastName": "TECH TALKS",
    "episodeTitle": "The Future of AI in Marketing",
    "guestName": "with Sarah Johnson, CMO at TechCorp"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
