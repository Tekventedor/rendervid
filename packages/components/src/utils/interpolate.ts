/**
 * Linear interpolation between two values
 */
export function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate progress for a frame within a range
 */
export function getProgress(
  frame: number,
  startFrame: number,
  endFrame: number
): number {
  if (frame <= startFrame) return 0;
  if (frame >= endFrame) return 1;
  return (frame - startFrame) / (endFrame - startFrame);
}

/**
 * Apply easing to a progress value
 */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function easeIn(t: number): number {
  return t * t;
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 2);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function spring(
  t: number,
  stiffness: number = 100,
  damping: number = 10
): number {
  const omega = Math.sqrt(stiffness);
  const zeta = damping / (2 * Math.sqrt(stiffness));

  if (zeta < 1) {
    const omega_d = omega * Math.sqrt(1 - zeta * zeta);
    return (
      1 -
      Math.exp(-zeta * omega * t) *
        (Math.cos(omega_d * t) +
          (zeta * omega / omega_d) * Math.sin(omega_d * t))
    );
  }

  return 1 - (1 + omega * t) * Math.exp(-omega * t);
}

/**
 * Convert frame to time in seconds
 */
export function frameToTime(frame: number, fps: number): number {
  return frame / fps;
}

/**
 * Convert time to frame
 */
export function timeToFrame(time: number, fps: number): number {
  return Math.round(time * fps);
}
