import React, { useMemo } from 'react';
import type { AnimatedProps } from '../types';

/**
 * Glitch effect types
 */
export type GlitchType = 'slice' | 'shift' | 'rgb-split' | 'noise' | 'scramble';

/**
 * GlitchEffect component props
 */
export interface GlitchEffectProps extends AnimatedProps {
  /** Type of glitch effect */
  type: GlitchType;
  /** Intensity of the glitch (0-1) */
  intensity?: number;
  /** Number of glitches per second */
  frequency?: number;
  /** Duration of each glitch in milliseconds */
  duration?: number;
}

/**
 * Seeded random number generator for deterministic glitches
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Check if glitch should be active at current frame
 */
function isGlitchActive(
  frame: number,
  fps: number = 30,
  frequency: number = 0.1,
  duration: number = 100
): boolean {
  const timeMs = (frame / fps) * 1000;
  const intervalMs = 1000 / frequency;

  // Find which glitch cycle we're in
  const cycleIndex = Math.floor(timeMs / intervalMs);
  const cycleStartMs = cycleIndex * intervalMs;
  const cycleTime = timeMs - cycleStartMs;

  // Use seeded random to determine glitch start time within cycle
  const glitchDelay = seededRandom(cycleIndex) * (intervalMs - duration);

  return cycleTime >= glitchDelay && cycleTime < glitchDelay + duration;
}

/**
 * Generate random values for glitch effects with seeded randomness
 */
function getGlitchValues(frame: number, seed: number) {
  return {
    offset1: seededRandom(seed * 1.1) * 2 - 1,
    offset2: seededRandom(seed * 1.2) * 2 - 1,
    offset3: seededRandom(seed * 1.3) * 2 - 1,
    slice1: seededRandom(seed * 2.1),
    slice2: seededRandom(seed * 2.2),
    slice3: seededRandom(seed * 2.3),
    rotation: seededRandom(seed * 3.1) * 2 - 1,
  };
}

/**
 * GlitchEffect Component
 *
 * Creates digital distortion effects on wrapped content. Supports multiple glitch types
 * including slice, shift, RGB split, noise, and scramble effects.
 *
 * @example
 * ```tsx
 * <GlitchEffect
 *   type="rgb-split"
 *   intensity={0.8}
 *   frequency={0.2}
 *   duration={150}
 *   frame={frame}
 *   fps={30}
 * >
 *   <Text text="Glitchy Text" fontSize={64} />
 * </GlitchEffect>
 * ```
 */
export function GlitchEffect({
  type,
  intensity = 0.5,
  frequency = 0.1,
  duration = 100,
  frame,
  fps = 30,
  totalFrames,
  className,
  style,
  children,
}: GlitchEffectProps): React.ReactElement {
  const isActive = isGlitchActive(frame, fps, frequency, duration);

  const glitchSeed = useMemo(() => {
    return Math.floor((frame / fps) * frequency * 1000);
  }, [frame, fps, frequency]);

  const values = useMemo(() => {
    return getGlitchValues(frame, glitchSeed);
  }, [frame, glitchSeed]);

  // If glitch is not active, render children normally
  if (!isActive) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  // Apply different glitch effects based on type
  switch (type) {
    case 'slice':
      return renderSliceGlitch(values, intensity, className, style, children);

    case 'shift':
      return renderShiftGlitch(values, intensity, className, style, children);

    case 'rgb-split':
      return renderRgbSplitGlitch(values, intensity, className, style, children);

    case 'noise':
      return renderNoiseGlitch(values, intensity, className, style, children);

    case 'scramble':
      return renderScrambleGlitch(values, intensity, className, style, children);

    default:
      return (
        <div className={className} style={style}>
          {children}
        </div>
      );
  }
}

/**
 * Slice glitch effect - creates horizontal slices with displacement
 */
function renderSliceGlitch(
  values: ReturnType<typeof getGlitchValues>,
  intensity: number,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode
): React.ReactElement {
  const numSlices = 5;
  const slices = [];

  for (let i = 0; i < numSlices; i++) {
    const seed = values.slice1 + i * 0.3;
    const offset = (seededRandom(seed) * 2 - 1) * 20 * intensity;
    const sliceHeight = 100 / numSlices;
    const top = i * sliceHeight;

    slices.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${top}%`,
          left: 0,
          width: '100%',
          height: `${sliceHeight}%`,
          overflow: 'hidden',
          transform: `translateX(${offset}px)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            top: `${-top}%`,
            height: `${100 * numSlices}%`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {slices}
    </div>
  );
}

/**
 * Shift glitch effect - randomly shifts content position
 */
