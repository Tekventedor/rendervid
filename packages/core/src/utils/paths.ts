// ---- Types ----

interface PathCommand {
  command: string;
  args: number[];
}

interface Point {
  x: number;
  y: number;
}

interface Segment {
  start: Point;
  end: Point;
  length: number;
  pointAtLength: (t: number) => Point;
  tangentAtLength: (t: number) => Point;
}

// ---- SVG Path Parser ----

const COMMAND_RE = /([MmLlHhVvCcSsQqTtAaZz])/;

function tokenize(d: string): string[] {
  // Split on command letters, keeping them
  return d
    .split(COMMAND_RE)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function parseNumbers(str: string): number[] {
  // Handle comma/space/negative-sign separation
  const matches = str.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi);
  return matches ? matches.map(Number) : [];
}

function argsPerCommand(cmd: string): number {
  switch (cmd.toUpperCase()) {
    case 'M':
    case 'L':
    case 'T':
      return 2;
    case 'H':
    case 'V':
      return 1;
    case 'C':
      return 6;
    case 'S':
    case 'Q':
      return 4;
    case 'A':
      return 7;
    case 'Z':
      return 0;
    default:
      return 0;
  }
}

function parsePath(d: string): PathCommand[] {
  const tokens = tokenize(d);
  const commands: PathCommand[] = [];

  let i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i];
    i++;

    if (cmd.toUpperCase() === 'Z') {
      commands.push({ command: cmd, args: [] });
      continue;
    }

    const argCount = argsPerCommand(cmd);
    if (argCount === 0) {
      commands.push({ command: cmd, args: [] });
      continue;
    }

    const numStr = i < tokens.length ? tokens[i] : '';
    i++;
    const nums = parseNumbers(numStr);

    // Split into groups if there are multiple sets of args
    // (e.g. "M 10 20 30 40" = M 10,20 then implicit L 30,40)
    let offset = 0;
    let isFirst = true;
    while (offset + argCount <= nums.length) {
      const args = nums.slice(offset, offset + argCount);
      if (isFirst) {
        commands.push({ command: cmd, args });
        isFirst = false;
      } else {
        // Implicit command: M -> L, m -> l; others repeat same command
        const implicitCmd =
          cmd === 'M' ? 'L' : cmd === 'm' ? 'l' : cmd;
        commands.push({ command: implicitCmd, args });
      }
      offset += argCount;
    }

    // If no args were parsed and this isn't Z, push what we have
    if (isFirst && nums.length > 0) {
      commands.push({ command: cmd, args: nums });
    }
  }

  return commands;
}

function serializePath(commands: PathCommand[]): string {
  return commands
    .map((c) => {
      if (c.args.length === 0) return c.command;
      return c.command + ' ' + c.args.map((n) => roundNum(n)).join(' ');
    })
    .join(' ');
}

function roundNum(n: number): string {
  const r = Math.round(n * 1000) / 1000;
  return String(r);
}

// ---- Normalization: relative -> absolute ----

function toAbsolute(commands: PathCommand[]): PathCommand[] {
  const result: PathCommand[] = [];
  let cx = 0;
  let cy = 0;
  let subpathStartX = 0;
  let subpathStartY = 0;

  for (const { command, args } of commands) {
    const isRelative = command === command.toLowerCase() && command !== 'Z' && command !== 'z';
    const upper = command.toUpperCase();

    if (upper === 'Z') {
      result.push({ command: 'Z', args: [] });
      cx = subpathStartX;
      cy = subpathStartY;
      continue;
    }

    const absArgs = [...args];

    switch (upper) {
      case 'M':
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
        }
        cx = absArgs[0];
        cy = absArgs[1];
        subpathStartX = cx;
        subpathStartY = cy;
        break;

      case 'L':
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
        }
        cx = absArgs[0];
        cy = absArgs[1];
        break;

      case 'H':
        if (isRelative) {
          absArgs[0] += cx;
        }
        cx = absArgs[0];
        break;

      case 'V':
        if (isRelative) {
          absArgs[0] += cy;
        }
        cy = absArgs[0];
        break;

      case 'C':
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
          absArgs[2] += cx;
          absArgs[3] += cy;
          absArgs[4] += cx;
          absArgs[5] += cy;
        }
        cx = absArgs[4];
        cy = absArgs[5];
        break;

      case 'S':
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
          absArgs[2] += cx;
          absArgs[3] += cy;
        }
        cx = absArgs[2];
        cy = absArgs[3];
        break;

      case 'Q':
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
          absArgs[2] += cx;
          absArgs[3] += cy;
        }
        cx = absArgs[2];
        cy = absArgs[3];
        break;

      case 'T':
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
        }
        cx = absArgs[0];
        cy = absArgs[1];
        break;

      case 'A':
        if (isRelative) {
          absArgs[5] += cx;
          absArgs[6] += cy;
        }
        cx = absArgs[5];
        cy = absArgs[6];
        break;
    }

    result.push({ command: upper, args: absArgs });
  }

  return result;
}

