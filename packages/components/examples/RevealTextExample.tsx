import React from 'react';
import { RevealText } from '../src/effects/RevealText';

/**
 * Example demonstrating the RevealText component
 *
 * This example shows different reveal styles and modes
 */
export function RevealTextExample() {
  const frame = 60; // Current frame
  const fps = 30;

  return (
    <div style={{ padding: '40px', backgroundColor: '#000', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', marginBottom: '40px' }}>RevealText Examples</h1>

      {/* Example 1: Fade reveal - words from left */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#888', fontSize: '16px', marginBottom: '20px' }}>
          Fade Reveal - Words (Left to Right)
        </h2>
        <RevealText
          text="This text fades in word by word"
          frame={frame}
          fps={fps}
          mode="words"
          revealStyle="fade"
          duration={30}
          stagger={5}
          direction="left"
          fontSize={48}
          color="#ffffff"
          fontFamily="Arial, sans-serif"
        />
      </div>

      {/* Example 2: Wipe reveal - letters from center */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#888', fontSize: '16px', marginBottom: '20px' }}>
          Wipe Reveal - Letters (Center Outward)
        </h2>
        <RevealText
          text="CENTER REVEAL"
          frame={frame}
          fps={fps}
          mode="letters"
          revealStyle="wipe"
          duration={20}
          stagger={3}
          direction="center"
          fontSize={56}
          color="#00ff88"
          fontFamily="monospace"
        />
      </div>

      {/* Example 3: Slide reveal - words from right */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#888', fontSize: '16px', marginBottom: '20px' }}>
          Slide Reveal - Words (Right to Left)
        </h2>
        <RevealText
          text="Sliding in from the right"
          frame={frame}
          fps={fps}
          mode="words"
          revealStyle="slide"
          duration={25}
          stagger={8}
          direction="right"
          fontSize={42}
          color="#ff6b6b"
          fontFamily="Georgia, serif"
        />
      </div>

      {/* Example 4: Fade reveal - letters with delay */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#888', fontSize: '16px', marginBottom: '20px' }}>
          Fade Reveal - Letters (With Delay)
        </h2>
        <RevealText
          text="DELAYED START"
          frame={frame}
          fps={fps}
          mode="letters"
          revealStyle="fade"
          duration={15}
          stagger={2}
          direction="left"
          delay={30}
          fontSize={52}
          color="#ffd93d"
          fontFamily="Impact, sans-serif"
          easing="ease-in-out"
        />
      </div>

      {/* Example 5: Wipe reveal - words left to right */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#888', fontSize: '16px', marginBottom: '20px' }}>
          Wipe Reveal - Words (Fast Stagger)
        </h2>
        <RevealText
          text="Quick progressive reveal animation"
          frame={frame}
          fps={fps}
          mode="words"
          revealStyle="wipe"
          duration={20}
          stagger={3}
          direction="left"
          fontSize={40}
          color="#9d4edd"
          fontFamily="Courier New, monospace"
        />
      </div>

      {/* Example 6: Slide reveal - letters center */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#888', fontSize: '16px', marginBottom: '20px' }}>
          Slide Reveal - Letters (Center Outward)
        </h2>
        <RevealText
          text="EXPAND"
          frame={frame}
          fps={fps}
          mode="letters"
          revealStyle="slide"
          duration={25}
          stagger={4}
          direction="center"
          fontSize={64}
          color="#06ffa5"
          fontFamily="Arial Black, sans-serif"
          letterSpacing={4}
        />
      </div>
    </div>
  );
}

export default RevealTextExample;
