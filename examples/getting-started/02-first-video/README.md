# First Video

> A complete 5-second video with title, subtitle, and professional animations.

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
| `title` | string | `"Welcome to Rendervid"` | Title *(required)* |
| `subtitle` | string | `"Create stunning videos programmatically"` | Subtitle |
| `primaryColor` | color | `"#3b82f6"` | Primary Color |
| `backgroundColor` | color | `"#0f172a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "getting-started/02-first-video"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "Welcome to Rendervid",
    "subtitle": "Create stunning videos programmatically",
    "primaryColor": "#3b82f6"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
