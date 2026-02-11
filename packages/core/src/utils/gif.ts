/**
 * GIF frame metadata and timing utilities.
 *
 * Actual GIF decoding happens at the renderer level; this module provides
 * metadata types and a helper to map video-timeline time to GIF frame indices.
 */

/** A single frame from a GIF. */
export interface GifFrame {
  /** Frame index */
  index: number;
  /** Delay in milliseconds */
  delay: number;
  /** Disposal method (0 = none, 1 = keep, 2 = restore bg, 3 = restore prev) */
  disposal: number;
}

/** Parsed GIF metadata. */
export interface GifMetadata {
  width: number;
  height: number;
  frames: GifFrame[];
  /** Total duration of one loop in milliseconds */
  totalDuration: number;
  /** Number of loops (0 = infinite) */
  loopCount: number;
}

/**
 * Get the GIF frame index for a given video timeline time.
 *
 * Maps video timeline to GIF timeline considering speed and looping.
 * Uses cumulative frame delays to handle variable-delay GIFs correctly.
 *
 * @param metadata - Parsed GIF metadata with frame delays
 * @param timeMs - Current time in the video timeline (milliseconds)
 * @param loop - Whether to loop the GIF (default true)
 * @param speed - Playback speed multiplier (default 1)
 * @returns The GIF frame index to display
 */
export function getGifFrameAtTime(
  metadata: GifMetadata,
  timeMs: number,
  loop = true,
  speed = 1,
): number {
  const { frames, totalDuration } = metadata;
  if (frames.length === 0) return 0;
  if (totalDuration <= 0) return 0;

  // Apply speed multiplier to the elapsed time
  let effectiveTime = timeMs * speed;

  if (loop) {
    // Wrap around for looping
    effectiveTime = effectiveTime % totalDuration;
    if (effectiveTime < 0) effectiveTime += totalDuration;
  } else {
    // Clamp to GIF duration
    effectiveTime = Math.max(0, Math.min(effectiveTime, totalDuration));
  }

  // Walk through frames using cumulative delay
  let cumulative = 0;
  for (let i = 0; i < frames.length; i++) {
    cumulative += frames[i].delay;
    if (effectiveTime < cumulative) {
      return i;
    }
  }

  // Past the end — return last frame
  return frames.length - 1;
}
