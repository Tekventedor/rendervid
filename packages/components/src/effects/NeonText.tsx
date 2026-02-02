import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Animation mode type for neon effect
 */
export type NeonAnimationMode = 'pulse' | 'flicker' | 'static';

/**
 * Props for the NeonText component
 */
export interface NeonTextProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Neon glow color (default: cyan) */
  color?: string;
  /** Animation mode */
  mode?: NeonAnimationMode;
  /** Glow intensity (0-1, default: 1) */
  intensity?: number;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Enable background glow reflection (default: false) */
  backgroundGlow?: boolean;
  /** Background glow intensity (0-1, default: 0.3) */
  backgroundGlowIntensity?: number;
  /** Font size in pixels */
  fontSize?: number;
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
  /** Loop the animation */
  loop?: boolean;
}

/**
 * Generate multiple layered text-shadow for neon tube effect
 */
function generateNeonShadow(color: string, intensity: number): string {
  // Create multiple shadow layers for realistic neon glow
  // Inner glow (brightest, closest)
  const innerGlow = `0 0 ${5 * intensity}px ${color}`;
  // Mid glow
  const midGlow = `0 0 ${10 * intensity}px ${color}`;
  // Outer glow (softest, furthest)
  const outerGlow = `0 0 ${20 * intensity}px ${color}`;
  // Extra outer glow for more spread
  const extraGlow = `0 0 ${40 * intensity}px ${color}`;
  // Very far glow for ambient effect
  const farGlow = `0 0 ${80 * intensity}px ${color}`;

  return `${innerGlow}, ${midGlow}, ${outerGlow}, ${extraGlow}, ${farGlow}`;
}

/**
 * Calculate pulse intensity based on frame
 */
function calculatePulseIntensity(frame: number, speed: number, loop: boolean): number {
  // Smooth sine wave pulse
  const cycleFrames = 60 / speed; // One pulse cycle
  const effectiveFrame = loop ? frame % cycleFrames : Math.min(frame, cycleFrames);
  const progress = effectiveFrame / cycleFrames;

  // Sine wave oscillation between 0.6 and 1.0
  return 0.6 + 0.4 * Math.sin(progress * Math.PI * 2);
}

/**
 * Calculate flicker intensity based on frame
 */
function calculateFlickerIntensity(
  frame: number,
  speed: number,
  loop: boolean
): number {
  // Random-looking flicker using multiple sine waves at different frequencies
  const cycleFrames = 120 / speed;
  const effectiveFrame = loop ? frame % cycleFrames : frame;

  // Mix multiple frequencies for more natural flicker
  const fast = Math.sin(effectiveFrame * 0.5 * speed);
  const medium = Math.sin(effectiveFrame * 0.2 * speed);
  const slow = Math.sin(effectiveFrame * 0.1 * speed);

  // Combine waves and normalize to 0.4-1.0 range
  const combined = (fast * 0.4 + medium * 0.3 + slow * 0.3);
  return clamp(0.7 + combined * 0.3, 0.4, 1.0);
}

/**
 * NeonText Component
 *
 * A text animation component that creates a glowing neon tube effect with customizable
 * animation modes. The component uses multiple text-shadow layers to create a realistic
 * neon glow that can pulse smoothly or flicker randomly.
 *
 * Features:
 * - Frame-based neon animation (not time-based)
 * - Multiple shadow layers for realistic glow effect
 * - Three animation modes: pulse, flicker, and static
 * - Customizable neon color and intensity
 * - Optional background glow reflection
 * - Full typography control
 *
 * @example
 * ```tsx
 * // Basic neon text with pulse animation
 * <NeonText
 *   text="NEON LIGHTS"
 *   frame={currentFrame}
 *   fps={30}
 *   color="#00ffff"
 *   mode="pulse"
 *   intensity={1}
 * />
 *
 * // Flickering neon sign
 * <NeonText
 *   text="OPEN 24/7"
 *   frame={currentFrame}
 *   mode="flicker"
 *   color="#ff00ff"
 *   speed={2}
 *   loop={true}
 * />
 *
 * // Static neon with background glow
 * <NeonText
 *   text="RETRO VIBES"
 *   frame={currentFrame}
 *   mode="static"
 *   color="#00ff88"
 *   backgroundGlow={true}
 *   fontSize={48}
 *   fontWeight="bold"
 * />
 *
 * // Custom styled neon
 * <NeonText
 *   text="ARCADE"
 *   frame={currentFrame}
 *   mode="pulse"
 *   color="#ffff00"
 *   intensity={0.8}
 *   speed={0.5}
 *   fontSize={64}
 *   letterSpacing={8}
 *   fontFamily="'Courier New', monospace"
 * />
 * ```
 */
export function NeonText({
  text,
  color = '#00ffff',
  mode = 'pulse',
  intensity = 1,
  speed = 1,
  backgroundGlow = false,
  backgroundGlowIntensity = 0.3,
  fontSize = 48,
  fontFamily = "'Arial Black', sans-serif",
  fontWeight = 'bold',
  lineHeight = 1.2,
  textAlign = 'center',
  letterSpacing,
  loop = true,
  frame = 0,
  fps = 30,
  className,
  style,
}: NeonTextProps): React.ReactElement {
  // Calculate animation intensity based on mode
  let animationIntensity = 1;

  switch (mode) {
    case 'pulse':
      animationIntensity = calculatePulseIntensity(frame, speed, loop);
      break;
    case 'flicker':
      animationIntensity = calculateFlickerIntensity(frame, speed, loop);
      break;
    case 'static':
      animationIntensity = 1;
      break;
  }

  // Calculate final intensity
  const finalIntensity = clamp(intensity * animationIntensity, 0, 1);

  // Generate neon shadow
  const textShadow = generateNeonShadow(color, finalIntensity);

  // Base container styles
  const containerStyle: CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    ...style,
  };

  // Text style with neon glow
  const textStyle: CSSProperties = {
    fontSize,
    fontFamily,
    fontWeight,
    lineHeight,
    textAlign,
    letterSpacing: letterSpacing !== undefined ? `${letterSpacing}px` : undefined,
    color: color,
    textShadow,
    display: 'inline-block',
    position: 'relative',
    zIndex: 1,
  };

  // Background glow styles (optional radial gradient behind text)
  const backgroundGlowStyle: CSSProperties | undefined = backgroundGlow
    ? {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle, ${color}${Math.round(
          backgroundGlowIntensity * finalIntensity * 255
        ).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        filter: `blur(${40 * backgroundGlowIntensity * finalIntensity}px)`,
        pointerEvents: 'none',
        zIndex: 0,
      }
    : undefined;

  return (
    <div className={className} style={containerStyle}>
      {backgroundGlow && <div style={backgroundGlowStyle} />}
      <span style={textStyle}>{text}</span>
    </div>
  );
}
