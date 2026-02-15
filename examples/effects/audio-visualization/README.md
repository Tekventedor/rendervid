# Audio Visualization

## Preview

![Preview](preview.gif)

Audio-reactive waveform and spectrum visualization with animated bars, frequency analysis display, and multiple visual styles.

## Features

- **Spectrum Display**: Frequency spectrum bars with gradient coloring from warm to cool tones
- **Waveform Display**: Mirror-style waveform bars showing audio amplitude
- **Animated Visuals**: Smooth sine-wave based animation simulating audio reactivity
- **Background Audio**: Public domain music track (Flight of the Bumblebee)
- **Customizable Colors**: All visualization colors are template inputs

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | string | "AUDIO VISUALIZER" | Main title text |
| `waveformColor` | color | #00ff88 | Color of waveform bars |
| `spectrumColor1` | color | #ff0066 | Spectrum gradient start color |
| `spectrumColor2` | color | #00ccff | Spectrum gradient end color |
| `backgroundColor` | color | #0a0a0a | Background color |

## Audio

The example includes a public domain MP3 file (Flight of the Bumblebee by The US Army Band) in the `assets/` directory. You can replace it with any MP3 or WAV file.

## Technical Details

- **Duration**: 10 seconds (300 frames at 30fps)
- **Resolution**: 1920x1080
- **Custom Components**:
  - `WaveformDisplay` - Mirror-style animated waveform bars (inline SVG)
  - `SpectrumDisplay` - Frequency spectrum bars with color gradient (inline SVG)
- **Audio Layer**: Background music with fade in/out

## Use Cases

- Music video intros
- Podcast visualizations
- DJ/streaming overlays
- Audio brand content
