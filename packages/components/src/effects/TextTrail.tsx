import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';

/**
 * Direction for trail motion
 */
export type TrailDirection =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Props for the TextTrail component
 */
export interface TextTrailProps extends AnimatedProps {
  /** Text to display */
  text: string;
  /** Number of trail copies to render */
  trailLength?: number;
  /** Spacing between trail copies in pixels */
  trailSpacing?: number;
  /** Direction of the trail */
  direction?: TrailDirection;
  /** Starting opacity for the main text */
  startOpacity?: number;
  /** Ending opacity for the last trail copy */
  endOpacity?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Enable continuous motion animation */
  animate?: boolean;
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
  /** Blur effect on trail copies */
  blur?: number;
}

/**
 * Calculate offset position based on direction and index
 */
function getTrailOffset(
  direction: TrailDirection,
  index: number,
  spacing: number
): { x: number; y: number } {
  const offset = index * spacing;

  switch (direction) {
    case 'left':
      return { x: -offset, y: 0 };
    case 'right':
      return { x: offset, y: 0 };
    case 'up':
      return { x: 0, y: -offset };
    case 'down':
      return { x: 0, y: offset };
    case 'top-left':
      return { x: -offset * 0.707, y: -offset * 0.707 }; // 45 degree angle
    case 'top-right':
      return { x: offset * 0.707, y: -offset * 0.707 };
    case 'bottom-left':
      return { x: -offset * 0.707, y: offset * 0.707 };
    case 'bottom-right':
      return { x: offset * 0.707, y: offset * 0.707 };
    default:
      return { x: offset, y: 0 };
  }
}

/**
 * TextTrail Component
 *
 * A text animation component that creates a motion trail effect by rendering multiple
 * copies of the text with decreasing opacity. The trail follows the text in a specified
 * direction, creating a dynamic motion blur or ghost effect.
 *
 * Features:
 * - Frame-aware rendering for consistent animation
 * - Multiple trail copies with configurable length
 * - Eight directional options (horizontal, vertical, diagonal)
 * - Customizable opacity gradient from start to end
 * - Optional continuous motion animation
 * - Optional blur effect on trail copies
 * - Full typography control
 *
 * The trail effect is created by:
 * - Rendering multiple copies of the text (trailLength)
 * - Positioning each copy with an offset based on direction
 * - Applying decreasing opacity from startOpacity to endOpacity
 * - Optionally animating the position based on frame
 *
 * @example
 * ```tsx
 * // Basic trail effect moving right
 * <TextTrail
 *   text="Hello World"
 *   frame={currentFrame}
 *   fps={30}
 *   direction="right"
 *   trailLength={5}
 *   trailSpacing={8}
 * />
 *
 * // Diagonal trail with animation
 * <TextTrail
 *   text="Speed Demon"
 *   frame={currentFrame}
 *   direction="bottom-right"
 *   trailLength={8}
 *   trailSpacing={6}
 *   animate={true}
 *   speed={2}
 *   fontSize={48}
 *   color="#00ff00"
 * />
 *
 * // Vertical trail with blur
 * <TextTrail
 *   text="Motion Blur"
 *   frame={currentFrame}
 *   direction="down"
 *   trailLength={6}
 *   trailSpacing={10}
 *   blur={2}
 *   startOpacity={1}
 *   endOpacity={0.1}
 * />
 * ```
 */
export function TextTrail({
  text,
  trailLength = 5,
  trailSpacing = 8,
  direction = 'right',
  startOpacity = 1,
  endOpacity = 0.1,
  speed = 1,
  animate = false,
  fontSize = 24,
  color = '#ffffff',
  fontFamily = 'Arial, sans-serif',
  fontWeight = 'normal',
  lineHeight = 1.5,
  textAlign = 'left',
  letterSpacing,
  textShadow,
  blur = 0,
  frame = 0,
  fps = 30,
  className,
  style,
}: TextTrailProps): React.ReactElement {
  // Calculate time in seconds for smooth animation
  const time = frame / fps;

  // Calculate animation offset if animate is enabled
  const animationOffset = animate ? (time * speed * 10) % (trailSpacing * 2) : 0;

  // Base container styles
  const containerStyle: CSSProperties = {
    position: 'relative',
    fontSize,
    color,
    fontFamily,
    fontWeight,
    lineHeight,
    textAlign,
    letterSpacing: letterSpacing !== undefined ? `${letterSpacing}px` : undefined,
    display: 'inline-block',
    ...style,
  };

  // Generate array of trail indices (reverse order so main text renders on top)
  const trailIndices = Array.from({ length: trailLength }, (_, i) => trailLength - 1 - i);

  return (
    <div className={className} style={containerStyle}>
      {trailIndices.map((index) => {
        // Calculate opacity for this trail copy
        const opacityProgress = index / (trailLength - 1);
        const opacity = startOpacity - (startOpacity - endOpacity) * opacityProgress;

        // Calculate position offset
        const baseOffset = getTrailOffset(direction, index, trailSpacing);

        // Apply animation offset if enabled
        const animatedX = baseOffset.x + (animate ? getTrailOffset(direction, 1, animationOffset).x : 0);
        const animatedY = baseOffset.y + (animate ? getTrailOffset(direction, 1, animationOffset).y : 0);

        // Calculate blur amount (more blur for trail copies)
        const blurAmount = blur * (index / (trailLength - 1));

        // Trail copy styles
        const trailStyle: CSSProperties = {
          position: index === 0 ? 'relative' : 'absolute',
          top: index === 0 ? 0 : '50%',
          left: index === 0 ? 0 : '50%',
          transform:
            index === 0
              ? 'none'
              : `translate(calc(-50% + ${animatedX}px), calc(-50% + ${animatedY}px))`,
          opacity,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
          textShadow: index === 0 ? textShadow : undefined,
          whiteSpace: 'nowrap',
        };

        return (
          <span key={index} style={trailStyle}>
            {text}
          </span>
        );
      })}
    </div>
  );
}
