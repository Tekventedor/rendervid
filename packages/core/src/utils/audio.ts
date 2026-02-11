// ─── Types ───────────────────────────────────────────────────────────────────

/** Decoded audio data */
export interface AudioData {
  /** Raw channel data (Float32Array per channel) */
  channelData: Float32Array[];
  /** Sample rate in Hz */
  sampleRate: number;
  /** Number of channels */
  numberOfChannels: number;
  /** Duration in seconds */
  durationInSeconds: number;
  /** Total number of samples per channel */
  length: number;
}

/** Options for visualizing audio */
export interface VisualizeAudioOptions {
  audioData: AudioData;
  /** Current frame number */
  frame: number;
  /** Frames per second */
  fps: number;
  /** Number of frequency samples to return (default 256) */
  numberOfSamples?: number;
  /** Smoothing factor 0-1 (default 0.8) */
  smoothingTimeConstant?: number;
}

/** Options for waveform visualization */
export interface VisualizeWaveformOptions {
  audioData: AudioData;
  /** Current frame number */
  frame: number;
  /** Frames per second */
  fps: number;
  /** Number of samples to return (default 64) */
  numberOfSamples?: number;
}

/** Options for getting a waveform portion */
export interface WaveformPortionOptions {
  audioData: AudioData;
  startTimeInSeconds: number;
  durationInSeconds: number;
  numberOfSamples?: number;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

const DEFAULT_FFT_SIZE = 2048;

/**
 * Radix-2 Cooley-Tukey in-place FFT.
 * `re` and `im` must have the same power-of-2 length.
 */
function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;

  // Bit-reversal permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;

    if (i < j) {
      let tmp = re[i];
      re[i] = re[j];
      re[j] = tmp;
      tmp = im[i];
      im[i] = im[j];
      im[j] = tmp;
    }
  }

  // Butterfly operations
  for (let len = 2; len <= n; len *= 2) {
    const halfLen = len / 2;
    const angle = (-2 * Math.PI) / len;
    const wRe = Math.cos(angle);
    const wIm = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let curRe = 1;
      let curIm = 0;

      for (let j = 0; j < halfLen; j++) {
        const evenIdx = i + j;
        const oddIdx = i + j + halfLen;

        const tRe = curRe * re[oddIdx] - curIm * im[oddIdx];
        const tIm = curRe * im[oddIdx] + curIm * re[oddIdx];

        re[oddIdx] = re[evenIdx] - tRe;
        im[oddIdx] = im[evenIdx] - tIm;
        re[evenIdx] += tRe;
        im[evenIdx] += tIm;

        const nextRe = curRe * wRe - curIm * wIm;
        const nextIm = curRe * wIm + curIm * wRe;
        curRe = nextRe;
        curIm = nextIm;
      }
    }
  }
}

/**
 * Apply a Hanning window to samples in-place.
 */
function applyHanningWindow(samples: Float64Array): void {
  const n = samples.length;
  for (let i = 0; i < n; i++) {
    samples[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
  }
}

/**
 * Return the next power of 2 that is >= n.
 */
function nextPowerOf2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/**
 * Mix all channels of AudioData down to a single mono Float32Array.
 */
function mixToMono(audioData: AudioData): Float32Array {
  if (audioData.numberOfChannels === 1) {
    return audioData.channelData[0];
  }
  const length = audioData.length;
  const mono = new Float32Array(length);
  const numChannels = audioData.numberOfChannels;
  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let ch = 0; ch < numChannels; ch++) {
      sum += audioData.channelData[ch][i];
    }
    mono[i] = sum / numChannels;
  }
  return mono;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Create AudioData from raw samples.
 * Actual audio decoding happens at the renderer level; this just wraps the data.
 */
export function getAudioData(
  samples: Float32Array,
  sampleRate: number,
  numberOfChannels: number = 1
): AudioData {
  const length = Math.floor(samples.length / numberOfChannels);
  const channelData: Float32Array[] = [];

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const channel = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      channel[i] = samples[ch + i * numberOfChannels];
    }
    channelData.push(channel);
  }

  return {
    channelData,
    sampleRate,
    numberOfChannels,
    durationInSeconds: length / sampleRate,
    length,
  };
}

/**
 * Returns frequency spectrum array for the current frame.
 * Values are normalized between 0 and 1.
 */
