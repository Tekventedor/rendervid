import React from 'react';
import type { GradientTextProps } from '../types';

/**
 * Gradient text component
 */
export function GradientText({
  text,
  colors,
  angle = 90,
  gradientType = 'linear',
  fontSize = 16,
  fontFamily,
  fontWeight,
  textAlign = 'left',
  lineHeight,
  letterSpacing,
  className,
  style,
  children,
}: GradientTextProps): React.ReactElement {
  const gradientValue =
    gradientType === 'linear'
      ? `linear-gradient(${angle}deg, ${colors.join(', ')})`
      : `radial-gradient(circle, ${colors.join(', ')})`;

  const textStyle: React.CSSProperties = {
    fontSize,
    fontFamily,
    fontWeight,
    textAlign,
    lineHeight,
    letterSpacing,
    background: gradientValue,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    ...style,
  };

  return (
    <div className={className} style={textStyle}>
      {text}
      {children}
    </div>
  );
}
