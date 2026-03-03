# TikTok Video

> Vertical video template optimized for TikTok with trendy animations.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1920 |
| **Duration** | 8s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `hookText` | string | `"Wait for it..."` | Hook Text *(required)* |
| `mainText` | string | `"The secret is..."` | Main Text *(required)* |
| `revealText` | string | `"Consistency!"` | Reveal Text *(required)* |
| `handle` | string | `"@yourtiktok"` | Handle |
| `primaryColor` | color | `"#00f2ea"` | Primary Color |
| `secondaryColor` | color | `"#ff0050"` | Secondary Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social-media/tiktok-video"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "hookText": "Wait for it...",
    "mainText": "The secret is...",
    "revealText": "Consistency!"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
