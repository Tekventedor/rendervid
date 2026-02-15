import React, { useMemo } from 'react';
import { visualizeAudioWaveform, createSmoothSvgPath } from '@rendervid/core';
import type { AudioData } from '@rendervid/core';
import type { AnimatedProps } from '../types';

/** Waveform visualization style */
export type WaveformStyle = 'bars' | 'line' | 'mirror';

/** Props for the AudioWaveform component */
export interface AudioWaveformProps extends AnimatedProps {
  /** Decoded audio data from getAudioData() */
  audioData: AudioData;
  /** Visualization style */
  waveformStyle?: WaveformStyle;
  /** Width of each bar in pixels (bars style only, default 3) */
  barWidth?: number;
  /** Gap between bars in pixels (bars style only, default 1) */
  barGap?: number;
  /** Color of the waveform (default '#ffffff') */
  color?: string;
  /** Smoothing factor 0-1 for line style (default 0.5) */
  smoothing?: number;
  /** SVG width (default 400) */
  width?: number;
  /** SVG height (default 200) */
  height?: number;
  /** Number of samples to visualize (default 64) */
  numberOfSamples?: number;
  /** Border radius for bars (default 1) */
  barRadius?: number;
}

/**
 * AudioWaveform - Renders audio waveform visualization as SVG.
 *
 * Supports bars, line, and mirror styles.
 * Pure/deterministic rendering suitable for video export.
 */
export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioData,
  frame,
  fps = 30,
  waveformStyle = 'bars',
  barWidth = 3,
  barGap = 1,
  color = '#ffffff',
  smoothing = 0.5,
  width = 400,
  height = 200,
  numberOfSamples = 64,
  barRadius = 1,
  className,
  style,
}) => {
  const waveform = useMemo(() => {
    return visualizeAudioWaveform({
      audioData,
      frame,
      fps,
      numberOfSamples,
    });
  }, [audioData, frame, fps, numberOfSamples]);

  const svgContent = useMemo(() => {
    if (waveformStyle === 'bars') {
      return renderBars(waveform, width, height, barWidth, barGap, color, barRadius);
    } else if (waveformStyle === 'line') {
      return renderLine(waveform, width, height, color, smoothing);
    } else {
      return renderMirror(waveform, width, height, barWidth, barGap, color, barRadius);
    }
  }, [waveform, waveformStyle, width, height, barWidth, barGap, color, smoothing, barRadius]);

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

function renderBars(
  waveform: number[],
  width: number,
  height: number,
  barWidth: number,
  barGap: number,
  color: string,
  barRadius: number
): React.ReactNode {
  const totalBarWidth = barWidth + barGap;
  const numBars = Math.min(waveform.length, Math.floor(width / totalBarWidth));
  const startX = (width - numBars * totalBarWidth + barGap) / 2;
  const centerY = height / 2;

  return (
    <g>
      {Array.from({ length: numBars }, (_, i) => {
        const amplitude = Math.abs(waveform[i] || 0);
        const barHeight = Math.max(2, amplitude * height * 0.9);
        const x = startX + i * totalBarWidth;
        const y = centerY - barHeight / 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={barRadius}
            ry={barRadius}
            fill={color}
          />
        );
      })}
    </g>
  );
}

function renderLine(
  waveform: number[],
  width: number,
  height: number,
  color: string,
  smoothing: number
): React.ReactNode {
  const centerY = height / 2;
  const points: Array<[number, number]> = waveform.map((val, i) => {
    const x = (i / (waveform.length - 1)) * width;
    const y = centerY + val * centerY * 0.9;
    return [x, y];
  });

  // Apply smoothing by averaging adjacent values
  if (smoothing > 0 && points.length > 2) {
    for (let pass = 0; pass < Math.ceil(smoothing * 3); pass++) {
      for (let i = 1; i < points.length - 1; i++) {
        points[i][1] = points[i][1] * (1 - smoothing * 0.3) +
          (points[i - 1][1] + points[i + 1][1]) * 0.5 * smoothing * 0.3;
      }
    }
  }

  const pathData = createSmoothSvgPath(points);

  return (
    <path
      d={pathData}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function renderMirror(
  waveform: number[],
  width: number,
  height: number,
  barWidth: number,
  barGap: number,
  color: string,
  barRadius: number
): React.ReactNode {
  const totalBarWidth = barWidth + barGap;
  const numBars = Math.min(waveform.length, Math.floor(width / totalBarWidth));
  const startX = (width - numBars * totalBarWidth + barGap) / 2;
  const centerY = height / 2;

  return (
    <g>
      {Array.from({ length: numBars }, (_, i) => {
        const amplitude = Math.abs(waveform[i] || 0);
        const halfBarHeight = Math.max(1, amplitude * (height / 2) * 0.9);
        const x = startX + i * totalBarWidth;
        return (
          <g key={i}>
            {/* Top half */}
            <rect
              x={x}
              y={centerY - halfBarHeight}
              width={barWidth}
              height={halfBarHeight}
              rx={barRadius}
              ry={barRadius}
              fill={color}
            />
            {/* Bottom half (mirrored) */}
            <rect
              x={x}
              y={centerY}
              width={barWidth}
              height={halfBarHeight}
              rx={barRadius}
              ry={barRadius}
              fill={color}
              opacity={0.6}
            />
          </g>
        );
      })}
    </g>
  );
}
