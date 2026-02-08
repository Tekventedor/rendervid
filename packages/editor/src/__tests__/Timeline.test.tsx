import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../components/Timeline/Timeline';

describe('Editor Timeline', () => {
  it('should be exported from the package', () => {
    expect(typeof Timeline).toBe('function');
  });

  it('should render without crashing', () => {
    const { container } = render(
      <Timeline
        totalFrames={300}
        fps={30}
        currentFrame={0}
        onFrameChange={() => {}}
      />
    );
    expect(container.querySelector('.rendervid-timeline')).toBeTruthy();
  });

  it('should display time information', () => {
    render(
      <Timeline
        totalFrames={300}
        fps={30}
        currentFrame={0}
        onFrameChange={() => {}}
      />
    );
    expect(screen.getByText(/300 frames @ 30fps/)).toBeTruthy();
  });

  it('should display formatted time', () => {
    render(
      <Timeline
        totalFrames={300}
        fps={30}
        currentFrame={150}
        onFrameChange={() => {}}
      />
    );
    // 150 frames at 30fps = 5 seconds -> 00:05:00
    expect(screen.getByText(/00:05:00/)).toBeTruthy();
  });

  it('should show zoom controls when onZoomChange is provided', () => {
    render(
      <Timeline
        totalFrames={300}
        fps={30}
        currentFrame={0}
        onFrameChange={() => {}}
        zoom={1}
        onZoomChange={() => {}}
      />
    );
    expect(screen.getByText('Zoom:')).toBeTruthy();
  });

  it('should not show zoom controls when onZoomChange is not provided', () => {
    render(
      <Timeline
        totalFrames={300}
        fps={30}
        currentFrame={0}
        onFrameChange={() => {}}
      />
    );
    expect(screen.queryByText('Zoom:')).toBeNull();
  });

  it('should render custom markers', () => {
    const markers = [
      { frame: 50, label: 'Marker 1', color: '#ff0' },
      { frame: 100, label: 'Marker 2', color: '#0ff' },
    ];
    const { container } = render(
      <Timeline
        totalFrames={300}
        fps={30}
        currentFrame={0}
        onFrameChange={() => {}}
        markers={markers}
      />
    );
    // Markers render as divs with title
    expect(container.querySelector('[title="Marker 1"]')).toBeTruthy();
    expect(container.querySelector('[title="Marker 2"]')).toBeTruthy();
  });

  it('should render playhead', () => {
    const { container } = render(
      <Timeline
        totalFrames={300}
        fps={30}
        currentFrame={150}
        onFrameChange={() => {}}
      />
    );
    expect(container.querySelector('.timeline-playhead')).toBeTruthy();
  });
});
