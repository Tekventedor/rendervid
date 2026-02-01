import React from 'react';
import type { ProgressBarProps } from '../types';
import { lerp, getProgress, easeInOut } from '../utils/interpolate';

/**
 * Animated progress bar component
 */
export function ProgressBar({
  value,
  color = '#3b82f6',
  backgroundColor = 'rgba(255, 255, 255, 0.2)',
  borderRadius = 4,
  height = 8,
  animated = true,
  frame,
  totalFrames = 30,
  className,
  style,
}: ProgressBarProps): React.ReactElement {
  // If animated, interpolate from 0 to value
  let displayValue = value;
  if (animated && totalFrames > 0) {
    const progress = easeInOut(getProgress(frame, 0, totalFrames));
    displayValue = lerp(0, value, progress);
  }

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height,
    backgroundColor,
    borderRadius,
    overflow: 'hidden',
    ...style,
  };

  const barStyle: React.CSSProperties = {
    width: `${Math.min(100, displayValue * 100)}%`,
    height: '100%',
    backgroundColor: color,
    borderRadius,
    transition: animated ? undefined : 'width 0.2s ease',
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={barStyle} />
    </div>
  );
}
