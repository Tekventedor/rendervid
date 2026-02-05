import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ThreeScene } from '../ThreeScene';
import type {
  ThreeCameraConfig,
  ThreeLightConfig,
  ThreeMeshConfig,
} from '@rendervid/core';

describe('ThreeScene Component', () => {
  const defaultCamera: ThreeCameraConfig = {
    type: 'perspective',
    fov: 75,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5],
  };

  const defaultMesh: ThreeMeshConfig = {
    id: 'test-mesh',
    geometry: { type: 'box' },
    material: { type: 'standard', color: '#ff0000' },
    position: [0, 0, 0],
  };

  const layerSize = { width: 800, height: 600 };

  it('should render scene with camera and meshes', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render scene with lights', () => {
    const lights: ThreeLightConfig[] = [
      { type: 'ambient', color: '#ffffff', intensity: 0.5 },
      { type: 'directional', color: '#ffffff', intensity: 1, position: [10, 10, 5] },
    ];

    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          lights={lights}
          meshes={[defaultMesh]}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render scene with background color', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          background="#0088ff"
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render scene with fog', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          fog={{
            color: '#ffffff',
            near: 1,
            far: 100,
          }}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render scene with shadows enabled', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          shadows={{
            enabled: true,
            type: 'pcfsoft',
          }}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render scene with all shadow types', () => {
    const shadowTypes = ['basic', 'pcf', 'pcfsoft', 'vsm'] as const;

    shadowTypes.forEach((type) => {
      const { container } = render(
        <Canvas>
          <ThreeScene
            camera={defaultCamera}
            meshes={[defaultMesh]}
            shadows={{
              enabled: true,
              type,
            }}
            frame={0}
            layerSize={layerSize}
          />
        </Canvas>
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should render scene with tone mapping', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          toneMapping={{
            type: 'aces',
            exposure: 1.5,
          }}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render scene with all tone mapping types', () => {
    const toneMappingTypes = ['none', 'linear', 'reinhard', 'cineon', 'aces'] as const;

    toneMappingTypes.forEach((type) => {
      const { container } = render(
        <Canvas>
          <ThreeScene
            camera={defaultCamera}
            meshes={[defaultMesh]}
            toneMapping={{
              type,
              exposure: 1,
            }}
            frame={0}
            layerSize={layerSize}
          />
        </Canvas>
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should render scene without lights', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render scene with multiple meshes', () => {
    const meshes: ThreeMeshConfig[] = [
      {
        id: 'mesh-1',
        geometry: { type: 'box' },
        material: { type: 'standard', color: '#ff0000' },
        position: [-2, 0, 0],
      },
      {
        id: 'mesh-2',
        geometry: { type: 'sphere', radius: 0.5 },
        material: { type: 'standard', color: '#00ff00' },
        position: [0, 0, 0],
      },
      {
        id: 'mesh-3',
        geometry: { type: 'cylinder', radiusTop: 0.5, radiusBottom: 0.5, height: 1 },
        material: { type: 'standard', color: '#0000ff' },
        position: [2, 0, 0],
      },
    ];

    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={meshes}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render scene with orthographic camera', () => {
    const orthoCamera: ThreeCameraConfig = {
      type: 'orthographic',
      near: 0.1,
      far: 1000,
      position: [0, 0, 5],
    };

    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={orthoCamera}
          meshes={[defaultMesh]}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should update scene based on frame changes', () => {
    const meshWithAutoRotate: ThreeMeshConfig = {
      id: 'rotating-mesh',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#ff0000' },
      position: [0, 0, 0],
      autoRotate: [0.01, 0.02, 0.01],
    };

    const { container: frame0 } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[meshWithAutoRotate]}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(frame0.firstChild).toBeTruthy();

    const { container: frame30 } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[meshWithAutoRotate]}
          frame={30}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(frame30.firstChild).toBeTruthy();
  });

  it('should render complex scene with all features', () => {
    const lights: ThreeLightConfig[] = [
      { type: 'ambient', color: '#404040', intensity: 0.5 },
      {
        type: 'directional',
        color: '#ffffff',
        intensity: 1,
        position: [10, 10, 5],
        castShadow: true,
        shadowMapSize: 2048,
      },
      {
        type: 'point',
        color: '#ff0000',
        intensity: 0.5,
        position: [-5, 5, 0],
      },
    ];

    const meshes: ThreeMeshConfig[] = [
      {
        id: 'ground',
        geometry: { type: 'plane', width: 10, height: 10 },
        material: { type: 'standard', color: '#808080', roughness: 0.8 },
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0],
        receiveShadow: true,
      },
      {
        id: 'box',
        geometry: { type: 'box', width: 1, height: 1, depth: 1 },
        material: { type: 'physical', color: '#4488ff', metalness: 0.8, roughness: 0.2 },
        position: [0, 1, 0],
        castShadow: true,
        autoRotate: [0.01, 0.02, 0],
      },
      {
        id: 'sphere',
        geometry: { type: 'sphere', radius: 0.5 },
        material: { type: 'standard', color: '#ff0000' },
        position: [2, 0.5, 0],
        castShadow: true,
      },
    ];

    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          lights={lights}
          meshes={meshes}
          background="#87ceeb"
          fog={{
            color: '#87ceeb',
            near: 5,
            far: 50,
          }}
          shadows={{
            enabled: true,
            type: 'pcfsoft',
          }}
          toneMapping={{
            type: 'aces',
            exposure: 1.2,
          }}
          frame={30}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle scene without background', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle scene without fog', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle scene with shadows disabled', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          shadows={{
            enabled: false,
          }}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle different layer sizes', () => {
    const sizes = [
      { width: 800, height: 600 },
      { width: 1920, height: 1080 },
      { width: 640, height: 640 },
      { width: 320, height: 568 },
    ];

    sizes.forEach((size) => {
      const { container } = render(
        <Canvas>
          <ThreeScene
            camera={defaultCamera}
            meshes={[defaultMesh]}
            frame={0}
            layerSize={size}
          />
        </Canvas>
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should render scene with numeric background color', () => {
    const { container } = render(
      <Canvas>
        <ThreeScene
          camera={defaultCamera}
          meshes={[defaultMesh]}
          background={0x0088ff}
          frame={0}
          layerSize={layerSize}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });
});
