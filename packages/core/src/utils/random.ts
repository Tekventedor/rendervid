/**
 * Convert a string seed to a numeric seed using a simple hash.
 */
function hashSeed(seed: string | number): number {
  if (typeof seed === 'number') return seed >>> 0;

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash >>> 0;
}

/**
 * Mulberry32 PRNG — a fast, high-quality 32-bit seeded random number generator.
 * Returns a value in [0, 1).
 */
function mulberry32(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Return a deterministic random number in [0, 1) for a given seed.
 * The same seed always produces the same value.
 *
 * @param seed - A string or number seed.
 * @returns A deterministic value in [0, 1).
 */
export function random(seed: string | number): number {
  return mulberry32(hashSeed(seed));
}

/**
 * Return a deterministic random number in [min, max) for a given seed.
 *
 * @param seed - A string or number seed.
 * @param min - Minimum value (inclusive).
 * @param max - Maximum value (exclusive).
 * @returns A deterministic value in [min, max).
 */
export function randomRange(seed: string | number, min: number, max: number): number {
  return min + random(seed) * (max - min);
}

/**
 * Return a deterministic random integer in [min, max] for a given seed.
 *
 * @param seed - A string or number seed.
 * @param min - Minimum value (inclusive).
 * @param max - Maximum value (inclusive).
 * @returns A deterministic integer in [min, max].
 */
export function randomInt(seed: string | number, min: number, max: number): number {
  return Math.floor(min + random(seed) * (max - min + 1));
}

/**
 * Create a seeded PRNG function that returns a different value on each call.
 * Uses mulberry32 with internal state that advances with each invocation.
 *
 * @param seed - A string or number seed.
 * @returns A function that returns a new random value in [0, 1) on each call.
 */
export function createRandom(seed: string | number): () => number {
  let state = hashSeed(seed);
  return function next(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
