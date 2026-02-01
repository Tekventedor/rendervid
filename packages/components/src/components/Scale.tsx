import React from 'react';
import type { ScaleProps } from '../types';
import { lerp, getProgress, easeInOut } from '../utils/interpolate';

/**
 * Scale animation wrapper component
 */
export function Scale({
  from = 0,
  to = 1,
  duration = 30,
  delay = 0,
  frame,
  className,
  style,
  children,
}: ScaleProps): React.ReactElement {
  const effectiveFrame = Math.max(0, frame - delay);
  const progress = easeInOut(getProgress(effectiveFrame, 0, duration));
  const scale = lerp(from, to, progress);

  const scaleStyle: React.CSSProperties = {
    transform: `scale(${scale})`,
    ...style,
  };

  return (
    <div className={className} style={scaleStyle}>
      {children}
    </div>
  );
}
