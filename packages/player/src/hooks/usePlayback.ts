import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  PlaybackState,
  PlaybackControls,
  UsePlaybackOptions,
} from '../types';

/**
 * Hook for managing video playback state and controls
 */
export function usePlayback(options: UsePlaybackOptions): {
  state: PlaybackState;
  controls: PlaybackControls;
} {
  const {
    fps = 30,
    totalFrames,
    loop = false,
    initialSpeed = 1.0,
    autoplay = false,
    onComplete,
    onFrameChange,
  } = options;

  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [speed, setSpeedState] = useState(initialSpeed);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(loop);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);

  const duration = totalFrames / fps;
  const currentTime = currentFrame / fps;
  const frameDuration = 1000 / fps;

  // Animation loop
  const animate = useCallback(
    (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const delta = (timestamp - lastTimestampRef.current) * speed;
      lastTimestampRef.current = timestamp;
      accumulatedTimeRef.current += delta;

      if (accumulatedTimeRef.current >= frameDuration) {
        const framesToAdvance = Math.floor(
          accumulatedTimeRef.current / frameDuration
        );
        accumulatedTimeRef.current %= frameDuration;

        setCurrentFrame((prev) => {
          let newFrame = prev + framesToAdvance;

          if (newFrame >= totalFrames) {
            if (loopEnabled) {
              newFrame = newFrame % totalFrames;
            } else {
              newFrame = totalFrames - 1;
              setIsPlaying(false);
              onComplete?.();
            }
          }

          return newFrame;
        });
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    },
    [fps, speed, totalFrames, loopEnabled, isPlaying, frameDuration, onComplete]
  );

  // Start/stop animation loop
  useEffect(() => {
    if (isPlaying) {
      lastTimestampRef.current = null;
      accumulatedTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Notify on frame change
  useEffect(() => {
    onFrameChange?.(currentFrame);
  }, [currentFrame, onFrameChange]);

  // Controls
  const play = useCallback(() => {
    if (currentFrame >= totalFrames - 1 && !loopEnabled) {
      setCurrentFrame(0);
    }
    setIsPlaying(true);
  }, [currentFrame, totalFrames, loopEnabled]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentFrame(0);
  }, []);

  const seekToFrame = useCallback(
    (frame: number) => {
      const clampedFrame = Math.max(0, Math.min(totalFrames - 1, Math.round(frame)));
      setCurrentFrame(clampedFrame);
    },
    [totalFrames]
  );

  const seekToTime = useCallback(
    (time: number) => {
      const frame = Math.round(time * fps);
      seekToFrame(frame);
    },
    [fps, seekToFrame]
  );

  const nextFrame = useCallback(() => {
    if (!isPlaying) {
      seekToFrame(currentFrame + 1);
    }
  }, [isPlaying, currentFrame, seekToFrame]);

  const prevFrame = useCallback(() => {
    if (!isPlaying) {
      seekToFrame(currentFrame - 1);
    }
  }, [isPlaying, currentFrame, seekToFrame]);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(Math.max(0.1, Math.min(4, newSpeed)));
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const setLoop = useCallback((enabled: boolean) => {
    setLoopEnabled(enabled);
  }, []);

  const state: PlaybackState = {
    isPlaying,
    currentFrame,
    totalFrames,
    currentTime,
    duration,
    fps,
    loop: loopEnabled,
    speed,
    volume,
    muted,
  };

  const controls: PlaybackControls = {
    play,
    pause,
    toggle,
    stop,
    seekToFrame,
    seekToTime,
    nextFrame,
    prevFrame,
    setSpeed,
    setVolume,
    toggleMute,
    setLoop,
  };

  return { state, controls };
}
