import React from 'react';
import type { ShapeLayer as ShapeLayerType, Gradient } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';

export interface ShapeLayerProps {
  layer: ShapeLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
}

/**
 * Convert gradient to SVG gradient definition.
 */
function createGradientDef(gradient: Gradient, id: string): React.ReactNode {
  const { type, colors, angle = 0 } = gradient;

  if (type === 'radial') {
    return (
      <radialGradient id={id} cx="50%" cy="50%" r="50%">
        {colors.map((stop, i) => (
          <stop key={i} offset={`${stop.offset * 100}%`} stopColor={stop.color} />
        ))}
      </radialGradient>
    );
  }

  // Linear gradient
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 + Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 - Math.sin(rad) * 50;

  return (
    <linearGradient id={id} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}>
      {colors.map((stop, i) => (
        <stop key={i} offset={`${stop.offset * 100}%`} stopColor={stop.color} />
      ))}
    </linearGradient>
  );
}

/**
 * Generate polygon points for regular polygons.
 */
function generatePolygonPoints(sides: number, width: number, height: number): string {
  const points: string[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(' ');
}

/**
 * Generate star points.
 */
function generateStarPoints(
  points: number,
  width: number,
  height: number,
  innerRadius: number
): string {
  const result: string[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2;
  const inner = outerRadius * innerRadius;

  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : inner;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    result.push(`${x},${y}`);
  }

  return result.join(' ');
}

export function ShapeLayer({ layer, frame, fps, sceneDuration }: ShapeLayerProps) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  const {
    shape,
    fill,
    gradient,
    stroke,
    strokeWidth = 0,
    strokeDash,
    borderRadius = 0,
    sides = 6,
    points = 5,
    innerRadius = 0.5,
    pathData,
  } = layer.props;

  const { width, height } = layer.size;
  const gradientId = `gradient-${layer.id}`;
  const fillValue = gradient ? `url(#${gradientId})` : fill || 'transparent';

  // Resolve layer style
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};

  // Apply anchor point (default is 0, 0 = top-left for backward compatibility)
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - (layer.size.width * anchor.x);
  const top = layer.position.y - (layer.size.height * anchor.y);

  const renderShape = () => {
    switch (shape) {
      case 'rectangle':
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={width - strokeWidth}
            height={height - strokeWidth}
            rx={borderRadius}
            ry={borderRadius}
            fill={fillValue}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash?.join(' ')}
          />
        );

      case 'ellipse':
        return (
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={(width - strokeWidth) / 2}
            ry={(height - strokeWidth) / 2}
            fill={fillValue}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash?.join(' ')}
          />
        );

      case 'polygon':
        return (
          <polygon
            points={generatePolygonPoints(sides, width, height)}
            fill={fillValue}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash?.join(' ')}
          />
        );

      case 'star':
        return (
          <polygon
            points={generateStarPoints(points, width, height, innerRadius)}
            fill={fillValue}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash?.join(' ')}
          />
        );

      case 'path':
        return (
          <path
            d={pathData || ''}
            fill={fillValue}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash?.join(' ')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
        opacity: layer.opacity ?? 1,
        ...layerStyle,
        ...animationStyle,
      }}
      className={layer.className}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block' }}
      >
        {gradient && <defs>{createGradientDef(gradient, gradientId)}</defs>}
        {renderShape()}
      </svg>
    </div>
  );
}
