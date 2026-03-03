# Recipe Card

> Recipe introduction card for cooking videos with food image.

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
| `foodImage` | url | `"food_recept.jpg"` | Food Image *(required)* |
| `category` | string | `"ITALIAN CUISINE"` | Category |
| `recipeName` | string | `"Homemade Pasta Carbonara"` | Recipe Name *(required)* |
| `prepTime` | string | `"Prep: 15 min"` | Prep Time |
| `cookTime` | string | `"Cook: 20 min"` | Cook Time |
| `difficulty` | string | `"Easy"` | Difficulty |

## Usage

```bash
# Render this example
node examples/render-all.mjs "food/recipe-card"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "foodImage": "food_recept.jpg",
    "category": "ITALIAN CUISINE",
    "recipeName": "Homemade Pasta Carbonara"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
