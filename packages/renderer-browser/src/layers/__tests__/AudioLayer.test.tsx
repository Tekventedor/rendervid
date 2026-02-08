import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AudioLayer } from '../AudioLayer';
import type { AudioLayer as AudioLayerType } from '@rendervid/core';

// Mock HTMLAudioElement.play to return a Promise (jsdom doesn't support it)
beforeEach(() => {
  HTMLAudioElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLAudioElement.prototype.pause = vi.fn();
});

describe('AudioLayer Component', () => {
  const baseLayer: AudioLayerType = {
    id: 'audio-1',
    type: 'audio',
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    props: {
      src: 'https://example.com/audio.mp3',
    },
  };

  it('should render an audio element', () => {
    const { container } = render(
      <AudioLayer layer={baseLayer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const audio = container.querySelector('audio');
    expect(audio).toBeTruthy();
    expect(audio?.getAttribute('src')).toBe('https://example.com/audio.mp3');
  });

  it('should return null when src is missing', () => {
    const layer: AudioLayerType = {
      ...baseLayer,
      props: { src: '' },
    };

    const { container } = render(
      <AudioLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should be hidden (display: none)', () => {
    const { container } = render(
      <AudioLayer layer={baseLayer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const audio = container.querySelector('audio') as HTMLAudioElement;
    expect(audio.style.display).toBe('none');
  });

  it('should apply loop attribute', () => {
    const layer: AudioLayerType = {
      ...baseLayer,
      props: {
        src: 'https://example.com/audio.mp3',
        loop: true,
      },
    };

    const { container } = render(
      <AudioLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const audio = container.querySelector('audio') as HTMLAudioElement;
    expect(audio.loop).toBe(true);
  });

  it('should not loop by default', () => {
    const { container } = render(
      <AudioLayer layer={baseLayer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const audio = container.querySelector('audio') as HTMLAudioElement;
    expect(audio.loop).toBe(false);
  });

  it('should render with different src values', () => {
    const layer: AudioLayerType = {
      ...baseLayer,
      props: {
        src: 'https://example.com/different.ogg',
      },
    };

    const { container } = render(
      <AudioLayer layer={layer} frame={0} fps={30} sceneDuration={300} isPlaying={false} />
    );
    const audio = container.querySelector('audio');
    expect(audio?.getAttribute('src')).toBe('https://example.com/different.ogg');
  });
});
