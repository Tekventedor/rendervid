/**
 * CSS named colors map (subset of most common colors).
 */
const NAMED_COLORS: Record<string, [number, number, number, number]> = {
  transparent: [0, 0, 0, 0],
  black: [0, 0, 0, 1],
  white: [255, 255, 255, 1],
  red: [255, 0, 0, 1],
  green: [0, 128, 0, 1],
  blue: [0, 0, 255, 1],
  yellow: [255, 255, 0, 1],
  cyan: [0, 255, 255, 1],
  magenta: [255, 0, 255, 1],
  orange: [255, 165, 0, 1],
  purple: [128, 0, 128, 1],
  pink: [255, 192, 203, 1],
  lime: [0, 255, 0, 1],
  navy: [0, 0, 128, 1],
  teal: [0, 128, 128, 1],
  maroon: [128, 0, 0, 1],
  olive: [128, 128, 0, 1],
  aqua: [0, 255, 255, 1],
  fuchsia: [255, 0, 255, 1],
  silver: [192, 192, 192, 1],
  gray: [128, 128, 128, 1],
  grey: [128, 128, 128, 1],
  coral: [255, 127, 80, 1],
  salmon: [250, 128, 114, 1],
  tomato: [255, 99, 71, 1],
  gold: [255, 215, 0, 1],
  khaki: [240, 230, 140, 1],
  violet: [238, 130, 238, 1],
  indigo: [75, 0, 130, 1],
  crimson: [220, 20, 60, 1],
  plum: [221, 160, 221, 1],
  orchid: [218, 112, 214, 1],
  tan: [210, 180, 140, 1],
  beige: [245, 245, 220, 1],
  ivory: [255, 255, 240, 1],
  linen: [250, 240, 230, 1],
  lavender: [230, 230, 250, 1],
  skyblue: [135, 206, 235, 1],
  steelblue: [70, 130, 180, 1],
  royalblue: [65, 105, 225, 1],
  midnightblue: [25, 25, 112, 1],
  darkblue: [0, 0, 139, 1],
  darkgreen: [0, 100, 0, 1],
  darkred: [139, 0, 0, 1],
  darkorange: [255, 140, 0, 1],
  darkviolet: [148, 0, 211, 1],
  deeppink: [255, 20, 147, 1],
  dodgerblue: [30, 144, 255, 1],
  firebrick: [178, 34, 34, 1],
  forestgreen: [34, 139, 34, 1],
  hotpink: [255, 105, 180, 1],
  limegreen: [50, 205, 50, 1],
  orangered: [255, 69, 0, 1],
  seagreen: [46, 139, 87, 1],
  sienna: [160, 82, 45, 1],
  slateblue: [106, 90, 205, 1],
  slategray: [112, 128, 144, 1],
  springgreen: [0, 255, 127, 1],
  turquoise: [64, 224, 208, 1],
  wheat: [245, 222, 179, 1],
  whitesmoke: [245, 245, 245, 1],
  yellowgreen: [154, 205, 50, 1],
};

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Clamp a number between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Parse a hex color string to RGBA.
 */
function parseHex(hex: string): RGBA | null {
  // Remove # prefix
  const h = hex.startsWith('#') ? hex.slice(1) : hex;

  let r: number, g: number, b: number, a: number;

  if (h.length === 3) {
    // #rgb
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
    a = 1;
  } else if (h.length === 4) {
    // #rgba
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
    a = parseInt(h[3] + h[3], 16) / 255;
  } else if (h.length === 6) {
    // #rrggbb
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
    a = 1;
  } else if (h.length === 8) {
    // #rrggbbaa
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
    a = parseInt(h.slice(6, 8), 16) / 255;
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;

  return { r, g, b, a };
}

/**
 * Parse rgb() or rgba() string.
 */
function parseRgb(str: string): RGBA | null {
  const match = str.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)$/
  );
  if (!match) return null;

  return {
    r: clamp(Math.round(Number(match[1])), 0, 255),
    g: clamp(Math.round(Number(match[2])), 0, 255),
    b: clamp(Math.round(Number(match[3])), 0, 255),
    a: match[4] !== undefined ? clamp(Number(match[4]), 0, 1) : 1,
  };
}

/**
 * Convert HSL to RGB.
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r: number, g: number, b: number;

  if (h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/**
 * Parse hsl() or hsla() string.
 */
function parseHsl(str: string): RGBA | null {
  const match = str.match(
    /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+))?\s*\)$/
  );
  if (!match) return null;

  const [r, g, b] = hslToRgb(Number(match[1]), Number(match[2]), Number(match[3]));

  return {
    r,
    g,
    b,
    a: match[4] !== undefined ? clamp(Number(match[4]), 0, 1) : 1,
  };
}

/**
 * Parse any supported color format to RGBA components.
 *
 * Supports hex (#fff, #ffffff, #ffffffaa), rgb(), rgba(), hsl(), hsla(),
 * and CSS named colors.
 */
export function parseColor(color: string): RGBA {
  const trimmed = color.trim().toLowerCase();

  // Named color
  if (trimmed in NAMED_COLORS) {
    const [r, g, b, a] = NAMED_COLORS[trimmed];
    return { r, g, b, a };
  }

  // Hex
  if (trimmed.startsWith('#')) {
    const result = parseHex(trimmed);
    if (result) return result;
  }

  // rgb/rgba
  if (trimmed.startsWith('rgb')) {
    const result = parseRgb(trimmed);
    if (result) return result;
  }

  // hsl/hsla
  if (trimmed.startsWith('hsl')) {
    const result = parseHsl(trimmed);
    if (result) return result;
  }

  // Fallback: transparent black
  return { r: 0, g: 0, b: 0, a: 0 };
}

/**
 * Convert RGBA components to an rgba() CSS string.
 */
export function colorToString(color: RGBA): string {
  const r = clamp(Math.round(color.r), 0, 255);
  const g = clamp(Math.round(color.g), 0, 255);
  const b = clamp(Math.round(color.b), 0, 255);
  const a = clamp(color.a, 0, 1);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Interpolate between two RGBA colors.
 */
function lerpColor(from: RGBA, to: RGBA, t: number): RGBA {
  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
    a: from.a + (to.a - from.a) * t,
  };
}

/**
 * Map a numeric value through input/output color ranges, interpolating
 * between colors in RGB space.
 *
 * @param value - The input value to map.
 * @param inputRange - Ascending numeric breakpoints (must have same length as outputRange).
 * @param outputRange - Color strings corresponding to each breakpoint.
 * @returns An rgba() CSS color string.
 *
 * @example
 * interpolateColors(0.5, [0, 1], ['#000', '#fff'])
 * // => "rgba(128, 128, 128, 1)"
 */
export function interpolateColors(
  value: number,
  inputRange: number[],
  outputRange: string[]
): string {
  if (inputRange.length !== outputRange.length) {
    throw new Error('inputRange and outputRange must have the same length');
  }
  if (inputRange.length < 2) {
    throw new Error('inputRange must have at least 2 values');
  }

  const parsedColors = outputRange.map(parseColor);

  // Clamp to range
  if (value <= inputRange[0]) {
    return colorToString(parsedColors[0]);
  }
  if (value >= inputRange[inputRange.length - 1]) {
    return colorToString(parsedColors[parsedColors.length - 1]);
  }

  // Find the segment
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      const segmentProgress =
        (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      return colorToString(lerpColor(parsedColors[i], parsedColors[i + 1], segmentProgress));
    }
  }

  // Fallback (shouldn't reach here)
  return colorToString(parsedColors[parsedColors.length - 1]);
}
