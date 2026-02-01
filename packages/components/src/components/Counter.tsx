import React from 'react';
import type { CounterProps } from '../types';
import { lerp, getProgress, easeInOut } from '../utils/interpolate';

/**
 * Animated counter component
 */
export function Counter({
  from,
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  format,
  fontSize = 48,
  color = '#ffffff',
  frame,
  totalFrames = 30,
  className,
  style,
}: CounterProps): React.ReactElement {
  const progress = easeInOut(getProgress(frame, 0, totalFrames));
  const currentValue = lerp(from, to, progress);

  let displayValue: string;
  if (format) {
    displayValue = format(currentValue);
  } else {
    displayValue = currentValue.toFixed(decimals);
  }

  const counterStyle: React.CSSProperties = {
    fontSize,
    color,
    fontVariantNumeric: 'tabular-nums',
    ...style,
  };

  return (
    <span className={className} style={counterStyle}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
