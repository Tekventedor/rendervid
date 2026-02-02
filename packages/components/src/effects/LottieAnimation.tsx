import React, { useEffect, useRef, useState } from 'react';
import type { AnimatedProps } from '../types';

/**
 * Lottie animation data type (standard Lottie JSON format)
 */
export interface LottieAnimationData {
  v?: string; // Bodymovin version
  fr?: number; // Frame rate
  ip?: number; // In point (start frame)
  op?: number; // Out point (end frame)
  w?: number; // Width
  h?: number; // Height
  assets?: unknown[];
  layers?: unknown[];
  [key: string]: unknown;
}

/**
 * Props for LottieAnimation component
 */
export interface LottieAnimationProps extends AnimatedProps {
  /** Lottie JSON animation data (inline) */
  animationData?: LottieAnimationData;
  /** URL to Lottie JSON file */
  src?: string;
  /** Playback speed multiplier (default: 1) */
  speed?: number;
  /** Loop animation (default: true) */
  loop?: boolean;
  /** Autoplay (for video rendering, controlled by frame prop) */
  autoplay?: boolean;
  /** Width of animation container */
  width?: number | string;
  /** Height of animation container */
  height?: number | string;
}

/**
 * Type definitions for lottie-web library
 * This is a minimal subset needed for our implementation
 */
interface LottiePlayer {
  loadAnimation(params: {
    container: HTMLElement;
    renderer: 'svg' | 'canvas' | 'html';
    loop: boolean;
    autoplay: boolean;
    animationData?: LottieAnimationData;
    path?: string;
  }): LottieAnimationInstance;
}

interface LottieAnimationInstance {
  goToAndStop(frame: number, isFrame?: boolean): void;
  play(): void;
  pause(): void;
  stop(): void;
  destroy(): void;
  setSpeed(speed: number): void;
  getDuration(inFrames?: boolean): number;
  totalFrames: number;
}

declare global {
  interface Window {
    lottie?: LottiePlayer;
  }
}

/**
 * LottieAnimation component for rendering Lottie/After Effects animations
 *
 * Supports frame-aware playback, making it perfect for video rendering.
 * Can load animations from URL or inline JSON data.
 *
 * **Note:** Requires `lottie-web` to be installed as a peer dependency.
 * If not installed, displays a placeholder with instructions.
 *
 * Install with: `npm install lottie-web`
 *
 * @example
 * ```tsx
 * // Load from URL
 * <LottieAnimation
 *   src="https://assets.example.com/animation.json"
 *   frame={currentFrame}
 *   totalFrames={120}
 *   speed={1}
 *   loop={true}
 * />
 *
 * // Load from inline data
 * <LottieAnimation
 *   animationData={myLottieJSON}
 *   frame={currentFrame}
 *   totalFrames={120}
 * />
 * ```
 */
