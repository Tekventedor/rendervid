/**
 * Example usage of MorphText component
 *
 * This file demonstrates various ways to use the MorphText component
 * for smooth text morphing animations.
 */

import React from 'react';
import { MorphText } from './MorphText';

/**
 * Basic example - morph between two simple words
 */
export function BasicMorphTextExample() {
  const currentFrame = 45; // Example frame

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
      <MorphText
        texts={['Hello', 'World']}
        frame={currentFrame}
        fps={30}
        morphDuration={30}
        pauseDuration={60}
        loop={true}
        fontSize={48}
        color="#ffffff"
      />
    </div>
  );
}

/**
 * Multiple texts with looping
 */
export function MultipleTextsExample() {
  const currentFrame = 120; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#1a1a2e',
        minHeight: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['Welcome', 'to', 'Rendervid', 'Components']}
        frame={currentFrame}
        fps={30}
        morphDuration={40}
        pauseDuration={80}
        loop={true}
        fontSize={56}
        color="#00d9ff"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        easing="ease-in-out"
      />
    </div>
  );
}

/**
 * Fast morphing with short pause
 */
export function FastMorphExample() {
  const currentFrame = 90; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#16213e',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['Quick', 'Fast', 'Rapid', 'Swift']}
        frame={currentFrame}
        fps={30}
        morphDuration={15}
        pauseDuration={30}
        loop={true}
        fontSize={44}
        color="#f39c12"
        easing="ease-out"
        blurIntensity={8}
      />
    </div>
  );
}

/**
 * Slow, dramatic morphing
 */
export function SlowMorphExample() {
  const currentFrame = 150; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#0f0f0f',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['Elegant', 'Smooth', 'Beautiful']}
        frame={currentFrame}
        fps={30}
        morphDuration={60}
        pauseDuration={120}
        loop={true}
        fontSize={52}
        color="#00ff88"
        fontWeight="300"
        easing="ease-in-out"
        blurIntensity={6}
        letterSpacing={2}
      />
    </div>
  );
}

/**
 * Non-looping sequence (plays once)
 */
export function NonLoopingExample() {
  const currentFrame = 180; // Example frame

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
      <MorphText
        texts={['Starting', 'Processing', 'Complete']}
        frame={currentFrame}
        fps={30}
        morphDuration={30}
        pauseDuration={60}
        loop={false}
        fontSize={42}
        color="#ff6b6b"
        fontWeight="bold"
      />
    </div>
  );
}

/**
 * Minimal blur intensity
 */
export function MinimalBlurExample() {
  const currentFrame = 60; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#34495e',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['Sharp', 'Clean', 'Crisp']}
        frame={currentFrame}
        fps={30}
        morphDuration={35}
        pauseDuration={70}
        loop={true}
        fontSize={48}
        color="#ecf0f1"
        blurIntensity={2}
        easing="linear"
      />
    </div>
  );
}

/**
 * High blur intensity for dreamy effect
 */
export function HighBlurExample() {
  const currentFrame = 75; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#2c3e50',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['Dream', 'Float', 'Drift']}
        frame={currentFrame}
        fps={30}
        morphDuration={45}
        pauseDuration={90}
        loop={true}
        fontSize={50}
        color="#3498db"
        blurIntensity={12}
        easing="ease-in-out"
      />
    </div>
  );
}

/**
 * Custom styled with text shadow
 */
