/**
 * Example usage of SVGDrawing component
 *
 * This file demonstrates different ways to use the SVGDrawing component
 * for animating SVG path drawing.
 */

import React from 'react';
import { SVGDrawing } from './SVGDrawing';

/**
 * Example 1: Simple inline SVG with sync mode
 * All paths animate together at the same time
 */
export function SimpleSVGDrawingExample() {
  const [frame, setFrame] = React.useState(0);
  const fps = 30;

  // Simulate frame progression
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % (3 * fps)); // 3 second loop
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  return (
    <SVGDrawing
      duration={2}
      mode="sync"
      strokeColor="#00ff00"
      strokeWidth={3}
      easing="ease-in-out"
      frame={frame}
      fps={fps}
      width={400}
      height={400}
    >
      <svg viewBox="0 0 200 200">
        <path d="M 20 100 L 180 100" />
        <path d="M 100 20 L 100 180" />
        <circle cx="100" cy="100" r="60" fill="none" />
      </svg>
    </SVGDrawing>
  );
}

/**
 * Example 2: One-by-one mode
 * Paths animate sequentially, one after another
 */
export function OneByOneSVGDrawingExample() {
  const [frame, setFrame] = React.useState(0);
  const fps = 30;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % (4 * fps)); // 4 second loop
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  return (
    <SVGDrawing
      duration={3}
      mode="oneByOne"
      strokeColor="#ff00ff"
      strokeWidth={2}
      easing="ease-out"
      frame={frame}
      fps={fps}
      width={300}
      height={300}
    >
      <svg viewBox="0 0 100 100">
        <path d="M 10 10 L 90 10" />
        <path d="M 90 10 L 90 90" />
        <path d="M 90 90 L 10 90" />
        <path d="M 10 90 L 10 10" />
      </svg>
    </SVGDrawing>
  );
}

/**
 * Example 3: Delayed mode with custom delay
 * Paths start with staggered delays but finish together
 */
export function DelayedSVGDrawingExample() {
  const [frame, setFrame] = React.useState(0);
  const fps = 30;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % (4 * fps)); // 4 second loop
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  return (
    <SVGDrawing
      duration={2.5}
      mode="delayed"
      delay={0.2}
      strokeColor="#00ffff"
      strokeWidth={2.5}
      easing="ease-in-out"
      frame={frame}
      fps={fps}
      width={400}
      height={300}
    >
      <svg viewBox="0 0 200 150">
        <path d="M 20 75 Q 50 20, 100 75 T 180 75" fill="none" />
        <path d="M 20 100 Q 50 150, 100 100 T 180 100" fill="none" />
        <path d="M 20 50 Q 50 5, 100 50 T 180 50" fill="none" />
      </svg>
    </SVGDrawing>
  );
}

/**
 * Example 4: Complex SVG drawing (star)
 */
export function StarSVGDrawingExample() {
  const [frame, setFrame] = React.useState(0);
  const fps = 30;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % (3 * fps)); // 3 second loop
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  // Generate star path
  const starPath = (() => {
    const points = 5;
    const outerRadius = 80;
    const innerRadius = 40;
    const cx = 100;
    const cy = 100;

    let path = '';
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / points) * i - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    }
    path += 'Z';
    return path;
  })();

  return (
    <SVGDrawing
      duration={2}
      mode="sync"
      strokeColor="#ffaa00"
      strokeWidth={3}
      easing="linear"
      frame={frame}
      fps={fps}
      width={300}
      height={300}
    >
      <svg viewBox="0 0 200 200">
        <path d={starPath} fill="none" />
      </svg>
    </SVGDrawing>
  );
}

/**
 * Example 5: Text/Logo drawing
 * Drawing custom paths for letters or logos
 */
export function LogoSVGDrawingExample() {
  const [frame, setFrame] = React.useState(0);
  const fps = 30;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % (5 * fps)); // 5 second loop
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  return (
    <SVGDrawing
      duration={3}
      mode="oneByOne"
      strokeColor="#ffffff"
      strokeWidth={4}
      easing="ease-in-out"
      frame={frame}
      fps={fps}
      width={500}
      height={200}
    >
      <svg viewBox="0 0 400 150">
        {/* Letter R */}
        <path d="M 20 120 L 20 30 L 60 30 Q 80 30, 80 50 Q 80 70, 60 70 L 20 70 M 60 70 L 80 120" />
        {/* Letter E */}
        <path d="M 120 120 L 120 30 L 160 30 M 120 75 L 150 75 M 120 120 L 160 120" />
        {/* Letter N */}
        <path d="M 200 120 L 200 30 L 240 120 L 240 30" />
        {/* Letter D */}
        <path d="M 280 120 L 280 30 L 320 30 Q 340 30, 340 75 Q 340 120, 320 120 L 280 120" />
      </svg>
    </SVGDrawing>
  );
}

/**
 * Example 6: Nested group with multiple paths
 */
export function GroupedSVGDrawingExample() {
  const [frame, setFrame] = React.useState(0);
  const fps = 30;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % (4 * fps)); // 4 second loop
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  return (
    <SVGDrawing
      duration={3}
      mode="delayed"
      delay={0.15}
      strokeColor="#ff3366"
      strokeWidth={2}
      easing="ease-in-out"
      frame={frame}
      fps={fps}
      width={400}
      height={400}
    >
      <svg viewBox="0 0 200 200">
        <g>
          <path d="M 50 100 L 100 50" />
          <path d="M 100 50 L 150 100" />
        </g>
        <g>
          <path d="M 150 100 L 100 150" />
          <path d="M 100 150 L 50 100" />
        </g>
      </svg>
    </SVGDrawing>
  );
}
