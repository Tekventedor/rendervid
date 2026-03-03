# Webinar Promo

> Professional webinar announcement featuring speaker, topic, and date.

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
| `topic` | string | `"Mastering AI for Business Growth"` | Topic *(required)* |
| `description` | string | `"Learn how to leverage AI tools to scale your business"` | Description |
| `speakerName` | string | `"Dr. Sarah Chen"` | Speaker Name |
| `date` | string | `"March 20, 2024"` | Date *(required)* |
| `time` | string | `"2:00 PM EST"` | Time |

## Usage

```bash
# Render this example
node examples/render-all.mjs "events/webinar-promo"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "topic": "Mastering AI for Business Growth",
    "description": "Learn how to leverage AI tools to scale your business",
    "speakerName": "Dr. Sarah Chen"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
