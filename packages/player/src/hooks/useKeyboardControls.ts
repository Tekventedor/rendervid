import { useEffect, useCallback } from 'react';
import type { PlaybackControls, PlaybackState } from '../types';

export interface UseKeyboardControlsOptions {
  /** Playback controls */
  controls: PlaybackControls;
  /** Playback state */
  state: PlaybackState;
  /** Whether keyboard controls are enabled (default: true) */
  enabled?: boolean;
  /** Frames to skip when using arrow keys (default: 1) */
  frameStep?: number;
  /** Seconds to skip when using J/L keys (default: 5) */
  timeStep?: number;
}

/**
 * Hook for adding keyboard controls to the player
 */
export function useKeyboardControls(options: UseKeyboardControlsOptions): void {
  const {
    controls,
    state,
    enabled = true,
    frameStep = 1,
    timeStep = 5,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case ' ':
        case 'k':
          event.preventDefault();
          controls.toggle();
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (event.shiftKey) {
            // Skip back by time step
            controls.seekToTime(state.currentTime - timeStep);
          } else {
            // Previous frame(s)
            controls.seekToFrame(state.currentFrame - frameStep);
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (event.shiftKey) {
            // Skip forward by time step
            controls.seekToTime(state.currentTime + timeStep);
          } else {
            // Next frame(s)
            controls.seekToFrame(state.currentFrame + frameStep);
          }
          break;

        case 'j':
          event.preventDefault();
          controls.seekToTime(state.currentTime - timeStep);
          break;

        case 'l':
          event.preventDefault();
          controls.seekToTime(state.currentTime + timeStep);
          break;

        case ',':
          event.preventDefault();
          controls.prevFrame();
          break;

        case '.':
          event.preventDefault();
          controls.nextFrame();
          break;

        case 'Home':
        case '0':
          event.preventDefault();
          controls.seekToFrame(0);
          break;

        case 'End':
          event.preventDefault();
          controls.seekToFrame(state.totalFrames - 1);
          break;

        case 'm':
          event.preventDefault();
          controls.toggleMute();
          break;

        case 'ArrowUp':
          event.preventDefault();
          controls.setVolume(state.volume + 0.1);
          break;

        case 'ArrowDown':
          event.preventDefault();
          controls.setVolume(state.volume - 0.1);
          break;

        case '<':
          event.preventDefault();
          controls.setSpeed(state.speed - 0.25);
          break;

        case '>':
          event.preventDefault();
          controls.setSpeed(state.speed + 0.25);
          break;

        case 'r':
          event.preventDefault();
          controls.setLoop(!state.loop);
          break;

        // Number keys 1-9 jump to percentage of video
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          event.preventDefault();
          const percentage = parseInt(event.key) / 10;
          controls.seekToFrame(Math.floor(state.totalFrames * percentage));
          break;
      }
    },
    [controls, state, frameStep, timeStep]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
