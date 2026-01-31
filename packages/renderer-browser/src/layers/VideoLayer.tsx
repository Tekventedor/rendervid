import React, { useRef, useEffect } from 'react';
import type { VideoLayer as VideoLayerType } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';

export interface VideoLayerProps {
  layer: VideoLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
  isPlaying?: boolean;
}

export function VideoLayer({ layer, frame, fps, sceneDuration, isPlaying = true }: VideoLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  const src = layer.props.src;
  if (!src) return null;

  const {
    fit = 'cover',
    loop = false,
    muted = false,
    playbackRate = 1,
    startTime = 0,
    volume = 1,
  } = layer.props;

  // Resolve layer style
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};

  // Sync video time with frame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Calculate the target time based on frame
    const layerStartFrame = layer.from ?? 0;
    const localFrame = frame - layerStartFrame;
    const targetTime = startTime + (localFrame / fps) * playbackRate;

    // Only seek if difference is significant
    if (Math.abs(video.currentTime - targetTime) > 0.1) {
      video.currentTime = targetTime;
    }

    // Control playback
    if (isPlaying && video.paused) {
      video.play().catch(() => {
        // Autoplay might be blocked
      });
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [frame, fps, startTime, playbackRate, isPlaying, layer.from]);

  // Set playback rate and volume
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;
    video.volume = muted ? 0 : volume;
  }, [playbackRate, volume, muted]);

  return (
    <div
      style={{
        position: 'absolute',
        left: layer.position.x,
        top: layer.position.y,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
        opacity: layer.opacity ?? 1,
        overflow: 'hidden',
        ...layerStyle,
        ...animationStyle,
      }}
      className={layer.className}
    >
      <video
        ref={videoRef}
        src={src}
        loop={loop}
        muted={muted}
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
        }}
      />
    </div>
  );
}
