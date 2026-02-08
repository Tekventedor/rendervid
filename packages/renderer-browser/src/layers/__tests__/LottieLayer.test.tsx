import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { LottieLayer } from '../LottieLayer';
import type { LottieLayer as LottieLayerType } from '@rendervid/core';

describe('LottieLayer Component', () => {
  const baseLayer: LottieLayerType = {
    id: 'lottie-1',
    type: 'lottie',
    position: { x: 50, y: 50 },
    size: { width: 300, height: 300 },
    props: {
      data: { v: '5.5.7', fr: 30, ip: 0, op: 60, w: 300, h: 300, layers: [] },
    },
  };

  it('should render a container element', () => {
    const { container } = render(
      <LottieLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
  });

  it('should apply position and size', () => {
    const { container } = render(
      <LottieLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.position).toBe('absolute');
    expect(el.style.left).toBe('50px');
    expect(el.style.top).toBe('50px');
    expect(el.style.width).toBe('300px');
    expect(el.style.height).toBe('300px');
  });

  it('should apply opacity', () => {
    const layer: LottieLayerType = {
      ...baseLayer,
      opacity: 0.6,
    };

    const { container } = render(
      <LottieLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe('0.6');
  });

  it('should apply rotation', () => {
    const layer: LottieLayerType = {
      ...baseLayer,
      rotation: 90,
    };

    const { container } = render(
      <LottieLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.transform).toContain('rotate(90deg)');
  });

  it('should apply className', () => {
    const layer: LottieLayerType = {
      ...baseLayer,
      className: 'lottie-class',
    };

    const { container } = render(
      <LottieLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toBe('lottie-class');
  });

  it('should contain an inner div for lottie container', () => {
    const { container } = render(
      <LottieLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    // The outer div has position styles, the inner div is the lottie container
    const allDivs = container.querySelectorAll('div');
    const innerDiv = allDivs[allDivs.length - 1] as HTMLElement;
    expect(innerDiv).toBeTruthy();
    expect(innerDiv.style.width).toBe('100%');
    expect(innerDiv.style.height).toBe('100%');
  });
});
