import type { CSSProperties, ReactNode } from 'react';

/**
 * Common props for all Rendervid components
 */
export interface BaseComponentProps {
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Children elements */
  children?: ReactNode;
}

/**
 * Props for animated components
 */
export interface AnimatedProps extends BaseComponentProps {
  /** Current frame number */
  frame: number;
  /** Total frame count */
  totalFrames?: number;
  /** Frames per second */
  fps?: number;
}

/**
 * Text component props
 */
export interface TextProps extends BaseComponentProps {
  /** Text content */
  text: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: string | number;
  /** Text color */
  color?: string;
  /** Text alignment */
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  /** Line height */
  lineHeight?: number;
  /** Letter spacing */
  letterSpacing?: number;
  /** Text shadow */
  textShadow?: string;
  /** Text stroke width */
  strokeWidth?: number;
  /** Text stroke color */
  strokeColor?: string;
}

/**
 * Image component props
 */
export interface ImageProps extends BaseComponentProps {
  /** Image source URL */
  src: string;
  /** Alt text */
  alt?: string;
  /** Object fit mode */
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Object position */
  position?: string;
  /** Border radius */
  borderRadius?: number | string;
}

/**
 * Video component props
 */
export interface VideoProps extends AnimatedProps {
  /** Video source URL */
  src: string;
  /** Poster image */
  poster?: string;
  /** Object fit mode */
  fit?: 'cover' | 'contain' | 'fill';
  /** Mute audio */
  muted?: boolean;
  /** Loop video */
  loop?: boolean;
  /** Playback rate */
  playbackRate?: number;
  /** Start time in seconds */
  startTime?: number;
}

/**
 * Shape component props
 */
export interface ShapeProps extends BaseComponentProps {
  /** Shape type */
  shape: 'rectangle' | 'circle' | 'ellipse' | 'triangle' | 'star' | 'polygon';
  /** Fill color */
  fill?: string;
  /** Gradient fill */
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Border radius (for rectangle) */
  borderRadius?: number | string;
  /** Number of sides (for polygon) */
  sides?: number;
  /** Number of points (for star) */
  points?: number;
  /** Inner radius ratio for star (0-1) */
  innerRadius?: number;
}

/**
 * Gradient text props
 */
export interface GradientTextProps extends TextProps {
  /** Gradient colors */
  colors: string[];
  /** Gradient angle (for linear) */
  angle?: number;
  /** Gradient type */
  gradientType?: 'linear' | 'radial';
}

/**
 * Counter/number animation props
 */
export interface CounterProps extends AnimatedProps {
  /** Starting value */
  from: number;
  /** Ending value */
  to: number;
  /** Number of decimal places */
  decimals?: number;
  /** Prefix (e.g., "$") */
  prefix?: string;
  /** Suffix (e.g., "%") */
  suffix?: string;
  /** Format function */
  format?: (value: number) => string;
  /** Font size */
  fontSize?: number;
  /** Text color */
  color?: string;
}

/**
 * Progress bar props
 */
export interface ProgressBarProps extends AnimatedProps {
  /** Progress value (0-1) */
  value: number;
  /** Bar color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Border radius */
  borderRadius?: number;
  /** Height */
  height?: number;
  /** Animate the progress */
  animated?: boolean;
}

/**
 * Typewriter effect props
 */
export interface TypewriterProps extends AnimatedProps {
  /** Text to type */
  text: string;
  /** Characters per second */
  speed?: number;
  /** Show cursor */
  showCursor?: boolean;
  /** Cursor character */
  cursor?: string;
  /** Start delay in frames */
  startDelay?: number;
  /** Font size */
  fontSize?: number;
  /** Text color */
  color?: string;
}

/**
 * Fade component props
 */
export interface FadeProps extends AnimatedProps {
  /** Fade direction */
  direction: 'in' | 'out' | 'inOut';
  /** Duration in frames */
  duration?: number;
  /** Delay in frames */
  delay?: number;
}

/**
 * Slide component props
 */
export interface SlideProps extends AnimatedProps {
  /** Slide direction */
  from: 'left' | 'right' | 'top' | 'bottom';
  /** Distance to slide in pixels */
  distance?: number;
  /** Duration in frames */
  duration?: number;
  /** Delay in frames */
  delay?: number;
  /** Also fade */
  fade?: boolean;
}

/**
 * Scale component props
 */
export interface ScaleProps extends AnimatedProps {
  /** Starting scale */
  from?: number;
  /** Ending scale */
  to?: number;
  /** Duration in frames */
  duration?: number;
  /** Delay in frames */
  delay?: number;
}

/**
 * Rotate component props
 */
export interface RotateProps extends AnimatedProps {
  /** Starting angle in degrees */
  from?: number;
  /** Ending angle in degrees */
  to?: number;
  /** Duration in frames */
  duration?: number;
  /** Delay in frames */
  delay?: number;
  /** Rotation origin */
  origin?: string;
}

/**
 * Container/wrapper props
 */
export interface ContainerProps extends BaseComponentProps {
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Background color */
  backgroundColor?: string;
  /** Padding */
  padding?: number | string;
  /** Border radius */
  borderRadius?: number | string;
  /** Border */
  border?: string;
  /** Box shadow */
  boxShadow?: string;
  /** Flexbox direction */
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Justify content */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /** Align items */
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  /** Gap between children */
  gap?: number | string;
}

