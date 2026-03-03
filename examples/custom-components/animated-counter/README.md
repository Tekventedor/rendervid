# Animated Counter Example

> Demonstrates an animated counter with configurable step duration and transition effects between each number change.

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
| **Custom Components** | AnimatedCounter |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `from` | number | `0` | Start Value *(required)* |
| `to` | number | `10` | End Value *(required)* |
| `framesPerStep` | number | `10` | Frames Per Number |
| `transition` | enum | `"slideUp"` | Transition Effect |
| `color` | color | `"#4ecdc4"` | Text Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "custom-components/animated-counter"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "from": 0,
    "to": 10,
    "framesPerStep": 10
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
