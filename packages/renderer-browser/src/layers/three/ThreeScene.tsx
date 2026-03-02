import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type {
  ThreeCameraConfig,
  ThreeLightConfig,
  ThreeMeshConfig,
  Color,
  TextureConfig,
} from '@rendervid/core';
import { Camera } from './Camera';
import { Lights } from './Lights';
import { Mesh } from './Mesh';
import { ParticleSystem } from '../../particles/ParticleSystem';

export interface ThreeSceneProps {
  camera: ThreeCameraConfig;
  lights?: ThreeLightConfig[];
  meshes: ThreeMeshConfig[];
  particles?: any[];
  background?: Color | TextureConfig;
  fog?: {
    color: Color;
    near: number;
    far: number;
  };
  shadows?: {
    enabled: boolean;
    type?: 'basic' | 'pcf' | 'pcfsoft' | 'vsm';
  };
  toneMapping?: {
    type: 'none' | 'linear' | 'reinhard' | 'cineon' | 'aces';
    exposure?: number;
  };
  frame: number;
  layerSize: { width: number; height: number };
}

/**
 * Main Three.js scene container.
 * Sets up the scene, camera, lights, meshes, and particles.
 */
export function ThreeScene({
  camera,
  lights = [],
  meshes,
  particles = [],
  background,
  fog,
  shadows,
  toneMapping,
  frame,
  layerSize,
}: ThreeSceneProps) {
  const { scene, gl, invalidate } = useThree();
  const particleSystemsRef = useRef<ParticleSystem[]>([]);
  const lastFrameRef = useRef<number>(0);

  // Initialize particle systems
  useEffect(() => {
    // Clean up existing systems
    particleSystemsRef.current.forEach(ps => {
      scene.remove(ps.getObject());
    });
    particleSystemsRef.current = [];

    // Create new systems
    particles.forEach(particleConfig => {
      const ps = new ParticleSystem(particleConfig);
      scene.add(ps.getObject());
      particleSystemsRef.current.push(ps);
    });

    return () => {
      particleSystemsRef.current.forEach(ps => {
        scene.remove(ps.getObject());
      });
      particleSystemsRef.current = [];
    };
  }, [particles, scene]);

  // Update particles every frame
  useFrame(() => {
    const deltaTime = (frame - lastFrameRef.current) / 60; // Assume 60fps
    lastFrameRef.current = frame;

    particleSystemsRef.current.forEach(ps => {
      ps.update(deltaTime);
    });
  });

  // Trigger render when frame changes
  useEffect(() => {
    invalidate();
  }, [frame, invalidate]);

  // Configure scene background
  useEffect(() => {
    if (!background) {
      scene.background = null;
      return;
    }

    // Handle color background
    if (typeof background === 'string' || typeof background === 'number') {
      scene.background = new THREE.Color(background);
      return;
    }

    // Handle texture background
    // TODO: Load texture from URL
    scene.background = null;
  }, [background, scene]);

  // Configure fog
  useEffect(() => {
    if (!fog) {
      scene.fog = null;
      return;
    }

    scene.fog = new THREE.Fog(
      new THREE.Color(fog.color).getHex(),
      fog.near,
      fog.far
    );
  }, [fog, scene]);

  // Configure shadow maps
  useEffect(() => {
    if (!shadows?.enabled) {
      gl.shadowMap.enabled = false;
      return;
    }

    gl.shadowMap.enabled = true;

    // Set shadow map type
    switch (shadows.type) {
      case 'basic':
        gl.shadowMap.type = THREE.BasicShadowMap;
        break;
      case 'pcf':
        gl.shadowMap.type = THREE.PCFShadowMap;
        break;
      case 'pcfsoft':
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        break;
      case 'vsm':
        gl.shadowMap.type = THREE.VSMShadowMap;
        break;
      default:
        gl.shadowMap.type = THREE.PCFShadowMap;
    }
  }, [shadows, gl]);

  // Configure tone mapping
  useEffect(() => {
    if (!toneMapping) {
      gl.toneMapping = THREE.NoToneMapping;
      gl.toneMappingExposure = 1;
      return;
    }

    // Set tone mapping type
    switch (toneMapping.type) {
      case 'none':
        gl.toneMapping = THREE.NoToneMapping;
        break;
      case 'linear':
        gl.toneMapping = THREE.LinearToneMapping;
        break;
      case 'reinhard':
        gl.toneMapping = THREE.ReinhardToneMapping;
        break;
      case 'cineon':
        gl.toneMapping = THREE.CineonToneMapping;
        break;
      case 'aces':
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        break;
      default:
        gl.toneMapping = THREE.NoToneMapping;
    }

    gl.toneMappingExposure = toneMapping.exposure ?? 1;
  }, [toneMapping, gl]);

  return (
    <>
      {/* Camera setup */}
      <Camera config={camera} frame={frame} layerSize={layerSize} />

      {/* Lights */}
      <Lights lights={lights} />

      {/* Meshes */}
      {meshes.map((mesh) => (
        <Mesh key={mesh.id} config={mesh} frame={frame} />
      ))}
    </>
  );
}
