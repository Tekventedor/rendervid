import React, { useMemo } from 'react';
import type { AnimatedProps } from '../types';
import { clamp } from '../utils/interpolate';

/**
 * Easing function type
 */
export type EasingFunction = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animation mode for multiple paths
 */
export type AnimationMode = 'sync' | 'oneByOne' | 'delayed';

/**
 * Props for the SVGDrawing component
 */
export interface SVGDrawingProps extends AnimatedProps {
  /** SVG content as children */
  children?: React.ReactNode;
  /** SVG content as HTML string */
  svgContent?: string;
  /** SVG file URL */
  src?: string;
  /** Duration in seconds to complete drawing */
  duration: number;
  /** Animation mode for multiple paths */
  mode?: AnimationMode;
  /** Stroke color override */
  strokeColor?: string;
  /** Stroke width override */
  strokeWidth?: number;
  /** Delay between paths in oneByOne mode (seconds) */
  delay?: number;
  /** Easing function */
  easing?: EasingFunction;
  /** Width of the SVG viewport */
  width?: number | string;
  /** Height of the SVG viewport */
  height?: number | string;
  /** Preserve aspect ratio */
  preserveAspectRatio?: string;
  /** View box for SVG */
  viewBox?: string;
}

/**
 * Apply easing function to progress value
 */
function applyEasing(progress: number, easing: EasingFunction): number {
  const t = clamp(progress, 0, 1);

  switch (easing) {
    case 'linear':
      return t;
    case 'ease-in':
      return t * t;
    case 'ease-out':
      return 1 - Math.pow(1 - t, 2);
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    default:
      return t;
  }
}

/**
 * Calculate path length for an SVG path element
 * This is a rough approximation since we can't use getTotalLength in SSR
 */
function approximatePathLength(d: string): number {
  // Simple heuristic: count the number of commands and multiply by average segment length
  // This is a rough approximation for animation timing
  const commands = d.match(/[MLHVCSQTAZmlhvcsqtaz]/g) || [];
  const numbers = d.match(/[-+]?[0-9]*\.?[0-9]+/g) || [];

  // Estimate based on number of commands and coordinate points
  return commands.length * 20 + numbers.length * 5;
}

/**
 * Extract paths from HTML string
 */
