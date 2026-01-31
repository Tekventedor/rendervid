import React from 'react';
import type { GroupLayer as GroupLayerType } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';
import { LayerRenderer } from './LayerRenderer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomComponentType = React.ComponentType<any>;

export interface GroupLayerProps {
  layer: GroupLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
  isPlaying?: boolean;
  registry?: Map<string, CustomComponentType>;
}

export function GroupLayer({
  layer,
  frame,
  fps,
  sceneDuration,
  isPlaying,
  registry,
}: GroupLayerProps) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  const { clip = false } = layer.props;

  // Resolve layer style
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};

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
        overflow: clip ? 'hidden' : 'visible',
        ...layerStyle,
        ...animationStyle,
      }}
      className={layer.className}
    >
      {layer.children?.map((child) => (
        <LayerRenderer
          key={child.id}
          layer={child}
          frame={frame}
          fps={fps}
          sceneDuration={sceneDuration}
          isPlaying={isPlaying}
          registry={registry}
        />
      ))}
    </div>
  );
}
