# Product Launch

> Dramatic new product announcement with video background and reveal animation.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 8s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `backgroundVideo` | url | `"https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"` | Background Video |
| `productImage` | url | `"product.jpg"` | Product Image |
| `productName` | string | `"NEXUS PRO"` | Product Name *(required)* |
| `tagline` | string | `"The future of productivity is here"` | Tagline |
| `launchDate` | string | `"Available March 15, 2024"` | Launch Date |

## Usage

```bash
# Render this example
node examples/render-all.mjs "ecommerce/product-launch"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "backgroundVideo": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "productImage": "product.jpg",
    "productName": "NEXUS PRO"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
