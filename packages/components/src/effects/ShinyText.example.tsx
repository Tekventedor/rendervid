/**
 * Example usage of ShinyText component
 *
 * This file demonstrates various ways to use the ShinyText component.
 */

import React from 'react';
import { ShinyText } from './ShinyText';

/**
 * Basic example - shine sweeps left to right
 */
export function BasicShinyTextExample() {
  const currentFrame = 30; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#000', minHeight: 200 }}>
      <ShinyText
        text="Hello World"
        frame={currentFrame}
        fps={30}
        duration={60}
        shineColor="rgba(255, 255, 255, 0.8)"
        baseColor="#666666"
        fontSize={48}
      />
    </div>
  );
}

/**
 * Right to left direction example
 */
export function RightToLeftExample() {
  const currentFrame = 45; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#1a1a2e', minHeight: 200 }}>
      <ShinyText
        text="Shine from Right"
        frame={currentFrame}
        fps={30}
        duration={90}
        direction="right"
        shineColor="rgba(100, 200, 255, 0.9)"
        baseColor="#333333"
        fontSize={36}
        fontFamily="Arial, sans-serif"
      />
    </div>
  );
}

/**
 * Looping animation example
 */
export function LoopingExample() {
  const currentFrame = 120; // Example frame - will loop

  return (
    <div style={{ padding: 20, backgroundColor: '#16213e', minHeight: 200 }}>
      <ShinyText
        text="Looping Shine Effect"
        frame={currentFrame}
        fps={30}
        duration={80}
        loop={true}
        shineColor="rgba(255, 215, 0, 0.9)"
        baseColor="#444444"
        fontSize={40}
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Custom gold shine example
 */
export function GoldShineExample() {
  const currentFrame = 60; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#0f0f0f',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ShinyText
        text="GOLDEN TEXT"
        frame={currentFrame}
        fps={30}
        duration={100}
        direction="left"
        shineColor="rgba(255, 215, 0, 1)"
        baseColor="#8B7355"
        fontSize={56}
        fontFamily="Georgia, serif"
        fontWeight="bold"
        letterSpacing={3}
        style={{
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
}

/**
 * Multiple ShinyText elements with different timings
 */
export function MultipleShinyTextExample() {
  const currentFrame = 90; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#1a1a1a',
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
      }}
    >
      <ShinyText
        text="First line shines"
        frame={currentFrame}
        fps={30}
        duration={60}
        shineColor="rgba(0, 255, 136, 0.8)"
        baseColor="#555555"
        fontSize={32}
      />

      <ShinyText
        text="Second line in opposite direction"
        frame={currentFrame}
        fps={30}
        duration={70}
        direction="right"
        shineColor="rgba(255, 107, 107, 0.8)"
        baseColor="#555555"
        fontSize={28}
      />

      <ShinyText
        text="Third line loops continuously"
        frame={currentFrame}
        fps={30}
        duration={50}
        loop={true}
        shineColor="rgba(78, 205, 196, 0.8)"
        baseColor="#555555"
        fontSize={24}
      />
    </div>
  );
}

/**
 * Subtle shine effect example
 */
export function SubtleShineExample() {
  const currentFrame = 40; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#2d3436',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ShinyText
        text="Subtle Shine"
        frame={currentFrame}
        fps={30}
        duration={120}
        shineColor="rgba(255, 255, 255, 0.3)"
        baseColor="#ecf0f1"
        fontSize={44}
        fontFamily="Arial, sans-serif"
        textShadow="0 2px 10px rgba(0, 0, 0, 0.3)"
      />
    </div>
  );
}

/**
 * Neon glow shine example
 */
export function NeonShineExample() {
  const currentFrame = 50; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#000000', minHeight: 200 }}>
      <ShinyText
        text="NEON GLOW"
        frame={currentFrame}
        fps={30}
        duration={80}
        loop={true}
        shineColor="rgba(0, 255, 255, 1)"
        baseColor="#00ffff"
        fontSize={52}
        fontWeight="bold"
        textShadow="0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)"
        style={{
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
}

/**
 * Fast sweep example
 */
export function FastSweepExample() {
  const currentFrame = 20; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#34495e', minHeight: 200 }}>
      <ShinyText
        text="Quick Shine"
        frame={currentFrame}
        fps={30}
        duration={30}
        shineColor="rgba(255, 255, 255, 1)"
        baseColor="#7f8c8d"
        fontSize={44}
      />
    </div>
  );
}

/**
 * Slow sweep example
 */
export function SlowSweepExample() {
  const currentFrame = 60; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2c3e50', minHeight: 200 }}>
      <ShinyText
        text="Slow Elegant Shine"
        frame={currentFrame}
        fps={30}
        duration={150}
        shineColor="rgba(255, 255, 255, 0.6)"
        baseColor="#95a5a6"
        fontSize={40}
        fontFamily="Georgia, serif"
      />
    </div>
  );
}
