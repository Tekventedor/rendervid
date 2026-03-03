# Code Showcase

> Developer-focused code presentation mimicking a VS Code editor with syntax-highlighted code lines, title bar with window controls, file tabs, line numbers, and staggered typewriter-style entrance animations.

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
| `title` | string | `"app.tsx"` | Title / Filename *(required)* |
| `language` | string | `"TypeScript React"` | Language |

## Usage

```bash
# Render this example
node examples/render-all.mjs "tech/code-showcase"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "app.tsx",
    "language": "TypeScript React"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
