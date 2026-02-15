/**
 * Canvas Drawing Utilities
 *
 * Provides functions for drawing SVG-like paths, gradients, text on paths,
 * pattern fills, and clip paths on an HTML Canvas 2D context.
 *
 * These utilities bridge the gap between SVG path data and Canvas 2D drawing,
 * enabling the canvas layer type to render complex vector graphics.
 */

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Options for drawing a path on canvas.
 */
export interface DrawPathOptions {
  /** Fill color or CSS color string */
  fill?: string;
  /** Stroke color */
  stroke?: string;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Stroke dash array */
  strokeDash?: number[];
  /** Stroke line cap */
  lineCap?: CanvasLineCap;
  /** Stroke line join */
  lineJoin?: CanvasLineJoin;
  /** Opacity (0-1) */
  opacity?: number;
  /** Whether to close the path */
  closePath?: boolean;
}

/**
 * Gradient type: linear, radial, or conic.
 */
export type GradientType = 'linear' | 'radial' | 'conic';

/**
 * Configuration for a gradient.
 */
export interface GradientConfig {
  /** Gradient type */
  type: GradientType;
  /** Color stops */
  stops: Array<{ offset: number; color: string }>;
  /** Start x (linear) or center x (radial/conic) */
  x0?: number;
  /** Start y (linear) or center y (radial/conic) */
  y0?: number;
  /** End x (linear) */
  x1?: number;
  /** End y (linear) */
  y1?: number;
  /** Inner radius (radial) */
  r0?: number;
  /** Outer radius (radial) */
  r1?: number;
  /** Start angle in degrees (conic) */
  startAngle?: number;
}

/**
 * Bounding rectangle.
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Options for rendering text along a path.
 */
export interface TextOnPathOptions {
  /** Font size in pixels */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: string;
  /** Fill color for text */
  fill?: string;
  /** Stroke color for text */
  stroke?: string;
  /** Stroke width for text */
  strokeWidth?: number;
  /** Letter spacing in pixels */
  letterSpacing?: number;
  /** Start offset along path (0-1) */
  startOffset?: number;
  /** Text alignment on path */
  textAlign?: 'left' | 'center' | 'right';
}

// ═══════════════════════════════════════════════════════════════
// SVG PATH PARSING
// ═══════════════════════════════════════════════════════════════

interface PathSegment {
  command: string;
  args: number[];
}

const COMMAND_RE = /([MmLlHhVvCcSsQqTtAaZz])/;

function parsePathNumbers(str: string): number[] {
  const matches = str.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi);
  return matches ? matches.map(Number) : [];
}

function parsePathData(d: string): PathSegment[] {
  const tokens = d
    .split(COMMAND_RE)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const segments: PathSegment[] = [];
  let currentCommand = '';

  for (const token of tokens) {
    if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(token)) {
      currentCommand = token;
    } else {
      const nums = parsePathNumbers(token);
      segments.push({ command: currentCommand, args: nums });
    }
  }

  return segments;
}

// ═══════════════════════════════════════════════════════════════
// PATH DRAWING
// ═══════════════════════════════════════════════════════════════

/**
 * Apply SVG path data to a Canvas 2D context as a Path2D.
 * Returns the Path2D object for further use.
 */
function createPath2DFromSvg(pathData: string): Path2D {
  return new Path2D(pathData);
}

/**
 * Draw an SVG-like path on a Canvas 2D context.
 *
 * @param ctx - Canvas 2D rendering context
 * @param pathData - SVG path data string (e.g., "M 10 10 L 100 100")
 * @param options - Drawing options (fill, stroke, etc.)
 */
export function drawPath(
  ctx: CanvasRenderingContext2D,
  pathData: string,
  options: DrawPathOptions = {}
): void {
  const {
    fill,
    stroke,
    strokeWidth = 1,
    strokeDash,
    lineCap = 'butt',
    lineJoin = 'miter',
    opacity = 1,
  } = options;

  ctx.save();
  ctx.globalAlpha = opacity;

  const path = createPath2DFromSvg(pathData);

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill(path);
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;

    if (strokeDash) {
      ctx.setLineDash(strokeDash);
    }

    ctx.stroke(path);

    if (strokeDash) {
      ctx.setLineDash([]);
    }
  }

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// GRADIENT DRAWING
// ═══════════════════════════════════════════════════════════════

/**
 * Create a canvas gradient from a GradientConfig.
 *
 * @param ctx - Canvas 2D rendering context
 * @param gradient - Gradient configuration
 * @param bounds - Bounding rectangle for default positioning
 * @returns A CanvasGradient object
 */
