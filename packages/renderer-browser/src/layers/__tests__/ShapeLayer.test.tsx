import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ShapeLayer } from '../ShapeLayer';
import type { ShapeLayer as ShapeLayerType } from '@rendervid/core';

describe('ShapeLayer Component', () => {
  const baseLayer: ShapeLayerType = {
    id: 'shape-1',
    type: 'shape',
    position: { x: 100, y: 100 },
    size: { width: 200, height: 200 },
    props: {
      shape: 'rectangle',
      fill: '#ff0000',
    },
  };

  it('should render a rectangle', () => {
    const { container } = render(
      <ShapeLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    const rect = container.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect?.getAttribute('fill')).toBe('#ff0000');
  });

  it('should render an ellipse', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: { shape: 'ellipse', fill: '#00ff00' },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const ellipse = container.querySelector('ellipse');
    expect(ellipse).toBeTruthy();
    expect(ellipse?.getAttribute('fill')).toBe('#00ff00');
  });

  it('should render a polygon', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: { shape: 'polygon', fill: '#0000ff', sides: 6 },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const polygon = container.querySelector('polygon');
    expect(polygon).toBeTruthy();
    expect(polygon?.getAttribute('points')).toBeTruthy();
  });

  it('should render a star', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: { shape: 'star', fill: '#ffff00', points: 5, innerRadius: 0.4 },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const polygon = container.querySelector('polygon');
    expect(polygon).toBeTruthy();
  });

  it('should render a path', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: { shape: 'path', fill: '#000', pathData: 'M10 10 L100 100' },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const path = container.querySelector('path');
    expect(path).toBeTruthy();
    expect(path?.getAttribute('d')).toBe('M10 10 L100 100');
  });

  it('should apply stroke properties', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: {
        shape: 'rectangle',
        fill: '#ff0000',
        stroke: '#000000',
        strokeWidth: 3,
      },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const rect = container.querySelector('rect');
    expect(rect?.getAttribute('stroke')).toBe('#000000');
    expect(rect?.getAttribute('stroke-width')).toBe('3');
  });

  it('should apply stroke dash', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: {
        shape: 'rectangle',
        fill: '#ff0000',
        stroke: '#000',
        strokeWidth: 2,
        strokeDash: [5, 3],
      },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const rect = container.querySelector('rect');
    expect(rect?.getAttribute('stroke-dasharray')).toBe('5 3');
  });

  it('should apply border radius to rectangle', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: {
        shape: 'rectangle',
        fill: '#ff0000',
        borderRadius: 10,
      },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const rect = container.querySelector('rect');
    expect(rect?.getAttribute('rx')).toBe('10');
    expect(rect?.getAttribute('ry')).toBe('10');
  });

  it('should render with gradient fill', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: {
        shape: 'ellipse',
        gradient: {
          type: 'linear',
          angle: 90,
          colors: [
            { offset: 0, color: '#ff0000' },
            { offset: 1, color: '#0000ff' },
          ],
        },
      },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    // SVG gradient elements need namespace-aware queries
    const defs = container.querySelector('defs');
    expect(defs).toBeTruthy();
    // Check that the ellipse uses url(#gradient-...) fill
    const ellipse = container.querySelector('ellipse');
    expect(ellipse?.getAttribute('fill')).toContain('url(#gradient-');
  });

  it('should render with radial gradient', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: {
        shape: 'ellipse',
        gradient: {
          type: 'radial',
          colors: [
            { offset: 0, color: '#fff' },
            { offset: 1, color: '#000' },
          ],
        },
      },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const defs = container.querySelector('defs');
    expect(defs).toBeTruthy();
  });

  it('should apply position and size', () => {
    const { container } = render(
      <ShapeLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.position).toBe('absolute');
    expect(el.style.left).toBe('100px');
    expect(el.style.top).toBe('100px');
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('200px');
  });

  it('should apply opacity and rotation', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      opacity: 0.6,
      rotation: 30,
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe('0.6');
    expect(el.style.transform).toContain('rotate(30deg)');
  });

  it('should apply anchor point', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      anchor: { x: 0.5, y: 0.5 },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    // left = 100 - 200 * 0.5 = 0
    expect(el.style.left).toBe('0px');
    // top = 100 - 200 * 0.5 = 0
    expect(el.style.top).toBe('0px');
  });

  it('should set correct viewBox on SVG', () => {
    const { container } = render(
      <ShapeLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 200 200');
    expect(svg?.getAttribute('width')).toBe('200');
    expect(svg?.getAttribute('height')).toBe('200');
  });

  it('should return null for unknown shape', () => {
    const layer: ShapeLayerType = {
      ...baseLayer,
      props: { shape: 'unknown-shape' as any, fill: '#000' },
    };

    const { container } = render(
      <ShapeLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    // The wrapper div should still render, but the SVG should have no shape child
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.querySelector('rect')).toBeNull();
    expect(svg?.querySelector('ellipse')).toBeNull();
    expect(svg?.querySelector('polygon')).toBeNull();
    expect(svg?.querySelector('path')).toBeNull();
  });
});
