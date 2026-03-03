# Product Comparison

> Side-by-side feature comparison of two products or plans.

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
| `header` | string | `"Choose What's Right for You"` | Header *(required)* |
| `product1Name` | string | `"Basic Plan"` | Product 1 Name *(required)* |
| `product1Features` | string | `"5 Users • 10GB Storage • Email Support"` | Product 1 Features |
| `product2Name` | string | `"Pro Plan"` | Product 2 Name *(required)* |
| `product2Features` | string | `"Unlimited Users • 100GB • Priority Support"` | Product 2 Features |

## Usage

```bash
# Render this example
node examples/render-all.mjs "ecommerce/product-comparison"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "header": "Choose What's Right for You",
    "product1Name": "Basic Plan",
    "product1Features": "5 Users • 10GB Storage • Email Support"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
