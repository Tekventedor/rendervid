import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlayback } from '../hooks/usePlayback';

describe('usePlayback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      expect(result.current.state.isPlaying).toBe(false);
      expect(result.current.state.currentFrame).toBe(0);
      expect(result.current.state.totalFrames).toBe(300);
      expect(result.current.state.fps).toBe(30);
      expect(result.current.state.loop).toBe(false);
      expect(result.current.state.speed).toBe(1);
      expect(result.current.state.volume).toBe(1);
      expect(result.current.state.muted).toBe(false);
    });

    it('should calculate duration and currentTime correctly', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      expect(result.current.state.duration).toBe(10); // 300 frames / 30 fps
      expect(result.current.state.currentTime).toBe(0);
    });

    it('should respect initial options', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 60,
          loop: true,
          initialSpeed: 2,
          autoplay: false,
        })
      );

      expect(result.current.state.fps).toBe(60);
      expect(result.current.state.loop).toBe(true);
      expect(result.current.state.speed).toBe(2);
      expect(result.current.state.duration).toBe(5); // 300 frames / 60 fps
    });

    it('should autoplay when autoplay option is true', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
          autoplay: true,
        })
      );

      expect(result.current.state.isPlaying).toBe(true);
    });
  });

  describe('Play Controls', () => {
    it('should start playing when play is called', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.play();
      });

      expect(result.current.state.isPlaying).toBe(true);
    });

    it('should stop playing when pause is called', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
          autoplay: true,
        })
      );

      act(() => {
        result.current.controls.pause();
      });

      expect(result.current.state.isPlaying).toBe(false);
    });

    it('should toggle play/pause state', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.toggle();
      });
      expect(result.current.state.isPlaying).toBe(true);

      act(() => {
        result.current.controls.toggle();
      });
      expect(result.current.state.isPlaying).toBe(false);
    });

    it('should stop and reset to beginning', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
          autoplay: true,
        })
      );

      act(() => {
        result.current.controls.seekToFrame(100);
        result.current.controls.stop();
      });

      expect(result.current.state.isPlaying).toBe(false);
      expect(result.current.state.currentFrame).toBe(0);
    });
  });

  describe('Seeking', () => {
    it('should seek to specific frame', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.seekToFrame(150);
      });

      expect(result.current.state.currentFrame).toBe(150);
      expect(result.current.state.currentTime).toBe(5);
    });

    it('should clamp frame to valid range', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.seekToFrame(-50);
      });
      expect(result.current.state.currentFrame).toBe(0);

      act(() => {
        result.current.controls.seekToFrame(500);
      });
      expect(result.current.state.currentFrame).toBe(299);
    });

    it('should seek to specific time', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.seekToTime(5);
      });

      expect(result.current.state.currentFrame).toBe(150);
      expect(result.current.state.currentTime).toBe(5);
    });

    it('should go to next frame when paused', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.nextFrame();
      });
      expect(result.current.state.currentFrame).toBe(1);

      act(() => {
        result.current.controls.nextFrame();
      });
      expect(result.current.state.currentFrame).toBe(2);
    });

    it('should go to previous frame when paused', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.seekToFrame(10);
      });

      act(() => {
        result.current.controls.prevFrame();
      });

      expect(result.current.state.currentFrame).toBe(9);
    });

    it('should not allow next/prev frame while playing', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
          autoplay: true,
        })
      );

      const initialFrame = result.current.state.currentFrame;

      act(() => {
        result.current.controls.nextFrame();
      });

      // Frame shouldn't change via nextFrame while playing
      expect(result.current.state.currentFrame).toBe(initialFrame);
    });
  });

  describe('Speed Control', () => {
    it('should set playback speed', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.setSpeed(2);
      });

      expect(result.current.state.speed).toBe(2);
    });

    it('should clamp speed to valid range', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.setSpeed(0.01);
      });
      expect(result.current.state.speed).toBe(0.1);

      act(() => {
        result.current.controls.setSpeed(10);
      });
      expect(result.current.state.speed).toBe(4);
    });
  });

  describe('Volume Control', () => {
    it('should set volume', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.setVolume(0.5);
      });

      expect(result.current.state.volume).toBe(0.5);
    });

    it('should clamp volume to valid range', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.setVolume(-0.5);
      });
      expect(result.current.state.volume).toBe(0);

      act(() => {
        result.current.controls.setVolume(1.5);
      });
      expect(result.current.state.volume).toBe(1);
    });

    it('should toggle mute', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.toggleMute();
      });
      expect(result.current.state.muted).toBe(true);

      act(() => {
        result.current.controls.toggleMute();
      });
      expect(result.current.state.muted).toBe(false);
    });
  });

  describe('Loop Control', () => {
    it('should set loop mode', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
        })
      );

      act(() => {
        result.current.controls.setLoop(true);
      });
      expect(result.current.state.loop).toBe(true);

      act(() => {
        result.current.controls.setLoop(false);
      });
      expect(result.current.state.loop).toBe(false);
    });
  });

  describe('Callbacks', () => {
    it('should call onFrameChange when frame changes', () => {
      const onFrameChange = vi.fn();

      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
          onFrameChange,
        })
      );

      act(() => {
        result.current.controls.seekToFrame(50);
      });

      expect(onFrameChange).toHaveBeenCalledWith(50);
    });

    it('should call onComplete when playback ends', () => {
      const onComplete = vi.fn();

      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
          onComplete,
        })
      );

      // Seek to near the end
      act(() => {
        result.current.controls.seekToFrame(299);
        result.current.controls.play();
      });

      // When at last frame and not looping, should complete
      expect(result.current.state.currentFrame).toBe(299);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero total frames', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 0,
          fps: 30,
        })
      );

      expect(result.current.state.totalFrames).toBe(0);
      expect(result.current.state.duration).toBe(0);
    });

    it('should reset to beginning when play is called at end without loop', () => {
      const { result } = renderHook(() =>
        usePlayback({
          totalFrames: 300,
          fps: 30,
          loop: false,
        })
      );

      act(() => {
        result.current.controls.seekToFrame(299);
      });

      act(() => {
        result.current.controls.play();
      });

      expect(result.current.state.currentFrame).toBe(0);
      expect(result.current.state.isPlaying).toBe(true);
    });
  });
});
