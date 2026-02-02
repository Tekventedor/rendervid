import React from 'react';
import { GlitchEffect, Text, GradientText } from '@rendervid/components';

/**
 * Example demonstrating various GlitchEffect types
 *
 * This example shows all five glitch types:
 * 1. Slice - horizontal slices with displacement
 * 2. Shift - position and skew shifts
 * 3. RGB Split - chromatic aberration effect
 * 4. Noise - digital noise overlay with scanlines
 * 5. Scramble - chaotic multi-layer distortion
 */

export function GlitchEffectExample({ frame }: { frame: number }) {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 60,
        padding: 40,
      }}
    >
      {/* Title */}
      <h1
        style={{
          color: '#00ff00',
          fontSize: 48,
          fontFamily: 'monospace',
          marginBottom: 20,
        }}
      >
        Glitch Effect Examples
      </h1>

      {/* RGB Split Effect - Most dramatic and popular */}
      <GlitchEffect
        type="rgb-split"
        intensity={0.8}
        frequency={0.15}
        duration={120}
        frame={frame}
        fps={30}
      >
        <GradientText
          text="RGB SPLIT GLITCH"
          colors={['#ff0080', '#00ffff', '#ffff00']}
          fontSize={72}
          fontWeight="bold"
          fontFamily="monospace"
        />
      </GlitchEffect>

      {/* Scramble Effect - Chaotic fragmentation */}
      <GlitchEffect
        type="scramble"
        intensity={0.6}
        frequency={0.12}
        duration={100}
        frame={frame}
        fps={30}
      >
        <Text
          text="SCRAMBLE CORRUPTION"
          fontSize={56}
          color="#ff00ff"
          fontWeight="bold"
          fontFamily="monospace"
        />
      </GlitchEffect>

      {/* Slice Effect - Clean horizontal displacement */}
      <GlitchEffect
        type="slice"
        intensity={0.7}
        frequency={0.2}
        duration={80}
        frame={frame}
        fps={30}
      >
        <Text
          text="SLICE DISPLACEMENT"
          fontSize={56}
          color="#00ff00"
          fontWeight="bold"
          fontFamily="monospace"
        />
      </GlitchEffect>

      {/* Shift Effect - Position and skew */}
      <GlitchEffect
        type="shift"
        intensity={0.5}
        frequency={0.18}
        duration={90}
        frame={frame}
        fps={30}
      >
        <Text
          text="SHIFT TRANSFORM"
          fontSize={56}
          color="#ffff00"
          fontWeight="bold"
          fontFamily="monospace"
        />
      </GlitchEffect>

      {/* Noise Effect - Digital corruption with scanlines */}
      <GlitchEffect
        type="noise"
        intensity={0.9}
        frequency={0.25}
        duration={150}
        frame={frame}
        fps={30}
      >
        <Text
          text="DIGITAL NOISE"
          fontSize={56}
          color="#ffffff"
          fontWeight="bold"
          fontFamily="monospace"
        />
      </GlitchEffect>
    </div>
  );
}

/**
 * Example with combined effects
 */
export function CombinedGlitchExample({ frame }: { frame: number }) {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#0a0a0a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Layered glitch effects */}
      <GlitchEffect
        type="rgb-split"
        intensity={0.6}
        frequency={0.1}
        duration={100}
        frame={frame}
        fps={30}
      >
        <GlitchEffect
          type="scramble"
          intensity={0.3}
          frequency={0.15}
          duration={80}
          frame={frame}
          fps={30}
        >
          <div
            style={{
              padding: 60,
              border: '4px solid #00ff00',
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
            }}
          >
            <GradientText
              text="LAYERED GLITCH"
              colors={['#ff0080', '#7928ca', '#00ffff']}
              fontSize={96}
              fontWeight="bold"
              fontFamily="monospace"
            />
            <Text
              text="Multiple effect layers"
              fontSize={32}
              color="#ffffff"
              fontFamily="monospace"
              style={{ marginTop: 20, textAlign: 'center' }}
            />
          </div>
        </GlitchEffect>
      </GlitchEffect>
    </div>
  );
}

/**
 * Example usage in a video sequence
 */
export function GlitchSequenceExample({ frame }: { frame: number }) {
  // Different glitch types appear at different times
  const glitchType = (() => {
    if (frame < 90) return 'slice';
    if (frame < 180) return 'shift';
    if (frame < 270) return 'rgb-split';
    if (frame < 360) return 'noise';
    return 'scramble';
  })();

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#000000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <GlitchEffect
        type={glitchType as any}
        intensity={0.7}
        frequency={0.2}
        duration={100}
        frame={frame}
        fps={30}
      >
        <div style={{ textAlign: 'center' }}>
          <GradientText
            text="GLITCH SEQUENCE"
            colors={['#ff0080', '#00ffff']}
            fontSize={96}
            fontWeight="bold"
            fontFamily="monospace"
          />
          <Text
            text={`Effect: ${glitchType.toUpperCase()}`}
            fontSize={40}
            color="#00ff00"
            fontFamily="monospace"
            style={{ marginTop: 30 }}
          />
        </div>
      </GlitchEffect>
    </div>
  );
}
