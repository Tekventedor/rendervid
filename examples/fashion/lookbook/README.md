# Fashion Lookbook

> Elegant high-fashion editorial lookbook with three scenes: hero reveal, collection details, and shop CTA. Minimal design with serif typography and gold accents.

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
| `collectionName` | string | `"ETHEREAL"` | Collection Name *(required)* |
| `season` | string | `"AUTUMN / WINTER"` | Season *(required)* |
| `year` | string | `"2026"` | Year *(required)* |
| `designerName` | string | `"CLAIRE FONTAINE"` | Designer Name *(required)* |
| `description` | string | `"A meditation on texture and form. Flowing silhouettes meet structured tailoring in a palette inspired by autumn's quiet elegance."` | Collection Description |
| `heroImage` | url | `"hero.jpg"` | Hero Image |
| `detailImage` | url | `"detail.jpg"` | Detail Image |
| `website` | string | `"www.maisoneclat.com"` | Website URL |

## Usage

```bash
# Render this example
node examples/render-all.mjs "fashion/lookbook"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "collectionName": "ETHEREAL",
    "season": "AUTUMN / WINTER",
    "year": "2026"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
