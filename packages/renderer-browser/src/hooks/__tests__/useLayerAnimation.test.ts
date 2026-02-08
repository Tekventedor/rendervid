import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLayerAnimation } from '../useLayerAnimation';
import type { Layer } from '@rendervid/core';

describe('useLayerAnimation', () => {
  const baseLayer: Layer = {
    id: 'layer-1',
    type: 'text',
    position: { x: 0, y: 0 },
    size: { width: 200, height: 100 },
    props: { text: 'Test' },
  };

  it('should return empty style and properties when no animations', () => {
    const { result } = renderHook(() =>
      useLayerAnimation(baseLayer, 0, 30, 100)
    );

    expect(result.current.style).toEqual({});
    expect(result.current.properties).toEqual({});
  });

  it('should return empty style when animations array is empty', () => {
    const layer: Layer = {
      ...baseLayer,
      animations: [],
    };

    const { result } = renderHook(() =>
      useLayerAnimation(layer, 0, 30, 100)
    );

    expect(result.current.style).toEqual({});
    expect(result.current.properties).toEqual({});
  });

  it('should return style and properties objects', () => {
    // Even without meaningful animations, the hook should return the proper shape
    const { result } = renderHook(() =>
      useLayerAnimation(baseLayer, 15, 30, 100)
    );

    expect(result.current).toHaveProperty('style');
    expect(result.current).toHaveProperty('properties');
  });

  it('should update when frame changes', () => {
    const layer: Layer = {
      ...baseLayer,
      animations: [],
    };

    const { result, rerender } = renderHook(
      ({ frame }) => useLayerAnimation(layer, frame, 30, 100),
      { initialProps: { frame: 0 } }
    );

    expect(result.current.style).toEqual({});

    rerender({ frame: 30 });
    expect(result.current.style).toEqual({});
  });
});
