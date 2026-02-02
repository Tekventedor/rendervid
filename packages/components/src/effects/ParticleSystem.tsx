import React, { useMemo } from 'react';
import type { AnimatedProps } from '../types';

/**
 * Particle type definitions
 */
export type ParticleType = 'circle' | 'square' | 'star' | 'image';

/**
 * Particle movement direction
 */
export type ParticleDirection = 'up' | 'down' | 'left' | 'right' | 'random' | 'radial' | 'static';

/**
 * Particle effect types
 */
export type ParticleEffect = 'gravity' | 'attraction' | 'repulsion' | 'connections' | 'none';

/**
 * Props for ParticleSystem component
 */
export interface ParticleSystemProps extends AnimatedProps {
  /** Number of particles to render */
  count?: number;
  /** Particle shape type */
  type?: ParticleType;
  /** Particle color (or array of colors for random selection) */
  color?: string | string[];
  /** Particle size in pixels (or range [min, max]) */
  size?: number | [number, number];
  /** Particle movement speed (pixels per frame) */
  speed?: number | [number, number];
  /** Particle movement direction */
  direction?: ParticleDirection;
  /** Particle opacity (0-1) */
  opacity?: number | [number, number];
  /** Particle lifetime in frames (0 = infinite) */
  lifetime?: number;
  /** Width of the particle system container */
  width?: number;
  /** Height of the particle system container */
  height?: number;
  /** Enable particle wrapping at edges */
  wrap?: boolean;
  /** Enable fade-in effect */
  fadeIn?: boolean;
  /** Enable fade-out effect */
  fadeOut?: boolean;
  /** Enable particle connections */
  connections?: boolean;
  /** Maximum distance for connections in pixels */
  connectionDistance?: number;
  /** Connection line color */
  connectionColor?: string;
  /** Connection line opacity */
  connectionOpacity?: number;
  /** Connection line width */
  connectionWidth?: number;
  /** Particle effect type */
  effect?: ParticleEffect;
  /** Effect strength (for gravity, attraction, repulsion) */
  effectStrength?: number;
  /** Effect center point [x, y] for attraction/repulsion (0-1 normalized) */
  effectCenter?: [number, number];
  /** Image URL (when type is 'image') */
  imageUrl?: string;
  /** Random seed for deterministic particle generation */
  seed?: number;
}

/**
 * Internal particle state
 */
interface Particle {
  id: number;
  startX: number;
  startY: number;
  velocityX: number;
  velocityY: number;
  size: number;
  color: string;
  opacity: number;
  birthFrame: number;
  lifetime: number;
}

/**
 * Seeded pseudo-random number generator for deterministic particle generation
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

/**
 * Calculate particle position based on current frame
 */
function calculateParticlePosition(
  particle: Particle,
  frame: number,
  width: number,
  height: number,
  direction: ParticleDirection,
  wrap: boolean,
  effect: ParticleEffect,
  effectStrength: number,
  effectCenter: [number, number]
): { x: number; y: number; active: boolean } {
  const age = frame - particle.birthFrame;

  // Check lifetime
  if (particle.lifetime > 0 && age > particle.lifetime) {
    return { x: 0, y: 0, active: false };
  }

  let x = particle.startX;
  let y = particle.startY;

  // Apply base movement
  if (direction === 'static') {
    // No movement
  } else if (direction === 'radial') {
    const angle = Math.atan2(
      particle.startY - height / 2,
      particle.startX - width / 2
    );
    x += Math.cos(angle) * particle.velocityX * age;
    y += Math.sin(angle) * particle.velocityY * age;
  } else {
    x += particle.velocityX * age;
    y += particle.velocityY * age;
  }

  // Apply effects
  if (effect === 'gravity') {
    y += 0.5 * effectStrength * age * age;
  } else if (effect === 'attraction' || effect === 'repulsion') {
    const centerX = effectCenter[0] * width;
    const centerY = effectCenter[1] * height;
    const dx = centerX - particle.startX;
    const dy = centerY - particle.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const force = (effect === 'attraction' ? 1 : -1) * effectStrength * age * age;
      x += (dx / distance) * force;
      y += (dy / distance) * force;
    }
  }

  // Apply wrapping
  if (wrap) {
    x = ((x % width) + width) % width;
    y = ((y % height) + height) % height;
  }

  // Check if particle is out of bounds
  const active = wrap || (x >= -50 && x <= width + 50 && y >= -50 && y <= height + 50);

  return { x, y, active };
}

