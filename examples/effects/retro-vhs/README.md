# Retro VHS Effect

> Nostalgic VHS/CRT retro look with scan lines, chromatic aberration text, tracking bars, timecode, and authentic video artifacts. Perfect for retro-themed intros, music videos, or throwback content.

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
| `title` | string | `"REWIND"` | Main Title *(required)* |
| `subtitle` | string | `"A Trip Down Memory Lane"` | Subtitle |
| `dateStamp` | string | `"JAN 15 1993"` | Date Stamp |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/retro-vhs"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "REWIND",
    "subtitle": "A Trip Down Memory Lane",
    "dateStamp": "JAN 15 1993"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
