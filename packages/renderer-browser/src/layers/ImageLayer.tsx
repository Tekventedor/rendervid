import React from 'react';
import type { ImageLayer as ImageLayerType } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';

export interface ImageLayerProps {
  layer: ImageLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
}

export function ImageLayer({ layer, frame, fps, sceneDuration }: ImageLayerProps) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  const src = layer.props.src;
  if (!src) return null;

  const fit = layer.props.fit || 'cover';
  const objectPosition = layer.props.objectPosition || 'center';

  // Resolve layer style
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};

  // Apply anchor point (default is 0, 0 = top-left for backward compatibility)
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - (layer.size.width * anchor.x);
  const top = layer.position.y - (layer.size.height * anchor.y);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
        opacity: layer.opacity ?? 1,
        overflow: 'hidden',
        ...layerStyle,
        ...animationStyle,
      }}
      className={layer.className}
    >
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit === 'fill' ? 'fill' : (fit as any),
          objectPosition: objectPosition,
          display: 'block',
        }}
      />
    </div>
  );
}
