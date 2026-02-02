/**
 * Example usage of NeonText component
 *
 * This file demonstrates various ways to use the NeonText component
 * with different neon colors, animation modes, and styling options.
 */

import React from 'react';
import { NeonText } from './NeonText';

/**
 * Basic example - cyan neon with pulse animation
 */
export function BasicNeonTextExample() {
  const currentFrame = 30; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#000000',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="NEON LIGHTS"
        frame={currentFrame}
        fps={30}
        color="#00ffff"
        mode="pulse"
        intensity={1}
        fontSize={56}
      />
    </div>
  );
}

/**
 * Flickering neon sign example
 */
export function FlickeringNeonExample() {
  const currentFrame = 45; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#0a0a0a',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="OPEN 24/7"
        frame={currentFrame}
        fps={30}
        mode="flicker"
        color="#ff00ff"
        speed={2}
        loop={true}
        fontSize={48}
        letterSpacing={4}
      />
    </div>
  );
}

/**
 * Static neon with background glow
 */
export function StaticNeonWithBackgroundExample() {
  const currentFrame = 0; // Static frame

  return (
    <div
      style={{
        padding: 80,
        backgroundColor: '#000000',
        minHeight: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="RETRO VIBES"
        frame={currentFrame}
        fps={30}
        mode="static"
        color="#00ff88"
        backgroundGlow={true}
        backgroundGlowIntensity={0.4}
        fontSize={52}
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Pink/magenta neon example
 */
export function PinkNeonExample() {
  const currentFrame = 60; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#0d0d0d',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="VAPORWAVE"
        frame={currentFrame}
        fps={30}
        mode="pulse"
        color="#ff006e"
        speed={0.5}
        intensity={0.9}
        fontSize={64}
        letterSpacing={6}
      />
    </div>
  );
}

/**
 * Yellow/gold neon arcade style
 */
export function ArcadeNeonExample() {
  const currentFrame = 20; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#111111',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="ARCADE"
        frame={currentFrame}
        fps={30}
        mode="pulse"
        color="#ffff00"
        intensity={0.8}
        speed={1.5}
        fontSize={72}
        letterSpacing={8}
        fontFamily="'Courier New', monospace"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Green neon terminal style
 */
export function TerminalNeonExample() {
  const currentFrame = 90; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#000000',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="> SYSTEM ONLINE"
        frame={currentFrame}
        fps={30}
        mode="flicker"
        color="#00ff00"
        speed={1.2}
        fontSize={36}
        fontFamily="'Courier New', monospace"
        loop={true}
      />
    </div>
  );
}

/**
 * Blue neon with slow pulse
 */
export function BlueNeonExample() {
  const currentFrame = 75; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#000814',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="ELECTRIC"
        frame={currentFrame}
        fps={30}
        mode="pulse"
        color="#00d9ff"
        speed={0.7}
        intensity={1}
        backgroundGlow={true}
        backgroundGlowIntensity={0.35}
        fontSize={58}
        fontWeight="900"
      />
    </div>
  );
}

/**
 * Orange/red neon warning sign
 */
export function WarningNeonExample() {
  const currentFrame = 40; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#0f0f0f',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="! DANGER !"
        frame={currentFrame}
        fps={30}
        mode="flicker"
        color="#ff4500"
        speed={3}
        intensity={1}
        fontSize={48}
        letterSpacing={5}
        fontWeight="bold"
        loop={true}
      />
    </div>
  );
}

/**
 * Multiple neon signs with different colors
 */
export function MultipleNeonExample() {
  const currentFrame = 100; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#000000',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="HOTEL"
        frame={currentFrame}
        fps={30}
        mode="pulse"
        color="#ff00ff"
        speed={1}
        fontSize={52}
        letterSpacing={12}
      />

      <NeonText
        text="VACANCY"
        frame={currentFrame + 15}
        fps={30}
        mode="flicker"
        color="#00ffff"
        speed={1.5}
        fontSize={36}
        letterSpacing={6}
        loop={true}
      />

      <NeonText
        text="$99/Night"
        frame={currentFrame}
        fps={30}
        mode="static"
        color="#ffff00"
        fontSize={28}
        letterSpacing={2}
      />
    </div>
  );
}

/**
 * Purple neon with maximum glow
 */
export function MaxGlowNeonExample() {
  const currentFrame = 50; // Example frame

  return (
    <div
      style={{
        padding: 80,
        backgroundColor: '#000000',
        minHeight: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="CYBERPUNK"
        frame={currentFrame}
        fps={30}
        mode="pulse"
        color="#b537f2"
        intensity={1}
        speed={0.8}
        backgroundGlow={true}
        backgroundGlowIntensity={0.5}
        fontSize={64}
        letterSpacing={4}
        fontWeight="900"
      />
    </div>
  );
}

/**
 * Subtle neon effect with lower intensity
 */
export function SubtleNeonExample() {
  const currentFrame = 30; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#1a1a1a',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="Soft Glow"
        frame={currentFrame}
        fps={30}
        mode="pulse"
        color="#7ed6df"
        intensity={0.5}
        speed={0.5}
        fontSize={44}
        fontWeight="normal"
        fontFamily="'Georgia', serif"
      />
    </div>
  );
}

/**
 * Fast flickering broken neon sign
 */
export function BrokenNeonExample() {
  const currentFrame = 110; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#050505',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NeonText
        text="BAR"
        frame={currentFrame}
        fps={30}
        mode="flicker"
        color="#ff0066"
        speed={4}
        intensity={0.85}
        fontSize={80}
        letterSpacing={10}
        fontWeight="900"
        loop={true}
      />
    </div>
  );
}

/**
 * Neon with custom font and styling
 */
export function CustomStyledNeonExample() {
  const currentFrame = 65; // Example frame

  return (
    <div
      style={{
        padding: 80,
        backgroundColor: '#000000',
        minHeight: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid #333',
      }}
    >
      <NeonText
        text="TOKYO NIGHTS"
        frame={currentFrame}
        fps={30}
        mode="pulse"
        color="#ff2a6d"
        speed={1}
        intensity={0.95}
        backgroundGlow={true}
        backgroundGlowIntensity={0.3}
        fontSize={56}
        letterSpacing={5}
        fontFamily="'Impact', sans-serif"
        fontWeight="normal"
        style={{
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
}
