import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';

/**
 * Direction for wave motion
 */
export type WaveDirection = 'vertical' | 'horizontal';

/**
 * Props for the WaveText component
 */
export interface WaveTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Wave amplitude in pixels */
  amplitude?: number;
  /** Wave frequency (wave density) */
  frequency?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Direction of wave motion */
  direction?: WaveDirection;
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
 * Split text into individual letters/characters
 */
function splitIntoLetters(text: string): string[] {
  return text.split('');
}

/**
 * WaveText Component
 *
 * A text animation component where individual characters move in a wave pattern.
 * Characters oscillate vertically or horizontally using a sine function for smooth,
 * continuous wave motion.
 *
 * Features:
 * - Frame-aware wave animation using sine function
 * - Continuous looping animation
 * - Customizable amplitude, frequency, and speed
 * - Vertical or horizontal wave direction
 * - Full typography control
 *
 * The wave is calculated using: sin(frame/fps * speed + index * frequency) * amplitude
 * - frame/fps converts frames to seconds
 * - speed controls animation speed
 * - index * frequency creates the wave pattern across characters
 * - amplitude controls the wave height/distance
 *
 * @example
 * ```tsx
 * // Basic vertical wave
 * <WaveText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   amplitude={20}
 *   frequency={0.5}
 *   speed={2}
 * />
 *
 * // Horizontal wave with custom styling
 * <WaveText
 *   text="Wave Motion"
 *   frame={currentFrame}
 *   direction="horizontal"
 *   amplitude={15}
 *   frequency={0.3}
 *   speed={1.5}
 *   fontSize={48}
 *   color="#00ff00"
 * />
 *
 * // Subtle wave effect
 * <WaveText
 *   text="Gentle Wave"
 *   frame={currentFrame}
 *   amplitude={5}
 *   frequency={0.8}
 *   speed={1}
 * />
 * ```
 */
export function WaveText({
  text,
  amplitude = 20,
  frequency = 0.5,
  speed = 2,
  direction = 'vertical',
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
}: WaveTextProps): React.ReactElement {
  // Calculate time in seconds for smooth animation
  const time = frame / fps;

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

  // Split text into individual characters
  const letters = splitIntoLetters(text);

  return (
    <div className={className} style={containerStyle}>
      {letters.map((letter, index) => {
        // Calculate wave offset using sine function
        // sin(time * speed + index * frequency) creates the wave pattern
        const waveOffset = Math.sin(time * speed + index * frequency) * amplitude;

        // Apply offset based on direction
        const letterStyle: CSSProperties = {
          display: 'inline-block',
          whiteSpace: letter === ' ' ? 'pre' : 'normal',
          transform:
            direction === 'vertical'
              ? `translateY(${waveOffset}px)`
              : `translateX(${waveOffset}px)`,
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
