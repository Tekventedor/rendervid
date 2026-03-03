# Progress Ring Example

> Circular progress indicator with percentage display

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
| **Custom Components** | ProgressRing |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `ringColor` | string | `"#3b82f6"` | Ring Color |
| `strokeWidth` | number | `12` | Stroke Width |

## Usage

```bash
# Render this example
node examples/render-all.mjs "custom-components/progress-ring"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "ringColor": "#3b82f6",
    "strokeWidth": 12
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
