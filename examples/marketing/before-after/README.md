# Before After Comparison

> Before/after transformation showcase - perfect for fitness, design, or software demos.

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
| `beforeLabel` | string | `"BEFORE"` | Before Label |
| `afterLabel` | string | `"AFTER"` | After Label |
| `headline` | string | `"The Transformation"` | Headline |
| `ctaText` | string | `"Get Started Today"` | CTA Text |
| `beforeColor` | color | `"#71717a"` | Before Color |
| `afterColor` | color | `"#22c55e"` | After Color |
| `backgroundColor` | color | `"#09090b"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "marketing/before-after"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "beforeLabel": "BEFORE",
    "afterLabel": "AFTER",
    "headline": "The Transformation"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
