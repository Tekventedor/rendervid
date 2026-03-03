# Testimonial Video

> Customer testimonial with quote, author info, and star rating.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 7s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `quote` | string | `"This product completely transformed how we work. The results have been incredible!"` | Quote *(required)* |
| `authorName` | string | `"Sarah Johnson"` | Author Name *(required)* |
| `authorTitle` | string | `"CEO, TechCorp Inc."` | Author Title |
| `rating` | number | `5` | Star Rating (1-5) |
| `primaryColor` | color | `"#fbbf24"` | Primary Color |
| `backgroundColor` | color | `"#0c0a09"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "marketing/testimonial-video"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "quote": "This product completely transformed how we work. The results have been incredible!",
    "authorName": "Sarah Johnson",
    "authorTitle": "CEO, TechCorp Inc."
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
