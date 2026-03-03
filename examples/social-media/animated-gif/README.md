# Animated GIF

> Optimized animated GIF template for social media and web use.

## Preview

*Run `node examples/render-all.mjs` to generate the preview GIF and MP4.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 480 × 480 |
| **Duration** | 3s |
| **FPS** | 15 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `headline` | string | `"Check This Out"` | Headline *(required)* |
| `subtitle` | string | `"Something amazing is happening"` | Subtitle |
| `accentColor` | color | `"#f97316"` | Accent Color |
| `backgroundColor` | color | `"#18181b"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social-media/animated-gif"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "headline": "Check This Out",
    "subtitle": "Something amazing is happening",
    "accentColor": "#f97316"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
