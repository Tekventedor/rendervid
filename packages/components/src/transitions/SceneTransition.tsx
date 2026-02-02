import React from 'react';
import type { AnimatedProps } from '../types';

export interface SceneTransitionProps extends AnimatedProps {
  /** Transition type */
  type?:
    | 'fade'
    | 'wipe-left'
    | 'wipe-right'
    | 'wipe-up'
    | 'wipe-down'
    | 'slide-left'
    | 'slide-right'
    | 'zoom-in'
    | 'zoom-out'
    | 'circle-in'
    | 'circle-out';
  /** Transition duration in frames */
  duration?: number;
  /** Transition color (for wipes and circles) */
  color?: string;
  /** Width of the transition overlay */
  width?: number;
  /** Height of the transition overlay */
  height?: number;
}

/**
 * Scene transition effect component
 */
export function SceneTransition({
  type = 'fade',
  duration = 30,
  color = '#000000',
  width = 1920,
  height = 1080,
  frame = 0,
  style,
  className,
}: SceneTransitionProps): React.ReactElement {
  // Calculate transition progress (0 to 1)
  const progress = Math.min(frame / duration, 1);

  const getTransitionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width,
      height,
      backgroundColor: color,
      pointerEvents: 'none',
    };

    switch (type) {
      case 'fade':
        return {
          ...baseStyle,
          opacity: 1 - progress,
        };

      case 'wipe-left':
        return {
          ...baseStyle,
          transform: `translateX(-${progress * 100}%)`,
        };

      case 'wipe-right':
        return {
          ...baseStyle,
          transform: `translateX(${progress * 100}%)`,
        };

      case 'wipe-up':
        return {
          ...baseStyle,
          transform: `translateY(-${progress * 100}%)`,
        };

      case 'wipe-down':
        return {
          ...baseStyle,
          transform: `translateY(${progress * 100}%)`,
        };

      case 'slide-left':
        return {
          ...baseStyle,
          clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
        };

      case 'slide-right':
        return {
          ...baseStyle,
          clipPath: `inset(0 0 0 ${(1 - progress) * 100}%)`,
        };

      case 'zoom-in':
        return {
          ...baseStyle,
          transform: `scale(${1 + progress * 2})`,
          opacity: 1 - progress,
        };

      case 'zoom-out':
        return {
          ...baseStyle,
          transform: `scale(${1 - progress})`,
          opacity: 1 - progress,
        };

      case 'circle-in':
        return {
          ...baseStyle,
          clipPath: `circle(${progress * 150}% at 50% 50%)`,
        };

      case 'circle-out':
        return {
          ...baseStyle,
          clipPath: `circle(${(1 - progress) * 150}% at 50% 50%)`,
        };

      default:
        return baseStyle;
    }
  };

  // Don't render if transition is complete
  if (progress >= 1 && type !== 'fade') {
    return <></>;
  }

  return (
    <div
      className={className}
      style={{
        ...getTransitionStyle(),
        ...style,
      }}
    />
  );
}
