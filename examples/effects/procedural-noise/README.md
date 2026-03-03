# Procedural Noise

> Animated procedural noise backgrounds using value noise with fBm layering — organic shifting color patterns.

## Preview

*Run `node examples/render-all.mjs` to generate the preview GIF and MP4.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |
| **Custom Components** | ProceduralNoise |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"PROCEDURAL NOISE"` | Title Text |
| `subtitle` | string | `"Organic Patterns in Motion"` | Subtitle Text |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/procedural-noise"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "PROCEDURAL NOISE",
    "subtitle": "Organic Patterns in Motion"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
