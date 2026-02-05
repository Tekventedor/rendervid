import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThreeLayer } from '../ThreeLayer';
import type { ThreeLayer as ThreeLayerType } from '@rendervid/core';

describe('ThreeLayer Component', () => {
  const mockLayer: ThreeLayerType = {
    id: 'test-layer',
    type: 'three',
    position: { x: 100, y: 100 },
    size: { width: 800, height: 600 },
    props: {
      camera: {
        type: 'perspective',
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [0, 0, 5],
      },
      meshes: [
        {
          id: 'cube',
          geometry: {
            type: 'box',
            width: 1,
            height: 1,
            depth: 1,
          },
          material: {
            type: 'standard',
            color: '#ff0000',
          },
          position: [0, 0, 0],
        },
      ],
    },
  };

  it('should render without errors', () => {
    const { container } = render(
      <ThreeLayer layer={mockLayer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should apply layer position and size', () => {
    const { container } = render(
      <ThreeLayer layer={mockLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.position).toBe('absolute');
    expect(element.style.left).toBe('100px');
    expect(element.style.top).toBe('100px');
    expect(element.style.width).toBe('800px');
    expect(element.style.height).toBe('600px');
  });

  it('should apply layer opacity', () => {
    const layerWithOpacity = {
      ...mockLayer,
      opacity: 0.5,
    };
    const { container } = render(
      <ThreeLayer layer={layerWithOpacity} frame={0} fps={30} sceneDuration={100} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.opacity).toBe('0.5');
  });

  it('should apply layer rotation', () => {
    const layerWithRotation = {
      ...mockLayer,
      rotation: 45,
    };
    const { container } = render(
      <ThreeLayer layer={layerWithRotation} frame={0} fps={30} sceneDuration={100} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.transform).toContain('rotate(45deg)');
  });

  it('should apply anchor point correctly', () => {
    const layerWithAnchor = {
      ...mockLayer,
      anchor: { x: 0.5, y: 0.5 }, // Center anchor
    };
    const { container } = render(
      <ThreeLayer layer={layerWithAnchor} frame={0} fps={30} sceneDuration={100} />
    );
    const element = container.firstChild as HTMLElement;
    // With center anchor, position should be adjusted
    // left = x - width * 0.5 = 100 - 800 * 0.5 = -300
    expect(element.style.left).toBe('-300px');
    // top = y - height * 0.5 = 100 - 600 * 0.5 = -200
    expect(element.style.top).toBe('-200px');
  });

  it('should render with custom className', () => {
    const layerWithClassName = {
      ...mockLayer,
      className: 'custom-layer-class',
    };
    const { container } = render(
      <ThreeLayer layer={layerWithClassName} frame={0} fps={30} sceneDuration={100} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.classList.contains('custom-layer-class')).toBe(true);
  });

  it('should render with multiple meshes', () => {
    const layerWithMultipleMeshes: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        meshes: [
          {
            id: 'cube1',
            geometry: { type: 'box' },
            material: { type: 'standard', color: '#ff0000' },
            position: [0, 0, 0],
          },
          {
            id: 'cube2',
            geometry: { type: 'box' },
            material: { type: 'standard', color: '#00ff00' },
            position: [2, 0, 0],
          },
          {
            id: 'sphere',
            geometry: { type: 'sphere', radius: 0.5 },
            material: { type: 'standard', color: '#0000ff' },
            position: [-2, 0, 0],
          },
        ],
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithMultipleMeshes} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with lights', () => {
    const layerWithLights: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        lights: [
          { type: 'ambient', color: '#ffffff', intensity: 0.5 },
          { type: 'directional', color: '#ffffff', intensity: 1, position: [10, 10, 5] },
        ],
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithLights} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with orthographic camera', () => {
    const layerWithOrthoCamera: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        camera: {
          type: 'orthographic',
          near: 0.1,
          far: 1000,
          position: [0, 0, 5],
        },
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithOrthoCamera} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with background color', () => {
    const layerWithBackground: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        background: '#0088ff',
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithBackground} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with fog', () => {
    const layerWithFog: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        fog: {
          color: '#ffffff',
          near: 1,
          far: 100,
        },
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithFog} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should enable shadows when configured', () => {
    const layerWithShadows: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        shadows: {
          enabled: true,
          type: 'pcfsoft',
        },
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithShadows} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should apply tone mapping', () => {
    const layerWithToneMapping: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        toneMapping: {
          type: 'aces',
          exposure: 1.5,
        },
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithToneMapping} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should disable antialias when specified', () => {
    const layerNoAntialias: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        antialias: false,
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerNoAntialias} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle layer animations', () => {
    const layerWithAnimation = {
      ...mockLayer,
      animation: {
        type: 'fadeIn' as const,
        startFrame: 0,
        endFrame: 30,
      },
    };

    const { container: containerStart } = render(
      <ThreeLayer layer={layerWithAnimation} frame={0} fps={30} sceneDuration={100} />
    );
    expect(containerStart.firstChild).toBeTruthy();

    const { container: containerMid } = render(
      <ThreeLayer layer={layerWithAnimation} frame={15} fps={30} sceneDuration={100} />
    );
    expect(containerMid.firstChild).toBeTruthy();

    const { container: containerEnd } = render(
      <ThreeLayer layer={layerWithAnimation} frame={30} fps={30} sceneDuration={100} />
    );
    expect(containerEnd.firstChild).toBeTruthy();
  });

  it('should render all geometry types without errors', () => {
    const geometryTypes = [
      { type: 'box' as const },
      { type: 'sphere' as const, radius: 1 },
      { type: 'cylinder' as const, radiusTop: 1, radiusBottom: 1, height: 2 },
      { type: 'cone' as const, radius: 1, height: 2 },
      { type: 'torus' as const, radius: 1, tube: 0.4 },
      { type: 'plane' as const, width: 2, height: 2 },
    ];

    geometryTypes.forEach((geometry) => {
      const layerWithGeometry: ThreeLayerType = {
        ...mockLayer,
        props: {
          ...mockLayer.props,
          meshes: [
            {
              id: `mesh-${geometry.type}`,
              geometry,
              material: { type: 'standard', color: '#ff0000' },
              position: [0, 0, 0],
            },
          ],
        },
      };

      const { container } = render(
        <ThreeLayer layer={layerWithGeometry} frame={0} fps={30} sceneDuration={100} />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should render all material types without errors', () => {
    const materialTypes = [
      { type: 'standard' as const, color: '#ff0000' },
      { type: 'basic' as const, color: '#00ff00' },
      { type: 'phong' as const, color: '#0000ff' },
      { type: 'physical' as const, color: '#ffff00' },
      { type: 'normal' as const },
    ];

    materialTypes.forEach((material) => {
      const layerWithMaterial: ThreeLayerType = {
        ...mockLayer,
        props: {
          ...mockLayer.props,
          meshes: [
            {
              id: `mesh-${material.type}`,
              geometry: { type: 'box' },
              material,
              position: [0, 0, 0],
            },
          ],
        },
      };

      const { container } = render(
        <ThreeLayer layer={layerWithMaterial} frame={0} fps={30} sceneDuration={100} />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should render all light types without errors', () => {
    const lightConfigs = [
      [{ type: 'ambient' as const, color: '#ffffff', intensity: 0.5 }],
      [{ type: 'directional' as const, color: '#ffffff', intensity: 1, position: [10, 10, 5] as [number, number, number] }],
      [{ type: 'point' as const, color: '#ffffff', intensity: 1, position: [0, 5, 0] as [number, number, number] }],
      [{ type: 'spot' as const, color: '#ffffff', intensity: 1, position: [0, 10, 0] as [number, number, number] }],
      [{ type: 'hemisphere' as const, color: '#ffffff', groundColor: '#444444', intensity: 1 }],
    ];

    lightConfigs.forEach((lights) => {
      const layerWithLight: ThreeLayerType = {
        ...mockLayer,
        props: {
          ...mockLayer.props,
          lights,
        },
      };

      const { container } = render(
        <ThreeLayer layer={layerWithLight} frame={0} fps={30} sceneDuration={100} />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should handle mesh with auto-rotation', () => {
    const layerWithAutoRotation: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        meshes: [
          {
            id: 'rotating-cube',
            geometry: { type: 'box' },
            material: { type: 'standard', color: '#ff0000' },
            position: [0, 0, 0],
            autoRotate: [0.01, 0.02, 0.01],
          },
        ],
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithAutoRotation} frame={30} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle mesh with shadows', () => {
    const layerWithMeshShadows: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        shadows: {
          enabled: true,
        },
        meshes: [
          {
            id: 'shadow-caster',
            geometry: { type: 'box' },
            material: { type: 'standard', color: '#ff0000' },
            position: [0, 1, 0],
            castShadow: true,
          },
          {
            id: 'shadow-receiver',
            geometry: { type: 'plane', width: 10, height: 10 },
            material: { type: 'standard', color: '#808080' },
            position: [0, 0, 0],
            rotation: [-Math.PI / 2, 0, 0],
            receiveShadow: true,
          },
        ],
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithMeshShadows} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle mesh visibility', () => {
    const layerWithInvisibleMesh: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        meshes: [
          {
            id: 'visible-cube',
            geometry: { type: 'box' },
            material: { type: 'standard', color: '#ff0000' },
            position: [0, 0, 0],
            visible: true,
          },
          {
            id: 'invisible-cube',
            geometry: { type: 'box' },
            material: { type: 'standard', color: '#00ff00' },
            position: [2, 0, 0],
            visible: false,
          },
        ],
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithInvisibleMesh} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle mesh scale', () => {
    const layerWithScaledMesh: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        meshes: [
          {
            id: 'scaled-cube',
            geometry: { type: 'box' },
            material: { type: 'standard', color: '#ff0000' },
            position: [0, 0, 0],
            scale: [2, 0.5, 1],
          },
        ],
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithScaledMesh} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle mesh render order', () => {
    const layerWithRenderOrder: ThreeLayerType = {
      ...mockLayer,
      props: {
        ...mockLayer.props,
        meshes: [
          {
            id: 'back-mesh',
            geometry: { type: 'box' },
            material: { type: 'standard', color: '#ff0000' },
            position: [0, 0, 0],
            renderOrder: 1,
          },
          {
            id: 'front-mesh',
            geometry: { type: 'box' },
            material: { type: 'standard', color: '#00ff00' },
            position: [0, 0, 1],
            renderOrder: 2,
          },
        ],
      },
    };

    const { container } = render(
      <ThreeLayer layer={layerWithRenderOrder} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
  });
});
