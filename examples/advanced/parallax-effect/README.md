# Parallax Effect

> Multi-layer composition with different animation speeds creating a stunning depth illusion.

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

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"DISCOVER MORE"` | Main Title *(required)* |
| `subtitle` | string | `"Experience the depth of motion"` | Subtitle |
| `ctaText` | string | `"Learn More Today"` | CTA Text |
| `accentColor` | color | `"#e94560"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "advanced/parallax-effect"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "DISCOVER MORE",
    "subtitle": "Experience the depth of motion",
    "ctaText": "Learn More Today"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