// ---- Geometry helpers ----

function dist(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

// Cubic bezier point at parameter t
function cubicBezierPoint(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
}

// Cubic bezier tangent (derivative) at parameter t
function cubicBezierTangent(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  const dx =
    3 * mt2 * (p1.x - p0.x) +
    6 * mt * t * (p2.x - p1.x) +
    3 * t2 * (p3.x - p2.x);
  const dy =
    3 * mt2 * (p1.y - p0.y) +
    6 * mt * t * (p2.y - p1.y) +
    3 * t2 * (p3.y - p2.y);
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: 0, y: 0 };
  return { x: dx / len, y: dy / len };
}

// Quadratic bezier point at parameter t
function quadBezierPoint(
  p0: Point,
  p1: Point,
  p2: Point,
  t: number
): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * p0.x + 2 * mt * t * p1.x + t2 * p2.x,
    y: mt2 * p0.y + 2 * mt * t * p1.y + t2 * p2.y,
  };
}

// Quadratic bezier tangent at parameter t
function quadBezierTangent(
  p0: Point,
  p1: Point,
  p2: Point,
  t: number
): Point {
  const mt = 1 - t;
  const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: 0, y: 0 };
  return { x: dx / len, y: dy / len };
}

// Approximate arc with line segments and return points
// Endpoint parameterization -> center parameterization conversion
function arcToPoints(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  phi: number,
  theta1: number,
  dtheta: number,
  steps: number
): Point[] {
  const points: Point[] = [];
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  for (let i = 0; i <= steps; i++) {
    const t = theta1 + (dtheta * i) / steps;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    points.push({
      x: cosPhi * rx * cosT - sinPhi * ry * sinT + cx,
      y: sinPhi * rx * cosT + cosPhi * ry * sinT + cy,
    });
  }
  return points;
}

// Convert SVG arc endpoint parameterization to center parameterization
function endpointToCenter(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  phi: number,
  largeArc: boolean,
  sweep: boolean,
  x2: number,
  y2: number
): { cx: number; cy: number; theta1: number; dtheta: number; rx: number; ry: number } {
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cosPhi * dx + sinPhi * dy;
  const y1p = -sinPhi * dx + cosPhi * dy;

  // Ensure radii are large enough
  let rxSq = rx * rx;
  let rySq = ry * ry;
  const x1pSq = x1p * x1p;
  const y1pSq = y1p * y1p;

  const lambda = x1pSq / rxSq + y1pSq / rySq;
  if (lambda > 1) {
    const sqrtLambda = Math.sqrt(lambda);
    rx *= sqrtLambda;
    ry *= sqrtLambda;
    rxSq = rx * rx;
    rySq = ry * ry;
  }

  let num = rxSq * rySq - rxSq * y1pSq - rySq * x1pSq;
  let den = rxSq * y1pSq + rySq * x1pSq;
  if (den === 0) {
    return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, theta1: 0, dtheta: 0, rx, ry };
  }

  let sq = Math.sqrt(Math.max(0, num / den));
  if (largeArc === sweep) sq = -sq;

  const cxp = (sq * rx * y1p) / ry;
  const cyp = (-sq * ry * x1p) / rx;

  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

  const theta1 = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
  let dtheta = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx) - theta1;

  if (sweep && dtheta < 0) dtheta += 2 * Math.PI;
  if (!sweep && dtheta > 0) dtheta -= 2 * Math.PI;

  return { cx, cy, theta1, dtheta, rx, ry };
}

// Number of subdivision steps for curve length approximation
const CURVE_STEPS = 64;

// ---- Build segments from parsed, absolute commands ----

