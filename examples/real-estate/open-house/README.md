# Open House

> Open house announcement with date, time, and address.

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
| `eventDate` | string | `"Saturday, March 15"` | Event Date *(required)* |
| `eventTime` | string | `"1:00 PM - 4:00 PM"` | Event Time *(required)* |
| `address` | string | `"456 Maple Avenue, Santa Monica, CA"` | Address *(required)* |
| `propertyImage` | url | `"house.jpg"` | Property Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "real-estate/open-house"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "eventDate": "Saturday, March 15",
    "eventTime": "1:00 PM - 4:00 PM",
    "address": "456 Maple Avenue, Santa Monica, CA"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
