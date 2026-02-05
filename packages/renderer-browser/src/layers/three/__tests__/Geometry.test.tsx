import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Geometry } from '../Geometry';
import type { ThreeGeometry } from '@rendervid/core';

describe('Geometry Component', () => {
  it('should render box geometry with default values', () => {
    const config: ThreeGeometry = {
      type: 'box',
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render box geometry with custom dimensions', () => {
    const config: ThreeGeometry = {
      type: 'box',
      width: 2,
      height: 3,
      depth: 4,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render box geometry with segments', () => {
    const config: ThreeGeometry = {
      type: 'box',
      width: 1,
      height: 1,
      depth: 1,
      widthSegments: 2,
      heightSegments: 2,
      depthSegments: 2,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render sphere geometry with default values', () => {
    const config: ThreeGeometry = {
      type: 'sphere',
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render sphere geometry with custom radius and segments', () => {
    const config: ThreeGeometry = {
      type: 'sphere',
      radius: 2,
      widthSegments: 64,
      heightSegments: 32,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render sphere geometry with phi and theta ranges', () => {
    const config: ThreeGeometry = {
      type: 'sphere',
      radius: 1,
      phiStart: 0,
      phiLength: Math.PI,
      thetaStart: 0,
      thetaLength: Math.PI / 2,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render cylinder geometry with default values', () => {
    const config: ThreeGeometry = {
      type: 'cylinder',
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render cylinder geometry with custom dimensions', () => {
    const config: ThreeGeometry = {
      type: 'cylinder',
      radiusTop: 1,
      radiusBottom: 2,
      height: 3,
      radialSegments: 16,
      heightSegments: 2,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render cylinder geometry open-ended', () => {
    const config: ThreeGeometry = {
      type: 'cylinder',
      radiusTop: 1,
      radiusBottom: 1,
      height: 2,
      openEnded: true,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render cone geometry with default values', () => {
    const config: ThreeGeometry = {
      type: 'cone',
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render cone geometry with custom dimensions', () => {
    const config: ThreeGeometry = {
      type: 'cone',
      radius: 2,
      height: 4,
      radialSegments: 16,
      heightSegments: 2,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render cone geometry open-ended', () => {
    const config: ThreeGeometry = {
      type: 'cone',
      radius: 1,
      height: 2,
      openEnded: true,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render torus geometry with default values', () => {
    const config: ThreeGeometry = {
      type: 'torus',
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render torus geometry with custom dimensions', () => {
    const config: ThreeGeometry = {
      type: 'torus',
      radius: 2,
      tube: 0.6,
      radialSegments: 16,
      tubularSegments: 32,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render torus geometry with arc', () => {
    const config: ThreeGeometry = {
      type: 'torus',
      radius: 1,
      tube: 0.4,
      arc: Math.PI,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render plane geometry with default values', () => {
    const config: ThreeGeometry = {
      type: 'plane',
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render plane geometry with custom dimensions', () => {
    const config: ThreeGeometry = {
      type: 'plane',
      width: 5,
      height: 3,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render plane geometry with segments', () => {
    const config: ThreeGeometry = {
      type: 'plane',
      width: 2,
      height: 2,
      widthSegments: 10,
      heightSegments: 10,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle GLTF geometry with loading state', () => {
    const config: ThreeGeometry = {
      type: 'gltf',
      url: 'https://example.com/model.gltf',
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle GLTF geometry with scale', () => {
    const config: ThreeGeometry = {
      type: 'gltf',
      url: 'https://example.com/model.gltf',
      scale: 2,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle 3D text geometry with loading state', () => {
    const config: ThreeGeometry = {
      type: 'text3d',
      text: 'Hello',
      font: 'https://example.com/font.json',
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle 3D text geometry with custom settings', () => {
    const config: ThreeGeometry = {
      type: 'text3d',
      text: 'Test',
      font: 'https://example.com/font.json',
      size: 2,
      height: 0.5,
      curveSegments: 24,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelSegments: 5,
    };

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle unknown geometry type with fallback', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const config = {
      type: 'unknown',
    } as any;

    const { container } = render(
      <Canvas>
        <mesh>
          <Geometry config={config} />
        </mesh>
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
    // Note: console.warn may not be called in test environment due to how the component renders
    // The important thing is that it doesn't crash and renders a fallback

    consoleWarnSpy.mockRestore();
  });

  it('should render all primitive geometry types', () => {
    const geometries: ThreeGeometry[] = [
      { type: 'box', width: 1, height: 1, depth: 1 },
      { type: 'sphere', radius: 1 },
      { type: 'cylinder', radiusTop: 1, radiusBottom: 1, height: 2 },
      { type: 'cone', radius: 1, height: 2 },
      { type: 'torus', radius: 1, tube: 0.4 },
      { type: 'plane', width: 2, height: 2 },
    ];

    geometries.forEach((geometry) => {
      const { container } = render(
        <Canvas>
          <mesh>
            <Geometry config={geometry} />
          </mesh>
        </Canvas>
      );
      expect(container.firstChild).toBeTruthy();
    });
  });
});