/**
 * Calculate particle opacity with fade effects
 */
function calculateParticleOpacity(
  particle: Particle,
  frame: number,
  fadeIn: boolean,
  fadeOut: boolean
): number {
  const age = frame - particle.birthFrame;
  let opacity = particle.opacity;

  if (fadeIn && age < 30) {
    opacity *= age / 30;
  }

  if (fadeOut && particle.lifetime > 0) {
    const remainingLife = particle.lifetime - age;
    if (remainingLife < 30) {
      opacity *= remainingLife / 30;
    }
  }

  return Math.max(0, Math.min(1, opacity));
}

/**
 * Generate SVG path for star shape
 */
function generateStarPath(size: number): string {
  const points = 5;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;
  const centerX = size / 2;
  const centerY = size / 2;

  let path = '';
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    path += `${i === 0 ? 'M' : 'L'} ${x},${y} `;
  }
  return path + 'Z';
}

/**
 * ParticleSystem Component
 *
 * A frame-aware particle system that renders deterministically.
 * Supports multiple particle types, directions, effects, and customization options.
 *
 * @example
 * ```tsx
 * <ParticleSystem
 *   frame={currentFrame}
 *   count={50}
 *   type="circle"
 *   color="#ffffff"
 *   size={3}
 *   speed={2}
 *   direction="up"
 *   connections={true}
 *   connectionDistance={100}
 * />
 * ```
 */