function renderShiftGlitch(
  values: ReturnType<typeof getGlitchValues>,
  intensity: number,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode
): React.ReactElement {
  const shiftX = values.offset1 * 15 * intensity;
  const shiftY = values.offset2 * 10 * intensity;
  const skewX = values.offset3 * 5 * intensity;

  return (
    <div
      className={className}
      style={{
        transform: `translate(${shiftX}px, ${shiftY}px) skew(${skewX}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * RGB split glitch effect - separates RGB channels
 */
function renderRgbSplitGlitch(
  values: ReturnType<typeof getGlitchValues>,
  intensity: number,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode
): React.ReactElement {
  const offsetR = values.offset1 * 10 * intensity;
  const offsetG = values.offset2 * 8 * intensity;
  const offsetB = values.offset3 * 12 * intensity;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {/* Red channel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translateX(${offsetR}px)`,
          mixBlendMode: 'screen',
          opacity: 0.8,
        }}
      >
        <div style={{ filter: 'brightness(1) contrast(1.2) hue-rotate(0deg)' }}>
          {children}
        </div>
      </div>

      {/* Green channel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translateX(${offsetG}px) translateY(${offsetG * 0.5}px)`,
          mixBlendMode: 'screen',
          opacity: 0.8,
        }}
      >
        <div style={{ filter: 'brightness(1) contrast(1.2) hue-rotate(120deg)' }}>
          {children}
        </div>
      </div>

      {/* Blue channel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translateX(${offsetB}px) translateY(${-offsetB * 0.3}px)`,
          mixBlendMode: 'screen',
          opacity: 0.8,
        }}
      >
        <div style={{ filter: 'brightness(1) contrast(1.2) hue-rotate(240deg)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Noise glitch effect - adds digital noise overlay
 */
function renderNoiseGlitch(
  values: ReturnType<typeof getGlitchValues>,
  intensity: number,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode
): React.ReactElement {
  // Generate noise pattern using canvas
  const noiseIntensity = intensity * 0.3;
  const contrast = 1 + intensity * 0.5;
  const brightness = 1 + values.offset1 * 0.1 * intensity;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {/* Content with filter */}
      <div
        style={{
          filter: `contrast(${contrast}) brightness(${brightness}) saturate(${1 + intensity * 0.5})`,
        }}
      >
        {children}
      </div>

      {/* Noise overlay using SVG filter */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: noiseIntensity,
          mixBlendMode: 'overlay',
        }}
      >
        <svg width="100%" height="100%" style={{ display: 'block' }}>
          <filter id={`noise-${values.slice1}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.8 + values.slice2 * 0.4}
              numOctaves={4}
              seed={Math.floor(values.slice1 * 1000)}
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter={`url(#noise-${values.slice1})`}
          />
        </svg>
      </div>

      {/* Scanlines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
          opacity: intensity * 0.5,
        }}
      />
    </div>
  );
}

/**
 * Scramble glitch effect - creates chaotic displacement with multiple layers
 */
function renderScrambleGlitch(
  values: ReturnType<typeof getGlitchValues>,
  intensity: number,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode
): React.ReactElement {
  const layers = [];
  const numLayers = 7;

  for (let i = 0; i < numLayers; i++) {
    const seed = values.slice1 + i * 0.2;
    const offsetX = (seededRandom(seed) * 2 - 1) * 25 * intensity;
    const offsetY = (seededRandom(seed * 1.1) * 2 - 1) * 15 * intensity;
    const scaleX = 1 + (seededRandom(seed * 1.2) * 2 - 1) * 0.15 * intensity;
    const scaleY = 1 + (seededRandom(seed * 1.3) * 2 - 1) * 0.1 * intensity;
    const rotation = (seededRandom(seed * 1.4) * 2 - 1) * 3 * intensity;
    const opacity = 0.2 + seededRandom(seed * 1.5) * 0.3;

    // Random clip paths for fragmentation
    const clipHeight = 10 + seededRandom(seed * 1.6) * 30;
    const clipTop = seededRandom(seed * 1.7) * (100 - clipHeight);

    layers.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `
            translate(${offsetX}px, ${offsetY}px)
            scale(${scaleX}, ${scaleY})
            rotate(${rotation}deg)
          `,
          opacity,
          clipPath: `polygon(
            0% ${clipTop}%,
            100% ${clipTop}%,
            100% ${clipTop + clipHeight}%,
            0% ${clipTop + clipHeight}%
          )`,
          mixBlendMode: i % 3 === 0 ? 'screen' : i % 3 === 1 ? 'difference' : 'overlay',
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {/* Original layer */}
      <div style={{ opacity: 0.7 }}>
        {children}
      </div>

      {/* Scrambled layers */}
      {layers}
    </div>
  );
}
