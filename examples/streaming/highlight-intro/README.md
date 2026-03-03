# Highlight Intro

> Dynamic intro for gaming highlights and montages.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 5s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `gameTitle` | string | `"APEX LEGENDS"` | Game Title *(required)* |
| `highlightType` | string | `"BEST PLAYS"` | Highlight Type *(required)* |
| `playerName` | string | `"by ProGamer123"` | Player Name |
| `gameImage` | url | `"gaming.jpg"` | Game Image |

## Usage

```bash
# Render this example
node examples/render-all.mjs "streaming/highlight-intro"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "gameTitle": "APEX LEGENDS",
    "highlightType": "BEST PLAYS",
    "playerName": "by ProGamer123"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