export function createCanvasGradient(
  ctx: CanvasRenderingContext2D,
  gradient: GradientConfig,
  bounds: Bounds
): CanvasGradient {
  let canvasGradient: CanvasGradient;

  if (gradient.type === 'radial') {
    const cx = gradient.x0 ?? bounds.x + bounds.width / 2;
    const cy = gradient.y0 ?? bounds.y + bounds.height / 2;
    const r0 = gradient.r0 ?? 0;
    const r1 = gradient.r1 ?? Math.max(bounds.width, bounds.height) / 2;

    canvasGradient = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
  } else if (gradient.type === 'conic') {
    const cx = gradient.x0 ?? bounds.x + bounds.width / 2;
    const cy = gradient.y0 ?? bounds.y + bounds.height / 2;
    const startAngle = ((gradient.startAngle ?? 0) * Math.PI) / 180;

    canvasGradient = ctx.createConicGradient(startAngle, cx, cy);
  } else {
    // linear
    const x0 = gradient.x0 ?? bounds.x;
    const y0 = gradient.y0 ?? bounds.y;
    const x1 = gradient.x1 ?? bounds.x + bounds.width;
    const y1 = gradient.y1 ?? bounds.y;

    canvasGradient = ctx.createLinearGradient(x0, y0, x1, y1);
  }

  for (const stop of gradient.stops) {
    canvasGradient.addColorStop(
      Math.max(0, Math.min(1, stop.offset)),
      stop.color
    );
  }

  return canvasGradient;
}

/**
 * Draw a gradient fill within a rectangular area.
 *
 * @param ctx - Canvas 2D rendering context
 * @param gradient - Gradient configuration
 * @param bounds - Bounding rectangle to fill
 */
