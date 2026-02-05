import { CSSProperties } from 'react';

/**
 * Animation type categories.
 */
type AnimationType = 'entrance' | 'exit' | 'emphasis' | 'keyframe';
/**
 * Entrance animation presets.
 */
type EntranceAnimation = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'slideInFromTopLeft' | 'slideInFromTopRight' | 'slideInFromBottomLeft' | 'slideInFromBottomRight' | 'scaleIn' | 'scaleInUp' | 'scaleInDown' | 'zoomIn' | 'rotateIn' | 'rotateInClockwise' | 'rotateInCounterClockwise' | 'bounceIn' | 'bounceInUp' | 'bounceInDown' | 'flipInX' | 'flipInY' | 'rollIn' | 'lightSpeedIn' | 'swingIn' | 'backIn' | 'elasticIn' | 'typewriter' | 'revealLeft' | 'revealRight' | 'revealUp' | 'revealDown';
/**
 * Exit animation presets.
 */
type ExitAnimation = 'fadeOut' | 'fadeOutUp' | 'fadeOutDown' | 'fadeOutLeft' | 'fadeOutRight' | 'slideOutUp' | 'slideOutDown' | 'slideOutLeft' | 'slideOutRight' | 'scaleOut' | 'zoomOut' | 'rotateOut' | 'bounceOut' | 'flipOutX' | 'flipOutY' | 'rollOut' | 'lightSpeedOut' | 'swingOut' | 'backOut' | 'elasticOut';
/**
 * Emphasis animation presets (can loop).
 */
type EmphasisAnimation = 'pulse' | 'float' | 'heartbeat' | 'shake' | 'bounce' | 'swing' | 'wobble' | 'flash' | 'tada' | 'rubberBand' | 'jello' | 'spin';
/**
 * All animation preset names.
 */
type AnimationPreset = EntranceAnimation | ExitAnimation | EmphasisAnimation;
/**
 * Easing function names.
 */
type EasingName = 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint' | 'easeInSine' | 'easeOutSine' | 'easeInOutSine' | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo' | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc' | 'easeInBack' | 'easeOutBack' | 'easeInOutBack' | 'easeInElastic' | 'easeOutElastic' | 'easeInOutElastic' | 'easeInBounce' | 'easeOutBounce' | 'easeInOutBounce';
/**
 * Easing value can be a preset name, cubic-bezier, or spring.
 * @example 'easeOutCubic'
 * @example 'cubic-bezier(0.25, 0.1, 0.25, 1)'
 * @example 'spring(1, 100, 10)'
 */
type Easing = EasingName | string;
/**
 * Animatable properties that can be keyframed.
 */
interface AnimatableProperties {
    /** X position */
    x?: number;
    /** Y position */
    y?: number;
    /** X scale */
    scaleX?: number;
    /** Y scale */
    scaleY?: number;
    /** Rotation in degrees */
    rotation?: number;
    /** Opacity (0-1) */
    opacity?: number;
    /** Additional numeric properties */
    [key: string]: number | undefined;
}
/**
 * Keyframe definition.
 */
interface Keyframe {
    /**
     * Frame number (relative to animation start)
     */
    frame: number;
    /**
     * Properties at this keyframe
     */
    properties: AnimatableProperties;
    /**
     * Easing to next keyframe
     * @default 'linear'
     */
    easing?: Easing;
}
/**
 * Animation definition.
 *
 * @example Preset animation:
 * ```typescript
 * const fadeIn: Animation = {
 *   type: 'entrance',
 *   effect: 'fadeInUp',
 *   duration: 30,
 *   easing: 'easeOutCubic',
 * };
 * ```
 *
 * @example Keyframe animation:
 * ```typescript
 * const custom: Animation = {
 *   type: 'keyframe',
 *   duration: 60,
 *   keyframes: [
 *     { frame: 0, properties: { opacity: 0, y: 50 } },
 *     { frame: 30, properties: { opacity: 1, y: 0 }, easing: 'easeOutCubic' },
 *     { frame: 60, properties: { opacity: 1, y: 0 } },
 *   ],
 * };
 * ```
 */
interface Animation {
    /**
     * Animation type category
     */
    type: AnimationType;
    /**
     * Effect name (for preset animations)
     */
    effect?: AnimationPreset | string;
    /**
     * Duration in frames
     */
    duration: number;
    /**
     * Delay before animation starts (frames)
     * @default 0
     */
    delay?: number;
    /**
     * Easing function
     * @default 'easeOutCubic' for entrance, 'easeInCubic' for exit
     */
    easing?: Easing;
    /**
     * Keyframes (for keyframe type)
     */
    keyframes?: Keyframe[];
    /**
     * Loop count (-1 for infinite)
     * @default 1
     */
    loop?: number;
    /**
     * Alternate direction on loop
     * @default false
     */
    alternate?: boolean;
}
/**
 * Compiled animation for efficient playback.
 * Pre-calculates all frame values.
 */
interface CompiledAnimation {
    /** Total duration in frames */
    totalFrames: number;
    /** Get properties at a specific frame */
    getPropertiesAtFrame(frame: number): AnimatableProperties;
}
/**
 * Easing function type.
 * Takes progress (0-1) and returns eased value (0-1).
 */
type EasingFunction = (t: number) => number;

/**
 * Shadow preset values (Tailwind-like).
 */
type ShadowPreset = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
/**
 * Blur preset values (Tailwind-like).
 */
type BlurPreset = 'sm' | 'md' | 'lg';
/**
 * Background gradient configuration.
 */
interface BackgroundGradient {
    /** Gradient type */
    type: 'linear' | 'radial' | 'conic';
    /** Start color */
    from: string;
    /** Middle color (optional) */
    via?: string;
    /** End color */
    to: string;
    /** Direction in degrees (for linear) */
    direction?: number;
}
/**
 * Layer style properties (Tailwind-like utilities).
 *
 * These properties are resolved to CSS at render time.
 * Use `className` for actual Tailwind classes if Tailwind is configured.
 *
 * @example
 * ```typescript
 * const style: LayerStyle = {
 *   padding: 16,
 *   borderRadius: 'lg',
 *   boxShadow: '2xl',
 *   backgroundGradient: {
 *     type: 'linear',
 *     from: '#ff0000',
 *     to: '#0000ff',
 *     direction: 45,
 *   },
 * };
 * ```
 */
interface LayerStyle {
    /** Padding (px or Tailwind value like 'p-4') */
    padding?: string | number;
    /** Horizontal padding */
    paddingX?: string | number;
    /** Vertical padding */
    paddingY?: string | number;
    /** Top padding */
    paddingTop?: string | number;
    /** Right padding */
    paddingRight?: string | number;
    /** Bottom padding */
    paddingBottom?: string | number;
    /** Left padding */
    paddingLeft?: string | number;
    /** Margin */
    margin?: string | number;
    /** Horizontal margin */
    marginX?: string | number;
    /** Vertical margin */
    marginY?: string | number;
    /** Border radius (px or preset like 'lg', 'full') */
    borderRadius?: string | number;
    /** Top-left border radius */
    borderTopLeftRadius?: string | number;
    /** Top-right border radius */
    borderTopRightRadius?: string | number;
    /** Bottom-right border radius */
    borderBottomRightRadius?: string | number;
    /** Bottom-left border radius */
    borderBottomLeftRadius?: string | number;
    /** Border width */
    borderWidth?: number;
    /** Border color */
    borderColor?: string;
    /** Border style */
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
    /** Box shadow (preset or CSS value) */
    boxShadow?: ShadowPreset | string;
    /** Background color */
    backgroundColor?: string;
    /** Background gradient */
    backgroundGradient?: BackgroundGradient;
    /** Background image URL */
    backgroundImage?: string;
    /** Background size */
    backgroundSize?: 'cover' | 'contain' | 'auto' | string;
    /** Background position */
    backgroundPosition?: string;
    /** Backdrop blur (preset or px) */
    backdropBlur?: BlurPreset | number;
    /** Font family */
    fontFamily?: string;
    /** Font size (px or preset) */
    fontSize?: string | number;
    /** Font weight */
    fontWeight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black' | number;
    /** Line height */
    lineHeight?: string | number;
    /** Letter spacing */
    letterSpacing?: string | number;
    /** Text alignment */
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    /** Text color */
    textColor?: string;
    /** Text shadow (CSS value) */
    textShadow?: string;
    /** Text decoration */
    textDecoration?: 'none' | 'underline' | 'line-through';
    /** Text transform */
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    /** Word break */
    wordBreak?: 'normal' | 'break-all' | 'break-word';
    /** White space handling */
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
    /** Display type */
    display?: 'flex' | 'grid' | 'block' | 'inline' | 'inline-flex' | 'inline-block' | 'none';
    /** Flex direction */
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    /** Flex wrap */
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    /** Justify content */
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    /** Align items */
    alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    /** Align content */
    alignContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    /** Gap between items */
    gap?: string | number;
    /** Row gap */
    rowGap?: string | number;
    /** Column gap */
    columnGap?: string | number;
    /** Blur (preset or px) */
    blur?: BlurPreset | number;
    /** Brightness (0-200, 100 = normal) */
    brightness?: number;
    /** Contrast (0-200, 100 = normal) */
    contrast?: number;
    /** Grayscale (0-100) */
    grayscale?: number;
    /** Saturation (0-200, 100 = normal) */
    saturate?: number;
    /** Sepia (0-100) */
    sepia?: number;
    /** Hue rotation (0-360 degrees) */
    hueRotate?: number;
    /** Invert (0-100) */
    invert?: number;
    /** Overflow behavior */
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
    /** Horizontal overflow */
    overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
    /** Vertical overflow */
    overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
    /**
     * Pass-through raw CSS properties.
     * Use for properties not covered by LayerStyle.
     */
    css?: CSSProperties;
}
/**
 * Resolved style ready for rendering.
 */
interface ResolvedStyle {
    /** Tailwind class names (if using Tailwind) */
    className: string;
    /** Inline CSS properties */
    style: CSSProperties;
}

/**
 * Filter types available for layers.
 */
