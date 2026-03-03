# Typewriter Effect Example

> Text appearing character by character with cursor

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 8s |
| **FPS** | 30 |
| **Output** | Video (MP4) |
| **Custom Components** | Typewriter |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `text` | string | `"Welcome to Rendervid! Create amazing videos with custom React components."` | Text to Type *(required)* |
| `speed` | number | `8` | Characters per Second |
| `textColor` | string | `"#00ff88"` | Text Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "custom-components/typewriter"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "text": "Welcome to Rendervid! Create amazing videos with custom React components.",
    "speed": 8,
    "textColor": "#00ff88"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