function extractPathsFromString(svgContent: string): Array<{
  d: string;
  originalProps: any;
  estimatedLength: number;
}> {
  const paths: Array<{ d: string; originalProps: any; estimatedLength: number }> = [];

  // Extract path elements with d attribute
  const pathRegex = /<path[^>]*d="([^"]*)"[^>]*>/g;
  let match;

  while ((match = pathRegex.exec(svgContent)) !== null) {
    const d = match[1];
    const estimatedLength = approximatePathLength(d);
    paths.push({
      d,
      originalProps: {},
      estimatedLength,
    });
  }

  // Also handle circle and rect elements by converting them to paths
  const circleRegex = /<circle[^>]*cx="([^"]*)"[^>]*cy="([^"]*)"[^>]*r="([^"]*)"[^>]*>/g;
  while ((match = circleRegex.exec(svgContent)) !== null) {
    const cx = parseFloat(match[1]);
    const cy = parseFloat(match[2]);
    const r = parseFloat(match[3]);
    // Convert circle to path
    const d = `M ${cx - r},${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;
    const estimatedLength = 2 * Math.PI * r;
    paths.push({
      d,
      originalProps: {},
      estimatedLength,
    });
  }

  return paths;
}

/**
 * Extract path elements from SVG children
 */
function extractPaths(children: React.ReactNode): Array<{
  d: string;
  originalProps: any;
  estimatedLength: number;
}> {
  const paths: Array<{ d: string; originalProps: any; estimatedLength: number }> = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === 'path' && child.props.d) {
        const estimatedLength = approximatePathLength(child.props.d);
        paths.push({
          d: child.props.d,
          originalProps: child.props,
          estimatedLength,
        });
      } else if (child.type === 'g' || child.type === 'svg') {
        // Recursively extract paths from groups
        paths.push(...extractPaths(child.props.children));
      }
    }
  });

  return paths;
}

/**
 * Calculate stroke dash offset for a path based on animation progress
 */
function calculateStrokeDashOffset(
  pathLength: number,
  progress: number,
  mode: AnimationMode,
  pathIndex: number,
  totalPaths: number,
  delay: number,
  duration: number,
  fps: number
): number {
  let pathProgress = 0;

  switch (mode) {
    case 'sync':
      // All paths animate together
      pathProgress = progress;
      break;

    case 'oneByOne': {
      // Paths animate one after another
      const delayFrames = delay * (fps || 30);
      const durationFrames = duration * (fps || 30);
      const pathDuration = durationFrames / totalPaths;
      const pathStartFrame = pathIndex * pathDuration;
      const pathEndFrame = pathStartFrame + pathDuration;

      const currentFrame = progress * durationFrames;

      if (currentFrame < pathStartFrame) {
        pathProgress = 0;
      } else if (currentFrame >= pathEndFrame) {
        pathProgress = 1;
      } else {
        pathProgress = (currentFrame - pathStartFrame) / pathDuration;
      }
      break;
    }

    case 'delayed': {
      // Paths start with staggered delays but all finish together
      const delayFrames = delay * (fps || 30);
      const pathDelayFrames = pathIndex * delayFrames;
      const durationFrames = duration * (fps || 30);
      const currentFrame = progress * durationFrames;

      if (currentFrame < pathDelayFrames) {
        pathProgress = 0;
      } else {
        const adjustedFrame = currentFrame - pathDelayFrames;
        const adjustedDuration = durationFrames - pathDelayFrames;
        pathProgress = Math.min(1, adjustedFrame / adjustedDuration);
      }
      break;
    }

    default:
      pathProgress = progress;
  }

  return pathLength * (1 - pathProgress);
}

/**
 * SVG Drawing Component
 *
 * Animates SVG path drawing using stroke-dasharray and stroke-dashoffset,
 * similar to Vivus.js but frame-aware for video rendering.
 *
 * Features:
 * - Multiple animation modes (sync, oneByOne, delayed)
 * - Frame-based animation for consistent rendering
 * - Support for custom SVG paths or external files
 * - Configurable stroke properties and easing
 * - Automatically handles multiple paths in SVG
 *
 * @example
 * ```tsx
 * // Inline SVG
 * <SVGDrawing
 *   duration={2}
 *   mode="oneByOne"
 *   strokeColor="#00ff00"
 *   strokeWidth={2}
 *   frame={currentFrame}
 *   fps={30}
 * >
 *   <svg viewBox="0 0 100 100">
 *     <path d="M10,10 L90,90" />
 *     <path d="M90,10 L10,90" />
 *   </svg>
 * </SVGDrawing>
 *
 * // With external SVG
 * <SVGDrawing
 *   src="/path/to/drawing.svg"
 *   duration={3}
 *   mode="sync"
 *   frame={currentFrame}
 *   fps={30}
 * />
 * ```
 */
export function SVGDrawing({
  children,
  svgContent,
  src,
  duration,
  mode = 'sync',
  strokeColor,
  strokeWidth = 2,
  delay = 0.1,
  easing = 'ease-in-out',
  width = '100%',
  height = '100%',
  preserveAspectRatio = 'xMidYMid meet',
  viewBox,
  frame = 0,
  fps = 30,
  className,
  style,
}: SVGDrawingProps): React.ReactElement {
  // Calculate animation progress
  const totalFrames = duration * (fps || 30);
  const rawProgress = Math.min(1, frame / totalFrames);
  const progress = applyEasing(rawProgress, easing);

  // Extract paths from svgContent string or children
  const paths = useMemo(() => {
    if (svgContent) {
      return extractPathsFromString(svgContent);
    }
    if (children) {
      return extractPaths(children);
    }
    return [];
  }, [svgContent, children]);

  // If src is provided, show a message (actual loading would require async)
  if (src && !children) {
    return (
      <div className={className} style={style}>
        <div style={{ padding: 20, color: '#999' }}>
          SVG loading from URL is not yet implemented in this version.
          Please provide SVG content as children.
        </div>
      </div>
    );
  }

  // If no paths found, render children as-is
  if (paths.length === 0) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  // Render animated paths
  const animatedPaths = paths.map((path, index) => {
    const pathLength = path.estimatedLength;
    const strokeDashoffset = calculateStrokeDashOffset(
      pathLength,
      progress,
      mode,
      index,
      paths.length,
      delay,
      duration,
      fps || 30
    );

    return (
      <path
        key={index}
        {...path.originalProps}
        d={path.d}
        fill="none"
        stroke={strokeColor || path.originalProps.stroke || '#000000'}
        strokeWidth={strokeWidth || path.originalProps.strokeWidth || 2}
        strokeDasharray={pathLength}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  });

  // Container style
  const containerStyle: React.CSSProperties = {
    width,
    height,
    display: 'inline-block',
    ...style,
  };

  // Find viewBox from original SVG if not provided
  let effectiveViewBox = viewBox;
  if (!effectiveViewBox && svgContent) {
    // Extract viewBox from svgContent string
    const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
    if (viewBoxMatch) {
      effectiveViewBox = viewBoxMatch[1];
    }
  }
  if (!effectiveViewBox && children) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === 'svg' && child.props.viewBox) {
        effectiveViewBox = child.props.viewBox;
      }
    });
  }

  return (
    <div className={className} style={containerStyle}>
      <svg
        width={width}
        height={height}
        viewBox={effectiveViewBox}
        preserveAspectRatio={preserveAspectRatio}
        style={{ display: 'block' }}
      >
        {animatedPaths}
      </svg>
    </div>
  );
}
