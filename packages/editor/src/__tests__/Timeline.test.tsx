import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../components/Timeline/Timeline';

const defaultProps = {
  totalFrames: 300,
  fps: 30,
  currentFrame: 0,
  onFrameChange: () => {},
  scenes: [
    {
      id: 'scene-1',
      name: 'Scene 1',
      startFrame: 0,
      endFrame: 150,
      layers: [
        { id: 'layer-1', type: 'text', props: { text: 'Hello' } },
      ],
    },
  ],
  selectedSceneId: null,
  selectedLayerId: null,
  onSelectScene: () => {},
  onSelectLayer: () => {},
  onUpdateLayer: () => {},
  onDeleteLayer: () => {},
  onDuplicateLayer: () => {},
  onDeleteScene: () => {},
  onAddLayer: () => {},
  onAddScene: () => {},
  onReorderLayers: () => {},
  onMoveLayerToScene: () => {},
};

describe('Editor Timeline', () => {
  it('should be exported from the package', () => {
    expect(typeof Timeline).toBe('function');
  });

  it('should render without crashing', () => {
    const { container } = render(<Timeline {...defaultProps} />);
    expect(container.querySelector('.rendervid-timeline')).toBeTruthy();
  });

  it('should display time information', () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.getByText(/300 frames @ 30fps/)).toBeTruthy();
  });

  it('should display formatted time', () => {
    render(<Timeline {...defaultProps} currentFrame={150} />);
    // 150 frames at 30fps = 5 seconds -> 00:05
    expect(screen.getByText(/00:05/)).toBeTruthy();
  });

  it('should show zoom controls when onZoomChange is provided', () => {
    render(<Timeline {...defaultProps} zoom={1} onZoomChange={() => {}} />);
    expect(screen.getByText('1.0x')).toBeTruthy();
  });

  it('should not show zoom controls when onZoomChange is not provided', () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.queryByText('1.0x')).toBeNull();
  });

  it('should render Add Scene button', () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.getByText('+ Add Scene')).toBeTruthy();
  });

  it('should render Add Layer button', () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.getByText(/Add Layer/)).toBeTruthy();
  });

  it('should render scene labels', () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.getAllByText('Scene 1').length).toBeGreaterThan(0);
  });

  it('should render layer type labels', () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.getAllByText('text').length).toBeGreaterThan(0);
  });
});
