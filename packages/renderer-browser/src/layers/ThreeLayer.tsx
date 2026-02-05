import React from 'react';
import { Canvas } from '@react-three/fiber';
import type { ThreeLayer as ThreeLayerType } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';
import { ThreeScene } from './three/ThreeScene';

export interface ThreeLayerProps {
  layer: ThreeLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
}

/**
 * Three.js 3D scene layer renderer.
 * Renders a 3D scene using React Three Fiber.
 */
export function ThreeLayer({ layer, frame, fps, sceneDuration }: ThreeLayerProps) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  // Resolve layer style
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};

  // Apply anchor point (default is 0, 0 = top-left for backward compatibility)
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - (layer.size.width * anchor.x);
  const top = layer.position.y - (layer.size.height * anchor.y);

  // Get Three.js layer props
  const {
    camera,
    lights,
    meshes,
    background,
    fog,
    antialias = true,
    shadows,
    toneMapping,
  } = layer.props;

  // Canvas configuration
  const canvasProps = {
    gl: {
      alpha: true, // Support transparency
      antialias,
      preserveDrawingBuffer: true, // Required for screenshots/video capture
    },
    shadows: shadows?.enabled ?? false,
    style: {
      width: '100%',
      height: '100%',
    },
  } as const;

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
      <Canvas {...canvasProps}>
        <ThreeScene
          camera={camera}
          lights={lights}
          meshes={meshes}
          background={background}
          fog={fog}
          shadows={shadows}
          toneMapping={toneMapping}
          frame={frame}
          layerSize={layer.size}
        />
      </Canvas>
    </div>
  );
}
