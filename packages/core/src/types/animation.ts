/**
 * Animation type categories.
 */
export type AnimationType = 'entrance' | 'exit' | 'emphasis' | 'keyframe';

/**
 * Entrance animation presets.
 */
export type EntranceAnimation =
  // Basic fade
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  // Slide
  | 'slideInUp'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInFromTopLeft'
  | 'slideInFromTopRight'
  | 'slideInFromBottomLeft'
  | 'slideInFromBottomRight'
  // Scale & zoom
  | 'scaleIn'
  | 'scaleInUp'
  | 'scaleInDown'
  | 'zoomIn'
  // Rotate
  | 'rotateIn'
  | 'rotateInClockwise'
  | 'rotateInCounterClockwise'
  // Bounce
  | 'bounceIn'
  | 'bounceInUp'
  | 'bounceInDown'
  // Flip
  | 'flipInX'
  | 'flipInY'
  // Special
  | 'rollIn'
  | 'lightSpeedIn'
  | 'swingIn'
  | 'backIn'
  | 'elasticIn'
  // Text-specific
  | 'typewriter'
  | 'revealLeft'
  | 'revealRight'
  | 'revealUp'
  | 'revealDown';

/**
 * Exit animation presets.
 */
export type ExitAnimation =
  // Basic fade
  | 'fadeOut'
  | 'fadeOutUp'
  | 'fadeOutDown'
  | 'fadeOutLeft'
  | 'fadeOutRight'
  // Slide
  | 'slideOutUp'
  | 'slideOutDown'
  | 'slideOutLeft'
  | 'slideOutRight'
  // Scale & zoom
  | 'scaleOut'
  | 'zoomOut'
  // Rotate
  | 'rotateOut'
  // Bounce
  | 'bounceOut'
  // Flip
  | 'flipOutX'
  | 'flipOutY'
  // Special
  | 'rollOut'
  | 'lightSpeedOut'
  | 'swingOut'
  | 'backOut'
  | 'elasticOut';

/**
 * Emphasis animation presets (can loop).
 */
export type EmphasisAnimation =
  // Subtle
  | 'pulse'
  | 'float'
  | 'heartbeat'
  // Movement
  | 'shake'
  | 'bounce'
  | 'swing'
  | 'wobble'
  // Attention
  | 'flash'
  | 'tada'
  // Elastic
  | 'rubberBand'
  | 'jello'
  // Rotation
  | 'spin';

/**
 * All animation preset names.
 */
export type AnimationPreset = EntranceAnimation | ExitAnimation | EmphasisAnimation;

/**
 * Easing function names.
 */
export type EasingName =
  // Basic
  | 'linear'
  // Quad
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  // Cubic
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  // Quart
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  // Quint
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  // Sine
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  // Expo
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  // Circ
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  // Back
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  // Elastic
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInOutElastic'
  // Bounce
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInOutBounce';

/**
 * Easing value can be a preset name, cubic-bezier, or spring.
 * @example 'easeOutCubic'
 * @example 'cubic-bezier(0.25, 0.1, 0.25, 1)'
 * @example 'spring(1, 100, 10)'
 */
export type Easing = EasingName | string;

/**
 * Animatable properties that can be keyframed.
 */
export interface AnimatableProperties {
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
export interface Keyframe {
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
export interface Animation {
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
export interface CompiledAnimation {
  /** Total duration in frames */
  totalFrames: number;
  /** Get properties at a specific frame */
  getPropertiesAtFrame(frame: number): AnimatableProperties;
}

/**
 * Easing function type.
 * Takes progress (0-1) and returns eased value (0-1).
 */
export type EasingFunction = (t: number) => number;
