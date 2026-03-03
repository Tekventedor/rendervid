# Audio Visualization

> Audio-reactive waveform and spectrum visualization with beat detection, frequency analysis, and multiple display styles.

## Preview

*Run `node examples/render-all.mjs` to generate the preview GIF and MP4.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 10s |
| **FPS** | 30 |
| **Output** | Video (MP4) |
| **Custom Components** | WaveformDisplay, SpectrumDisplay |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"AUDIO VISUALIZER"` | Title Text |
| `waveformColor` | string | `"#00ff88"` | Waveform Color |
| `spectrumColor1` | string | `"#ff0066"` | Spectrum Start Color |
| `spectrumColor2` | string | `"#00ccff"` | Spectrum End Color |
| `backgroundColor` | string | `"#0a0a0a"` | Background Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "effects/audio-visualization"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "AUDIO VISUALIZER",
    "waveformColor": "#00ff88",
    "spectrumColor1": "#ff0066"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
