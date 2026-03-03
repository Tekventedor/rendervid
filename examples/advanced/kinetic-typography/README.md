# Kinetic Typography

> Dynamic text animations with words appearing, moving, and transforming.

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
| `word1` | string | `"THINK"` | Word 1 *(required)* |
| `word2` | string | `"BIGGER"` | Word 2 (Main) *(required)* |
| `word3` | string | `"CREATE"` | Word 3 *(required)* |
| `word4` | string | `"TOGETHER"` | Word 4 |
| `tagline` | string | `"Innovation starts with imagination"` | Tagline |

## Usage

```bash
# Render this example
node examples/render-all.mjs "advanced/kinetic-typography"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "word1": "THINK",
    "word2": "BIGGER",
    "word3": "CREATE"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
