import type {
  Template,
  Layer,
  Scene,
  Animation,
  Keyframe,
  TextLayer,
  ShapeLayer,
  ImageLayer,
  GroupLayer,
  Gradient,
  Size,
} from '../types';
import { TemplateProcessor } from '../template/TemplateProcessor';
import { generatePresetKeyframes, getPreset } from '../animation/presets';
import { getPropertiesAtFrame } from '../animation/interpolation';

// Number of sample points for baking easing into CSS keyframes
const SAMPLE_COUNT = 20;

const UNSUPPORTED_TYPES = ['video', 'audio', 'lottie', 'custom', 'three'] as const;

const UNSUPPORTED_REASONS: Record<string, string> = {
  video: 'Video playback cannot be represented in static SVG',
  audio: 'Audio has no visual representation in SVG',
  lottie: 'Lottie animations require a dedicated runtime player',
  custom: 'Custom React components cannot be serialized to SVG',
  three: 'Three.js 3D scenes require WebGL which is not available in SVG',
};

/**
 * Information about a layer that could not be rendered in the SVG export.
 */
export interface UnsupportedLayerInfo {
  /** Layer ID */
  id: string;
  /** Layer name (if set) */
  name?: string;
  /** Layer type (e.g. 'video', 'audio', 'three') */
  type: string;
  /** Human-readable reason why this layer cannot be rendered */
  reason: string;
}

/**
 * Result of an SVG export operation.
 */
export interface SvgExportResult {
  /** The generated SVG markup */
  svg: string;
  /** Layers that were skipped because they cannot be represented in SVG */
  unsupportedLayers: UnsupportedLayerInfo[];
}

/**
 * Export a template as an animated SVG string.
 *
 * Converts supported layers (text, shape, image, group) into SVG elements
 * and bakes animations into CSS @keyframes with percentage stops so that
 * all easing functions (including elastic, bounce, spring) are faithfully
 * reproduced.
 *
 * Unsupported layer types (video, audio, lottie, custom, three) are
 * skipped with a comment in the output. Information about skipped layers
 * is returned in the result's `unsupportedLayers` array.
 */
export function exportAnimatedSvg(
  template: Template,
  inputs?: Record<string, unknown>,
): SvgExportResult {
  // Resolve inputs if provided
  let resolved = template;
  if (inputs && Object.keys(inputs).length > 0) {
    const processor = new TemplateProcessor();
    resolved = processor.resolveInputs(template, inputs);
  }

  const { width, height } = resolved.output;
  const fps = resolved.output.fps ?? 30;
  const bgColor = resolved.output.backgroundColor ?? '#000000';

  const defs: string[] = [];
  const styles: string[] = [];
  const elements: string[] = [];
  const unsupportedLayers: UnsupportedLayerInfo[] = [];
  let idCounter = 0;
  const nextId = () => `rv-${++idCounter}`;

  // Iterate scenes
  for (const scene of resolved.composition.scenes) {
    const sceneOffsetSec = scene.startFrame / fps;
    const sceneDurationFrames = scene.endFrame - scene.startFrame;

    // Scene background
    if (scene.backgroundColor) {
      const sceneStart = scene.startFrame / fps;
      const sceneDur = sceneDurationFrames / fps;
      const bgId = nextId();
      elements.push(
        `  <rect id="${bgId}" x="0" y="0" width="${width}" height="${height}" fill="${esc(scene.backgroundColor)}" opacity="0">` +
        `<animate attributeName="opacity" from="1" to="1" begin="${round(sceneStart)}s" dur="${round(sceneDur)}s" fill="freeze" />` +
        `</rect>`,
      );
    }

    for (const layer of scene.layers) {
      convertLayer(layer, scene, sceneOffsetSec, sceneDurationFrames, fps, { width, height }, defs, styles, elements, unsupportedLayers);
    }
  }

  // Assemble SVG
  const defsBlock = defs.length > 0 ? `  <defs>\n${defs.join('\n')}\n  </defs>\n` : '';
  const styleBlock = styles.length > 0 ? `  <style>\n${styles.join('\n')}\n  </style>\n` : '';

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
    `  <rect width="${width}" height="${height}" fill="${esc(bgColor)}" />`,
    defsBlock,
    styleBlock,
    elements.join('\n'),
    `</svg>`,
  ].filter(Boolean).join('\n');

  return { svg, unsupportedLayers };
}

