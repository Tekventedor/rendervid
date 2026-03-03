# Property Listing

> Real estate property showcase with key details and price.

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
| `listingType` | string | `"FOR SALE"` | Listing Type |
| `price` | string | `"$875,000"` | Price *(required)* |
| `address` | string | `"1234 Oak Street, Beverly Hills, CA"` | Address *(required)* |
| `details` | string | `"4 Beds • 3 Baths • 2,850 sqft"` | Details |
| `propertyImage` | url | `"property.jpg"` | Property Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "real-estate/property-listing"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "listingType": "FOR SALE",
    "price": "$875,000",
    "address": "1234 Oak Street, Beverly Hills, CA"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
