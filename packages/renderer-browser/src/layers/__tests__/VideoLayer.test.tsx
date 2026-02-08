import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { VideoLayer } from '../VideoLayer';
import type { VideoLayer as VideoLayerType } from '@rendervid/core';

// Mock HTMLVideoElement.play to return a Promise (jsdom doesn't support it)
beforeEach(() => {
  HTMLVideoElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLVideoElement.prototype.pause = vi.fn();
});

describe('VideoLayer Component', () => {
  const baseLayer: VideoLayerType = {
    id: 'video-1',
    type: 'video',
    position: { x: 0, y: 0 },
    size: { width: 1920, height: 1080 },
    props: {
      src: 'https://example.com/video.mp4',
    },
  };

  it('should render a video element', () => {
    const { container } = render(
      <VideoLayer layer={baseLayer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const video = container.querySelector('video');
    expect(video).toBeTruthy();
    expect(video?.getAttribute('src')).toBe('https://example.com/video.mp4');
  });

  it('should return null when src is missing', () => {
    const layer: VideoLayerType = {
      ...baseLayer,
      props: { src: '' },
    };

    const { container } = render(
      <VideoLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should apply position and size', () => {
    const { container } = render(
      <VideoLayer layer={baseLayer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.position).toBe('absolute');
    expect(el.style.left).toBe('0px');
    expect(el.style.top).toBe('0px');
    expect(el.style.width).toBe('1920px');
    expect(el.style.height).toBe('1080px');
  });

  it('should apply default fit of cover', () => {
    const { container } = render(
      <VideoLayer layer={baseLayer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.style.objectFit).toBe('cover');
  });

  it('should apply custom fit', () => {
    const layer: VideoLayerType = {
      ...baseLayer,
      props: {
        src: 'https://example.com/video.mp4',
        fit: 'contain',
      },
    };

    const { container } = render(
      <VideoLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.style.objectFit).toBe('contain');
  });

  it('should apply loop attribute', () => {
    const layer: VideoLayerType = {
      ...baseLayer,
      props: {
        src: 'https://example.com/video.mp4',
        loop: true,
      },
    };

    const { container } = render(
      <VideoLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.loop).toBe(true);
  });

  it('should apply muted attribute', () => {
    const layer: VideoLayerType = {
      ...baseLayer,
      props: {
        src: 'https://example.com/video.mp4',
        muted: true,
      },
    };

    const { container } = render(
      <VideoLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.muted).toBe(true);
  });

  it('should apply opacity', () => {
    const layer: VideoLayerType = {
      ...baseLayer,
      opacity: 0.8,
    };

    const { container } = render(
      <VideoLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe('0.8');
  });

  it('should apply rotation', () => {
    const layer: VideoLayerType = {
      ...baseLayer,
      rotation: 90,
    };

    const { container } = render(
      <VideoLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.transform).toContain('rotate(90deg)');
  });

  it('should apply anchor point', () => {
    const layer: VideoLayerType = {
      ...baseLayer,
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      anchor: { x: 0.5, y: 0.5 },
    };

    const { container } = render(
      <VideoLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.left).toBe('-100px');
    expect(el.style.top).toBe('-50px');
  });

  it('should have overflow hidden', () => {
    const { container } = render(
      <VideoLayer layer={baseLayer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.overflow).toBe('hidden');
  });
});
