/**
 * Audio Effects to FFmpeg Filter Graph Converter
 *
 * Converts AudioMixerConfig and AudioEffect chains into valid
 * FFmpeg filter_complex strings for audio processing.
 */

import type {
  AudioEffect,
  AudioMixerConfig,
  AudioMixerTrack,
  VolumeKeyframe,
  EQEffect,
  ReverbEffect,
  CompressorEffect,
  DelayEffect,
  GainEffect,
  LowPassFilter,
  HighPassFilter,
} from '@rendervid/core';

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL EFFECT CONVERTERS
// ═══════════════════════════════════════════════════════════════

/**
 * Convert an EQ effect to FFmpeg equalizer filter strings.
 * Each band becomes a separate equalizer filter.
 */
export function eqToFFmpeg(effect: EQEffect): string[] {
  return effect.bands.map((band) => {
    const filterType =
      band.type === 'lowshelf' ? 'lowshelf' :
      band.type === 'highshelf' ? 'highshelf' :
      'equalizer';

    if (filterType === 'equalizer') {
      return `equalizer=f=${band.frequency}:width_type=q:width=${band.Q}:g=${band.gain}`;
    }
    // lowshelf and highshelf use different parameter names
    return `${filterType}=f=${band.frequency}:width_type=q:width=${band.Q}:g=${band.gain}`;
  });
}

/**
 * Convert a reverb effect to FFmpeg aecho filter string.
 * Uses aecho to simulate room reverb.
 */
export function reverbToFFmpeg(effect: ReverbEffect): string {
  // Map roomSize (0-1) to delay in ms (20-500ms)
  const delayMs = Math.round(20 + effect.roomSize * 480);
  // Map damping (0-1) to decay factor (0-1, inverted: higher damping = lower decay)
  const decay = Math.max(0, Math.min(1, 1 - effect.damping)) * 0.9;
  // wetDry controls the input/output gain balance
  const inGain = 1 - effect.wetDry * 0.5;
  const outGain = effect.wetDry * 0.8 + 0.2;

  return `aecho=${inGain.toFixed(2)}:${outGain.toFixed(2)}:${delayMs}:${decay.toFixed(2)}`;
}

/**
 * Convert a compressor effect to FFmpeg acompressor filter string.
 */
export function compressorToFFmpeg(effect: CompressorEffect): string {
  const threshold = effect.threshold;
  const ratio = effect.ratio;
  // FFmpeg acompressor uses seconds for attack/release
  const attack = effect.attack / 1000;
  const release = effect.release / 1000;
  const knee = effect.knee;

  return `acompressor=threshold=${threshold}dB:ratio=${ratio}:attack=${attack}:release=${release}:knee=${knee}dB`;
}

/**
 * Convert a delay effect to FFmpeg adelay filter string.
 */
export function delayToFFmpeg(effect: DelayEffect): string {
  // adelay takes delay in ms per channel
  // Apply to all channels equally
  const delayMs = Math.round(effect.time);
  return `adelay=${delayMs}|${delayMs}`;
}

/**
 * Convert a gain effect to FFmpeg volume filter string.
 */
export function gainToFFmpeg(effect: GainEffect): string {
  return `volume=${effect.value}`;
}

/**
 * Convert a low-pass filter to FFmpeg lowpass filter string.
 */
export function lowpassToFFmpeg(effect: LowPassFilter): string {
  return `lowpass=f=${effect.frequency}:width_type=q:width=${effect.Q}`;
}

/**
 * Convert a high-pass filter to FFmpeg highpass filter string.
 */
export function highpassToFFmpeg(effect: HighPassFilter): string {
  return `highpass=f=${effect.frequency}:width_type=q:width=${effect.Q}`;
}

// ═══════════════════════════════════════════════════════════════
// EFFECT CHAIN CONVERTER
// ═══════════════════════════════════════════════════════════════

/**
 * Convert an array of AudioEffect objects to FFmpeg filter strings.
 */
