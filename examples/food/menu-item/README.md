# Menu Item

> Restaurant dish showcase with price.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1080 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `category` | string | `"SIGNATURE DISH"` | Category |
| `dishName` | string | `"Truffle Risotto"` | Dish Name *(required)* |
| `description` | string | `"Arborio rice, black truffle, parmesan, white wine"` | Description |
| `price` | string | `"$28"` | Price *(required)* |
| `foodImage` | url | `"food_recept.jpg"` | Food Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "food/menu-item"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "category": "SIGNATURE DISH",
    "dishName": "Truffle Risotto",
    "description": "Arborio rice, black truffle, parmesan, white wine"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
