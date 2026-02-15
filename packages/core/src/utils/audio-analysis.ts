// ─── Types ───────────────────────────────────────────────────────────────────

import type { AudioData } from './audio';

/** A detected beat event */
export interface Beat {
  /** Frame number where the beat occurs */
  frame: number;
  /** Time in seconds */
  time: number;
  /** Beat intensity (0-1 normalized) */
  intensity: number;
}

/** Options for beat detection */
export interface BeatDetectionOptions {
  /** Minimum time between beats in seconds (default 0.3) */
  minInterval?: number;
  /** Energy threshold multiplier above local average to count as beat (default 1.5) */
  threshold?: number;
  /** Window size in seconds for local energy average (default 0.5) */
  windowSize?: number;
  /** Sensitivity 0-1: lower = fewer beats detected (default 0.5) */
  sensitivity?: number;
}

/** Frequency band with name and energy level */
export interface FrequencyBand {
  /** Band name */
  name: string;
  /** Lower frequency bound in Hz */
  minFreq: number;
  /** Upper frequency bound in Hz */
  maxFreq: number;
  /** Energy level (0-1 normalized) */
  energy: number;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

const DEFAULT_FFT_SIZE = 2048;

/**
 * Radix-2 Cooley-Tukey in-place FFT.
 */
function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;

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

function applyHanningWindow(samples: Float64Array): void {
  const n = samples.length;
  for (let i = 0; i < n; i++) {
    samples[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
  }
}

function nextPowerOf2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

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

// ─── Default frequency band definitions ─────────────────────────────────────

const DEFAULT_BANDS: Array<{ name: string; minFreq: number; maxFreq: number }> = [
  { name: 'sub-bass', minFreq: 20, maxFreq: 60 },
  { name: 'bass', minFreq: 60, maxFreq: 250 },
  { name: 'low-mid', minFreq: 250, maxFreq: 500 },
  { name: 'mid', minFreq: 500, maxFreq: 2000 },
  { name: 'high-mid', minFreq: 2000, maxFreq: 4000 },
  { name: 'presence', minFreq: 4000, maxFreq: 6000 },
  { name: 'brilliance', minFreq: 6000, maxFreq: 20000 },
];

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Detect beats in audio data using energy-based onset detection.
 * Returns an array of Beat objects sorted by time.
 *
 * This is a pure/deterministic function suitable for video rendering.
 */
export function detectBeats(
  audioData: AudioData,
  options: BeatDetectionOptions = {}
): Beat[] {
  const {
    minInterval = 0.3,
    threshold = 1.5,
    windowSize = 0.5,
    sensitivity = 0.5,
  } = options;

  const mono = mixToMono(audioData);
  const sampleRate = audioData.sampleRate;

  // Compute energy in small windows (hop size ~10ms)
  const hopSamples = Math.floor(sampleRate * 0.01);
  const frameSamples = Math.floor(sampleRate * 0.02); // 20ms analysis frames
  const numFrames = Math.floor((mono.length - frameSamples) / hopSamples);

  if (numFrames <= 0) return [];

  // Calculate energy for each analysis frame
  const energies = new Float64Array(numFrames);
  for (let i = 0; i < numFrames; i++) {
    const start = i * hopSamples;
    let energy = 0;
    for (let j = 0; j < frameSamples; j++) {
      const idx = start + j;
      if (idx < mono.length) {
        energy += mono[idx] * mono[idx];
      }
    }
    energies[i] = energy / frameSamples;
  }

  // Compute local average energy using a sliding window
  const windowFrames = Math.max(1, Math.floor(windowSize / 0.01));
  const beats: Beat[] = [];
  const minIntervalFrames = Math.floor(minInterval / 0.01);
  let lastBeatFrame = -minIntervalFrames;

  // Adjusted threshold based on sensitivity (higher sensitivity = lower effective threshold)
  const effectiveThreshold = threshold * (1.5 - sensitivity);

  for (let i = 0; i < numFrames; i++) {
    // Calculate local average energy
    const halfWindow = Math.floor(windowFrames / 2);
    const wStart = Math.max(0, i - halfWindow);
    const wEnd = Math.min(numFrames, i + halfWindow);
    let avgEnergy = 0;
    for (let j = wStart; j < wEnd; j++) {
      avgEnergy += energies[j];
    }
    avgEnergy /= (wEnd - wStart);

    // Check if current energy exceeds threshold above local average
    if (
      energies[i] > avgEnergy * effectiveThreshold &&
      (i - lastBeatFrame) >= minIntervalFrames &&
      energies[i] > 0
    ) {
      const time = (i * hopSamples) / sampleRate;
      beats.push({
        frame: 0, // will be set below
        time,
        intensity: 0, // will be normalized below
      });
      lastBeatFrame = i;
    }
  }

  // Normalize intensities
  if (beats.length > 0) {
    // Find corresponding energies for beats and normalize
    let maxEnergy = 0;
    const beatEnergies: number[] = [];
    for (const beat of beats) {
      const frameIdx = Math.floor(beat.time / 0.01);
      const e = frameIdx >= 0 && frameIdx < numFrames ? energies[frameIdx] : 0;
      beatEnergies.push(e);
      if (e > maxEnergy) maxEnergy = e;
    }

    for (let i = 0; i < beats.length; i++) {
      beats[i].intensity = maxEnergy > 0 ? beatEnergies[i] / maxEnergy : 0;
    }
  }

  return beats;
}

/**
 * Get beat intensity at a specific frame.
 * Returns a value 0-1 indicating proximity and intensity of the nearest beat.
 * The intensity decays exponentially from the beat position.
 *
 * @param beats - Array of detected beats
 * @param frame - Current video frame number
 * @param fps - Video frames per second
 * @param decayFrames - Number of frames over which the beat intensity decays (default 8)
 */
export function getBeatAtFrame(
  beats: Beat[],
  frame: number,
  fps: number,
  decayFrames: number = 8
): number {
  if (beats.length === 0) return 0;

  const time = frame / fps;
  let maxIntensity = 0;

  for (const beat of beats) {
    const beatFrame = beat.time * fps;
    const frameDiff = frame - beatFrame;

    // Only consider beats at or before current frame
    if (frameDiff < 0) continue;

    // Exponential decay
    if (frameDiff <= decayFrames) {
      const decay = Math.exp(-3 * (frameDiff / decayFrames));
      const intensity = beat.intensity * decay;
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
      }
    }
  }

  return Math.min(1, maxIntensity);
}

/**
 * Get energy in frequency bands at a specific frame.
 * Uses FFT analysis to decompose the audio into frequency bands.
 *
 * @param audioData - The audio data to analyze
 * @param frame - Current video frame number
 * @param fps - Video frames per second
 * @param bands - Optional custom frequency band definitions
 */
export function getFrequencyBands(
  audioData: AudioData,
  frame: number,
  fps: number,
  bands?: Array<{ name: string; minFreq: number; maxFreq: number }>
): FrequencyBand[] {
  const bandDefs = bands || DEFAULT_BANDS;
  const mono = mixToMono(audioData);
  const startSample = Math.floor((frame / fps) * audioData.sampleRate);
  const windowSize = nextPowerOf2(DEFAULT_FFT_SIZE);

  // Extract windowed samples
  const re = new Float64Array(windowSize);
  const im = new Float64Array(windowSize);

  for (let i = 0; i < windowSize; i++) {
    const idx = startSample + i;
    re[i] = idx >= 0 && idx < mono.length ? mono[idx] : 0;
  }

  applyHanningWindow(re);
  fft(re, im);

  // Compute magnitude spectrum
  const halfSize = windowSize / 2;
  const magnitudes = new Float64Array(halfSize);

  for (let i = 0; i < halfSize; i++) {
    magnitudes[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
  }

  // Frequency resolution: each bin represents (sampleRate / windowSize) Hz
  const freqPerBin = audioData.sampleRate / windowSize;

  // Calculate energy for each band
  const result: FrequencyBand[] = [];
  let maxEnergy = 0;

  for (const band of bandDefs) {
    const minBin = Math.max(0, Math.floor(band.minFreq / freqPerBin));
    const maxBin = Math.min(halfSize - 1, Math.ceil(band.maxFreq / freqPerBin));

    let energy = 0;
    let count = 0;
    for (let i = minBin; i <= maxBin; i++) {
      energy += magnitudes[i];
      count++;
    }
    energy = count > 0 ? energy / count : 0;

    result.push({
      name: band.name,
      minFreq: band.minFreq,
      maxFreq: band.maxFreq,
      energy,
    });

    if (energy > maxEnergy) maxEnergy = energy;
  }

  // Normalize energies to 0-1
  if (maxEnergy > 0) {
    for (const band of result) {
      band.energy /= maxEnergy;
    }
  }

  return result;
}

/**
 * Get smoothed amplitude envelope at a specific frame.
 * Returns a value between 0 and 1 representing the RMS amplitude
 * of the audio at the given frame, smoothed over a window.
 *
 * @param audioData - The audio data to analyze
 * @param frame - Current video frame number
 * @param fps - Video frames per second
 * @param windowSize - Smoothing window size in samples (default: sampleRate / fps, i.e., one frame)
 */
export function getAmplitudeEnvelope(
  audioData: AudioData,
  frame: number,
  fps: number,
  windowSize?: number
): number {
  const mono = mixToMono(audioData);
  const samplesPerFrame = Math.ceil(audioData.sampleRate / fps);
  const effectiveWindow = windowSize ?? samplesPerFrame;
  const centerSample = Math.floor((frame / fps) * audioData.sampleRate);

  const halfWindow = Math.floor(effectiveWindow / 2);
  const start = Math.max(0, centerSample - halfWindow);
  const end = Math.min(mono.length, centerSample + halfWindow);

  if (start >= end) return 0;

  // Compute RMS
  let sumSquares = 0;
  for (let i = start; i < end; i++) {
    sumSquares += mono[i] * mono[i];
  }
  const rms = Math.sqrt(sumSquares / (end - start));

  // Normalize: typical audio RMS is well below 1.0, so we scale up
  // but clamp to 0-1. A factor of ~2 works well for most content.
  return Math.min(1, rms * 2);
}
