# 3D Text

> Extruded 3D text with dramatic lighting, metallic material, and cinematic presentation.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 3840 × 2160 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `text` | string | `"RENDERVID"` | 3D Text |
| `textColor` | color | `"#4c00ff"` | Text Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "3d/text-3d"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "text": "RENDERVID",
    "textColor": "#4c00ff"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
