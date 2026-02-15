import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AudioWaveform } from '../effects/AudioWaveform';
import { AudioSpectrum } from '../effects/AudioSpectrum';
import type { AudioData } from '@rendervid/core';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createMockAudioData(durationSeconds: number = 2): AudioData {
  const sampleRate = 44100;
  const length = Math.floor(sampleRate * durationSeconds);
  const channelData = new Float32Array(length);

  // Generate a 440Hz sine wave
  for (let i = 0; i < length; i++) {
    channelData[i] = 0.5 * Math.sin((2 * Math.PI * 440 * i) / sampleRate);
  }

  return {
    channelData: [channelData],
    sampleRate,
    numberOfChannels: 1,
    durationInSeconds: durationSeconds,
    length,
  };
}

const mockAudio = createMockAudioData();

// ─── AudioWaveform Tests ─────────────────────────────────────────────────────

describe('AudioWaveform Component', () => {
  it('should render an SVG element', () => {
    const { container } = render(
      <AudioWaveform
        audioData={mockAudio}
        frame={15}
        fps={30}
        width={200}
        height={100}
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should render with bars style', () => {
    const { container } = render(
      <AudioWaveform
        audioData={mockAudio}
        frame={15}
        fps={30}
        waveformStyle="bars"
        width={200}
        height={100}
      />
    );
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
  });

  it('should render with line style', () => {
    const { container } = render(
      <AudioWaveform
        audioData={mockAudio}
        frame={15}
        fps={30}
        waveformStyle="line"
        width={200}
        height={100}
      />
    );
    const path = container.querySelector('path');
    expect(path).toBeTruthy();
  });

  it('should render with mirror style', () => {
    const { container } = render(
      <AudioWaveform
        audioData={mockAudio}
        frame={15}
        fps={30}
        waveformStyle="mirror"
        width={200}
        height={100}
      />
    );
    // Mirror style renders pairs of rects
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
    // Should be even (top + bottom for each bar)
    expect(rects.length % 2).toBe(0);
  });

  it('should apply custom width and height', () => {
    const { container } = render(
      <AudioWaveform
        audioData={mockAudio}
        frame={15}
        fps={30}
        width={800}
        height={400}
      />
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('800');
    expect(svg?.getAttribute('height')).toBe('400');
  });

  it('should apply className', () => {
    const { container } = render(
      <AudioWaveform
        audioData={mockAudio}
        frame={15}
        fps={30}
        className="test-waveform"
      />
    );
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('test-waveform')).toBe(true);
  });

  it('should render deterministically for same inputs', () => {
    const render1 = render(
      <AudioWaveform
        audioData={mockAudio}
        frame={15}
        fps={30}
        waveformStyle="bars"
        width={200}
        height={100}
      />
    );
    const render2 = render(
      <AudioWaveform
        audioData={mockAudio}
        frame={15}
        fps={30}
        waveformStyle="bars"
        width={200}
        height={100}
      />
    );
    expect(render1.container.innerHTML).toBe(render2.container.innerHTML);
  });
});

// ─── AudioSpectrum Tests ─────────────────────────────────────────────────────

describe('AudioSpectrum Component', () => {
  it('should render an SVG element', () => {
    const { container } = render(
      <AudioSpectrum
        audioData={mockAudio}
        frame={15}
        fps={30}
        width={200}
        height={100}
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should render bars layout', () => {
    const { container } = render(
      <AudioSpectrum
        audioData={mockAudio}
        frame={15}
        fps={30}
        layout="bars"
        bands={16}
        width={200}
        height={100}
      />
    );
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(16);
  });

  it('should render circular layout', () => {
    const { container } = render(
      <AudioSpectrum
        audioData={mockAudio}
        frame={15}
        fps={30}
        layout="circular"
        bands={16}
        width={200}
        height={200}
      />
    );
    const lines = container.querySelectorAll('line');
    expect(lines.length).toBe(16);
  });

  it('should apply custom width and height', () => {
    const { container } = render(
      <AudioSpectrum
        audioData={mockAudio}
        frame={15}
        fps={30}
        width={600}
        height={300}
      />
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('600');
    expect(svg?.getAttribute('height')).toBe('300');
  });

  it('should accept a single color', () => {
    const { container } = render(
      <AudioSpectrum
        audioData={mockAudio}
        frame={15}
        fps={30}
        colorMap="#ff0000"
        bands={8}
        width={200}
        height={100}
      />
    );
    const rects = container.querySelectorAll('rect');
    // All rects should have the same fill color
    for (const rect of rects) {
      expect(rect.getAttribute('fill')).toBe('#ff0000');
    }
  });

  it('should accept a color array for gradient', () => {
    const { container } = render(
      <AudioSpectrum
        audioData={mockAudio}
        frame={15}
        fps={30}
        colorMap={['#ff0000', '#00ff00', '#0000ff']}
        bands={8}
        width={200}
        height={100}
      />
    );
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(8);
    // First bar should be reddish, last bar should be bluish
    const firstFill = rects[0].getAttribute('fill') || '';
    const lastFill = rects[rects.length - 1].getAttribute('fill') || '';
    expect(firstFill).not.toBe(lastFill);
  });

  it('should apply className', () => {
    const { container } = render(
      <AudioSpectrum
        audioData={mockAudio}
        frame={15}
        fps={30}
        className="test-spectrum"
      />
    );
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('test-spectrum')).toBe(true);
  });

  it('should render deterministically for same inputs', () => {
    const render1 = render(
      <AudioSpectrum
        audioData={mockAudio}
        frame={15}
        fps={30}
        bands={16}
        width={200}
        height={100}
      />
    );
    const render2 = render(
      <AudioSpectrum
        audioData={mockAudio}
        frame={15}
        fps={30}
        bands={16}
        width={200}
        height={100}
      />
    );
    expect(render1.container.innerHTML).toBe(render2.container.innerHTML);
  });
});
