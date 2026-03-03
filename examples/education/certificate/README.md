# Certificate

> Achievement certificate for course completion or awards.

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
| `certificateType` | string | `"of Completion"` | Certificate Type |
| `recipientName` | string | `"John Smith"` | Recipient Name *(required)* |
| `achievement` | string | `"for successfully completing the Advanced Web Development Course"` | Achievement *(required)* |
| `date` | string | `"January 15, 2024"` | Date |

## Usage

```bash
# Render this example
node examples/render-all.mjs "education/certificate"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "certificateType": "of Completion",
    "recipientName": "John Smith",
    "achievement": "for successfully completing the Advanced Web Development Course"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
