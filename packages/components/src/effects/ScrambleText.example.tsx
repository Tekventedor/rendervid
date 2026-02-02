/**
 * Example usage of ScrambleText component
 *
 * This file demonstrates various ways to use the ScrambleText component.
 */

import React from 'react';
import { ScrambleText } from './ScrambleText';

/**
 * Basic example - scramble entire text at once
 */
export function BasicScrambleTextExample() {
  const currentFrame = 30; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#000', minHeight: 200 }}>
      <ScrambleText
        text="Hello World"
        frame={currentFrame}
        fps={30}
        duration={60}
        mode="whole"
        charset="letters"
        fontSize={48}
        color="#ffffff"
        fontFamily="monospace"
      />
    </div>
  );
}

/**
 * Sequential reveal example - character by character
 */
export function SequentialRevealExample() {
  const currentFrame = 45; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#1a1a2e', minHeight: 200 }}>
      <ScrambleText
        text="Sequential Reveal"
        mode="sequential"
        frame={currentFrame}
        fps={30}
        duration={90}
        charset="alphanumeric"
        scrambleIterations={4}
        easing="ease-out"
        fontSize={36}
        color="#00d9ff"
        fontFamily="monospace"
        seed={42}
      />
    </div>
  );
}

/**
 * Alphanumeric charset example
 */
export function AlphanumericExample() {
  const currentFrame = 40; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#16213e', minHeight: 200 }}>
      <ScrambleText
        text="Data Loading 2024"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={80}
        charset="alphanumeric"
        scrambleIterations={5}
        easing="ease-in-out"
        fontSize={40}
        color="#f39c12"
        fontFamily="'Courier New', monospace"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Symbol charset example
 */
export function SymbolScrambleExample() {
  const currentFrame = 50; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#0f0f0f', minHeight: 200 }}>
      <ScrambleText
        text="Matrix Style"
        mode="sequential"
        frame={currentFrame}
        fps={30}
        duration={70}
        charset="symbols"
        scrambleIterations={6}
        easing="linear"
        fontSize={44}
        color="#00ff00"
        fontFamily="monospace"
        fontWeight="bold"
        seed={999}
      />
    </div>
  );
}

/**
 * Numbers only charset example
 */
export function NumbersOnlyExample() {
  const currentFrame = 35; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2d3436', minHeight: 200 }}>
      <ScrambleText
        text="12345 67890"
        mode="sequential"
        frame={currentFrame}
        fps={30}
        duration={60}
        charset="numbers"
        scrambleIterations={3}
        easing="ease-out"
        fontSize={48}
        color="#00cec9"
        fontFamily="monospace"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * All characters charset example
 */
export function AllCharsExample() {
  const currentFrame = 60; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#34495e', minHeight: 200 }}>
      <ScrambleText
        text="Full Chaos!"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={90}
        charset="all"
        scrambleIterations={8}
        easing="ease-in"
        fontSize={52}
        color="#e74c3c"
        fontFamily="monospace"
        fontWeight="bold"
        seed={777}
      />
    </div>
  );
}

/**
 * Delayed scramble example
 */
export function DelayedScrambleExample() {
  const currentFrame = 60; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2c3e50', minHeight: 200 }}>
      <ScrambleText
        text="Delayed Start"
        mode="sequential"
        frame={currentFrame}
        fps={30}
        duration={70}
        delay={30}
        charset="letters"
        scrambleIterations={4}
        easing="ease-out"
        fontSize={38}
        color="#3498db"
        fontFamily="monospace"
      />
    </div>
  );
}

/**
 * Fast scramble with many iterations example
 */
export function FastScrambleExample() {
  const currentFrame = 25; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#1e272e', minHeight: 200 }}>
      <ScrambleText
        text="Quick Flash"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={40}
        charset="alphanumeric"
        scrambleIterations={10}
        easing="ease-in-out"
        fontSize={44}
        color="#feca57"
        fontFamily="monospace"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Multiple ScrambleText elements with different timings
 */
export function MultipleScrambleTextExample() {
  const currentFrame = 90; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#0a0a0a',
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
      }}
    >
      <ScrambleText
        text="First Line"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={40}
        delay={0}
        charset="letters"
        scrambleIterations={3}
        fontSize={32}
        color="#00ff88"
        fontFamily="monospace"
      />

      <ScrambleText
        text="Second Line Delayed"
        mode="sequential"
        frame={currentFrame}
        fps={30}
        duration={50}
        delay={40}
        charset="alphanumeric"
        scrambleIterations={4}
        fontSize={28}
        color="#ff6b6b"
        fontFamily="monospace"
      />

      <ScrambleText
        text="Third Line Sequential"
        mode="sequential"
        frame={currentFrame}
        fps={30}
        duration={60}
        delay={90}
        charset="letters"
        scrambleIterations={5}
        fontSize={24}
        color="#4ecdc4"
        fontFamily="monospace"
      />
    </div>
  );
}

/**
 * Hacker/terminal style example
 */
export function HackerStyleExample() {
  const currentFrame = 50; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#000000',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <ScrambleText
        text="> ACCESS GRANTED"
        mode="sequential"
        frame={currentFrame}
        fps={30}
        duration={80}
        charset="alphanumeric"
        scrambleIterations={6}
        fontSize={28}
        color="#00ff00"
        fontFamily="'Courier New', monospace"
        fontWeight="bold"
        seed={1337}
      />

      <ScrambleText
        text="> LOADING SYSTEM..."
        mode="sequential"
        frame={Math.max(0, currentFrame - 30)}
        fps={30}
        duration={90}
        delay={30}
        charset="alphanumeric"
        scrambleIterations={5}
        fontSize={24}
        color="#00ff00"
        fontFamily="'Courier New', monospace"
        seed={1338}
      />
    </div>
  );
}

/**
 * Glitchy text effect example
 */
export function GlitchyTextExample() {
  const currentFrame = 40; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#1a0033',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ScrambleText
        text="GLITCH ERROR"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={50}
        charset="symbols"
        scrambleIterations={12}
        easing="linear"
        fontSize={56}
        color="#ff00ff"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing={4}
        textShadow="0 0 10px rgba(255, 0, 255, 0.8)"
        seed={666}
      />
    </div>
  );
}

/**
 * Smooth ease-out example
 */
export function SmoothRevealExample() {
  const currentFrame = 45; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2d4059', minHeight: 200 }}>
      <ScrambleText
        text="Smooth Reveal"
        mode="sequential"
        frame={currentFrame}
        fps={30}
        duration={75}
        charset="letters"
        scrambleIterations={3}
        easing="ease-out"
        fontSize={42}
        color="#ea5455"
        fontFamily="monospace"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Linear easing example - constant scramble speed
 */
export function LinearScrambleExample() {
  const currentFrame = 40; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#222831', minHeight: 200 }}>
      <ScrambleText
        text="Constant Speed"
        mode="sequential"
        frame={currentFrame}
        fps={30}
        duration={60}
        easing="linear"
        charset="letters"
        scrambleIterations={4}
        fontSize={40}
        color="#f8b500"
        fontFamily="monospace"
      />
    </div>
  );
}
