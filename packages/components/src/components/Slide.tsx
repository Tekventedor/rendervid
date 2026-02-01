import React from 'react';
import type { SlideProps } from '../types';
import { lerp, getProgress, easeInOut } from '../utils/interpolate';

/**
 * Slide animation wrapper component
 */
export function Slide({
  from,
  distance = 100,
  duration = 30,
  delay = 0,
  fade = false,
  frame,
  className,
  style,
  children,
}: SlideProps): React.ReactElement {
  const effectiveFrame = Math.max(0, frame - delay);
  const progress = easeInOut(getProgress(effectiveFrame, 0, duration));

  // Calculate offset based on direction
  let translateX = 0;
  let translateY = 0;

  switch (from) {
    case 'left':
      translateX = lerp(-distance, 0, progress);
      break;
    case 'right':
      translateX = lerp(distance, 0, progress);
      break;
    case 'top':
      translateY = lerp(-distance, 0, progress);
      break;
    case 'bottom':
      translateY = lerp(distance, 0, progress);
      break;
  }

  const slideStyle: React.CSSProperties = {
    transform: `translate(${translateX}px, ${translateY}px)`,
    opacity: fade ? progress : 1,
    ...style,
  };

  return (
    <div className={className} style={slideStyle}>
      {children}
    </div>
  );
}
