import React from 'react';
import type { FadeProps } from '../types';
import { lerp, getProgress, easeInOut } from '../utils/interpolate';

/**
 * Fade animation wrapper component
 */
export function Fade({
  direction,
  duration = 30,
  delay = 0,
  frame,
  totalFrames = 60,
  className,
  style,
  children,
}: FadeProps): React.ReactElement {
  let opacity: number;

  const effectiveFrame = Math.max(0, frame - delay);

  switch (direction) {
    case 'in':
      opacity = easeInOut(getProgress(effectiveFrame, 0, duration));
      break;
    case 'out':
      opacity = 1 - easeInOut(getProgress(effectiveFrame, 0, duration));
      break;
    case 'inOut':
      if (effectiveFrame < duration) {
        // Fade in
        opacity = easeInOut(getProgress(effectiveFrame, 0, duration));
      } else if (effectiveFrame >= (totalFrames || duration * 2) - duration) {
        // Fade out
        const fadeOutStart = (totalFrames || duration * 2) - duration;
        opacity = 1 - easeInOut(getProgress(effectiveFrame, fadeOutStart, (totalFrames || duration * 2)));
      } else {
        // Fully visible
        opacity = 1;
      }
      break;
    default:
      opacity = 1;
  }

  const fadeStyle: React.CSSProperties = {
    opacity,
    ...style,
  };

  return (
    <div className={className} style={fadeStyle}>
      {children}
    </div>
  );
}
