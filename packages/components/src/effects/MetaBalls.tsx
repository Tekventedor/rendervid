import React from 'react';
import type { AnimatedProps } from '../types';

/**
 * Movement pattern type for metaballs
 */
export type MovementPattern = 'orbit' | 'bounce' | 'float';

/**
 * Props for the MetaBalls component
 */
export interface MetaBallsProps extends AnimatedProps {
  /** Number of metaballs to render */
  count?: number;
  /** Array of gradient colors for the metaballs */
  colors?: string[];
  /** Base radius of each ball in pixels */
  size?: number;
  /** Animation speed multiplier (higher = faster) */
  speed?: number;
  /** Blur intensity for the merging effect (higher = more merging) */
  blur?: number;
  /** Movement pattern for the balls */
  movement?: MovementPattern;
  /** Background color */
  backgroundColor?: string;
  /** Width of the container */
  width?: number | string;
  /** Height of the container */
  height?: number | string;
}

/**
 * Ball position and properties
 */
interface Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
}

/**
 * MetaBalls Component
 *
 * Creates smooth morphing blob animations using SVG filters.
 * The balls appear to merge together when they get close, creating an organic fluid effect.
 *
 * Features:
 * - Multiple balls with deterministic movement patterns
 * - SVG filter-based metaball effect (blur + contrast)
 * - Customizable colors, sizes, and movement patterns
 * - Frame-based animation for consistent video rendering
 * - Organic, flowing motion using sine/cosine functions
 *
 * Technical Implementation:
 * - Uses feGaussianBlur for soft edges
 * - Uses feColorMatrix with high alpha values for contrast/merge effect
 * - Each ball moves independently with phase-shifted trigonometric functions
 * - Movement is fully deterministic based on frame number
 *
 * @example
 * ```tsx
 * <MetaBalls
 *   count={5}
 *   colors={['#ff0080', '#7928ca', '#4c00ff']}
 *   size={80}
 *   speed={1}
 *   blur={40}
 *   movement="orbit"
 *   frame={currentFrame}
 *   totalFrames={300}
 * />
 * ```
 */
export function MetaBalls({
  count = 5,
  colors = ['#ff0080', '#7928ca', '#4c00ff'],
  size = 80,
  speed = 1,
  blur = 40,
  movement = 'orbit',
  backgroundColor = '#000000',
  width = '100%',
  height = '100%',
  frame = 0,
  totalFrames = 300,
  fps = 30,
  className,
  style,
  children,
}: MetaBallsProps): React.ReactElement {
  // Ensure we have at least one ball and one color
  const ballCount = Math.max(1, count);
  const ballColors = colors.length > 0 ? colors : ['#ff0080'];

  // Calculate animation progress (0 to 2π for smooth looping)
  const progress = (frame / (totalFrames || 300)) * Math.PI * 2 * speed;

  // Generate ball positions and properties
  const balls: Ball[] = [];
  for (let i = 0; i < ballCount; i++) {
    const phaseOffset = (i * Math.PI * 2) / ballCount;
    const colorIndex = i % ballColors.length;
    const color = ballColors[colorIndex];

    let x: number, y: number;

    switch (movement) {
      case 'orbit':
        // Circular orbit with varying radii
        const orbitRadius = 20 + (i % 3) * 10;
        x = 50 + Math.cos(progress + phaseOffset) * orbitRadius;
        y = 50 + Math.sin(progress + phaseOffset) * orbitRadius;
        break;

      case 'bounce':
        // Bouncing motion with easing
        const bounceX = Math.sin(progress * 0.7 + phaseOffset) * 35;
        const bounceY = Math.abs(Math.sin(progress * 1.2 + phaseOffset)) * 40;
        x = 50 + bounceX;
        y = 50 - bounceY + 10;
        break;

      case 'float':
        // Lissajous curves for organic floating
        const floatX = Math.sin(progress * 0.8 + phaseOffset) * 30;
        const floatY = Math.sin(progress * 1.1 + phaseOffset * 1.5) * 30;
        x = 50 + floatX;
        y = 50 + floatY;
        break;

      default:
        x = 50;
        y = 50;
    }

    // Add size variation based on time for breathing effect
    const sizeVariation = Math.sin(progress * 1.5 + i) * 0.2 + 1;
    const radius = size * sizeVariation;

    balls.push({ x, y, radius, color });
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    backgroundColor,
    overflow: 'hidden',
    ...style,
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  };

  return (
    <div className={className} style={containerStyle}>
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <defs>
          {/* Metaball filter: blur + high contrast = merging effect */}
          <filter id={`metaball-filter-${frame}`} x="-50%" y="-50%" width="200%" height="200%">
            {/* Blur the balls to create soft edges */}
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
            {/* High contrast to create sharp merge boundaries */}
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="metaball"
            />
            {/* Blend with original for better color */}
            <feBlend in="SourceGraphic" in2="metaball" mode="normal" />
          </filter>

          {/* Gradients for each color */}
          {ballColors.map((color, index) => (
            <radialGradient key={`gradient-${index}`} id={`ball-gradient-${index}`}>
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.8" />
            </radialGradient>
          ))}
        </defs>

        {/* Group with metaball filter applied */}
        <g filter={`url(#metaball-filter-${frame})`}>
          {balls.map((ball, index) => (
            <circle
              key={index}
              cx={`${ball.x}%`}
              cy={`${ball.y}%`}
              r={ball.radius}
              fill={`url(#ball-gradient-${index % ballColors.length})`}
              opacity="0.9"
            />
          ))}
        </g>
      </svg>

      {children && <div style={contentStyle}>{children}</div>}
    </div>
  );
}