// ─── Layer converters ────────────────────────────────────────

function convertLayer(
  layer: Layer,
  scene: Scene,
  sceneOffsetSec: number,
  sceneDurationFrames: number,
  fps: number,
  canvasSize: Size,
  defs: string[],
  styles: string[],
  elements: string[],
  unsupportedLayers: UnsupportedLayerInfo[],
): void {
  // Skip unsupported types
  if ((UNSUPPORTED_TYPES as readonly string[]).includes(layer.type)) {
    elements.push(`  <!-- Unsupported layer type "${layer.type}" (${esc(layer.name ?? layer.id)}) -->`);
    unsupportedLayers.push({
      id: layer.id,
      name: layer.name,
      type: layer.type,
      reason: UNSUPPORTED_REASONS[layer.type] ?? `Layer type "${layer.type}" is not supported in SVG export`,
    });
    return;
  }

  // Skip hidden layers
  if (layer.hidden) return;

  const layerId = sanitizeId(layer.id);
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const x = layer.position.x - layer.size.width * anchor.x;
  const y = layer.position.y - layer.size.height * anchor.y;
  const baseOpacity = layer.opacity ?? 1;
  const baseRotation = layer.rotation ?? 0;
  const baseScaleX = layer.scale?.x ?? 1;
  const baseScaleY = layer.scale?.y ?? 1;

  let content: string;
  switch (layer.type) {
    case 'text':
      content = convertTextLayer(layer as TextLayer, defs, layerId);
      break;
    case 'shape':
      content = convertShapeLayer(layer as ShapeLayer, defs, layerId);
      break;
    case 'image':
      content = convertImageLayer(layer as ImageLayer);
      break;
    case 'group':
      content = convertGroupLayer(layer as GroupLayer, scene, sceneOffsetSec, sceneDurationFrames, fps, canvasSize, defs, styles, unsupportedLayers);
      break;
    default:
      return;
  }

  // Anchor for transform-origin
  const anchorPxX = layer.size.width * anchor.x;
  const anchorPxY = layer.size.height * anchor.y;
  const transformOrigin = `${anchorPxX}px ${anchorPxY}px`;
  const baseTransform = buildTransform(0, 0, baseScaleX, baseScaleY, baseRotation);

  // Generate animation CSS
  const anims = layer.animations ?? [];
  const animRules: string[] = [];

  for (let ai = 0; ai < anims.length; ai++) {
    const anim = anims[ai];
    const animId = `${layerId}-anim-${ai}`;
    const result = generateAnimationCSS(anim, animId, fps, canvasSize);
    if (result) {
      styles.push(result.keyframes);
      animRules.push(result.rule(sceneOffsetSec));
    }
  }

  // Layer visibility based on from/duration
  const layerFrom = layer.from ?? 0;
  const layerDuration = layer.duration === undefined || layer.duration === -1
    ? sceneDurationFrames - layerFrom
    : layer.duration;
  const visStart = (scene.startFrame + layerFrom) / fps;
  const visDur = layerDuration / fps;

  // Build CSS for this layer
  const cssRules: string[] = [];
  cssRules.push(`      transform-origin: ${transformOrigin};`);
  cssRules.push(`      transform: ${baseTransform};`);
  cssRules.push(`      opacity: ${baseOpacity};`);

  // Visibility: hide before start and after end if layer doesn't span full scene
  if (layerFrom > 0 || layerDuration < sceneDurationFrames) {
    cssRules.push(`      visibility: hidden;`);
    const visAnimId = `${layerId}-vis`;
    styles.push(
      `    @keyframes ${visAnimId} {\n` +
      `      0%, 100% { visibility: visible; }\n` +
      `    }`,
    );
    animRules.push(
      `${visAnimId} ${round(visDur)}s ${round(visStart)}s 1 linear forwards`,
    );
  }

  if (animRules.length > 0) {
    cssRules.push(`      animation: ${animRules.join(', ')};`);
  }

  styles.push(`    #${layerId} {\n${cssRules.join('\n')}\n    }`);

  elements.push(
    `  <g id="${layerId}" transform="translate(${round(x)}, ${round(y)})">`,
    `    ${content}`,
    `  </g>`,
  );
}

