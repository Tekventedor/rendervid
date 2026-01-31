import React, { useEffect, useRef, useState } from 'react';
import type { LottieLayer as LottieLayerType } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';

export interface LottieLayerProps {
  layer: LottieLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
}

// Lottie player interface (lottie-web)
interface LottiePlayer {
  goToAndStop(frame: number, isFrame?: boolean): void;
  destroy(): void;
  totalFrames: number;
}

interface LottieApi {
  loadAnimation: (params: {
    container: HTMLElement;
    renderer: string;
    loop: boolean;
    autoplay: boolean;
    animationData?: object;
    path?: string;
  }) => LottiePlayer;
}

// We'll use dynamic import for lottie-web to keep it optional
let lottie: LottieApi | null = null;

export function LottieLayer({ layer, frame, fps, sceneDuration }: LottieLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<LottiePlayer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  const {
    data,
    loop = false,
    speed = 1,
    direction = 1,
  } = layer.props;

  // Resolve layer style
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};

  // Load lottie-web dynamically
  useEffect(() => {
    if (lottie) {
      setIsLoaded(true);
      return;
    }

    import('lottie-web')
      .then((module) => {
        lottie = module.default;
        setIsLoaded(true);
      })
      .catch((err) => {
        console.warn('Failed to load lottie-web:', err);
      });
  }, []);

  // Initialize lottie animation
  useEffect(() => {
    if (!isLoaded || !lottie || !containerRef.current) return;

    const isUrl = typeof data === 'string';

    playerRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false, // We control frames manually
      autoplay: false,
      ...(isUrl ? { path: data } : { animationData: data }),
    });

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [isLoaded, data]);

  // Sync frame with animation
  useEffect(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;
    const layerStartFrame = layer.from ?? 0;
    const localFrame = frame - layerStartFrame;

    // Calculate the lottie frame based on layer frame and speed
    let lottieFrame = (localFrame * speed);

    if (direction === -1) {
      lottieFrame = player.totalFrames - lottieFrame;
    }

    // Handle looping
    if (loop && player.totalFrames > 0) {
      lottieFrame = lottieFrame % player.totalFrames;
    }

    // Clamp to valid range
    lottieFrame = Math.max(0, Math.min(lottieFrame, player.totalFrames - 1));

    player.goToAndStop(Math.floor(lottieFrame), true);
  }, [frame, layer.from, speed, direction, loop]);

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
        ...layerStyle,
        ...animationStyle,
      }}
      className={layer.className}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
