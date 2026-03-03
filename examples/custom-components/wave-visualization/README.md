# Audio Wave Visualization

> Beautiful audio wave visualization with multiple frequency bands

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 10s |
| **FPS** | 60 |
| **Output** | Video (MP4) |
| **Custom Components** | AudioWave, CircularSpectrum, PulsingText |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `trackName` | string | `"COSMIC WAVES"` | Track Name |
| `artist` | string | `"Digital Dreams"` | Artist Name |
| `waveColor1` | string | `"#ff00ff"` | Wave Color 1 |
| `waveColor2` | string | `"#00ffff"` | Wave Color 2 |

## Usage

```bash
# Render this example
node examples/render-all.mjs "custom-components/wave-visualization"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "trackName": "COSMIC WAVES",
    "artist": "Digital Dreams",
    "waveColor1": "#ff00ff"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
