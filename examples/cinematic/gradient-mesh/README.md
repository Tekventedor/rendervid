# Gradient Mesh Background

> A mesmerizing animated gradient mesh with overlapping colorful ellipses that float and pulse organically. Features centered text overlay perfect for brand presentations, creative intros, and artistic backgrounds.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 10s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `companyName` | string | `"AURORA STUDIO"` | Company Name *(required)* |
| `tagline` | string | `"Design Beyond Boundaries"` | Tagline |
| `colorPink` | color | `"#ec4899"` | Pink Accent |
| `colorPurple` | color | `"#8b5cf6"` | Purple Accent |
| `colorBlue` | color | `"#3b82f6"` | Blue Accent |
| `colorTeal` | color | `"#14b8a6"` | Teal Accent |

## Usage

```bash
# Render this example
node examples/render-all.mjs "cinematic/gradient-mesh"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "companyName": "AURORA STUDIO",
    "tagline": "Design Beyond Boundaries",
    "colorPink": "#ec4899"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