// ─── Text layer ──────────────────────────────────────────────

function convertTextLayer(layer: TextLayer, defs: string[], layerId: string): string {
  const props = layer.props;
  const fontSize = props.fontSize ?? 16;
  const fontFamily = props.fontFamily ?? 'sans-serif';
  const fontWeight = props.fontWeight ?? 'normal';
  const fontStyle = props.fontStyle ?? 'normal';
  const color = props.color ?? '#ffffff';
  const textAlign = props.textAlign ?? 'left';
  const lineHeight = props.lineHeight ?? 1.2;
  const letterSpacing = props.letterSpacing ?? 0;

  const textAnchor = textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start';
  const textX = textAlign === 'center' ? layer.size.width / 2 : textAlign === 'right' ? layer.size.width : 0;

  // Split text into lines
  const lines = props.text.split('\n');
  const lineSpacing = fontSize * lineHeight;

  // Vertical positioning
  const verticalAlign = props.verticalAlign ?? 'top';
  const totalTextHeight = lines.length * lineSpacing;
  let startY: number;
  if (verticalAlign === 'middle') {
    startY = (layer.size.height - totalTextHeight) / 2 + fontSize;
  } else if (verticalAlign === 'bottom') {
    startY = layer.size.height - totalTextHeight + fontSize;
  } else {
    startY = fontSize;
  }

  const tspans = lines.map((line, i) =>
    `<tspan x="${textX}" dy="${i === 0 ? 0 : lineSpacing}">${esc(line)}</tspan>`,
  ).join('');

  const attrs: string[] = [
    `font-family="${esc(fontFamily)}"`,
    `font-size="${fontSize}"`,
    `font-weight="${fontWeight}"`,
    `font-style="${fontStyle}"`,
    `fill="${esc(color)}"`,
    `text-anchor="${textAnchor}"`,
  ];

  if (letterSpacing) {
    attrs.push(`letter-spacing="${letterSpacing}"`);
  }

  let strokeAttrs = '';
  if (props.stroke) {
    strokeAttrs = ` stroke="${esc(props.stroke.color)}" stroke-width="${props.stroke.width}" paint-order="stroke"`;
  }

  // Text shadow via filter
  let filterId = '';
  if (props.textShadow) {
    filterId = `${layerId}-shadow`;
    const ts = props.textShadow as unknown;
    let dx = 0, dy = 0, blurVal = 0, shadowColor = 'rgba(0,0,0,0.5)';
    if (typeof ts === 'string') {
      // Parse CSS text-shadow: "offsetX offsetY blur color"
      const m = ts.match(/^([\d.-]+)\w*\s+([\d.-]+)\w*\s+([\d.-]+)\w*\s+(.+)$/);
      if (m) {
        dx = parseFloat(m[1]);
        dy = parseFloat(m[2]);
        blurVal = parseFloat(m[3]);
        shadowColor = m[4];
      }
    } else if (typeof ts === 'object' && ts !== null) {
      const obj = ts as { offsetX?: number; offsetY?: number; blur?: number; color?: string };
      dx = obj.offsetX ?? 0;
      dy = obj.offsetY ?? 0;
      blurVal = obj.blur ?? 0;
      shadowColor = obj.color ?? 'rgba(0,0,0,0.5)';
    }
    defs.push(
      `    <filter id="${filterId}">` +
      `<feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${blurVal / 2}" flood-color="${esc(shadowColor)}" />` +
      `</filter>`,
    );
  }

  // Background rect
  let bgRect = '';
  if (props.backgroundColor) {
    const padding = typeof props.padding === 'number' ? props.padding : 0;
    const br = props.borderRadius ?? 0;
    bgRect = `<rect x="${-padding}" y="${-padding}" width="${layer.size.width + padding * 2}" height="${layer.size.height + padding * 2}" rx="${br}" ry="${br}" fill="${esc(props.backgroundColor)}" />`;
  }

  const filterRef = filterId ? ` filter="url(#${filterId})"` : '';

  return `${bgRect}<text y="${startY}" ${attrs.join(' ')}${strokeAttrs}${filterRef}>${tspans}</text>`;
}