function buildSegments(commands: PathCommand[]): Segment[] {
  const segments: Segment[] = [];
  let cx = 0;
  let cy = 0;
  let subpathStartX = 0;
  let subpathStartY = 0;
  // For S/T shorthand reflection
  let lastControlX = 0;
  let lastControlY = 0;
  let lastCommand = '';

  for (const { command, args } of commands) {
    const start: Point = { x: cx, y: cy };

    switch (command) {
      case 'M':
        cx = args[0];
        cy = args[1];
        subpathStartX = cx;
        subpathStartY = cy;
        lastCommand = 'M';
        continue;

      case 'L': {
        const end: Point = { x: args[0], y: args[1] };
        const segLen = dist(start, end);
        segments.push({
          start,
          end,
          length: segLen,
          pointAtLength: (t) => lerpPoint(start, end, t),
          tangentAtLength: () => {
            const d = dist(start, end);
            if (d === 0) return { x: 0, y: 0 };
            return { x: (end.x - start.x) / d, y: (end.y - start.y) / d };
          },
        });
        cx = end.x;
        cy = end.y;
        lastCommand = 'L';
        break;
      }

      case 'H': {
        const end: Point = { x: args[0], y: cy };
        const segLen = Math.abs(args[0] - cx);
        segments.push({
          start,
          end,
          length: segLen,
          pointAtLength: (t) => lerpPoint(start, end, t),
          tangentAtLength: () => {
            const dx = end.x - start.x;
            return { x: dx >= 0 ? 1 : -1, y: 0 };
          },
        });
        cx = end.x;
        lastCommand = 'H';
        break;
      }

      case 'V': {
        const end: Point = { x: cx, y: args[0] };
        const segLen = Math.abs(args[0] - cy);
        segments.push({
          start,
          end,
          length: segLen,
          pointAtLength: (t) => lerpPoint(start, end, t),
          tangentAtLength: () => {
            const dy = end.y - start.y;
            return { x: 0, y: dy >= 0 ? 1 : -1 };
          },
        });
        cy = end.y;
        lastCommand = 'V';
        break;
      }

      case 'C': {
        const p0 = start;
        const p1: Point = { x: args[0], y: args[1] };
        const p2: Point = { x: args[2], y: args[3] };
        const p3: Point = { x: args[4], y: args[5] };
        const lut = buildCubicLUT(p0, p1, p2, p3);
        segments.push({
          start: p0,
          end: p3,
          length: lut.totalLength,
          pointAtLength: (t) => cubicPointFromLUT(lut, t, p0, p1, p2, p3),
          tangentAtLength: (t) => cubicTangentFromLUT(lut, t, p0, p1, p2, p3),
        });
        lastControlX = p2.x;
        lastControlY = p2.y;
        cx = p3.x;
        cy = p3.y;
        lastCommand = 'C';
        break;
      }

      case 'S': {
        const p0 = start;
        // Reflect previous control point
        let cp1x: number, cp1y: number;
        if (lastCommand === 'C' || lastCommand === 'S') {
          cp1x = 2 * cx - lastControlX;
          cp1y = 2 * cy - lastControlY;
        } else {
          cp1x = cx;
          cp1y = cy;
        }
        const p1: Point = { x: cp1x, y: cp1y };
        const p2: Point = { x: args[0], y: args[1] };
        const p3: Point = { x: args[2], y: args[3] };
        const lut = buildCubicLUT(p0, p1, p2, p3);
        segments.push({
          start: p0,
          end: p3,
          length: lut.totalLength,
          pointAtLength: (t) => cubicPointFromLUT(lut, t, p0, p1, p2, p3),
          tangentAtLength: (t) => cubicTangentFromLUT(lut, t, p0, p1, p2, p3),
        });
        lastControlX = p2.x;
        lastControlY = p2.y;
        cx = p3.x;
        cy = p3.y;
        lastCommand = 'S';
        break;
      }

      case 'Q': {
        const p0 = start;
        const p1: Point = { x: args[0], y: args[1] };
        const p2: Point = { x: args[2], y: args[3] };
        const lut = buildQuadLUT(p0, p1, p2);
        segments.push({
          start: p0,
          end: p2,
          length: lut.totalLength,
          pointAtLength: (t) => quadPointFromLUT(lut, t, p0, p1, p2),
          tangentAtLength: (t) => quadTangentFromLUT(lut, t, p0, p1, p2),
        });
        lastControlX = p1.x;
        lastControlY = p1.y;
        cx = p2.x;
        cy = p2.y;
        lastCommand = 'Q';
        break;
      }

      case 'T': {
        const p0 = start;
        let cp1x: number, cp1y: number;
        if (lastCommand === 'Q' || lastCommand === 'T') {
          cp1x = 2 * cx - lastControlX;
          cp1y = 2 * cy - lastControlY;
        } else {
          cp1x = cx;
          cp1y = cy;
        }
        const p1: Point = { x: cp1x, y: cp1y };
        const p2: Point = { x: args[0], y: args[1] };
        const lut = buildQuadLUT(p0, p1, p2);
        segments.push({
          start: p0,
          end: p2,
          length: lut.totalLength,
          pointAtLength: (t) => quadPointFromLUT(lut, t, p0, p1, p2),
          tangentAtLength: (t) => quadTangentFromLUT(lut, t, p0, p1, p2),
        });
        lastControlX = p1.x;
        lastControlY = p1.y;
        cx = p2.x;
        cy = p2.y;
        lastCommand = 'T';
        break;
      }

      case 'A': {
        const rxArg = Math.abs(args[0]);
        const ryArg = Math.abs(args[1]);
        const phi = (args[2] * Math.PI) / 180;
        const largeArc = args[3] !== 0;
        const sweep = args[4] !== 0;
        const ex = args[5];
        const ey = args[6];
        const end: Point = { x: ex, y: ey };

        if (rxArg === 0 || ryArg === 0) {
          // Degenerate arc -> line
          const segLen = dist(start, end);
          segments.push({
            start,
            end,
            length: segLen,
            pointAtLength: (t) => lerpPoint(start, end, t),
            tangentAtLength: () => {
              const d = dist(start, end);
              if (d === 0) return { x: 0, y: 0 };
              return { x: (end.x - start.x) / d, y: (end.y - start.y) / d };
            },
          });
        } else {
          const center = endpointToCenter(
            cx, cy, rxArg, ryArg, phi, largeArc, sweep, ex, ey
          );
          const steps = CURVE_STEPS;
          const points = arcToPoints(
            center.cx, center.cy, center.rx, center.ry,
            phi, center.theta1, center.dtheta, steps
          );
          // Build polyline approximation
          let totalLen = 0;
          const cumLengths = [0];
          for (let i = 1; i < points.length; i++) {
            totalLen += dist(points[i - 1], points[i]);
            cumLengths.push(totalLen);
          }
          segments.push({
            start,
            end,
            length: totalLen,
            pointAtLength: (t) => polylinePointAt(points, cumLengths, totalLen, t),
            tangentAtLength: (t) => polylineTangentAt(points, cumLengths, totalLen, t),
          });
        }

        cx = ex;
        cy = ey;
        lastCommand = 'A';
        break;
      }

      case 'Z': {
        const end: Point = { x: subpathStartX, y: subpathStartY };
        const segLen = dist(start, end);
        if (segLen > 0) {
          segments.push({
            start,
            end,
            length: segLen,
            pointAtLength: (t) => lerpPoint(start, end, t),
            tangentAtLength: () => {
              const d = segLen;
              return { x: (end.x - start.x) / d, y: (end.y - start.y) / d };
            },
          });
        }
        cx = subpathStartX;
        cy = subpathStartY;
        lastCommand = 'Z';
        break;
      }
    }
  }

  return segments;
}

