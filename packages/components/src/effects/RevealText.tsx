import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Easing function type for reveal animation
 */
export type RevealEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animation mode - how text should be revealed
 */
export type RevealMode = 'words' | 'letters';

/**
 * Reveal style - how characters/words appear
 */
export type RevealStyle = 'fade' | 'wipe' | 'slide';

/**
 * Direction for reveal animation
 */
export type RevealDirection = 'left' | 'right' | 'center';

/**
 * Props for the RevealText component
 */
export interface RevealTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Animation mode - word by word or letter by letter */
  mode?: RevealMode;
  /** Reveal style - fade, wipe, or slide */
  revealStyle?: RevealStyle;
  /** Duration of the animation in frames */
  duration?: number;
  /** Stagger delay between each item in frames */
  stagger?: number;
  /** Direction of reveal for center-based reveals */
  direction?: RevealDirection;
  /** Delay before starting animation in frames */
  delay?: number;
  /** Easing function */
  easing?: RevealEasing;
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
 * Apply easing function to progress value
 */
function applyEasing(progress: number, easing: RevealEasing): number {
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
 * Get reveal order based on direction
 */
function getRevealOrder(totalItems: number, direction: RevealDirection): number[] {
  const indices: number[] = [];

  if (direction === 'left') {
    // Left to right
    for (let i = 0; i < totalItems; i++) {
      indices.push(i);
    }
  } else if (direction === 'right') {
    // Right to left
    for (let i = totalItems - 1; i >= 0; i--) {
      indices.push(i);
    }
  } else {
    // Center outward
    const mid = Math.floor(totalItems / 2);
    indices.push(mid);

    for (let i = 1; i <= mid; i++) {
      if (mid - i >= 0) {
        indices.push(mid - i);
      }
      if (mid + i < totalItems) {
        indices.push(mid + i);
      }
    }
  }

  return indices;
}

/**
 * Calculate item reveal progress based on stagger timing
 */
function calculateItemProgress(
  effectiveFrame: number,
  itemIndex: number,
  totalItems: number,
  duration: number,
  stagger: number,
  direction: RevealDirection
): number {
  const revealOrder = getRevealOrder(totalItems, direction);
  const orderIndex = revealOrder.indexOf(itemIndex);

  if (orderIndex === -1) return 0;

  const itemStartFrame = orderIndex * stagger;
  const itemEndFrame = itemStartFrame + duration;

  if (effectiveFrame >= itemEndFrame) {
    return 1;
  } else if (effectiveFrame > itemStartFrame) {
    return (effectiveFrame - itemStartFrame) / duration;
  }

  return 0;
}

/**
 * Get reveal styles based on reveal type and progress
 */
function getRevealStyles(
  progress: number,
  revealStyle: RevealStyle,
  easing: RevealEasing
): CSSProperties {
  const easedProgress = applyEasing(progress, easing);

  switch (revealStyle) {
    case 'fade':
      return {
        opacity: easedProgress,
        display: 'inline-block',
      };

    case 'wipe':
      return {
        display: 'inline-block',
        overflow: 'hidden',
        maxWidth: `${easedProgress * 100}%`,
        opacity: 1,
      };

    case 'slide':
      return {
        display: 'inline-block',
        opacity: easedProgress,
        transform: `translateY(${(1 - easedProgress) * 20}px)`,
      };

    default:
      return { display: 'inline-block' };
  }
}

/**
 * RevealText Component
 *
 * A text animation component that progressively reveals text character by character
 * or word by word with multiple reveal styles.
 *
 * Features:
 * - Frame-based reveal animation (not time-based)
 * - Multiple reveal modes: word-by-word or letter-by-letter
 * - Multiple reveal styles: fade, wipe, slide
 * - Staggered reveals with customizable timing
 * - Direction control: left-to-right, right-to-left, or center-outward
 * - Support for delays and easing functions
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic fade reveal - word by word
 * <RevealText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   mode="words"
 *   revealStyle="fade"
 *   duration={30}
 *   stagger={5}
 * />
 *
 * // Letter-by-letter slide reveal from center
 * <RevealText
 *   text="Welcome"
 *   mode="letters"
 *   revealStyle="slide"
 *   direction="center"
 *   frame={currentFrame}
 *   duration={20}
 *   stagger={2}
 * />
 *
 * // Wipe effect from right to left
 * <RevealText
 *   text="Animated Text"
 *   mode="words"
 *   revealStyle="wipe"
 *   direction="right"
 *   frame={currentFrame}
 *   duration={25}
 *   stagger={8}
 *   delay={30}
 * />
 * ```
 */
export function RevealText({
  text,
  mode = 'words',
  revealStyle = 'fade',
  duration = 30,
  stagger = 5,
  direction = 'left',
  delay = 0,
  easing = 'ease-out',
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
}: RevealTextProps): React.ReactElement {
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

  // Word-by-word mode
  if (mode === 'words') {
    const words = splitIntoWords(text);
    const nonWhitespaceWords = words.filter((w) => w.trim());

    return (
      <div className={className} style={containerStyle}>
        {words.map((word, index) => {
          // Skip style calculation for whitespace
          if (!word.trim()) {
            return <span key={index}>{word}</span>;
          }

          // Count only non-whitespace words for timing
          const wordIndex = words.slice(0, index).filter((w) => w.trim()).length;
          const progress = calculateItemProgress(
            effectiveFrame,
            wordIndex,
            nonWhitespaceWords.length,
            duration,
            stagger,
            direction
          );

          const wordStyle = getRevealStyles(progress, revealStyle, easing);

          return (
            <span key={index} style={wordStyle}>
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  // Letter-by-letter mode
  if (mode === 'letters') {
    const letters = splitIntoLetters(text);

    return (
      <div className={className} style={containerStyle}>
        {letters.map((letter, index) => {
          const progress = calculateItemProgress(
            effectiveFrame,
            index,
            letters.length,
            duration,
            stagger,
            direction
          );

          const letterStyle: CSSProperties = {
            ...getRevealStyles(progress, revealStyle, easing),
            whiteSpace: letter === ' ' ? 'pre' : 'normal',
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
