import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ImageLayer } from '../ImageLayer';
import type { ImageLayer as ImageLayerType } from '@rendervid/core';

describe('ImageLayer Component', () => {
  const baseLayer: ImageLayerType = {
    id: 'img-1',
    type: 'image',
    position: { x: 100, y: 200 },
    size: { width: 640, height: 480 },
    props: {
      src: 'https://example.com/image.png',
    },
  };

  it('should render an img element', () => {
    const { container } = render(
      <ImageLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/image.png');
  });

  it('should return null when src is missing', () => {
    const layer: ImageLayerType = {
      ...baseLayer,
      props: { src: '' },
    };

    const { container } = render(
      <ImageLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should apply position and size', () => {
    const { container } = render(
      <ImageLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.position).toBe('absolute');
    expect(el.style.left).toBe('100px');
    expect(el.style.top).toBe('200px');
    expect(el.style.width).toBe('640px');
    expect(el.style.height).toBe('480px');
  });

  it('should apply default fit of cover', () => {
    const { container } = render(
      <ImageLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.style.objectFit).toBe('cover');
  });

  it('should apply custom fit', () => {
    const layer: ImageLayerType = {
      ...baseLayer,
      props: {
        src: 'https://example.com/image.png',
        fit: 'contain',
      },
    };

    const { container } = render(
      <ImageLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.style.objectFit).toBe('contain');
  });

  it('should apply fill fit', () => {
    const layer: ImageLayerType = {
      ...baseLayer,
      props: {
        src: 'https://example.com/image.png',
        fit: 'fill',
      },
    };

    const { container } = render(
      <ImageLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.style.objectFit).toBe('fill');
  });

  it('should apply objectPosition', () => {
    const layer: ImageLayerType = {
      ...baseLayer,
      props: {
        src: 'https://example.com/image.png',
        objectPosition: 'top left',
      },
    };

    const { container } = render(
      <ImageLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.style.objectPosition).toBe('top left');
  });

  it('should apply opacity', () => {
    const layer: ImageLayerType = {
      ...baseLayer,
      opacity: 0.7,
    };

    const { container } = render(
      <ImageLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe('0.7');
  });

  it('should apply rotation', () => {
    const layer: ImageLayerType = {
      ...baseLayer,
      rotation: 45,
    };

    const { container } = render(
      <ImageLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.transform).toContain('rotate(45deg)');
  });

  it('should apply anchor point offset', () => {
    const layer: ImageLayerType = {
      ...baseLayer,
      anchor: { x: 0.5, y: 0.5 },
    };

    const { container } = render(
      <ImageLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    // left = 100 - 640 * 0.5 = -220
    expect(el.style.left).toBe('-220px');
    // top = 200 - 480 * 0.5 = -40
    expect(el.style.top).toBe('-40px');
  });

  it('should apply className', () => {
    const layer: ImageLayerType = {
      ...baseLayer,
      className: 'image-class',
    };

    const { container } = render(
      <ImageLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toBe('image-class');
  });

  it('should have overflow hidden', () => {
    const { container } = render(
      <ImageLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.overflow).toBe('hidden');
  });
});