// ---- LUT (look-up table) for curves ----

interface CurveLUT {
  totalLength: number;
  cumLengths: number[];
}

function buildCubicLUT(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point
): CurveLUT {
  let totalLength = 0;
  const cumLengths = [0];
  let prev = p0;
  for (let i = 1; i <= CURVE_STEPS; i++) {
    const t = i / CURVE_STEPS;
    const pt = cubicBezierPoint(p0, p1, p2, p3, t);
    totalLength += dist(prev, pt);
    cumLengths.push(totalLength);
    prev = pt;
  }
  return { totalLength, cumLengths };
}

function buildQuadLUT(
  p0: Point,
  p1: Point,
  p2: Point
): CurveLUT {
  let totalLength = 0;
  const cumLengths = [0];
  let prev = p0;
  for (let i = 1; i <= CURVE_STEPS; i++) {
    const t = i / CURVE_STEPS;
    const pt = quadBezierPoint(p0, p1, p2, t);
    totalLength += dist(prev, pt);
    cumLengths.push(totalLength);
    prev = pt;
  }
  return { totalLength, cumLengths };
}

// Map a normalized t (0..1 in arc-length) back to the curve parameter
function lengthToParam(lut: CurveLUT, t: number): number {
  const targetLen = t * lut.totalLength;
  const n = lut.cumLengths.length - 1;

  // Binary search
  let lo = 0;
  let hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (lut.cumLengths[mid] < targetLen) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  if (lo === 0) return 0;
  const segStart = lut.cumLengths[lo - 1];
  const segEnd = lut.cumLengths[lo];
  const segLen = segEnd - segStart;
  const frac = segLen > 0 ? (targetLen - segStart) / segLen : 0;

  return (lo - 1 + frac) / n;
}

