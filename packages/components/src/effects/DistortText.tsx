import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';

/**
 * Distortion type for the text effect
 */
export type DistortionType = 'wave' | 'ripple' | 'glitch' | 'skew';

/**
 * Props for the DistortText component
 */
export interface DistortTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Type of distortion effect */
  distortionType?: DistortionType;
  /** Distortion amplitude (intensity) */
  amplitude?: number;
  /** Distortion frequency (wave density) */
  frequency?: number;
  /** Animation speed multiplier */
  speed?: number;
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
 * Calculate wave distortion for a character
 */
function calculateWaveDistortion(
  time: number,
  index: number,
  frequency: number,
  amplitude: number
): CSSProperties {
  const phase = time + index * frequency;
  const skewY = Math.sin(phase) * amplitude;
  const translateY = Math.sin(phase * 0.5) * (amplitude * 0.5);

  return {
    transform: `skewY(${skewY}deg) translateY(${translateY}px)`,
  };
}

/**
 * Calculate ripple distortion for a character
 */
function calculateRippleDistortion(
  time: number,
  index: number,
  frequency: number,
  amplitude: number
): CSSProperties {
  const phase = time + index * frequency;
  const skewX = Math.sin(phase) * amplitude;
  const skewY = Math.cos(phase) * amplitude;
  const scale = 1 + Math.sin(phase * 2) * 0.1;

  return {
    transform: `skewX(${skewX}deg) skewY(${skewY}deg) scale(${scale})`,
  };
}

/**
 * Calculate glitch distortion for a character
 */
function calculateGlitchDistortion(
  time: number,
  index: number,
  frequency: number,
  amplitude: number
): CSSProperties {
  const phase = time * 10 + index * frequency;
  const noise = Math.sin(phase) * Math.cos(phase * 1.7) * Math.sin(phase * 2.3);
  const skewX = noise * amplitude;
  const translateX = noise * amplitude * 0.3;
  const translateY = Math.sin(phase * 3) * amplitude * 0.2;

  return {
    transform: `skewX(${skewX}deg) translateX(${translateX}px) translateY(${translateY}px)`,
  };
}

/**
 * Calculate skew distortion for a character
 */
function calculateSkewDistortion(
  time: number,
  index: number,
  frequency: number,
  amplitude: number
): CSSProperties {
  const phase = time + index * frequency;
  const skewX = Math.sin(phase) * amplitude;
  const skewY = Math.cos(phase * 1.3) * amplitude * 0.5;

  return {
    transform: `skewX(${skewX}deg) skewY(${skewY}deg)`,
  };
}

/**
 * DistortText Component
 *
 * A text animation component that applies various distortion effects to individual characters.
 * Characters can be distorted using wave, ripple, glitch, or skew patterns with CSS transforms.
 *
 * Features:
 * - Frame-aware distortion animation using trigonometric functions
 * - Continuous looping animation
 * - Multiple distortion types: wave, ripple, glitch, skew
 * - Customizable amplitude (intensity), frequency, and speed
 * - Per-character transforms using skewX, skewY, translateY
 * - Full typography control
 *
 * Distortion Types:
 * - wave: Vertical wave motion with skewY and translateY
 * - ripple: Multi-axis distortion with skewX, skewY, and scale
 * - glitch: Chaotic distortion with rapid skew and translation
 * - skew: Smooth horizontal and vertical skewing
 *
 * The distortion is calculated using trigonometric functions:
 * - time = frame/fps * speed (for animation over time)
 * - phase = time + index * frequency (creates pattern across characters)
 * - Various sin/cos combinations create different distortion effects
 *
 * @example
 * ```tsx
 * // Basic wave distortion
 * <DistortText
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   distortionType="wave"
 *   amplitude={10}
 *   frequency={0.5}
 *   speed={2}
 * />
 *
 * // Ripple effect with custom styling
 * <DistortText
 *   text="Ripple Effect"
 *   frame={currentFrame}
 *   distortionType="ripple"
 *   amplitude={8}
 *   frequency={0.3}
 *   speed={1.5}
 *   fontSize={48}
 *   color="#00ff00"
 * />
 *
 * // Glitch distortion
 * <DistortText
 *   text="Glitch Mode"
 *   frame={currentFrame}
 *   distortionType="glitch"
 *   amplitude={5}
 *   frequency={0.8}
 *   speed={3}
 * />
 *
 * // Subtle skew effect
 * <DistortText
 *   text="Subtle Skew"
 *   frame={currentFrame}
 *   distortionType="skew"
 *   amplitude={5}
 *   frequency={0.4}
 *   speed={1}
 * />
 * ```
 */
export function DistortText({
  text,
  distortionType = 'wave',
  amplitude = 10,
  frequency = 0.5,
  speed = 2,
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
}: DistortTextProps): React.ReactElement {
  // Calculate time in seconds for smooth animation
  const time = (frame / fps) * speed;

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
        // Calculate distortion based on type
        let distortionStyle: CSSProperties = {};

        switch (distortionType) {
          case 'wave':
            distortionStyle = calculateWaveDistortion(time, index, frequency, amplitude);
            break;
          case 'ripple':
            distortionStyle = calculateRippleDistortion(time, index, frequency, amplitude);
            break;
          case 'glitch':
            distortionStyle = calculateGlitchDistortion(time, index, frequency, amplitude);
            break;
          case 'skew':
            distortionStyle = calculateSkewDistortion(time, index, frequency, amplitude);
            break;
          default:
            distortionStyle = calculateWaveDistortion(time, index, frequency, amplitude);
        }

        // Combine with base letter styles
        const letterStyle: CSSProperties = {
          display: 'inline-block',
          whiteSpace: letter === ' ' ? 'pre' : 'normal',
          ...distortionStyle,
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
