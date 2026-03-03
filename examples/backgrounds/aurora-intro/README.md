# Aurora Intro

> Stunning northern lights aurora background with animated title and subtitle. Perfect for elegant introductions and brand presentations.

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
| **Custom Components** | AuroraBackground |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"WELCOME"` | Main Title *(required)* |
| `subtitle` | string | `"Experience the Magic"` | Subtitle |
| `auroraColors` | array | `["#667eea","#764ba2","#f093fb","#4facfe","#00f2fe"]` | Aurora Colors |
| `speed` | number | `0.8` | Aurora Speed |
| `blur` | number | `40` | Blur Amount |
| `opacity` | number | `0.6` | Aurora Opacity |

## Usage

```bash
# Render this example
node examples/render-all.mjs "backgrounds/aurora-intro"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "WELCOME",
    "subtitle": "Experience the Magic",
    "auroraColors": [
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#4facfe",
      "#00f2fe"
    ]
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
