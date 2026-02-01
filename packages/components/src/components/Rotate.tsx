import React from 'react';
import type { RotateProps } from '../types';
import { lerp, getProgress, easeInOut } from '../utils/interpolate';

/**
 * Rotate animation wrapper component
 */
export function Rotate({
  from = 0,
  to = 360,
  duration = 30,
  delay = 0,
  origin = 'center',
  frame,
  className,
  style,
  children,
}: RotateProps): React.ReactElement {
  const effectiveFrame = Math.max(0, frame - delay);
  const progress = easeInOut(getProgress(effectiveFrame, 0, duration));
  const rotation = lerp(from, to, progress);

  const rotateStyle: React.CSSProperties = {
    transform: `rotate(${rotation}deg)`,
    transformOrigin: origin,
    ...style,
  };

  return (
    <div className={className} style={rotateStyle}>
      {children}
    </div>
  );
}
