# Sale Announcement

> Flash sale or discount announcement with urgency-driven design.

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
| `discount` | string | `"50% OFF"` | Discount *(required)* |
| `headline` | string | `"FLASH SALE"` | Headline *(required)* |
| `subheadline` | string | `"Limited Time Only"` | Subheadline |
| `ctaText` | string | `"SHOP NOW"` | CTA Text |
| `primaryColor` | color | `"#ef4444"` | Primary Color |
| `backgroundColor` | color | `"#0a0a0a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "marketing/sale-announcement"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "discount": "50% OFF",
    "headline": "FLASH SALE",
    "subheadline": "Limited Time Only"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
