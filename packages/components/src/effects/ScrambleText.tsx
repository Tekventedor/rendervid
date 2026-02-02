import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Easing function type for scramble animation
 */
export type ScrambleEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animation mode - how text should be scrambled
 */
export type ScrambleMode = 'whole' | 'sequential';

/**
 * Character set to use for scrambling
 */
export type ScrambleCharset = 'letters' | 'numbers' | 'symbols' | 'alphanumeric' | 'all';

/**
 * Props for the ScrambleText component
 */
export interface ScrambleTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Duration of the animation in frames */
  duration?: number;
  /** Delay before starting animation in frames */
  delay?: number;
  /** Animation mode - scramble all at once or character by character */
  mode?: ScrambleMode;
  /** Character set to use for scrambling */
  charset?: ScrambleCharset;
  /** Number of scramble iterations per character before revealing */
  scrambleIterations?: number;
  /** Easing function */
  easing?: ScrambleEasing;
  /** Random seed for deterministic scrambling */
  seed?: number;
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
 * Character sets for scrambling
 */
const CHARSETS = {
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  all: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Seeded random number generator for deterministic scrambling
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Generate next random number between 0 and 1
   */
  next(): number {
    // Linear congruential generator
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Generate random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }
}

/**
 * Apply easing function to progress value
 */
function applyEasing(progress: number, easing: ScrambleEasing): number {
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
 * Get a random character from the charset
 */
function getRandomChar(
  charset: string,
  random: SeededRandom,
  originalChar: string
): string {
  // Preserve spaces and punctuation that aren't in scramble set
  if (originalChar === ' ') return ' ';
  if (charset === CHARSETS.letters && !/[a-zA-Z]/.test(originalChar)) {
    return originalChar;
  }
  if (charset === CHARSETS.numbers && !/[0-9]/.test(originalChar)) {
    return originalChar;
  }

  return charset[random.nextInt(0, charset.length)];
}

/**
 * Get the scrambled character for current progress
 */
function getScrambledChar(
  originalChar: string,
  progress: number,
  charset: string,
  random: SeededRandom,
  scrambleIterations: number
): string {
  // If fully revealed, return original
  if (progress >= 1) return originalChar;

  // If not started, return scrambled character
  if (progress <= 0) {
    return getRandomChar(charset, random, originalChar);
  }

  // During animation, show scrambled characters
  // The closer to completion, fewer scrambles
  const currentIteration = Math.floor(progress * scrambleIterations);
  const totalIterations = scrambleIterations;

  if (currentIteration >= totalIterations) {
    return originalChar;
  }

  return getRandomChar(charset, random, originalChar);
}

/**
 * ScrambleText Component
 *
 * A text animation component that randomly scrambles characters before revealing the final text.
 * Inspired by react-bits scramble-text animation but built for frame-aware video rendering.
 *
 * Features:
 * - Frame-based scramble animation (not time-based)
 * - Multiple animation modes: scramble all at once or character-by-character
 * - Customizable character sets for scrambling (letters, numbers, symbols, etc.)
 * - Seeded random for deterministic, reproducible scrambling
 * - Support for delays and easing functions
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic usage - scramble entire text at once
 * <ScrambleText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   duration={60}
 *   mode="whole"
 *   charset="letters"
 * />
 *
 * // Character-by-character reveal
 * <ScrambleText
 *   text="Sequential Reveal"
 *   mode="sequential"
 *   frame={currentFrame}
 *   duration={90}
 *   charset="alphanumeric"
 *   seed={42}
 * />
 *
 * // Custom character set with delay
 * <ScrambleText
 *   text="Custom Scramble"
 *   frame={currentFrame}
 *   delay={30}
 *   duration={120}
 *   charset="symbols"
 *   scrambleIterations={5}
 *   easing="ease-out"
 * />
 * ```
 */
export function ScrambleText({
  text,
  duration = 60,
  delay = 0,
  mode = 'sequential',
  charset = 'letters',
  scrambleIterations = 3,
  easing = 'ease-out',
  seed = 12345,
  fontSize = 24,
  color = '#ffffff',
  fontFamily = 'monospace',
  fontWeight = 'normal',
  lineHeight = 1.5,
  textAlign = 'left',
  letterSpacing,
  textShadow,
  frame = 0,
  fps = 30,
  className,
  style,
}: ScrambleTextProps): React.ReactElement {
  // Calculate effective frame (accounting for delay)
  const effectiveFrame = Math.max(0, frame - delay);

  // Get charset string
  const charsetString = CHARSETS[charset];

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

  // Whole text mode - scramble entire text as one unit
  if (mode === 'whole') {
    const progress = Math.min(1, effectiveFrame / duration);
    const easedProgress = applyEasing(progress, easing);

    // Create a random generator for this frame
    const random = new SeededRandom(seed + effectiveFrame);

    const scrambledText = text
      .split('')
      .map((char) => getScrambledChar(char, easedProgress, charsetString, random, scrambleIterations))
      .join('');

    return (
      <div className={className} style={containerStyle}>
        <span style={{ display: 'inline-block' }}>{scrambledText}</span>
      </div>
    );
  }

  // Sequential mode - character-by-character reveal
  if (mode === 'sequential') {
    const characters = text.split('');
    const framesPerChar = duration / characters.length;

    return (
      <div className={className} style={containerStyle}>
        {characters.map((char, index) => {
          const charStartFrame = index * framesPerChar;
          const charEndFrame = charStartFrame + framesPerChar;

          let charProgress = 0;
          if (effectiveFrame >= charEndFrame) {
            charProgress = 1;
          } else if (effectiveFrame > charStartFrame) {
            charProgress = (effectiveFrame - charStartFrame) / framesPerChar;
          }

          const easedProgress = applyEasing(charProgress, easing);

          // Create a unique random generator for each character
          const random = new SeededRandom(seed + index * 1000 + effectiveFrame);

          const displayChar = getScrambledChar(
            char,
            easedProgress,
            charsetString,
            random,
            scrambleIterations
          );

          const charStyle: CSSProperties = {
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          };

          return (
            <span key={index} style={charStyle}>
              {displayChar}
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
