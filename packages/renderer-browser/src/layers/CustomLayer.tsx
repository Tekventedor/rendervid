import React from 'react';
import type { CustomLayer as CustomLayerType } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomComponentType = React.ComponentType<any>;

export interface CustomLayerProps {
  layer: CustomLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
  registry?: Map<string, CustomComponentType>;
}

export function CustomLayer({
  layer,
  frame,
  fps,
  sceneDuration,
  registry,
}: CustomLayerProps) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  const { customComponent } = layer;
  if (!customComponent) {
    console.warn(`Custom layer ${layer.id} has no customComponent defined`);
    return null;
  }

  const { name, props: componentProps } = customComponent;

  // Get the component from registry
  const Component = registry?.get(name);
  if (!Component) {
    console.warn(`Custom component "${name}" not found in registry`);
    return null;
  }

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
        ...layerStyle,
        ...animationStyle,
      }}
      className={layer.className}
    >
      <Component
        {...componentProps}
        // Pass frame-related props for animation-aware components
        frame={frame}
        fps={fps}
        sceneDuration={sceneDuration}
        layerSize={layer.size}
      />
    </div>
  );
}
