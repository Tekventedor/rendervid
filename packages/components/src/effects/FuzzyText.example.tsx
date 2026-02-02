/**
 * Example usage of FuzzyText component
 *
 * This file demonstrates various ways to use the FuzzyText component.
 */

import React from 'react';
import { FuzzyText } from './FuzzyText';

/**
 * Basic example - fuzz the entire text at once
 */
export function BasicFuzzyTextExample() {
  const currentFrame = 30; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#000', minHeight: 200 }}>
      <FuzzyText
        text="Hello World"
        frame={currentFrame}
        fps={30}
        startBlur={15}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        duration={60}
        fontSize={48}
        color="#ffffff"
      />
    </div>
  );
}

/**
 * Word-by-word animation example with stagger
 */
export function WordByWordExample() {
  const currentFrame = 60; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#1a1a2e', minHeight: 200 }}>
      <FuzzyText
        text="Reveal each word separately"
        mode="words"
        frame={currentFrame}
        fps={30}
        duration={45}
        staggerDelay={8}
        startBlur={20}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        easing="ease-out"
        fontSize={36}
        color="#00d9ff"
        fontFamily="Arial, sans-serif"
      />
    </div>
  );
}

/**
 * Letter-by-letter with stagger and delay example
 */
export function LetterByLetterExample() {
  const currentFrame = 80; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#16213e', minHeight: 200 }}>
      <FuzzyText
        text="Fuzzy letters appear"
        mode="letters"
        delay={30}
        frame={currentFrame}
        fps={30}
        duration={40}
        staggerDelay={3}
        startBlur={18}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        easing="ease-in-out"
        fontSize={40}
        color="#f39c12"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Multiple FuzzyText elements with different timings
 */
export function MultipleFuzzyTextExample() {
  const currentFrame = 120; // Example frame

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
      <FuzzyText
        text="First line appears"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={50}
        delay={0}
        startBlur={12}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        fontSize={32}
        color="#00ff88"
      />

      <FuzzyText
        text="Second line with delay"
        mode="words"
        frame={currentFrame}
        fps={30}
        duration={40}
        staggerDelay={6}
        delay={50}
        startBlur={15}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        fontSize={28}
        color="#ff6b6b"
      />

      <FuzzyText
        text="Third line letter by letter"
        mode="letters"
        frame={currentFrame}
        fps={30}
        duration={35}
        staggerDelay={2}
        delay={100}
        startBlur={16}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        fontSize={24}
        color="#4ecdc4"
      />
    </div>
  );
}

/**
 * Custom styling example with heavy fuzzy effect
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
      <FuzzyText
        text="Heavy Fuzzy Effect"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={80}
        startBlur={25}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
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
 * Subtle fuzzy effect example
 */
export function SubtleFuzzyExample() {
  const currentFrame = 40; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#34495e', minHeight: 200 }}>
      <FuzzyText
        text="Subtle fuzzy animation"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={60}
        easing="ease-out"
        startBlur={8}
        endBlur={0}
        startOpacity={0.3}
        endOpacity={1}
        fontSize={44}
        color="#ecf0f1"
      />
    </div>
  );
}

/**
 * Fast letter reveal with high stagger
 */
export function FastLetterRevealExample() {
  const currentFrame = 50; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#2c3e50', minHeight: 200 }}>
      <FuzzyText
        text="Quick reveal"
        mode="letters"
        frame={currentFrame}
        fps={30}
        duration={20}
        staggerDelay={2}
        easing="ease-out"
        startBlur={15}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        fontSize={44}
        color="#3498db"
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
    <div style={{ padding: 20, backgroundColor: '#1e272e', minHeight: 200 }}>
      <FuzzyText
        text="Ease-in animation"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={60}
        easing="ease-in"
        startBlur={20}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        fontSize={44}
        color="#ff6348"
      />
    </div>
  );
}

/**
 * Word-by-word with minimal blur, emphasizing opacity
 */
export function OpacityEmphasizedExample() {
  const currentFrame = 70; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#192a56', minHeight: 200 }}>
      <FuzzyText
        text="Opacity focused fuzzy effect"
        mode="words"
        frame={currentFrame}
        fps={30}
        duration={35}
        staggerDelay={5}
        easing="ease-out"
        startBlur={5}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        fontSize={38}
        color="#dfe6e9"
      />
    </div>
  );
}

/**
 * Blur-focused example with minimal opacity change
 */
export function BlurEmphasizedExample() {
  const currentFrame = 45; // Example frame

  return (
    <div style={{ padding: 20, backgroundColor: '#273c75', minHeight: 200 }}>
      <FuzzyText
        text="Blur focused fuzzy effect"
        mode="whole"
        frame={currentFrame}
        fps={30}
        duration={70}
        easing="ease-in-out"
        startBlur={30}
        endBlur={0}
        startOpacity={0.5}
        endOpacity={1}
        fontSize={42}
        color="#fbc531"
      />
    </div>
  );
}

/**
 * Long text with letter-by-letter animation
 */
export function LongTextExample() {
  const currentFrame = 100; // Example frame

  return (
    <div style={{ padding: 40, backgroundColor: '#0c2461', minHeight: 250 }}>
      <FuzzyText
        text="This is a longer text that demonstrates the fuzzy effect with many characters appearing one by one"
        mode="letters"
        frame={currentFrame}
        fps={30}
        duration={30}
        staggerDelay={1.5}
        easing="ease-out"
        startBlur={12}
        endBlur={0}
        startOpacity={0}
        endOpacity={1}
        fontSize={28}
        color="#00d2d3"
        lineHeight={1.6}
        style={{
          maxWidth: 600,
        }}
      />
    </div>
  );
}
