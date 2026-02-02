import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Animation mode - how text should bounce into place
 */
export type BounceMode = 'whole' | 'letters';

/**
 * Direction from which text bounces in
 */
export type BounceDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Props for the BounceText component
 */
export interface BounceTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Animation mode - whole text or letter by letter */
  mode?: BounceMode;
  /** Direction from which text bounces in */
  direction?: BounceDirection;
  /** Duration of the animation in frames */
  duration?: number;
  /** Number of bounces during animation */
  bounces?: number;
  /** Stagger delay between letters in frames (only for letters mode) */
  stagger?: number;
  /** Delay before starting animation in frames */
  delay?: number;
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
}

/**
 * Elastic easing function with diminishing amplitude for bounce effect
 */
function elasticEaseOut(t: number, bounces: number = 3): number {
  const c = clamp(t, 0, 1);
  if (c === 0 || c === 1) return c;

  // Elastic parameters
  const p = 0.3; // Period
  const s = p / 4; // Phase shift

  // Calculate elastic overshoot with diminishing amplitude
  const power = Math.pow(2, -10 * c);
  const sine = Math.sin((c - s) * (2 * Math.PI) * bounces / p);

  return 1 - power * sine;
}

/**
 * Calculate bounce transform based on progress and direction
 */
function calculateBounceTransform(
  progress: number,
  direction: BounceDirection,
  bounces: number
): { x: number; y: number } {
  // Get elastic value (0 at start, overshoots/bounces, settles to 1 at end)
  const elasticValue = elasticEaseOut(progress, bounces);

  // Calculate offset from final position (starts at -1, bounces through 0 to settle at 0)
  const offset = (1 - elasticValue) * 100; // 100px max distance

  // Apply direction
  switch (direction) {
    case 'up':
      return { x: 0, y: offset };
    case 'down':
      return { x: 0, y: -offset };
    case 'left':
      return { x: offset, y: 0 };
    case 'right':
      return { x: -offset, y: 0 };
    default:
      return { x: 0, y: offset };
  }
}

/**
 * Split text into individual letters/characters
 */
function splitIntoLetters(text: string): string[] {
  return text.split('');
}

/**
 * BounceText Component
 *
 * A text animation component where text bounces into place with elastic easing.
 * Features an overshoot effect that creates a natural, bouncy entrance.
 *
 * Features:
 * - Frame-based bounce animation (not time-based)
 * - Multiple animation modes: whole text or letter-by-letter
 * - Customizable bounce direction (up, down, left, right)
 * - Adjustable number of bounces and stagger timing
 * - Elastic easing with diminishing amplitude
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic usage - bounce entire text from bottom
 * <BounceText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   direction="up"
 *   duration={60}
 *   bounces={3}
 * />
 *
 * // Letter-by-letter with stagger
 * <BounceText
 *   text="Welcome"
 *   mode="letters"
 *   frame={currentFrame}
 *   direction="down"
 *   duration={90}
 *   stagger={3}
 *   bounces={2}
 * />
 *
 * // Bounce from left with delay
 * <BounceText
 *   text="Animated Text"
 *   direction="left"
 *   delay={30}
 *   frame={currentFrame}
 *   duration={75}
 * />
 * ```
 */
export function BounceText({
  text,
  mode = 'whole',
  direction = 'up',
  duration = 60,
  bounces = 3,
  stagger = 2,
  delay = 0,
  fontSize = 24,
  color = '#ffffff',
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
}: BounceTextProps): React.ReactElement {
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

  // Whole text mode - animate entire text as one unit
  if (mode === 'whole') {
    const progress = Math.min(1, effectiveFrame / duration);
    const { x, y } = calculateBounceTransform(progress, direction, bounces);

    const textStyle: CSSProperties = {
      display: 'inline-block',
      transform: `translate(${x}px, ${y}px)`,
      transition: 'none', // Ensure no CSS transitions interfere
    };

    return (
      <div className={className} style={containerStyle}>
        <span style={textStyle}>{text}</span>
      </div>
    );
  }

  // Letter-by-letter mode
  if (mode === 'letters') {
    const letters = splitIntoLetters(text);
    const baseFramesPerLetter = duration / letters.length;

    return (
      <div className={className} style={containerStyle}>
        {letters.map((letter, index) => {
          // Calculate when this letter's animation starts and ends
          const letterStartFrame = index * stagger;
          const letterEndFrame = letterStartFrame + duration;

          // Calculate progress for this specific letter
          let letterProgress = 0;
          if (effectiveFrame >= letterEndFrame) {
            letterProgress = 1;
          } else if (effectiveFrame > letterStartFrame) {
            letterProgress = (effectiveFrame - letterStartFrame) / duration;
          }

          const { x, y } = calculateBounceTransform(letterProgress, direction, bounces);

          const letterStyle: CSSProperties = {
            display: 'inline-block',
            transform: `translate(${x}px, ${y}px)`,
            whiteSpace: letter === ' ' ? 'pre' : 'normal',
            transition: 'none', // Ensure no CSS transitions interfere
          };

          return (
            <span key={index} style={letterStyle}>
              {letter}
            </span>
          );
        })}
      </div>
    );
  }

  // Fallback (should never reach here)
  return (
    <div className={className} style={containerStyle}>
      {text}
    </div>
  );
}
