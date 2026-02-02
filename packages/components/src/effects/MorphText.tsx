import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp, lerp } from '../utils/interpolate';

/**
 * Easing function type for morph animation
 */
export type MorphEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Props for the MorphText component
 */
export interface MorphTextProps extends AnimatedProps {
  /** Array of text strings to morph between */
  texts: string[];
  /** Duration of each morph transition in frames */
  morphDuration?: number;
  /** Pause duration between morphs in frames */
  pauseDuration?: number;
  /** Loop through texts continuously */
  loop?: boolean;
  /** Easing function for transitions */
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
  /** Blur intensity during morph (in pixels) */
  blurIntensity?: number;
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
 * Calculate current text index and transition progress
 */
function getMorphState(
  frame: number,
  textCount: number,
  morphDuration: number,
  pauseDuration: number,
  loop: boolean
): {
  currentIndex: number;
  nextIndex: number;
  transitionProgress: number;
  isTransitioning: boolean;
} {
  const cycleDuration = morphDuration + pauseDuration;
  const totalDuration = cycleDuration * textCount;

  // Handle non-looping behavior
  if (!loop && frame >= totalDuration - pauseDuration) {
    return {
      currentIndex: textCount - 1,
      nextIndex: textCount - 1,
      transitionProgress: 0,
      isTransitioning: false,
    };
  }

  // Calculate position in the loop
  const cycleFrame = loop ? frame % totalDuration : frame;
  const cycleIndex = Math.floor(cycleFrame / cycleDuration);
  const frameInCycle = cycleFrame % cycleDuration;

  const currentIndex = cycleIndex % textCount;
  const nextIndex = (cycleIndex + 1) % textCount;

  // Determine if we're in transition or pause
  const isTransitioning = frameInCycle < morphDuration;
  const transitionProgress = isTransitioning
    ? frameInCycle / morphDuration
    : 0;

  return {
    currentIndex,
    nextIndex: isTransitioning ? nextIndex : currentIndex,
    transitionProgress,
    isTransitioning,
  };
}

/**
 * Split text into characters while tracking positions
 */
function getCharacterData(text: string): Array<{ char: string; index: number }> {
  return text.split('').map((char, index) => ({ char, index }));
}

/**
 * Calculate character opacity and blur during transition
 */
function getCharacterStyle(
  charIndex: number,
  textLength: number,
  transitionProgress: number,
  isCurrentText: boolean,
  easing: MorphEasing,
  blurIntensity: number
): CSSProperties {
  const easedProgress = applyEasing(transitionProgress, easing);

  // Calculate opacity
  let opacity: number;
  if (isCurrentText) {
    // Fade out
    opacity = 1 - easedProgress;
  } else {
    // Fade in
    opacity = easedProgress;
  }

  // Calculate blur based on transition progress
  // Maximum blur at 50% of transition
  const blurProgress = Math.sin(easedProgress * Math.PI); // 0 -> 1 -> 0
  const blur = blurProgress * blurIntensity;

  // Calculate vertical offset for smoother transition
  const yOffset = isCurrentText
    ? -easedProgress * 10
    : (1 - easedProgress) * 10;

  return {
    opacity,
    filter: blur > 0 ? `blur(${blur}px)` : undefined,
    transform: `translateY(${yOffset}px)`,
    display: 'inline-block',
    transition: 'none',
  };
}

/**
 * MorphText Component
 *
 * A text animation component that smoothly morphs between different text strings
 * using cross-fade and position interpolation effects.
 *
 * Features:
 * - Frame-based morph animation
 * - Smooth transitions between multiple text values
 * - Configurable morph and pause durations
 * - Cross-fade with blur effects
 * - Position interpolation for smooth appearance
 * - Support for looping
 * - Character-by-character animation
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic morph between two texts
 * <MorphText
 *   texts={["Hello", "World"]}
 *   frame={currentFrame}
 *   fps={30}
 *   morphDuration={30}
 *   pauseDuration={60}
 *   loop={true}
 * />
 *
 * // Multiple texts with custom styling
 * <MorphText
 *   texts={["Welcome", "to", "Rendervid"]}
 *   frame={currentFrame}
 *   morphDuration={45}
 *   pauseDuration={90}
 *   loop={true}
 *   fontSize={48}
 *   color="#00d9ff"
 *   easing="ease-in-out"
 *   blurIntensity={8}
 * />
 *
 * // Non-looping sequence
 * <MorphText
 *   texts={["First", "Second", "Final"]}
 *   frame={currentFrame}
 *   morphDuration={30}
 *   pauseDuration={60}
 *   loop={false}
 *   fontSize={36}
 *   fontWeight="bold"
 * />
 * ```
 */
export function MorphText({
  texts,
  morphDuration = 30,
  pauseDuration = 60,
  loop = true,
  easing = 'ease-in-out',
  fontSize = 48,
  color = '#ffffff',
  fontFamily = 'Arial, sans-serif',
  fontWeight = 'normal',
  lineHeight = 1.5,
  textAlign = 'center',
  letterSpacing,
  textShadow,
  blurIntensity = 5,
  frame = 0,
  fps = 30,
  className,
  style,
}: MorphTextProps): React.ReactElement {
  // Validate inputs
  if (!texts || texts.length === 0) {
    return <div>No texts provided</div>;
  }

  if (texts.length === 1) {
    // Single text, no morphing needed
    return (
      <div
        className={className}
        style={{
          fontSize,
          color,
          fontFamily,
          fontWeight,
          lineHeight,
          textAlign,
          letterSpacing: letterSpacing !== undefined ? `${letterSpacing}px` : undefined,
          textShadow,
          ...style,
        }}
      >
        {texts[0]}
      </div>
    );
  }

  // Get current morph state
  const { currentIndex, nextIndex, transitionProgress, isTransitioning } =
    getMorphState(frame, texts.length, morphDuration, pauseDuration, loop);

  const currentText = texts[currentIndex];
  const nextText = texts[nextIndex];

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
    position: 'relative',
    display: 'inline-block',
    ...style,
  };

