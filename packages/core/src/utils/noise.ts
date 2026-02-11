/**
 * Simplex noise implementation for 2D and 3D.
 *
 * Based on the simplex noise algorithm by Ken Perlin, adapted from
 * public domain / MIT-licensed reference implementations.
 */

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

// Gradient vectors for 2D
const GRAD2: [number, number][] = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
];

// Gradient vectors for 3D
const GRAD3: [number, number, number][] = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

// Skewing and unskewing factors for 2D
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

// Skewing and unskewing factors for 3D
const F3 = 1 / 3;
const G3 = 1 / 6;

// ═══════════════════════════════════════════════════════════════
// PERMUTATION TABLE
// ═══════════════════════════════════════════════════════════════

/**
 * Build a seeded permutation table of size 256, then double it
 * so we can avoid index wrapping.
 */
function buildPermutationTable(seed: number): Uint8Array {
  const perm = new Uint8Array(512);
  const source = new Uint8Array(256);

  for (let i = 0; i < 256; i++) {
    source[i] = i;
  }

  // Fisher-Yates shuffle using a simple seeded PRNG (mulberry32)
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const r = ((t ^ (t >>> 14)) >>> 0) % (i + 1);
    const tmp = source[i];
    source[i] = source[r];
    source[r] = tmp;
  }

  for (let i = 0; i < 256; i++) {
    perm[i] = source[i];
    perm[i + 256] = source[i];
  }

  return perm;
}

/**
 * Convert a string seed to a numeric seed.
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

// Cache permutation tables by seed to avoid re-computing
const permCache = new Map<number, Uint8Array>();

function getPermTable(seed: string | number): Uint8Array {
  const numericSeed = hashSeed(seed);
  let perm = permCache.get(numericSeed);
  if (!perm) {
    perm = buildPermutationTable(numericSeed);
    permCache.set(numericSeed, perm);
  }
  return perm;
}

// ═══════════════════════════════════════════════════════════════
// 2D SIMPLEX NOISE
// ═══════════════════════════════════════════════════════════════

/**
 * 2D simplex noise. Returns a value in [-1, 1].
 * Deterministic: the same seed and coordinates always produce the same result.
 *
 * @param seed - A string or number seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @returns A noise value in [-1, 1].
 */
export function noise2D(seed: string | number, x: number, y: number): number {
  const perm = getPermTable(seed);

  // Skew input space to determine which simplex cell we're in
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);

  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;

  // Determine which simplex we are in
  let i1: number, j1: number;
  if (x0 > y0) {
    i1 = 1;
    j1 = 0;
  } else {
    i1 = 0;
    j1 = 1;
  }

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1.0 + 2.0 * G2;
  const y2 = y0 - 1.0 + 2.0 * G2;

  const ii = i & 255;
  const jj = j & 255;

  // Calculate contributions from three corners
  let n0 = 0, n1 = 0, n2 = 0;

  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    const gi0 = perm[ii + perm[jj]] % 8;
    t0 *= t0;
    n0 = t0 * t0 * (GRAD2[gi0][0] * x0 + GRAD2[gi0][1] * y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    const gi1 = perm[ii + i1 + perm[jj + j1]] % 8;
    t1 *= t1;
    n1 = t1 * t1 * (GRAD2[gi1][0] * x1 + GRAD2[gi1][1] * y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    const gi2 = perm[ii + 1 + perm[jj + 1]] % 8;
    t2 *= t2;
    n2 = t2 * t2 * (GRAD2[gi2][0] * x2 + GRAD2[gi2][1] * y2);
  }

  // Scale to [-1, 1]
  return 70.0 * (n0 + n1 + n2);
}

// ═══════════════════════════════════════════════════════════════
// 3D SIMPLEX NOISE
// ═══════════════════════════════════════════════════════════════

/**
 * 3D simplex noise. Returns a value in [-1, 1].
 * Deterministic: the same seed and coordinates always produce the same result.
 *
 * @param seed - A string or number seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @param z - Z coordinate.
 * @returns A noise value in [-1, 1].
 */
export function noise3D(
  seed: string | number,
  x: number,
  y: number,
  z: number
): number {
  const perm = getPermTable(seed);

  // Skew input space
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);

  const t = (i + j + k) * G3;
  const X0 = i - t;
  const Y0 = j - t;
  const Z0 = k - t;
  const x0 = x - X0;
  const y0 = y - Y0;
  const z0 = z - Z0;

  // Determine which simplex we are in
  let i1: number, j1: number, k1: number;
  let i2: number, j2: number, k2: number;

  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    } else if (x0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
    } else {
      i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
    }
  } else {
    if (y0 < z0) {
      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
    } else if (x0 < z0) {
      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
    } else {
      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    }
  }

  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2.0 * G3;
  const y2 = y0 - j2 + 2.0 * G3;
  const z2 = z0 - k2 + 2.0 * G3;
  const x3 = x0 - 1.0 + 3.0 * G3;
  const y3 = y0 - 1.0 + 3.0 * G3;
  const z3 = z0 - 1.0 + 3.0 * G3;

  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;

  // Calculate contributions from four corners
  let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 >= 0) {
    const gi0 = perm[ii + perm[jj + perm[kk]]] % 12;
    t0 *= t0;
    n0 = t0 * t0 * (GRAD3[gi0][0] * x0 + GRAD3[gi0][1] * y0 + GRAD3[gi0][2] * z0);
  }

  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 >= 0) {
    const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
    t1 *= t1;
    n1 = t1 * t1 * (GRAD3[gi1][0] * x1 + GRAD3[gi1][1] * y1 + GRAD3[gi1][2] * z1);
  }

  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 >= 0) {
    const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
    t2 *= t2;
    n2 = t2 * t2 * (GRAD3[gi2][0] * x2 + GRAD3[gi2][1] * y2 + GRAD3[gi2][2] * z2);
  }

  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 >= 0) {
    const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;
    t3 *= t3;
    n3 = t3 * t3 * (GRAD3[gi3][0] * x3 + GRAD3[gi3][1] * y3 + GRAD3[gi3][2] * z3);
  }

  // Scale to [-1, 1]
  return 32.0 * (n0 + n1 + n2 + n3);
}
