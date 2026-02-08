import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { CustomLayer } from '../CustomLayer';
import type { CustomLayer as CustomLayerType } from '@rendervid/core';

describe('CustomLayer Component', () => {
  const MockComponent = ({ message }: { message: string }) => (
    <div data-testid="custom">{message}</div>
  );

  const registry = new Map<string, React.ComponentType<any>>();
  registry.set('MockComponent', MockComponent);

  const baseLayer: CustomLayerType = {
    id: 'custom-1',
    type: 'custom',
    position: { x: 10, y: 20 },
    size: { width: 300, height: 200 },
    customComponent: {
      name: 'MockComponent',
      props: { message: 'Hello Custom' },
    },
    props: {},
  };

  it('should render custom component from registry', () => {
    const { container } = render(
      <CustomLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} registry={registry} />
    );
    expect(container.textContent).toContain('Hello Custom');
  });

  it('should return null when customComponent is not defined', () => {
    const layer: CustomLayerType = {
      ...baseLayer,
      customComponent: undefined as any,
    };

    const { container } = render(
      <CustomLayer layer={layer} frame={0} fps={30} sceneDuration={100} registry={registry} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should return null when component is not in registry', () => {
    const layer: CustomLayerType = {
      ...baseLayer,
      customComponent: {
        name: 'NonExistent',
        props: {},
      },
    };

    const { container } = render(
      <CustomLayer layer={layer} frame={0} fps={30} sceneDuration={100} registry={registry} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should return null when no registry is provided', () => {
    const { container } = render(
      <CustomLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should apply position and size', () => {
    const { container } = render(
      <CustomLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} registry={registry} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.position).toBe('absolute');
    expect(el.style.left).toBe('10px');
    expect(el.style.top).toBe('20px');
    expect(el.style.width).toBe('300px');
    expect(el.style.height).toBe('200px');
  });

  it('should apply opacity and rotation', () => {
    const layer: CustomLayerType = {
      ...baseLayer,
      opacity: 0.7,
      rotation: 20,
    };

    const { container } = render(
      <CustomLayer layer={layer} frame={0} fps={30} sceneDuration={100} registry={registry} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe('0.7');
    expect(el.style.transform).toContain('rotate(20deg)');
  });

  it('should apply anchor point', () => {
    const layer: CustomLayerType = {
      ...baseLayer,
      anchor: { x: 0.5, y: 0.5 },
    };

    const { container } = render(
      <CustomLayer layer={layer} frame={0} fps={30} sceneDuration={100} registry={registry} />
    );
    const el = container.firstChild as HTMLElement;
    // left = 10 - 300 * 0.5 = -140
    expect(el.style.left).toBe('-140px');
    // top = 20 - 200 * 0.5 = -80
    expect(el.style.top).toBe('-80px');
  });

  it('should pass frame props to custom component', () => {
    const FrameAwareComponent = ({ frame, fps }: { frame: number; fps: number }) => (
      <div data-testid="frame">{`${frame}/${fps}`}</div>
    );

    const reg = new Map<string, React.ComponentType<any>>();
    reg.set('FrameAware', FrameAwareComponent);

    const layer: CustomLayerType = {
      ...baseLayer,
      customComponent: {
        name: 'FrameAware',
        props: {},
      },
    };

    const { container } = render(
      <CustomLayer layer={layer} frame={15} fps={30} sceneDuration={100} registry={reg} />
    );
    expect(container.textContent).toContain('15/30');
  });

  it('should apply className', () => {
    const layer: CustomLayerType = {
      ...baseLayer,
      className: 'custom-cls',
    };

    const { container } = render(
      <CustomLayer layer={layer} frame={0} fps={30} sceneDuration={100} registry={registry} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toBe('custom-cls');
  });
});