export function LottieAnimation({
  animationData,
  src,
  speed = 1,
  loop = true,
  autoplay = false,
  width = '100%',
  height = '100%',
  frame = 0,
  totalFrames = 60,
  fps = 30,
  className,
  style,
}: LottieAnimationProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<LottieAnimationInstance | null>(null);
  const [lottieAvailable, setLottieAvailable] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [animationLoaded, setAnimationLoaded] = useState(false);

  // Check if lottie-web is available
  useEffect(() => {
    const checkLottie = async () => {
      try {
        // Try to import lottie-web dynamically
        // @ts-expect-error - lottie-web is an optional peer dependency
        const lottie = await import('lottie-web').catch(() => null);
        if (lottie) {
          // Store in window for easier access
          window.lottie = lottie.default || lottie;
          setLottieAvailable(true);
        } else {
          setLottieAvailable(false);
        }
      } catch (error) {
        setLottieAvailable(false);
      }
    };

    checkLottie();
  }, []);

  // Load and initialize Lottie animation
  useEffect(() => {
    if (!lottieAvailable || !containerRef.current || !window.lottie) {
      return;
    }

    if (!animationData && !src) {
      setLoadError('Either animationData or src must be provided');
      return;
    }

    try {
      const params: Parameters<LottiePlayer['loadAnimation']>[0] = {
        container: containerRef.current,
        renderer: 'svg',
        loop: false, // We control frame-by-frame
        autoplay: false, // We control playback via goToAndStop
      };

      if (animationData) {
        params.animationData = animationData;
      } else if (src) {
        params.path = src;
      }

      const animation = window.lottie.loadAnimation(params);

      // Set speed multiplier
      if (speed !== 1) {
        animation.setSpeed(speed);
      }

      animationRef.current = animation;
      setAnimationLoaded(true);
      setLoadError(null);

      return () => {
        if (animationRef.current) {
          animationRef.current.destroy();
          animationRef.current = null;
        }
        setAnimationLoaded(false);
      };
    } catch (error) {
      setLoadError(`Failed to load animation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAnimationLoaded(false);
    }
  }, [lottieAvailable, animationData, src, speed]);

  // Update animation frame based on current video frame
  useEffect(() => {
    if (!animationRef.current || !animationLoaded) {
      return;
    }

    const animation = animationRef.current;
    const lottieFrameCount = animation.totalFrames;

    if (lottieFrameCount <= 0) {
      return;
    }

    // Calculate which frame of the Lottie animation to show
    // Map current frame (0 to totalFrames) to Lottie animation frame (0 to lottieFrameCount)
    let lottieFrame: number;

    if (loop) {
      // Loop the animation within the scene duration
      const progress = (frame / totalFrames) * speed;
      const loopedProgress = progress % 1;
      lottieFrame = loopedProgress * lottieFrameCount;
    } else {
      // Play once and hold on last frame
      const progress = Math.min((frame / totalFrames) * speed, 1);
      lottieFrame = progress * (lottieFrameCount - 1);
    }

    // Clamp to valid range
    lottieFrame = Math.max(0, Math.min(lottieFrame, lottieFrameCount - 1));

    // Update to specific frame
    animation.goToAndStop(lottieFrame, true);
  }, [frame, totalFrames, fps, speed, loop, animationLoaded]);

  const containerStyle: React.CSSProperties = {
    width,
    height,
    overflow: 'hidden',
    ...style,
  };

  // Show placeholder if lottie-web is not available
  if (!lottieAvailable) {
    const placeholderStyle: React.CSSProperties = {
      ...containerStyle,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      color: '#666',
      padding: '20px',
      textAlign: 'center',
      fontSize: '14px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      border: '2px dashed #ccc',
      borderRadius: '8px',
    };

    return (
      <div className={className} style={placeholderStyle}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Lottie Animation
        </div>
        <div style={{ fontSize: '12px', maxWidth: '300px' }}>
          Install <code style={{
            backgroundColor: '#e0e0e0',
            padding: '2px 6px',
            borderRadius: '3px',
            fontFamily: 'monospace'
          }}>lottie-web</code> to render Lottie animations:
        </div>
        <div style={{
          marginTop: '8px',
          fontFamily: 'monospace',
          fontSize: '11px',
          backgroundColor: '#e0e0e0',
          padding: '8px 12px',
          borderRadius: '4px'
        }}>
          npm install lottie-web
        </div>
      </div>
    );
  }

  // Show error message if loading failed
  if (loadError) {
    const errorStyle: React.CSSProperties = {
      ...containerStyle,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fee',
      color: '#c33',
      padding: '20px',
      textAlign: 'center',
      fontSize: '14px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      border: '2px solid #fcc',
      borderRadius: '8px',
    };

    return (
      <div className={className} style={errorStyle}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Animation Load Error
        </div>
        <div style={{ fontSize: '12px' }}>
          {loadError}
        </div>
      </div>
    );
  }

  // Render the Lottie animation container
  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
    />
  );
}
