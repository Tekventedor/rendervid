import React from 'react';
import type { TextProps } from '../types';

/**
 * Text component for rendering styled text
 */
export function Text({
  text,
  fontSize = 16,
  fontFamily,
  fontWeight,
  color = '#ffffff',
  textAlign = 'left',
  lineHeight,
  letterSpacing,
  textShadow,
  strokeWidth,
  strokeColor,
  className,
  style,
  children,
}: TextProps): React.ReactElement {
  const textStyle: React.CSSProperties = {
    fontSize,
    fontFamily,
    fontWeight,
    color,
    textAlign,
    lineHeight,
    letterSpacing,
    textShadow,
    WebkitTextStroke:
      strokeWidth && strokeColor ? `${strokeWidth}px ${strokeColor}` : undefined,
    ...style,
  };

  return (
    <div className={className} style={textStyle}>
      {text}
      {children}
    </div>
  );
}
