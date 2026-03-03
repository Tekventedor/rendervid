# Stream Starting

> Professional 'Starting Soon' screen for live streams.

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
| `statusText` | string | `"STARTING SOON"` | Status Text *(required)* |
| `streamTitle` | string | `"Let's Play: New Game Release"` | Stream Title |
| `socialHandle` | string | `"@YourChannel"` | Social Handle |

## Usage

```bash
# Render this example
node examples/render-all.mjs "streaming/stream-starting"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "statusText": "STARTING SOON",
    "streamTitle": "Let's Play: New Game Release",
    "socialHandle": "@YourChannel"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
