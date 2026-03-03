# Cinematic Title Sequence

> An elegant, film-style title sequence with golden accents, letterbox bars, and slow cinematic animations. Perfect for movie trailers, short films, and premium video intros.

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
| `title` | string | `"THE LAST HORIZON"` | Title *(required)* |
| `subtitle` | string | `"Every ending is a new beginning"` | Subtitle |
| `director` | string | `"JAMES CARTER"` | Director Name |
| `accentColor` | color | `"#d4a574"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "cinematic/title-sequence"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "THE LAST HORIZON",
    "subtitle": "Every ending is a new beginning",
    "director": "JAMES CARTER"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
