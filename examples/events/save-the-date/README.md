# Save The Date

> Elegant invitation-style announcement for weddings, events, or important dates.

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
| `names` | string | `"Emma & James"` | Names *(required)* |
| `eventType` | string | `"Wedding Celebration"` | Event Type |
| `eventDate` | string | `"September 15, 2024"` | Event Date *(required)* |
| `venue` | string | `"The Grand Ballroom, New York City"` | Venue |

## Usage

```bash
# Render this example
node examples/render-all.mjs "events/save-the-date"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "names": "Emma & James",
    "eventType": "Wedding Celebration",
    "eventDate": "September 15, 2024"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