// ─── Shape layer ─────────────────────────────────────────────

function convertShapeLayer(layer: ShapeLayer, defs: string[], layerId: string): string {
  const props = layer.props;
  const { width, height } = layer.size;
  const gradientId = `${layerId}-grad`;

  let fillValue: string;
  if (props.gradient) {
    defs.push(createGradientDef(props.gradient, gradientId));
    fillValue = `url(#${gradientId})`;
  } else {
    fillValue = props.fill ?? 'transparent';
  }

  const stroke = props.stroke ? ` stroke="${esc(props.stroke)}"` : '';
  const strokeWidth = props.strokeWidth ? ` stroke-width="${props.strokeWidth}"` : '';
  const strokeDash = props.strokeDash ? ` stroke-dasharray="${props.strokeDash.join(' ')}"` : '';
  const common = `fill="${esc(fillValue)}"${stroke}${strokeWidth}${strokeDash}`;

  const sw = props.strokeWidth ?? 0;

  switch (props.shape) {
    case 'rectangle': {
      const br = props.borderRadius ?? 0;
      return `<rect x="${sw / 2}" y="${sw / 2}" width="${width - sw}" height="${height - sw}" rx="${br}" ry="${br}" ${common} />`;
    }
    case 'ellipse':
      return `<ellipse cx="${width / 2}" cy="${height / 2}" rx="${(width - sw) / 2}" ry="${(height - sw) / 2}" ${common} />`;
    case 'polygon': {
      const sides = props.sides ?? 6;
      const pts = generatePolygonPoints(sides, width, height);
      return `<polygon points="${pts}" ${common} />`;
    }
    case 'star': {
      const numPoints = props.points ?? 5;
      const innerRadius = props.innerRadius ?? 0.5;
      const pts = generateStarPoints(numPoints, width, height, innerRadius);
      return `<polygon points="${pts}" ${common} />`;
    }
    case 'path':
      return `<path d="${esc(props.pathData ?? '')}" ${common} />`;
    default:
      return `<rect width="${width}" height="${height}" ${common} />`;
  }
}

// ─── Image layer ─────────────────────────────────────────────

function convertImageLayer(layer: ImageLayer): string {
  const { width, height } = layer.size;
  const fit = layer.props.fit ?? 'cover';
  const preserveAspectRatio =
    fit === 'cover' ? 'xMidYMid slice' :
    fit === 'contain' ? 'xMidYMid meet' :
    fit === 'fill' ? 'none' :
    'xMidYMid slice';

  return `<image href="${esc(layer.props.src)}" width="${width}" height="${height}" preserveAspectRatio="${preserveAspectRatio}" />`;
}

// ─── Group layer ─────────────────────────────────────────────

function convertGroupLayer(
  layer: GroupLayer,
  scene: Scene,
  sceneOffsetSec: number,
  sceneDurationFrames: number,
  fps: number,
  canvasSize: Size,
  defs: string[],
  styles: string[],
  unsupportedLayers: UnsupportedLayerInfo[],
): string {
  const childElements: string[] = [];
  for (const child of layer.children) {
    convertLayer(child, scene, sceneOffsetSec, sceneDurationFrames, fps, canvasSize, defs, styles, childElements, unsupportedLayers);
  }
  return childElements.join('\n    ');
}

// ─── Animation CSS generation ────────────────────────────────

interface AnimationCSSResult {
  keyframes: string;
  rule: (sceneOffsetSec: number) => string;
}

