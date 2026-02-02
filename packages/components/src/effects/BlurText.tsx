import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Easing function type for blur animation
 */
export type BlurEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animation mode - how text should be revealed
 */
export type BlurMode = 'whole' | 'words' | 'letters';

/**
 * Props for the BlurText component
 */
export interface BlurTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Starting blur amount in pixels */
  startBlur?: number;
  /** Ending blur amount in pixels */
  endBlur?: number;
  /** Duration of the animation in frames */
  duration?: number;
  /** Delay before starting animation in frames */
  delay?: number;
  /** Animation mode - whole text, word by word, or letter by letter */
  mode?: BlurMode;
  /** Easing function */
  easing?: BlurEasing;
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
function applyEasing(progress: number, easing: BlurEasing): number {
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
  easing: BlurEasing
): number {
  const easedProgress = applyEasing(progress, easing);
  return startBlur - (startBlur - endBlur) * easedProgress;
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
 * BlurText Component
 *
 * A text animation component that starts with blurred text and gradually becomes clear.
 * Inspired by react-bits blur-text animation but built for frame-aware video rendering.
 *
 * Features:
 * - Frame-based blur animation (not time-based)
 * - Multiple animation modes: whole text, word-by-word, or letter-by-letter
 * - Customizable blur intensity and duration
 * - Support for delays and easing functions
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic usage - blur the entire text at once
 * <BlurText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   startBlur={10}
 *   endBlur={0}
 *   duration={60}
 * />
 *
 * // Word-by-word animation
 * <BlurText
 *   text="Reveal each word separately"
 *   mode="words"
 *   frame={currentFrame}
 *   duration={90}
 *   easing="ease-out"
 * />
 *
 * // Letter-by-letter with delay
 * <BlurText
 *   text="Letter by letter"
 *   mode="letters"
 *   delay={30}
 *   frame={currentFrame}
 *   duration={120}
 *   startBlur={15}
 * />
 * ```
 */
export function BlurText({
  text,
  startBlur = 10,
  endBlur = 0,
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
  frame = 0,
  fps = 30,
  className,
  style,
}: BlurTextProps): React.ReactElement {
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

    const textStyle: CSSProperties = {
      filter: `blur(${blurAmount}px)`,
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
    const framesPerWord = duration / words.filter((w) => w.trim()).length; // Only count non-whitespace words

    return (
      <div className={className} style={containerStyle}>
        {words.map((word, index) => {
          // Skip blur calculation for whitespace
          if (!word.trim()) {
            return <span key={index}>{word}</span>;
          }

          // Count only non-whitespace words for timing
          const wordIndex = words.slice(0, index).filter((w) => w.trim()).length;
          const wordStartFrame = wordIndex * framesPerWord;
          const wordEndFrame = wordStartFrame + framesPerWord;

          let wordProgress = 0;
          if (effectiveFrame >= wordEndFrame) {
            wordProgress = 1;
          } else if (effectiveFrame > wordStartFrame) {
            wordProgress = (effectiveFrame - wordStartFrame) / framesPerWord;
          }

          const blurAmount = calculateBlur(wordProgress, startBlur, endBlur, easing);

          const wordStyle: CSSProperties = {
            filter: `blur(${blurAmount}px)`,
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
    const framesPerLetter = duration / letters.length;

    return (
      <div className={className} style={containerStyle}>
        {letters.map((letter, index) => {
          const letterStartFrame = index * framesPerLetter;
          const letterEndFrame = letterStartFrame + framesPerLetter;

          let letterProgress = 0;
          if (effectiveFrame >= letterEndFrame) {
            letterProgress = 1;
          } else if (effectiveFrame > letterStartFrame) {
            letterProgress = (effectiveFrame - letterStartFrame) / framesPerLetter;
          }

          const blurAmount = calculateBlur(letterProgress, startBlur, endBlur, easing);

          const letterStyle: CSSProperties = {
            filter: `blur(${blurAmount}px)`,
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
