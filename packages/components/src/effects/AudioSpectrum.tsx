import React, { useMemo } from 'react';
import { visualizeAudio } from '@rendervid/core';
import type { AudioData } from '@rendervid/core';
import type { AnimatedProps } from '../types';

/** Spectrum layout style */
export type SpectrumLayout = 'bars' | 'circular';

/** Props for the AudioSpectrum component */
export interface AudioSpectrumProps extends AnimatedProps {
  /** Decoded audio data from getAudioData() */
  audioData: AudioData;
  /** Layout style (default 'bars') */
  layout?: SpectrumLayout;
  /** Number of frequency bands to display (default 32) */
  bands?: number;
  /** Minimum frequency in Hz (default 20) */
  minFreq?: number;
  /** Maximum frequency in Hz (default 16000) */
  maxFreq?: number;
  /** Color map: single color string or array of colors for gradient (default '#00ff88') */
  colorMap?: string | string[];
  /** SVG width (default 400) */
  width?: number;
  /** SVG height (default 200) */
  height?: number;
  /** Smoothing factor 0-1 (default 0.6) */
  smoothing?: number;
  /** Bar border radius (default 2) */
  barRadius?: number;
  /** Gap between bars in pixels (default 2) */
  barGap?: number;
}

/**
 * AudioSpectrum - Renders frequency spectrum visualization as SVG.
 *
 * Supports bars and circular layouts with color mapping.
 * Pure/deterministic rendering suitable for video export.
 */
export const AudioSpectrum: React.FC<AudioSpectrumProps> = ({
  audioData,
  frame,
  fps = 30,
  layout = 'bars',
  bands = 32,
  minFreq = 20,
  maxFreq = 16000,
  colorMap = '#00ff88',
  width = 400,
  height = 200,
  smoothing = 0.6,
  barRadius = 2,
  barGap = 2,
  className,
  style,
}) => {
  // Get full spectrum then extract relevant frequency range
  const spectrum = useMemo(() => {
    const fullSpectrum = visualizeAudio({
      audioData,
      frame,
      fps,
      numberOfSamples: 256,
      smoothingTimeConstant: smoothing,
    });

    // Map frequency range to bin indices
    const nyquist = audioData.sampleRate / 2;
    const minBin = Math.floor((minFreq / nyquist) * fullSpectrum.length);
    const maxBin = Math.ceil((maxFreq / nyquist) * fullSpectrum.length);
    const rangeSize = Math.max(1, maxBin - minBin);

    // Downsample to requested number of bands
    const result: number[] = new Array(bands);
    const binSize = rangeSize / bands;

    for (let i = 0; i < bands; i++) {
      const start = minBin + Math.floor(i * binSize);
      const end = minBin + Math.floor((i + 1) * binSize);
      let sum = 0;
      let count = 0;
      for (let j = start; j < end && j < fullSpectrum.length; j++) {
        sum += fullSpectrum[j];
        count++;
      }
      result[i] = count > 0 ? sum / count : 0;
    }

    return result;
  }, [audioData, frame, fps, bands, minFreq, maxFreq, smoothing]);

  const svgContent = useMemo(() => {
    if (layout === 'circular') {
      return renderCircular(spectrum, width, height, colorMap, barGap);
    }
    return renderBars(spectrum, width, height, colorMap, barRadius, barGap);
  }, [spectrum, layout, width, height, colorMap, barRadius, barGap]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {svgContent}
    </svg>
  );
};

function getColorForIndex(
  index: number,
  total: number,
  colorMap: string | string[]
): string {
  if (typeof colorMap === 'string') return colorMap;
  if (colorMap.length === 0) return '#ffffff';
  if (colorMap.length === 1) return colorMap[0];

  const t = index / Math.max(1, total - 1);
  const segment = t * (colorMap.length - 1);
  const idx = Math.min(Math.floor(segment), colorMap.length - 2);
  const frac = segment - idx;

  return interpolateHexColor(colorMap[idx], colorMap[idx + 1], frac);
}

function interpolateHexColor(c1: string, c2: string, t: number): string {
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function renderBars(
  spectrum: number[],
  width: number,
  height: number,
  colorMap: string | string[],
  barRadius: number,
  barGap: number
): React.ReactNode {
  const numBars = spectrum.length;
  const barWidth = Math.max(1, (width - barGap * (numBars - 1)) / numBars);

  return (
    <g>
      {spectrum.map((value, i) => {
        const barHeight = Math.max(2, value * height * 0.95);
        const x = i * (barWidth + barGap);
        const y = height - barHeight;
        const barColor = getColorForIndex(i, numBars, colorMap);

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={barRadius}
            ry={barRadius}
            fill={barColor}
          />
        );
      })}
    </g>
  );
}

function renderCircular(
  spectrum: number[],
  width: number,
  height: number,
  colorMap: string | string[],
  barGap: number
): React.ReactNode {
  const centerX = width / 2;
  const centerY = height / 2;
  const innerRadius = Math.min(width, height) * 0.15;
  const maxBarLength = Math.min(width, height) * 0.3;
  const numBars = spectrum.length;
  const angleStep = (Math.PI * 2) / numBars;
  const barWidth = Math.max(1, (angleStep * innerRadius) - barGap);

  return (
    <g>
      {spectrum.map((value, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const barLength = Math.max(2, value * maxBarLength);
        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * (innerRadius + barLength);
        const y2 = centerY + Math.sin(angle) * (innerRadius + barLength);
        const barColor = getColorForIndex(i, numBars, colorMap);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={barColor}
            strokeWidth={barWidth}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}
