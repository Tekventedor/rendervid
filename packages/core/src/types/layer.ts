import type { Animation } from './animation';
import type { LayerStyle } from './style';
import type { Filter } from './filter';
import type { ThreeLayer } from './three';
import type { MotionBlurConfig } from './motion-blur';
import type { AudioEffect, VolumeKeyframe } from './audio-effects';

/**
 * Available layer types.
 */
export type LayerType =
  | 'image'
  | 'video'
  | 'text'
  | 'shape'
  | 'audio'
  | 'group'
  | 'lottie'
  | 'custom'
  | 'three'
  | 'gif'
  | 'canvas';

/**
 * Position in 2D space.
 */
export interface Position {
  /** X coordinate in pixels */
  x: number;
  /** Y coordinate in pixels */
  y: number;
}

/**
 * Size dimensions.
 */
export interface Size {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
}

/**
 * Scale multiplier.
 */
export interface Scale {
  /** X scale (1 = 100%) */
  x: number;
  /** Y scale (1 = 100%) */
  y: number;
}

/**
 * Anchor point (0-1 range).
 */
export interface Anchor {
  /** X anchor (0.5 = center) */
  x: number;
  /** Y anchor (0.5 = center) */
  y: number;
}

/**
 * Shadow effect.
 */
export interface Shadow {
  /** Shadow color */
  color: string;
  /** Blur radius in pixels */
  blur: number;
  /** X offset in pixels */
  offsetX: number;
  /** Y offset in pixels */
  offsetY: number;
}

/**
 * Blend modes for layer compositing.
 */
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion';

// ═══════════════════════════════════════════════════════════════
// LAYER PROPS BY TYPE
// ═══════════════════════════════════════════════════════════════

/**
 * Image fit modes.
 */
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none';

/**
 * Props for image layer.
 */
export interface ImageLayerProps {
  /** Image source URL */
  src: string;
  /** How image fits in bounds */
  fit?: ImageFit;
  /** Object position (CSS value) */
  objectPosition?: string;
}

/**
 * Video fit modes.
 */
export type VideoFit = 'cover' | 'contain' | 'fill';

/**
 * Props for video layer.
 */
export interface VideoLayerProps {
  /** Video source URL */
  src: string;
  /** How video fits in bounds */
  fit?: VideoFit;
  /** Loop video playback */
  loop?: boolean;
  /** Mute audio */
  muted?: boolean;
  /** Playback speed (1 = normal) */
  playbackRate?: number;
  /** Start time in video (seconds) */
  startTime?: number;
  /** End time in video (seconds) */
  endTime?: number;
  /** Volume (0-1) */
  volume?: number;
}

/**
 * Text alignment options.
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Vertical alignment options.
 */
export type VerticalAlign = 'top' | 'middle' | 'bottom';

/**
 * Font weight options.
 */
export type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

/**
 * Text stroke configuration.
 */
export interface TextStroke {
  /** Stroke color */
  color: string;
  /** Stroke width in pixels */
  width: number;
}

/**
 * Text shadow configuration.
 */
export interface TextShadow {
  /** Shadow color */
  color: string;
  /** Blur radius */
  blur: number;
  /** X offset */
  offsetX: number;
  /** Y offset */
  offsetY: number;
}

/**
 * Padding configuration.
 */
