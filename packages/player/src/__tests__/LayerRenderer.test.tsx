import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayerRenderer } from '../components/LayerRenderer';
import type { Layer, Scene } from '@rendervid/core';

function createMockScene(): Scene {
  return {
    id: 'scene-1',
    startFrame: 0,
    endFrame: 300,
    layers: [],
  };
}

function createMockLayer(overrides: Partial<Layer> = {}): Layer {
  return {
    id: 'layer-1',
    type: 'text',
    position: { x: 0, y: 0 },
    size: { width: 200, height: 100 },
    props: { text: 'Hello World' },
    ...overrides,
  } as Layer;
}

describe('LayerRenderer', () => {
  it('should be exported from the package', () => {
    expect(typeof LayerRenderer).toBe('function');
  });

  it('should render a text layer', () => {
    const layer = createMockLayer({
      type: 'text',
      props: { text: 'Test Text' },
    });
    render(<LayerRenderer layer={layer} frame={0} scene={createMockScene()} />);
    expect(screen.getByText('Test Text')).toBeTruthy();
  });

  it('should render an image layer', () => {
    const layer = createMockLayer({
      type: 'image',
      props: { src: 'test.png', alt: 'Test image' },
    });
    const { container } = render(
      <LayerRenderer layer={layer} frame={0} scene={createMockScene()} />
    );
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('test.png');
  });

  it('should render a shape layer', () => {
    const layer = createMockLayer({
      type: 'shape',
      props: { shape: 'rectangle', fill: '#ff0000' },
    });
    const { container } = render(
      <LayerRenderer layer={layer} frame={0} scene={createMockScene()} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render a video layer placeholder', () => {
    const layer = createMockLayer({
      type: 'video',
      props: { src: '/path/to/video.mp4' },
    });
    render(<LayerRenderer layer={layer} frame={0} scene={createMockScene()} />);
    expect(screen.getByText('Video: video.mp4')).toBeTruthy();
  });

  it('should return null for audio layers', () => {
    const layer = createMockLayer({
      type: 'audio',
      props: { src: 'audio.mp3' },
    });
    const { container } = render(
      <LayerRenderer layer={layer} frame={0} scene={createMockScene()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('should render a lottie layer placeholder', () => {
    const layer = createMockLayer({
      type: 'lottie',
      props: { data: '{}' },
    });
    render(<LayerRenderer layer={layer} frame={0} scene={createMockScene()} />);
    expect(screen.getByText('Lottie Animation')).toBeTruthy();
  });

  it('should render unknown layer type with error message', () => {
    const layer = createMockLayer({
      type: 'unknown-type' as any,
      props: {},
    });
    render(<LayerRenderer layer={layer} frame={0} scene={createMockScene()} />);
    expect(screen.getByText('Unknown layer type')).toBeTruthy();
  });

  it('should apply position styles', () => {
    const layer = createMockLayer({
      position: { x: 50, y: 100 },
    });
    const { container } = render(
      <LayerRenderer layer={layer} frame={0} scene={createMockScene()} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.left).toBe('50px');
    expect(el.style.top).toBe('100px');
  });

  it('should apply size styles', () => {
    const layer = createMockLayer({
      size: { width: 400, height: 300 },
    });
    const { container } = render(
      <LayerRenderer layer={layer} frame={0} scene={createMockScene()} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('400px');
    expect(el.style.height).toBe('300px');
  });

  it('should apply opacity when set', () => {
    const layer = createMockLayer({ opacity: 0.5 });
    const { container } = render(
      <LayerRenderer layer={layer} frame={0} scene={createMockScene()} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe('0.5');
  });

  it('should apply rotation when set', () => {
    const layer = createMockLayer({ rotation: 45 });
    const { container } = render(
      <LayerRenderer layer={layer} frame={0} scene={createMockScene()} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.transform).toContain('rotate(45deg)');
  });

  it('should use customRender when provided', () => {
    const layer = createMockLayer();
    const customRender = vi.fn().mockReturnValue(<span>Custom Content</span>);
    render(
      <LayerRenderer
        layer={layer}
        frame={0}
        scene={createMockScene()}
        customRender={customRender}
      />
    );
    expect(customRender).toHaveBeenCalledWith(layer, 0);
    expect(screen.getByText('Custom Content')).toBeTruthy();
  });

  it('should fall back to default rendering when customRender returns null', () => {
    const layer = createMockLayer({
      type: 'text',
      props: { text: 'Fallback Text' },
    });
    const customRender = vi.fn().mockReturnValue(null);
    render(
      <LayerRenderer
        layer={layer}
        frame={0}
        scene={createMockScene()}
        customRender={customRender}
      />
    );
    expect(screen.getByText('Fallback Text')).toBeTruthy();
  });
});
