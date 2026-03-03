# Instagram Post

> Square video template optimized for Instagram feed posts.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1080 |
| **Duration** | 5s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `headline` | string | `"Did You Know?"` | Headline *(required)* |
| `body` | string | `"This is an interesting fact that your audience will love to learn about."` | Body Text |
| `handle` | string | `"@yourbrand"` | Handle |
| `primaryColor` | color | `"#6366f1"` | Primary Color |
| `backgroundColor` | color | `"#0f172a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social-media/instagram-post"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "headline": "Did You Know?",
    "body": "This is an interesting fact that your audience will love to learn about.",
    "handle": "@yourbrand"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
