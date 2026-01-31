import { CSSProperties } from 'react';

/**
 * Animation type categories.
 */
type AnimationType = 'entrance' | 'exit' | 'emphasis' | 'keyframe';
/**
 * Entrance animation presets.
 */
type EntranceAnimation = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'scaleInUp' | 'scaleInDown' | 'rotateIn' | 'rotateInClockwise' | 'rotateInCounterClockwise' | 'bounceIn' | 'bounceInUp' | 'bounceInDown' | 'flipInX' | 'flipInY' | 'zoomIn' | 'typewriter' | 'revealLeft' | 'revealRight' | 'revealUp' | 'revealDown';
/**
 * Exit animation presets.
 */
type ExitAnimation = 'fadeOut' | 'fadeOutUp' | 'fadeOutDown' | 'fadeOutLeft' | 'fadeOutRight' | 'slideOutUp' | 'slideOutDown' | 'slideOutLeft' | 'slideOutRight' | 'scaleOut' | 'rotateOut' | 'bounceOut' | 'flipOutX' | 'flipOutY' | 'zoomOut';
/**
 * Emphasis animation presets (can loop).
 */
type EmphasisAnimation = 'pulse' | 'shake' | 'bounce' | 'swing' | 'wobble' | 'flash' | 'rubberBand' | 'heartbeat' | 'float' | 'spin';
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
type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
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
type TransitionType = 'cut' | 'fade' | 'slide' | 'wipe' | 'zoom';
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
 * Validation error.
 */
interface ValidationError {
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
    errors: ValidationError[];
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

export { type Anchor, type AnimatableProperties, type Animation, type AnimationPreset, type AnimationType, type AssetDefinition, type AssetType, type AudioLayer, type AudioLayerProps, type BackgroundFit, type BackgroundGradient, type BlendMode, type BlurPreset, type CompiledAnimation, type ComponentInfo, type ComponentRegistry, type ComponentSourceType, type ComponentType, type Composition, type CustomComponentDefinition, type CustomComponentRef, type CustomLayer, type CustomLayerProps, type Easing, type EasingFunction, type EasingName, type ElementCapability, type EmphasisAnimation, type EngineCapabilities, type EngineOptions, type EntranceAnimation, type EnumOption, type ExitAnimation, type Filter, type FilterAnimation, type FilterType, type FontWeight, type Gradient, type GradientStop, type GroupLayer, type GroupLayerProps, type ImageFit, type ImageLayer, type ImageLayerProps, type ImageResult, type InputDefinition, type InputType, type InputUI, type InputValidation, type JSONSchema7, type JSONSchema7TypeName, type Keyframe, type Layer, type LayerBase, type LayerProps, type LayerStyle, type LayerType, type LottieLayer, type LottieLayerProps, type OutputConfig, type Padding, type PartialTemplate, type Position, type PresetDefinition, type PresetOptions, type RenderImageOptions, type RenderProgress, type RenderVideoOptions, RendervidEngine, type ResolvedStyle, type Scale, type Scene, type SceneTransition, type Shadow, type ShadowPreset, type ShapeLayer, type ShapeLayerProps, type ShapeType, type Size, type Template, type TemplateAuthor, type TextAlign, type TextLayer, type TextLayerProps, type TextShadow, type TextStroke, type TransitionDirection, type TransitionType, type ValidationError, type ValidationResult, type ValidationWarning, type VerticalAlign, type VideoFit, type VideoLayer, type VideoLayerProps, type VideoResult, compileAnimation, createCubicBezier, createSpring, filterToCSS, filtersToCSS, generatePresetKeyframes, getAllEasingNames, getAllPresetNames, getCompositionDuration, getEasing, getLayerSchema, getPreset, getPresetsByType, getPropertiesAtFrame, getSceneAtFrame, getTemplateSchema, getValueAtFrame, interpolate, parseEasing, templateSchema, validateInputs, validateSceneOrder, validateTemplate };