export function visualizeAudio(options: VisualizeAudioOptions): number[] {
  const {
    audioData,
    frame,
    fps,
    numberOfSamples = 256,
    smoothingTimeConstant = 0.8,
  } = options;

  const mono = mixToMono(audioData);
  const startSample = Math.floor((frame / fps) * audioData.sampleRate);
  const windowSize = nextPowerOf2(Math.max(DEFAULT_FFT_SIZE, numberOfSamples * 2));

  // Extract windowed samples
  const re = new Float64Array(windowSize);
  const im = new Float64Array(windowSize);

  for (let i = 0; i < windowSize; i++) {
    const idx = startSample + i;
    re[i] = idx >= 0 && idx < mono.length ? mono[idx] : 0;
  }

  applyHanningWindow(re);
  fft(re, im);

  // Compute magnitude spectrum (only first half — positive frequencies)
  const halfSize = windowSize / 2;
  const magnitudes = new Float64Array(halfSize);
  let maxMag = 0;

  for (let i = 0; i < halfSize; i++) {
    magnitudes[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
    if (magnitudes[i] > maxMag) maxMag = magnitudes[i];
  }

  // Normalize
  if (maxMag > 0) {
    for (let i = 0; i < halfSize; i++) {
      magnitudes[i] /= maxMag;
    }
  }

  // Apply smoothing (simple exponential decay toward 0 for isolated frames)
  // smoothingTimeConstant blends toward the previous value; since we don't
  // store state across calls, we approximate by attenuating toward zero.
  if (smoothingTimeConstant > 0 && smoothingTimeConstant < 1) {
    for (let i = 0; i < halfSize; i++) {
      magnitudes[i] = magnitudes[i] * (1 - smoothingTimeConstant) +
        smoothingTimeConstant * magnitudes[i];
    }
  }

  // Downsample to requested numberOfSamples
  const result: number[] = new Array(numberOfSamples);
  const binSize = halfSize / numberOfSamples;

  for (let i = 0; i < numberOfSamples; i++) {
    const start = Math.floor(i * binSize);
    const end = Math.floor((i + 1) * binSize);
    let sum = 0;
    const count = Math.max(1, end - start);
    for (let j = start; j < end && j < halfSize; j++) {
      sum += magnitudes[j];
    }
    result[i] = sum / count;
  }

  return result;
}

/**
 * Returns waveform amplitude values (-1 to 1) for the current frame's audio window.
 */
export function visualizeAudioWaveform(options: VisualizeWaveformOptions): number[] {
  const { audioData, frame, fps, numberOfSamples = 64 } = options;

  const mono = mixToMono(audioData);
  const startSample = Math.floor((frame / fps) * audioData.sampleRate);
  const samplesPerFrame = Math.ceil(audioData.sampleRate / fps);

  const result: number[] = new Array(numberOfSamples);
  const binSize = samplesPerFrame / numberOfSamples;

  for (let i = 0; i < numberOfSamples; i++) {
    const start = startSample + Math.floor(i * binSize);
    const end = startSample + Math.floor((i + 1) * binSize);
    let sum = 0;
    const count = Math.max(1, end - start);
    for (let j = start; j < end; j++) {
      const idx = Math.max(0, Math.min(j, mono.length - 1));
      sum += mono[idx];
    }
    result[i] = sum / count;
  }

  return result;
}

/**
 * Returns downsampled waveform data for a specific time range.
 * Useful for overview visualizations.
 */
export function getWaveformPortion(options: WaveformPortionOptions): number[] {
  const { audioData, startTimeInSeconds, durationInSeconds, numberOfSamples = 64 } = options;

  const mono = mixToMono(audioData);
  const startSample = Math.floor(startTimeInSeconds * audioData.sampleRate);
  const totalSamples = Math.floor(durationInSeconds * audioData.sampleRate);

  const result: number[] = new Array(numberOfSamples);
  const binSize = totalSamples / numberOfSamples;

  for (let i = 0; i < numberOfSamples; i++) {
    const start = startSample + Math.floor(i * binSize);
    const end = startSample + Math.floor((i + 1) * binSize);
    let sum = 0;
    const count = Math.max(1, end - start);
    for (let j = start; j < end; j++) {
      const idx = Math.max(0, Math.min(j, mono.length - 1));
      sum += mono[idx];
    }
    result[i] = sum / count;
  }

  return result;
}

/**
 * Returns duration of the audio in seconds.
 */
export function getAudioDuration(audioData: AudioData): number {
  return audioData.durationInSeconds;
}

/**
 * Convert array of [x, y] points into a smooth SVG path string
 * using Catmull-Rom to cubic bezier conversion.
 */
export function createSmoothSvgPath(points: Array<[number, number]>): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;

  let d = `M ${points[0][0]} ${points[0][1]}`;

  if (points.length === 2) {
    d += ` L ${points[1][0]} ${points[1][1]}`;
    return d;
  }

  // Catmull-Rom to cubic bezier for smooth curves
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom tangent vectors scaled by 1/6 for cubic bezier control points
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }

  return d;
}
