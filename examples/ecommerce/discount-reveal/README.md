# Discount Reveal

> Animated discount code reveal with suspense and excitement.

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
| `offerLabel` | string | `"EXCLUSIVE OFFER"` | Offer Label |
| `discountValue` | string | `"25% OFF"` | Discount Value *(required)* |
| `discountCode` | string | `"SAVE25"` | Discount Code *(required)* |
| `validity` | string | `"Valid until December 31st"` | Validity |
| `productImage` | url | `"sunglasses.jpg"` | Product Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "ecommerce/discount-reveal"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "offerLabel": "EXCLUSIVE OFFER",
    "discountValue": "25% OFF",
    "discountCode": "SAVE25"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
