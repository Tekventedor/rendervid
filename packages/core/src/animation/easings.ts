import type { EasingFunction, EasingName } from '../types';

/**
 * Linear easing - no acceleration.
 */
export const linear: EasingFunction = (t) => t;

// ═══════════════════════════════════════════════════════════════
// QUADRATIC
// ═══════════════════════════════════════════════════════════════

export const easeInQuad: EasingFunction = (t) => t * t;
export const easeOutQuad: EasingFunction = (t) => t * (2 - t);
export const easeInOutQuad: EasingFunction = (t) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// ═══════════════════════════════════════════════════════════════
// CUBIC
// ═══════════════════════════════════════════════════════════════

export const easeInCubic: EasingFunction = (t) => t * t * t;
export const easeOutCubic: EasingFunction = (t) => --t * t * t + 1;
export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

// ═══════════════════════════════════════════════════════════════
// QUARTIC
// ═══════════════════════════════════════════════════════════════

export const easeInQuart: EasingFunction = (t) => t * t * t * t;
export const easeOutQuart: EasingFunction = (t) => 1 - --t * t * t * t;
export const easeInOutQuart: EasingFunction = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;

// ═══════════════════════════════════════════════════════════════
// QUINTIC
// ═══════════════════════════════════════════════════════════════

export const easeInQuint: EasingFunction = (t) => t * t * t * t * t;
export const easeOutQuint: EasingFunction = (t) => 1 + --t * t * t * t * t;
export const easeInOutQuint: EasingFunction = (t) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;

// ═══════════════════════════════════════════════════════════════
// SINE
// ═══════════════════════════════════════════════════════════════

export const easeInSine: EasingFunction = (t) =>
  1 - Math.cos((t * Math.PI) / 2);
export const easeOutSine: EasingFunction = (t) =>
  Math.sin((t * Math.PI) / 2);
export const easeInOutSine: EasingFunction = (t) =>
  -(Math.cos(Math.PI * t) - 1) / 2;

// ═══════════════════════════════════════════════════════════════
// EXPONENTIAL
// ═══════════════════════════════════════════════════════════════

export const easeInExpo: EasingFunction = (t) =>
  t === 0 ? 0 : Math.pow(2, 10 * t - 10);
export const easeOutExpo: EasingFunction = (t) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
export const easeInOutExpo: EasingFunction = (t) =>
  t === 0 ? 0 : t === 1 ? 1 : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;

// ═══════════════════════════════════════════════════════════════
// CIRCULAR
// ═══════════════════════════════════════════════════════════════

export const easeInCirc: EasingFunction = (t) =>
  1 - Math.sqrt(1 - t * t);
export const easeOutCirc: EasingFunction = (t) =>
  Math.sqrt(1 - --t * t);
export const easeInOutCirc: EasingFunction = (t) =>
  t < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;

// ═══════════════════════════════════════════════════════════════
// BACK (Overshoot)
// ═══════════════════════════════════════════════════════════════

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;

export const easeInBack: EasingFunction = (t) =>
  c3 * t * t * t - c1 * t * t;
export const easeOutBack: EasingFunction = (t) =>
  1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
export const easeInOutBack: EasingFunction = (t) =>
  t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;

// ═══════════════════════════════════════════════════════════════
// ELASTIC
// ═══════════════════════════════════════════════════════════════

const c4 = (2 * Math.PI) / 3;
const c5 = (2 * Math.PI) / 4.5;

export const easeInElastic: EasingFunction = (t) =>
  t === 0 ? 0 : t === 1 ? 1
    : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
export const easeOutElastic: EasingFunction = (t) =>
  t === 0 ? 0 : t === 1 ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
export const easeInOutElastic: EasingFunction = (t) =>
  t === 0 ? 0 : t === 1 ? 1 : t < 0.5
    ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
    : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;

// ═══════════════════════════════════════════════════════════════
// BOUNCE
// ═══════════════════════════════════════════════════════════════

const n1 = 7.5625;
const d1 = 2.75;

