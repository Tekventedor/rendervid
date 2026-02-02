import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Easing function type for stagger animation
 */
export type StaggerEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animation type for character entrance
 */
export type StaggerAnimation = 'fade' | 'slideUp' | 'slideDown' | 'scale' | 'bounce';

/**
 * Props for the StaggerText component
 */
export interface StaggerTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Frames between characters */
  stagger?: number;
  /** Animation type for character entrance */
  animation?: StaggerAnimation;
  /** Duration per character in frames */
  duration?: number;
  /** Easing function */
  easing?: StaggerEasing;
  /** Font size in pixels */
  fontSize?: number;
  /** Text color */
  color?: string;
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
  /** Delay before starting animation in frames */
  delay?: number;
}

/**
 * Apply easing function to progress value
 */
function applyEasing(progress: number, easing: StaggerEasing): number {
  const t = clamp(progress, 0, 1);

  switch (easing) {
    case 'linear':
      return t;
    case 'ease-in':
      return t * t;
    case 'ease-out':
      return 1 - Math.pow(1 - t, 2);
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    default:
      return t;
  }
}

/**
 * Calculate character animation styles based on animation type and progress
 */
function calculateCharacterStyle(
  progress: number,
  animation: StaggerAnimation,
  easing: StaggerEasing
): CSSProperties {
  const easedProgress = applyEasing(progress, easing);

  switch (animation) {
    case 'fade':
      return {
        opacity: easedProgress,
      };

    case 'slideUp': {
      const distance = 20 * (1 - easedProgress);
      return {
        opacity: easedProgress,
        transform: `translateY(${distance}px)`,
      };
    }

    case 'slideDown': {
      const distance = -20 * (1 - easedProgress);
      return {
        opacity: easedProgress,
        transform: `translateY(${distance}px)`,
      };
    }

    case 'scale':
      return {
        opacity: easedProgress,
        transform: `scale(${easedProgress})`,
      };

    case 'bounce': {
      let bounceProgress = easedProgress;
      // Add bounce effect at the end
      if (easedProgress > 0.8) {
        const bouncePhase = (easedProgress - 0.8) / 0.2;
        bounceProgress = easedProgress + Math.sin(bouncePhase * Math.PI) * 0.1;
      }
      return {
        opacity: easedProgress,
        transform: `scale(${bounceProgress})`,
      };
    }

    default:
      return {
        opacity: easedProgress,
      };
  }
}

/**
 * StaggerText Component
 *
 * A text animation component where characters appear one by one with staggered timing.
 * Each character can have different entrance animations like fade, slide, scale, or bounce.
 *
 * Features:
 * - Frame-based stagger animation (not time-based)
 * - Multiple animation types: fade, slideUp, slideDown, scale, bounce
 * - Per-character animation with customizable delay
 * - Support for delays and easing functions
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic fade stagger
 * <StaggerText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   stagger={3}
 *   animation="fade"
 *   duration={15}
 * />
 *
 * // Slide up animation
 * <StaggerText
 *   text="Welcome"
 *   frame={currentFrame}
 *   stagger={2}
 *   animation="slideUp"
 *   duration={20}
 *   easing="ease-out"
 * />
 *
 * // Bounce effect with delay
 * <StaggerText
 *   text="Surprise!"
 *   frame={currentFrame}
 *   stagger={4}
 *   animation="bounce"
 *   duration={25}
 *   delay={30}
 *   fontSize={48}
 *   color="#ff0080"
 * />
 * ```
 */
export function StaggerText({
  text,
  stagger = 3,
  animation = 'fade',
  duration = 15,
  easing = 'ease-out',
  fontSize = 24,
  color = '#ffffff',
  fontFamily = 'Arial, sans-serif',
  fontWeight = 'normal',
  lineHeight = 1.5,
  textAlign = 'left',
  letterSpacing,
  textShadow,
  delay = 0,
  frame = 0,
  fps = 30,
  className,
  style,
}: StaggerTextProps): React.ReactElement {
  // Calculate effective frame (accounting for delay)
  const effectiveFrame = Math.max(0, frame - delay);

  // Base container styles
  const containerStyle: CSSProperties = {
    fontSize,
    color,
    fontFamily,
    fontWeight,
    lineHeight,
    textAlign,
    letterSpacing: letterSpacing !== undefined ? `${letterSpacing}px` : undefined,
    textShadow,
    display: 'inline-block',
    ...style,
  };

  // Split text into characters
  const characters = text.split('');

  return (
    <div className={className} style={containerStyle}>
      {characters.map((char, index) => {
        // Calculate when this character should start animating
        const charStartFrame = index * stagger;
        const charEndFrame = charStartFrame + duration;

        // Calculate progress for this character
        let charProgress = 0;
        if (effectiveFrame >= charEndFrame) {
          charProgress = 1;
        } else if (effectiveFrame > charStartFrame) {
          charProgress = (effectiveFrame - charStartFrame) / duration;
        }

        // Get animation styles
        const animationStyle = calculateCharacterStyle(charProgress, animation, easing);

        // Combine with base character styles
        const charStyle: CSSProperties = {
          ...animationStyle,
          display: 'inline-block',
          whiteSpace: char === ' ' ? 'pre' : 'normal',
        };

        return (
          <span key={index} style={charStyle}>
            {char}
          </span>
        );
      })}
    </div>
  );
}
