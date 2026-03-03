# Hello World

> The simplest Rendervid template - animated text on a colored background.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 3s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `message` | string | `"Hello, World!"` | Message *(required)* |
| `backgroundColor` | color | `"#1a1a2e"` | Background Color |
| `textColor` | color | `"#ffffff"` | Text Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "getting-started/01-hello-world"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "message": "Hello, World!",
    "backgroundColor": "#1a1a2e",
    "textColor": "#ffffff"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
