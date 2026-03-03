# Typewriter Story

> Elegant story or quote display with gradient background and typewriter effect.

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
| `quote` | string | `"The only way to do great work is to love what you do."` | Quote Text *(required)* |
| `author` | string | `"Steve Jobs"` | Author Name *(required)* |
| `accentColor` | color | `"#8b5cf6"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/typewriter-story"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "quote": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs",
    "accentColor": "#8b5cf6"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
