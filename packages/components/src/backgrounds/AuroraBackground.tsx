import React from 'react';
import type { AuroraBackgroundProps } from '../types';

/**
 * Aurora Background Component
 *
 * Creates a flowing gradient aurora/northern lights effect inspired by Aceternity UI.
 * The animation is frame-aware and deterministic for video rendering.
 *
 * Features:
 * - Multiple overlapping radial gradients
 * - Smooth, organic flowing motion
 * - Customizable colors and animation speed
 * - CSS blur filters for dreamy effect
 * - Frame-based animation for consistent video rendering
 *
 * @example
 * ```tsx
 * <AuroraBackground
 *   colors={['#667eea', '#764ba2', '#f093fb']}
 *   speed={1}
 *   blur={10}
 *   opacity={0.5}
 *   frame={currentFrame}
 *   totalFrames={300}
 * />
 * ```
 */
export function AuroraBackground({
  colors = ['#667eea', '#764ba2', '#f093fb', '#84fab0', '#8fd3f4'],
  speed = 1,
  blur = 40,
  opacity = 0.5,
  width = '100%',
  height = '100%',
  frame = 0,
  totalFrames = 300,
  fps = 30,
  className,
  style,
  children,
}: AuroraBackgroundProps): React.ReactElement {
  // Ensure we have at least 2 colors
  const gradientColors = colors.length < 2 ? ['#667eea', '#764ba2'] : colors;

  // Calculate animation progress (0 to 2π for smooth looping)
  const progress = (frame / (totalFrames || 300)) * Math.PI * 2 * speed;

  // Generate multiple aurora layers with different movements
  const auroraLayers = gradientColors.map((color, index) => {
    // Each layer has different phase offsets for organic motion
    const phaseOffset = (index * Math.PI * 2) / gradientColors.length;
    const layer = index + 1;

    // Create complex movement patterns using multiple sine waves
    const x1 = 50 + Math.sin(progress + phaseOffset) * 30;
    const y1 = 50 + Math.cos(progress * 0.7 + phaseOffset) * 25;

    const x2 = 50 + Math.sin(progress * 0.8 + phaseOffset + Math.PI) * 35;
    const y2 = 50 + Math.cos(progress * 0.5 + phaseOffset + Math.PI) * 30;

    const x3 = 50 + Math.sin(progress * 1.2 + phaseOffset + Math.PI / 2) * 25;
    const y3 = 50 + Math.cos(progress * 0.9 + phaseOffset + Math.PI / 2) * 35;

    // Size variations for each blob
    const size1 = 40 + Math.sin(progress * 0.6 + layer) * 10;
    const size2 = 35 + Math.cos(progress * 0.8 + layer) * 8;
    const size3 = 45 + Math.sin(progress * 0.4 + layer) * 12;

    // Color with varying opacity for depth
    const layerOpacity = 0.3 + (index / gradientColors.length) * 0.4;

    // Create multiple radial gradients for this color
    return `
      radial-gradient(
        ellipse ${size1}% ${size1}% at ${x1}% ${y1}%,
        ${color}${Math.floor(layerOpacity * 255).toString(16).padStart(2, '0')},
        transparent 60%
      ),
      radial-gradient(
        ellipse ${size2}% ${size2}% at ${x2}% ${y2}%,
        ${color}${Math.floor(layerOpacity * 0.7 * 255).toString(16).padStart(2, '0')},
        transparent 55%
      ),
      radial-gradient(
        ellipse ${size3}% ${size3}% at ${x3}% ${y3}%,
        ${color}${Math.floor(layerOpacity * 0.5 * 255).toString(16).padStart(2, '0')},
        transparent 65%
      )
    `.trim();
  });

  // Join all layers
  const backgroundImage = auroraLayers.join(',\n');

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    overflow: 'hidden',
    ...style,
  };

  const auroraStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    opacity,
    filter: `blur(${blur}px)`,
    mixBlendMode: 'screen',
    // Slightly scale up to hide blur edges
    transform: 'scale(1.1)',
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={auroraStyle} />
      {children && <div style={contentStyle}>{children}</div>}
    </div>
  );
}
