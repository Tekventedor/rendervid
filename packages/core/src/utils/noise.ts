/**
 * Noise functions: simplex, Perlin, Worley, and value noise in 2D and 3D.
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

// ═══════════════════════════════════════════════════════════════
// INTERPOLATION HELPERS
// ═══════════════════════════════════════════════════════════════

/** Quintic fade curve: 6t^5 - 15t^4 + 10t^3 */
function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

/** Dot product of a gradient vector (from perm table) with a distance vector in 2D */
function grad2(hash: number, x: number, y: number): number {
  const g = GRAD2[hash % 8];
  return g[0] * x + g[1] * y;
}

/** Dot product of a gradient vector (from perm table) with a distance vector in 3D */
function grad3(hash: number, x: number, y: number, z: number): number {
  const g = GRAD3[hash % 12];
  return g[0] * x + g[1] * y + g[2] * z;
}

// ═══════════════════════════════════════════════════════════════
// 2D PERLIN NOISE
// ═══════════════════════════════════════════════════════════════

/**
 * 2D classic Perlin noise. Returns a value in [-1, 1].
 * Deterministic: the same seed and coordinates always produce the same result.
 *
 * @param seed - A string or number seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @returns A noise value in [-1, 1].
 */
export function perlin2D(seed: string | number, x: number, y: number): number {
  const perm = getPermTable(seed);

  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);

  const ii = xi & 255;
  const jj = yi & 255;

  const aa = perm[ii + perm[jj]];
  const ab = perm[ii + perm[jj + 1]];
  const ba = perm[ii + 1 + perm[jj]];
  const bb = perm[ii + 1 + perm[jj + 1]];

  const x1 = lerp(grad2(aa, xf, yf), grad2(ba, xf - 1, yf), u);
  const x2 = lerp(grad2(ab, xf, yf - 1), grad2(bb, xf - 1, yf - 1), u);

  return lerp(x1, x2, v);
}

// ═══════════════════════════════════════════════════════════════
// 3D PERLIN NOISE
// ═══════════════════════════════════════════════════════════════

/**
 * 3D classic Perlin noise. Returns a value in [-1, 1].
 *
 * @param seed - A string or number seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @param z - Z coordinate.
 * @returns A noise value in [-1, 1].
 */
export function perlin3D(
  seed: string | number,
  x: number,
  y: number,
  z: number
): number {
  const perm = getPermTable(seed);

  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const ii = xi & 255;
  const jj = yi & 255;
  const kk = zi & 255;

  const aaa = perm[ii + perm[jj + perm[kk]]];
  const aab = perm[ii + perm[jj + perm[kk + 1]]];
  const aba = perm[ii + perm[jj + 1 + perm[kk]]];
  const abb = perm[ii + perm[jj + 1 + perm[kk + 1]]];
  const baa = perm[ii + 1 + perm[jj + perm[kk]]];
  const bab = perm[ii + 1 + perm[jj + perm[kk + 1]]];
  const bba = perm[ii + 1 + perm[jj + 1 + perm[kk]]];
  const bbb = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]];

  const x1 = lerp(
    grad3(aaa, xf, yf, zf),
    grad3(baa, xf - 1, yf, zf),
    u
  );
  const x2 = lerp(
    grad3(aba, xf, yf - 1, zf),
    grad3(bba, xf - 1, yf - 1, zf),
    u
  );
  const x3 = lerp(
    grad3(aab, xf, yf, zf - 1),
    grad3(bab, xf - 1, yf, zf - 1),
    u
  );
  const x4 = lerp(
    grad3(abb, xf, yf - 1, zf - 1),
    grad3(bbb, xf - 1, yf - 1, zf - 1),
    u
  );

  const y1 = lerp(x1, x2, v);
  const y2 = lerp(x3, x4, v);

  return lerp(y1, y2, w);
}

// ═══════════════════════════════════════════════════════════════
// SEEDED PRNG FOR WORLEY/VALUE NOISE
// ═══════════════════════════════════════════════════════════════

/** Simple hash function for generating deterministic random values from integer coordinates */
function hash2(perm: Uint8Array, ix: number, iy: number): number {
  return perm[((ix & 255) + perm[iy & 255]) & 511];
}

function hash3(perm: Uint8Array, ix: number, iy: number, iz: number): number {
  return perm[((ix & 255) + perm[((iy & 255) + perm[iz & 255]) & 511]) & 511];
}

/** Convert a hash value to a float in [0, 1) */
function hashToFloat(h: number): number {
  return h / 256;
}

// ═══════════════════════════════════════════════════════════════
// 2D WORLEY (CELLULAR) NOISE
// ═══════════════════════════════════════════════════════════════

/**
 * 2D Worley (cellular) noise. Returns a value in [-1, 1].
 * Returns the distance to the nearest feature point, mapped to [-1, 1].
 *
 * @param seed - A string or number seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @returns A noise value in [-1, 1].
 */