export function CustomStyledExample() {
  const currentFrame = 100; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#1e272e',
        minHeight: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['Amazing', 'Stunning', 'Brilliant', 'Fantastic']}
        frame={currentFrame}
        fps={30}
        morphDuration={40}
        pauseDuration={75}
        loop={true}
        fontSize={60}
        color="#fdcb6e"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        letterSpacing={3}
        textShadow="0 0 30px rgba(253, 203, 110, 0.8), 0 0 60px rgba(253, 203, 110, 0.4)"
        blurIntensity={7}
        easing="ease-in-out"
        style={{
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
}

/**
 * Different text lengths morphing
 */
export function DifferentLengthsExample() {
  const currentFrame = 130; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#192a56',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['Hi', 'Hello There', 'Greetings', 'Welcome Back']}
        frame={currentFrame}
        fps={30}
        morphDuration={35}
        pauseDuration={70}
        loop={true}
        fontSize={46}
        color="#4cd137"
        fontWeight="600"
        easing="ease-out"
        blurIntensity={6}
      />
    </div>
  );
}

/**
 * Ease-in easing example
 */
export function EaseInExample() {
  const currentFrame = 55; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#273c75',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['Accelerate', 'Forward', 'Onward']}
        frame={currentFrame}
        fps={30}
        morphDuration={40}
        pauseDuration={80}
        loop={true}
        fontSize={44}
        color="#fbc531"
        easing="ease-in"
        blurIntensity={5}
      />
    </div>
  );
}

/**
 * Ease-out easing example
 */
export function EaseOutExample() {
  const currentFrame = 65; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#353b48',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['Decelerate', 'Slow', 'Gentle']}
        frame={currentFrame}
        fps={30}
        morphDuration={40}
        pauseDuration={80}
        loop={true}
        fontSize={44}
        color="#e84118"
        easing="ease-out"
        blurIntensity={5}
      />
    </div>
  );
}

/**
 * Compact text with tight spacing
 */
export function CompactExample() {
  const currentFrame = 85; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#2f3640',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['TIGHT', 'COMPACT', 'DENSE']}
        frame={currentFrame}
        fps={30}
        morphDuration={30}
        pauseDuration={60}
        loop={true}
        fontSize={40}
        color="#dcdde1"
        fontWeight="900"
        letterSpacing={-1}
        easing="ease-in-out"
        blurIntensity={4}
        style={{
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
}

/**
 * Wide spaced text
 */
export function WideSpacedExample() {
  const currentFrame = 95; // Example frame

  return (
    <div
      style={{
        padding: 40,
        backgroundColor: '#222f3e',
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MorphText
        texts={['S P A C E D', 'W I D E', 'A I R Y']}
        frame={currentFrame}
        fps={30}
        morphDuration={35}
        pauseDuration={70}
        loop={true}
        fontSize={38}
        color="#00d2d3"
        fontWeight="300"
        letterSpacing={8}
        easing="ease-in-out"
        blurIntensity={6}
      />
    </div>
  );
}

/**
 * Complete animation showcase (multiple stages)
 */
export function CompleteShowcaseExample() {
  const currentFrame = 200; // Example frame

  return (
    <div
      style={{
        padding: 60,
        backgroundColor: '#000000',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 50,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Title */}
      <MorphText
        texts={['MorphText', 'Component', 'Showcase']}
        frame={currentFrame}
        fps={30}
        morphDuration={35}
        pauseDuration={70}
        loop={true}
        fontSize={64}
        color="#ffffff"
        fontWeight="bold"
        easing="ease-in-out"
        blurIntensity={6}
      />

      {/* Subtitle */}
      <MorphText
        texts={['Smooth', 'Beautiful', 'Animated', 'Transitions']}
        frame={currentFrame + 30}
        fps={30}
        morphDuration={30}
        pauseDuration={60}
        loop={true}
        fontSize={32}
        color="#00d9ff"
        fontWeight="300"
        easing="ease-out"
        blurIntensity={4}
      />

      {/* Description */}
      <MorphText
        texts={['Built for Rendervid', 'Frame-based animation', 'Fully customizable']}
        frame={currentFrame + 60}
        fps={30}
        morphDuration={40}
        pauseDuration={80}
        loop={true}
        fontSize={24}
        color="#888888"
        fontFamily="Arial, sans-serif"
        easing="ease-in-out"
        blurIntensity={3}
      />
    </div>
  );
}
