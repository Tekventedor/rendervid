# Conference Intro

> Professional speaker introduction card for conferences, panels, and presentations.

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
| `conferenceName` | string | `"TECH SUMMIT 2024"` | Conference Name |
| `speakerName` | string | `"Michael Roberts"` | Speaker Name *(required)* |
| `speakerTitle` | string | `"Chief Technology Officer"` | Speaker Title *(required)* |
| `company` | string | `"Innovate Labs"` | Company |
| `sessionTitle` | string | `"The Future of Cloud Architecture"` | Session Title |
| `speakerImage` | url | `"conference.jpg"` | Speaker/Conference Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "events/conference-intro"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "conferenceName": "TECH SUMMIT 2024",
    "speakerName": "Michael Roberts",
    "speakerTitle": "Chief Technology Officer"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
