# Price Drop

> Real estate price reduction announcement.

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
| `oldPrice` | string | `"Was $950,000"` | Old Price *(required)* |
| `newPrice` | string | `"$875,000"` | New Price *(required)* |
| `savings` | string | `"SAVE $75,000"` | Savings |
| `address` | string | `"1234 Oak Street, Beverly Hills, CA"` | Address |
| `propertyImage` | url | `"modern-house.jpg"` | Property Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "real-estate/price-drop"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "oldPrice": "Was $950,000",
    "newPrice": "$875,000",
    "savings": "SAVE $75,000"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
