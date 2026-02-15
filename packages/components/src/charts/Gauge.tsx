import React from 'react';
import type { AnimatedProps } from '../types';

export interface GaugeProps extends AnimatedProps {
  /** Current value (will be animated from 0 to this value) */
  value: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Width and height of the gauge */
  size?: number;
  /** Fill color for the gauge arc */
  color?: string;
  /** Background track color */
  trackColor?: string;
  /** Arc stroke width */
  strokeWidth?: number;
  /** Start angle in degrees (0 = top) */
  startAngle?: number;
  /** Sweep angle in degrees (how much arc to draw) */
  sweepAngle?: number;
  /** Animation duration in frames */
  animationDuration?: number;
  /** Show the value text in center */
  showValue?: boolean;
  /** Value format suffix (e.g., "%", "km/h") */
  suffix?: string;
  /** Value format prefix */
  prefix?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Font size for the value text */
  fontSize?: number;
  /** Text color */
  textColor?: string;
  /** Label text below value */
  label?: string;
  /** Label font size */
  labelFontSize?: number;
  /** Background color */
  backgroundColor?: string;
  /** Whether to round the line caps */
  roundCaps?: boolean;
  /** Gradient colors (overrides color if provided) */
  gradientColors?: string[];
}

/**
 * Animated circular gauge component using SVG.
 * Renders a circular arc that fills up based on value.
 */
export function Gauge({
  value,
  min = 0,
  max = 100,
  size = 300,
  color = '#3b82f6',
  trackColor = 'rgba(255, 255, 255, 0.1)',
  strokeWidth = 20,
  startAngle = 135,
  sweepAngle = 270,
  animationDuration = 60,
  showValue = true,
  suffix = '',
  prefix = '',
  decimals = 0,
  fontSize = 48,
  textColor = '#ffffff',
  label,
  labelFontSize = 16,
  backgroundColor = 'transparent',
  roundCaps = true,
  gradientColors,
  frame = 0,
  style,
  className,
}: GaugeProps): React.ReactElement {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 10;

  // Calculate animation progress
  const progress = Math.min(frame / animationDuration, 1);
  const easedProgress = easeOutCubic(progress);

  // Normalize value
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const animatedValue = normalizedValue * easedProgress;
  const displayValue = min + (value - min) * easedProgress;

  // Calculate arc
  const startRad = (startAngle * Math.PI) / 180;
  const sweepRad = (sweepAngle * Math.PI) / 180;
  const endRad = startRad + sweepRad * animatedValue;

  // Generate arc path
  const trackPath = describeArc(center, center, radius, startRad, startRad + sweepRad);
  const valuePath = describeArc(center, center, radius, startRad, endRad);

  // Unique gradient ID
  const gradientId = `gauge-gradient-${Math.round(value * 1000)}`;

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
        {/* Gradient definition */}
        {gradientColors && gradientColors.length >= 2 && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientColors.map((c, i) => (
                <stop
                  key={i}
                  offset={`${(i / (gradientColors.length - 1)) * 100}%`}
                  stopColor={c}
                />
              ))}
            </linearGradient>
          </defs>
        )}

        {/* Background track */}
        <path
          d={trackPath}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap={roundCaps ? 'round' : 'butt'}
        />

        {/* Value arc */}
        {animatedValue > 0 && (
          <path
            d={valuePath}
            fill="none"
            stroke={
              gradientColors && gradientColors.length >= 2
                ? `url(#${gradientId})`
                : color
            }
            strokeWidth={strokeWidth}
            strokeLinecap={roundCaps ? 'round' : 'butt'}
          />
        )}

        {/* Center text */}
        {showValue && (
          <>
            <text
              x={center}
              y={label ? center - 10 : center}
              fill={textColor}
              fontSize={fontSize}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {prefix}
              {displayValue.toFixed(decimals)}
              {suffix}
            </text>
            {label && (
              <text
                x={center}
                y={center + fontSize / 2 + 5}
                fill={textColor}
                fontSize={labelFontSize}
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={0.7}
              >
                {label}
              </text>
            )}
          </>
        )}
      </svg>
    </div>
  );
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = {
    x: cx + radius * Math.cos(startAngle),
    y: cy + radius * Math.sin(startAngle),
  };
  const end = {
    x: cx + radius * Math.cos(endAngle),
    y: cy + radius * Math.sin(endAngle),
  };

  const angleDiff = endAngle - startAngle;
  const largeArcFlag = Math.abs(angleDiff) > Math.PI ? 1 : 0;
  const sweepFlag = angleDiff > 0 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
