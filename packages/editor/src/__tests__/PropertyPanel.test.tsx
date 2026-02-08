import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyPanel } from '../components/PropertyPanel/PropertyPanel';

describe('PropertyPanel', () => {
  it('should be exported from the package', () => {
    expect(typeof PropertyPanel).toBe('function');
  });

  it('should show empty state when no layer selected', () => {
    render(<PropertyPanel selectedLayer={null} onUpdateLayer={vi.fn()} />);
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
    render(<PropertyPanel selectedLayer={layer} onUpdateLayer={vi.fn()} />);
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
    render(<PropertyPanel selectedLayer={layer} onUpdateLayer={vi.fn()} />);
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
    render(<PropertyPanel selectedLayer={layer} onUpdateLayer={vi.fn()} />);
    expect(screen.getByText('Transform')).toBeTruthy();
    expect(screen.getByText('Position X')).toBeTruthy();
    expect(screen.getByText('Position Y')).toBeTruthy();
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
    render(<PropertyPanel selectedLayer={layer} onUpdateLayer={vi.fn()} />);
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
    render(<PropertyPanel selectedLayer={layer} onUpdateLayer={vi.fn()} />);
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
    render(<PropertyPanel selectedLayer={layer} onUpdateLayer={vi.fn()} />);
    expect(screen.getByText('Source URL')).toBeTruthy();
    expect(screen.getByText('Object Fit')).toBeTruthy();
  });

  it('should show appearance section', () => {
    const layer = {
      id: 'layer-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
      props: { text: 'Hello' },
      opacity: 0.8,
    };
    render(<PropertyPanel selectedLayer={layer} onUpdateLayer={vi.fn()} />);
    expect(screen.getByText('Appearance')).toBeTruthy();
    expect(screen.getByText('Opacity')).toBeTruthy();
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
    render(<PropertyPanel selectedLayer={layer} onUpdateLayer={onUpdateLayer} />);

    const posXInput = screen.getByDisplayValue('50');
    fireEvent.change(posXInput, { target: { value: '75' } });
    expect(onUpdateLayer).toHaveBeenCalledWith({
      position: { x: 75, y: 100 },
    });
  });
});
