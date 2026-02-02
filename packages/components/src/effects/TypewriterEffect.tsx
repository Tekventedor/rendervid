import React from 'react';
import type { CSSProperties } from 'react';

/**
 * Frame-aware props interface
 */
export interface FrameAwareProps {
  /** Current frame number */
  frame: number;
  /** Frames per second */
  fps?: number;
  /** Total number of frames in the animation */
  totalFrames?: number;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

/**
 * Speed presets for typing animation
 */
export type TypingSpeed = 'slow' | 'normal' | 'fast' | number;

/**
 * Cursor style variants
 */
export type CursorStyle = 'block' | 'underline' | 'bar';

/**
 * Typing mode
 */
export type TypingMode = 'characters' | 'words';

/**
 * Backspace effect configuration
 */
export interface BackspaceConfig {
  /** Frame at which to start backspacing */
  startFrame: number;
  /** Number of characters to delete */
  count: number;
  /** Speed of backspace (characters per second) */
  speed?: number;
}

/**
 * Word delay configuration for word-by-word mode
 */
export interface WordDelayConfig {
  /** Default delay between words in frames */
  default: number;
  /** Custom delays for specific word indices */
  custom?: Record<number, number>;
}

/**
 * Enhanced typewriter effect props
 */
export interface TypewriterEffectProps extends FrameAwareProps {
  /** Text to type - single string or array of lines */
  text: string | string[];

  /** Typing speed - preset or characters per second */
  speed?: TypingSpeed;

  /** Show cursor */
  cursor?: boolean;

  /** Cursor style */
  cursorStyle?: CursorStyle;

  /** Cursor color */
  cursorColor?: string;

  /** Typing mode - character by character or word by word */
  mode?: TypingMode;

  /** Number of frames to wait before starting */
  startDelay?: number;

  /** Loop the animation */
  loop?: boolean;

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

  /** Cursor blink rate in frames (0 to disable blinking) */
  cursorBlinkRate?: number;

  /** Backspace effect configuration */
  backspace?: BackspaceConfig;

  /** Word delay configuration (only for word mode) */
  wordDelay?: WordDelayConfig;

  /** Custom character delays - map of character index to delay in frames */
  charDelays?: Record<number, number>;

  /** Sound effect simulation - visual pulse on each character */
  soundPulse?: boolean;

  /** Sound pulse duration in frames */
  soundPulseDuration?: number;

  /** Sound pulse scale factor */
  soundPulseScale?: number;

  /** Preserve whitespace and line breaks */
  preserveWhitespace?: boolean;
}

/**
 * Convert speed preset to characters per second
 */
function getSpeedValue(speed: TypingSpeed): number {
  if (typeof speed === 'number') {
    return speed;
  }

  switch (speed) {
    case 'slow':
      return 5;
    case 'fast':
      return 20;
    case 'normal':
    default:
      return 10;
  }
}

/**
 * Split text into words while preserving whitespace
 */
function splitIntoWords(text: string): string[] {
  const words: string[] = [];
  let currentWord = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    currentWord += char;

    if (char === ' ' || char === '\n' || char === '\t' || i === text.length - 1) {
      words.push(currentWord);
      currentWord = '';
    }
  }

  return words;
}

/**
 * Enhanced Typewriter Effect Component
 *
 * A feature-rich typewriter effect with cursor animation, backspace support,
 * word-by-word typing, custom delays, and visual effects.
 *
 * @example
 * ```tsx
 * <TypewriterEffect
 *   text="Hello, World!"
 *   frame={currentFrame}
 *   fps={30}
 *   speed="normal"
 *   cursor={true}
 *   cursorStyle="bar"
 *   mode="characters"
 * />
 * ```
 */
