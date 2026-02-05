import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Lights } from '../Lights';
import type { ThreeLightConfig } from '@rendervid/core';

describe('Lights Component', () => {
  it('should render without lights', () => {
    const { container } = render(
      <Canvas>
        <Lights lights={[]} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render ambient light', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'ambient',
        color: '#ffffff',
        intensity: 0.5,
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render directional light', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'directional',
        color: '#ffffff',
        intensity: 1,
        position: [10, 10, 5],
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render directional light with shadow', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'directional',
        color: '#ffffff',
        intensity: 1,
        position: [10, 10, 5],
        castShadow: true,
        shadowMapSize: 2048,
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render directional light with target', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'directional',
        color: '#ffffff',
        intensity: 1,
        position: [10, 10, 5],
        target: [0, 0, 0],
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render point light', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'point',
        color: '#ff0000',
        intensity: 1,
        position: [0, 5, 0],
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render point light with distance and decay', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'point',
        color: '#00ff00',
        intensity: 1,
        position: [0, 5, 0],
        distance: 10,
        decay: 1,
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render point light with shadow', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'point',
        color: '#0000ff',
        intensity: 1,
        position: [0, 5, 0],
        castShadow: true,
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render spot light', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'spot',
        color: '#ffffff',
        intensity: 1,
        position: [0, 10, 0],
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render spot light with angle and penumbra', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'spot',
        color: '#ffff00',
        intensity: 1,
        position: [0, 10, 0],
        angle: Math.PI / 4,
        penumbra: 0.5,
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render spot light with target', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'spot',
        color: '#ff00ff',
        intensity: 1,
        position: [0, 10, 0],
        target: [0, 0, 0],
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render spot light with shadow', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'spot',
        color: '#00ffff',
        intensity: 1,
        position: [0, 10, 0],
        castShadow: true,
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render hemisphere light', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'hemisphere',
        color: '#ffffff',
        groundColor: '#444444',
        intensity: 0.6,
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render hemisphere light with position', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'hemisphere',
        color: '#87ceeb',
        groundColor: '#654321',
        intensity: 1,
        position: [0, 10, 0],
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render multiple lights', () => {
    const lights: ThreeLightConfig[] = [
      {
        type: 'ambient',
        color: '#ffffff',
        intensity: 0.3,
      },
      {
        type: 'directional',
        color: '#ffffff',
        intensity: 0.8,
        position: [10, 10, 5],
      },
      {
        type: 'point',
        color: '#ff0000',
        intensity: 0.5,
        position: [-5, 5, 0],
      },
      {
        type: 'hemisphere',
        color: '#87ceeb',
        groundColor: '#654321',
        intensity: 0.5,
      },
    ];

    const { container } = render(
      <Canvas>
        <Lights lights={lights} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle different light intensities', () => {
    const intensities = [0, 0.5, 1, 2, 5];

    intensities.forEach((intensity) => {
      const lights: ThreeLightConfig[] = [
        {
          type: 'directional',
          color: '#ffffff',
          intensity,
          position: [10, 10, 5],
        },
      ];

      const { container } = render(
        <Canvas>
          <Lights lights={lights} />
        </Canvas>
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should handle different light colors', () => {
    const colors = ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];

    colors.forEach((color) => {
      const lights: ThreeLightConfig[] = [
        {
          type: 'directional',
          color,
          intensity: 1,
          position: [10, 10, 5],
        },
      ];

      const { container } = render(
        <Canvas>
          <Lights lights={lights} />
        </Canvas>
      );
      expect(container.firstChild).toBeTruthy();
    });
  });
});
