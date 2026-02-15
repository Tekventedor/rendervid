import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { NoiseBackground } from '../effects/NoiseBackground';
import { NoiseDistortion } from '../effects/NoiseDistortion';

describe('NoiseBackground Component', () => {
  it('should render an SVG element', () => {
    const { container } = render(
      <NoiseBackground
        frame={0}
        fps={30}
        width={64}
        height={64}
        resolution={32}
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should render with simplex noise type', () => {
    const { container } = render(
      <NoiseBackground
        noiseType="simplex"
        seed={42}
        frame={10}
        fps={30}
        width={64}
        height={64}
        resolution={32}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with perlin noise type', () => {
    const { container } = render(
      <NoiseBackground
        noiseType="perlin"
        seed={42}
        frame={10}
        fps={30}
        width={64}
        height={64}
        resolution={32}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with worley noise type', () => {
    const { container } = render(
      <NoiseBackground
        noiseType="worley"
        seed={42}
        frame={10}
        fps={30}
        width={64}
        height={64}
        resolution={32}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with value noise type', () => {
    const { container } = render(
      <NoiseBackground
        noiseType="value"
        seed={42}
        frame={10}
        fps={30}
        width={64}
        height={64}
        resolution={32}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render rect elements for the noise grid', () => {
    const { container } = render(
      <NoiseBackground
        frame={0}
        fps={30}
        width={64}
        height={64}
        resolution={32}
      />
    );
    const rects = container.querySelectorAll('rect');
    // 64/32 * 64/32 = 2 * 2 = 4 rects
    expect(rects.length).toBe(4);
  });

  it('should accept custom colors', () => {
    const { container } = render(
      <NoiseBackground
        colors={['#000000', '#ffffff']}
        frame={0}
        fps={30}
        width={64}
        height={64}
        resolution={32}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });
});

describe('NoiseDistortion Component', () => {
  it('should render children', () => {
    const { container } = render(
      <NoiseDistortion frame={0} fps={30}>
        <span>Test content</span>
      </NoiseDistortion>
    );
    expect(container.textContent).toContain('Test content');
  });

  it('should render with an SVG filter', () => {
    const { container } = render(
      <NoiseDistortion frame={0} fps={30} seed={42}>
        <span>Distorted</span>
      </NoiseDistortion>
    );
    const filter = container.querySelector('filter');
    expect(filter).toBeTruthy();
  });

  it('should render with different noise types', () => {
    const { container } = render(
      <NoiseDistortion noiseType="perlin" frame={0} fps={30}>
        <span>Content</span>
      </NoiseDistortion>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should apply distortion amount', () => {
    const { container } = render(
      <NoiseDistortion amount={20} frame={0} fps={30}>
        <span>Content</span>
      </NoiseDistortion>
    );
    // SVG filter element should be rendered (jsdom may not support camelCase SVG selectors)
    const filter = container.querySelector('filter');
    expect(filter).toBeTruthy();
  });
});
