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
