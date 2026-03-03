# Flash Sale

> High-energy flash sale announcement with countdown timer and urgency messaging.

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
| `discount` | string | `"50%"` | Discount *(required)* |
| `productName` | string | `"ALL ELECTRONICS"` | Product/Category *(required)* |
| `timer` | string | `"02:45:30"` | Timer *(required)* |
| `cta` | string | `"SHOP NOW"` | CTA |
| `productImage` | url | `"watch.jpg"` | Product Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "ecommerce/flash-sale"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "discount": "50%",
    "productName": "ALL ELECTRONICS",
    "timer": "02:45:30"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
