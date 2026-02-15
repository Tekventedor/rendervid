import React, { useMemo } from 'react';
import { noise2D, perlin2D, worley2D, valueNoise2D } from '@rendervid/core';
import type { AnimatedProps } from '../types';
import type { NoiseType } from './NoiseBackground';

export interface NoiseDistortionProps extends AnimatedProps {
  /** Type of noise to use for distortion */
  noiseType?: NoiseType;
  /** Seed for deterministic noise */
  seed?: string | number;
  /** Distortion amount in pixels */
  amount?: number;
  /** Scale of the noise pattern */
  scale?: number;
  /** Animation speed multiplier */
  speed?: number;
}

const NOISE_FNS = {
  simplex: noise2D,
  perlin: perlin2D,
  worley: worley2D,
  value: valueNoise2D,
} as const;

/**
 * NoiseDistortion Component
 *
 * Applies procedural noise-based distortion to child elements using SVG
 * displacement map filter. The distortion pattern is deterministic and
 * frame-based for video rendering.
 *
 * @example
 * ```tsx
 * <NoiseDistortion
 *   noiseType="simplex"
 *   seed={42}
 *   amount={20}
 *   scale={0.02}
 *   speed={1}
 *   frame={currentFrame}
 *   fps={30}
 * >
 *   <h1>Distorted Text</h1>
 * </NoiseDistortion>
 * ```
 */
export function NoiseDistortion({
  noiseType = 'simplex',
  seed = 42,
  amount = 10,
  scale = 0.02,
  speed = 1,
  frame = 0,
  fps = 30,
  totalFrames = 300,
  children,
  className,
  style,
}: NoiseDistortionProps): React.ReactElement {
  const noiseFn = NOISE_FNS[noiseType] ?? NOISE_FNS.simplex;
  const time = (frame / (fps || 30)) * speed;

  // Generate a unique filter ID to avoid conflicts with multiple instances
  const filterId = useMemo(
    () => `noise-distortion-${String(seed).replace(/\W/g, '')}-${noiseType}`,
    [seed, noiseType]
  );

  // Generate feTurbulence-like noise texture as SVG path data
  // We create a small noise grid that gets used as displacement
  const textureSize = 64;
  const noiseData = useMemo(() => {
    const pixels: string[] = [];
    for (let y = 0; y < textureSize; y++) {
      for (let x = 0; x < textureSize; x++) {
        const nx = x * scale + Math.sin(time * 0.7) * 5;
        const ny = y * scale + Math.cos(time * 0.7) * 5;
        const val = noiseFn(seed, nx, ny);
        // Map [-1,1] to [0,255] for color channel
        const v = Math.round((val + 1) * 127.5);
        pixels.push(`rgb(${v},${v},128)`);
      }
    }
    return pixels;
  }, [noiseFn, seed, scale, time, textureSize]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: 'absolute' }}
      >
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={scale}
              numOctaves={3}
              seed={typeof seed === 'number' ? seed : seed.length}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={amount * (1 + Math.sin(time * Math.PI * 2) * 0.3)}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          filter: `url(#${filterId})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
