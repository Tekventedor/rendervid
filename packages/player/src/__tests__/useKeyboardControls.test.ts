import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import type { PlaybackControls, PlaybackState } from '../types';

function createMockState(overrides: Partial<PlaybackState> = {}): PlaybackState {
  return {
    isPlaying: false,
    currentFrame: 100,
    totalFrames: 300,
    currentTime: 3.33,
    duration: 10,
    fps: 30,
    loop: false,
    speed: 1,
    volume: 0.5,
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

function dispatchKey(key: string, options: Partial<KeyboardEvent> = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  window.dispatchEvent(event);
}

describe('useKeyboardControls', () => {
  let controls: PlaybackControls;
  let state: PlaybackState;

  beforeEach(() => {
    controls = createMockControls();
    state = createMockState();
  });

  it('should be exported from the package', () => {
    expect(typeof useKeyboardControls).toBe('function');
  });

  it('should toggle play on Space key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey(' ');
    expect(controls.toggle).toHaveBeenCalled();
  });

  it('should toggle play on K key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('k');
    expect(controls.toggle).toHaveBeenCalled();
  });

  it('should seek to previous frame on ArrowLeft', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('ArrowLeft');
    expect(controls.seekToFrame).toHaveBeenCalledWith(99);
  });

  it('should seek to next frame on ArrowRight', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('ArrowRight');
    expect(controls.seekToFrame).toHaveBeenCalledWith(101);
  });

  it('should seek back by time step on Shift+ArrowLeft', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('ArrowLeft', { shiftKey: true });
    expect(controls.seekToTime).toHaveBeenCalledWith(state.currentTime - 5);
  });

  it('should seek forward by time step on Shift+ArrowRight', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('ArrowRight', { shiftKey: true });
    expect(controls.seekToTime).toHaveBeenCalledWith(state.currentTime + 5);
  });

  it('should call prevFrame on comma key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey(',');
    expect(controls.prevFrame).toHaveBeenCalled();
  });

  it('should call nextFrame on period key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('.');
    expect(controls.nextFrame).toHaveBeenCalled();
  });

  it('should seek to beginning on Home key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('Home');
    expect(controls.seekToFrame).toHaveBeenCalledWith(0);
  });

  it('should seek to end on End key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('End');
    expect(controls.seekToFrame).toHaveBeenCalledWith(299);
  });

  it('should toggle mute on M key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('m');
    expect(controls.toggleMute).toHaveBeenCalled();
  });

  it('should increase volume on ArrowUp', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('ArrowUp');
    expect(controls.setVolume).toHaveBeenCalledWith(0.6);
  });

  it('should decrease volume on ArrowDown', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('ArrowDown');
    expect(controls.setVolume).toHaveBeenCalledWith(0.4);
  });

  it('should toggle loop on R key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('r');
    expect(controls.setLoop).toHaveBeenCalledWith(true);
  });

  it('should seek to percentage on number keys', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('5');
    // 50% of 300 = 150
    expect(controls.seekToFrame).toHaveBeenCalledWith(150);
  });

  it('should seek to beginning on 0 key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('0');
    expect(controls.seekToFrame).toHaveBeenCalledWith(0);
  });

  it('should not respond to keys when disabled', () => {
    renderHook(() => useKeyboardControls({ controls, state, enabled: false }));
    dispatchKey(' ');
    expect(controls.toggle).not.toHaveBeenCalled();
  });

  it('should use custom frameStep', () => {
    renderHook(() => useKeyboardControls({ controls, state, frameStep: 5 }));
    dispatchKey('ArrowRight');
    expect(controls.seekToFrame).toHaveBeenCalledWith(105);
  });

  it('should use custom timeStep', () => {
    renderHook(() => useKeyboardControls({ controls, state, timeStep: 10 }));
    dispatchKey('j');
    expect(controls.seekToTime).toHaveBeenCalledWith(state.currentTime - 10);
  });

  it('should seek back by timeStep on J key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('j');
    expect(controls.seekToTime).toHaveBeenCalledWith(state.currentTime - 5);
  });

  it('should seek forward by timeStep on L key', () => {
    renderHook(() => useKeyboardControls({ controls, state }));
    dispatchKey('l');
    expect(controls.seekToTime).toHaveBeenCalledWith(state.currentTime + 5);
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyboardControls({ controls, state }));
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
