import React from 'react';
import type { ImageProps } from '../types';

/**
 * Image component with fit options
 */
export function Image({
  src,
  alt = '',
  fit = 'cover',
  position = 'center',
  borderRadius,
  className,
  style,
}: ImageProps): React.ReactElement {
  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: fit,
    objectPosition: position,
    borderRadius,
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={imgStyle}
    />
  );
}