function cubicPointFromLUT(
  lut: CurveLUT, t: number,
  p0: Point, p1: Point, p2: Point, p3: Point
): Point {
  const param = lengthToParam(lut, t);
  return cubicBezierPoint(p0, p1, p2, p3, param);
}

function cubicTangentFromLUT(
  lut: CurveLUT, t: number,
  p0: Point, p1: Point, p2: Point, p3: Point
): Point {
  const param = lengthToParam(lut, t);
  return cubicBezierTangent(p0, p1, p2, p3, param);
}

function quadPointFromLUT(
  lut: CurveLUT, t: number,
  p0: Point, p1: Point, p2: Point
): Point {
  const param = lengthToParam(lut, t);
  return quadBezierPoint(p0, p1, p2, param);
}

function quadTangentFromLUT(
  lut: CurveLUT, t: number,
  p0: Point, p1: Point, p2: Point
): Point {
  const param = lengthToParam(lut, t);
  return quadBezierTangent(p0, p1, p2, param);
}

// ---- Polyline helpers for arc segments ----

function polylinePointAt(
  points: Point[],
  cumLengths: number[],
  totalLength: number,
  t: number
): Point {
  if (totalLength === 0 || points.length === 0) return points[0] ?? { x: 0, y: 0 };
  const targetLen = t * totalLength;
  for (let i = 1; i < cumLengths.length; i++) {
    if (cumLengths[i] >= targetLen) {
      const segLen = cumLengths[i] - cumLengths[i - 1];
      const frac = segLen > 0 ? (targetLen - cumLengths[i - 1]) / segLen : 0;
      return lerpPoint(points[i - 1], points[i], frac);
    }
  }
  return points[points.length - 1];
}

function polylineTangentAt(
  points: Point[],
  cumLengths: number[],
  totalLength: number,
  t: number
): Point {
  if (totalLength === 0 || points.length < 2) return { x: 1, y: 0 };
  const targetLen = t * totalLength;
  for (let i = 1; i < cumLengths.length; i++) {
    if (cumLengths[i] >= targetLen) {
      const d = dist(points[i - 1], points[i]);
      if (d === 0) return { x: 1, y: 0 };
      return {
        x: (points[i].x - points[i - 1].x) / d,
        y: (points[i].y - points[i - 1].y) / d,
      };
    }
  }
  const last = points.length - 1;
  const d = dist(points[last - 1], points[last]);
  if (d === 0) return { x: 1, y: 0 };
  return {
    x: (points[last].x - points[last - 1].x) / d,
    y: (points[last].y - points[last - 1].y) / d,
  };
}

// ---- Cached segment builder ----

function getSegments(d: string): Segment[] {
  const commands = toAbsolute(parsePath(d));
  return buildSegments(commands);
}

function getTotalLength(segments: Segment[]): number {
  let total = 0;
  for (const seg of segments) {
    total += seg.length;
  }
  return total;
}

function findSegmentAtLength(
  segments: Segment[],
  targetLength: number
): { segment: Segment; t: number } | null {
  if (segments.length === 0) return null;
  let accum = 0;
  for (const seg of segments) {
    if (accum + seg.length >= targetLength) {
      const localLen = targetLength - accum;
      const t = seg.length > 0 ? localLen / seg.length : 0;
      return { segment: seg, t: Math.max(0, Math.min(1, t)) };
    }
    accum += seg.length;
  }
  // Past end -> return end of last segment
  const last = segments[segments.length - 1];
  return { segment: last, t: 1 };
}

