/** Measured text dimensions */
export interface TextMeasurement {
  width: number;
  height: number;
}

/** Options for measuring text */
export interface MeasureTextOptions {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight?: string | number;
  fontStyle?: string;
  letterSpacing?: number;
  lineHeight?: number;
  maxWidth?: number;
}

/** Options for fitting text */
export interface FitTextOptions {
  text: string;
  withinWidth: number;
  fontFamily: string;
  minFontSize?: number;
  maxFontSize?: number;
  fontWeight?: string | number;
  letterSpacing?: number;
}

/** Result of fitting text */
export interface FitTextResult {
  fontSize: number;
}

/**
 * Estimate the average character width ratio for a given font family.
 * Returns a multiplier relative to fontSize.
 */
function getCharWidthRatio(fontFamily: string): number {
  const lower = fontFamily.toLowerCase();
  if (lower.includes('serif') && !lower.includes('sans')) {
    return 0.55;
  }
  // sans-serif, monospace, and default
  return 0.6;
}

/**
 * Measure text dimensions using character-width estimation.
 *
 * Works in both browser and Node environments without requiring
 * a DOM or canvas. Uses heuristic character widths based on font family.
 */
export function measureText(options: MeasureTextOptions): TextMeasurement {
  const {
    text,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing = 0,
    lineHeight = 1.2,
    maxWidth,
  } = options;

  const baseRatio = getCharWidthRatio(fontFamily);

  // Bold adds ~5% width
  let weightMultiplier = 1;
  if (fontWeight !== undefined) {
    const w = typeof fontWeight === 'number' ? fontWeight : parseInt(String(fontWeight), 10);
    if (!isNaN(w) && w >= 700) {
      weightMultiplier = 1.05;
    } else if (fontWeight === 'bold') {
      weightMultiplier = 1.05;
    }
  }

  const charWidth = fontSize * baseRatio * weightMultiplier + letterSpacing;
  const lineHeightPx = fontSize * lineHeight;

  const lines = text.split('\n');

  if (maxWidth === undefined) {
    // No wrapping — measure each line directly
    let maxLineWidth = 0;
    for (const line of lines) {
      const w = line.length * charWidth;
      if (w > maxLineWidth) maxLineWidth = w;
    }
    return {
      width: maxLineWidth,
      height: lines.length * lineHeightPx,
    };
  }

  // With maxWidth, simulate word wrapping
  let totalLines = 0;
  let maxLineWidth = 0;

  for (const line of lines) {
    if (line.length === 0) {
      totalLines++;
      continue;
    }

    const words = line.split(/\s+/);
    let currentLineWidth = 0;
    let firstWord = true;

    for (const word of words) {
      const wordWidth = word.length * charWidth;
      const spaceWidth = firstWord ? 0 : charWidth; // space character

      if (!firstWord && currentLineWidth + spaceWidth + wordWidth > maxWidth) {
        // Wrap to next line
        if (currentLineWidth > maxLineWidth) maxLineWidth = currentLineWidth;
        currentLineWidth = wordWidth;
        totalLines++;
      } else {
        currentLineWidth += spaceWidth + wordWidth;
      }
      firstWord = false;
    }

    if (currentLineWidth > maxLineWidth) maxLineWidth = currentLineWidth;
    totalLines++;
  }

  return {
    width: Math.min(maxLineWidth, maxWidth),
    height: totalLines * lineHeightPx,
  };
}

/**
 * Find the largest font size that fits text within a given width.
 *
 * Uses binary search with `measureText` to find the optimal size
 * between `minFontSize` and `maxFontSize`.
 */
export function fitText(options: FitTextOptions): FitTextResult {
  const {
    text,
    withinWidth,
    fontFamily,
    minFontSize = 1,
    maxFontSize = 200,
    fontWeight,
    letterSpacing,
  } = options;

  let lo = minFontSize;
  let hi = maxFontSize;

  // Binary search for the largest fontSize that fits
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2;
    const measurement = measureText({
      text,
      fontFamily,
      fontSize: mid,
      fontWeight,
      letterSpacing,
    });

    if (measurement.width <= withinWidth) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return { fontSize: Math.floor(lo) };
}
