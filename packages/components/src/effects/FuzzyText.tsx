import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Easing function type for fuzzy animation
 */
export type FuzzyEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animation mode - how text should be revealed
 */
export type FuzzyMode = 'whole' | 'words' | 'letters';

/**
 * Props for the FuzzyText component
 */
export interface FuzzyTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Starting blur amount in pixels */
  startBlur?: number;
  /** Ending blur amount in pixels */
  endBlur?: number;
  /** Starting opacity (0-1) */
  startOpacity?: number;
  /** Ending opacity (0-1) */
  endOpacity?: number;
  /** Duration of the animation in frames */
  duration?: number;
  /** Delay before starting animation in frames */
  delay?: number;
  /** Animation mode - whole text, word by word, or letter by letter */
  mode?: FuzzyMode;
  /** Easing function */
  easing?: FuzzyEasing;
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
  /** Stagger delay between characters/words in frames (only applies in letters/words mode) */
  staggerDelay?: number;
}

/**
 * Apply easing function to progress value
 */
function applyEasing(progress: number, easing: FuzzyEasing): number {
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
 * Calculate blur amount for a given progress
 */
function calculateBlur(
  progress: number,
  startBlur: number,
  endBlur: number,
  easing: FuzzyEasing
): number {
  const easedProgress = applyEasing(progress, easing);
  return startBlur - (startBlur - endBlur) * easedProgress;
}

/**
 * Calculate opacity for a given progress
 */
function calculateOpacity(
  progress: number,
  startOpacity: number,
  endOpacity: number,
  easing: FuzzyEasing
): number {
  const easedProgress = applyEasing(progress, easing);
  return startOpacity + (endOpacity - startOpacity) * easedProgress;
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
 * FuzzyText Component
 *
 * A text animation component that starts with fuzzy/blurry text and gradually becomes clear.
 * Inspired by react-bits fuzzy-text animation but built for frame-aware video rendering.
 *
 * The "fuzzy" effect is achieved by combining both blur and opacity transitions,
 * creating a more pronounced fuzzy appearance than blur alone.
 *
 * Features:
 * - Frame-based fuzzy animation (not time-based)
 * - Combines blur and opacity for enhanced fuzzy effect
 * - Multiple animation modes: whole text, word-by-word, or letter-by-letter
 * - Customizable blur intensity, opacity, and duration
 * - Staggered timing for character and word modes
 * - Support for delays and easing functions
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic usage - fuzz the entire text at once
 * <FuzzyText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   startBlur={15}
 *   endBlur={0}
 *   startOpacity={0}
 *   endOpacity={1}
 *   duration={60}
 * />
 *
 * // Word-by-word animation with stagger
 * <FuzzyText
 *   text="Reveal each word separately"
 *   mode="words"
 *   frame={currentFrame}
 *   duration={90}
 *   staggerDelay={5}
 *   easing="ease-out"
 * />
 *
 * // Letter-by-letter with delay
 * <FuzzyText
 *   text="Letter by letter"
 *   mode="letters"
 *   delay={30}
 *   frame={currentFrame}
 *   duration={120}
 *   startBlur={20}
 *   staggerDelay={2}
 * />
 * ```
 */
export function FuzzyText({
  text,
  startBlur = 15,
  endBlur = 0,
  startOpacity = 0,
  endOpacity = 1,
  duration = 60,
  delay = 0,
  mode = 'whole',
  easing = 'ease-out',
  fontSize = 24,
  color = '#ffffff',
  fontFamily = 'Arial, sans-serif',
  fontWeight = 'normal',
  lineHeight = 1.5,
  textAlign = 'left',
  letterSpacing,
  textShadow,
  staggerDelay = 3,
  frame = 0,
  fps = 30,
  className,
  style,
}: FuzzyTextProps): React.ReactElement {
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
    const blurAmount = calculateBlur(progress, startBlur, endBlur, easing);
    const opacity = calculateOpacity(progress, startOpacity, endOpacity, easing);

    const textStyle: CSSProperties = {
      filter: `blur(${blurAmount}px)`,
      opacity,
      display: 'inline-block',
    };

    return (
      <div className={className} style={containerStyle}>
        <span style={textStyle}>{text}</span>
      </div>
    );
  }

  // Word-by-word mode
  if (mode === 'words') {
    const words = splitIntoWords(text);
    const nonWhitespaceWords = words.filter((w) => w.trim());
    const numWords = nonWhitespaceWords.length;

    return (
      <div className={className} style={containerStyle}>
        {words.map((word, index) => {
          // Skip animation calculation for whitespace
          if (!word.trim()) {
            return <span key={index}>{word}</span>;
          }

          // Count only non-whitespace words for timing
          const wordIndex = words.slice(0, index).filter((w) => w.trim()).length;
          const wordStartFrame = wordIndex * staggerDelay;
          const wordEndFrame = wordStartFrame + duration;

          let wordProgress = 0;
          if (effectiveFrame >= wordEndFrame) {
            wordProgress = 1;
          } else if (effectiveFrame > wordStartFrame) {
            wordProgress = (effectiveFrame - wordStartFrame) / duration;
          }

          const blurAmount = calculateBlur(wordProgress, startBlur, endBlur, easing);
          const opacity = calculateOpacity(wordProgress, startOpacity, endOpacity, easing);

          const wordStyle: CSSProperties = {
            filter: `blur(${blurAmount}px)`,
            opacity,
            display: 'inline-block',
          };

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
          const letterStartFrame = index * staggerDelay;
          const letterEndFrame = letterStartFrame + duration;

          let letterProgress = 0;
          if (effectiveFrame >= letterEndFrame) {
            letterProgress = 1;
          } else if (effectiveFrame > letterStartFrame) {
            letterProgress = (effectiveFrame - letterStartFrame) / duration;
          }

          const blurAmount = calculateBlur(letterProgress, startBlur, endBlur, easing);
          const opacity = calculateOpacity(letterProgress, startOpacity, endOpacity, easing);

          const letterStyle: CSSProperties = {
            filter: `blur(${blurAmount}px)`,
            opacity,
            display: 'inline-block',
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
