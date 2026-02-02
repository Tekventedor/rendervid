import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp, getProgress } from '../utils/interpolate';

/**
 * Easing function type for morph animation
 */
export type MorphEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Morph mode - how letters should morph
 */
export type MorphMode = 'sequential' | 'simultaneous';

/**
 * Character set for scramble effect
 */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

/**
 * Props for the LetterMorph component
 */
export interface LetterMorphProps extends AnimatedProps {
  /** Starting text */
  startText: string;
  /** Ending text */
  endText: string;
  /** Morph mode - sequential (one letter at a time) or simultaneous (all at once) */
  mode?: MorphMode;
  /** Duration of the entire morph animation in frames */
  duration?: number;
  /** Number of frames between each character starting to morph (sequential mode only) */
  stagger?: number;
  /** Duration of scramble phase per character in frames */
  scrambleDuration?: number;
  /** Easing function */
  easing?: MorphEasing;
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
  /** Random seed for deterministic scrambling */
  seed?: number;
}

/**
 * Apply easing function to progress value
 */
function applyEasing(progress: number, easing: MorphEasing): number {
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
 * Seeded random number generator for deterministic scrambling
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Get a scrambled character based on seed
 */
function getScrambleChar(seed: number): string {
  const index = Math.floor(seededRandom(seed) * SCRAMBLE_CHARS.length);
  return SCRAMBLE_CHARS[index];
}

/**
 * Calculate the character to display based on morph progress
 */
function getMorphedChar(
  startChar: string,
  endChar: string,
  progress: number,
  scrambleDuration: number,
  totalDuration: number,
  seed: number
): string {
  // If progress is 0, show start character
  if (progress <= 0) {
    return startChar;
  }

  // If progress is 1, show end character
  if (progress >= 1) {
    return endChar;
  }

  // Calculate scramble phase (first part of the animation)
  const scramblePhase = scrambleDuration / totalDuration;

  // If we're in the scramble phase, show random characters
  if (progress < scramblePhase) {
    // Use progress and seed to generate consistent scramble
    const scrambleSeed = seed + progress * 100;
    return getScrambleChar(scrambleSeed);
  }

  // After scramble phase, transition to end character
  // Add a brief final scramble before settling
  const settlePhase = scramblePhase + (1 - scramblePhase) * 0.8;
  if (progress < settlePhase) {
    // Continue scrambling but less frequently
    const scrambleSeed = seed + Math.floor(progress * 10) * 10;
    return getScrambleChar(scrambleSeed);
  }

  // Finally, show the end character
  return endChar;
}

/**
 * LetterMorph Component
 *
 * Morphs individual letters from one text to another with a scramble effect during transition.
 * Each letter cycles through random characters before settling on the target character.
 *
 * Features:
 * - Frame-based morphing animation
 * - Scramble effect during character transition
 * - Sequential or simultaneous morphing modes
 * - Handles different string lengths gracefully
 * - Staggered timing per character (sequential mode)
 * - Deterministic scrambling with seed support
 *
 * @example
 * ```tsx
 * // Basic simultaneous morph
 * <LetterMorph
 *   startText="HELLO"
 *   endText="WORLD"
 *   frame={currentFrame}
 *   fps={30}
 *   duration={60}
 *   mode="simultaneous"
 * />
 *
 * // Sequential morph with stagger
 * <LetterMorph
 *   startText="START"
 *   endText="FINISH"
 *   frame={currentFrame}
 *   fps={30}
 *   duration={90}
 *   mode="sequential"
 *   stagger={3}
 *   scrambleDuration={15}
 * />
 *
 * // Different length strings
 * <LetterMorph
 *   startText="Hi"
 *   endText="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   duration={100}
 * />
 * ```
 */
export function LetterMorph({
  startText,
  endText,
  mode = 'sequential',
  duration = 60,
  stagger = 2,
  scrambleDuration = 12,
  easing = 'ease-out',
  fontSize = 24,
  color = '#ffffff',
  fontFamily = 'monospace',
  fontWeight = 'normal',
  lineHeight = 1.5,
  textAlign = 'left',
  letterSpacing,
  textShadow,
  delay = 0,
  seed = 42,
  frame = 0,
  fps = 30,
  className,
  style,
}: LetterMorphProps): React.ReactElement {
  // Calculate effective frame (accounting for delay)
  const effectiveFrame = Math.max(0, frame - delay);

  // Determine the maximum length between start and end text
  const maxLength = Math.max(startText.length, endText.length);

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

  // Generate characters based on morph progress
  const characters: string[] = [];

  for (let i = 0; i < maxLength; i++) {
    const startChar = i < startText.length ? startText[i] : ' ';
    const endChar = i < endText.length ? endText[i] : ' ';

    // Calculate progress for this character based on mode
    let charProgress = 0;
    let charDuration = duration;

    if (mode === 'simultaneous') {
      // All characters morph at the same time
      charProgress = clamp(effectiveFrame / duration, 0, 1);
      charDuration = duration;
    } else {
      // Sequential mode - each character starts with a delay
      const charStartFrame = i * stagger;
      const charEndFrame = charStartFrame + duration;

      if (effectiveFrame < charStartFrame) {
        charProgress = 0;
      } else if (effectiveFrame >= charEndFrame) {
        charProgress = 1;
      } else {
        charProgress = (effectiveFrame - charStartFrame) / duration;
      }
      charDuration = duration;
    }

    // Apply easing
    const easedProgress = applyEasing(charProgress, easing);

    // Get the morphed character with scramble effect
    const charSeed = seed + i * 100;
    const displayChar = getMorphedChar(
      startChar,
      endChar,
      easedProgress,
      scrambleDuration,
      charDuration,
      charSeed
    );

    characters.push(displayChar);
  }

  // Calculate opacity for characters that are appearing/disappearing
  const renderCharacters = characters.map((char, index) => {
    let opacity = 1;

    // If character is space in both start and end, reduce opacity during transition
    const startChar = index < startText.length ? startText[index] : ' ';
    const endChar = index < endText.length ? endText[index] : ' ';

    // Calculate character-specific progress
    let charProgress = 0;
    if (mode === 'simultaneous') {
      charProgress = clamp(effectiveFrame / duration, 0, 1);
    } else {
      const charStartFrame = index * stagger;
      charProgress = clamp((effectiveFrame - charStartFrame) / duration, 0, 1);
    }

    // Fade in new characters that didn't exist in startText
    if (index >= startText.length) {
      opacity = clamp(charProgress * 2, 0, 1);
    }

    // Fade out old characters that don't exist in endText
    if (index >= endText.length) {
      opacity = clamp(1 - charProgress * 2, 0, 1);
    }

    const charStyle: CSSProperties = {
      display: 'inline-block',
      whiteSpace: char === ' ' ? 'pre' : 'normal',
      opacity,
      transition: 'opacity 0.1s ease',
    };

    return (
      <span key={index} style={charStyle}>
        {char}
      </span>
    );
  });

  return (
    <div className={className} style={containerStyle}>
      {renderCharacters}
    </div>
  );
}
