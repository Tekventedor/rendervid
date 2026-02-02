import React from 'react';
import type { AnimatedProps } from '../types';

/**
 * 3D vector type
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * ThreeScene component props
 */
export interface ThreeSceneProps extends AnimatedProps {
  /** Geometry type */
  geometry: 'box' | 'sphere' | 'torus' | 'plane';
  /** Fill color */
  color?: string;
  /** Wireframe mode */
  wireframe?: boolean;
  /** Rotation speed in radians per second for each axis */
  rotation?: Partial<Vector3>;
  /** Position offset from center */
  position?: Partial<Vector3>;
  /** Scale multiplier */
  scale?: number;
  /** Camera distance from origin */
  cameraDistance?: number;
  /** Lighting mode */
  lighting?: 'ambient' | 'directional' | 'none';
  /** Width of the scene */
  width?: number;
  /** Height of the scene */
  height?: number;
}

/**
 * Calculate rotation values based on frame
 */
function calculateRotation(
  frame: number,
  fps: number = 30,
  rotationSpeed: Partial<Vector3> = {}
): Vector3 {
  const time = frame / fps;
  const { x = 0, y = 0, z = 0 } = rotationSpeed;

  return {
    x: (time * x * 360) % 360, // Convert radians/sec to degrees
    y: (time * y * 360) % 360,
    z: (time * z * 360) % 360,
  };
}

/**
 * Get lighting style based on lighting mode
 */
function getLightingStyle(lighting: 'ambient' | 'directional' | 'none'): React.CSSProperties {
  switch (lighting) {
    case 'ambient':
      return {
        filter: 'brightness(1.2)',
      };
    case 'directional':
      return {
        filter: 'brightness(1.1) drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5))',
      };
    case 'none':
    default:
      return {};
  }
}

/**
 * Render a box geometry
 */
function renderBox(
  color: string,
  wireframe: boolean,
  scale: number,
  lighting: React.CSSProperties
): React.ReactElement {
  const size = 100 * scale;
  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    border: wireframe ? '2px solid ' + color : 'none',
    backgroundColor: wireframe ? 'transparent' : color,
    opacity: wireframe ? 1 : 0.9,
    ...lighting,
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front face */}
      <div
        style={{
          ...faceStyle,
          transform: `translateZ(${size / 2}px)`,
        }}
      />
      {/* Back face */}
      <div
        style={{
          ...faceStyle,
          transform: `translateZ(-${size / 2}px) rotateY(180deg)`,
        }}
      />
      {/* Right face */}
      <div
        style={{
          ...faceStyle,
          transform: `rotateY(90deg) translateZ(${size / 2}px)`,
        }}
      />
      {/* Left face */}
      <div
        style={{
          ...faceStyle,
          transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
        }}
      />
      {/* Top face */}
      <div
        style={{
          ...faceStyle,
          transform: `rotateX(90deg) translateZ(${size / 2}px)`,
        }}
      />
      {/* Bottom face */}
      <div
        style={{
          ...faceStyle,
          transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
        }}
      />
    </div>
  );
}

/**
 * Render a sphere geometry (approximated with multiple rotated circles)
 */
function renderSphere(
  color: string,
  wireframe: boolean,
  scale: number,
  lighting: React.CSSProperties
): React.ReactElement {
  const size = 100 * scale;
  const rings = 8;

  const sphereStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: wireframe ? 'transparent' : color,
    border: wireframe ? '2px solid ' + color : 'none',
    position: 'absolute',
    opacity: wireframe ? 1 : 0.9,
    ...lighting,
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      <div style={sphereStyle} />
      {wireframe &&
        Array.from({ length: rings }).map((_, i) => {
          const angle = (i * 180) / rings;
          return (
            <div
              key={i}
              style={{
                ...sphereStyle,
                transform: `rotateY(${angle}deg)`,
              }}
            />
          );
        })}
    </div>
  );
}

/**
 * Render a torus geometry (approximated with circles)
 */