type FilterType = 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'hue-rotate' | 'invert' | 'opacity' | 'saturate' | 'sepia' | 'drop-shadow';
/**
 * Filter animation configuration.
 */
interface FilterAnimation {
    /** Starting value */
    from: number;
    /** Ending value */
    to: number;
    /** Duration in frames */
    duration: number;
    /** Easing function */
    easing?: string;
}
/**
 * CSS filter definition.
 *
 * @example Blur filter:
 * ```typescript
 * { type: 'blur', value: 5 }  // 5px blur
 * ```
 *
 * @example Animated filter:
 * ```typescript
 * {
 *   type: 'brightness',
 *   value: 1,
 *   animate: {
 *     from: 0.5,
 *     to: 1.5,
 *     duration: 60,
 *     easing: 'easeInOutSine',
 *   },
 * }
 * ```
 */
interface Filter {
    /**
     * Filter type
     */
    type: FilterType;
    /**
     * Filter value.
     * - blur: pixels
     * - brightness: multiplier (1 = normal)
     * - contrast: multiplier (1 = normal)
     * - grayscale: percentage (0-100)
     * - hue-rotate: degrees (0-360)
     * - invert: percentage (0-100)
     * - opacity: multiplier (0-1)
     * - saturate: multiplier (1 = normal)
     * - sepia: percentage (0-100)
     * - drop-shadow: CSS shadow string
     */
    value: number | string;
    /**
     * Animate filter over time
     */
    animate?: FilterAnimation;
}
/**
 * Convert filter to CSS filter function string.
 */
declare function filterToCSS(filter: Filter): string;
/**
 * Convert multiple filters to CSS filter string.
 */
declare function filtersToCSS(filters: Filter[]): string;

/**
 * Available layer types.
 */
type LayerType = 'image' | 'video' | 'text' | 'shape' | 'audio' | 'group' | 'lottie' | 'custom';
/**
 * Position in 2D space.
 */
interface Position {
    /** X coordinate in pixels */
    x: number;
    /** Y coordinate in pixels */
    y: number;
}
/**
 * Size dimensions.
 */
interface Size {
    /** Width in pixels */
    width: number;
    /** Height in pixels */
    height: number;
}
/**
 * Scale multiplier.
 */
interface Scale {
    /** X scale (1 = 100%) */
    x: number;
    /** Y scale (1 = 100%) */
    y: number;
}
/**
 * Anchor point (0-1 range).
 */
interface Anchor {
    /** X anchor (0.5 = center) */
    x: number;
    /** Y anchor (0.5 = center) */
    y: number;
}
/**
 * Shadow effect.
 */