export function effectsToFFmpegFilters(effects: AudioEffect[]): string[] {
  const filters: string[] = [];

  for (const effect of effects) {
    switch (effect.type) {
      case 'eq':
        filters.push(...eqToFFmpeg(effect));
        break;
      case 'reverb':
        filters.push(reverbToFFmpeg(effect));
        break;
      case 'compressor':
        filters.push(compressorToFFmpeg(effect));
        break;
      case 'delay':
        filters.push(delayToFFmpeg(effect));
        break;
      case 'gain':
        filters.push(gainToFFmpeg(effect));
        break;
      case 'lowpass':
        filters.push(lowpassToFFmpeg(effect));
        break;
      case 'highpass':
        filters.push(highpassToFFmpeg(effect));
        break;
    }
  }

  return filters;
}

// ═══════════════════════════════════════════════════════════════
// VOLUME ENVELOPE CONVERTER
// ═══════════════════════════════════════════════════════════════

/**
 * Convert volume keyframes to an FFmpeg volume filter expression.
 * Uses FFmpeg's `volume` filter with an expression that interpolates
 * between keyframes based on the current presentation timestamp.
 *
 * @param keyframes - Ordered volume keyframes
 * @param fps - Frames per second (to convert frame numbers to seconds)
 * @returns FFmpeg volume filter string with expression
 */
export function volumeEnvelopeToFFmpeg(keyframes: VolumeKeyframe[], fps: number): string {
  if (keyframes.length === 0) {
    return 'volume=1.0';
  }

  if (keyframes.length === 1) {
    return `volume=${keyframes[0].volume}`;
  }

  // Sort keyframes by frame number
  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);

  // Build a piecewise linear expression using FFmpeg's expression evaluator
  // We use 't' (time in seconds) as the variable
  // Expression format: if(lt(t,t1), v0 + (v1-v0)*(t-t0)/(t1-t0), if(...))
  let expr = `${sorted[sorted.length - 1].volume}`;

  for (let i = sorted.length - 2; i >= 0; i--) {
    const t0 = sorted[i].frame / fps;
    const t1 = sorted[i + 1].frame / fps;
    const v0 = sorted[i].volume;
    const v1 = sorted[i + 1].volume;

    // Linear interpolation between keyframes
    const slope = (v1 - v0) / (t1 - t0);
    const interpExpr = `${v0}+${slope.toFixed(6)}*(t-${t0.toFixed(4)})`;

    expr = `if(lt(t,${t1.toFixed(4)}),${interpExpr},${expr})`;
  }

  // Handle time before first keyframe
  const firstTime = sorted[0].frame / fps;
  const firstVol = sorted[0].volume;
  expr = `if(lt(t,${firstTime.toFixed(4)}),${firstVol},${expr})`;

  return `volume='${expr}':eval=frame`;
}

// ═══════════════════════════════════════════════════════════════
// TRACK PROCESSING
// ═══════════════════════════════════════════════════════════════

/**
 * Build filter chain for a single track, including volume, pan, fade, and effects.
 *
 * @param track - The mixer track configuration
 * @param inputLabel - FFmpeg input stream label (e.g., "[0:a]")
 * @param outputLabel - FFmpeg output stream label (e.g., "[track0]")
 * @returns Array of filter chain strings
 */
export function buildTrackFilterChain(
  track: AudioMixerTrack,
  inputLabel: string,
  outputLabel: string
): string {
  const filters: string[] = [];

  // Apply volume
  if (track.volume !== 1.0) {
    filters.push(`volume=${track.volume}`);
  }

  // Apply fade in
  if (track.fadeIn && track.fadeIn > 0) {
    filters.push(`afade=t=in:st=${track.startTime}:d=${track.fadeIn}`);
  }

  // Apply fade out
  if (track.fadeOut && track.fadeOut > 0 && track.endTime) {
    const fadeStart = track.endTime - track.fadeOut;
    filters.push(`afade=t=out:st=${fadeStart}:d=${track.fadeOut}`);
  }

  // Apply pan (-1 to 1 mapped to stereo pan)
  if (track.pan !== 0) {
    // FFmpeg stereopanner: pan left = more signal to left channel, etc.
    const left = Math.min(1, 1 - track.pan);
    const right = Math.min(1, 1 + track.pan);
    filters.push(`pan=stereo|c0=${left.toFixed(2)}*c0|c1=${right.toFixed(2)}*c1`);
  }

  // Apply audio effects chain
  if (track.effects.length > 0) {
    const effectFilters = effectsToFFmpegFilters(track.effects);
    filters.push(...effectFilters);
  }

  // If no filters were added, just pass through
  if (filters.length === 0) {
    filters.push('anull');
  }

  return `${inputLabel}${filters.join(',')}${outputLabel}`;
}

