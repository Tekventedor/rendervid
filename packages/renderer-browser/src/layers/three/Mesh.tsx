import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { ThreeMeshConfig } from '@rendervid/core';
import { Geometry } from './Geometry';
import { Material } from './Material';
import { AnimationEngine } from '../../animation/AnimationEngine';
import { BehaviorSystem } from '../../behaviors/BehaviorSystem';

export interface MeshProps {
  config: ThreeMeshConfig;
  frame: number;
}

// Singleton instances
const animationEngine = new AnimationEngine();
const behaviorSystem = new BehaviorSystem();

/**
 * Mesh component that combines geometry and material.
 * Handles transforms, shadows, animations, and behaviors.
 */
export function Mesh({ config, frame }: MeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lastFrameRef = useRef<number>(0);

  const {
    id,
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
    animations,
    behaviors,
  } = config;

  // Initialize animations
  useEffect(() => {
    if (!animations || !id) return;

    animations.forEach((anim, idx) => {
      animationEngine.addAnimation(`${id}-${idx}`, anim);
    });

    return () => {
      animations.forEach((_, idx) => {
        animationEngine.removeAnimation(`${id}-${idx}`);
      });
    };
  }, [animations, id]);

  // Initialize behaviors
  useEffect(() => {
    if (!behaviors || !id) return;

    behaviors.forEach((behavior, idx) => {
      behaviorSystem.addBehavior(`${id}-${idx}`, behavior);
    });

    return () => {
      behaviors.forEach((_, idx) => {
        behaviorSystem.removeBehavior(`${id}-${idx}`);
      });
    };
  }, [behaviors, id]);

  // Apply animations and behaviors per frame
  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const deltaTime = (frame - lastFrameRef.current) / 60; // Assume 60fps
    lastFrameRef.current = frame;

    // Apply animations
    if (animations && id) {
      animationEngine.update(frame, mesh);
    }

    // Apply behaviors
    if (behaviors && id) {
      behaviorSystem.update(deltaTime, mesh);
    }

    // Apply auto-rotation
    if (autoRotate) {
      mesh.rotation.x = rotation[0] + (autoRotate[0] * frame);
      mesh.rotation.y = rotation[1] + (autoRotate[1] * frame);
      mesh.rotation.z = rotation[2] + (autoRotate[2] * frame);
    }
  }, [frame, animations, behaviors, autoRotate, rotation, id]);

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
