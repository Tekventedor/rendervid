/**
 * Example usage of BlurText component
 *
 * This file demonstrates various ways to use the BlurText component.
 */

import React from 'react';
import { BlurText } from './BlurText';

/**
 * Basic example - blur the entire text at once
 */
export function BasicBlurTextExample() {
  const currentFrame = 30; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#000', minHeight: 200 }}>
      <BlurText
        text="Hello World"
        frame={currentFrame}
        fps={30}
        startBlur={10}
        endBlur={0}
        duration={60}
        fontSize={48}
        color="#ffffff"
      />
    </div>
  );
}

/**
 * Word-by-word animation example
 */
export function WordByWordExample() {
  const currentFrame = 45; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#1a1a2e', minHeight: 200 }}>
      <BlurText
        text="Reveal each word separately"
        mode="words"
        frame={currentFrame}
        fps={30}
        duration={90}
        startBlur={15}
        endBlur={0}
        easing="ease-out"
        fontSize={36}
        color="#00d9ff"
        fontFamily="Arial, sans-serif"
      />
    </div>
  );
}

/**
 * Letter-by-letter with delay example
 */
export function LetterByLetterExample() {
  const currentFrame = 60; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#16213e', minHeight: 200 }}>
      <BlurText
        text="Letter by letter"
        mode="letters"
        delay={30}
        frame={currentFrame}
        fps={30}
        duration={120}
        startBlur={12}
        endBlur={0}
        easing="ease-in-out"
        fontSize={40}
        color="#f39c12"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Multiple BlurText elements with different timings
 */
export function MultipleBlurTextExample() {
  const currentFrame = 90; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#0f0f0f',
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
      }}
    >
      <BlurText
        text="First line appears"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={40}
        delay={0}
        startBlur={8}
        endBlur={0}
        fontSize={32}
        color="#00ff88"
      />

      <BlurText
        text="Second line with delay"
        mode="words"
        frame={currentFrame}
        fps={30}
        duration={50}
        delay={40}
        startBlur={10}
        endBlur={0}
        fontSize={28}
        color="#ff6b6b"
      />

      <BlurText
        text="Third line letter by letter"
        mode="letters"
        frame={currentFrame}
        fps={30}
        duration={60}
        delay={90}
        startBlur={12}
        endBlur={0}
        fontSize={24}
        color="#4ecdc4"
      />
    </div>
  );
}

/**
 * Custom styling example
 */
export function CustomStyledExample() {
  const currentFrame = 50; // Example frame

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
      <BlurText
        text="Custom Styled Text"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={80}
        startBlur={15}
        endBlur={0}
        easing="ease-in-out"
        fontSize={56}
        color="#fdcb6e"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        letterSpacing={2}
        textShadow="0 0 20px rgba(253, 203, 110, 0.5)"
        style={{
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
}

/**
 * Ease-in easing example - starts slow and accelerates
 */
export function EaseInExample() {
  const currentFrame = 40; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#34495e', minHeight: 200 }}>
      <BlurText
        text="Ease-in animation"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={60}
        easing="ease-in"
        startBlur={20}
        endBlur={0}
        fontSize={44}
        color="#ecf0f1"
      />
    </div>
  );
}

/**
 * Linear easing example - constant speed
 */
export function LinearExample() {
  const currentFrame = 40; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2c3e50', minHeight: 200 }}>
      <BlurText
        text="Linear animation"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={60}
        easing="linear"
        startBlur={20}
        endBlur={0}
        fontSize={44}
        color="#3498db"
      />
    </div>
  );
}