// ==== Public API ====

/**
 * Animate SVG path drawing from invisible (progress=0) to fully drawn (progress=1).
 * Returns stroke-dasharray and stroke-dashoffset values to apply to an SVG element.
 */
export function evolvePath(
  d: string,
  progress: number
): { d: string; strokeDasharray: string; strokeDashoffset: number } {
  const length = getLength(d);
  const clampedProgress = Math.max(0, Math.min(1, progress));
  return {
    d,
    strokeDasharray: `${roundNum(length)}`,
    strokeDashoffset: length * (1 - clampedProgress),
  };
}

/**
 * Calculate total length of an SVG path string.
 */
export function getLength(d: string): number {
  if (!d || d.trim().length === 0) return 0;
  const segments = getSegments(d);
  return getTotalLength(segments);
}

/**
 * Get coordinates at a specific length along the path.
 */
export function getPointAtLength(
  d: string,
  length: number
): { x: number; y: number } {
  if (!d || d.trim().length === 0) return { x: 0, y: 0 };
  const segments = getSegments(d);
  const totalLength = getTotalLength(segments);
  const clampedLength = Math.max(0, Math.min(totalLength, length));
  const result = findSegmentAtLength(segments, clampedLength);
  if (!result) return { x: 0, y: 0 };
  return result.segment.pointAtLength(result.t);
}

/**
 * Get tangent vector (unit length) at a specific length along the path.
 */
export function getTangentAtLength(
  d: string,
  length: number
): { x: number; y: number } {
  if (!d || d.trim().length === 0) return { x: 0, y: 0 };
  const segments = getSegments(d);
  const totalLength = getTotalLength(segments);
  const clampedLength = Math.max(0, Math.min(totalLength, length));
  const result = findSegmentAtLength(segments, clampedLength);
  if (!result) return { x: 0, y: 0 };
  return result.segment.tangentAtLength(result.t);
}

/**
 * Calculate bounding box of a path.
 */
