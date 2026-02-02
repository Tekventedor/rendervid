/**
 * Example usage of DistortText component
 *
 * This file demonstrates various ways to use the DistortText component
 * with different distortion types and configurations.
 */

import React from 'react';
import { DistortText } from './DistortText';

/**
 * Basic wave distortion example
 */
export function BasicWaveExample() {
  const currentFrame = 30; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#000', minHeight: 200 }}>
      <DistortText
        text="Wave Distortion"
        frame={currentFrame}
        fps={30}
        distortionType="wave"
        amplitude={10}
        frequency={0.5}
        speed={2}
        fontSize={48}
        color="#ffffff"
      />
    </div>
  );
}

/**
 * Ripple effect example
 */
export function RippleExample() {
  const currentFrame = 45; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#1a1a2e', minHeight: 200 }}>
      <DistortText
        text="Ripple Through Space"
        distortionType="ripple"
        frame={currentFrame}
        fps={30}
        amplitude={8}
        frequency={0.3}
        speed={1.5}
        fontSize={40}
        color="#00d9ff"
        fontFamily="Arial, sans-serif"
      />
    </div>
  );
}

/**
 * Glitch distortion example
 */
export function GlitchExample() {
  const currentFrame = 60; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#16213e', minHeight: 200 }}>
      <DistortText
        text="GLITCH MODE"
        distortionType="glitch"
        frame={currentFrame}
        fps={30}
        amplitude={5}
        frequency={0.8}
        speed={3}
        fontSize={44}
        color="#f39c12"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Skew distortion example
 */
export function SkewExample() {
  const currentFrame = 50; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#0f0f0f', minHeight: 200 }}>
      <DistortText
        text="Skewed Perspective"
        distortionType="skew"
        frame={currentFrame}
        fps={30}
        amplitude={7}
        frequency={0.4}
        speed={1}
        fontSize={42}
        color="#00ff88"
      />
    </div>
  );
}

/**
 * High frequency wave example
 */
export function HighFrequencyWaveExample() {
  const currentFrame = 40; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2d3436', minHeight: 200 }}>
      <DistortText
        text="High Frequency Waves"
        distortionType="wave"
        frame={currentFrame}
        fps={30}
        amplitude={12}
        frequency={1.2}
        speed={2.5}
        fontSize={36}
        color="#ff6b6b"
      />
    </div>
  );
}

/**
 * Subtle distortion example
 */
export function SubtleDistortionExample() {
  const currentFrame = 35; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#34495e', minHeight: 200 }}>
      <DistortText
        text="Subtle Wave Motion"
        distortionType="wave"
        frame={currentFrame}
        fps={30}
        amplitude={3}
        frequency={0.3}
        speed={1}
        fontSize={38}
        color="#ecf0f1"
      />
    </div>
  );
}

/**
 * Intense ripple example
 */
export function IntenseRippleExample() {
  const currentFrame = 55; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2c3e50', minHeight: 200 }}>
      <DistortText
        text="INTENSE RIPPLE"
        distortionType="ripple"
        frame={currentFrame}
        fps={30}
        amplitude={15}
        frequency={0.6}
        speed={2}
        fontSize={46}
        color="#e74c3c"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Slow skew example
 */
export function SlowSkewExample() {
  const currentFrame = 70; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#8e44ad', minHeight: 200 }}>
      <DistortText
        text="Slow Smooth Skew"
        distortionType="skew"
        frame={currentFrame}
        fps={30}
        amplitude={10}
        frequency={0.2}
        speed={0.5}
        fontSize={40}
        color="#ffffff"
        fontWeight="600"
      />
    </div>
  );
}

/**
 * Custom styled glitch example
 */
export function StyledGlitchExample() {
  const currentFrame = 65; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#0a0a0a',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <DistortText
        text="SYSTEM ERROR"
        distortionType="glitch"
        frame={currentFrame}
        fps={30}
        amplitude={8}
        frequency={1.0}
        speed={4}
        fontSize={52}
        color="#ff0000"
        fontFamily="Courier New, monospace"
        fontWeight="bold"
        letterSpacing={4}
        textShadow="0 0 10px rgba(255, 0, 0, 0.8)"
        style={{
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
}

/**
 * Multiple distortion types comparison
 */
export function ComparisonExample() {
  const currentFrame = 80; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#1c1c1c',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
      }}
    >
      <DistortText
        text="Wave Distortion"
        distortionType="wave"
        frame={currentFrame}
        fps={30}
        amplitude={8}
        frequency={0.5}
        speed={2}
        fontSize={36}
        color="#3498db"
      />

      <DistortText
        text="Ripple Distortion"
        distortionType="ripple"
        frame={currentFrame}
        fps={30}
        amplitude={8}
        frequency={0.5}
        speed={2}
        fontSize={36}
        color="#2ecc71"
      />

      <DistortText
        text="Glitch Distortion"
        distortionType="glitch"
        frame={currentFrame}
        fps={30}
        amplitude={8}
        frequency={0.5}
        speed={2}
        fontSize={36}
        color="#e67e22"
      />

      <DistortText
        text="Skew Distortion"
        distortionType="skew"
        frame={currentFrame}
        fps={30}
        amplitude={8}
        frequency={0.5}
        speed={2}
        fontSize={36}
        color="#9b59b6"
      />
    </div>
  );
}

/**
 * Rainbow ripple example
 */
export function RainbowRippleExample() {
  const currentFrame = 90; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#000',
        minHeight: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <DistortText
        text="Rainbow Ripple Effect"
        distortionType="ripple"
        frame={currentFrame}
        fps={30}
        amplitude={12}
        frequency={0.4}
        speed={1.8}
        fontSize={48}
        color="#ffffff"
        fontWeight="bold"
        textShadow="0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(100, 200, 255, 0.3)"
      />
    </div>
  );
}

/**
 * Typewriter-style glitch example (simulating typing effect)
 */
export function TypewriterGlitchExample() {
  const currentFrame = 100; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#0d1117',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DistortText
        text="Hello, World!"
        distortionType="glitch"
        frame={currentFrame}
        fps={30}
        amplitude={4}
        frequency={0.7}
        speed={2.5}
        fontSize={40}
        color="#58a6ff"
        fontFamily="Consolas, Monaco, monospace"
        letterSpacing={2}
      />
    </div>
  );
}
