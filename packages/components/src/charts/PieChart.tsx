import React from 'react';
import type { AnimatedProps } from '../types';

export interface PieChartData {
  value: number;
  label: string;
  color?: string;
}

export interface PieChartProps extends AnimatedProps {
  /** Data for the pie chart */
  data: PieChartData[];
  /** Default colors if not specified in data */
  colors?: string[];
  /** Width and height of the chart */
  size?: number;
  /** Inner radius for donut chart (0-1, 0 = pie, 0.5 = donut) */
  innerRadius?: number;
  /** Animation duration in frames */
  animationDuration?: number;
  /** Show labels */
  showLabels?: boolean;
  /** Show values */
  showValues?: boolean;
  /** Show percentages */
  showPercentages?: boolean;
  /** Font size */
  fontSize?: number;
  /** Text color */
  textColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Slice stroke width */
  strokeWidth?: number;
  /** Slice stroke color */
  strokeColor?: string;
  /** Start angle in degrees */
  startAngle?: number;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

/**
 * Animated pie/donut chart component
 */
export function PieChart({
  data,
  colors = DEFAULT_COLORS,
  size = 400,
  innerRadius = 0,
  animationDuration = 60,
  showLabels = true,
  showValues = false,
  showPercentages = true,
  fontSize = 14,
  textColor = '#ffffff',
  backgroundColor = 'transparent',
  strokeWidth = 2,
  strokeColor = '#000000',
  startAngle = -90,
  frame = 0,
  style,
  className,
}: PieChartProps): React.ReactElement {
  const center = size / 2;
  const radius = (size / 2) - 40;
  const innerRadiusPixels = radius * innerRadius;

  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate animation progress
  const progress = Math.min(frame / animationDuration, 1);
  const easedProgress = easeOutCubic(progress);

  // Calculate slices
  let currentAngle = startAngle;
  const slices = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360 * easedProgress;
    const slice = {
      ...item,
      color: item.color || colors[index % colors.length],
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      percentage: percentage * 100,
      midAngle: currentAngle + angle / 2,
    };
    currentAngle += angle;
    return slice;
  });

  // Generate SVG path for a slice
  const generateSlicePath = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number
  ): string => {
    const start = polarToCartesian(center, center, outerRadius, endAngle);
    const end = polarToCartesian(center, center, outerRadius, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    if (innerRadius === 0) {
      // Pie chart
      return [
        `M ${center} ${center}`,
        `L ${start.x} ${start.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
        'Z',
      ].join(' ');
    } else {
      // Donut chart
      const innerStart = polarToCartesian(center, center, innerRadius, endAngle);
      const innerEnd = polarToCartesian(center, center, innerRadius, startAngle);

      return [
        `M ${start.x} ${start.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
        'Z',
      ].join(' ');
    }
  };

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor,
        ...style,
      }}
    >
      <svg width={size} height={size}>
        {/* Slices */}
        {slices.map((slice, index) => {
          if (slice.endAngle <= slice.startAngle) return null;

          const path = generateSlicePath(
            slice.startAngle,
            slice.endAngle,
            radius,
            innerRadiusPixels
          );

          // Calculate label position
          const labelRadius = innerRadiusPixels + (radius - innerRadiusPixels) / 2;
          const labelPos = polarToCartesian(
            center,
            center,
            labelRadius,
            slice.midAngle
          );

          return (
            <g key={index}>
              {/* Slice */}
              <path
                d={path}
                fill={slice.color}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />

              {/* Label */}
              {(showLabels || showValues || showPercentages) &&
                slice.endAngle - slice.startAngle > 10 && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill={textColor}
                    fontSize={fontSize}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontWeight="bold"
                  >
                    {showPercentages && `${slice.percentage.toFixed(1)}%`}
                    {showValues && ` (${slice.value})`}
                  </text>
                )}
            </g>
          );
        })}

        {/* Center label for donut */}
        {innerRadius > 0 && (
          <text
            x={center}
            y={center}
            fill={textColor}
            fontSize={fontSize * 1.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="bold"
          >
            {total}
          </text>
        )}
      </svg>

      {/* Legend */}
      {showLabels && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
          }}
        >
          {slices.map((slice, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: fontSize * 0.9,
                color: textColor,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: slice.color,
                  borderRadius: 2,
                }}
              />
              <span>{slice.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
