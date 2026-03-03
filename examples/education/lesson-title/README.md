# Lesson Title

> Chapter or lesson title card for educational videos.

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

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `lessonNumber` | string | `"03"` | Lesson Number *(required)* |
| `lessonTitle` | string | `"Variables & Data Types"` | Lesson Title *(required)* |
| `duration` | string | `"15 minutes"` | Duration |

## Usage

```bash
# Render this example
node examples/render-all.mjs "education/lesson-title"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "lessonNumber": "03",
    "lessonTitle": "Variables & Data Types",
    "duration": "15 minutes"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
