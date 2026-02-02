/**
 * Example usage of TextTrail component
 *
 * This file demonstrates various ways to use the TextTrail component
 * to create motion trail effects on text.
 */

import React from 'react';
import { TextTrail } from './TextTrail';

/**
 * Basic example - horizontal trail effect
 */
export function BasicTextTrailExample() {
  const currentFrame = 30; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#000',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextTrail
        text="Hello World"
        frame={currentFrame}
        fps={30}
        direction="right"
        trailLength={5}
        trailSpacing={8}
        fontSize={48}
        color="#ffffff"
      />
    </div>
  );
}

/**
 * Animated trail - continuous motion
 */
export function AnimatedTrailExample() {
  const currentFrame = 60; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#0a0a0a',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextTrail
        text="Speed Demon"
        frame={currentFrame}
        fps={30}
        direction="right"
        trailLength={8}
        trailSpacing={10}
        animate={true}
        speed={2}
        fontSize={56}
        color="#00ff00"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Vertical trail effect
 */
export function VerticalTrailExample() {
  const currentFrame = 45; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#1a1a2e',
        minHeight: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextTrail
        text="Rising Up"
        frame={currentFrame}
        fps={30}
        direction="up"
        trailLength={6}
        trailSpacing={12}
        fontSize={44}
        color="#4ecdc4"
        fontFamily="Arial, sans-serif"
      />
    </div>
  );
}

/**
 * Diagonal trail with blur
 */
export function DiagonalBlurTrailExample() {
  const currentFrame = 50; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#16213e',
        minHeight: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextTrail
        text="Motion Blur"
        frame={currentFrame}
        fps={30}
        direction="bottom-right"
        trailLength={7}
        trailSpacing={8}
        blur={3}
        startOpacity={1}
        endOpacity={0.05}
        fontSize={52}
        color="#ff6b6b"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Multiple directions showcase
 */
export function MultiDirectionExample() {
  const currentFrame = 40; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#0f0f0f',
        minHeight: 400,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextTrail
          text="LEFT"
          frame={currentFrame}
          fps={30}
          direction="left"
          trailLength={5}
          trailSpacing={6}
          fontSize={32}
          color="#f39c12"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextTrail
          text="RIGHT"
          frame={currentFrame}
          fps={30}
          direction="right"
          trailLength={5}
          trailSpacing={6}
          fontSize={32}
          color="#e74c3c"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextTrail
          text="UP"
          frame={currentFrame}
          fps={30}
          direction="up"
          trailLength={5}
          trailSpacing={6}
          fontSize={32}
          color="#3498db"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextTrail
          text="DOWN"
          frame={currentFrame}
          fps={30}
          direction="down"
          trailLength={5}
          trailSpacing={6}
          fontSize={32}
          color="#9b59b6"
        />
      </div>
    </div>
  );
}

/**
 * Diagonal directions showcase
 */
export function DiagonalDirectionsExample() {
  const currentFrame = 35; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#1a1a1a',
        minHeight: 400,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextTrail
          text="TOP-LEFT"
          frame={currentFrame}
          fps={30}
          direction="top-left"
          trailLength={6}
          trailSpacing={7}
          fontSize={28}
          color="#1abc9c"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextTrail
          text="TOP-RIGHT"
          frame={currentFrame}
          fps={30}
          direction="top-right"
          trailLength={6}
          trailSpacing={7}
          fontSize={28}
          color="#e67e22"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextTrail
          text="BOTTOM-LEFT"
          frame={currentFrame}
          fps={30}
          direction="bottom-left"
          trailLength={6}
          trailSpacing={7}
          fontSize={28}
          color="#95a5a6"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextTrail
          text="BOTTOM-RIGHT"
          frame={currentFrame}
          fps={30}
          direction="bottom-right"
          trailLength={6}
          trailSpacing={7}
          fontSize={28}
          color="#c0392b"
        />
      </div>
    </div>
  );
}

/**
 * Custom styled with long trail
 */
export function LongTrailExample() {
  const currentFrame = 70; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#000033',
        minHeight: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextTrail
        text="VELOCITY"
        frame={currentFrame}
        fps={30}
        direction="right"
        trailLength={12}
        trailSpacing={5}
        startOpacity={1}
        endOpacity={0}
        blur={1.5}
        animate={true}
        speed={1.5}
        fontSize={64}
        color="#00d9ff"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        letterSpacing={4}
        textShadow="0 0 20px rgba(0, 217, 255, 0.8)"
      />
    </div>
  );
}

/**
 * Subtle trail effect
 */
export function SubtleTrailExample() {
  const currentFrame = 25; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#2d3436',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextTrail
        text="Subtle Motion"
        frame={currentFrame}
        fps={30}
        direction="right"
        trailLength={4}
        trailSpacing={4}
        startOpacity={1}
        endOpacity={0.3}
        fontSize={40}
        color="#dfe6e9"
        fontFamily="Georgia, serif"
      />
    </div>
  );
}

/**
 * Intense trail with high contrast
 */
export function IntenseTrailExample() {
  const currentFrame = 55; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#000000',
        minHeight: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextTrail
        text="EXPLOSIVE"
        frame={currentFrame}
        fps={30}
        direction="bottom-right"
        trailLength={10}
        trailSpacing={6}
        startOpacity={1}
        endOpacity={0}
        blur={2}
        animate={true}
        speed={3}
        fontSize={58}
        color="#ff0080"
        fontWeight="bold"
        letterSpacing={2}
        textShadow="0 0 30px rgba(255, 0, 128, 0.9)"
      />
    </div>
  );
}

/**
 * Animated sequence with multiple texts
 */
export function AnimatedSequenceExample() {
  const currentFrame = 80; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#0a0a1a',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 50,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextTrail
        text="FIRST"
        frame={currentFrame}
        fps={30}
        direction="right"
        trailLength={6}
        trailSpacing={8}
        animate={true}
        speed={1}
        fontSize={48}
        color="#00ff88"
        fontWeight="bold"
      />

      <TextTrail
        text="SECOND"
        frame={currentFrame + 20}
        fps={30}
        direction="left"
        trailLength={6}
        trailSpacing={8}
        animate={true}
        speed={1.5}
        fontSize={48}
        color="#ff6b6b"
        fontWeight="bold"
      />

      <TextTrail
        text="THIRD"
        frame={currentFrame + 40}
        fps={30}
        direction="bottom-right"
        trailLength={6}
        trailSpacing={8}
        animate={true}
        speed={2}
        fontSize={48}
        color="#4ecdc4"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Short trail with high opacity
 */
export function ShortTrailExample() {
  const currentFrame = 20; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#34495e',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextTrail
        text="Quick Trail"
        frame={currentFrame}
        fps={30}
        direction="right"
        trailLength={3}
        trailSpacing={10}
        startOpacity={1}
        endOpacity={0.5}
        fontSize={42}
        color="#ecf0f1"
        fontWeight="600"
      />
    </div>
  );
}