function generateAnimationCSS(
  anim: Animation,
  animId: string,
  fps: number,
  canvasSize: Size,
): AnimationCSSResult | null {
  const duration = anim.duration;
  if (duration <= 0) return null;

  // Get keyframes
  let kfs: Keyframe[];
  if (anim.type === 'keyframe' && anim.keyframes) {
    kfs = anim.keyframes;
  } else if (anim.effect) {
    kfs = generatePresetKeyframes(anim.effect, {
      duration,
      easing: anim.easing,
      canvasSize,
    });
    if (kfs.length === 0) return null;
  } else {
    return null;
  }

  // Sample the animation at N points using the interpolation engine
  const stops: string[] = [];
  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const frame = (i / SAMPLE_COUNT) * duration;
    const props = getPropertiesAtFrame(kfs, frame);
    const pct = Math.round((i / SAMPLE_COUNT) * 100);

    const transformParts: string[] = [];
    if (props.x !== undefined || props.y !== undefined) {
      transformParts.push(`translate(${round(props.x ?? 0)}px, ${round(props.y ?? 0)}px)`);
    }
    if (props.scaleX !== undefined || props.scaleY !== undefined) {
      transformParts.push(`scale(${round(props.scaleX ?? 1)}, ${round(props.scaleY ?? 1)})`);
    }
    if (props.rotation !== undefined) {
      transformParts.push(`rotate(${round(props.rotation)}deg)`);
    }

    const cssParts: string[] = [];
    if (transformParts.length > 0) {
      cssParts.push(`transform: ${transformParts.join(' ')}`);
    }
    if (props.opacity !== undefined) {
      cssParts.push(`opacity: ${round(props.opacity)}`);
    }

    if (cssParts.length > 0) {
      stops.push(`      ${pct}% { ${cssParts.join('; ')}; }`);
    }
  }

  if (stops.length === 0) return null;

  const keyframesCSS = `    @keyframes ${animId} {\n${stops.join('\n')}\n    }`;

  const durSec = duration / fps;
  const delaySec = (anim.delay ?? 0) / fps;
  const iterations = anim.loop === -1 ? 'infinite' : String(anim.loop ?? 1);
  const direction = anim.alternate ? 'alternate' : 'normal';

  // Determine fill mode based on animation type
  const preset = anim.effect ? getPreset(anim.effect) : undefined;
  const animType = preset?.type ?? anim.type;
  const fillMode = animType === 'emphasis' ? 'none' : 'forwards';

  return {
    keyframes: keyframesCSS,
    rule: (sceneOffsetSec: number) => {
      const totalDelay = sceneOffsetSec + delaySec;
      return `${animId} ${round(durSec)}s ${round(totalDelay)}s linear ${iterations} ${direction} ${fillMode}`;
    },
  };
}

// ─── Shape geometry helpers (mirrored from ShapeLayer.tsx) ────

function generatePolygonPoints(sides: number, width: number, height: number): string {
  const pts: string[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const px = centerX + radius * Math.cos(angle);
    const py = centerY + radius * Math.sin(angle);
    pts.push(`${round(px)},${round(py)}`);
  }
  return pts.join(' ');
}

function generateStarPoints(
  numPoints: number,
  width: number,
  height: number,
  innerRadius: number,
): string {
  const result: string[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2;
  const inner = outerRadius * innerRadius;

  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (i * Math.PI) / numPoints - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : inner;
    const px = centerX + r * Math.cos(angle);
    const py = centerY + r * Math.sin(angle);
    result.push(`${round(px)},${round(py)}`);
  }
  return result.join(' ');
}

function createGradientDef(gradient: Gradient, id: string): string {
  const { type, colors, angle = 0 } = gradient;

  if (type === 'radial') {
    const stops = colors.map(
      (stop) => `<stop offset="${stop.offset * 100}%" stop-color="${esc(stop.color)}" />`,
    ).join('');
    return `    <radialGradient id="${id}" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`;
  }

  // Linear gradient
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 + Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 - Math.sin(rad) * 50;

  const stops = colors.map(
    (stop) => `<stop offset="${stop.offset * 100}%" stop-color="${esc(stop.color)}" />`,
  ).join('');
  return `    <linearGradient id="${id}" x1="${round(x1)}%" y1="${round(y1)}%" x2="${round(x2)}%" y2="${round(y2)}%">${stops}</linearGradient>`;
}

// ─── Utilities ───────────────────────────────────────────────

function buildTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number): string {
  const parts: string[] = [];
  if (x !== 0 || y !== 0) parts.push(`translate(${round(x)}px, ${round(y)}px)`);
  if (scaleX !== 1 || scaleY !== 1) parts.push(`scale(${round(scaleX)}, ${round(scaleY)})`);
  if (rotation !== 0) parts.push(`rotate(${round(rotation)}deg)`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function esc(s: unknown): string {
  const str = String(s ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_');
}
