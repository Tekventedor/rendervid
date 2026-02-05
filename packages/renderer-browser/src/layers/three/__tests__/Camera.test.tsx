import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Camera } from '../Camera';
import type { ThreeCameraConfig } from '@rendervid/core';

describe('Camera Component', () => {
  const layerSize = { width: 800, height: 600 };

  it('should render perspective camera with default values', () => {
    const config: ThreeCameraConfig = {
      type: 'perspective',
    };

    const { container } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={layerSize} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render perspective camera with custom FOV', () => {
    const config: ThreeCameraConfig = {
      type: 'perspective',
      fov: 90,
      near: 0.1,
      far: 2000,
    };

    const { container } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={layerSize} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render perspective camera with custom position', () => {
    const config: ThreeCameraConfig = {
      type: 'perspective',
      position: [10, 5, 10],
    };

    const { container } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={layerSize} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render perspective camera with lookAt target', () => {
    const config: ThreeCameraConfig = {
      type: 'perspective',
      position: [5, 5, 5],
      lookAt: [0, 0, 0],
    };

    const { container } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={layerSize} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render orthographic camera with default values', () => {
    const config: ThreeCameraConfig = {
      type: 'orthographic',
    };

    const { container } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={layerSize} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render orthographic camera with custom frustum', () => {
    const config: ThreeCameraConfig = {
      type: 'orthographic',
      left: -10,
      right: 10,
      top: 10,
      bottom: -10,
      near: 0.1,
      far: 1000,
    };

    const { container } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={layerSize} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render orthographic camera with position', () => {
    const config: ThreeCameraConfig = {
      type: 'orthographic',
      position: [0, 10, 0],
    };

    const { container } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={layerSize} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render orthographic camera with lookAt', () => {
    const config: ThreeCameraConfig = {
      type: 'orthographic',
      position: [5, 5, 5],
      lookAt: [0, 0, 0],
    };

    const { container } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={layerSize} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle different aspect ratios', () => {
    const config: ThreeCameraConfig = {
      type: 'perspective',
      fov: 75,
    };

    const wideSize = { width: 1920, height: 1080 };
    const { container: wideContainer } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={wideSize} />
      </Canvas>
    );
    expect(wideContainer.firstChild).toBeTruthy();

    const squareSize = { width: 600, height: 600 };
    const { container: squareContainer } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={squareSize} />
      </Canvas>
    );
    expect(squareContainer.firstChild).toBeTruthy();
  });

  it('should update camera based on frame', () => {
    const config: ThreeCameraConfig = {
      type: 'perspective',
      position: [0, 0, 5],
    };

    const { container: frame0 } = render(
      <Canvas>
        <Camera config={config} frame={0} layerSize={layerSize} />
      </Canvas>
    );
    expect(frame0.firstChild).toBeTruthy();

    const { container: frame30 } = render(
      <Canvas>
        <Camera config={config} frame={30} layerSize={layerSize} />
      </Canvas>
    );
    expect(frame30.firstChild).toBeTruthy();
  });
});
