import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LayerPanel } from '../components/LayerPanel/LayerPanel';

const mockLayers = [
  {
    id: 'layer-1',
    type: 'text',
    position: { x: 0, y: 0 },
    size: { width: 200, height: 100 },
    props: { text: 'Hello' },
  },
  {
    id: 'layer-2',
    type: 'shape',
    position: { x: 100, y: 100 },
    size: { width: 300, height: 200 },
    props: { shape: 'rectangle' },
  },
];

function renderLayerPanel(overrides = {}) {
  const defaultProps = {
    sceneId: 'scene-1',
    layers: mockLayers,
    selectedLayerId: null as string | null,
    onSelectLayer: vi.fn(),
    onAddLayer: vi.fn(),
    onDeleteLayer: vi.fn(),
    onReorderLayers: vi.fn(),
    onDuplicateLayer: vi.fn(),
    ...overrides,
  };
  return { ...render(<LayerPanel {...defaultProps} />), props: defaultProps };
}

describe('LayerPanel', () => {
  it('should be exported from the package', () => {
    expect(typeof LayerPanel).toBe('function');
  });

  it('should render without crashing', () => {
    const { container } = renderLayerPanel();
    expect(container.querySelector('.rendervid-layer-panel')).toBeTruthy();
  });

  it('should display Layers heading', () => {
    renderLayerPanel();
    expect(screen.getByText('Layers')).toBeTruthy();
  });

  it('should display layer list', () => {
    renderLayerPanel();
    expect(screen.getByText('layer-1')).toBeTruthy();
    expect(screen.getByText('layer-2')).toBeTruthy();
  });

  it('should display layer types', () => {
    renderLayerPanel();
    expect(screen.getByText('text')).toBeTruthy();
    expect(screen.getByText('shape')).toBeTruthy();
  });

  it('should display empty state when no layers', () => {
    renderLayerPanel({ layers: [] });
    expect(screen.getByText('No layers. Add a layer to get started.')).toBeTruthy();
  });

  it('should call onSelectLayer when layer is clicked', () => {
    const { props } = renderLayerPanel();
    fireEvent.click(screen.getByText('layer-1'));
    expect(props.onSelectLayer).toHaveBeenCalledWith('layer-1');
  });

  it('should display add layer buttons', () => {
    renderLayerPanel();
    expect(screen.getByTitle('Add Text')).toBeTruthy();
    expect(screen.getByTitle('Add Shape')).toBeTruthy();
    expect(screen.getByTitle('Add Image')).toBeTruthy();
    expect(screen.getByTitle('Add Video')).toBeTruthy();
  });

  it('should call onAddLayer when add button is clicked', () => {
    const { props } = renderLayerPanel();
    fireEvent.click(screen.getByTitle('Add Text'));
    expect(props.onAddLayer).toHaveBeenCalledWith('text');
  });

  it('should call onDeleteLayer when delete button is clicked', () => {
    const { props } = renderLayerPanel();
    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(props.onDeleteLayer).toHaveBeenCalledWith('layer-1');
  });

  it('should call onDuplicateLayer when duplicate button is clicked', () => {
    const { props } = renderLayerPanel();
    const duplicateButtons = screen.getAllByTitle('Duplicate');
    fireEvent.click(duplicateButtons[0]);
    expect(props.onDuplicateLayer).toHaveBeenCalledWith('layer-1');
  });
});
