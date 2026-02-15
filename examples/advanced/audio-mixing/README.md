# Audio Mixing Example

## Preview

![Preview](preview.gif)

Demonstrates multi-track audio mixing with effects, volume envelopes, stereo panning, and audio processing chains.

## Features

- **Multi-Track Audio**: Background music, voiceover, and sound effects mixed together
- **Volume Envelopes**: Frame-by-frame volume automation for smooth fades
- **Audio Effects**: EQ, compression, highpass, lowpass, and reverb
- **Stereo Panning**: Position audio sources in the stereo field
- **Master Bus Processing**: Master volume and compressor on the final mix

## Audio Tracks

| Track | File | Volume | Pan | Effects |
|-------|------|--------|-----|---------|
| Background Music | background-music.mp3 | 0.5 | Center | EQ (bass boost, mid cut), Lowpass |
| Voiceover | voiceover.wav | 1.0 | Center | Highpass 80Hz, Compressor |
| Transition SFX | whoosh.wav | 0.4 | Right (0.7) | Reverb |

## Audio Effects Chain

### Background Music
- **EQ**: Low shelf boost at 80Hz (+2dB), Peaking cut at 3kHz (-1dB)
- **Lowpass**: 12kHz cutoff for warmth

### Voiceover
- **Highpass**: 80Hz to remove rumble
- **Compressor**: -18dB threshold, 3:1 ratio, fast attack

### Transition SFX
- **Reverb**: Small room (0.3), moderate damping, 20% wet

### Master Bus
- **Compressor**: -10dB threshold, 2:1 ratio, gentle knee

## Technical Details

- **Duration**: 10 seconds (300 frames at 30fps)
- **Resolution**: 1920x1080
- **Audio Files**: Public domain / synthetically generated samples in `assets/`

## Use Cases

- Understanding audio mixing in video templates
- Reference for audio effect parameters
- Testing multi-track audio rendering
