# Audio Mixing & Effects Pipeline

Rendervid includes a full audio mixing and effects pipeline that converts high-level audio effect configurations into FFmpeg filter graphs for processing during video rendering.

## Overview

The audio pipeline supports:

- **Multi-track mixing** - Combine multiple audio sources (music, voiceover, sound effects)
- **Per-track effects** - Apply EQ, compression, reverb, delay, filters to individual tracks
- **Master bus processing** - Apply effects to the final mixed output
- **Volume automation** - Animate volume over time with keyframe envelopes
- **Stereo panning** - Position tracks in the stereo field
- **Fade in/out** - Smooth transitions at track boundaries

## Audio Effects

### Equalizer (EQ)

Parametric EQ with support for lowshelf, highshelf, and peaking band types.

```typescript
const eq: EQEffect = {
  type: 'eq',
  bands: [
    { frequency: 100, gain: 3, Q: 0.7, type: 'lowshelf' },
    { frequency: 2000, gain: -2, Q: 1.4, type: 'peaking' },
    { frequency: 8000, gain: 4, Q: 0.7, type: 'highshelf' },
  ],
};
```

### Compressor

Dynamic range compressor for controlling volume peaks.

```typescript
const compressor: CompressorEffect = {
  type: 'compressor',
  threshold: -20,  // dB
  ratio: 4,        // 4:1 compression
  attack: 5,       // ms
  release: 100,    // ms
  knee: 6,         // dB
};
```

### Reverb

Room reverb simulation using echo processing.

```typescript
const reverb: ReverbEffect = {
  type: 'reverb',
  roomSize: 0.7,   // 0-1
  damping: 0.5,    // 0-1
  wetDry: 0.3,     // 0 = dry, 1 = wet
};
```

### Delay

Echo/delay effect.

```typescript
const delay: DelayEffect = {
  type: 'delay',
  time: 250,       // ms
  feedback: 0.4,   // 0-1
  wetDry: 0.3,     // 0 = dry, 1 = wet
};
```

### Gain

Volume adjustment.

```typescript
const gain: GainEffect = {
  type: 'gain',
  value: 0.8,  // 1.0 = unity
};
```

### Low-Pass Filter

Removes frequencies above the cutoff.

```typescript
const lowpass: LowPassFilter = {
  type: 'lowpass',
  frequency: 2000,  // Hz
  Q: 0.707,
};
```

### High-Pass Filter

Removes frequencies below the cutoff.

```typescript
const highpass: HighPassFilter = {
  type: 'highpass',
  frequency: 80,  // Hz
  Q: 0.707,
};
```

## Audio Mixer Configuration

The `AudioMixerConfig` defines the complete audio setup for a render:

```typescript
import type { AudioMixerConfig } from '@rendervid/core';

const mixerConfig: AudioMixerConfig = {
  tracks: [
    {
      src: './assets/background-music.mp3',
      volume: 0.5,
      pan: 0,          // center
      effects: [
        { type: 'eq', bands: [{ frequency: 80, gain: 2, Q: 0.7, type: 'lowshelf' }] },
      ],
      startTime: 0,
      fadeIn: 2,        // seconds
      fadeOut: 3,        // seconds
    },
    {
      src: './assets/voiceover.wav',
      volume: 1.0,
      pan: 0,
      effects: [
        { type: 'highpass', frequency: 80, Q: 0.707 },
        { type: 'compressor', threshold: -18, ratio: 3, attack: 5, release: 150, knee: 4 },
      ],
      startTime: 2,
      endTime: 58,
    },
    {
      src: './assets/whoosh.wav',
      volume: 0.4,
      pan: 0.7,         // panned right
      effects: [],
      startTime: 10,
      endTime: 11,
    },
  ],
  masterVolume: 0.9,
  masterEffects: [
    { type: 'compressor', threshold: -10, ratio: 2, attack: 10, release: 200, knee: 6 },
  ],
};
```

## Volume Envelopes

Automate volume over time using keyframes on an `AudioLayerProps`:

```typescript
const audioLayer = {
  type: 'audio',
  props: {
    src: './music.mp3',
    volume: 1.0,
    volumeEnvelope: [
      { frame: 0, volume: 0 },
      { frame: 30, volume: 1.0, easing: 'easeInOut' },
      { frame: 120, volume: 1.0 },
      { frame: 150, volume: 0, easing: 'easeOut' },
    ],
  },
};
```

## Per-Layer Audio Effects

Audio layers can specify effects directly:

```typescript
const audioLayer = {
  type: 'audio',
  props: {
    src: './voiceover.wav',
    volume: 1.0,
    pan: -0.3,  // slightly left
    effects: [
      { type: 'highpass', frequency: 100, Q: 0.707 },
      { type: 'compressor', threshold: -15, ratio: 3, attack: 5, release: 150, knee: 5 },
    ],
  },
};
```

## FFmpeg Filter Graph Generation

The `buildAudioFilterGraph()` function converts an `AudioMixerConfig` into a valid FFmpeg `filter_complex` string:

```typescript
import { buildAudioFilterGraph } from '@rendervid/renderer-node';

const filterGraph = buildAudioFilterGraph(mixerConfig);
// Produces a filter_complex string like:
// [0:a]volume=0.5,afade=t=in:st=0:d=2,lowshelf=f=80:...[track0];
// [1:a]highpass=f=80:...,acompressor=...[track1];
// [2:a]volume=0.4,pan=stereo|...[track2];
// [track0][track1][track2]amix=inputs=3:duration=longest:dropout_transition=0[mixed];
// [mixed]acompressor=...,volume=0.9[aout]
```

### Effect to FFmpeg Filter Mapping

| Effect       | FFmpeg Filter   |
|-------------|----------------|
| EQ          | `equalizer`, `lowshelf`, `highshelf` |
| Reverb      | `aecho`         |
| Compressor  | `acompressor`   |
| Delay       | `adelay`        |
| Gain        | `volume`        |
| Low-Pass    | `lowpass`       |
| High-Pass   | `highpass`      |

## API Reference

### Types (from `@rendervid/core`)

- `AudioEffect` - Union type of all audio effects
- `EQEffect`, `ReverbEffect`, `CompressorEffect`, `DelayEffect`, `GainEffect`, `LowPassFilter`, `HighPassFilter` - Individual effect types
- `AudioMixerTrack` - Single track in the mixer
- `AudioMixerConfig` - Complete mixer configuration
- `VolumeKeyframe` - Single keyframe for volume automation
- `VolumeEnvelope` - Collection of volume keyframes

### Functions (from `@rendervid/renderer-node`)

- `buildAudioFilterGraph(config)` - Build complete FFmpeg filter_complex string
- `buildTrackFilterChain(track, inputLabel, outputLabel)` - Build filter chain for one track
- `effectsToFFmpegFilters(effects)` - Convert effect array to FFmpeg filter strings
- `volumeEnvelopeToFFmpeg(keyframes, fps)` - Convert volume keyframes to FFmpeg expression
- `eqToFFmpeg(effect)`, `reverbToFFmpeg(effect)`, etc. - Individual converters
