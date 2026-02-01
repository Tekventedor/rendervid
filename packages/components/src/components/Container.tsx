import React from 'react';
import type { ContainerProps } from '../types';

/**
 * Container component for layouts
 */
export function Container({
  width,
  height,
  backgroundColor,
  padding,
  borderRadius,
  border,
  boxShadow,
  flexDirection = 'column',
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  gap,
  className,
  style,
  children,
}: ContainerProps): React.ReactElement {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    width,
    height,
    backgroundColor,
    padding,
    borderRadius,
    border,
    boxShadow,
    flexDirection,
    justifyContent,
    alignItems,
    gap,
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
}
