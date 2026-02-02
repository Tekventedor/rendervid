import React from 'react';
import { FlipText } from './FlipText';

/**
 * Examples demonstrating various FlipText animation modes
 */

// Example 1: Basic Y-axis flip (vertical) with letters
export function FlipTextBasicExample() {
  return (
    <FlipText
      text="Hello World"
      frame={30}
      fps={30}
      mode="letters"
      axis="y"
      direction="forward"
      duration={60}
      stagger={2}
      easing="ease-out"
      fontSize={48}
      color="#ffffff"
      fontFamily="Arial, sans-serif"
    />
  );
}

// Example 2: X-axis flip (horizontal) with words
export function FlipTextWordsExample() {
  return (
    <FlipText
      text="Words Flip Horizontally"
      frame={30}
      fps={30}
      mode="words"
      axis="x"
      direction="forward"
      duration={45}
      stagger={5}
      easing="ease-out"
      fontSize={36}
      color="#00ff00"
    />
  );
}

// Example 3: Diagonal flip with both axes
export function FlipTextDiagonalExample() {
  return (
    <FlipText
      text="Diagonal Flip"
      frame={30}
      fps={30}
      mode="letters"
      axis="both"
      direction="forward"
      duration={60}
      stagger={3}
      easing="ease-in-out"
      fontSize={42}
      color="#ff6b6b"
      fontFamily="Impact, sans-serif"
      letterSpacing={2}
      perspective={800}
    />
  );
}

// Example 4: Backward flip animation
export function FlipTextBackwardExample() {
  return (
    <FlipText
      text="Backward Flip"
      frame={30}
      fps={30}
      mode="letters"
      axis="y"
      direction="backward"
      duration={90}
      stagger={2}
      easing="ease-out"
      fontSize={52}
      color="#4ecdc4"
      fontWeight="bold"
    />
  );
}

// Example 5: Fast flip with linear easing
export function FlipTextFastExample() {
  return (
    <FlipText
      text="FAST FLIP"
      frame={15}
      fps={30}
      mode="letters"
      axis="x"
      direction="forward"
      duration={20}
      stagger={1}
      easing="linear"
      fontSize={64}
      color="#ff0080"
      fontWeight="900"
      textShadow="0 0 20px rgba(255, 0, 128, 0.5)"
    />
  );
}

// Example 6: Slow stagger with custom styling
export function FlipTextSlowStaggerExample() {
  return (
    <FlipText
      text="Smooth Animation"
      frame={60}
      fps={30}
      mode="letters"
      axis="y"
      direction="forward"
      duration={30}
      stagger={5}
      easing="ease-out"
      fontSize={40}
      color="#ffd93d"
      fontFamily="Georgia, serif"
      lineHeight={1.2}
      letterSpacing={1}
    />
  );
}

// Example 7: Words with backward flip
export function FlipTextWordBackwardExample() {
  return (
    <FlipText
      text="Each Word Flips Backward"
      frame={45}
      fps={30}
      mode="words"
      axis="y"
      direction="backward"
      duration={60}
      stagger={8}
      easing="ease-in-out"
      fontSize={32}
      color="#457b9d"
      textAlign="center"
    />
  );
}

// Example 8: Horizontal flip with words
export function FlipTextWordHorizontalExample() {
  return (
    <FlipText
      text="Horizontal Word Flip"
      frame={30}
      fps={30}
      mode="words"
      axis="x"
      direction="forward"
      duration={50}
      stagger={6}
      easing="ease-out"
      fontSize={38}
      color="#e63946"
    />
  );
}

// Example 9: Diagonal word flip
export function FlipTextWordDiagonalExample() {
  return (
    <FlipText
      text="Diagonal Word Animation"
      frame={30}
      fps={30}
      mode="words"
      axis="both"
      direction="forward"
      duration={60}
      stagger={7}
      easing="ease-in-out"
      fontSize={40}
      color="#f1faee"
      perspective={1200}
    />
  );
}

// Example 10: Ease-in easing
export function FlipTextEaseInExample() {
  return (
    <FlipText
      text="Accelerating"
      frame={30}
      fps={30}
      mode="letters"
      axis="y"
      direction="forward"
      duration={60}
      stagger={2}
      easing="ease-in"
      fontSize={40}
      color="#06ffa5"
    />
  );
}

// Example 11: Complete animation sequence
export function FlipTextCompleteExample() {
  return (
    <FlipText
      text="Complete"
      frame={120}
      fps={30}
      mode="letters"
      axis="y"
      direction="forward"
      duration={60}
      stagger={2}
      easing="ease-out"
      fontSize={48}
      color="#a8dadc"
    />
  );
}

// Example 12: At rest (before animation)
export function FlipTextAtRestExample() {
  return (
    <FlipText
      text="Not Started"
      frame={0}
      fps={30}
      mode="letters"
      axis="y"
      direction="forward"
      duration={60}
      stagger={2}
      fontSize={42}
      color="#cccccc"
    />
  );
}

// Example 13: With delay
export function FlipTextDelayExample() {
  return (
    <FlipText
      text="Delayed Start"
      frame={30}
      fps={30}
      mode="letters"
      axis="y"
      direction="forward"
      duration={60}
      stagger={2}
      delay={30}
      easing="ease-out"
      fontSize={44}
      color="#ff6b6b"
    />
  );
}

// Example 14: High perspective (more pronounced 3D)
export function FlipTextHighPerspectiveExample() {
  return (
    <FlipText
      text="High Perspective"
      frame={30}
      fps={30}
      mode="letters"
      axis="y"
      direction="forward"
      duration={60}
      stagger={2}
      easing="ease-out"
      fontSize={42}
      color="#9b59b6"
      perspective={500}
    />
  );
}

// Example 15: Low perspective (subtle 3D)
export function FlipTextLowPerspectiveExample() {
  return (
    <FlipText
      text="Low Perspective"
      frame={30}
      fps={30}
      mode="letters"
      axis="y"
      direction="forward"
      duration={60}
      stagger={2}
      easing="ease-out"
      fontSize={42}
      color="#3498db"
      perspective={2000}
    />
  );
}

// Example 16: Multi-axis backward flip
export function FlipTextComplexExample() {
  return (
    <FlipText
      text="COMPLEX FLIP"
      frame={30}
      fps={30}
      mode="letters"
      axis="both"
      direction="backward"
      duration={90}
      stagger={3}
      easing="ease-in-out"
      fontSize={56}
      color="#e74c3c"
      fontWeight="800"
      textShadow="0 4px 8px rgba(0,0,0,0.3)"
      perspective={900}
    />
  );
}