export const easeOutBounce: EasingFunction = (t) => {
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

export const easeInBounce: EasingFunction = (t) =>
  1 - easeOutBounce(1 - t);

export const easeInOutBounce: EasingFunction = (t) =>
  t < 0.5
    ? (1 - easeOutBounce(1 - 2 * t)) / 2
    : (1 + easeOutBounce(2 * t - 1)) / 2;

// ═══════════════════════════════════════════════════════════════
// EASING MAP
// ═══════════════════════════════════════════════════════════════

/**
 * Map of all preset easing functions.
 */
export const easingMap: Record<EasingName, EasingFunction> = {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
};

/**
 * Get list of all easing names.
 */
export function getAllEasingNames(): EasingName[] {
  return Object.keys(easingMap) as EasingName[];
}

/**
 * Get an easing function by name.
 */
export function getEasing(name: EasingName): EasingFunction {
  return easingMap[name] || linear;
}

/**
 * Parse cubic-bezier string.
 * @example parseCubicBezier('cubic-bezier(0.25, 0.1, 0.25, 1)')
 */
export function parseCubicBezier(value: string): EasingFunction | null {
  const match = value.match(
    /^cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/
  );
  if (!match) return null;

  const [, x1, y1, x2, y2] = match.map(Number);
  return createCubicBezier(x1, y1, x2, y2);
}

/**
 * Create a cubic bezier easing function.
 */
export function createCubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): EasingFunction {
  // Newton-Raphson iteration for finding t from x
  const NEWTON_ITERATIONS = 4;
  const NEWTON_MIN_SLOPE = 0.001;
  const SUBDIVISION_PRECISION = 0.0000001;
  const SUBDIVISION_MAX_ITERATIONS = 10;

  const kSplineTableSize = 11;
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
  const sampleValues = new Float32Array(kSplineTableSize);

  function A(a1: number, a2: number) {
    return 1.0 - 3.0 * a2 + 3.0 * a1;
  }
  function B(a1: number, a2: number) {
    return 3.0 * a2 - 6.0 * a1;
  }
  function C(a1: number) {
    return 3.0 * a1;
  }

  function calcBezier(t: number, a1: number, a2: number) {
    return ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
  }

  function getSlope(t: number, a1: number, a2: number) {
    return 3.0 * A(a1, a2) * t * t + 2.0 * B(a1, a2) * t + C(a1);
  }

  function binarySubdivide(x: number, a: number, b: number, mX1: number, mX2: number) {
    let currentX: number;
    let currentT: number;
    let i = 0;
    do {
      currentT = a + (b - a) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - x;
      if (currentX > 0.0) {
        b = currentT;
      } else {
        a = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate(x: number, guessT: number, mX1: number, mX2: number) {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      const currentSlope = getSlope(guessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return guessT;
      }
      const currentX = calcBezier(guessT, mX1, mX2) - x;
      guessT -= currentX / currentSlope;
    }
    return guessT;
  }

  // Pre-compute sample values
  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, x1, x2);
  }

  function getTForX(x: number) {
    let intervalStart = 0.0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= x; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    const dist = (x - sampleValues[currentSample]) /
      (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;

    const initialSlope = getSlope(guessForT, x1, x2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(x, guessForT, x1, x2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(x, intervalStart, intervalStart + kSampleStepSize, x1, x2);
    }
  }

  return function bezierEasing(x: number): number {
    if (x === 0) return 0;
    if (x === 1) return 1;
    return calcBezier(getTForX(x), y1, y2);
  };
}

/**
 * Parse spring physics string.
 * @example parseSpring('spring(1, 100, 10)')
 */
export function parseSpring(value: string): EasingFunction | null {
  const match = value.match(
    /^spring\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/
  );
  if (!match) return null;

  const [, mass, stiffness, damping] = match.map(Number);
  return createSpring(mass, stiffness, damping);
}

/**
 * Create a spring physics easing function.
 */
export function createSpring(
  mass: number,
  stiffness: number,
  damping: number
): EasingFunction {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  let wd: number;
  let A: number;

  if (zeta < 1) {
    // Under-damped
    wd = w0 * Math.sqrt(1 - zeta * zeta);
    A = 1;
  } else {
    // Critically damped or over-damped
    wd = 0;
    A = 1;
  }

  return function springEasing(t: number): number {
    if (t === 0) return 0;
    if (t >= 1) return 1;

    // Scale t to get a reasonable animation duration
    const scaledT = t * 5;

    if (zeta < 1) {
      // Under-damped
      return (
        1 -
        Math.exp(-zeta * w0 * scaledT) *
          (A * Math.cos(wd * scaledT) + ((zeta * w0 * A) / wd) * Math.sin(wd * scaledT))
      );
    } else {
      // Critically damped
      return 1 - (1 + w0 * scaledT) * Math.exp(-w0 * scaledT);
    }
  };
}

/**
 * Parse any easing string (preset, cubic-bezier, or spring).
 */
export function parseEasing(value: string): EasingFunction {
  // Check preset
  if (value in easingMap) {
    return easingMap[value as EasingName];
  }

  // Check cubic-bezier
  const bezier = parseCubicBezier(value);
  if (bezier) return bezier;

  // Check spring
  const spring = parseSpring(value);
  if (spring) return spring;

  // Default to linear
  return linear;
}