export function TypewriterEffect({
  text,
  speed = 'normal',
  cursor = true,
  cursorStyle = 'bar',
  cursorColor = 'currentColor',
  mode = 'characters',
  startDelay = 0,
  loop = false,
  fontSize = 16,
  color = '#ffffff',
  fontFamily = 'monospace',
  fontWeight = 'normal',
  lineHeight = 1.5,
  cursorBlinkRate = 15,
  backspace,
  wordDelay,
  charDelays = {},
  soundPulse = false,
  soundPulseDuration = 3,
  soundPulseScale = 1.05,
  preserveWhitespace = true,
  frame,
  fps = 30,
  className,
  style,
}: TypewriterEffectProps): React.ReactElement {
  // Normalize text to string
  const fullText = Array.isArray(text) ? text.join('\n') : text;

  // Calculate effective frame (accounting for start delay)
  const effectiveFrame = Math.max(0, frame - startDelay);

  // Get typing speed in characters per second
  const charsPerSecond = getSpeedValue(speed);
  const framesPerChar = fps / charsPerSecond;

  // Handle character-by-character mode
  let visibleText = '';
  let isComplete = false;
  let lastCharIndex = -1;

  if (mode === 'characters') {
    // Calculate base number of characters to show
    let totalFrames = 0;
    let charCount = 0;

    for (let i = 0; i < fullText.length; i++) {
      const customDelay = charDelays[i] || 0;
      totalFrames += framesPerChar + customDelay;

      if (effectiveFrame >= totalFrames) {
        charCount = i + 1;
      } else {
        break;
      }
    }

    // Handle backspace effect
    if (backspace && effectiveFrame >= backspace.startFrame) {
      const backspaceFrames = effectiveFrame - backspace.startFrame;
      const backspaceSpeed = backspace.speed || charsPerSecond * 2; // Default: 2x faster
      const backspaceFramesPerChar = fps / backspaceSpeed;
      const backspacedChars = Math.floor(backspaceFrames / backspaceFramesPerChar);

      charCount = Math.max(0, charCount - Math.min(backspacedChars, backspace.count));
    }

    visibleText = fullText.slice(0, charCount);
    lastCharIndex = charCount - 1;
    isComplete = charCount >= fullText.length;

    // Handle looping
    if (loop && isComplete) {
      const loopFrame = effectiveFrame % (totalFrames + fps); // Add 1 second pause
      if (loopFrame < totalFrames) {
        // Recalculate for loop
        charCount = 0;
        totalFrames = 0;
        for (let i = 0; i < fullText.length; i++) {
          const customDelay = charDelays[i] || 0;
          totalFrames += framesPerChar + customDelay;

          if (loopFrame >= totalFrames) {
            charCount = i + 1;
          } else {
            break;
          }
        }
        visibleText = fullText.slice(0, charCount);
        lastCharIndex = charCount - 1;
        isComplete = false;
      } else {
        visibleText = '';
        isComplete = false;
      }
    }
  } else {
    // Word-by-word mode
    const words = splitIntoWords(fullText);
    const defaultWordDelay = wordDelay?.default || 0;

    let totalFrames = 0;
    let wordCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const customDelay = wordDelay?.custom?.[i] || defaultWordDelay;
      const wordFrames = word.length * framesPerChar + customDelay;
      totalFrames += wordFrames;

      if (effectiveFrame >= totalFrames) {
        wordCount = i + 1;
      } else {
        // Show partial word
        const wordStartFrame = totalFrames - wordFrames;
        const wordProgress = effectiveFrame - wordStartFrame;
        const charsInWord = Math.floor(wordProgress / framesPerChar);

        visibleText = words.slice(0, i).join('') + word.slice(0, charsInWord);
        lastCharIndex = visibleText.length - 1;
        break;
      }
    }

    if (wordCount === words.length) {
      visibleText = fullText;
      lastCharIndex = fullText.length - 1;
      isComplete = true;
    } else if (wordCount > 0) {
      visibleText = words.slice(0, wordCount).join('');
      lastCharIndex = visibleText.length - 1;
    }

    // Handle looping for word mode
    if (loop && isComplete) {
      const loopFrame = effectiveFrame % (totalFrames + fps);
      if (loopFrame < totalFrames) {
        // Recalculate for loop
        wordCount = 0;
        totalFrames = 0;
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const customDelay = wordDelay?.custom?.[i] || defaultWordDelay;
          const wordFrames = word.length * framesPerChar + customDelay;
          totalFrames += wordFrames;

          if (loopFrame >= totalFrames) {
            wordCount = i + 1;
          } else {
            const wordStartFrame = totalFrames - wordFrames;
            const wordProgress = loopFrame - wordStartFrame;
            const charsInWord = Math.floor(wordProgress / framesPerChar);

            visibleText = words.slice(0, i).join('') + word.slice(0, charsInWord);
            lastCharIndex = visibleText.length - 1;
            break;
          }
        }
        isComplete = false;
      } else {
        visibleText = '';
        isComplete = false;
      }
    }
  }

  // Calculate cursor visibility
  let showCursorNow = cursor;
  if (cursor && cursorBlinkRate > 0) {
    if (isComplete) {
      // Blink when complete
      const blinkCycle = Math.floor(frame / cursorBlinkRate) % 2;
      showCursorNow = blinkCycle === 0;
    }
    // Always show cursor while typing
  }

  // Calculate sound pulse effect
  const isPulsing = soundPulse && lastCharIndex >= 0 && effectiveFrame > 0;
  const pulseProgress = isPulsing ? (effectiveFrame % framesPerChar) / soundPulseDuration : 0;
  const shouldPulse = isPulsing && pulseProgress <= 1;
  const pulseScale = shouldPulse ? 1 + (soundPulseScale - 1) * (1 - pulseProgress) : 1;

  // Base styles
  const containerStyle: CSSProperties = {
    fontSize,
    color,
    fontFamily,
    fontWeight,
    lineHeight,
    whiteSpace: preserveWhitespace ? 'pre-wrap' : 'normal',
    wordBreak: 'break-word',
    display: 'inline-block',
    transform: `scale(${pulseScale})`,
    transition: shouldPulse ? 'transform 0.1s ease-out' : 'none',
    transformOrigin: 'left center',
    ...style,
  };

  // Cursor styles based on cursor type
  const getCursorStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      color: cursorColor,
      opacity: showCursorNow ? 1 : 0,
      transition: cursorBlinkRate > 0 ? 'opacity 0.1s ease' : 'none',
    };

    switch (cursorStyle) {
      case 'block':
        return {
          ...baseStyle,
          display: 'inline-block',
          width: '0.6em',
          height: '1em',
          backgroundColor: cursorColor,
          marginLeft: '0.05em',
          verticalAlign: 'text-bottom',
        };
      case 'underline':
        return {
          ...baseStyle,
          display: 'inline-block',
          width: '0.6em',
          height: '0.1em',
          backgroundColor: cursorColor,
          marginLeft: '0.05em',
          verticalAlign: 'text-bottom',
        };
      case 'bar':
      default:
        return {
          ...baseStyle,
          display: 'inline-block',
          width: '0.1em',
          height: '1em',
          backgroundColor: cursorColor,
          marginLeft: '0.05em',
          verticalAlign: 'text-bottom',
        };
    }
  };

  const cursorElementStyle = getCursorStyle();

  return (
    <span className={className} style={containerStyle}>
      {visibleText}
      {cursor && <span style={cursorElementStyle} />}
    </span>
  );
}
