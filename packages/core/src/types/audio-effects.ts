/**
 * Audio Effects & Mixing Pipeline
 *
 * Types for building audio effect chains, multi-track mixing,
 * and volume automation for video rendering.
 */

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL AUDIO EFFECTS
// ═══════════════════════════════════════════════════════════════

/**
 * EQ band type for parametric equalization.
 */
export interface EQBand {
  /** Center frequency in Hz */
  frequency: number;
  /** Gain in dB (-24 to +24) */
  gain: number;
  /** Quality factor (bandwidth) */
  Q: number;
  /** Filter type */
  type: 'lowshelf' | 'highshelf' | 'peaking';
}

/**
 * Parametric equalizer effect.
 * Maps to FFmpeg `equalizer` filter.
 */
export interface EQEffect {
  type: 'eq';
  /** EQ bands to apply */
  bands: EQBand[];
}

/**
 * Reverb effect using echo simulation.
 * Maps to FFmpeg `aecho` filter.
 */
export interface ReverbEffect {
  type: 'reverb';
  /** Room size (0-1, controls delay time) */
  roomSize: number;
  /** Damping factor (0-1, controls high-frequency absorption) */
  damping: number;
  /** Wet/dry mix (0 = fully dry, 1 = fully wet) */
  wetDry: number;
}

/**
 * Dynamic range compressor effect.
 * Maps to FFmpeg `acompressor` filter.
 */
export interface CompressorEffect {
  type: 'compressor';
  /** Threshold in dB (signal level above which compression begins) */
  threshold: number;
  /** Compression ratio (e.g., 4 means 4:1) */
  ratio: number;
  /** Attack time in milliseconds */
  attack: number;
  /** Release time in milliseconds */
  release: number;
  /** Knee width in dB (soft knee transition range) */
  knee: number;
}

/**
 * Delay effect.
 * Maps to FFmpeg `adelay` filter.
 */
export interface DelayEffect {
  type: 'delay';
  /** Delay time in milliseconds */
  time: number;
  /** Feedback amount (0-1) */
  feedback: number;
  /** Wet/dry mix (0 = fully dry, 1 = fully wet) */
  wetDry: number;
}

/**
 * Gain/volume adjustment effect.
 * Maps to FFmpeg `volume` filter.
 */
export interface GainEffect {
  type: 'gain';
  /** Gain value (1.0 = unity, 0.5 = -6dB, 2.0 = +6dB) */
  value: number;
}

/**
 * Low-pass filter effect.
 * Maps to FFmpeg `lowpass` filter.
 */
export interface LowPassFilter {
  type: 'lowpass';
  /** Cutoff frequency in Hz */
  frequency: number;
  /** Quality factor (resonance) */
  Q: number;
}

/**
 * High-pass filter effect.
 * Maps to FFmpeg `highpass` filter.
 */
export interface HighPassFilter {
  type: 'highpass';
  /** Cutoff frequency in Hz */
  frequency: number;
  /** Quality factor (resonance) */
  Q: number;
}

/**
 * Union type for all supported audio effects.
 */
export type AudioEffect =
  | EQEffect
  | ReverbEffect
  | CompressorEffect
  | DelayEffect
  | GainEffect
  | LowPassFilter
  | HighPassFilter;

// ═══════════════════════════════════════════════════════════════
// VOLUME ENVELOPE / AUTOMATION
// ═══════════════════════════════════════════════════════════════

/**
 * A single keyframe in a volume envelope.
 */
export interface VolumeKeyframe {
  /** Frame number */
  frame: number;
  /** Volume level (0-1) */
  volume: number;
  /** Easing function name (default: 'linear') */
  easing?: string;
}

/**
 * Volume envelope for automating volume over time.
 */
export interface VolumeEnvelope {
  /** Ordered list of volume keyframes */
  keyframes: VolumeKeyframe[];
}

// ═══════════════════════════════════════════════════════════════
// AUDIO MIXER
// ═══════════════════════════════════════════════════════════════

/**
 * A single audio track in the mixer.
 */
export interface AudioMixerTrack {
  /** Audio source file path or URL */
  src: string;
  /** Track volume (0-1, default 1.0) */
  volume: number;
  /** Stereo pan position (-1 = full left, 0 = center, 1 = full right) */
  pan: number;
  /** Audio effects chain applied to this track */
  effects: AudioEffect[];
  /** Start time offset in seconds */
  startTime: number;
  /** End time in seconds (optional, defaults to end of audio) */
  endTime?: number;
  /** Fade in duration in seconds */
  fadeIn?: number;
  /** Fade out duration in seconds */
  fadeOut?: number;
}

/**
 * Configuration for the audio mixer.
 * Defines multiple tracks with effects and a master bus.
 */
export interface AudioMixerConfig {
  /** Audio tracks to mix together */
  tracks: AudioMixerTrack[];
  /** Master output volume (0-1, default 1.0) */
  masterVolume: number;
  /** Effects applied to the mixed master output */
  masterEffects: AudioEffect[];
}
