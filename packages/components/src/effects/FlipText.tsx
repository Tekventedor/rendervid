import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Easing function type for flip text animation
 */
export type FlipTextEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animation mode - split by words or letters
 */
export type FlipTextMode = 'words' | 'letters';

/**
 * Flip axis - which axis to rotate around
 */
export type FlipAxis = 'x' | 'y' | 'both';

/**
 * Flip direction - forward or backward
 */
export type FlipDirection = 'forward' | 'backward';

/**
 * Props for the FlipText component
 */
export interface FlipTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Animation mode - split by words or letters */
  mode?: FlipTextMode;
  /** Flip axis (x = horizontal, y = vertical, both = diagonal) */
  axis?: FlipAxis;
  /** Flip direction (forward = 0-180deg, backward = 180-0deg) */
  direction?: FlipDirection;
  /** Duration of the animation in frames */
  duration?: number;
  /** Frames between each character/word starting animation */
  stagger?: number;
  /** Easing function */
  easing?: FlipTextEasing;
  /** Perspective distance in pixels for 3D effect */
  perspective?: number;
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
function applyEasing(progress: number, easing: FlipTextEasing): number {
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
 * Calculate transform values for flip animations
 */
function calculateFlipTransform(
  progress: number,
  axis: FlipAxis,
  direction: FlipDirection,
  easing: FlipTextEasing
): { transform: string; opacity: number } {
  const easedProgress = applyEasing(progress, easing);

  // Calculate rotation angle based on direction
  let angle: number;
  if (direction === 'forward') {
    // Start at 90deg (invisible), flip to 0deg (visible)
    angle = 90 * (1 - easedProgress);
  } else {
    // Start at 0deg (visible), flip to 90deg (invisible), then to 180deg (visible again)
    if (easedProgress < 0.5) {
      // First half: 0 to 90 degrees (fading out)
      angle = 90 * (easedProgress * 2);
    } else {
      // Second half: 90 to 0 degrees (fading in from opposite side)
      angle = 90 * (2 - easedProgress * 2);
    }
  }

  // Calculate opacity based on angle (fade out when perpendicular to view)
  const normalizedAngle = Math.abs(angle) % 180;
  const opacity = direction === 'forward'
    ? easedProgress  // Simple fade in for forward
    : normalizedAngle < 45 || normalizedAngle > 135
      ? 1  // Fully visible when facing camera
      : 1 - (Math.abs(normalizedAngle - 90) / 45);  // Fade during flip

  // Build transform string based on axis
  let transform = '';

  switch (axis) {
    case 'x':
      transform = `rotateX(${angle}deg)`;
      break;
    case 'y':
      transform = `rotateY(${angle}deg)`;
      break;
    case 'both':
      transform = `rotateX(${angle}deg) rotateY(${angle}deg)`;
      break;
  }

  return {
    transform,
    opacity,
  };
}

/**
 * Split text into words while preserving whitespace
 */
function splitIntoWords(text: string): string[] {
  return text.split(/(\s+)/);
}

/**
 * Split text into individual letters/characters
 */
function splitIntoLetters(text: string): string[] {
  return text.split('');
}

/**
 * FlipText Component
 *
 * A text animation component where characters flip in/out with 3D rotation effects.
 * Inspired by react-bits flip-text animation, adapted for frame-aware video rendering.
 *
 * Features:
 * - Frame-based 3D flip animation (not time-based)
 * - Multiple flip axes: X (horizontal), Y (vertical), both (diagonal)
 * - Forward and backward flip directions
 * - Staggered timing per character/word
 * - CSS 3D transforms with perspective
 * - Support for easing functions
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic usage - letters flip in vertically
 * <FlipText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   mode="letters"
 *   axis="y"
 *   direction="forward"
 *   duration={60}
 *   stagger={2}
 * />
 *
 * // Words flip horizontally
 * <FlipText
 *   text="Flipping words horizontally"
 *   mode="words"
 *   axis="x"
 *   frame={currentFrame}
 *   duration={45}
 *   stagger={5}
 *   easing="ease-out"
 * />
 *
 * // Diagonal flip with both axes
 * <FlipText
 *   text="Diagonal flip"
 *   mode="letters"
 *   axis="both"
 *   direction="backward"
 *   frame={currentFrame}
 *   duration={60}
 *   stagger={3}
 *   fontSize={48}
 *   color="#ff0080"
 *   perspective={800}
 * />
 * ```
 */
export function FlipText({
  text,
  mode = 'letters',
  axis = 'y',
  direction = 'forward',
  duration = 60,
  stagger = 2,
  easing = 'ease-out',
  perspective = 1000,
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
}: FlipTextProps): React.ReactElement {
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
    perspective: `${perspective}px`,
    ...style,
  };

  // Split text based on mode
  const parts = mode === 'words' ? splitIntoWords(text) : splitIntoLetters(text);

  // Filter out whitespace for counting (for words mode)
  const nonWhitespaceParts = mode === 'words'
    ? parts.filter((part) => part.trim())
    : parts;
  const totalParts = nonWhitespaceParts.length;

  return (
    <div className={className} style={containerStyle}>
      {parts.map((part, index) => {
        // Skip transform calculation for whitespace in words mode
        if (mode === 'words' && !part.trim()) {
          return <span key={index}>{part}</span>;
        }

        // Calculate the index among non-whitespace parts
        const partIndex = mode === 'words'
          ? parts.slice(0, index).filter((p) => p.trim()).length
          : index;

        // Calculate timing for this part
        const startFrame = partIndex * stagger;
        const endFrame = startFrame + duration;

        // Calculate progress for this part
        let progress = 0;
        if (effectiveFrame >= endFrame) {
          progress = 1;
        } else if (effectiveFrame > startFrame) {
          progress = (effectiveFrame - startFrame) / duration;
        }

        // Get transform values
        const { transform, opacity } = calculateFlipTransform(
          progress,
          axis,
          direction,
          easing
        );

        const partStyle: CSSProperties = {
          display: 'inline-block',
          transform,
          opacity,
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          whiteSpace: part === ' ' ? 'pre' : 'normal',
        };

        return (
          <span key={index} style={partStyle}>
            {part}
          </span>
        );
      })}
    </div>
  );
}
