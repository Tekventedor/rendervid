import React, { useMemo } from 'react';
import { noise2D, perlin2D, worley2D, valueNoise2D } from '@rendervid/core';
import type { AnimatedProps } from '../types';

export type NoiseType = 'simplex' | 'perlin' | 'worley' | 'value';

export interface NoiseBackgroundProps extends AnimatedProps {
  /** Type of noise to use */
  noiseType?: NoiseType;
  /** Seed for deterministic noise */
  seed?: string | number;
  /** Scale of the noise pattern (higher = more zoomed in) */
  scale?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Array of colors for the gradient mapping */
  colors?: string[];
  /** Number of fBm octaves */
  octaves?: number;
  /** Width of the canvas */
  width?: number;
  /** Height of the canvas */
  height?: number;
  /** Resolution divisor for performance (e.g., 4 means 1/4 resolution) */
  resolution?: number;
}

const NOISE_FNS = {
  simplex: noise2D,
  perlin: perlin2D,
  worley: worley2D,
  value: valueNoise2D,
} as const;

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function lerpColor(
  c1: [number, number, number],
  c2: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

function mapToGradient(value: number, colors: [number, number, number][]): [number, number, number] {
  // value is in [-1, 1], map to [0, 1]
  const t = (value + 1) * 0.5;
  const segment = t * (colors.length - 1);
  const idx = Math.min(Math.floor(segment), colors.length - 2);
  const frac = segment - idx;
  return lerpColor(colors[idx], colors[idx + 1], frac);
}

/**
 * NoiseBackground Component
 *
 * Renders an animated procedural noise background using SVG.
 * Uses noise functions from @rendervid/core to generate deterministic
 * patterns suitable for video rendering.
 *
 * @example
 * ```tsx
 * <NoiseBackground
 *   noiseType="simplex"
 *   seed={42}
 *   scale={0.01}
 *   speed={1}
 *   colors={['#000000', '#1a0533', '#4c00ff', '#ff0080']}
 *   frame={currentFrame}
 *   fps={30}
 *   totalFrames={300}
 *   width={1920}
 *   height={1080}
 * />
 * ```
 */
export function NoiseBackground({
  noiseType = 'simplex',
  seed = 42,
  scale = 0.005,
  speed = 1,
  colors = ['#000000', '#1a237e', '#4a148c', '#e91e63'],
  octaves = 4,
  width = 1920,
  height = 1080,
  resolution = 8,
  frame = 0,
  totalFrames = 300,
  fps = 30,
  className,
  style,
}: NoiseBackgroundProps): React.ReactElement {
  const noiseFn = NOISE_FNS[noiseType] ?? NOISE_FNS.simplex;
  const parsedColors = useMemo(() => colors.map(hexToRgb), [colors]);

  const cellW = resolution;
  const cellH = resolution;
  const cols = Math.ceil(width / cellW);
  const rows = Math.ceil(height / cellH);

  const time = (frame / (fps || 30)) * speed;

  const rects = useMemo(() => {
    const result: React.ReactElement[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * cellW;
        const py = row * cellH;

        // Multi-octave noise (simple fBm inline)
        let value = 0;
        let amplitude = 1;
        let frequency = 1;
        let maxAmp = 0;
        for (let o = 0; o < octaves; o++) {
          const nx = (px * scale * frequency) + Math.sin(time * 0.7) * 10;
          const ny = (py * scale * frequency) + Math.cos(time * 0.7) * 10;
          value += amplitude * noiseFn(seed, nx, ny);
          maxAmp += amplitude;
          amplitude *= 0.5;
          frequency *= 2;
        }
        value /= maxAmp;

        const [r, g, b] = mapToGradient(value, parsedColors);

        result.push(
          <rect
            key={`${col}-${row}`}
            x={px}
            y={py}
            width={cellW}
            height={cellH}
            fill={`rgb(${r},${g},${b})`}
          />
        );
      }
    }

    return result;
  }, [noiseFn, seed, scale, time, octaves, parsedColors, rows, cols, cellW, cellH]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{
        display: 'block',
        ...style,
      }}
    >
      {rects}
    </svg>
  );
}
