# Matrix Digital Rain

> Iconic Matrix-style digital rain effect with cascading green characters over a dark background. Features a custom animated rain component with centered glowing title text. Perfect for tech, hacker, or sci-fi themed content.

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
| **Custom Components** | MatrixRain |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"ENTER THE SYSTEM"` | Main Title *(required)* |
| `subtitle` | string | `"The Matrix has you..."` | Subtitle |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/matrix-rain"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "ENTER THE SYSTEM",
    "subtitle": "The Matrix has you..."
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
