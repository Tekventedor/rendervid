# 3D Rotating Cube

> A 3D rotating cube with customizable colors and rotation speed, showcasing Three.js layer capabilities.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 3840 × 2160 |
| **Duration** | 5s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"3D CUBE"` | Title Text |
| `cubeColor` | color | `"#4c00ff"` | Cube Color |
| `backgroundColor` | color | `"#1a1a2e"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "3d/rotating-cube"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "3D CUBE",
    "cubeColor": "#4c00ff",
    "backgroundColor": "#1a1a2e"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
