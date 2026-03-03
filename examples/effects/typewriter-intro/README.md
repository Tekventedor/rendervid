# Typewriter Intro

> Classic terminal-style typewriter intro with retro computer aesthetic and cursor animation.

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
| `line1` | string | `"SYSTEM BOOT SEQUENCE"` | First Line *(required)* |
| `line2` | string | `"INITIALIZING COMPONENTS..."` | Second Line *(required)* |
| `line3` | string | `"WELCOME TO THE MATRIX"` | Third Line *(required)* |
| `cursorColor` | color | `"#00ff00"` | Cursor Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/typewriter-intro"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "line1": "SYSTEM BOOT SEQUENCE",
    "line2": "INITIALIZING COMPONENTS...",
    "line3": "WELCOME TO THE MATRIX"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
