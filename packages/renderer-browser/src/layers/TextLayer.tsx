import React from 'react';
import type { TextLayer as TextLayerType } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';

export interface TextLayerProps {
  layer: TextLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
}

export function TextLayer({ layer, frame, fps, sceneDuration }: TextLayerProps) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  const {
    text,
    fontFamily = 'Inter, sans-serif',
    fontSize = 16,
    fontWeight = 'normal',
    fontStyle = 'normal',
    color = '#000000',
    textAlign = 'left',
    verticalAlign = 'top',
    lineHeight = 1.4,
    letterSpacing = 0,
    textTransform,
    textDecoration,
    stroke,
    textShadow,
    backgroundColor,
    padding,
    borderRadius,
    maxLines,
    overflow = 'visible',
  } = layer.props;

  // Resolve layer style
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};

  // Build padding
  let paddingStyle: React.CSSProperties = {};
  if (padding !== undefined) {
    if (typeof padding === 'number') {
      paddingStyle = { padding };
    } else {
      paddingStyle = {
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
      };
    }
  }

  // Build text stroke (using text-shadow for outline effect)
  let strokeShadow = '';
  if (stroke) {
    const { color: strokeColor, width } = stroke;
    strokeShadow = [
      `${width}px 0 ${strokeColor}`,
      `-${width}px 0 ${strokeColor}`,
      `0 ${width}px ${strokeColor}`,
      `0 -${width}px ${strokeColor}`,
    ].join(', ');
  }

  // Combine text shadows
  const combinedTextShadow = [strokeShadow, textShadow ?
    `${textShadow.offsetX}px ${textShadow.offsetY}px ${textShadow.blur}px ${textShadow.color}` : '']
    .filter(Boolean)
    .join(', ') || undefined;

  // Vertical alignment using flexbox
  const alignItems = {
    top: 'flex-start',
    middle: 'center',
    bottom: 'flex-end',
  }[verticalAlign];

  return (
    <div
      style={{
        position: 'absolute',
        left: layer.position.x,
        top: layer.position.y,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
        opacity: layer.opacity ?? 1,
        display: 'flex',
        alignItems,
        justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
        ...layerStyle,
        ...animationStyle,
      }}
      className={layer.className}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight,
          fontStyle,
          color,
          textAlign,
          lineHeight,
          letterSpacing,
          textTransform,
          textDecoration,
          textShadow: combinedTextShadow,
          backgroundColor,
          borderRadius,
          overflow: overflow === 'ellipsis' ? 'hidden' : overflow,
          textOverflow: overflow === 'ellipsis' ? 'ellipsis' : undefined,
          whiteSpace: maxLines === 1 ? 'nowrap' : undefined,
          display: maxLines && maxLines > 1 ? '-webkit-box' : undefined,
          WebkitLineClamp: maxLines && maxLines > 1 ? maxLines : undefined,
          WebkitBoxOrient: maxLines && maxLines > 1 ? 'vertical' : undefined,
          width: '100%',
          ...paddingStyle,
        }}
      >
        {text}
      </div>
    </div>
  );
}
