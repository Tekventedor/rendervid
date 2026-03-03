# MetaBalls Intro

> Fluid metaballs animation with vibrant colors and orbital movement, perfect for modern intros and creative content.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"CREATIVE STUDIO"` | Title Text |
| `subtitle` | string | `"Where Ideas Flow"` | Subtitle Text |
| `primaryColor` | color | `"#ff0080"` | Primary Color |
| `secondaryColor` | color | `"#7928ca"` | Secondary Color |
| `tertiaryColor` | color | `"#4c00ff"` | Tertiary Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/metaballs-intro"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "CREATIVE STUDIO",
    "subtitle": "Where Ideas Flow",
    "primaryColor": "#ff0080"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
