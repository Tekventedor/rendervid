import React from 'react';
import type { AnimatedProps } from '../types';

export interface BarChartProps extends AnimatedProps {
  /** Data points for the chart */
  data: number[];
  /** Labels for each bar */
  labels?: string[];
  /** Bar colors (single color or array for each bar) */
  colors?: string | string[];
  /** Width of the chart */
  width?: number;
  /** Height of the chart */
  height?: number;
  /** Animation duration in frames */
  animationDuration?: number;
  /** Show values on bars */
  showValues?: boolean;
  /** Show labels below bars */
  showLabels?: boolean;
  /** Bar spacing in pixels */
  spacing?: number;
  /** Border radius for bars */
  borderRadius?: number;
  /** Font size for labels and values */
  fontSize?: number;
  /** Text color */
  textColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Animation easing */
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

/**
 * Animated bar chart component
 */
export function BarChart({
  data,
  labels,
  colors = '#3b82f6',
  width = 800,
  height = 400,
  animationDuration = 30,
  showValues = true,
  showLabels = true,
  spacing = 10,
  borderRadius = 4,
  fontSize = 14,
  textColor = '#ffffff',
  backgroundColor = 'transparent',
  easing = 'easeOut',
  frame = 0,
  style,
  className,
}: BarChartProps): React.ReactElement {
  const maxValue = Math.max(...data);
  const barCount = data.length;
  const chartPadding = 40;
  const labelHeight = showLabels ? 30 : 0;
  const valueHeight = showValues ? 25 : 0;
  const chartHeight = height - chartPadding - labelHeight - valueHeight;
  const chartWidth = width - chartPadding * 2;
  const barWidth = (chartWidth - spacing * (barCount - 1)) / barCount;

  // Calculate animation progress
  const progress = Math.min(frame / animationDuration, 1);

  // Apply easing
  const easedProgress = applyEasing(progress, easing);

  // Get bar colors
  const getBarColor = (index: number): string => {
    if (Array.isArray(colors)) {
      return colors[index % colors.length];
    }
    return colors;
  };

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        width,
        height,
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: chartPadding,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: chartHeight,
          display: 'flex',
          alignItems: 'flex-end',
          gap: spacing,
        }}
      >
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * chartHeight * easedProgress;
          const color = getBarColor(index);

          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              {/* Value above bar */}
              {showValues && progress > 0.5 && (
                <div
                  style={{
                    fontSize,
                    color: textColor,
                    fontWeight: 'bold',
                    marginBottom: 5,
                    opacity: (progress - 0.5) * 2,
                  }}
                >
                  {Math.round(value * easedProgress)}
                </div>
              )}

              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: barHeight,
                  backgroundColor: color,
                  borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
                  transition: 'height 0.1s ease-out',
                }}
              />

              {/* Label below bar */}
              {showLabels && labels && labels[index] && (
                <div
                  style={{
                    fontSize: fontSize * 0.9,
                    color: textColor,
                    marginTop: 8,
                    textAlign: 'center',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {labels[index]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function applyEasing(t: number, easing: string): number {
  switch (easing) {
    case 'easeIn':
      return t * t;
    case 'easeOut':
      return t * (2 - t);
    case 'easeInOut':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case 'linear':
    default:
      return t;
  }
}
