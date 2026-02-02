/**
 * Example usage of LetterMorph component
 *
 * This file demonstrates various ways to use the LetterMorph component.
 */

import React from 'react';
import { LetterMorph } from './LetterMorph';

/**
 * Basic example - simultaneous morphing
 */
export function BasicLetterMorphExample() {
  const currentFrame = 30; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#000', minHeight: 200 }}>
      <LetterMorph
        startText="HELLO"
        endText="WORLD"
        frame={currentFrame}
        fps={30}
        duration={60}
        mode="simultaneous"
        fontSize={48}
        color="#ffffff"
      />
    </div>
  );
}

/**
 * Sequential morphing with stagger
 */
export function SequentialMorphExample() {
  const currentFrame = 45; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#1a1a2e', minHeight: 200 }}>
      <LetterMorph
        startText="START"
        endText="FINISH"
        frame={currentFrame}
        fps={30}
        duration={80}
        mode="sequential"
        stagger={3}
        scrambleDuration={15}
        fontSize={36}
        color="#00d9ff"
        fontFamily="monospace"
      />
    </div>
  );
}

/**
 * Different length strings
 */
export function DifferentLengthExample() {
  const currentFrame = 60; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#16213e', minHeight: 200 }}>
      <LetterMorph
        startText="Hi"
        endText="Hello World!"
        frame={currentFrame}
        fps={30}
        duration={100}
        mode="sequential"
        stagger={2}
        scrambleDuration={10}
        easing="ease-in-out"
        fontSize={40}
        color="#f39c12"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Fast scramble effect
 */
export function FastScrambleExample() {
  const currentFrame = 30; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#0f0f0f', minHeight: 200 }}>
      <LetterMorph
        startText="LOADING"
        endText="COMPLETE"
        frame={currentFrame}
        fps={30}
        duration={40}
        mode="simultaneous"
        scrambleDuration={20}
        fontSize={44}
        color="#00ff88"
        fontFamily="monospace"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Slow sequential morph
 */
export function SlowSequentialExample() {
  const currentFrame = 90; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2d3436', minHeight: 200 }}>
      <LetterMorph
        startText="DECODING"
        endText="HACKING"
        frame={currentFrame}
        fps={30}
        duration={120}
        mode="sequential"
        stagger={5}
        scrambleDuration={25}
        easing="ease-out"
        fontSize={38}
        color="#0ff"
        fontFamily="Courier New, monospace"
        textShadow="0 0 10px rgba(0, 255, 255, 0.5)"
      />
    </div>
  );
}

/**
 * Multiple morphs with different timings
 */
export function MultipleLetterMorphExample() {
  const currentFrame = 100; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#000',
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
      }}
    >
      <LetterMorph
        startText="SYSTEM"
        endText="ONLINE"
        frame={currentFrame}
        fps={30}
        duration={50}
        mode="simultaneous"
        scrambleDuration={15}
        fontSize={32}
        color="#00ff88"
        fontFamily="monospace"
      />

      <LetterMorph
        startText="INITIALIZING"
        endText="READY"
        frame={currentFrame}
        fps={30}
        duration={60}
        delay={50}
        mode="sequential"
        stagger={2}
        scrambleDuration={12}
        fontSize={28}
        color="#ff6b6b"
        fontFamily="monospace"
      />

      <LetterMorph
        startText="SCANNING"
        endText="ACCESS GRANTED"
        frame={currentFrame}
        fps={30}
        duration={80}
        delay={110}
        mode="sequential"
        stagger={3}
        scrambleDuration={10}
        fontSize={24}
        color="#4ecdc4"
        fontFamily="monospace"
      />
    </div>
  );
}

/**
 * Matrix-style effect
 */
export function MatrixStyleExample() {
  const currentFrame = 50; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#000000',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LetterMorph
        startText="ENTER THE MATRIX"
        endText="FOLLOW THE RABBIT"
        frame={currentFrame}
        fps={30}
        duration={90}
        mode="sequential"
        stagger={2}
        scrambleDuration={18}
        easing="ease-in-out"
        fontSize={36}
        color="#0f0"
        fontFamily="Courier New, monospace"
        fontWeight="bold"
        letterSpacing={2}
        textShadow="0 0 10px rgba(0, 255, 0, 0.8)"
        seed={12345}
      />
    </div>
  );
}

/**
 * Short to long text transition
 */
export function ShortToLongExample() {
  const currentFrame = 40; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#1a1a1a', minHeight: 200 }}>
      <LetterMorph
        startText="GO"
        endText="UNLEASHED"
        frame={currentFrame}
        fps={30}
        duration={70}
        mode="sequential"
        stagger={4}
        scrambleDuration={14}
        fontSize={44}
        color="#ff0080"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Long to short text transition
 */
export function LongToShortExample() {
  const currentFrame = 40; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#34495e', minHeight: 200 }}>
      <LetterMorph
        startText="DOWNLOADING"
        endText="DONE"
        frame={currentFrame}
        fps={30}
        duration={60}
        mode="sequential"
        stagger={2}
        scrambleDuration={12}
        fontSize={40}
        color="#ecf0f1"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Ease-in animation
 */
export function EaseInExample() {
  const currentFrame = 35; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2c3e50', minHeight: 200 }}>
      <LetterMorph
        startText="LOADING"
        endText="SUCCESS"
        frame={currentFrame}
        fps={30}
        duration={70}
        mode="simultaneous"
        scrambleDuration={20}
        easing="ease-in"
        fontSize={42}
        color="#3498db"
        fontFamily="monospace"
      />
    </div>
  );
}

/**
 * Linear easing
 */
export function LinearExample() {
  const currentFrame = 35; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#16a085', minHeight: 200 }}>
      <LetterMorph
        startText="TRANSFORM"
        endText="MORPHING"
        frame={currentFrame}
        fps={30}
        duration={70}
        mode="sequential"
        stagger={3}
        scrambleDuration={15}
        easing="linear"
        fontSize={38}
        color="#ffffff"
        fontFamily="monospace"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Custom styled with glow effect
 */
export function GlowEffectExample() {
  const currentFrame = 50; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#000',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LetterMorph
        startText="POWER OFF"
        endText="POWER ON"
        frame={currentFrame}
        fps={30}
        duration={80}
        mode="sequential"
        stagger={3}
        scrambleDuration={16}
        fontSize={48}
        color="#00ffff"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        textShadow="0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)"
      />
    </div>
  );
}

/**
 * Minimal scramble duration
 */
export function MinimalScrambleExample() {
  const currentFrame = 25; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#1e1e1e', minHeight: 200 }}>
      <LetterMorph
        startText="BEFORE"
        endText="AFTER"
        frame={currentFrame}
        fps={30}
        duration={50}
        mode="sequential"
        stagger={2}
        scrambleDuration={5}
        fontSize={40}
        color="#ffd700"
        fontFamily="Impact, sans-serif"
      />
    </div>
  );
}

/**
 * Extended scramble duration
 */
export function ExtendedScrambleExample() {
  const currentFrame = 60; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2b2b2b', minHeight: 200 }}>
      <LetterMorph
        startText="ENCRYPT"
        endText="DECRYPT"
        frame={currentFrame}
        fps={30}
        duration={100}
        mode="simultaneous"
        scrambleDuration={40}
        fontSize={42}
        color="#ff4444"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing={3}
      />
    </div>
  );
}
