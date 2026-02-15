/**
 * Higher-level noise composition functions.
 *
 * These functions combine base noise functions to create more complex patterns
 * like fractal Brownian motion, turbulence, ridged multifractal, and domain warping.
 */

/**
 * A 2D noise function signature: (seed, x, y) => number in [-1, 1].
 */
export type NoiseFn2D = (seed: string | number, x: number, y: number) => number;

/**
 * Options for fractal noise functions (fbm, turbulence, ridgedNoise).
 */
export interface FractalNoiseOptions {
  /** Number of octaves to layer (default: 6) */
  octaves?: number;
  /** Frequency multiplier per octave (default: 2.0) */
  lacunarity?: number;
  /** Amplitude multiplier per octave (default: 0.5) */
  persistence?: number;
}

/**
 * Fractal Brownian Motion (fBm).
 * Layers multiple octaves of noise with decreasing amplitude and increasing frequency.
 *
 * @param noiseFn - Any 2D noise function with signature (seed, x, y) => number.
 * @param seed - Seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @param options - Fractal noise options.
 * @returns A noise value (range depends on octave count, roughly [-1, 1]).
 */
export function fbm(
  noiseFn: NoiseFn2D,
  seed: string | number,
  x: number,
  y: number,
  options?: FractalNoiseOptions
): number {
  const octaves = options?.octaves ?? 6;
  const lacunarity = options?.lacunarity ?? 2.0;
  const persistence = options?.persistence ?? 0.5;

  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxAmplitude = 0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * noiseFn(seed, x * frequency, y * frequency);
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return value / maxAmplitude;
}

/**
 * Turbulence noise.
 * Like fBm but uses the absolute value of each noise octave, creating sharp creases.
 *
 * @param noiseFn - Any 2D noise function.
 * @param seed - Seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @param options - Fractal noise options.
 * @returns A noise value in [0, 1].
 */
export function turbulence(
  noiseFn: NoiseFn2D,
  seed: string | number,
  x: number,
  y: number,
  options?: FractalNoiseOptions
): number {
  const octaves = options?.octaves ?? 6;
  const lacunarity = options?.lacunarity ?? 2.0;
  const persistence = options?.persistence ?? 0.5;

  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxAmplitude = 0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * Math.abs(noiseFn(seed, x * frequency, y * frequency));
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  // Map from [0, maxAmplitude] to [-1, 1]
  return (value / maxAmplitude) * 2 - 1;
}

/**
 * Ridged multifractal noise.
 * Inverts the absolute value of noise and squares it, creating sharp ridges.
 *
 * @param noiseFn - Any 2D noise function.
 * @param seed - Seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @param options - Fractal noise options.
 * @returns A noise value in [-1, 1].
 */
export function ridgedNoise(
  noiseFn: NoiseFn2D,
  seed: string | number,
  x: number,
  y: number,
  options?: FractalNoiseOptions
): number {
  const octaves = options?.octaves ?? 6;
  const lacunarity = options?.lacunarity ?? 2.0;
  const persistence = options?.persistence ?? 0.5;

  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let weight = 1;
  let maxAmplitude = 0;

  for (let i = 0; i < octaves; i++) {
    let signal = noiseFn(seed, x * frequency, y * frequency);
    signal = 1.0 - Math.abs(signal);
    signal *= signal;
    signal *= weight;
    weight = Math.min(Math.max(signal * 2, 0), 1);

    value += amplitude * signal;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  // Map from [0, maxAmplitude] to [-1, 1]
  return (value / maxAmplitude) * 2 - 1;
}

/**
 * Domain warping.
 * Uses noise to offset the input coordinates before sampling the main noise,
 * creating swirling, distorted patterns.
 *
 * @param noiseFn - Any 2D noise function.
 * @param seed - Seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @param warpAmount - How much to warp the domain (default: 1.0).
 * @returns A noise value in [-1, 1].
 */
export function domainWarp(
  noiseFn: NoiseFn2D,
  seed: string | number,
  x: number,
  y: number,
  warpAmount: number = 1.0
): number {
  // Use offset seeds for the warp noise to avoid correlation
  const seedStr = String(seed);
  const warpX = noiseFn(seedStr + '_wx', x, y) * warpAmount;
  const warpY = noiseFn(seedStr + '_wy', x, y) * warpAmount;

  return noiseFn(seed, x + warpX, y + warpY);
}

/**
 * Animated noise.
 * Convenience function for time-varying noise. Uses the time parameter
 * to offset the noise coordinates, creating smooth animation.
 *
 * @param noiseFn - Any 2D noise function.
 * @param seed - Seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @param time - Time value (e.g., frame / fps).
 * @param speed - Animation speed multiplier (default: 1.0).
 * @returns A noise value in [-1, 1].
 */
export function animatedNoise(
  noiseFn: NoiseFn2D,
  seed: string | number,
  x: number,
  y: number,
  time: number,
  speed: number = 1.0
): number {
  // Shift coordinates based on time to create animation
  const timeOffset = time * speed;
  return noiseFn(
    seed,
    x + Math.sin(timeOffset * 0.7) * 100,
    y + Math.cos(timeOffset * 0.7) * 100
  );
}