/**
 * Aurora Background props
 */
export interface AuroraBackgroundProps extends AnimatedProps {
  /** Array of gradient colors (2-5 colors recommended) */
  colors?: string[];
  /** Animation speed multiplier (higher = faster) */
  speed?: number;
  /** Blur intensity in pixels */
  blur?: number;
  /** Overall opacity of the effect */
  opacity?: number;
  /** Width of the container */
  width?: number | string;
  /** Height of the container */
  height?: number | string;
}

/**
 * Wave Background props
 */
export interface WaveBackgroundProps extends AnimatedProps {
  /** Array of gradient colors for the waves */
  colors?: string[];
  /** Number of wave layers (1-3) */
  waveCount?: number;
  /** Wave amplitude in pixels */
  amplitude?: number;
  /** Wave frequency (higher = more waves per width) */
  frequency?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Wave direction */
  direction?: 'top' | 'bottom' | 'both';
  /** Wave opacity (0-1) */
  opacity?: number;
  /** Container width */
  width?: number | string;
  /** Container height */
  height?: number | string;
}

/**
 * ParticleSystem props
 */
export interface ParticleSystemProps extends AnimatedProps {
  /** Number of particles to render */
  count?: number;
  /** Particle shape type */
  type?: 'circle' | 'square' | 'star' | 'image';
  /** Particle color (or array of colors for random selection) */
  color?: string | string[];
  /** Particle size in pixels (or range [min, max]) */
  size?: number | [number, number];
  /** Particle movement speed (pixels per frame) */
  speed?: number | [number, number];
  /** Particle movement direction */
  direction?: 'up' | 'down' | 'left' | 'right' | 'random' | 'radial' | 'static';
  /** Particle opacity (0-1) */
  opacity?: number | [number, number];
  /** Particle lifetime in frames (0 = infinite) */
  lifetime?: number;
  /** Width of the particle system container */
  width?: number;
  /** Height of the particle system container */
  height?: number;
  /** Enable particle wrapping at edges */
  wrap?: boolean;
  /** Enable fade-in effect */
  fadeIn?: boolean;
  /** Enable fade-out effect */
  fadeOut?: boolean;
  /** Enable particle connections */
  connections?: boolean;
  /** Maximum distance for connections in pixels */
  connectionDistance?: number;
  /** Connection line color */
  connectionColor?: string;
  /** Connection line opacity */
  connectionOpacity?: number;
  /** Connection line width */
  connectionWidth?: number;
  /** Particle effect type */
  effect?: 'gravity' | 'attraction' | 'repulsion' | 'connections' | 'none';
  /** Effect strength (for gravity, attraction, repulsion) */
  effectStrength?: number;
  /** Effect center point [x, y] for attraction/repulsion (0-1 normalized) */
  effectCenter?: [number, number];
  /** Image URL (when type is 'image') */
  imageUrl?: string;
  /** Random seed for deterministic particle generation */
  seed?: number;
}

/**
 * 3D vector type
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * ThreeScene component props for 3D rendering
 */
export interface ThreeSceneProps extends AnimatedProps {
  /** Geometry type */
  geometry: 'box' | 'sphere' | 'torus' | 'plane';
  /** Fill color */
  color?: string;
  /** Wireframe mode */
  wireframe?: boolean;
  /** Rotation speed in radians per second for each axis */
  rotation?: Partial<Vector3>;
  /** Position offset from center */
  position?: Partial<Vector3>;
  /** Scale multiplier */
  scale?: number;
  /** Camera distance from origin */
  cameraDistance?: number;
  /** Lighting mode */
  lighting?: 'ambient' | 'directional' | 'none';
  /** Width of the scene */
  width?: number;
  /** Height of the scene */
  height?: number;
}

/**
 * Lottie animation data type (standard Lottie JSON format)
 */
export interface LottieAnimationData {
  v?: string; // Bodymovin version
  fr?: number; // Frame rate
  ip?: number; // In point (start frame)
  op?: number; // Out point (end frame)
  w?: number; // Width
  h?: number; // Height
  assets?: unknown[];
  layers?: unknown[];
  [key: string]: unknown;
}

/**
 * LottieAnimation component props
 */
export interface LottieAnimationProps extends AnimatedProps {
  /** Lottie JSON animation data (inline) */
  animationData?: LottieAnimationData;
  /** URL to Lottie JSON file */
  src?: string;
  /** Playback speed multiplier (default: 1) */
  speed?: number;
  /** Loop animation (default: true) */
  loop?: boolean;
  /** Autoplay (for video rendering, controlled by frame prop) */
  autoplay?: boolean;
  /** Width of animation container */
  width?: number | string;
  /** Height of animation container */
  height?: number | string;
}

/**
 * Glitch effect props
 */
export interface GlitchEffectProps extends AnimatedProps {
  /** Type of glitch effect */
  type: "slice" | "shift" | "rgb-split" | "noise" | "scramble";
  /** Intensity of the glitch (0-1) */
  intensity?: number;
  /** Number of glitches per second */
  frequency?: number;
  /** Duration of each glitch in milliseconds */
  duration?: number;
}
