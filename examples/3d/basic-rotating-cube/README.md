# Basic Rotating Cube

> Simple rotating 3D cube with Three.js layer demonstrating basic geometry, lighting, and auto-rotation.

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
| `cubeColor` | color | `"#ff6b6b"` | Cube Color |
| `backgroundColor` | color | `"#1a1a2e"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "3d/basic-rotating-cube"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "cubeColor": "#ff6b6b",
    "backgroundColor": "#1a1a2e"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
