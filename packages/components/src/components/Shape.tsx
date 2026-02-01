import React from 'react';
import type { ShapeProps } from '../types';

/**
 * Generate SVG path for a regular polygon
 */
function polygonPath(sides: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = size / 2 + (size / 2) * Math.cos(angle);
    const y = size / 2 + (size / 2) * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return `M ${points.join(' L ')} Z`;
}

/**
 * Generate SVG path for a star
 */
function starPath(points: number, size: number, innerRadius: number): string {
  const outer = size / 2;
  const inner = outer * innerRadius;
  const pathPoints: string[] = [];

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = size / 2 + radius * Math.cos(angle);
    const y = size / 2 + radius * Math.sin(angle);
    pathPoints.push(`${x},${y}`);
  }

  return `M ${pathPoints.join(' L ')} Z`;
}

/**
 * Shape component for basic shapes
 */
export function Shape({
  shape,
  fill = 'transparent',
  gradient,
  stroke,
  strokeWidth = 0,
  borderRadius = 0,
  sides = 6,
  points = 5,
  innerRadius = 0.5,
  className,
  style,
}: ShapeProps): React.ReactElement {
  // Handle rectangle and simple shapes with CSS
  if (shape === 'rectangle' || shape === 'circle' || shape === 'ellipse') {
    let shapeStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      borderRadius:
        shape === 'circle'
          ? '50%'
          : shape === 'ellipse'
          ? '50%'
          : borderRadius,
      ...style,
    };

    if (gradient) {
      const gradientValue =
        gradient.type === 'linear'
          ? `linear-gradient(${gradient.angle || 0}deg, ${gradient.colors.join(', ')})`
          : `radial-gradient(circle, ${gradient.colors.join(', ')})`;
      shapeStyle.background = gradientValue;
    } else {
      shapeStyle.backgroundColor = fill;
    }

    if (stroke && strokeWidth > 0) {
      shapeStyle.border = `${strokeWidth}px solid ${stroke}`;
    }

    return <div className={className} style={shapeStyle} />;
  }

  // Use SVG for complex shapes
  const size = 100; // We'll scale with viewBox
  let path: string;

  switch (shape) {
    case 'triangle':
      path = polygonPath(3, size);
      break;
    case 'polygon':
      path = polygonPath(sides, size);
      break;
    case 'star':
      path = starPath(points, size, innerRadius);
      break;
    default:
      path = polygonPath(6, size);
  }

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
      preserveAspectRatio="xMidYMid meet"
    >
      {gradient && (
        <defs>
          {gradient.type === 'linear' ? (
            <linearGradient
              id={gradientId}
              gradientTransform={`rotate(${gradient.angle || 0})`}
            >
              {gradient.colors.map((color, i) => (
                <stop
                  key={i}
                  offset={`${(i / (gradient.colors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          ) : (
            <radialGradient id={gradientId}>
              {gradient.colors.map((color, i) => (
                <stop
                  key={i}
                  offset={`${(i / (gradient.colors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </radialGradient>
          )}
        </defs>
      )}
      <path
        d={path}
        fill={gradient ? `url(#${gradientId})` : fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