function renderTorus(
  color: string,
  wireframe: boolean,
  scale: number,
  lighting: React.CSSProperties
): React.ReactElement {
  const outerRadius = 100 * scale;
  const innerRadius = 40 * scale;
  const segments = 16;

  return (
    <div
      style={{
        width: outerRadius * 2,
        height: outerRadius * 2,
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i * 360) / segments;
        const ringStyle: React.CSSProperties = {
          position: 'absolute',
          width: innerRadius * 2,
          height: innerRadius * 2,
          borderRadius: '50%',
          border: wireframe ? '2px solid ' + color : '3px solid ' + color,
          backgroundColor: wireframe ? 'transparent' : color,
          opacity: 0.8,
          left: '50%',
          top: '50%',
          marginLeft: -innerRadius,
          marginTop: -innerRadius,
          transform: `rotateY(${angle}deg) translateZ(${outerRadius - innerRadius}px)`,
          ...lighting,
        };
        return <div key={i} style={ringStyle} />;
      })}
    </div>
  );
}

/**
 * Render a plane geometry
 */
function renderPlane(
  color: string,
  wireframe: boolean,
  scale: number,
  lighting: React.CSSProperties
): React.ReactElement {
  const width = 150 * scale;
  const height = 150 * scale;

  const planeStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor: wireframe ? 'transparent' : color,
    border: wireframe ? '2px solid ' + color : 'none',
    opacity: wireframe ? 1 : 0.9,
    ...lighting,
  };

  return <div style={planeStyle} />;
}

/**
 * ThreeScene - A 3D scene component using CSS 3D transforms
 *
 * Renders basic 3D geometries with frame-aware animation.
 * Uses CSS 3D transforms for hardware-accelerated rendering.
 *
 * @example
 * ```tsx
 * <ThreeScene
 *   geometry="box"
 *   color="#ff0080"
 *   rotation={{ y: 1 }}
 *   frame={currentFrame}
 *   fps={30}
 * />
 * ```
 */
export function ThreeScene({
  geometry,
  color = '#4c00ff',
  wireframe = false,
  rotation = {},
  position = {},
  scale = 1,
  cameraDistance = 500,
  lighting = 'directional',
  width = 400,
  height = 400,
  frame,
  fps = 30,
  className,
  style,
}: ThreeSceneProps): React.ReactElement {
  // Calculate rotation based on frame
  const rotationAngles = calculateRotation(frame, fps, rotation);

  // Get position with defaults
  const pos: Vector3 = {
    x: position.x ?? 0,
    y: position.y ?? 0,
    z: position.z ?? 0,
  };

  // Get lighting style
  const lightingStyle = getLightingStyle(lighting);

  // Container style with perspective
  const containerStyle: React.CSSProperties = {
    width,
    height,
    perspective: cameraDistance * 2,
    perspectiveOrigin: 'center center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...style,
  };

  // Scene style with 3D transforms
  const sceneStyle: React.CSSProperties = {
    transformStyle: 'preserve-3d',
    transform: `
      translateX(${pos.x}px)
      translateY(${pos.y}px)
      translateZ(${pos.z}px)
      rotateX(${rotationAngles.x}deg)
      rotateY(${rotationAngles.y}deg)
      rotateZ(${rotationAngles.z}deg)
    `,
    transition: 'none',
  };

  // Render the appropriate geometry
  let geometryElement: React.ReactElement;
  switch (geometry) {
    case 'box':
      geometryElement = renderBox(color, wireframe, scale, lightingStyle);
      break;
    case 'sphere':
      geometryElement = renderSphere(color, wireframe, scale, lightingStyle);
      break;
    case 'torus':
      geometryElement = renderTorus(color, wireframe, scale, lightingStyle);
      break;
    case 'plane':
      geometryElement = renderPlane(color, wireframe, scale, lightingStyle);
      break;
  }

  return (
    <div className={className} style={containerStyle}>
      <div style={sceneStyle}>{geometryElement}</div>
    </div>
  );
}
