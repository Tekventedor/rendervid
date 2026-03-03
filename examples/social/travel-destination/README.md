# Travel Destination Card

> Full HD travel destination showcase with large background image, dark overlay gradient, location details, star ratings, pricing, and a Book Now CTA.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 7s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `destination` | string | `"Santorini"` | Destination Name *(required)* |
| `country` | string | `"Greece, Mediterranean"` | Country / Region |
| `price` | string | `"From $299/night"` | Price |
| `rating` | string | `"4.8"` | Rating (e.g. 4.8) |
| `backgroundImage` | url | `"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&h=1080&fit=crop"` | Destination Photo |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social/travel-destination"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "destination": "Santorini",
    "country": "Greece, Mediterranean",
    "price": "From $299/night"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
