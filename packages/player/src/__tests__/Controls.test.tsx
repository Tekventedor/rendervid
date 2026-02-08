import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Controls } from '../components/Controls';
import type { PlaybackState, PlaybackControls } from '../types';

function createMockState(overrides: Partial<PlaybackState> = {}): PlaybackState {
  return {
    isPlaying: false,
    currentFrame: 0,
    totalFrames: 300,
    currentTime: 0,
    duration: 10,
    fps: 30,
    loop: false,
    speed: 1,
    volume: 1,
    muted: false,
    ...overrides,
  };
}

function createMockControls(): PlaybackControls {
  return {
    play: vi.fn(),
    pause: vi.fn(),
    toggle: vi.fn(),
    stop: vi.fn(),
    seekToFrame: vi.fn(),
    seekToTime: vi.fn(),
    nextFrame: vi.fn(),
    prevFrame: vi.fn(),
    setSpeed: vi.fn(),
    setVolume: vi.fn(),
    toggleMute: vi.fn(),
    setLoop: vi.fn(),
  };
}

describe('Controls', () => {
  it('should render without crashing', () => {
    const state = createMockState();
    const controls = createMockControls();
    const { container } = render(<Controls state={state} controls={controls} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should be exported from the package', () => {
    expect(typeof Controls).toBe('function');
  });

  it('should display frame counter by default', () => {
    const state = createMockState({ currentFrame: 50, totalFrames: 300 });
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} />);
    expect(screen.getByText('50 / 300')).toBeTruthy();
  });

  it('should hide frame counter when showFrameCounter is false', () => {
    const state = createMockState({ currentFrame: 50, totalFrames: 300 });
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} showFrameCounter={false} />);
    expect(screen.queryByText('50 / 300')).toBeNull();
  });

  it('should call toggle when play/pause button is clicked', () => {
    const state = createMockState();
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} />);
    const playButton = screen.getByTitle('Play (Space)');
    fireEvent.click(playButton);
    expect(controls.toggle).toHaveBeenCalled();
  });

  it('should show Pause title when playing', () => {
    const state = createMockState({ isPlaying: true });
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} />);
    expect(screen.getByTitle('Pause (Space)')).toBeTruthy();
  });

  it('should call stop when stop button is clicked', () => {
    const state = createMockState();
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} />);
    const stopButton = screen.getByTitle('Stop');
    fireEvent.click(stopButton);
    expect(controls.stop).toHaveBeenCalled();
  });

  it('should call prevFrame when previous frame button is clicked', () => {
    const state = createMockState();
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} />);
    const prevButton = screen.getByTitle('Previous frame (,)');
    fireEvent.click(prevButton);
    expect(controls.prevFrame).toHaveBeenCalled();
  });

  it('should call nextFrame when next frame button is clicked', () => {
    const state = createMockState();
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} />);
    const nextButton = screen.getByTitle('Next frame (.)');
    fireEvent.click(nextButton);
    expect(controls.nextFrame).toHaveBeenCalled();
  });

  it('should call toggleMute when volume button is clicked', () => {
    const state = createMockState();
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} />);
    const muteButton = screen.getByTitle('Mute (M)');
    fireEvent.click(muteButton);
    expect(controls.toggleMute).toHaveBeenCalled();
  });

  it('should show Unmute title when muted', () => {
    const state = createMockState({ muted: true });
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} />);
    expect(screen.getByTitle('Unmute (M)')).toBeTruthy();
  });

  it('should hide speed control when showSpeedControl is false', () => {
    const state = createMockState();
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} showSpeedControl={false} />);
    expect(screen.queryByText('Speed:')).toBeNull();
  });

  it('should show speed control by default', () => {
    const state = createMockState();
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} />);
    expect(screen.getByText('Speed:')).toBeTruthy();
  });

  it('should hide volume control when showVolumeControl is false', () => {
    const state = createMockState();
    const controls = createMockControls();
    render(<Controls state={state} controls={controls} showVolumeControl={false} />);
    expect(screen.queryByTitle('Mute (M)')).toBeNull();
  });

  it('should apply className when provided', () => {
    const state = createMockState();
    const controls = createMockControls();
    const { container } = render(
      <Controls state={state} controls={controls} className="custom-controls" />
    );
    expect(container.querySelector('.custom-controls')).toBeTruthy();
  });
});
