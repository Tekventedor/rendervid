import React from 'react';
import { SplitText } from './SplitText';

/**
 * Examples demonstrating various SplitText animation modes
 */

// Example 1: Basic splitUp animation with letters
export function SplitTextBasicExample() {
  return (
    <SplitText
      text="Hello World"
      frame={30}
      fps={30}
      mode="letters"
      animation="splitUp"
      duration={60}
      stagger={2}
      easing="ease-out"
      fontSize={48}
      color="#ffffff"
      fontFamily="Arial, sans-serif"
    />
  );
}

// Example 2: SplitDown animation with words
export function SplitTextWordsExample() {
  return (
    <SplitText
      text="Words Animate Together"
      frame={30}
      fps={30}
      mode="words"
      animation="splitDown"
      duration={45}
      stagger={5}
      easing="ease-in-out"
      fontSize={36}
      color="#00ff00"
    />
  );
}

// Example 3: SplitX (horizontal split) animation
export function SplitTextHorizontalExample() {
  return (
    <SplitText
      text="Split Apart"
      frame={30}
      fps={30}
      mode="letters"
      animation="splitX"
      duration={60}
      stagger={3}
      easing="ease-out"
      fontSize={42}
      color="#ff6b6b"
      fontFamily="Impact, sans-serif"
      letterSpacing={2}
    />
  );
}

// Example 4: Fan animation
export function SplitTextFanExample() {
  return (
    <SplitText
      text="Fan Out!"
      frame={30}
      fps={30}
      mode="letters"
      animation="fan"
      duration={60}
      stagger={2}
      easing="ease-in-out"
      fontSize={52}
      color="#4ecdc4"
      fontWeight="bold"
    />
  );
}

// Example 5: Explode animation
export function SplitTextExplodeExample() {
  return (
    <SplitText
      text="EXPLODE"
      frame={30}
      fps={30}
      mode="letters"
      animation="explode"
      duration={90}
      stagger={3}
      easing="ease-out"
      fontSize={64}
      color="#ff0080"
      fontWeight="900"
      textShadow="0 0 20px rgba(255, 0, 128, 0.5)"
    />
  );
}

// Example 6: Slow stagger with custom styling
export function SplitTextSlowStaggerExample() {
  return (
    <SplitText
      text="Smooth Animation"
      frame={60}
      fps={30}
      mode="letters"
      animation="splitUp"
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

// Example 7: Fast animation
export function SplitTextFastExample() {
  return (
    <SplitText
      text="Quick Split"
      frame={15}
      fps={30}
      mode="letters"
      animation="splitDown"
      duration={20}
      stagger={1}
      easing="linear"
      fontSize={44}
      color="#a8dadc"
    />
  );
}

// Example 8: Word mode with fan animation
export function SplitTextWordFanExample() {
  return (
    <SplitText
      text="Each Word Animates Independently"
      frame={45}
      fps={30}
      mode="words"
      animation="fan"
      duration={60}
      stagger={8}
      easing="ease-in-out"
      fontSize={32}
      color="#457b9d"
      textAlign="center"
    />
  );
}

// Example 9: Linear easing comparison
export function SplitTextLinearExample() {
  return (
    <SplitText
      text="Linear Motion"
      frame={30}
      fps={30}
      mode="letters"
      animation="splitX"
      duration={60}
      stagger={2}
      easing="linear"
      fontSize={38}
      color="#e63946"
    />
  );
}

// Example 10: Ease-in easing
export function SplitTextEaseInExample() {
  return (
    <SplitText
      text="Accelerating"
      frame={30}
      fps={30}
      mode="letters"
      animation="splitUp"
      duration={60}
      stagger={2}
      easing="ease-in"
      fontSize={40}
      color="#f1faee"
    />
  );
}

// Example 11: Complete animation sequence
export function SplitTextCompleteExample() {
  return (
    <SplitText
      text="Complete"
      frame={120}
      fps={30}
      mode="letters"
      animation="splitUp"
      duration={60}
      stagger={2}
      easing="ease-out"
      fontSize={48}
      color="#06ffa5"
    />
  );
}

// Example 12: At rest (before animation)
export function SplitTextAtRestExample() {
  return (
    <SplitText
      text="Not Started"
      frame={0}
      fps={30}
      mode="letters"
      animation="explode"
      duration={60}
      stagger={2}
      fontSize={42}
      color="#cccccc"
    />
  );
}
