import React from 'react';
import type { WaveBackgroundProps } from '../types';

/**
 * Generate a smooth wave path using sine function
 */
function generateWavePath(
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  phase: number,
  direction: 'top' | 'bottom',
  offset: number = 0
): string {
  const points: string[] = [];
  const step = 5; // Resolution of the wave
  const yOffset = direction === 'top' ? offset : height - offset;

  // Generate wave points
  for (let x = 0; x <= width; x += step) {
    const normalizedX = x / width;
    const y = amplitude * Math.sin(frequency * normalizedX * Math.PI * 2 + phase);
    const finalY = direction === 'top' ? yOffset + y : yOffset - y;

    if (x === 0) {
      points.push(`M ${x} ${finalY}`);
    } else {
      points.push(`L ${x} ${finalY}`);
    }
  }

  // Close the path
  if (direction === 'top') {
    points.push(`L ${width} 0`);
    points.push(`L 0 0`);
  } else {
    points.push(`L ${width} ${height}`);
    points.push(`L 0 ${height}`);
  }
  points.push('Z');

  return points.join(' ');
}

/**
 * WaveBackground component
 *
 * Creates animated fluid wave effects using SVG paths.
 * Supports multiple wave layers with different speeds and colors.
 * Frame-aware for deterministic video rendering.
 *
 * @example
 * ```tsx
 * <WaveBackground
 *   frame={currentFrame}
 *   fps={30}
 *   colors={['#667eea', '#764ba2', '#f093fb']}
 *   waveCount={3}
 *   amplitude={50}
 *   frequency={0.02}
 *   speed={0.5}
 *   direction="bottom"
 * />
 * ```
 */
export function WaveBackground({
  frame = 0,
  fps = 30,
  colors = ['#667eea', '#764ba2'],
  waveCount = 3,
  amplitude = 50,
  frequency = 0.02,
  speed = 0.5,
  direction = 'bottom',
  opacity = 1,
  width = '100%',
  height = '100%',
  className,
  style,
}: WaveBackgroundProps): React.ReactElement {
  // Calculate time-based phase for animation
  const time = frame / fps;
  const basePhase = time * speed * Math.PI * 2;

  // Get the container dimensions
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 1920, height: 1080 });

  React.useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({ width: rect.width, height: rect.height });
      }
    }
  }, [width, height]);

  // Clamp wave count between 1 and 3
  const actualWaveCount = Math.max(1, Math.min(3, waveCount));

  // Generate colors for each wave layer
  const waveColors: string[] = [];
  if (colors.length === 1) {
    // Single color - use with different opacities
    for (let i = 0; i < actualWaveCount; i++) {
      waveColors.push(colors[0]);
    }
  } else if (colors.length >= actualWaveCount) {
    // Enough colors - use first N
    waveColors.push(...colors.slice(0, actualWaveCount));
  } else {
    // Not enough colors - interpolate
    waveColors.push(...colors);
    while (waveColors.length < actualWaveCount) {
      waveColors.push(colors[colors.length - 1]);
    }
  }

  // Generate wave layers
  const waves: React.ReactElement[] = [];
  const directions = direction === 'both' ? ['top', 'bottom'] : [direction];

  directions.forEach((dir) => {
    for (let i = 0; i < actualWaveCount; i++) {
      const layerSpeed = 1 + i * 0.3; // Each layer moves at different speed
      const layerAmplitude = amplitude * (1 - i * 0.15); // Each layer has slightly different amplitude
      const layerFrequency = frequency * (1 + i * 0.1); // Each layer has slightly different frequency
      const layerPhase = basePhase * layerSpeed;
      const layerOpacity = opacity * (1 - i * 0.15); // Each layer slightly more transparent
      const offset = i * 20; // Vertical offset for each layer

      const path = generateWavePath(
        dimensions.width,
        dimensions.height,
        layerAmplitude,
        layerFrequency,
        layerPhase,
        dir as 'top' | 'bottom',
        offset
      );

      const key = `${dir}-wave-${i}`;
      const color = waveColors[i];

      // Create gradient for smoother appearance
      const gradientId = `gradient-${dir}-${i}-${frame}`;

      waves.push(
        <React.Fragment key={key}>
          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              y1={dir === 'top' ? '0%' : '100%'}
              x2="0%"
              y2={dir === 'top' ? '100%' : '0%'}
            >
              <stop offset="0%" stopColor={color} stopOpacity={layerOpacity} />
              <stop offset="100%" stopColor={color} stopOpacity={layerOpacity * 0.6} />
            </linearGradient>
          </defs>
          <path d={path} fill={`url(#${gradientId})`} />
        </React.Fragment>
      );
    }
  });

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    overflow: 'hidden',
    pointerEvents: 'none',
    ...style,
  };

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        {waves}
      </svg>
    </div>
  );
}
