import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { ThreeMeshConfig } from '@rendervid/core';
import { Geometry } from './Geometry';
import { Material } from './Material';

export interface MeshProps {
  config: ThreeMeshConfig;
  frame: number;
}

/**
 * Mesh component that combines geometry and material.
 * Handles transforms, shadows, and auto-rotation.
 */
export function Mesh({ config, frame }: MeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const {
    geometry,
    material,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    castShadow = false,
    receiveShadow = false,
    visible = true,
    renderOrder = 0,
    autoRotate,
  } = config;

  // Apply auto-rotation based on frame
  useEffect(() => {
    if (!meshRef.current || !autoRotate) return;

    const mesh = meshRef.current;

    // Apply auto-rotation per frame
    mesh.rotation.x = rotation[0] + (autoRotate[0] * frame);
    mesh.rotation.y = rotation[1] + (autoRotate[1] * frame);
    mesh.rotation.z = rotation[2] + (autoRotate[2] * frame);
  }, [frame, autoRotate, rotation]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={autoRotate ? undefined : rotation}
      scale={scale}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      visible={visible}
      renderOrder={renderOrder}
    >
      <Geometry config={geometry} />
      <Material config={material} />
    </mesh>
  );
}