export function ParticleSystem({
  count = 50,
  type = 'circle',
  color = '#ffffff',
  size = 3,
  speed = 2,
  direction = 'up',
  opacity = 1,
  lifetime = 0,
  width = 1920,
  height = 1080,
  wrap = false,
  fadeIn = false,
  fadeOut = false,
  connections = false,
  connectionDistance = 100,
  connectionColor = '#ffffff',
  connectionOpacity = 0.3,
  connectionWidth = 1,
  effect = 'none',
  effectStrength = 0.1,
  effectCenter = [0.5, 0.5],
  imageUrl,
  seed = 12345,
  frame = 0,
  className,
  style,
}: ParticleSystemProps): React.ReactElement {
  // Generate particles once with seeded random for deterministic behavior
  const particles = useMemo(() => {
    const rng = new SeededRandom(seed);
    const particles: Particle[] = [];

    const colors = Array.isArray(color) ? color : [color];
    const [minSize, maxSize] = Array.isArray(size) ? size : [size, size];
    const [minSpeed, maxSpeed] = Array.isArray(speed) ? speed : [speed, speed];
    const [minOpacity, maxOpacity] = Array.isArray(opacity) ? opacity : [opacity, opacity];

    for (let i = 0; i < count; i++) {
      // Random position
      const startX = rng.range(0, width);
      const startY = rng.range(0, height);

      // Calculate velocity based on direction
      let velocityX = 0;
      let velocityY = 0;
      const particleSpeed = rng.range(minSpeed, maxSpeed);

      switch (direction) {
        case 'up':
          velocityY = -particleSpeed;
          break;
        case 'down':
          velocityY = particleSpeed;
          break;
        case 'left':
          velocityX = -particleSpeed;
          break;
        case 'right':
          velocityX = particleSpeed;
          break;
        case 'random':
          const angle = rng.range(0, Math.PI * 2);
          velocityX = Math.cos(angle) * particleSpeed;
          velocityY = Math.sin(angle) * particleSpeed;
          break;
        case 'radial':
          velocityX = particleSpeed;
          velocityY = particleSpeed;
          break;
        case 'static':
          velocityX = 0;
          velocityY = 0;
          break;
      }

      particles.push({
        id: i,
        startX,
        startY,
        velocityX,
        velocityY,
        size: rng.range(minSize, maxSize),
        color: rng.choice(colors),
        opacity: rng.range(minOpacity, maxOpacity),
        birthFrame: 0,
        lifetime,
      });
    }

    return particles;
  }, [count, color, size, speed, direction, opacity, lifetime, width, height, seed]);

  // Calculate active particles for current frame
  const activeParticles = useMemo(() => {
    return particles
      .map(particle => {
        const position = calculateParticlePosition(
          particle,
          frame,
          width,
          height,
          direction,
          wrap,
          effect,
          effectStrength,
          effectCenter
        );

        if (!position.active) return null;

        const calculatedOpacity = calculateParticleOpacity(
          particle,
          frame,
          fadeIn,
          fadeOut
        );

        return {
          ...particle,
          x: position.x,
          y: position.y,
          currentOpacity: calculatedOpacity,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [particles, frame, width, height, direction, wrap, effect, effectStrength, effectCenter, fadeIn, fadeOut]);

  // Calculate connections
  const connectionLines = useMemo(() => {
    if (!connections) return [];

    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number }> = [];
    const maxDistance = connectionDistance * connectionDistance;

    for (let i = 0; i < activeParticles.length; i++) {
      for (let j = i + 1; j < activeParticles.length; j++) {
        const p1 = activeParticles[i];
        const p2 = activeParticles[j];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distSquared = dx * dx + dy * dy;

        if (distSquared < maxDistance) {
          const dist = Math.sqrt(distSquared);
          const lineOpacity = connectionOpacity * (1 - dist / connectionDistance) *
                             Math.min(p1.currentOpacity, p2.currentOpacity);

          lines.push({
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            opacity: lineOpacity,
          });
        }
      }
    }

    return lines;
  }, [activeParticles, connections, connectionDistance, connectionOpacity]);

  // Render particle based on type
  const renderParticle = (particle: typeof activeParticles[0]) => {
    const key = `particle-${particle.id}`;
    const particleOpacity = particle.currentOpacity;

    switch (type) {
      case 'circle':
        return (
          <circle
            key={key}
            cx={particle.x}
            cy={particle.y}
            r={particle.size / 2}
            fill={particle.color}
            opacity={particleOpacity}
          />
        );

      case 'square':
        return (
          <rect
            key={key}
            x={particle.x - particle.size / 2}
            y={particle.y - particle.size / 2}
            width={particle.size}
            height={particle.size}
            fill={particle.color}
            opacity={particleOpacity}
          />
        );

      case 'star':
        return (
          <path
            key={key}
            d={generateStarPath(particle.size)}
            transform={`translate(${particle.x - particle.size / 2}, ${particle.y - particle.size / 2})`}
            fill={particle.color}
            opacity={particleOpacity}
          />
        );

      case 'image':
        if (!imageUrl) {
          // Fallback to circle if no image URL
          return (
            <circle
              key={key}
              cx={particle.x}
              cy={particle.y}
              r={particle.size / 2}
              fill={particle.color}
              opacity={particleOpacity}
            />
          );
        }
        return (
          <image
            key={key}
            href={imageUrl}
            x={particle.x - particle.size / 2}
            y={particle.y - particle.size / 2}
            width={particle.size}
            height={particle.size}
            opacity={particleOpacity}
          />
        );

      default:
        return null;
    }
  };

  return (
    <svg
      className={className}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Render connection lines first (below particles) */}
      {connectionLines.map((line, i) => (
        <line
          key={`connection-${i}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={connectionColor}
          strokeWidth={connectionWidth}
          opacity={line.opacity}
        />
      ))}

      {/* Render particles */}
      {activeParticles.map(renderParticle)}
    </svg>
  );
}
