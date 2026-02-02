import React from 'react';
import type { AnimatedProps } from '../types';

export interface LineChartProps extends AnimatedProps {
  /** Data points for the chart */
  data: number[];
  /** Labels for x-axis */
  labels?: string[];
  /** Line color */
  color?: string;
  /** Width of the chart */
  width?: number;
  /** Height of the chart */
  height?: number;
  /** Line thickness */
  strokeWidth?: number;
  /** Animation duration in frames */
  animationDuration?: number;
  /** Show data points */
  showPoints?: boolean;
  /** Point radius */
  pointRadius?: number;
  /** Show values on points */
  showValues?: boolean;
  /** Fill area under line */
  fillArea?: boolean;
  /** Fill color/gradient */
  fillColor?: string;
  /** Show grid lines */
  showGrid?: boolean;
  /** Grid color */
  gridColor?: string;
  /** Font size */
  fontSize?: number;
  /** Text color */
  textColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Smooth curve */
  smooth?: boolean;
}

/**
 * Animated line chart with drawing animation
 */
export function LineChart({
  data,
  labels,
  color = '#3b82f6',
  width = 800,
  height = 400,
  strokeWidth = 3,
  animationDuration = 60,
  showPoints = true,
  pointRadius = 6,
  showValues = false,
  fillArea = false,
  fillColor,
  showGrid = true,
  gridColor = 'rgba(255, 255, 255, 0.1)',
  fontSize = 12,
  textColor = '#ffffff',
  backgroundColor = 'transparent',
  smooth = true,
  frame = 0,
  style,
  className,
}: LineChartProps): React.ReactElement {
  const padding = 50;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data, 0);
  const valueRange = maxValue - minValue;

  // Calculate animation progress
  const progress = Math.min(frame / animationDuration, 1);

  // Calculate points
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
    return { x, y, value };
  });

  // Generate SVG path
  const generatePath = (toIndex: number) => {
    if (toIndex < 1) return '';

    const visiblePoints = points.slice(0, toIndex + 1);
    if (visiblePoints.length === 0) return '';

    let path = `M ${visiblePoints[0].x} ${visiblePoints[0].y}`;

    if (smooth && visiblePoints.length > 2) {
      // Catmull-Rom spline
      for (let i = 0; i < visiblePoints.length - 1; i++) {
        const p0 = visiblePoints[Math.max(0, i - 1)];
        const p1 = visiblePoints[i];
        const p2 = visiblePoints[i + 1];
        const p3 = visiblePoints[Math.min(visiblePoints.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
    } else {
      // Straight lines
      for (let i = 1; i < visiblePoints.length; i++) {
        path += ` L ${visiblePoints[i].x} ${visiblePoints[i].y}`;
      }
    }

    return path;
  };

  const currentPointIndex = Math.floor(progress * (data.length - 1));
  const linePath = generatePath(currentPointIndex);

  // Fill area path
  const fillPath = fillArea && linePath
    ? `${linePath} L ${points[currentPointIndex].x} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`
    : '';

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        width,
        height,
        backgroundColor,
        ...style,
      }}
    >
      <svg width={width} height={height}>
        {/* Grid lines */}
        {showGrid && (
          <g>
            {/* Horizontal grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding + chartHeight * (1 - ratio);
              return (
                <line
                  key={`h-${i}`}
                  x1={padding}
                  y1={y}
                  x2={padding + chartWidth}
                  y2={y}
                  stroke={gridColor}
                  strokeWidth={1}
                />
              );
            })}
            {/* Vertical grid */}
            {data.map((_, index) => {
              const x = padding + (index / (data.length - 1)) * chartWidth;
              return (
                <line
                  key={`v-${index}`}
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={padding + chartHeight}
                  stroke={gridColor}
                  strokeWidth={1}
                />
              );
            })}
          </g>
        )}

        {/* Fill area */}
        {fillArea && fillPath && (
          <path
            d={fillPath}
            fill={fillColor || `${color}40`}
            opacity={0.3}
          />
        )}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Points */}
        {showPoints &&
          points.slice(0, currentPointIndex + 1).map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={pointRadius}
                fill={color}
                stroke="#ffffff"
                strokeWidth={2}
              />
              {/* Value label */}
              {showValues && (
                <text
                  x={point.x}
                  y={point.y - pointRadius - 8}
                  fill={textColor}
                  fontSize={fontSize}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {Math.round(point.value)}
                </text>
              )}
            </g>
          ))}

        {/* X-axis labels */}
        {labels &&
          labels.map((label, index) => {
            if (index > currentPointIndex) return null;
            const x = padding + (index / (data.length - 1)) * chartWidth;
            return (
              <text
                key={index}
                x={x}
                y={padding + chartHeight + 20}
                fill={textColor}
                fontSize={fontSize}
                textAnchor="middle"
              >
                {label}
              </text>
            );
          })}
      </svg>
    </div>
  );
}
