# Event Countdown

> Countdown timer display for upcoming events, launches, or announcements.

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
| `eventTitle` | string | `"BIG SALE EVENT"` | Event Title *(required)* |
| `days` | string | `"07"` | Days *(required)* |
| `hours` | string | `"12"` | Hours *(required)* |
| `minutes` | string | `"30"` | Minutes *(required)* |

## Usage

```bash
# Render this example
node examples/render-all.mjs "events/event-countdown"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "eventTitle": "BIG SALE EVENT",
    "days": "07",
    "hours": "12"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