export type Padding = number | {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/**
 * Styled text span for rich text.
 */
export interface TextSpan {
  /** Text content for this span */
  text: string;
  /** Override font family */
  fontFamily?: string;
  /** Override font size */
  fontSize?: number;
  /** Override font weight */
  fontWeight?: FontWeight;
  /** Override font style */
  fontStyle?: 'normal' | 'italic';
  /** Override text color */
  color?: string;
  /** Override letter spacing */
  letterSpacing?: number;
  /** Background color for this span (highlight effect) */
  backgroundColor?: string;
  /** Override text decoration */
  textDecoration?: 'none' | 'underline' | 'line-through';
  /** Override text stroke */
  stroke?: TextStroke;
  /** Override text shadow */
  textShadow?: TextShadow;
}

/**
 * Props for text layer.
 */
export interface TextLayerProps {
  /** Text content */
  text: string;
  /** Font family */
  fontFamily?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight */
  fontWeight?: FontWeight;
  /** Font style */
  fontStyle?: 'normal' | 'italic';
  /** Text color */
  color?: string;
  /** Horizontal alignment */
  textAlign?: TextAlign;
  /** Vertical alignment */
  verticalAlign?: VerticalAlign;
  /** Line height multiplier */
  lineHeight?: number;
  /** Letter spacing in pixels */
  letterSpacing?: number;
  /** Text transform */
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Text decoration */
  textDecoration?: 'none' | 'underline' | 'line-through';
  /** Text stroke */
  stroke?: TextStroke;
  /** Text shadow */
  textShadow?: TextShadow;
  /** Background color */
  backgroundColor?: string;
  /** Padding */
  padding?: Padding;
  /** Border radius */
  borderRadius?: number;
  /** Maximum lines (ellipsis if exceeded) */
  maxLines?: number;
  /** Overflow behavior */
  overflow?: 'visible' | 'hidden' | 'ellipsis';
  /** Rich text spans — if provided, overrides the `text` property */
  spans?: TextSpan[];
}

/**
 * Shape types.
 */
export type ShapeType = 'rectangle' | 'ellipse' | 'polygon' | 'star' | 'path';

/**
 * Gradient stop.
 */
export interface GradientStop {
  /** Offset (0-1) */
  offset: number;
  /** Color at this stop */
  color: string;
}

/**
 * Gradient configuration.
 */
export interface Gradient {
  /** Gradient type */
  type: 'linear' | 'radial';
  /** Color stops */
  colors: GradientStop[];
  /** Angle in degrees (for linear) */
  angle?: number;
}

/**
 * Props for shape layer.
 */
export interface ShapeLayerProps {
  /** Shape type */
  shape: ShapeType;
  /** Fill color */
  fill?: string;
  /** Fill gradient */
  gradient?: Gradient;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Stroke dash array */
  strokeDash?: number[];
  /** Border radius (for rectangle) */
  borderRadius?: number;
  /** Number of sides (for polygon) */
  sides?: number;
  /** Number of points (for star) */
  points?: number;
  /** Inner radius ratio (for star, 0-1) */
  innerRadius?: number;
  /** SVG path data (for path type) */
  pathData?: string;
}

/**
 * Props for audio layer.
 */
export interface AudioLayerProps {
  /** Audio source URL */
  src: string;
  /** Volume (0-1) */
  volume?: number;
  /** Loop audio */
  loop?: boolean;
  /** Start time in audio (seconds) */
  startTime?: number;
  /** Fade in duration (frames) */
  fadeIn?: number;
  /** Fade out duration (frames) */
  fadeOut?: number;
  /** Audio effects chain */
  effects?: AudioEffect[];
  /** Stereo pan position (-1 = full left, 0 = center, 1 = full right) */
  pan?: number;
  /** Volume automation keyframes */
  volumeEnvelope?: VolumeKeyframe[];
}

/**
 * Props for group layer.
 */
export interface GroupLayerProps {
  /** Clip children to group bounds */
  clip?: boolean;
}

/**
 * Props for Lottie animation layer.
 */
export interface LottieLayerProps {
  /** Lottie JSON data or URL */
  data: object | string;
  /** Loop animation */
  loop?: boolean;
  /** Playback speed multiplier */
  speed?: number;
  /** Play direction (1 = forward, -1 = reverse) */
  direction?: 1 | -1;
}

/**
 * Props for custom component layer.
 */
export interface CustomLayerProps {
  /** Component props */
  [key: string]: unknown;
}

/**
 * Props for GIF layer.
 */
export interface GifLayerProps {
  /** GIF source URL or data URI */
  src: string;
  /** Image fit mode */
  fit?: ImageFit;
  /** Whether to loop the GIF (default true) */
  loop?: boolean;
  /** Playback speed multiplier (default 1) */
  speed?: number;
  /** Start from specific frame (default 0) */
  startFrame?: number;
}

/**
 * Canvas drawing command types.
 */
export type CanvasDrawCommandType =
  | 'path'
  | 'gradient'
  | 'textOnPath'
  | 'pattern'
  | 'clipPath'
  | 'circle'
  | 'rect'
  | 'line';

/**
 * A single canvas drawing command.
 */
export interface CanvasDrawCommand {
  /** Type of drawing command */
  type: CanvasDrawCommandType;
  /** SVG path data (for path, textOnPath, clipPath) */
  pathData?: string;
  /** Fill color or gradient reference */
  fill?: string;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Stroke dash array */
  strokeDash?: number[];
  /** Stroke line cap */
  lineCap?: 'butt' | 'round' | 'square';
  /** Stroke line join */
  lineJoin?: 'miter' | 'round' | 'bevel';
  /** Text content (for textOnPath) */
  text?: string;
  /** Font size (for textOnPath) */
  fontSize?: number;
  /** Font family (for textOnPath) */
  fontFamily?: string;
  /** Gradient configuration (for gradient) */
  gradient?: CanvasGradientConfig;
  /** Circle center x (for circle) */
  cx?: number;
  /** Circle center y (for circle) */
  cy?: number;
  /** Circle radius (for circle) */
  r?: number;
  /** Rectangle x (for rect) */
  x?: number;
  /** Rectangle y (for rect) */
  y?: number;
  /** Rectangle width (for rect) */
  width?: number;
  /** Rectangle height (for rect) */
  height?: number;
  /** Rectangle border radius (for rect) */
  borderRadius?: number;
  /** Line start x (for line) */
  x1?: number;
  /** Line start y (for line) */
  y1?: number;
  /** Line end x (for line) */
  x2?: number;
  /** Line end y (for line) */
  y2?: number;
  /** Opacity (0-1) */
  opacity?: number;
}

/**
 * Gradient types for canvas drawing.
 */
export type CanvasGradientType = 'linear' | 'radial' | 'conic';

/**
 * Canvas gradient stop.
 */
export interface CanvasGradientStop {
  /** Offset (0-1) */
  offset: number;
  /** Color at this stop */
  color: string;
}

/**
 * Canvas gradient configuration.
 */
export interface CanvasGradientConfig {
  /** Gradient type */
  type: CanvasGradientType;
  /** Color stops */
  stops: CanvasGradientStop[];
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
 * Props for canvas layer.
 */
export interface CanvasLayerProps {
  /** Array of drawing commands to execute */
  commands: CanvasDrawCommand[];
  /** Background color */
  backgroundColor?: string;
  /** Whether to anti-alias (default true) */
  antialias?: boolean;
}

/**
 * Union of all layer props.
 */
export type LayerProps =
  | ImageLayerProps
  | VideoLayerProps
  | TextLayerProps
  | ShapeLayerProps
  | AudioLayerProps
  | GroupLayerProps
  | LottieLayerProps
  | CustomLayerProps
  | GifLayerProps
  | CanvasLayerProps;

/**
 * Custom component reference.
 */
export interface CustomComponentRef {
  /** Component name (from template.customComponents or registry) */
  name: string;
  /** Props to pass to the component */
  props: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════
// LAYER BASE
// ═══════════════════════════════════════════════════════════════

/**
 * Base layer interface with common properties.
 */
export interface LayerBase {
  /** Unique layer identifier */
  id: string;

  /** Layer type */
  type: LayerType;

  /** Display name */
  name?: string;

  // Transform
  /** Position relative to scene */
  position: Position;
  /** Layer dimensions */
  size: Size;
  /** Rotation in degrees */
  rotation?: number;
  /** Scale multiplier */
  scale?: Scale;
  /** Anchor point (0-1, default 0.5,0.5 = center) */
  anchor?: Anchor;

  // Timing
  /** Start frame within scene (relative to scene start) */
  from?: number;
  /** Duration in frames (-1 for entire scene) */
  duration?: number;

  // Appearance
  /** Opacity (0-1) */
  opacity?: number;
  /** Blend mode */
  blendMode?: BlendMode;
  /** CSS filters */
  filters?: Filter[];
  /** Drop shadow */
  shadow?: Shadow;
  /** Clip to SVG path */
  clipPath?: string;
  /** Mask layer ID */
  maskLayer?: string;

  // Styling
  /** Tailwind-like style properties */
  style?: LayerStyle;
  /** Tailwind class names */
  className?: string;

  // Input binding
  /** Bind layer property to input */
  inputKey?: string;
  /** Which property to bind (default depends on layer type) */
  inputProperty?: string;

  // Animations
  /** Animations applied to this layer */
  animations?: Animation[];

  // Motion Blur
  /** Motion blur configuration (layer-level override) */
  motionBlur?: MotionBlurConfig;

  // Metadata
  /** Layer is locked in editor */
  locked?: boolean;
  /** Layer is hidden */
  hidden?: boolean;
}

/**
 * Image layer.
 */
export interface ImageLayer extends LayerBase {
  type: 'image';
  props: ImageLayerProps;
}

/**
 * Video layer.
 */
export interface VideoLayer extends LayerBase {
  type: 'video';
  props: VideoLayerProps;
}

/**
 * Text layer.
 */
export interface TextLayer extends LayerBase {
  type: 'text';
  props: TextLayerProps;
}

/**
 * Shape layer.
 */
export interface ShapeLayer extends LayerBase {
  type: 'shape';
  props: ShapeLayerProps;
}

/**
 * Audio layer.
 */
export interface AudioLayer extends LayerBase {
  type: 'audio';
  props: AudioLayerProps;
}

/**
 * Group layer with children.
 */
export interface GroupLayer extends LayerBase {
  type: 'group';
  props: GroupLayerProps;
  /** Child layers */
  children: Layer[];
}

/**
 * Lottie animation layer.
 */
export interface LottieLayer extends LayerBase {
  type: 'lottie';
  props: LottieLayerProps;
}

/**
 * Custom React component layer.
 */
export interface CustomLayer extends LayerBase {
  type: 'custom';
  props: CustomLayerProps;
  /** Reference to custom React component */
  customComponent: CustomComponentRef;
}

/**
 * GIF layer.
 */
export interface GifLayer extends LayerBase {
  type: 'gif';
  props: GifLayerProps;
}

/**
 * Canvas layer.
 */
export interface CanvasLayer extends LayerBase {
  type: 'canvas';
  props: CanvasLayerProps;
}

/**
 * Union of all layer types.
 */
export type Layer =
  | ImageLayer
  | VideoLayer
  | TextLayer
  | ShapeLayer
  | AudioLayer
  | GroupLayer
  | LottieLayer
  | CustomLayer
  | ThreeLayer
  | GifLayer
  | CanvasLayer;
