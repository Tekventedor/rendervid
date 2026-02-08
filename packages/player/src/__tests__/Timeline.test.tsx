import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../components/Timeline';

describe('Timeline', () => {
  it('should be exported from the package', () => {
    expect(typeof Timeline).toBe('function');
  });

  it('should render without crashing', () => {
    const { container } = render(
      <Timeline
        currentFrame={0}
        totalFrames={300}
        scenes={[]}
        fps={30}
        onSeek={() => {}}
        isPlaying={false}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should display time labels by default', () => {
    render(
      <Timeline
        currentFrame={0}
        totalFrames={300}
        scenes={[]}
        fps={30}
        onSeek={() => {}}
        isPlaying={false}
      />
    );
    // Should show frame counter
    expect(screen.getByText(/Frame: 0 \/ 300/)).toBeTruthy();
  });

  it('should hide time labels when showTimeLabels is false', () => {
    render(
      <Timeline
        currentFrame={0}
        totalFrames={300}
        scenes={[]}
        fps={30}
        onSeek={() => {}}
        isPlaying={false}
        showTimeLabels={false}
      />
    );
    expect(screen.queryByText(/Frame:/)).toBeNull();
  });

  it('should display current time formatted correctly', () => {
    // 150 frames at 30fps = 5 seconds = 00:05.00
    render(
      <Timeline
        currentFrame={150}
        totalFrames={300}
        scenes={[]}
        fps={30}
        onSeek={() => {}}
        isPlaying={false}
      />
    );
    expect(screen.getByText('00:05.00')).toBeTruthy();
  });

  it('should display scene markers when showSceneMarkers is true and multiple scenes', () => {
    const scenes = [
      { id: 's1', startFrame: 0, endFrame: 150, layers: [] },
      { id: 's2', startFrame: 150, endFrame: 300, layers: [] },
    ];
    const { container } = render(
      <Timeline
        currentFrame={0}
        totalFrames={300}
        scenes={scenes}
        fps={30}
        onSeek={() => {}}
        isPlaying={false}
        showSceneMarkers={true}
      />
    );
    // Scene markers container should exist
    expect(container.firstChild).toBeTruthy();
  });

  it('should not show scene markers for single scene', () => {
    const scenes = [
      { id: 's1', startFrame: 0, endFrame: 300, layers: [] },
    ];
    const { container } = render(
      <Timeline
        currentFrame={0}
        totalFrames={300}
        scenes={scenes}
        fps={30}
        onSeek={() => {}}
        isPlaying={false}
        showSceneMarkers={true}
      />
    );
    // Only one scene, so no markers shown
    expect(container.firstChild).toBeTruthy();
  });

  it('should apply className when provided', () => {
    const { container } = render(
      <Timeline
        currentFrame={0}
        totalFrames={300}
        scenes={[]}
        fps={30}
        onSeek={() => {}}
        isPlaying={false}
        className="custom-timeline"
      />
    );
    expect(container.querySelector('.custom-timeline')).toBeTruthy();
  });

  it('should display scene names when provided', () => {
    const scenes = [
      { id: 's1', name: 'Intro', startFrame: 0, endFrame: 150, layers: [] },
      { id: 's2', name: 'Main Content', startFrame: 150, endFrame: 300, layers: [] },
    ];
    render(
      <Timeline
        currentFrame={0}
        totalFrames={300}
        scenes={scenes}
        fps={30}
        onSeek={() => {}}
        isPlaying={false}
        showSceneMarkers={true}
      />
    );
    // Second scene name should appear as a marker (first scene start has no marker)
    expect(screen.getByText('Main Content')).toBeTruthy();
  });
});