interface Shadow {
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
type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion';
/**
 * Image fit modes.
 */
type ImageFit = 'cover' | 'contain' | 'fill' | 'none';
/**
 * Props for image layer.
 */
interface ImageLayerProps {
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
type VideoFit = 'cover' | 'contain' | 'fill';
/**
 * Props for video layer.
 */
interface VideoLayerProps {
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
type TextAlign = 'left' | 'center' | 'right' | 'justify';
/**
 * Vertical alignment options.
 */
type VerticalAlign = 'top' | 'middle' | 'bottom';
/**
 * Font weight options.
 */
type FontWeight$1 = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
/**
 * Text stroke configuration.
 */
interface TextStroke {
    /** Stroke color */
    color: string;
    /** Stroke width in pixels */
    width: number;
}
/**
 * Text shadow configuration.
 */
interface TextShadow {
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
type Padding = number | {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
/**
 * Props for text layer.
 */
interface TextLayerProps {
    /** Text content */
    text: string;
    /** Font family */
    fontFamily?: string;
    /** Font size in pixels */
    fontSize?: number;
    /** Font weight */
    fontWeight?: FontWeight$1;
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
}
/**
 * Shape types.
 */
type ShapeType = 'rectangle' | 'ellipse' | 'polygon' | 'star' | 'path';
/**
 * Gradient stop.
 */
interface GradientStop {
    /** Offset (0-1) */
    offset: number;
    /** Color at this stop */
    color: string;
}
/**
 * Gradient configuration.
 */
interface Gradient {
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
interface ShapeLayerProps {
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
interface AudioLayerProps {
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
}
/**
 * Props for group layer.
 */
interface GroupLayerProps {
    /** Clip children to group bounds */
    clip?: boolean;
}
/**
 * Props for Lottie animation layer.
 */
interface LottieLayerProps {
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
interface CustomLayerProps {
    /** Component props */
    [key: string]: unknown;
}
/**
 * Union of all layer props.
 */
type LayerProps = ImageLayerProps | VideoLayerProps | TextLayerProps | ShapeLayerProps | AudioLayerProps | GroupLayerProps | LottieLayerProps | CustomLayerProps;
/**
 * Custom component reference.
 */
interface CustomComponentRef {
    /** Component name (from template.customComponents or registry) */
    name: string;
    /** Props to pass to the component */
    props: Record<string, unknown>;
}
/**
 * Base layer interface with common properties.
 */
interface LayerBase {
    /** Unique layer identifier */
    id: string;
    /** Layer type */
    type: LayerType;
    /** Display name */
    name?: string;
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
    /** Start frame within scene (relative to scene start) */
    from?: number;
    /** Duration in frames (-1 for entire scene) */
    duration?: number;
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
    /** Tailwind-like style properties */
    style?: LayerStyle;
    /** Tailwind class names */
    className?: string;
    /** Bind layer property to input */
    inputKey?: string;
    /** Which property to bind (default depends on layer type) */
    inputProperty?: string;
    /** Animations applied to this layer */
    animations?: Animation[];
    /** Layer is locked in editor */
    locked?: boolean;
    /** Layer is hidden */
    hidden?: boolean;
}
/**
 * Image layer.
 */
interface ImageLayer extends LayerBase {
    type: 'image';
    props: ImageLayerProps;
}
/**
 * Video layer.
 */
interface VideoLayer extends LayerBase {
    type: 'video';
    props: VideoLayerProps;
}
/**
 * Text layer.
 */
interface TextLayer extends LayerBase {
    type: 'text';
    props: TextLayerProps;
}
/**
 * Shape layer.
 */
interface ShapeLayer extends LayerBase {
    type: 'shape';
    props: ShapeLayerProps;
}
/**
 * Audio layer.
 */
interface AudioLayer extends LayerBase {
    type: 'audio';
    props: AudioLayerProps;
}
/**
 * Group layer with children.
 */
interface GroupLayer extends LayerBase {
    type: 'group';
    props: GroupLayerProps;
    /** Child layers */
    children: Layer[];
}
/**
 * Lottie animation layer.
 */
interface LottieLayer extends LayerBase {
    type: 'lottie';
    props: LottieLayerProps;
}
/**
 * Custom React component layer.
 */
interface CustomLayer extends LayerBase {
    type: 'custom';
    props: CustomLayerProps;
    /** Reference to custom React component */
    customComponent: CustomComponentRef;
}
/**
 * Union of all layer types.
 */
type Layer = ImageLayer | VideoLayer | TextLayer | ShapeLayer | AudioLayer | GroupLayer | LottieLayer | CustomLayer;

/**
 * Scene transition types.
 */
type TransitionType = 'cut' | 'fade' | 'slide' | 'wipe' | 'zoom' | 'rotate' | 'flip' | 'blur' | 'circle' | 'push' | 'crosszoom' | 'glitch' | 'dissolve' | 'cube' | 'swirl' | 'diagonal-wipe' | 'iris';
/**
 * Transition direction.
 */
type TransitionDirection = 'left' | 'right' | 'up' | 'down';
/**
 * Scene transition configuration.
 */
interface SceneTransition {
    /** Transition type */
    type: TransitionType;
    /** Duration in frames */
    duration: number;
    /** Direction (for directional transitions) */
    direction?: TransitionDirection;
    /** Easing function */
    easing?: string;
}
/**
 * Background image fit modes.
 */
type BackgroundFit = 'cover' | 'contain' | 'fill' | 'none';
/**
 * Scene definition.
 *
 * A scene is a segment of the composition with its own layers and timing.
 *
 * @example
 * ```typescript
 * const scene: Scene = {
 *   id: 'intro',
 *   name: 'Introduction',
 *   startFrame: 0,
 *   endFrame: 150,
 *   backgroundColor: '#1a1a2e',
 *   layers: [
 *     { id: 'title', type: 'text', ... },
 *   ],
 *   transition: {
 *     type: 'fade',
 *     duration: 30,
 *   },
 * };
 * ```
 */
interface Scene {
    /**
     * Unique scene identifier
     */
    id: string;
    /**
     * Display name
     */
    name?: string;
    /**
     * Start frame (0-based, inclusive)
     */
    startFrame: number;
    /**
     * End frame (exclusive)
     */
    endFrame: number;
    /**
     * Scene background color
     */
    backgroundColor?: string;
    /**
     * Scene background image URL
     */
    backgroundImage?: string;
    /**
     * Background image fit mode
     */
    backgroundFit?: BackgroundFit;
    /**
     * Scene background video URL
     */
    backgroundVideo?: string;
    /**
     * Transition to next scene
     */
    transition?: SceneTransition;
    /**
     * Layers in this scene
     */
    layers: Layer[];
}
/**
 * Asset type.
 */
type AssetType = 'image' | 'video' | 'audio' | 'font' | 'lottie';
/**
 * Asset definition for preloading.
 */
interface AssetDefinition {
    /** Unique asset ID */
    id: string;
    /** Asset type */
    type: AssetType;
    /** Asset URL */
    url: string;
    /** Optional display name */
    name?: string;
}
/**
 * Composition containing scenes and assets.
 *
 * @example
 * ```typescript
 * const composition: Composition = {
 *   scenes: [
 *     { id: 'scene1', startFrame: 0, endFrame: 100, layers: [] },
 *     { id: 'scene2', startFrame: 100, endFrame: 200, layers: [] },
 *   ],
 *   assets: [
 *     { id: 'logo', type: 'image', url: '/logo.png' },
 *   ],
 * };
 * ```
 */
interface Composition {
    /**
     * Scenes in the composition.
     * Scenes should not overlap and should be in chronological order.
     */
    scenes: Scene[];
    /**
     * Global assets to preload before rendering.
     */
    assets?: AssetDefinition[];
}
/**
 * Calculate total duration from scenes.
 */
declare function getCompositionDuration(composition: Composition): number;
/**
 * Get scene at a specific frame.
 */
declare function getSceneAtFrame(composition: Composition, frame: number): Scene | undefined;
/**
 * Validate scene ordering (no overlaps, chronological).
 */
declare function validateSceneOrder(scenes: Scene[]): boolean;

/**
 * Input data types supported by templates.
 */
type InputType = 'string' | 'number' | 'boolean' | 'color' | 'url' | 'enum' | 'richtext' | 'date' | 'array';
/**
 * Option for enum inputs.
 */
interface EnumOption {
    /** Option value */
    value: string;
    /** Display label */
    label: string;
}
/**
 * Validation rules for inputs.
 */
interface InputValidation {
    /** Minimum string length */
    minLength?: number;
    /** Maximum string length */
    maxLength?: number;
    /** Regex pattern to match */
    pattern?: string;
    /** Minimum numeric value */
    min?: number;
    /** Maximum numeric value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Must be an integer */
    integer?: boolean;
    /** Available options for enum type */
    options?: EnumOption[];
    /** Allowed asset types */
    allowedTypes?: ('image' | 'video' | 'audio' | 'font')[];
    /** Minimum array length */
    minItems?: number;
    /** Maximum array length */
    maxItems?: number;
    /** Schema for array items */
    itemType?: Omit<InputDefinition, 'key' | 'label' | 'required'>;
}
/**
 * UI hints for input rendering.
 */
interface InputUI {
    /** Placeholder text */
    placeholder?: string;
    /** Help text shown below input */
    helpText?: string;
    /** Group name for organizing inputs */
    group?: string;
    /** Display order within group */
    order?: number;
    /** Hide from UI (use default/computed value) */
    hidden?: boolean;
    /** Number of rows for multiline text */
    rows?: number;
    /** File accept attribute for file inputs */
    accept?: string;
}
/**
 * Definition of a template input.
 *
 * Inputs allow templates to be customized at render time.
 * They can be bound to layer properties using `inputKey`.
 *
 * @example
 * ```typescript
 * const titleInput: InputDefinition = {
 *   key: 'title',
 *   type: 'string',
 *   label: 'Title',
 *   description: 'The main title text',
 *   required: true,
 *   default: 'Hello World',
 *   validation: {
 *     minLength: 1,
 *     maxLength: 100,
 *   },
 * };
 * ```
 */
interface InputDefinition {
    /**
     * Unique key for this input.
     * Used to reference the input in layer bindings.
     */
    key: string;
    /**
     * Data type of the input
     */
    type: InputType;
    /**
     * Display label shown in UI
     */
    label: string;
    /**
     * Description for users and AI agents
     */
    description: string;
    /**
     * Whether this input is required
     */
    required: boolean;
    /**
     * Default value if not provided
     */
    default?: unknown;
    /**
     * Validation rules
     */
    validation?: InputValidation;
    /**
     * UI rendering hints
     */
    ui?: InputUI;
}

/**
 * JSON Schema 7 type (simplified).
 * For full typing, use @types/json-schema.
 */
interface JSONSchema7 {
    $id?: string;
    $ref?: string;
    $schema?: string;
    $comment?: string;
    type?: JSONSchema7TypeName | JSONSchema7TypeName[];
    enum?: unknown[];
    const?: unknown;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    items?: JSONSchema7 | JSONSchema7[];
    additionalItems?: JSONSchema7 | boolean;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    contains?: JSONSchema7;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: JSONSchema7 | boolean;
    properties?: Record<string, JSONSchema7>;
    patternProperties?: Record<string, JSONSchema7>;
    propertyNames?: JSONSchema7;
    if?: JSONSchema7;
    then?: JSONSchema7;
    else?: JSONSchema7;
    allOf?: JSONSchema7[];
    anyOf?: JSONSchema7[];
    oneOf?: JSONSchema7[];
    not?: JSONSchema7;
    title?: string;
    description?: string;
    default?: unknown;
    examples?: unknown[];
    definitions?: Record<string, JSONSchema7>;
    $defs?: Record<string, JSONSchema7>;
}
/**
 * JSON Schema 7 type names.
 */
type JSONSchema7TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';

/**
 * Custom component source type.
 */
type ComponentSourceType = 'reference' | 'url' | 'inline';
/**
 * Definition of a custom React component used in a template.
 *
 * @example Reference to pre-registered component:
 * ```typescript
 * const chartComponent: CustomComponentDefinition = {
 *   type: 'reference',
 *   reference: 'AnimatedChart',
 *   description: 'Animated bar/line/pie chart',
 * };
 * ```
 *
 * @example Loading from URL:
 * ```typescript
 * const urlComponent: CustomComponentDefinition = {
 *   type: 'url',
 *   url: 'https://example.com/components/Chart.js',
 *   propsSchema: { ... },
 * };
 * ```
 */
interface CustomComponentDefinition {
    /**
     * Component source type
     */
    type: ComponentSourceType;
    /**
     * Reference to pre-registered component name.
     * Used when type is 'reference'.
     */
    reference?: string;
    /**
     * URL to load component from.
     * Used when type is 'url'.
     */
    url?: string;
    /**
     * Inline component code (for simple components).
     * Used when type is 'inline'.
     * @deprecated Use 'url' or 'reference' for better security
     */
    code?: string;
    /**
     * Props schema for validation.
     * Helps AI agents understand what props are available.
     */
    propsSchema?: JSONSchema7;
    /**
     * Description of what this component does.
     * Used by AI agents and in documentation.
     */
    description?: string;
}
/**
 * Information about a registered component.
 */
interface ComponentInfo {
    /** Component name */
    name: string;
    /** Description of the component */
    description?: string;
    /** Props schema for validation */
    propsSchema?: JSONSchema7;
    /** Example props */
    example?: Record<string, unknown>;
}
/**
 * Generic component type (framework-agnostic).
 * In practice, this will be React.ComponentType<unknown>.
 */
type ComponentType = (props: any) => unknown;
/**
 * Component registry interface.
 */
interface ComponentRegistry {
    /**
     * Register a component.
     * @param name - Unique component name
     * @param component - Component function
     * @param schema - Optional props schema
     */
    register(name: string, component: ComponentType, schema?: JSONSchema7): void;
    /**
     * Get a registered component by name.
     * @param name - Component name
     * @returns The component or undefined if not found
     */
    get(name: string): ComponentType | undefined;
    /**
     * List all registered components.
     * @returns Array of component info
     */
    list(): ComponentInfo[];
    /**
     * Register a component from a URL (dynamic import).
     * @param name - Component name
     * @param url - URL to load from
     */
    registerFromUrl(name: string, url: string): Promise<void>;
    /**
     * Register a component from inline code.
     * @param name - Component name
     * @param code - JavaScript code defining the component
     */
    registerFromCode(name: string, code: string): void;
    /**
     * Unregister a component.
     * @param name - Component name
     * @returns true if component was found and removed
     */
    unregister(name: string): boolean;
    /**
     * Check if a component is registered.
     * @param name - Component name
     */
    has(name: string): boolean;
}

/**
 * Font type definitions for Rendervid
 *
 * Comprehensive type system for font loading, configuration, and management
 * supporting Google Fonts, custom font uploads, and system fonts.
 */
/**
 * Numeric font weights from 100 (Thin) to 900 (Black)
 */
type NumericFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
/**
 * Named font weight aliases for common weights
 */
type NamedFontWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
/**
 * Font weight - supports both numeric values (100-900) and named weights
 */
type FontWeight = NumericFontWeight | NamedFontWeight;
/**
 * Font style - normal or italic
 */
type FontStyle$1 = 'normal' | 'italic';
/**
 * Font category classification
 */
type FontCategory$1 = 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
/**
 * Font loading strategy
 * - eager: Load font immediately when template is parsed
 * - lazy: Load font only when it's about to be rendered
 * - preload: Load font in parallel with other resources using browser preload
 */
type FontLoadingStrategy = 'eager' | 'lazy' | 'preload';
/**
 * Font display strategy for controlling FOIT (Flash of Invisible Text)
 * and FOUT (Flash of Unstyled Text)
 *
 * - swap: Show fallback immediately, swap when font loads (recommended)
 * - block: Hide text briefly, then show with font (can cause FOIT)
 * - fallback: Show fallback if font takes too long
 * - optional: Use font if cached, otherwise use fallback
 * - auto: Browser decides (usually behaves like 'block')
 */
type FontDisplay$1 = 'swap' | 'block' | 'fallback' | 'optional' | 'auto';
/**
 * Font format for web fonts
 */
type FontFormat = 'woff2' | 'woff' | 'ttf' | 'otf' | 'eot';
/**
 * Google Font definition for loading fonts from Google Fonts API
 */
interface GoogleFontDefinition {
    /**
     * Font family name as it appears on Google Fonts
     * @example "Roboto", "Open Sans", "Playfair Display"
     */
    family: string;
    /**
     * Font weights to load (numeric values 100-900)
     * If not specified, defaults to [400] (normal weight)
     * @example [400, 700] // Load normal and bold
     */
    weights?: NumericFontWeight[];
    /**
     * Font styles to load
     * If not specified, defaults to ['normal']
     * @example ['normal', 'italic']
     */
    styles?: FontStyle$1[];
    /**
     * Character subsets to include
     * Common options: 'latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'
     * If not specified, defaults to ['latin']
     * @example ['latin', 'latin-ext']
     */
    subsets?: string[];
    /**
     * Font display strategy
     * Controls how the font behaves while loading
     * @default 'swap'
     */
    display?: FontDisplay$1;
    /**
     * Optional text parameter for font subsetting
     * When provided, Google Fonts will return a subset containing only these characters
     * Significantly reduces file size for specific use cases
     * @example "Hello World" // Only load glyphs for these characters
     */
    text?: string;
    /**
     * Whether this is a variable font
     * Variable fonts support a range of weights/styles in a single file
     */
    variable?: boolean;
}
/**
 * Custom font definition for uploaded or externally hosted fonts
 */
interface CustomFontDefinition {
    /**
     * Font family name to use in CSS
     * @example "MyBrandFont", "CustomSerif"
     */
    family: string;
    /**
     * URL or upload ID for the font file
     * Can be:
     * - Full URL: "https://cdn.example.com/fonts/mybrand.woff2"
     * - Upload ID: "upload_abc123" (resolved by font manager)
     * - Data URI: "data:font/woff2;base64,..."
     */
    source: string;
    /**
     * Font weight this file represents
     * @default 400
     */
    weight?: NumericFontWeight;
    /**
     * Font style this file represents
     * @default 'normal'
     */
    style?: FontStyle$1;
    /**
     * Font file format
     * Used to generate proper @font-face src with format() hint
     * @default 'woff2'
     */
    format?: FontFormat;
    /**
     * Font display strategy
     * @default 'swap'
     */
    display?: FontDisplay$1;
    /**
     * Unicode range this font covers
     * Allows browsers to only download fonts for the characters actually used
     * @example "U+0000-00FF, U+0131, U+0152-0153"
     */
    unicodeRange?: string;
    /**
     * Optional descriptors for font-face rule
     * Can include font-stretch, font-feature-settings, etc.
     */
    descriptors?: Record<string, string>;
}
/**
 * License information for fonts
 */
interface LicenseInfo {
    /**
     * License type
     */
    type: 'OFL' | 'Apache' | 'MIT' | 'proprietary' | 'custom';
    /**
     * URL to full license text
     */
    url: string;
    /**
     * Whether commercial use is allowed
     */
    allowsCommercial: boolean;
    /**
     * Whether attribution is required
     */
    requiresAttribution: boolean;
    /**
     * Any specific restrictions or requirements
     * @example ["Cannot sell fonts standalone", "Must include copyright notice"]
     */
    restrictions?: string[];
}
/**
 * Font metadata catalog entry
 *
 * Contains comprehensive information about a font for discovery,
 * preview, and proper loading configuration.
 */
interface FontMetadata$1 {
    /**
     * Font family name
     */
    family: string;
    /**
     * Font category classification
     */
    category: FontCategory$1;
    /**
     * Available font weights
     * @example [100, 300, 400, 700, 900]
     */
    variants: NumericFontWeight[];
    /**
     * Available font styles
     * @example ['normal', 'italic']
     */
    styles: FontStyle$1[];
    /**
     * Available character subsets
     * @example ['latin', 'latin-ext', 'cyrillic', 'greek']
     */
    subsets: string[];
    /**
     * Preview text to demonstrate the font
     * @example "The quick brown fox jumps over the lazy dog"
     */
    preview: string;
    /**
     * Google Fonts API URL if this is a Google Font
     * @example "https://fonts.google.com/specimen/Roboto"
     */
    googleFontsUrl?: string;
    /**
     * Whether this is a variable font
     * Variable fonts support continuous weight/width variations
     */
    variable?: boolean;
    /**
     * License information
     */
    license: LicenseInfo;
    /**
     * Popularity rank (lower is more popular)
     * Based on Google Fonts usage statistics
     * @example 1 (most popular), 100, 500
     */
    popularity?: number;
    /**
     * Human-readable description of the font
     * @example "Roboto is a neo-grotesque sans-serif typeface designed by Google"
     */
    description?: string;
    /**
     * Designer/creator of the font
     * @example "Christian Robertson"
     */
    designer?: string;
    /**
     * Year the font was released
     * @example 2011
     */
    releaseYear?: number;
    /**
     * Tags for categorization and search
     * @example ["modern", "geometric", "clean", "professional"]
     */
    tags?: string[];
}
/**
 * Font fallback configuration
 *
 * Defines fallback fonts to use while the primary font is loading
 * or if it fails to load.
 */
interface FontFallback {
    /**
     * Primary font family name
     */
    primary: string;
    /**
     * Fallback font stack
     * Listed in priority order
     * @example ["Arial", "Helvetica", "sans-serif"]
     */
    fallbacks: string[];
    /**
     * Whether to use metric-matched fallbacks
     * When true, attempts to find system fonts with similar metrics
     * to reduce layout shift when font loads
     */
    metricMatched?: boolean;
    /**
     * Precomputed font metrics for fallback matching
     * Used to calculate size-adjust, ascent-override, etc.
     */
    metrics?: FontMetrics;
}
/**
 * Font metrics for fallback matching
 *
 * These metrics help create metric-matched fallbacks that reduce
 * layout shift when the primary font loads.
 */
interface FontMetrics {
    /**
     * Font family name
     */
    familyName: string;
    /**
     * Units per em (typically 1000 or 2048)
     */
    unitsPerEm: number;
    /**
     * Ascender height (above baseline)
     */
    ascent: number;
    /**
     * Descender depth (below baseline)
     */
    descent: number;
    /**
     * Line gap (space between lines)
     */
    lineGap: number;
    /**
     * Cap height (height of capital letters)
     */
    capHeight: number;
    /**
     * x-height (height of lowercase x)
     */
    xHeight: number;
    /**
     * Average character width
     */
    avgWidth?: number;
}
/**
 * Template-level font configuration
 *
 * Defines all fonts used in a template and how they should be loaded.
 */
interface FontConfiguration {
    /**
     * Google Fonts to load
     * @example [{ family: "Roboto", weights: [400, 700] }]
     */
    google?: GoogleFontDefinition[];
    /**
     * Custom fonts to load
     * @example [{ family: "MyBrand", source: "https://cdn.example.com/mybrand.woff2" }]
     */
    custom?: CustomFontDefinition[];
    /**
     * Font loading strategy
     * Controls when and how fonts are loaded
     * @default 'eager'
     */
    strategy?: FontLoadingStrategy;
    /**
     * Fallback font configurations
     * Maps primary font families to their fallback stacks
     * @example { "Roboto": ["Arial", "Helvetica", "sans-serif"] }
     */
    fallbacks?: Record<string, string[]>;
    /**
     * Timeout for font loading in milliseconds
     * If a font doesn't load within this time, fallback is used
     * @default 10000 (10 seconds)
     */
    timeout?: number;
    /**
     * Whether to preload fonts in parallel with other resources
     * Uses <link rel="preload"> for better performance
     * @default true
     */
    preload?: boolean;
    /**
     * Whether to subset fonts based on template text content
     * Reduces file size by only including used characters
     * @default false
     */
    subset?: boolean;
}
/**
 * Font loading state
 */
type FontLoadingState = 'unloaded' | 'loading' | 'loaded' | 'error' | 'timeout';
/**
 * Font loading result
 */
interface FontLoadResult {
    /**
     * Font family that was loaded
     */
    family: string;
    /**
     * Weight that was loaded
     */
    weight: NumericFontWeight;
    /**
     * Style that was loaded
     */
    style: FontStyle$1;
    /**
     * Loading state
     */
    state: FontLoadingState;
    /**
     * Error message if loading failed
     */
    error?: string;
    /**
     * Time taken to load in milliseconds
     */
    loadTime?: number;
    /**
     * Font file size in bytes
     */
    fileSize?: number;
    /**
     * Whether this font was served from cache
     */
    cached?: boolean;
}
/**
 * Font validation result
 */
interface FontValidationResult {
    /**
     * Whether the font is valid
     */
    valid: boolean;
    /**
     * Validation errors
     */
    errors: string[];
    /**
     * Validation warnings
     */
    warnings: string[];
    /**
     * Extracted font metadata
     */
    metadata?: Partial<FontMetadata$1>;
}
/**
 * Options for font upload
 */
interface FontUploadOptions {
    /**
     * Custom family name override
     * If not provided, uses the font's internal family name
     */
    family?: string;
    /**
     * Whether to convert to WOFF2 format
     * @default true
     */
    convertToWoff2?: boolean;
    /**
     * Whether to validate the font file
     * @default true
     */
    validate?: boolean;
    /**
     * Maximum file size in bytes
     * @default 4194304 (4MB)
     */
    maxSize?: number;
    /**
     * Whether to parse and extract metadata
     * @default true
     */
    extractMetadata?: boolean;
}
/**
 * System font information
 *
 * Represents fonts available on the system without needing to load
 */
interface SystemFont {
    /**
     * Font family name
     */
    family: string;
    /**
     * Available styles on the system
     */
    styles: FontStyle$1[];
    /**
     * Available weights on the system
     */
    weights: NumericFontWeight[];
    /**
     * Font category
     */
    category?: FontCategory$1;
    /**
     * Whether this is a web-safe font
     * Web-safe fonts are available on most systems
     */
    webSafe?: boolean;
}
/**
 * Font cache entry
 */
interface FontCacheEntry {
    /**
     * Cache key
     */
    key: string;
    /**
     * Font family
     */
    family: string;
    /**
     * Font data (ArrayBuffer or URL)
     */
    data: ArrayBuffer | string;
    /**
     * When this entry was cached
     */
    cachedAt: number;
    /**
     * When this entry expires
     */
    expiresAt: number;
    /**
     * Cache entry size in bytes
     */
    size: number;
    /**
     * Font metadata
     */
    metadata?: Partial<FontMetadata$1>;
}
/**
 * Helper type for converting named weights to numeric weights
 */
type WeightToNumeric<T extends FontWeight> = T extends 'thin' ? 100 : T extends 'extralight' ? 200 : T extends 'light' ? 300 : T extends 'normal' ? 400 : T extends 'medium' ? 500 : T extends 'semibold' ? 600 : T extends 'bold' ? 700 : T extends 'extrabold' ? 800 : T extends 'black' ? 900 : T extends NumericFontWeight ? T : never;
/**
 * Type guard to check if a weight is numeric
 */
declare function isNumericWeight(weight: FontWeight): weight is NumericFontWeight;
/**
 * Type guard to check if a weight is named
 */
declare function isNamedWeight(weight: FontWeight): weight is NamedFontWeight;
/**
 * Convert named weight to numeric weight
 */
declare function weightToNumeric(weight: FontWeight): NumericFontWeight;
/**
 * Convert numeric weight to named weight
 */
declare function numericToNamedWeight(weight: NumericFontWeight): NamedFontWeight;
/**
 * Font reference for identifying a specific font variant
 * Used to track which fonts are used in templates
 */
interface FontReference {
    /**
     * Font family name
     */
    family: string;
    /**
     * Font weight
     */
    weight?: NumericFontWeight;
    /**
     * Font style
     */
    style?: FontStyle$1;
}
/**
 * Result of loading fonts
 */
interface LoadedFonts {
    /**
     * Successfully loaded font references
     */
    loaded: FontReference[];
    /**
     * Failed font references
     */
    failed: FontReference[];
    /**
     * Total time taken to load fonts in milliseconds
     */
    loadTime: number;
}
/**
 * Font loading error class
 */
declare class FontLoadingError extends Error {
    /**
     * Font family that failed to load
     */
    readonly family: string;
    /**
     * Original error that caused the failure
     */
    readonly cause?: Error;
    constructor(message: string, family: string, cause?: Error);
}
/**
 * Constants for common font configurations
 */
declare const FONT_CONSTANTS: {
    /**
     * Default font weights to load if none specified
     */
    readonly DEFAULT_WEIGHTS: readonly [400, 700];
    /**
     * Default font styles to load if none specified
     */
    readonly DEFAULT_STYLES: readonly ["normal"];
    /**
     * Default character subset
     */
    readonly DEFAULT_SUBSET: readonly ["latin"];
    /**
     * Default font display strategy
     */
    readonly DEFAULT_DISPLAY: "swap";
    /**
     * Default font loading strategy
     */
    readonly DEFAULT_LOADING_STRATEGY: "eager";
    /**
     * Default timeout for font loading (10 seconds)
     */
    readonly DEFAULT_TIMEOUT: 10000;
    /**
     * Maximum file size for font uploads (4MB)
     */
    readonly MAX_UPLOAD_SIZE: 4194304;
    /**
     * Supported font formats in order of preference
     */
    readonly SUPPORTED_FORMATS: readonly ["woff2", "woff", "ttf", "otf"];
    /**
     * Web-safe font fallback stacks
     */
    readonly WEB_SAFE_FALLBACKS: {
        readonly 'sans-serif': readonly ["Arial", "Helvetica", "sans-serif"];
        readonly serif: readonly ["Georgia", "Times New Roman", "serif"];
        readonly monospace: readonly ["Courier New", "Courier", "monospace"];
        readonly display: readonly ["Impact", "Arial Black", "sans-serif"];
        readonly handwriting: readonly ["Comic Sans MS", "cursive"];
    };
};

/**
 * Author information for a template.
 */
interface TemplateAuthor {
    /** Author name */
    name: string;
    /** Author website URL */
    url?: string;
    /** Author email */
    email?: string;
}
/**
 * Output configuration for the template.
 */
interface OutputConfig {
    /**
     * Output type - video or static image
     */
    type: 'video' | 'image';
    /**
     * Canvas width in pixels
     * @example 1920
     */
    width: number;
    /**
     * Canvas height in pixels
     * @example 1080
     */
    height: number;
    /**
     * Frames per second (video only)
     * @default 30
     */
    fps?: number;
    /**
     * Duration in seconds (video only)
     * @example 10
     */
    duration?: number;
    /**
     * Background color (CSS color string)
     * @default '#000000'
     */
    backgroundColor?: string;
}
/**
 * Complete template structure.
 *
 * A template defines the structure, inputs, and composition of a video or image.
 * Templates are JSON-serializable and can be shared, stored, and used by AI agents.
 *
 * @example
 * ```typescript
 * const template: Template = {
 *   name: 'Simple Text Animation',
 *   output: {
 *     type: 'video',
 *     width: 1920,
 *     height: 1080,
 *     fps: 30,
 *     duration: 5,
 *   },
 *   inputs: [
 *     { key: 'title', type: 'string', label: 'Title', required: true },
 *   ],
 *   composition: {
 *     scenes: [{ id: 'main', startFrame: 0, endFrame: 150, layers: [] }],
 *   },
 * };
 * ```
 */
interface Template {
    /**
     * Unique identifier (optional, for reference only)
     */
    id?: string;
    /**
     * Human-readable name
     */
    name: string;
    /**
     * Description of what this template creates
     */
    description?: string;
    /**
     * Semantic version (e.g., '1.0.0')
     */
    version?: string;
    /**
     * Author information
     */
    author?: TemplateAuthor;
    /**
     * Categorization tags
     */
    tags?: string[];
    /**
     * Template thumbnail URL
     */
    thumbnail?: string;
    /**
     * Output configuration (dimensions, format, etc.)
     */
    output: OutputConfig;
    /**
     * Define customizable inputs that users can provide
     */
    inputs: InputDefinition[];
    /**
     * Default values for inputs
     */
    defaults?: Record<string, unknown>;
    /**
     * Custom React components used in this template.
     * Can be references to pre-registered components, URLs, or inline code.
     */
    customComponents?: Record<string, CustomComponentDefinition>;
    /**
     * Font configuration for this template.
     *
     * Defines Google Fonts and custom fonts to be loaded for text layers.
     * Supports multiple font families with various weights and styles.
     *
     * Fonts are loaded before rendering begins to ensure text appears correctly.
     * If a font fails to load, the specified fallback fonts will be used.
     *
     * @optional This field is optional for backward compatibility.
     * Templates without font configuration will use system fonts only.
     *
     * @example
     * ```typescript
     * fonts: {
     *   google: [
     *     {
     *       family: 'Roboto',
     *       weights: [400, 700],
     *       styles: ['normal', 'italic']
     *     }
     *   ],
     *   custom: [
     *     {
     *       family: 'MyBrand',
     *       source: 'https://cdn.example.com/mybrand.woff2',
     *       weight: 700
     *     }
     *   ],
     *   fallbacks: {
     *     'Roboto': ['Arial', 'Helvetica', 'sans-serif']
     *   }
     * }
     * ```
     */
    fonts?: FontConfiguration;
    /**
     * The composition containing scenes and layers
     */
    composition: Composition;
}
/**
 * Minimal template for quick creation.
 * Missing fields will use defaults.
 */
type PartialTemplate = Partial<Template> & Pick<Template, 'name' | 'output' | 'composition'>;

/**
 * Font weight options for custom fonts.
 */
type CustomFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
/**
 * Font style options.
 */
type CustomFontStyle = 'normal' | 'italic' | 'oblique';
/**
 * Font display strategy for loading custom fonts.
 * Controls how fonts are displayed while loading.
 */
type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
/**
 * Font source definition for a specific font variant.
 * Supports both URL and local font sources.
 */
interface FontSource {
    /**
     * URL to the font file (e.g., .woff2, .woff, .ttf, .otf)
     * Can be relative or absolute URL
     */
    url?: string;
    /**
     * Local font name to check before downloading
     * Can specify multiple local names as an array
     */
    local?: string | string[];
    /**
     * Font format (e.g., 'woff2', 'woff', 'truetype', 'opentype')
     * Usually inferred from URL extension, but can be explicit
     */
    format?: 'woff2' | 'woff' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg';
    /**
     * Font weight this source applies to
     * @default 400
     */
    weight?: CustomFontWeight;
    /**
     * Font style this source applies to
     * @default 'normal'
     */
    style?: CustomFontStyle;
}
/**
 * Font family definition with all its variants and sources.
 * Defines a complete font family that can be loaded and used in templates.
 */
interface FontFamily {
    /**
     * Font family name as it will be referenced in CSS
     * This is the name used in fontFamily properties
     * @example 'Inter', 'Roboto', 'Custom Font'
     */
    family: string;
    /**
     * List of font sources for different weights and styles
     * Each source can define a specific variant of the font
     */
    sources: FontSource[];
    /**
     * Font display strategy
     * @default 'swap'
     */
    display?: FontDisplay;
    /**
     * Fallback fonts to use while loading or if font fails
     * @example ['Arial', 'sans-serif']
     */
    fallback?: string[];
    /**
     * Whether to preload this font for better performance
     * Preloaded fonts are loaded with higher priority
     * @default false
     */
    preload?: boolean;
}

/**
 * Validation error.
 */
interface ValidationError$1 {
    /** Error code */
    code: string;
    /** Human-readable message */
    message: string;
    /** JSON path to error location */
    path: string;
    /** Expected value/type */
    expected?: string;
    /** Actual value/type */
    actual?: string;
}
/**
 * Validation warning.
 */
interface ValidationWarning {
    /** Warning code */
    code: string;
    /** Human-readable message */
    message: string;
    /** JSON path to warning location */
    path: string;
    /** Suggestion to fix */
    suggestion?: string;
}
/**
 * Validation result.
 */
interface ValidationResult {
    /** Is template valid */
    valid: boolean;
    /** Validation errors */
    errors: ValidationError$1[];
    /** Validation warnings */
    warnings: ValidationWarning[];
}
/**
 * Validate a template against the schema.
 */
declare function validateTemplate(template: unknown): ValidationResult;
/**
 * Validate inputs against template input definitions.
 */
declare function validateInputs(template: Template, inputs: Record<string, unknown>): ValidationResult;

/**
 * Complete JSON Schema for template.
 */
declare const templateSchema: JSONSchema7;
/**
 * Get the template schema.
 */
declare function getTemplateSchema(): JSONSchema7;
/**
 * Get schema for a specific layer type.
 */
declare function getLayerSchema(type: string): JSONSchema7 | null;

/**
 * Engine options.
 */
interface EngineOptions {
    /** Renderer type */
    renderer?: 'auto' | 'browser' | 'node';
    /** Custom component registry */
    components?: ComponentRegistry;
    /** Default fonts to load */
    defaultFonts?: string[];
    /** Google Fonts API key */
    googleFontsApiKey?: string;
    /** Max concurrent renders */
    maxConcurrentRenders?: number;
}
/**
 * Render video options.
 */
interface RenderVideoOptions {
    /** Template to render */
    template: Template;
    /** Input values */
    inputs: Record<string, unknown>;
    /** Output configuration */
    output?: {
        format?: 'mp4' | 'webm' | 'mov' | 'gif';
        codec?: 'h264' | 'h265' | 'vp8' | 'vp9' | 'av1' | 'prores';
        quality?: 'draft' | 'standard' | 'high' | 'lossless';
        bitrate?: number;
        fps?: number;
        scale?: number;
        audioCodec?: 'aac' | 'mp3' | 'opus' | 'none';
        audioBitrate?: number;
    };
    /** Unique render ID for cancellation */
    renderId?: string;
}
/**
 * Video render result.
 */
interface VideoResult {
    success: boolean;
    data: Blob | Buffer;
    dataUrl?: string;
    stats: {
        duration: number;
        frames: number;
        fps: number;
        fileSize: number;
    };
}
/**
 * Render image options.
 */
interface RenderImageOptions {
    /** Template to render */
    template: Template;
    /** Input values */
    inputs: Record<string, unknown>;
    /** Frame to render (for video templates) */
    frame?: number;
    /** Output configuration */
    output?: {
        format?: 'png' | 'jpeg' | 'webp';
        quality?: number;
        scale?: number;
    };
}
/**
 * Image render result.
 */
interface ImageResult {
    success: boolean;
    data: Blob | Buffer;
    dataUrl: string;
    width: number;
    height: number;
}
/**
 * Render progress.
 */
interface RenderProgress {
    phase: 'loading' | 'rendering' | 'encoding';
    progress: number;
    currentFrame?: number;
    totalFrames?: number;
    estimatedTimeRemaining?: number;
    message?: string;
}
/**
 * Engine capabilities.
 */
interface EngineCapabilities {
    version: string;
    elements: Record<string, ElementCapability>;
    customComponents: Record<string, ComponentInfo>;
    animations: {
        entrance: string[];
        exit: string[];
        emphasis: string[];
    };
    easings: string[];
    blendModes: string[];
    filters: string[];
    fonts: {
        builtin: string[];
        googleFonts: boolean;
        customFonts: boolean;
    };
    output: {
        video: {
            formats: string[];
            codecs: string[];
            maxWidth: number;
            maxHeight: number;
            maxDuration: number;
            maxFps: number;
        };
        image: {
            formats: string[];
            maxWidth: number;
            maxHeight: number;
        };
    };
    runtime: 'browser' | 'node';
    features: {
        tailwind: boolean;
        customComponents: boolean;
        webgl: boolean;
        webcodecs: boolean;
    };
}
/**
 * Element capability info.
 */
interface ElementCapability {
    description: string;
    category: 'visual' | 'audio' | 'container';
    props: JSONSchema7;
    allowChildren: boolean;
    animatable: boolean;
    example: object;
}
/**
 * Get the default global component registry.
 * Creates one if it doesn't exist.
 */
declare function getDefaultRegistry(): ComponentRegistry;
/**
 * Rendervid Engine.
 *
 * Main entry point for the Rendervid library.
 *
 * @example
 * ```typescript
 * import { RendervidEngine } from '@rendervid/core';
 *
 * const engine = new RendervidEngine();
 *
 * // Validate a template
 * const result = engine.validateTemplate(myTemplate);
 *
 * // Get capabilities for AI
 * const caps = engine.getCapabilities();
 *
 * // Render a video (requires renderer package)
 * const video = await engine.renderVideo({
 *   template: myTemplate,
 *   inputs: { title: 'Hello World' },
 * });
 * ```
 */
declare class RendervidEngine {
    private options;
    private _components;
    private activeRenders;
    constructor(options?: EngineOptions);
    /**
     * Get the component registry.
     */
    get components(): ComponentRegistry;
    /**
     * Get engine capabilities.
     */
    getCapabilities(): EngineCapabilities;
    /**
     * Get element capabilities.
     */
    private getElementCapabilities;
    /**
     * Get JSON Schema for template validation.
     */
    getTemplateSchema(): JSONSchema7;
    /**
     * Get schema for a specific element type.
     */
    getElementSchema(type: string): JSONSchema7 | null;
    /**
     * Validate a template.
     */
    validateTemplate(template: unknown): ValidationResult;
    /**
     * Validate inputs against a template.
     */
    validateInputs(template: Template, inputs: Record<string, unknown>): ValidationResult;
    /**
     * Render a video.
     * Requires @rendervid/renderer-browser or @rendervid/renderer-node.
     */
    renderVideo(_options: RenderVideoOptions): Promise<VideoResult>;
    /**
     * Render a video with progress updates.
     */
    renderVideoWithProgress(options: RenderVideoOptions, _onProgress: (progress: RenderProgress) => void): Promise<VideoResult>;
    /**
     * Render an image.
     * Requires @rendervid/renderer-browser or @rendervid/renderer-node.
     */
    renderImage(_options: RenderImageOptions): Promise<ImageResult>;
    /**
     * Cancel an in-progress render.
     */
    cancelRender(renderId: string): void;
}

/**
 * Template Processor
 *
 * Processes templates before rendering by:
 * 1. Loading custom components defined in template.customComponents
 * 2. Interpolating input variables using {{key}} syntax
 *
 * @example
 * ```typescript
 * const processor = new TemplateProcessor();
 *
 * // Load custom components
 * await processor.loadCustomComponents(template, registry);
 *
 * // Resolve input variables
 * const processedTemplate = processor.resolveInputs(template, { title: 'Hello' });
 * ```
 */
declare class TemplateProcessor {
    /**
     * Load custom components from template into registry
     *
     * Processes template.customComponents and registers them with the provided registry.
     * Supports three types:
     * - 'reference': Creates alias to pre-registered component
     * - 'url': Loads component from HTTPS URL
     * - 'inline': Creates component from code string
     *
     * Components are loaded in parallel for performance.
     * Already registered components are skipped to prevent overwrites.
     *
     * @param template - Template containing customComponents definition
     * @param registry - Component registry to register components into
     * @throws Error if component loading fails
     *
     * @example
     * ```typescript
     * await processor.loadCustomComponents(template, registry);
     * // All components from template.customComponents are now available
     * ```
     */
    loadCustomComponents(template: Template, registry: ComponentRegistry): Promise<void>;
    /**
     * Load a single component from its definition
     *
     * @param name - Component name to register as
     * @param definition - Component definition (reference, url, or inline)
     * @param registry - Component registry to register into
     * @throws Error if component type is invalid or loading fails
     */
    private loadComponent;
    /**
     * Resolve input variables in template
     *
     * Replaces all {{key}} placeholders in the template with actual values from inputs.
     * Works recursively through all objects, arrays, and strings in the template.
     *
     * Variable syntax: {{variableName}}
     * - Matches exact input keys
     * - Case-sensitive
     * - Missing variables are left unchanged
     *
     * @param template - Template with {{variable}} placeholders
     * @param inputs - Input values to interpolate
     * @returns New template with all variables resolved
     *
     * @example
     * ```typescript
     * const template = {
     *   name: 'Video',
     *   composition: {
     *     scenes: [{
     *       layers: [{
     *         type: 'text',
     *         text: '{{title}}',
     *         color: '{{color}}'
     *       }]
     *     }]
     *   }
     * };
     *
     * const resolved = processor.resolveInputs(template, {
     *   title: 'Hello World',
     *   color: '#ff0000'
     * });
     * // resolved.composition.scenes[0].layers[0].text === 'Hello World'
     * // resolved.composition.scenes[0].layers[0].color === '#ff0000'
     * ```
     */
    resolveInputs(template: Template, inputs: Record<string, unknown>): Template;
    /**
     * Recursively interpolate variables in any object structure
     *
     * @param obj - Object to interpolate
     * @param inputs - Input values
     * @returns Interpolated object
     */
    private interpolateObject;
}

/**
 * Component Defaults Manager
 *
 * Manages default values, prop schemas, and validation for custom components.
 * Handles merging defaults with provided props and auto-injecting frame-aware props.
 */

/**
 * Frame-aware props that are automatically injected by the renderer
 */
interface FrameAwareProps {
    /** Current frame number (0 to totalFrames-1) */
    frame: number;
    /** Frames per second of the video */
    fps: number;
    /** Total number of frames in the composition */
    totalFrames: number;
    /** Size of the layer { width, height } */
    layerSize: {
        width: number;
        height: number;
    };
    /** Duration of the current scene in frames */
    sceneDuration: number;
}
/**
 * Component default values configuration
 */
interface ComponentDefaults {
    /** Required props that must be provided */
    required?: Record<string, unknown>;
    /** Optional props with fallback values */
    optional?: Record<string, unknown>;
    /** Props that should be excluded from auto-injection */
    excludeAutoInject?: string[];
}
/**
 * Component schema with validation rules
 */
interface ComponentSchema {
    properties?: Record<string, PropertySchema>;
    required?: string[];
    additionalProperties?: boolean;
}
/**
 * Individual property schema
 */
interface PropertySchema {
    type: string | string[];
    description?: string;
    default?: unknown;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    enum?: unknown[];
    items?: PropertySchema;
    properties?: Record<string, PropertySchema>;
}
/**
 * Component configuration including defaults and schema
 */
interface ComponentConfig {
    name: string;
    description?: string;
    defaults?: ComponentDefaults;
    schema?: ComponentSchema | JSONSchema7;
    examples?: Record<string, unknown>;
}
/**
 * Validation error details
 */
interface ValidationError {
    property: string;
    value: unknown;
    error: string;
    schema?: PropertySchema;
}
/**
 * Prop resolution result
 */
interface PropResolutionResult {
    props: Record<string, unknown>;
    warnings: string[];
    errors: ValidationError[];
    isValid: boolean;
}
/**
 * ComponentDefaultsManager
 *
 * Manages default values, validation, and prop resolution for custom components.
 * Ensures components receive required frame-aware props and validated configuration.
 *
 * @example
 * ```typescript
 * const manager = new ComponentDefaultsManager();
 *
 * // Register component defaults
 * manager.register('AnimatedChart', {
 *   defaults: {
 *     optional: {
 *       animationDuration: 3,
 *       colors: ['#00f2ea', '#ff0050'],
 *       showGrid: true
 *     }
 *   },
 *   schema: {
 *     properties: {
 *       animationDuration: { type: 'number', minimum: 0.1, maximum: 10 },
 *       colors: { type: 'array', items: { type: 'string' } }
 *     }
 *   }
 * });
 *
 * // Resolve component props
 * const resolved = manager.resolveProps('AnimatedChart', {
 *   colors: ['#ff0000']  // Override defaults
 * }, frameData);
 * ```
 */
declare class ComponentDefaultsManager {
    private registry;
    private readonly defaultFrameAwareDefaults;
    /**
     * Register a component configuration with defaults and schema
     */
    register(name: string, config: ComponentConfig): void;
    /**
     * Unregister a component
     */
    unregister(name: string): boolean;
    /**
     * Get component configuration
     */
    getConfig(name: string): ComponentConfig | undefined;
    /**
     * Get default values for a component
     */
    getDefaults(name: string): ComponentDefaults;
    /**
     * Get schema for a component
     */
    getSchema(name: string): ComponentSchema | JSONSchema7 | undefined;
    /**
     * Resolve component props with defaults and frame-aware props
     *
     * @param componentName - Name of the component
     * @param layerProps - Props provided in the template layer
     * @param frameData - Frame-aware data from renderer
     * @returns Resolved props with defaults applied and validation results
     */
    resolveProps(componentName: string, layerProps: Record<string, unknown> | undefined, frameData: FrameAwareProps): PropResolutionResult;
    /**
     * Validate props against schema
     */
    private validateProps;
    /**
     * Validate type of a value against schema type
     */
    private validateType;
    /**
     * Get actual type of a value
     */
    private getActualType;
    /**
     * Merge multiple prop sets with proper precedence
     *
     * Precedence: layerProps > defaults.required > defaults.optional > frameAwareDefaults
     */
    mergeProps(componentName: string, ...propSets: Array<Record<string, unknown>>): Record<string, unknown>;
    /**
     * List all registered components
     */
    listComponents(): Array<{
        name: string;
        description?: string;
        hasDefaults: boolean;
        hasSchema: boolean;
    }>;
}
/**
 * Create a default instance with common component configurations
 */
declare function createDefaultComponentDefaultsManager(): ComponentDefaultsManager;

/**
 * Component Defaults Manager Integration Guide
 *
 * Shows how to integrate ComponentDefaultsManager with TemplateProcessor
 * and the rendering pipeline.
 */

/**
 * Extension for CustomLayer with resolved props
 */
interface ResolvedCustomLayer extends CustomLayer {
    /** Props that have been resolved with defaults and validation */
    __resolvedProps?: Record<string, unknown>;
    /** Validation warnings from prop resolution */
    __propWarnings?: string[];
    /** Validation errors from prop resolution */
    __propErrors?: Array<{
        property: string;
        error: string;
    }>;
}
/**
 * Helper class to integrate ComponentDefaultsManager with rendering
 */
declare class ComponentPropsResolver {
    private defaultsManager;
    constructor(defaultsManager?: ComponentDefaultsManager);
    /**
     * Resolve props for a custom layer
     *
     * This should be called before rendering each frame
     */
    resolveLayerProps(layer: CustomLayer, frame: number, fps: number, totalFrames: number, sceneDuration: number, layerWidth: number, layerHeight: number): PropResolutionResult;
    /**
     * Register component configuration
     */
    registerComponent(name: string, config: Parameters<ComponentDefaultsManager['register']>[1]): void;
    /**
     * Get defaults manager for direct access
     */
    getManager(): ComponentDefaultsManager;
}

/**
 * Get list of all easing names.
 */
declare function getAllEasingNames(): EasingName[];
/**
 * Get an easing function by name.
 */
declare function getEasing(name: EasingName): EasingFunction;
/**
 * Create a cubic bezier easing function.
 */
declare function createCubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction;
/**
 * Create a spring physics easing function.
 */
declare function createSpring(mass: number, stiffness: number, damping: number): EasingFunction;
/**
 * Parse any easing string (preset, cubic-bezier, or spring).
 */
declare function parseEasing(value: string): EasingFunction;

/**
 * Interpolate between two values using an easing function.
 */
declare function interpolate(from: number, to: number, progress: number, easing?: string): number;
/**
 * Get value at a specific frame from keyframes.
 */
declare function getValueAtFrame(keyframes: Keyframe[], property: string, frame: number): number | undefined;
/**
 * Get all properties at a specific frame.
 */
declare function getPropertiesAtFrame(keyframes: Keyframe[], frame: number): AnimatableProperties;
/**
 * Compile an animation for efficient playback.
 * Pre-calculates values for each frame.
 */
declare function compileAnimation(keyframes: Keyframe[], totalFrames: number): CompiledAnimation;

/**
 * Preset animation generator options.
 */
interface PresetOptions {
    /** Animation duration in frames */
    duration: number;
    /** Easing function */
    easing?: string;
    /** Layer size (for calculating offsets) */
    layerSize?: Size;
    /** Canvas size (for calculating offsets) */
    canvasSize?: Size;
}
/**
 * Preset animation definition.
 */
interface PresetDefinition {
    /** Preset name */
    name: AnimationPreset;
    /** Animation category */
    type: 'entrance' | 'exit' | 'emphasis';
    /** Default duration in frames */
    defaultDuration: number;
    /** Default easing */
    defaultEasing: string;
    /** Generate keyframes for this animation */
    generate: (options: PresetOptions) => Keyframe[];
}
/**
 * Get a preset by name.
 */
declare function getPreset(name: string): PresetDefinition | undefined;
/**
 * Get all preset names.
 */
declare function getAllPresetNames(): string[];
/**
 * Get presets by category.
 */
declare function getPresetsByType(type: 'entrance' | 'exit' | 'emphasis'): PresetDefinition[];
/**
 * Generate keyframes for a preset animation.
 */
declare function generatePresetKeyframes(name: string, options: PresetOptions): Keyframe[];

/**
 * FontManager coordinates font loading for templates.
 *
 * Features:
 * - Loads Google Fonts and custom fonts
 * - Extracts fonts from template layers
 * - Manages fallback font stacks
 * - Handles timeouts and errors gracefully
 * - Verifies fonts are ready before rendering
 *
 * @example
 * ```typescript
 * const fontManager = new FontManager();
 *
 * // Load fonts from configuration
 * const result = await fontManager.loadFonts({
 *   google: [{ family: 'Roboto', weights: [400, 700] }],
 *   custom: [{ family: 'MyFont', source: '/fonts/myfont.woff2' }],
 * });
 *
 * // Extract fonts from template
 * const fonts = fontManager.extractFontsFromTemplate(template);
 *
 * // Get fallback stack
 * const stack = fontManager.getFallbackStack('Roboto');
 * // Returns: "'Roboto', Arial, Helvetica, sans-serif"
 * ```
 */
declare class FontManager {
    private readonly loadTimeout;
    private readonly injectedStyles;
    /**
     * Create a new FontManager.
     *
     * @param options - Configuration options
     * @param options.timeout - Font loading timeout in milliseconds (default: 10000)
     */
    constructor(options?: {
        timeout?: number;
    });
    /**
     * Load fonts from configuration.
     *
     * Loads Google Fonts and custom fonts, with timeout and error handling.
     * Fonts that fail to load will be included in the `failed` array.
     *
     * @param config - Font configuration
     * @returns Promise resolving to loaded fonts result
     *
     * @example
     * ```typescript
     * const result = await fontManager.loadFonts({
     *   google: [
     *     { family: 'Roboto', weights: [400, 700] },
     *     { family: 'Playfair Display', styles: ['normal', 'italic'] },
     *   ],
     * });
     *
     * console.log(`Loaded ${result.loaded.length} fonts in ${result.loadTime}ms`);
     * if (result.failed.length > 0) {
     *   console.warn(`Failed to load: ${result.failed.map(f => f.family).join(', ')}`);
     * }
     * ```
     */
    loadFonts(config: FontConfiguration): Promise<LoadedFonts>;
    /**
     * Extract all fonts used in a template.
     *
     * Scans all text layers and extracts unique font family/weight/style combinations.
     *
     * @param template - Template to extract fonts from
     * @returns Set of font references used in the template
     *
     * @example
     * ```typescript
     * const fonts = fontManager.extractFontsFromTemplate(template);
     * console.log(`Template uses ${fonts.size} unique fonts`);
     * fonts.forEach(font => {
     *   console.log(`- ${font.family} ${font.weight} ${font.style}`);
     * });
     * ```
     */
    extractFontsFromTemplate(template: Template): Set<FontReference>;
    /**
     * Wait for document.fonts.ready.
     *
     * This ensures all fonts are loaded before rendering to prevent
     * FOIT (Flash of Invisible Text) and FOUT (Flash of Unstyled Text).
     *
     * @param timeout - Optional timeout in milliseconds (uses instance timeout if not provided)
     * @returns Promise that resolves when fonts are ready or timeout occurs
     *
     * @example
     * ```typescript
     * await fontManager.waitForFontsReady();
     * // Fonts are now ready for rendering
     * ```
     */
    waitForFontsReady(timeout?: number): Promise<void>;
    /**
     * Verify that specific fonts are loaded.
     *
     * Checks if fonts are available using the CSS Font Loading API.
     *
     * @param fonts - Array of font references to verify
     * @returns True if all fonts are loaded, false otherwise
     *
     * @example
     * ```typescript
     * const allLoaded = fontManager.verifyFontsLoaded([
     *   { family: 'Roboto', weight: 400 },
     *   { family: 'Roboto', weight: 700 },
     * ]);
     * if (!allLoaded) {
     *   console.warn('Some fonts are not loaded');
     * }
     * ```
     */
    verifyFontsLoaded(fonts: FontReference[]): boolean;
    /**
     * Get CSS fallback font stack for a font family.
     *
     * Returns a CSS font-family value with appropriate fallbacks.
     *
     * @param fontFamily - Primary font family name
     * @param customFallbacks - Optional custom fallback array
     * @returns CSS font-family string with fallbacks
     *
     * @example
     * ```typescript
     * const stack = fontManager.getFallbackStack('Roboto');
     * // Returns: "'Roboto', Arial, Helvetica, sans-serif"
     *
     * const customStack = fontManager.getFallbackStack('MyFont', ['Arial', 'sans-serif']);
     * // Returns: "'MyFont', Arial, sans-serif"
     * ```
     */
    getFallbackStack(fontFamily: string, customFallbacks?: string[]): string;
    /**
     * Load a Google Font.
     *
     * @internal
     */
    private loadGoogleFont;
    /**
     * Load a custom font.
     *
     * @internal
     */
    private loadCustomFont;
    /**
     * Generate @font-face CSS rule.
     *
     * @internal
     */
    private generateFontFaceCSS;
    /**
     * Inject CSS into the document.
     *
     * @internal
     */
    private injectFontCSS;
    /**
     * Load font faces using Font Loading API.
     *
     * @internal
     */
    private loadFontFaces;
    /**
     * Load a single font face.
     *
     * @internal
     */
    private loadFontFace;
    /**
     * Fetch with timeout.
     *
     * @internal
     */
    private fetchWithTimeout;
}

/**
 * Google Fonts Catalog
 *
 * Comprehensive catalog of 100+ curated Google Fonts with metadata.
 * Provides utilities to query fonts by category, popularity, and family name.
 */
/**
 * Font category types
 */
type FontCategory = 'sans-serif' | 'serif' | 'monospace' | 'display';
/**
 * Font style types
 */
type FontStyle = 'normal' | 'italic';
/**
 * Font metadata interface
 */
interface FontMetadata {
    /** Font family name as used in CSS */
    family: string;
    /** Font category */
    category: FontCategory;
    /** Available font weights (e.g., [400, 700]) */
    weights: number[];
    /** Available font styles */
    styles: FontStyle[];
    /** Supported character subsets */
    subsets: string[];
    /** Preview text for the font */
    preview: string;
    /** Whether the font has a variable font version */
    variable: boolean;
    /** Popularity ranking (1 = most popular) */
    popularity: number;
}
/**
 * Get the complete font catalog
 *
 * @returns Array of all font metadata objects
 *
 * @example
 * ```ts
 * const allFonts = getFontCatalog();
 * console.log(`Total fonts: ${allFonts.length}`);
 * ```
 */
declare function getFontCatalog(): FontMetadata[];
/**
 * Get fonts filtered by category
 *
 * @param category - Font category to filter by
 * @returns Array of font metadata objects in the specified category
 *
 * @example
 * ```ts
 * const sansFonts = getFontsByCategory('sans-serif');
 * const serifFonts = getFontsByCategory('serif');
 * const monoFonts = getFontsByCategory('monospace');
 * ```
 */
declare function getFontsByCategory(category: FontCategory): FontMetadata[];
/**
 * Get metadata for a specific font family
 *
 * @param family - Font family name (case-sensitive)
 * @returns Font metadata object or undefined if not found
 *
 * @example
 * ```ts
 * const roboto = getFontMetadata('Roboto');
 * if (roboto) {
 *   console.log(`Weights: ${roboto.weights.join(', ')}`);
 *   console.log(`Variable: ${roboto.variable}`);
 * }
 * ```
 */
declare function getFontMetadata(family: string): FontMetadata | undefined;
/**
 * Get the top 50 most popular fonts
 *
 * @returns Array of the 50 most popular font metadata objects, sorted by popularity
 *
 * @example
 * ```ts
 * const popular = getPopularFonts();
 * console.log(`Most popular: ${popular[0].family}`);
 * ```
 */
declare function getPopularFonts(): FontMetadata[];
/**
 * Get fonts that support variable font technology
 *
 * @returns Array of variable font metadata objects
 *
 * @example
 * ```ts
 * const variableFonts = getVariableFonts();
 * console.log(`Variable fonts: ${variableFonts.length}`);
 * ```
 */
declare function getVariableFonts(): FontMetadata[];
/**
 * Search fonts by name (case-insensitive partial match)
 *
 * @param query - Search query string
 * @returns Array of matching font metadata objects
 *
 * @example
 * ```ts
 * const results = searchFonts('mono');
 * // Returns fonts like "Roboto Mono", "JetBrains Mono", etc.
 * ```
 */
declare function searchFonts(query: string): FontMetadata[];
/**
 * Get fonts that support specific weights
 *
 * @param weights - Array of weight values to check for
 * @param matchAll - If true, font must support all weights; if false, any weight
 * @returns Array of font metadata objects supporting the specified weights
 *
 * @example
 * ```ts
 * // Find fonts with both 300 and 700 weights
 * const fonts = getFontsByWeight([300, 700], true);
 *
 * // Find fonts with either 100 or 900 weights
 * const extremes = getFontsByWeight([100, 900], false);
 * ```
 */
declare function getFontsByWeight(weights: number[], matchAll?: boolean): FontMetadata[];
/**
 * Get fonts that support italic style
 *
 * @returns Array of font metadata objects with italic support
 *
 * @example
 * ```ts
 * const italicFonts = getFontsWithItalic();
 * ```
 */
declare function getFontsWithItalic(): FontMetadata[];
/**
 * Get catalog statistics
 *
 * @returns Object containing catalog statistics
 *
 * @example
 * ```ts
 * const stats = getCatalogStats();
 * console.log(`Total: ${stats.total}`);
 * console.log(`Sans-serif: ${stats.byCategory['sans-serif']}`);
 * ```
 */
declare function getCatalogStats(): {
    total: number;
    byCategory: Record<FontCategory, number>;
    variable: number;
    withItalic: number;
};
/**
 * Validate if a font family exists in the catalog
 *
 * @param family - Font family name to check
 * @returns True if the font exists in the catalog
 *
 * @example
 * ```ts
 * if (isFontAvailable('Roboto')) {
 *   // Font is available
 * }
 * ```
 */
declare function isFontAvailable(family: string): boolean;
/**
 * Get random fonts from the catalog
 *
 * @param count - Number of random fonts to return
 * @returns Array of random font metadata objects
 *
 * @example
 * ```ts
 * const randomFonts = getRandomFonts(5);
 * ```
 */
declare function getRandomFonts(count?: number): FontMetadata[];

export { type Anchor, type AnimatableProperties, type Animation, type AnimationPreset, type AnimationType, type AssetDefinition, type AssetType, type AudioLayer, type AudioLayerProps, type BackgroundFit, type BackgroundGradient, type BlendMode, type BlurPreset, type CompiledAnimation, type ComponentConfig, type ComponentDefaults, ComponentDefaultsManager, type ComponentInfo, ComponentPropsResolver, type ComponentRegistry, type ComponentSchema, type ComponentSourceType, type ComponentType, type ValidationError as ComponentValidationError, type Composition, type CustomComponentDefinition, type CustomComponentRef, type CustomFontDefinition, type CustomFontStyle, type CustomFontWeight, type CustomLayer, type CustomLayerProps, type Easing, type EasingFunction, type EasingName, type ElementCapability, type EmphasisAnimation, type EngineCapabilities, type EngineOptions, type EntranceAnimation, type EnumOption, type ExitAnimation, FONT_CONSTANTS, type Filter, type FilterAnimation, type FilterType, type FontCacheEntry, type FontCategory$1 as FontCategory, type FontConfiguration, type FontDisplay$1 as FontDisplay, type FontFallback, type FontFamily, type FontFormat, type FontLoadResult, FontLoadingError, type FontLoadingState, type FontLoadingStrategy, FontManager, type FontMetadata$1 as FontMetadata, type FontMetrics, type FontReference, type FontSource, type FontStyle$1 as FontStyle, type FontUploadOptions, type FontValidationResult, type FontWeight, type FrameAwareProps, type GoogleFontDefinition, type Gradient, type GradientStop, type GroupLayer, type GroupLayerProps, type ImageFit, type ImageLayer, type ImageLayerProps, type ImageResult, type InputDefinition, type InputType, type InputUI, type InputValidation, type JSONSchema7, type JSONSchema7TypeName, type Keyframe, type Layer, type LayerBase, type LayerProps, type LayerStyle, type LayerType, type LicenseInfo, type LoadedFonts, type LottieLayer, type LottieLayerProps, type NamedFontWeight, type NumericFontWeight, type OutputConfig, type Padding, type PartialTemplate, type Position, type PresetDefinition, type PresetOptions, type PropResolutionResult, type PropertySchema, type RenderImageOptions, type RenderProgress, type RenderVideoOptions, RendervidEngine, type ResolvedCustomLayer, type ResolvedStyle, type Scale, type Scene, type SceneTransition, type Shadow, type ShadowPreset, type ShapeLayer, type ShapeLayerProps, type ShapeType, type Size, type SystemFont, type Template, type TemplateAuthor, TemplateProcessor, type TextAlign, type TextLayer, type TextLayerProps, type TextShadow, type TextStroke, type TransitionDirection, type TransitionType, type ValidationError$1 as ValidationError, type ValidationResult, type ValidationWarning, type VerticalAlign, type VideoFit, type VideoLayer, type VideoLayerProps, type VideoResult, type WeightToNumeric, compileAnimation, createCubicBezier, createDefaultComponentDefaultsManager, createSpring, filterToCSS, filtersToCSS, generatePresetKeyframes, getAllEasingNames, getAllPresetNames, getCatalogStats, getCompositionDuration, getDefaultRegistry, getEasing, getFontCatalog, getFontMetadata, getFontsByCategory, getFontsByWeight, getFontsWithItalic, getLayerSchema, getPopularFonts, getPreset, getPresetsByType, getPropertiesAtFrame, getRandomFonts, getSceneAtFrame, getTemplateSchema, getValueAtFrame, getVariableFonts, interpolate, isFontAvailable, isNamedWeight, isNumericWeight, numericToNamedWeight, parseEasing, searchFonts, templateSchema, validateInputs, validateSceneOrder, validateTemplate, weightToNumeric };
