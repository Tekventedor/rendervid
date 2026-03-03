# 3D Sphere Animation

> A wireframe sphere with smooth rotation and futuristic styling, perfect for tech and sci-fi content.

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
| `title` | string | `"FUTURISTIC TECH"` | Title Text |
| `subtitle` | string | `"Next Generation 3D"` | Subtitle Text |
| `sphereColor` | color | `"#00ffff"` | Sphere Color |
| `accentColor` | color | `"#ff00ff"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "3d/sphere-animation"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "FUTURISTIC TECH",
    "subtitle": "Next Generation 3D",
    "sphereColor": "#00ffff"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