  // If not transitioning, just show the current text
  if (!isTransitioning || transitionProgress === 0) {
    return (
      <div className={className} style={containerStyle}>
        {currentText}
      </div>
    );
  }

  // Get character data
  const currentChars = getCharacterData(currentText);
  const nextChars = getCharacterData(nextText);

  // Find the maximum length for positioning
  const maxLength = Math.max(currentChars.length, nextChars.length);

  return (
    <div className={className} style={containerStyle}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Current text (fading out) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {currentChars.map((charData, index) => {
            const charStyle = getCharacterStyle(
              index,
              currentChars.length,
              transitionProgress,
              true,
              easing,
              blurIntensity
            );

            return (
              <span
                key={`current-${index}`}
                style={{
                  ...charStyle,
                  whiteSpace: charData.char === ' ' ? 'pre' : 'normal',
                }}
              >
                {charData.char}
              </span>
            );
          })}
        </div>

        {/* Next text (fading in) */}
        <div
          style={{
            position: 'relative',
            whiteSpace: 'nowrap',
            opacity: 0, // Hidden but maintains layout
          }}
        >
          {/* Layout placeholder - use the longer text */}
          {(nextChars.length >= currentChars.length ? nextText : currentText).split('').map((char, i) => (
            <span key={`placeholder-${i}`} style={{ visibility: 'hidden' }}>
              {char}
            </span>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {nextChars.map((charData, index) => {
            const charStyle = getCharacterStyle(
              index,
              nextChars.length,
              transitionProgress,
              false,
              easing,
              blurIntensity
            );

            return (
              <span
                key={`next-${index}`}
                style={{
                  ...charStyle,
                  whiteSpace: charData.char === ' ' ? 'pre' : 'normal',
                }}
              >
                {charData.char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
