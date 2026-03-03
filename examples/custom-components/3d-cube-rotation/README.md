# 3D Cube Rotation

> Stunning 3D cube rotation with CSS transforms using custom component

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 8s |
| **FPS** | 60 |
| **Output** | Video (MP4) |
| **Custom Components** | RotatingCube, RadialGlow |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `label1` | string | `"FRONT"` | Face 1 Label |
| `label2` | string | `"RIGHT"` | Face 2 Label |
| `label3` | string | `"BACK"` | Face 3 Label |
| `label4` | string | `"LEFT"` | Face 4 Label |
| `label5` | string | `"TOP"` | Face 5 Label |
| `label6` | string | `"BOTTOM"` | Face 6 Label |

## Usage

```bash
# Render this example
node examples/render-all.mjs "custom-components/3d-cube-rotation"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "label1": "FRONT",
    "label2": "RIGHT",
    "label3": "BACK"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
