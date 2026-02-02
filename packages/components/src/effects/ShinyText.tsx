import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Direction type for shine animation
 */
export type ShineDirection = 'left' | 'right';

/**
 * Props for the ShinyText component
 */
export interface ShinyTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Shine highlight color (default: white) */
  shineColor?: string;
  /** Base text color */
  baseColor?: string;
  /** Duration of one sweep in frames */
  duration?: number;
  /** Loop the shine animation */
  loop?: boolean;
  /** Direction of shine sweep */
  direction?: ShineDirection;
  /** Font size in pixels */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: string | number;
  /** Line height */
  lineHeight?: number | string;
  /** Text alignment */
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  /** Letter spacing in pixels */
  letterSpacing?: number;
  /** Text shadow */
  textShadow?: string;
}

/**
 * Calculate gradient position based on current frame
 */
function calculateGradientPosition(
  progress: number,
  direction: ShineDirection
): number {
  // Progress ranges from 0 to 1
  // For 'left' direction: gradient moves from left (-100%) to right (200%)
  // For 'right' direction: gradient moves from right (200%) to left (-100%)
  const clamped = clamp(progress, 0, 1);

  if (direction === 'left') {
    // Start at -100% (off-screen left), end at 200% (off-screen right)
    return -100 + clamped * 300;
  } else {
    // Start at 200% (off-screen right), end at -100% (off-screen left)
    return 200 - clamped * 300;
  }
}

/**
 * ShinyText Component
 *
 * A text animation component that creates a gradient shine sweep effect across text.
 * The shine uses CSS background-clip: text to create a moving highlight effect.
 *
 * Features:
 * - Frame-based shine animation (not time-based)
 * - Customizable shine and base colors
 * - Bidirectional sweep (left-to-right or right-to-left)
 * - Optional looping
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic usage - shine sweeps left to right
 * <ShinyText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   duration={60}
 *   shineColor="rgba(255, 255, 255, 0.8)"
 *   baseColor="#666"
 * />
 *
 * // Right to left with looping
 * <ShinyText
 *   text="Shiny Effect"
 *   frame={currentFrame}
 *   duration={90}
 *   direction="right"
 *   loop={true}
 *   shineColor="rgba(255, 215, 0, 0.9)"
 *   baseColor="#333"
 * />
 *
 * // Custom styling
 * <ShinyText
 *   text="Gradient Shine"
 *   frame={currentFrame}
 *   duration={120}
 *   shineColor="rgba(100, 200, 255, 0.9)"
 *   baseColor="#1a1a1a"
 *   fontSize={48}
 *   fontWeight="bold"
 * />
 * ```
 */
export function ShinyText({
  text,
  shineColor = 'rgba(255, 255, 255, 0.8)',
  baseColor = '#666666',
  duration = 60,
  loop = false,
  direction = 'left',
  fontSize = 24,
  fontFamily = 'Arial, sans-serif',
  fontWeight = 'normal',
  lineHeight = 1.5,
  textAlign = 'left',
  letterSpacing,
  textShadow,
  frame = 0,
  fps = 30,
  className,
  style,
}: ShinyTextProps): React.ReactElement {
  // Calculate progress through the animation
  let effectiveFrame = frame;

  if (loop && duration > 0) {
    // Loop the animation by wrapping frame to duration
    effectiveFrame = frame % duration;
  }

  // Calculate progress (0 to 1)
  const progress = duration > 0 ? Math.min(1, effectiveFrame / duration) : 1;

  // Calculate gradient position
  const gradientPosition = calculateGradientPosition(progress, direction);

  // Create the gradient that sweeps across
  // The gradient has three color stops:
  // 1. Base color (before shine)
  // 2. Shine color (the highlight)
  // 3. Base color (after shine)
  const gradientAngle = direction === 'left' ? '90deg' : '90deg'; // Horizontal sweep
  const backgroundImage = `linear-gradient(${gradientAngle}, ${baseColor} ${gradientPosition - 30}%, ${shineColor} ${gradientPosition}%, ${baseColor} ${gradientPosition + 30}%)`;

  // Base container styles
  const containerStyle: CSSProperties = {
    fontSize,
    fontFamily,
    fontWeight,
    lineHeight,
    textAlign,
    letterSpacing: letterSpacing !== undefined ? `${letterSpacing}px` : undefined,
    textShadow,
    display: 'inline-block',
    ...style,
  };

  // Text style with gradient and background-clip
  const textStyle: CSSProperties = {
    background: backgroundImage,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    display: 'inline-block',
  };

  return (
    <div className={className} style={containerStyle}>
      <span style={textStyle}>{text}</span>
    </div>
  );
}