export function worley2D(seed: string | number, x: number, y: number): number {
  const perm = getPermTable(seed);

  const xi = Math.floor(x);
  const yi = Math.floor(y);

  let minDist = Infinity;

  // Check surrounding 3x3 grid of cells
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const cx = xi + dx;
      const cy = yi + dy;

      // Generate feature point position within this cell
      const h1 = hash2(perm, cx, cy);
      const h2 = hash2(perm, cx + 243, cy + 127);

      const fpx = cx + hashToFloat(h1);
      const fpy = cy + hashToFloat(h2);

      const distX = fpx - x;
      const distY = fpy - y;
      const dist = distX * distX + distY * distY;

      if (dist < minDist) {
        minDist = dist;
      }
    }
  }

  // sqrt and map to [-1, 1]. Max possible distance in a cell grid ~= sqrt(2) ~= 1.414
  return Math.sqrt(minDist) * 2 - 1;
}

// ═══════════════════════════════════════════════════════════════
// 3D WORLEY (CELLULAR) NOISE
// ═══════════════════════════════════════════════════════════════

/**
 * 3D Worley (cellular) noise. Returns a value in [-1, 1].
 *
 * @param seed - A string or number seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @param z - Z coordinate.
 * @returns A noise value in [-1, 1].
 */
export function worley3D(
  seed: string | number,
  x: number,
  y: number,
  z: number
): number {
  const perm = getPermTable(seed);

  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);

  let minDist = Infinity;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        const cx = xi + dx;
        const cy = yi + dy;
        const cz = zi + dz;

        const h1 = hash3(perm, cx, cy, cz);
        const h2 = hash3(perm, cx + 243, cy + 127, cz + 71);
        const h3 = hash3(perm, cx + 59, cy + 191, cz + 157);

        const fpx = cx + hashToFloat(h1);
        const fpy = cy + hashToFloat(h2);
        const fpz = cz + hashToFloat(h3);

        const distX = fpx - x;
        const distY = fpy - y;
        const distZ = fpz - z;
        const dist = distX * distX + distY * distY + distZ * distZ;

        if (dist < minDist) {
          minDist = dist;
        }
      }
    }
  }

  return Math.sqrt(minDist) * 2 - 1;
}

// ═══════════════════════════════════════════════════════════════
// 2D VALUE NOISE
// ═══════════════════════════════════════════════════════════════

/**
 * 2D value noise. Returns a value in [-1, 1].
 * Interpolates random values at integer grid points using quintic fade.
 *
 * @param seed - A string or number seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @returns A noise value in [-1, 1].
 */
export function valueNoise2D(seed: string | number, x: number, y: number): number {
  const perm = getPermTable(seed);

  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);

  // Random values at corners, mapped to [-1, 1]
  const c00 = hashToFloat(hash2(perm, xi, yi)) * 2 - 1;
  const c10 = hashToFloat(hash2(perm, xi + 1, yi)) * 2 - 1;
  const c01 = hashToFloat(hash2(perm, xi, yi + 1)) * 2 - 1;
  const c11 = hashToFloat(hash2(perm, xi + 1, yi + 1)) * 2 - 1;

  const x1 = lerp(c00, c10, u);
  const x2 = lerp(c01, c11, u);

  return lerp(x1, x2, v);
}

// ═══════════════════════════════════════════════════════════════
// 3D VALUE NOISE
// ═══════════════════════════════════════════════════════════════

/**
 * 3D value noise. Returns a value in [-1, 1].
 *
 * @param seed - A string or number seed for the noise field.
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @param z - Z coordinate.
 * @returns A noise value in [-1, 1].
 */
export function valueNoise3D(
  seed: string | number,
  x: number,
  y: number,
  z: number
): number {
  const perm = getPermTable(seed);

  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const c000 = hashToFloat(hash3(perm, xi, yi, zi)) * 2 - 1;
  const c100 = hashToFloat(hash3(perm, xi + 1, yi, zi)) * 2 - 1;
  const c010 = hashToFloat(hash3(perm, xi, yi + 1, zi)) * 2 - 1;
  const c110 = hashToFloat(hash3(perm, xi + 1, yi + 1, zi)) * 2 - 1;
  const c001 = hashToFloat(hash3(perm, xi, yi, zi + 1)) * 2 - 1;
  const c101 = hashToFloat(hash3(perm, xi + 1, yi, zi + 1)) * 2 - 1;
  const c011 = hashToFloat(hash3(perm, xi, yi + 1, zi + 1)) * 2 - 1;
  const c111 = hashToFloat(hash3(perm, xi + 1, yi + 1, zi + 1)) * 2 - 1;

  const x1 = lerp(c000, c100, u);
  const x2 = lerp(c010, c110, u);
  const x3 = lerp(c001, c101, u);
  const x4 = lerp(c011, c111, u);

  const y1 = lerp(x1, x2, v);
  const y2 = lerp(x3, x4, v);

  return lerp(y1, y2, w);
}
