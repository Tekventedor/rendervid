import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import type { ThreeCameraConfig } from '@rendervid/core';

export interface CameraProps {
  config: ThreeCameraConfig;
  frame: number;
  layerSize: { width: number; height: number };
}

/**
 * Camera component supporting perspective and orthographic cameras.
 * Handles camera position, rotation, and lookAt target.
 */
export function Camera({ config, frame, layerSize }: CameraProps) {
  const { set } = useThree();

  if (config.type === 'perspective') {
    const {
      fov = 75,
      near = 0.1,
      far = 1000,
      position = [0, 0, 5],
      lookAt,
    } = config;

    return (
      <PerspectiveCamera
        makeDefault
        fov={fov}
        near={near}
        far={far}
        position={position}
        aspect={layerSize.width / layerSize.height}
        onUpdate={(camera) => {
          if (lookAt) {
            camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
          }
        }}
      />
    );
  }

  // Orthographic camera
  const {
    left,
    right,
    top,
    bottom,
    near = 0.1,
    far = 1000,
    position = [0, 0, 5],
    lookAt,
  } = config;

  // Calculate orthographic frustum based on layer size
  const aspect = layerSize.width / layerSize.height;
  const frustumSize = 10; // Default frustum size

  const orthoLeft = left ?? -frustumSize * aspect / 2;
  const orthoRight = right ?? frustumSize * aspect / 2;
  const orthoTop = top ?? frustumSize / 2;
  const orthoBottom = bottom ?? -frustumSize / 2;

  return (
    <OrthographicCamera
      makeDefault
      left={orthoLeft}
      right={orthoRight}
      top={orthoTop}
      bottom={orthoBottom}
      near={near}
      far={far}
      position={position}
      onUpdate={(camera) => {
        if (lookAt) {
          camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
        }
      }}
    />
  );
}