export function drawGradient(
  ctx: CanvasRenderingContext2D,
  gradient: GradientConfig,
  bounds: Bounds
): void {
  ctx.save();

  const canvasGradient = createCanvasGradient(ctx, gradient, bounds);
  ctx.fillStyle = canvasGradient;
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// TEXT ON PATH
// ═══════════════════════════════════════════════════════════════

interface PathPoint {
  x: number;
  y: number;
  angle: number;
}

/**
 * Sample points along an SVG path for text placement.
 */
function samplePathPoints(pathData: string, numSamples: number): PathPoint[] {
  const segments = parsePathData(pathData);
  const points: PathPoint[] = [];

  // Simple path sampling: extract line segments and interpolate
  let cx = 0;
  let cy = 0;
  let startX = 0;
  let startY = 0;
  const allPoints: Array<{ x: number; y: number }> = [];

  for (const seg of segments) {
    const cmd = seg.command;
    const a = seg.args;

    switch (cmd) {
      case 'M':
        cx = a[0];
        cy = a[1];
        startX = cx;
        startY = cy;
        allPoints.push({ x: cx, y: cy });
        break;
      case 'm':
        cx += a[0];
        cy += a[1];
        startX = cx;
        startY = cy;
        allPoints.push({ x: cx, y: cy });
        break;
      case 'L':
        cx = a[0];
        cy = a[1];
        allPoints.push({ x: cx, y: cy });
        break;
      case 'l':
        cx += a[0];
        cy += a[1];
        allPoints.push({ x: cx, y: cy });
        break;
      case 'H':
        cx = a[0];
        allPoints.push({ x: cx, y: cy });
        break;
      case 'h':
        cx += a[0];
        allPoints.push({ x: cx, y: cy });
        break;
      case 'V':
        cy = a[0];
        allPoints.push({ x: cx, y: cy });
        break;
      case 'v':
        cy += a[0];
        allPoints.push({ x: cx, y: cy });
        break;
      case 'C':
        // Cubic bezier: sample intermediate points
        for (let t = 0.25; t <= 1; t += 0.25) {
          const t2 = t * t;
          const t3 = t2 * t;
          const mt = 1 - t;
          const mt2 = mt * mt;
          const mt3 = mt2 * mt;
          const x = mt3 * cx + 3 * mt2 * t * a[0] + 3 * mt * t2 * a[2] + t3 * a[4];
          const y = mt3 * cy + 3 * mt2 * t * a[1] + 3 * mt * t2 * a[3] + t3 * a[5];
          allPoints.push({ x, y });
        }
        cx = a[4];
        cy = a[5];
        break;
      case 'Q':
        // Quadratic bezier
        for (let t = 0.25; t <= 1; t += 0.25) {
          const mt = 1 - t;
          const x = mt * mt * cx + 2 * mt * t * a[0] + t * t * a[2];
          const y = mt * mt * cy + 2 * mt * t * a[1] + t * t * a[3];
          allPoints.push({ x, y });
        }
        cx = a[2];
        cy = a[3];
        break;
      case 'Z':
      case 'z':
        cx = startX;
        cy = startY;
        allPoints.push({ x: cx, y: cy });
        break;
    }
  }

  if (allPoints.length < 2) {
    return [];
  }

  // Calculate cumulative distances
  const distances: number[] = [0];
  let totalLength = 0;
  for (let i = 1; i < allPoints.length; i++) {
    const dx = allPoints[i].x - allPoints[i - 1].x;
    const dy = allPoints[i].y - allPoints[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
    distances.push(totalLength);
  }

  if (totalLength === 0) return [];

  // Sample evenly along the path
  for (let i = 0; i < numSamples; i++) {
    const t = (i / Math.max(1, numSamples - 1)) * totalLength;

    // Find segment
    let segIdx = 0;
    for (let j = 1; j < distances.length; j++) {
      if (distances[j] >= t) {
        segIdx = j - 1;
        break;
      }
      segIdx = j - 1;
    }

    const segLen = distances[segIdx + 1] - distances[segIdx];
    const localT = segLen > 0 ? (t - distances[segIdx]) / segLen : 0;

    const p0 = allPoints[segIdx];
    const p1 = allPoints[Math.min(segIdx + 1, allPoints.length - 1)];

    const x = p0.x + (p1.x - p0.x) * localT;
    const y = p0.y + (p1.y - p0.y) * localT;
    const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

    points.push({ x, y, angle });
  }

  return points;
}

/**
 * Render text along an SVG path.
 *
 * @param ctx - Canvas 2D rendering context
 * @param text - Text to render
 * @param pathData - SVG path data string
 * @param options - Text rendering options
 */
export function drawTextOnPath(
  ctx: CanvasRenderingContext2D,
  text: string,
  pathData: string,
  options: TextOnPathOptions = {}
): void {
  const {
    fontSize = 16,
    fontFamily = 'sans-serif',
    fontWeight = 'normal',
    fill = '#000000',
    stroke,
    strokeWidth = 1,
    letterSpacing = 0,
    startOffset = 0,
  } = options;

  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'middle';

  // Measure total text width
  let totalWidth = 0;
  const charWidths: number[] = [];
  for (const char of text) {
    const w = ctx.measureText(char).width + letterSpacing;
    charWidths.push(w);
    totalWidth += w;
  }

  // Sample points along the path, enough for each character
  const numSamples = Math.max(text.length * 4, 100);
  const pathPoints = samplePathPoints(pathData, numSamples);

  if (pathPoints.length < 2) {
    ctx.restore();
    return;
  }

  // Place characters along the path
  let currentDist = startOffset * totalWidth;

  for (let i = 0; i < text.length; i++) {
    const charWidth = charWidths[i];
    const charCenter = currentDist + charWidth / 2;

    // Find the point index on the path
    const t = Math.max(0, Math.min(1, charCenter / totalWidth));
    const idx = Math.min(
      Math.floor(t * (pathPoints.length - 1)),
      pathPoints.length - 1
    );
    const point = pathPoints[idx];

    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(point.angle);

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fillText(text[i], -charWidth / 2, 0);
    }

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(text[i], -charWidth / 2, 0);
    }

    ctx.restore();

    currentDist += charWidth;
  }

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// PATTERN
// ═══════════════════════════════════════════════════════════════

/**
 * Pattern repetition modes.
 */
export type PatternRepetition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

/**
 * Create a pattern fill from an image or canvas element.
 *
 * @param ctx - Canvas 2D rendering context
 * @param source - Image, canvas, or other pattern source
 * @param repetition - How the pattern repeats
 * @returns A CanvasPattern or null
 */
export function createPattern(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  repetition: PatternRepetition = 'repeat'
): CanvasPattern | null {
  return ctx.createPattern(source, repetition);
}

// ═══════════════════════════════════════════════════════════════
// CLIP PATH
// ═══════════════════════════════════════════════════════════════

/**
 * Apply an SVG path as a clip region on the canvas context.
 * Call ctx.restore() to remove the clip.
 *
 * @param ctx - Canvas 2D rendering context
 * @param pathData - SVG path data string
 */
export function applyClipPath(
  ctx: CanvasRenderingContext2D,
  pathData: string
): void {
  const path = createPath2DFromSvg(pathData);
  ctx.clip(path);
}

// ═══════════════════════════════════════════════════════════════
// HELPER: DRAW CIRCLE
// ═══════════════════════════════════════════════════════════════

/**
 * Draw a circle on the canvas.
 *
 * @param ctx - Canvas 2D rendering context
 * @param cx - Center x
 * @param cy - Center y
 * @param r - Radius
 * @param options - Drawing options
 */
export function drawCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  options: DrawPathOptions = {}
): void {
  const { fill, stroke, strokeWidth = 1, opacity = 1 } = options;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// HELPER: DRAW ROUNDED RECT
// ═══════════════════════════════════════════════════════════════

/**
 * Draw a rounded rectangle on the canvas.
 *
 * @param ctx - Canvas 2D rendering context
 * @param x - Top-left x
 * @param y - Top-left y
 * @param width - Width
 * @param height - Height
 * @param borderRadius - Corner radius
 * @param options - Drawing options
 */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  borderRadius: number = 0,
  options: DrawPathOptions = {}
): void {
  const { fill, stroke, strokeWidth = 1, opacity = 1 } = options;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.beginPath();

  if (borderRadius > 0) {
    const r = Math.min(borderRadius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.lineTo(x + width, y + height - r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.lineTo(x + r, y + height);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
  } else {
    ctx.rect(x, y, width, height);
  }

  ctx.closePath();

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }

  ctx.restore();
}
