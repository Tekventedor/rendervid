# Wave Ocean

> Serene ocean wave background with multiple flowing layers in blue and teal. Perfect for beach, summer, and ocean-themed content.

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
| **Custom Components** | WaveBackground |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"ENDLESS SUMMER"` | Main Title *(required)* |
| `subtitle` | string | `"Dive into paradise"` | Subtitle |
| `waveColors` | array | `["#0ea5e9","#06b6d4","#14b8a6"]` | Wave Colors |
| `waveSpeed` | number | `0.3` | Wave Speed |
| `waveCount` | number | `3` | Wave Count |
| `amplitude` | number | `60` | Wave Amplitude |

## Usage

```bash
# Render this example
node examples/render-all.mjs "backgrounds/wave-ocean"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "ENDLESS SUMMER",
    "subtitle": "Dive into paradise",
    "waveColors": [
      "#0ea5e9",
      "#06b6d4",
      "#14b8a6"
    ]
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