// ═══════════════════════════════════════════════════════════════
// FULL AUDIO FILTER GRAPH BUILDER
// ═══════════════════════════════════════════════════════════════

/**
 * Build a complete FFmpeg filter_complex string from an AudioMixerConfig.
 *
 * The generated filter graph:
 * 1. Processes each track with its effects, volume, pan, and fades
 * 2. Mixes all tracks together using amix
 * 3. Applies master effects to the mixed output
 * 4. Applies master volume
 *
 * @param config - The full audio mixer configuration
 * @returns FFmpeg filter_complex string
 */
export function buildAudioFilterGraph(config: AudioMixerConfig): string {
  const { tracks, masterVolume, masterEffects } = config;

  if (tracks.length === 0) {
    return 'anullsrc=r=44100:cl=stereo';
  }

  const filterChains: string[] = [];

  // Single track case - simpler filter graph
  if (tracks.length === 1) {
    const track = tracks[0];
    const trackFilters: string[] = [];

    // Track volume
    if (track.volume !== 1.0) {
      trackFilters.push(`volume=${track.volume}`);
    }

    // Fade in/out
    if (track.fadeIn && track.fadeIn > 0) {
      trackFilters.push(`afade=t=in:st=${track.startTime}:d=${track.fadeIn}`);
    }
    if (track.fadeOut && track.fadeOut > 0 && track.endTime) {
      const fadeStart = track.endTime - track.fadeOut;
      trackFilters.push(`afade=t=out:st=${fadeStart}:d=${track.fadeOut}`);
    }

    // Pan
    if (track.pan !== 0) {
      const left = Math.min(1, 1 - track.pan);
      const right = Math.min(1, 1 + track.pan);
      trackFilters.push(`pan=stereo|c0=${left.toFixed(2)}*c0|c1=${right.toFixed(2)}*c1`);
    }

    // Track effects
    if (track.effects.length > 0) {
      trackFilters.push(...effectsToFFmpegFilters(track.effects));
    }

    // Master effects
    if (masterEffects.length > 0) {
      trackFilters.push(...effectsToFFmpegFilters(masterEffects));
    }

    // Master volume
    if (masterVolume !== 1.0) {
      trackFilters.push(`volume=${masterVolume}`);
    }

    if (trackFilters.length === 0) {
      return '[0:a]anull[aout]';
    }

    return `[0:a]${trackFilters.join(',')}[aout]`;
  }

  // Multi-track case
  // Step 1: Process each track individually
  for (let i = 0; i < tracks.length; i++) {
    const chain = buildTrackFilterChain(
      tracks[i],
      `[${i}:a]`,
      `[track${i}]`
    );
    filterChains.push(chain);
  }

  // Step 2: Mix all tracks together
  const trackLabels = tracks.map((_, i) => `[track${i}]`).join('');
  const mixFilter = `${trackLabels}amix=inputs=${tracks.length}:duration=longest:dropout_transition=0[mixed]`;
  filterChains.push(mixFilter);

  // Step 3: Apply master effects and volume
  const masterFilters: string[] = [];

  if (masterEffects.length > 0) {
    masterFilters.push(...effectsToFFmpegFilters(masterEffects));
  }

  if (masterVolume !== 1.0) {
    masterFilters.push(`volume=${masterVolume}`);
  }

  if (masterFilters.length > 0) {
    filterChains.push(`[mixed]${masterFilters.join(',')}[aout]`);
  } else {
    // Rename [mixed] to [aout]
    filterChains.push('[mixed]anull[aout]');
  }

  return filterChains.join(';');
}
