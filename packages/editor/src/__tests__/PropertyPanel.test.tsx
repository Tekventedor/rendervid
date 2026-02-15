import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyPanel } from '../components/PropertyPanel/PropertyPanel';

const defaultTemplate = {
  name: 'Test',
  output: { type: 'video' as const, width: 1920, height: 1080, fps: 30 },
  inputs: [],
  composition: { scenes: [] },
};

function renderPropertyPanel(overrides: Record<string, any> = {}) {
  const defaultProps = {
    selectedLayer: null as any,
    onUpdateLayer: vi.fn(),
    template: defaultTemplate,
    onUpdateCustomComponentCode: vi.fn(),
    selectedScene: null as any,
    onUpdateScene: vi.fn(),
    ...overrides,
  };
  return { ...render(<PropertyPanel {...defaultProps} />), props: defaultProps };
}

describe('PropertyPanel', () => {
  it('should be exported from the package', () => {
    expect(typeof PropertyPanel).toBe('function');
  });

  it('should show empty state when no layer selected', () => {
    renderPropertyPanel();
    expect(screen.getByText('Select a layer to edit its properties')).toBeTruthy();
  });

  it('should show properties header when a layer is selected', () => {
    const layer = {
      id: 'layer-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
      props: { text: 'Hello' },
      opacity: 1,
    };
    renderPropertyPanel({ selectedLayer: layer });
    expect(screen.getByText('Properties')).toBeTruthy();
  });

  it('should display layer type and id', () => {
    const layer = {
      id: 'layer-1',
      type: 'text',
      position: { x: 50, y: 100 },
      size: { width: 200, height: 100 },
      props: { text: 'Hello' },
    };
    renderPropertyPanel({ selectedLayer: layer });
    expect(screen.getByText(/text/)).toBeTruthy();
    expect(screen.getByText(/layer-1/)).toBeTruthy();
  });

  it('should show transform fields', () => {
    const layer = {
      id: 'layer-1',
      type: 'text',
      position: { x: 50, y: 100 },
      size: { width: 200, height: 100 },
      props: { text: 'Hello' },
    };
    renderPropertyPanel({ selectedLayer: layer });
    expect(screen.getByText('Transform')).toBeTruthy();
    expect(screen.getByText('X')).toBeTruthy();
    expect(screen.getByText('Y')).toBeTruthy();
    expect(screen.getByText('Width')).toBeTruthy();
    expect(screen.getByText('Height')).toBeTruthy();
  });

  it('should show text-specific fields for text layers', () => {
    const layer = {
      id: 'layer-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
      props: { text: 'Hello', fontSize: 24, color: '#ffffff' },
    };
    renderPropertyPanel({ selectedLayer: layer });
    expect(screen.getByText('Content')).toBeTruthy();
    expect(screen.getByText('Font Size')).toBeTruthy();
  });

  it('should show shape-specific fields for shape layers', () => {
    const layer = {
      id: 'layer-1',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
      props: { shape: 'rectangle', fill: '#ff0000' },
    };
    renderPropertyPanel({ selectedLayer: layer });
    expect(screen.getByText('Fill Color')).toBeTruthy();
    expect(screen.getByText('Border Radius')).toBeTruthy();
  });

  it('should show image-specific fields for image layers', () => {
    const layer = {
      id: 'layer-1',
      type: 'image',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
      props: { src: 'image.png', fit: 'cover' },
    };
    renderPropertyPanel({ selectedLayer: layer });
    expect(screen.getByText('Source URL')).toBeTruthy();
    expect(screen.getByText('Object Fit')).toBeTruthy();
  });

  it('should show opacity field in transform section', () => {
    const layer = {
      id: 'layer-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
      props: { text: 'Hello' },
      opacity: 0.8,
    };
    renderPropertyPanel({ selectedLayer: layer });
    expect(screen.getByText('Opacity')).toBeTruthy();
    expect(screen.getByDisplayValue('0.8')).toBeTruthy();
  });

  it('should call onUpdateLayer when position changes', () => {
    const onUpdateLayer = vi.fn();
    const layer = {
      id: 'layer-1',
      type: 'text',
      position: { x: 50, y: 100 },
      size: { width: 200, height: 100 },
      props: { text: 'Hello' },
    };
    renderPropertyPanel({ selectedLayer: layer, onUpdateLayer });

    const posXInput = screen.getByDisplayValue('50');
    fireEvent.change(posXInput, { target: { value: '75' } });
    expect(onUpdateLayer).toHaveBeenCalledWith({
      position: { x: 75, y: 100 },
    });
  });
});
