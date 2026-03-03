# Product Showcase

> Feature your product with stunning visuals, key features, and pricing.

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
| `productName` | string | `"Premium Headphones"` | Product Name *(required)* |
| `tagline` | string | `"Experience Pure Sound"` | Tagline |
| `price` | string | `"$299"` | Price |
| `feature1` | string | `"Active Noise Cancellation"` | Feature 1 |
| `feature2` | string | `"40-Hour Battery Life"` | Feature 2 |
| `feature3` | string | `"Premium Materials"` | Feature 3 |
| `primaryColor` | color | `"#8b5cf6"` | Primary Color |
| `backgroundColor` | color | `"#09090b"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "marketing/product-showcase"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "productName": "Premium Headphones",
    "tagline": "Experience Pure Sound",
    "price": "$299"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
