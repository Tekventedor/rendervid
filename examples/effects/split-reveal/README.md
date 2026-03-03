# Split Screen Reveal

> Clean, modern split-screen comparison with a before/after reveal. Scene 1 shows side-by-side images with labels and a sliding divider. Scene 2 transitions to a full reveal with statistics and branding. Ideal for product comparisons, transformations, and case studies.

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
| `title` | string | `"THE TRANSFORMATION"` | Title *(required)* |
| `beforeLabel` | string | `"BEFORE"` | Before Label |
| `afterLabel` | string | `"AFTER"` | After Label |
| `beforeImage` | url | `""` | Before Image URL |
| `afterImage` | url | `""` | After Image URL |
| `stat1` | string | `"+250% Growth"` | Statistic 1 |
| `stat2` | string | `"98% Satisfaction"` | Statistic 2 |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/split-reveal"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "THE TRANSFORMATION",
    "beforeLabel": "BEFORE",
    "afterLabel": "AFTER"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
