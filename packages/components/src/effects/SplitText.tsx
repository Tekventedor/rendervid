import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Easing function type for split text animation
 */
export type SplitTextEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animation mode - split by words or letters
 */
export type SplitTextMode = 'words' | 'letters';

/**
 * Animation types for split text
 */
export type SplitTextAnimation = 'splitUp' | 'splitDown' | 'splitX' | 'fan' | 'explode';

/**
 * Props for the SplitText component
 */
export interface SplitTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Animation mode - split by words or letters */
  mode?: SplitTextMode;
  /** Type of split animation */
  animation?: SplitTextAnimation;
  /** Duration of the animation in frames */
  duration?: number;
  /** Frames between each character/word starting animation */
  stagger?: number;
  /** Easing function */
  easing?: SplitTextEasing;
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
function applyEasing(progress: number, easing: SplitTextEasing): number {
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
 * Calculate transform values for split animations
 */
function calculateTransform(
  progress: number,
  animation: SplitTextAnimation,
  index: number,
  total: number,
  easing: SplitTextEasing
): { transform: string; opacity: number } {
  const easedProgress = applyEasing(progress, easing);
  const reverseProgress = 1 - easedProgress;

  switch (animation) {
    case 'splitUp': {
      const translateY = reverseProgress * -100;
      const opacity = easedProgress;
      return {
        transform: `translateY(${translateY}px)`,
        opacity,
      };
    }

    case 'splitDown': {
      const translateY = reverseProgress * 100;
      const opacity = easedProgress;
      return {
        transform: `translateY(${translateY}px)`,
        opacity,
      };
    }

    case 'splitX': {
      // Characters split outward from center
      const center = total / 2;
      const distance = index - center;
      const direction = distance > 0 ? 1 : -1;
      const translateX = reverseProgress * direction * Math.abs(distance) * 50;
      const opacity = easedProgress;
      return {
        transform: `translateX(${translateX}px)`,
        opacity,
      };
    }

    case 'fan': {
      // Characters rotate and translate from origin
      const center = total / 2;
      const distance = index - center;
      const rotation = reverseProgress * distance * 30; // degrees
      const translateY = reverseProgress * -50;
      const scale = 0.5 + (easedProgress * 0.5);
      const opacity = easedProgress;
      return {
        transform: `translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`,
        opacity,
      };
    }

    case 'explode': {
      // Characters explode outward in all directions
      const center = total / 2;
      const distance = index - center;
      const angle = (index / total) * Math.PI * 2;
      const radius = reverseProgress * 200;
      const translateX = Math.cos(angle) * radius;
      const translateY = Math.sin(angle) * radius;
      const rotation = reverseProgress * (distance * 45);
      const scale = 0.3 + (easedProgress * 0.7);
      const opacity = easedProgress;
      return {
        transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${scale})`,
        opacity,
      };
    }

    default:
      return {
        transform: 'none',
        opacity: 1,
      };
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
 * SplitText Component
 *
 * A text animation component where characters or words split apart and animate independently.
 * Characters/words can animate with various transforms including translateY, translateX, scale,
 * rotate, and opacity changes.
 *
 * Features:
 * - Frame-based split animation (not time-based)
 * - Multiple animation modes: words or letters
 * - Various animation types: splitUp, splitDown, splitX, fan, explode
 * - Staggered timing per character/word
 * - Support for easing functions
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic usage - letters split upward
 * <SplitText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   mode="letters"
 *   animation="splitUp"
 *   duration={60}
 *   stagger={2}
 * />
 *
 * // Words explode outward
 * <SplitText
 *   text="Words fly apart"
 *   mode="words"
 *   animation="explode"
 *   frame={currentFrame}
 *   duration={90}
 *   stagger={5}
 *   easing="ease-out"
 * />
 *
 * // Fan effect with letters
 * <SplitText
 *   text="Fan out"
 *   mode="letters"
 *   animation="fan"
 *   frame={currentFrame}
 *   duration={60}
 *   stagger={3}
 *   fontSize={48}
 *   color="#ff0080"
 * />
 * ```
 */
export function SplitText({
  text,
  mode = 'letters',
  animation = 'splitUp',
  duration = 60,
  stagger = 2,
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
}: SplitTextProps): React.ReactElement {
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
        if (frame >= endFrame) {
          progress = 1;
        } else if (frame > startFrame) {
          progress = (frame - startFrame) / duration;
        }

        // Get transform values
        const { transform, opacity } = calculateTransform(
          progress,
          animation,
          partIndex,
          totalParts,
          easing
        );

        const partStyle: CSSProperties = {
          display: 'inline-block',
          transform,
          opacity,
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
