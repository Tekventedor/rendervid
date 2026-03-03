# Daily Special

> Today's special promotion with limited-time offer messaging.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1920 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `badgeText` | string | `"TODAY ONLY"` | Badge Text |
| `day` | string | `"TUESDAY SPECIAL"` | Day |
| `dishName` | string | `"Gourmet Burger & Fries"` | Dish Name *(required)* |
| `price` | string | `"$14.99"` | Price *(required)* |
| `foodImage` | url | `"food_recept.jpg"` | Food Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "food/daily-special"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "badgeText": "TODAY ONLY",
    "day": "TUESDAY SPECIAL",
    "dishName": "Gourmet Burger & Fries"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
