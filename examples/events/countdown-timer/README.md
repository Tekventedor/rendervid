# Event Countdown Timer

> Animated event countdown with flip-style time display, decorative star particles, gradient background, and event details. Uses a custom component for the countdown cards.

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
| **Custom Components** | CountdownDisplay |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `eventName` | string | `"INNOVATION SUMMIT"` | Event Name *(required)* |
| `eventDate` | string | `"MARCH 15, 2026"` | Event Date *(required)* |
| `venue` | string | `"Moscone Center, San Francisco"` | Venue *(required)* |
| `website` | string | `"innovationsummit.io"` | Website |
| `accentColor` | color | `"#a855f7"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "events/countdown-timer"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "eventName": "INNOVATION SUMMIT",
    "eventDate": "MARCH 15, 2026",
    "venue": "Moscone Center, San Francisco"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
