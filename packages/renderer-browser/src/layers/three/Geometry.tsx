import React, { useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry as ThreeTextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from 'three';
import type { ThreeGeometry } from '@rendervid/core';

export interface GeometryProps {
  config: ThreeGeometry;
}

/**
 * Geometry component supporting all geometry types.
 * Handles primitive geometries, GLTF models, and 3D text.
 */
export function Geometry({ config }: GeometryProps) {
  switch (config.type) {
    case 'box': {
      const {
        width = 1,
        height = 1,
        depth = 1,
        widthSegments = 1,
        heightSegments = 1,
        depthSegments = 1,
      } = config;

      return (
        <boxGeometry
          args={[width, height, depth, widthSegments, heightSegments, depthSegments]}
        />
      );
    }

    case 'sphere': {
      const {
        radius = 1,
        widthSegments = 32,
        heightSegments = 16,
        phiStart = 0,
        phiLength = Math.PI * 2,
        thetaStart = 0,
        thetaLength = Math.PI,
      } = config;

      return (
        <sphereGeometry
          args={[
            radius,
            widthSegments,
            heightSegments,
            phiStart,
            phiLength,
            thetaStart,
            thetaLength,
          ]}
        />
      );
    }

    case 'cylinder': {
      const {
        radiusTop = 1,
        radiusBottom = 1,
        height = 1,
        radialSegments = 8,
        heightSegments = 1,
        openEnded = false,
      } = config;

      return (
        <cylinderGeometry
          args={[radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded]}
        />
      );
    }

    case 'cone': {
      const {
        radius = 1,
        height = 1,
        radialSegments = 8,
        heightSegments = 1,
        openEnded = false,
      } = config;

      return (
        <coneGeometry
          args={[radius, height, radialSegments, heightSegments, openEnded]}
        />
      );
    }

    case 'torus': {
      const {
        radius = 1,
        tube = 0.4,
        radialSegments = 8,
        tubularSegments = 6,
        arc = Math.PI * 2,
      } = config;

      return (
        <torusGeometry
          args={[radius, tube, radialSegments, tubularSegments, arc]}
        />
      );
    }

    case 'plane': {
      const {
        width = 1,
        height = 1,
        widthSegments = 1,
        heightSegments = 1,
      } = config;

      return (
        <planeGeometry
          args={[width, height, widthSegments, heightSegments]}
        />
      );
    }

    case 'gltf':
      return <GLTFGeometry config={config} />;

    case 'text3d':
      return <Text3DGeometry config={config} />;

    default:
      console.warn(`Unknown geometry type: ${(config as ThreeGeometry).type}`);
      return <boxGeometry />;
  }
}

/**
 * GLTF model geometry component.
 */
function GLTFGeometry({ config }: { config: Extract<ThreeGeometry, { type: 'gltf' }> }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      config.url,
      (gltf) => {
        // Extract geometry from the first mesh in the scene
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            const geom = child.geometry.clone();

            // Apply scale if specified
            if (config.scale) {
              geom.scale(config.scale, config.scale, config.scale);
            }

            setGeometry(geom);
          }
        });
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF:', error);
        // Fallback to box geometry
        setGeometry(new THREE.BoxGeometry(1, 1, 1));
      }
    );
  }, [config.url, config.scale]);

  if (!geometry) {
    // Loading placeholder
    return <boxGeometry args={[0.1, 0.1, 0.1]} />;
  }

  return <primitive object={geometry} attach="geometry" />;
}

/**
 * 3D Text geometry component.
 */
function Text3DGeometry({ config }: { config: Extract<ThreeGeometry, { type: 'text3d' }> }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const loader = new FontLoader();

    loader.load(
      config.font,
      (font) => {
        const textGeometry = new ThreeTextGeometry(config.text, {
          font,
          size: config.size ?? 1,
          height: config.height ?? 0.2,
          curveSegments: config.curveSegments ?? 12,
          bevelEnabled: config.bevelEnabled ?? false,
          bevelThickness: config.bevelThickness ?? 0.03,
          bevelSize: config.bevelSize ?? 0.02,
          bevelSegments: config.bevelSegments ?? 3,
        });

        textGeometry.computeBoundingBox();
        setGeometry(textGeometry);
      },
      undefined,
      (error) => {
        console.error('Error loading font:', error);
        // Fallback to box geometry
        setGeometry(new THREE.BoxGeometry(1, 0.2, 0.2));
      }
    );
  }, [config.text, config.font, config.size, config.height]);

  if (!geometry) {
    // Loading placeholder
    return <boxGeometry args={[0.1, 0.1, 0.1]} />;
  }

  return <primitive object={geometry} attach="geometry" />;
}