export function getBoundingBox(
  d: string
): { x: number; y: number; width: number; height: number } {
  if (!d || d.trim().length === 0) return { x: 0, y: 0, width: 0, height: 0 };

  const segments = getSegments(d);
  if (segments.length === 0) {
    // Might be a single M command
    const commands = toAbsolute(parsePath(d));
    for (const cmd of commands) {
      if (cmd.command === 'M') {
        return { x: cmd.args[0], y: cmd.args[1], width: 0, height: 0 };
      }
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  function updateBounds(p: Point) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  // Sample each segment
  const sampleCount = 32;
  for (const seg of segments) {
    updateBounds(seg.start);
    updateBounds(seg.end);
    for (let i = 1; i < sampleCount; i++) {
      const t = i / sampleCount;
      updateBounds(seg.pointAtLength(t));
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Scale all coordinates in a path.
 */
export function scalePath(
  d: string,
  scaleX: number,
  scaleY?: number
): string {
  if (!d || d.trim().length === 0) return d;
  const sy = scaleY ?? scaleX;
  const commands = parsePath(d);
  const scaled: PathCommand[] = [];

  for (const { command, args } of commands) {
    const upper = command.toUpperCase();

    switch (upper) {
      case 'M':
      case 'L':
      case 'T':
        scaled.push({
          command,
          args: [args[0] * scaleX, args[1] * sy],
        });
        break;

      case 'H':
        scaled.push({ command, args: [args[0] * scaleX] });
        break;

      case 'V':
        scaled.push({ command, args: [args[0] * sy] });
        break;

      case 'C':
        scaled.push({
          command,
          args: [
            args[0] * scaleX, args[1] * sy,
            args[2] * scaleX, args[3] * sy,
            args[4] * scaleX, args[5] * sy,
          ],
        });
        break;

      case 'S':
      case 'Q':
        scaled.push({
          command,
          args: [
            args[0] * scaleX, args[1] * sy,
            args[2] * scaleX, args[3] * sy,
          ],
        });
        break;

      case 'A':
        scaled.push({
          command,
          args: [
            args[0] * scaleX,
            args[1] * sy,
            args[2],
            args[3],
            args[4],
            args[5] * scaleX,
            args[6] * sy,
          ],
        });
        break;

      case 'Z':
        scaled.push({ command, args: [] });
        break;

      default:
        scaled.push({ command, args: [...args] });
        break;
    }
  }

  return serializePath(scaled);
}

/**
 * Translate all coordinates in a path.
 */
export function translatePath(d: string, dx: number, dy: number): string {
  if (!d || d.trim().length === 0) return d;
  const commands = parsePath(d);
  const translated: PathCommand[] = [];

  for (const { command, args } of commands) {
    const upper = command.toUpperCase();
    const isRelative = command !== upper;

    // Relative commands don't need translation (offsets stay the same)
    if (isRelative || upper === 'Z') {
      translated.push({ command, args: [...args] });
      continue;
    }

    switch (upper) {
      case 'M':
      case 'L':
      case 'T':
        translated.push({
          command,
          args: [args[0] + dx, args[1] + dy],
        });
        break;

      case 'H':
        translated.push({ command, args: [args[0] + dx] });
        break;

      case 'V':
        translated.push({ command, args: [args[0] + dy] });
        break;

      case 'C':
        translated.push({
          command,
          args: [
            args[0] + dx, args[1] + dy,
            args[2] + dx, args[3] + dy,
            args[4] + dx, args[5] + dy,
          ],
        });
        break;

      case 'S':
      case 'Q':
        translated.push({
          command,
          args: [
            args[0] + dx, args[1] + dy,
            args[2] + dx, args[3] + dy,
          ],
        });
        break;

      case 'A':
        translated.push({
          command,
          args: [
            args[0], args[1], args[2], args[3], args[4],
            args[5] + dx,
            args[6] + dy,
          ],
        });
        break;

      default:
        translated.push({ command, args: [...args] });
        break;
    }
  }

  return serializePath(translated);
}

/**
 * Translate path so it starts at (0, 0).
 */
export function resetPath(d: string): string {
  if (!d || d.trim().length === 0) return d;
  const commands = toAbsolute(parsePath(d));
  // Find first M
  for (const cmd of commands) {
    if (cmd.command === 'M') {
      return translatePath(
        serializePath(commands),
        -cmd.args[0],
        -cmd.args[1]
      );
    }
  }
  return d;
}

/**
 * Reverse drawing direction of a path.
 */
export function reversePath(d: string): string {
  if (!d || d.trim().length === 0) return d;

  // Work with absolute, normalized commands
  const commands = toAbsolute(parsePath(d));
  if (commands.length === 0) return d;

  // Build list of points and corresponding commands
  // Strategy: trace through the path collecting endpoints, then rebuild reversed
  const points: Point[] = [];
  const segCommands: PathCommand[] = [];
  let cx = 0;
  let cy = 0;
  let subpathStartX = 0;
  let subpathStartY = 0;
  let hasClose = false;

  for (const { command, args } of commands) {
    switch (command) {
      case 'M':
        cx = args[0];
        cy = args[1];
        subpathStartX = cx;
        subpathStartY = cy;
        points.push({ x: cx, y: cy });
        segCommands.push({ command: 'M', args: [cx, cy] });
        break;

      case 'L':
        cx = args[0];
        cy = args[1];
        points.push({ x: cx, y: cy });
        segCommands.push({ command: 'L', args: [cx, cy] });
        break;

      case 'H':
        cx = args[0];
        points.push({ x: cx, y: cy });
        segCommands.push({ command: 'L', args: [cx, cy] });
        break;

      case 'V':
        cy = args[0];
        points.push({ x: cx, y: cy });
        segCommands.push({ command: 'L', args: [cx, cy] });
        break;

      case 'C':
        points.push({ x: args[4], y: args[5] });
        segCommands.push({
          command: 'C',
          args: [args[2], args[3], args[0], args[1], cx, cy],
        });
        cx = args[4];
        cy = args[5];
        break;

      case 'Q':
        points.push({ x: args[2], y: args[3] });
        segCommands.push({
          command: 'Q',
          args: [args[0], args[1], cx, cy],
        });
        cx = args[2];
        cy = args[3];
        break;

      case 'Z':
        hasClose = true;
        if (cx !== subpathStartX || cy !== subpathStartY) {
          points.push({ x: subpathStartX, y: subpathStartY });
          segCommands.push({ command: 'L', args: [subpathStartX, subpathStartY] });
        }
        cx = subpathStartX;
        cy = subpathStartY;
        break;

      default:
        // For S, T, A -- convert to approximate lines for simplicity in reversal
        // This is a simplification but handles most practical cases
        points.push({ x: cx, y: cy });
        segCommands.push({ command, args: [...args] });
        break;
    }
  }

  // Build reversed path
  const reversed: PathCommand[] = [];
  if (points.length === 0) return d;

  // Start at the last point
  const lastPt = points[points.length - 1];
  reversed.push({ command: 'M', args: [lastPt.x, lastPt.y] });

  // Walk segment commands in reverse
  for (let i = segCommands.length - 1; i >= 1; i--) {
    const cmd = segCommands[i];
    if (cmd.command === 'M') continue;

    if (cmd.command === 'C') {
      // Already swapped control points during collection
      const prevPt = points[i - 1];
      reversed.push({
        command: 'C',
        args: [cmd.args[0], cmd.args[1], cmd.args[2], cmd.args[3], prevPt.x, prevPt.y],
      });
    } else if (cmd.command === 'Q') {
      const prevPt = points[i - 1];
      reversed.push({
        command: 'Q',
        args: [cmd.args[0], cmd.args[1], prevPt.x, prevPt.y],
      });
    } else if (cmd.command === 'L') {
      const prevPt = points[i - 1];
      reversed.push({ command: 'L', args: [prevPt.x, prevPt.y] });
    } else {
      const prevPt = points[i - 1];
      reversed.push({ command: 'L', args: [prevPt.x, prevPt.y] });
    }
  }

  if (hasClose) {
    reversed.push({ command: 'Z', args: [] });
  }

  return serializePath(reversed);
}

/**
 * Morph between two SVG paths by linearly interpolating coordinates.
 * If command counts differ, the shorter path is padded by repeating its last point.
 */
export function interpolatePath(
  progress: number,
  d1: string,
  d2: string
): string {
  if (!d1 || !d2) return d1 || d2 || '';

  const cmds1 = toAbsolute(parsePath(d1));
  const cmds2 = toAbsolute(parsePath(d2));

  // Normalize both to same length by padding shorter
  const maxLen = Math.max(cmds1.length, cmds2.length);
  while (cmds1.length < maxLen) {
    const last = cmds1[cmds1.length - 1];
    if (last) {
      cmds1.push({ command: last.command, args: [...last.args] });
    } else {
      cmds1.push({ command: 'M', args: [0, 0] });
    }
  }
  while (cmds2.length < maxLen) {
    const last = cmds2[cmds2.length - 1];
    if (last) {
      cmds2.push({ command: last.command, args: [...last.args] });
    } else {
      cmds2.push({ command: 'M', args: [0, 0] });
    }
  }

  const t = Math.max(0, Math.min(1, progress));
  const result: PathCommand[] = [];

  for (let i = 0; i < maxLen; i++) {
    const c1 = cmds1[i];
    const c2 = cmds2[i];

    // Use command from first path (or second if first is Z with no args to interpolate)
    const cmd = c1.command === 'Z' && c2.command !== 'Z' ? c2.command : c1.command;

    if (cmd === 'Z') {
      result.push({ command: 'Z', args: [] });
      continue;
    }

    // Interpolate args
    const argCount = Math.max(c1.args.length, c2.args.length);
    const args: number[] = [];
    for (let j = 0; j < argCount; j++) {
      const a = j < c1.args.length ? c1.args[j] : 0;
      const b = j < c2.args.length ? c2.args[j] : 0;
      args.push(lerp(a, b, t));
    }

    result.push({ command: cmd, args });
  }

  return serializePath(result);
}

/**
 * Split a path into individual subpaths (one per M command).
 */
export function getSubpaths(d: string): string[] {
  if (!d || d.trim().length === 0) return [];
  const commands = parsePath(d);
  const subpaths: PathCommand[][] = [];
  let current: PathCommand[] = [];

  for (const cmd of commands) {
    if (cmd.command === 'M' || cmd.command === 'm') {
      if (current.length > 0) {
        subpaths.push(current);
      }
      current = [cmd];
    } else {
      current.push(cmd);
    }
  }

  if (current.length > 0) {
    subpaths.push(current);
  }

  return subpaths.map(serializePath);
}

/**
 * Convert all relative commands to absolute commands.
 */
export function normalizePath(d: string): string {
  if (!d || d.trim().length === 0) return d;
  return serializePath(toAbsolute(parsePath(d)));
}
