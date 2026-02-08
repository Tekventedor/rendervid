import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { LayerRenderer } from '../LayerRenderer';
import type { Layer } from '@rendervid/core';

// Mock HTMLVideoElement and HTMLAudioElement play
beforeEach(() => {
  HTMLVideoElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLVideoElement.prototype.pause = vi.fn();
  HTMLAudioElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLAudioElement.prototype.pause = vi.fn();
});

describe('LayerRenderer Component', () => {
  it('should render a text layer', () => {
    const layer: Layer = {
      id: 'text-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 50 },
      props: { text: 'Hello' },
    };

    const { container } = render(
      <LayerRenderer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.textContent).toContain('Hello');
  });

  it('should render an image layer', () => {
    const layer: Layer = {
      id: 'img-1',
      type: 'image',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 200 },
      props: { src: 'https://example.com/img.png' },
    };

    const { container } = render(
      <LayerRenderer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('should render a shape layer', () => {
    const layer: Layer = {
      id: 'shape-1',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      props: { shape: 'rectangle', fill: '#f00' },
    };

    const { container } = render(
      <LayerRenderer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should render a video layer', () => {
    const layer: Layer = {
      id: 'video-1',
      type: 'video',
      position: { x: 0, y: 0 },
      size: { width: 640, height: 480 },
      props: { src: 'https://example.com/video.mp4' },
    };

    const { container } = render(
      <LayerRenderer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const video = container.querySelector('video');
    expect(video).toBeTruthy();
  });

  it('should render an audio layer', () => {
    const layer: Layer = {
      id: 'audio-1',
      type: 'audio',
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      props: { src: 'https://example.com/audio.mp3' },
    };

    const { container } = render(
      <LayerRenderer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const audio = container.querySelector('audio');
    expect(audio).toBeTruthy();
  });

  it('should return null when layer is outside time range (before start)', () => {
    const layer: Layer = {
      id: 'text-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 50 },
      from: 30,
      duration: 60,
      props: { text: 'Timed' },
    };

    const { container } = render(
      <LayerRenderer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should return null when layer is outside time range (after end)', () => {
    const layer: Layer = {
      id: 'text-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 50 },
      from: 0,
      duration: 30,
      props: { text: 'Timed' },
    };

    const { container } = render(
      <LayerRenderer layer={layer} frame={30} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render layer within time range', () => {
    const layer: Layer = {
      id: 'text-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 50 },
      from: 10,
      duration: 50,
      props: { text: 'Visible' },
    };

    const { container } = render(
      <LayerRenderer layer={layer} frame={30} fps={30} sceneDuration={100} />
    );
    expect(container.textContent).toContain('Visible');
  });

  it('should return null when layer is hidden', () => {
    const layer: Layer = {
      id: 'text-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 50 },
      hidden: true,
      props: { text: 'Hidden' },
    };

    const { container } = render(
      <LayerRenderer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should return null for unknown layer type', () => {
    const layer = {
      id: 'unknown-1',
      type: 'nonexistent',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      props: {},
    } as any;

    const { container } = render(
      <LayerRenderer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should use sceneDuration as default layer duration', () => {
    const layer: Layer = {
      id: 'text-1',
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 50 },
      // No from or duration specified
      props: { text: 'Full Duration' },
    };

    // Should be visible at any frame within sceneDuration
    const { container } = render(
      <LayerRenderer layer={layer} frame={50} fps={30} sceneDuration={100} />
    );
    expect(container.textContent).toContain('Full Duration');
  });
});
