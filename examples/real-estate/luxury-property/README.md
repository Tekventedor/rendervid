# Luxury Property Listing

> Cinematic luxury real estate listing with hero property image, dark gradient overlays, gold accents, feature cards grid, and agent contact details. Two-scene premium presentation.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 10s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `propertyName` | string | `"The Belmont Estate"` | Property Name *(required)* |
| `location` | string | `"Pacific Palisades, California"` | Location *(required)* |
| `price` | string | `"$4,500,000"` | Price *(required)* |
| `bedrooms` | string | `"5"` | Bedrooms *(required)* |
| `bathrooms` | string | `"4"` | Bathrooms *(required)* |
| `sqft` | string | `"6,200"` | Square Feet *(required)* |
| `agentName` | string | `"Victoria Sterling"` | Agent Name *(required)* |
| `agentPhone` | string | `"+1 (310) 555-0182"` | Agent Phone *(required)* |
| `propertyImage` | url | `"property.jpg"` | Property Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "real-estate/luxury-property"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "propertyName": "The Belmont Estate",
    "location": "Pacific Palisades, California",
    "price": "$4,500,000"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
