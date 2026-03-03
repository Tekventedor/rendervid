# Course Intro

> Professional course introduction featuring course title and instructor.

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
| `courseTitle` | string | `"Complete Python Masterclass"` | Course Title *(required)* |
| `description` | string | `"From beginner to advanced with real-world projects"` | Description |
| `instructorName` | string | `"Dr. Alex Thompson"` | Instructor Name |
| `duration` | string | `"12 hours"` | Duration |

## Usage

```bash
# Render this example
node examples/render-all.mjs "education/course-intro"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "courseTitle": "Complete Python Masterclass",
    "description": "From beginner to advanced with real-world projects",
    "instructorName": "Dr. Alex Thompson"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
