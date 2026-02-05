import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Mesh } from '../Mesh';
import type { ThreeMeshConfig } from '@rendervid/core';

describe('Mesh Component', () => {
  it('should render mesh with default values', () => {
    const config: ThreeMeshConfig = {
      id: 'test-mesh',
      geometry: {
        type: 'box',
      },
      material: {
        type: 'standard',
        color: '#ff0000',
      },
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render mesh with custom position', () => {
    const config: ThreeMeshConfig = {
      id: 'positioned-mesh',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#00ff00' },
      position: [2, 3, 4],
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render mesh with custom rotation', () => {
    const config: ThreeMeshConfig = {
      id: 'rotated-mesh',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#0000ff' },
      rotation: [Math.PI / 4, Math.PI / 2, 0],
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render mesh with custom scale', () => {
    const config: ThreeMeshConfig = {
      id: 'scaled-mesh',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#ffff00' },
      scale: [2, 0.5, 1.5],
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render mesh with shadow casting enabled', () => {
    const config: ThreeMeshConfig = {
      id: 'shadow-caster',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#ff00ff' },
      castShadow: true,
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render mesh with shadow receiving enabled', () => {
    const config: ThreeMeshConfig = {
      id: 'shadow-receiver',
      geometry: { type: 'plane', width: 10, height: 10 },
      material: { type: 'standard', color: '#808080' },
      receiveShadow: true,
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render mesh with visibility set to false', () => {
    const config: ThreeMeshConfig = {
      id: 'invisible-mesh',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#ff0000' },
      visible: false,
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render mesh with custom render order', () => {
    const config: ThreeMeshConfig = {
      id: 'ordered-mesh',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#00ffff' },
      renderOrder: 10,
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should apply auto-rotation based on frame', () => {
    const config: ThreeMeshConfig = {
      id: 'auto-rotating-mesh',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#ff8800' },
      rotation: [0, 0, 0],
      autoRotate: [0.01, 0.02, 0.01],
    };

    // Test at frame 0
    const { container: frame0 } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(frame0.firstChild).toBeTruthy();

    // Test at frame 30
    const { container: frame30 } = render(
      <Canvas>
        <Mesh config={config} frame={30} />
      </Canvas>
    );
    expect(frame30.firstChild).toBeTruthy();

    // Test at frame 60
    const { container: frame60 } = render(
      <Canvas>
        <Mesh config={config} frame={60} />
      </Canvas>
    );
    expect(frame60.firstChild).toBeTruthy();
  });

  it('should combine base rotation with auto-rotation', () => {
    const config: ThreeMeshConfig = {
      id: 'combined-rotation-mesh',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#4488ff' },
      rotation: [Math.PI / 4, 0, 0], // 45 degrees initial rotation
      autoRotate: [0, 0.01, 0], // Auto-rotate around Y axis
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={100} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render mesh with different geometry types', () => {
    const geometryTypes = [
      { type: 'box' as const },
      { type: 'sphere' as const, radius: 1 },
      { type: 'cylinder' as const, radiusTop: 1, radiusBottom: 1, height: 2 },
      { type: 'cone' as const, radius: 1, height: 2 },
      { type: 'torus' as const, radius: 1, tube: 0.4 },
      { type: 'plane' as const, width: 2, height: 2 },
    ];

    geometryTypes.forEach((geometry) => {
      const config: ThreeMeshConfig = {
        id: `mesh-${geometry.type}`,
        geometry,
        material: { type: 'standard', color: '#ff0000' },
      };

      const { container } = render(
        <Canvas>
          <Mesh config={config} frame={0} />
        </Canvas>
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should render mesh with different material types', () => {
    const materialTypes = [
      { type: 'standard' as const, color: '#ff0000' },
      { type: 'basic' as const, color: '#00ff00' },
      { type: 'phong' as const, color: '#0000ff' },
      { type: 'physical' as const, color: '#ffff00' },
      { type: 'normal' as const },
    ];

    materialTypes.forEach((material) => {
      const config: ThreeMeshConfig = {
        id: `mesh-${material.type}`,
        geometry: { type: 'box' },
        material,
      };

      const { container } = render(
        <Canvas>
          <Mesh config={config} frame={0} />
        </Canvas>
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should render multiple meshes together', () => {
    const configs: ThreeMeshConfig[] = [
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
        geometry: { type: 'cone', radius: 0.5, height: 1 },
        material: { type: 'standard', color: '#0000ff' },
        position: [2, 0, 0],
      },
    ];

    const { container } = render(
      <Canvas>
        {configs.map((config) => (
          <Mesh key={config.id} config={config} frame={0} />
        ))}
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle complex mesh configuration', () => {
    const config: ThreeMeshConfig = {
      id: 'complex-mesh',
      geometry: {
        type: 'torus',
        radius: 2,
        tube: 0.6,
        radialSegments: 32,
        tubularSegments: 64,
      },
      material: {
        type: 'physical',
        color: '#4488ff',
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      },
      position: [0, 2, 0],
      rotation: [Math.PI / 4, 0, Math.PI / 6],
      scale: [1.5, 1.5, 1.5],
      castShadow: true,
      receiveShadow: true,
      visible: true,
      renderOrder: 5,
      autoRotate: [0, 0.01, 0],
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={30} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle mesh with transparent material', () => {
    const config: ThreeMeshConfig = {
      id: 'transparent-mesh',
      geometry: { type: 'sphere', radius: 1 },
      material: {
        type: 'standard',
        color: '#0088ff',
        opacity: 0.5,
        transparent: true,
      },
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle mesh with wireframe material', () => {
    const config: ThreeMeshConfig = {
      id: 'wireframe-mesh',
      geometry: { type: 'sphere', radius: 1, widthSegments: 32, heightSegments: 16 },
      material: {
        type: 'standard',
        color: '#00ff00',
        wireframe: true,
      },
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should not apply auto-rotation when autoRotate is not set', () => {
    const config: ThreeMeshConfig = {
      id: 'static-mesh',
      geometry: { type: 'box' },
      material: { type: 'standard', color: '#ff0000' },
      rotation: [0, Math.PI / 4, 0],
    };

    const { container: frame0 } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(frame0.firstChild).toBeTruthy();

    const { container: frame30 } = render(
      <Canvas>
        <Mesh config={config} frame={30} />
      </Canvas>
    );
    expect(frame30.firstChild).toBeTruthy();
  });

  it('should handle all transform properties together', () => {
    const config: ThreeMeshConfig = {
      id: 'transformed-mesh',
      geometry: { type: 'box', width: 1, height: 2, depth: 0.5 },
      material: { type: 'standard', color: '#ff00ff' },
      position: [3, 2, 1],
      rotation: [0.5, 1, 1.5],
      scale: [1.5, 2, 0.5],
    };

    const { container } = render(
      <Canvas>
        <Mesh config={config} frame={0} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });
});
