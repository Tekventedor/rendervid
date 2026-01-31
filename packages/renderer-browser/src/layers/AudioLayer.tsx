import React, { useRef, useEffect } from 'react';
import type { AudioLayer as AudioLayerType } from '@rendervid/core';

export interface AudioLayerProps {
  layer: AudioLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
  isPlaying?: boolean;
}

export function AudioLayer({ layer, frame, fps, sceneDuration, isPlaying = true }: AudioLayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const src = layer.props.src;
  if (!src) return null;

  const {
    volume = 1,
    loop = false,
    startTime = 0,
    fadeIn = 0,
    fadeOut = 0,
  } = layer.props;

  // Calculate current volume with fade in/out
  const layerStartFrame = layer.from ?? 0;
  const layerDuration = layer.duration ?? sceneDuration;
  const localFrame = frame - layerStartFrame;

  let currentVolume = volume;

  // Fade in
  if (fadeIn > 0 && localFrame < fadeIn) {
    currentVolume = volume * (localFrame / fadeIn);
  }

  // Fade out
  if (fadeOut > 0 && localFrame > layerDuration - fadeOut) {
    const fadeProgress = (layerDuration - localFrame) / fadeOut;
    currentVolume = volume * Math.max(0, fadeProgress);
  }

  // Sync audio time with frame
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Calculate the target time based on frame
    const targetTime = startTime + localFrame / fps;

    // Only seek if difference is significant
    if (Math.abs(audio.currentTime - targetTime) > 0.1) {
      audio.currentTime = targetTime;
    }

    // Control playback
    if (isPlaying && audio.paused) {
      audio.play().catch(() => {
        // Autoplay might be blocked
      });
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [frame, fps, startTime, isPlaying, localFrame]);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, currentVolume));
  }, [currentVolume]);

  // Audio layers are invisible
  return (
    <audio
      ref={audioRef}
      src={src}
      loop={loop}
      style={{ display: 'none' }}
    />
  );
}
