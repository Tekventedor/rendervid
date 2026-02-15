# Audio Visualization & Analysis

Advanced audio manipulation and visualization tools for creating audio-reactive video content with Rendervid.

## Overview

Rendervid provides two layers of audio functionality:

1. **Audio Analysis** (`@rendervid/core`) - Pure functions for analyzing audio data: beat detection, frequency band extraction, and amplitude envelope computation.
2. **Visualization Components** (`@rendervid/components`) - React components that render audio data as SVG waveforms and frequency spectrums.

All functions are pure and deterministic, making them suitable for frame-by-frame video rendering without relying on the Web Audio API at runtime.

## Audio Analysis

### Beat Detection

Detect beats in audio using energy-based onset detection:

```ts
import { getAudioData, detectBeats, getBeatAtFrame } from '@rendervid/core';

// Create audio data from raw samples
const audioData = getAudioData(samples, 44100);

// Detect beats
const beats = detectBeats(audioData, {
  minInterval: 0.3,    // Minimum 300ms between beats
  threshold: 1.5,       // Energy must be 1.5x local average
  windowSize: 0.5,      // 500ms analysis window
  sensitivity: 0.5,     // 0-1, higher = more beats detected
});

// Get beat intensity at a specific video frame
const intensity = getBeatAtFrame(beats, frame, fps);
// Returns 0-1, with exponential decay after each beat
```

### Frequency Bands

Extract energy levels across frequency bands:

```ts
import { getFrequencyBands } from '@rendervid/core';

const bands = getFrequencyBands(audioData, frame, fps);
// Returns 7 default bands:
// sub-bass (20-60 Hz), bass (60-250 Hz), low-mid (250-500 Hz),
// mid (500-2000 Hz), high-mid (2000-4000 Hz),
// presence (4000-6000 Hz), brilliance (6000-20000 Hz)

// Each band has: { name, minFreq, maxFreq, energy }
// energy is normalized 0-1

// Custom bands:
const customBands = getFrequencyBands(audioData, frame, fps, [
  { name: 'low', minFreq: 20, maxFreq: 500 },
  { name: 'high', minFreq: 500, maxFreq: 20000 },
]);
```

### Amplitude Envelope

Get smoothed amplitude at a specific frame:

```ts
import { getAmplitudeEnvelope } from '@rendervid/core';

const amplitude = getAmplitudeEnvelope(audioData, frame, fps);
// Returns 0-1 RMS amplitude

// With custom smoothing window (in samples):
const smoothed = getAmplitudeEnvelope(audioData, frame, fps, 4096);
```

## Visualization Components

### AudioWaveform

Renders audio waveform as SVG with three styles:

```tsx
import { AudioWaveform } from '@rendervid/components';

// Bars style (default)
<AudioWaveform
  audioData={audioData}
  frame={frame}
  fps={30}
  waveformStyle="bars"
  barWidth={3}
  barGap={1}
  color="#00ff88"
  width={800}
  height={200}
  numberOfSamples={64}
/>

// Line style
<AudioWaveform
  audioData={audioData}
  frame={frame}
  fps={30}
  waveformStyle="line"
  color="#ffffff"
  smoothing={0.5}
  width={800}
  height={200}
/>

// Mirror style (symmetric top/bottom)
<AudioWaveform
  audioData={audioData}
  frame={frame}
  fps={30}
  waveformStyle="mirror"
  color="#ff6600"
  width={800}
  height={200}
/>
```

### AudioSpectrum

Renders frequency spectrum as SVG:

```tsx
import { AudioSpectrum } from '@rendervid/components';

// Bars layout (default)
<AudioSpectrum
  audioData={audioData}
  frame={frame}
  fps={30}
  layout="bars"
  bands={32}
  minFreq={20}
  maxFreq={16000}
  colorMap={['#ff0000', '#ffff00', '#00ff00']}
  width={800}
  height={300}
/>

// Circular layout
<AudioSpectrum
  audioData={audioData}
  frame={frame}
  fps={30}
  layout="circular"
  bands={64}
  colorMap="#00ccff"
  width={400}
  height={400}
/>
```

## Audio-Reactive Animations

Combine analysis functions with any visual element to create audio-reactive content:

```tsx
import { getBeatAtFrame, getFrequencyBands, getAmplitudeEnvelope } from '@rendervid/core';

function AudioReactiveCircle({ audioData, beats, frame, fps }) {
  const beatIntensity = getBeatAtFrame(beats, frame, fps);
  const amplitude = getAmplitudeEnvelope(audioData, frame, fps);
  const bands = getFrequencyBands(audioData, frame, fps);

  const bassEnergy = bands.find(b => b.name === 'bass')?.energy ?? 0;
  const scale = 1 + beatIntensity * 0.5;
  const radius = 50 + bassEnergy * 30;

  return (
    <svg width={200} height={200}>
      <circle
        cx={100}
        cy={100}
        r={radius}
        fill={`rgba(0, 255, 136, ${amplitude})`}
        transform={`scale(${scale})`}
        transform-origin="100 100"
      />
    </svg>
  );
}
```

## API Reference

### Types

```ts
interface Beat {
  frame: number;
  time: number;         // seconds
  intensity: number;    // 0-1
}

interface BeatDetectionOptions {
  minInterval?: number;   // seconds, default 0.3
  threshold?: number;     // default 1.5
  windowSize?: number;    // seconds, default 0.5
  sensitivity?: number;   // 0-1, default 0.5
}

interface FrequencyBand {
  name: string;
  minFreq: number;      // Hz
  maxFreq: number;       // Hz
  energy: number;        // 0-1
}
```

### Functions

| Function | Description |
|----------|-------------|
| `detectBeats(audioData, options?)` | Detect beats using energy-based onset detection |
| `getBeatAtFrame(beats, frame, fps, decayFrames?)` | Get beat intensity at a video frame |
| `getFrequencyBands(audioData, frame, fps, bands?)` | Get energy in frequency bands |
| `getAmplitudeEnvelope(audioData, frame, fps, windowSize?)` | Get smoothed RMS amplitude |

### Components

| Component | Description |
|-----------|-------------|
| `AudioWaveform` | SVG waveform (bars, line, mirror styles) |
| `AudioSpectrum` | SVG frequency spectrum (bars, circular layouts) |
