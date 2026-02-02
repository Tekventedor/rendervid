import React from 'react';
import { GlitchEffect, Text, GradientText } from '@rendervid/components';
import type { VideoConfig } from '@rendervid/core';

/**
 * Glitch Transition Template
 *
 * Multiple text layers with different glitch frequencies creating
 * a complex, dynamic visual with periodic glitch bursts.
 */

export const config: VideoConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 6, // 6 seconds
};

interface TemplateProps {
  frame: number;
  line1?: string;
  line2?: string;
  line3?: string;
  tagline?: string;
  backgroundColor?: string;
}

export function GlitchTransition({
  frame,
  line1 = 'DIGITAL',
  line2 = 'CHAOS',
  line3 = 'THEORY',
  tagline = 'Where order meets disorder',
  backgroundColor = '#0a0a0a'
}: TemplateProps) {
  const fps = config.fps || 30;

  // Different phase offsets for staggered appearance
  const phase1Start = 0;
  const phase2Start = 20;
  const phase3Start = 40;
  const taglineStart = 70;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor,
      }}
    >
      {/* Gradient overlay for depth */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 30% 40%, rgba(255, 0, 128, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Background animated bars */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: -100,
          width: 400,
          height: 3,
          backgroundColor: '#ff0080',
          opacity: 0.3 + Math.sin(frame * 0.1) * 0.2,
          transform: `translateX(${(frame * 2) % 2020}px)`,
          boxShadow: '0 0 20px #ff0080',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          right: -100,
          width: 300,
          height: 3,
          backgroundColor: '#00ffff',
          opacity: 0.3 + Math.sin(frame * 0.15) * 0.2,
          transform: `translateX(${-((frame * 2.5) % 2020)}px)`,
          boxShadow: '0 0 20px #00ffff',
        }}
      />

      {/* Main content container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          textAlign: 'center',
        }}
      >
        {/* Line 1: RGB Split with high frequency */}
        {frame >= phase1Start && (
          <div style={{ marginBottom: 20 }}>
            <GlitchEffect
              type="rgb-split"
              intensity={0.7}
              frequency={0.3} // Glitches frequently
              duration={100}
              frame={frame - phase1Start}
              fps={fps}
            >
              <GradientText
                text={line1}
                colors={['#ff0080', '#ff0080', '#ff00ff']}
                fontSize={110}
                fontWeight="bold"
                fontFamily="'Arial Black', sans-serif"
                style={{
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              />
            </GlitchEffect>
          </div>
        )}

        {/* Line 2: Slice with medium frequency */}
        {frame >= phase2Start && (
          <div style={{ marginBottom: 20 }}>
            <GlitchEffect
              type="slice"
              intensity={0.8}
              frequency={0.18} // Medium frequency
              duration={120}
              frame={frame - phase2Start}
              fps={fps}
            >
              <GradientText
                text={line2}
                colors={['#00ffff', '#00ffff', '#0080ff']}
                fontSize={140}
                fontWeight="bold"
                fontFamily="'Arial Black', sans-serif"
                style={{
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              />
            </GlitchEffect>
          </div>
        )}

        {/* Line 3: Scramble with low frequency */}
        {frame >= phase3Start && (
          <div style={{ marginBottom: 40 }}>
            <GlitchEffect
              type="scramble"
              intensity={0.5}
              frequency={0.12} // Less frequent
              duration={80}
              frame={frame - phase3Start}
              fps={fps}
            >
              <GradientText
                text={line3}
                colors={['#ffff00', '#ffff00', '#ff8000']}
                fontSize={110}
                fontWeight="bold"
                fontFamily="'Arial Black', sans-serif"
                style={{
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              />
            </GlitchEffect>
          </div>
        )}

        {/* Tagline: Shift effect with very low frequency */}
        {frame >= taglineStart && (
          <GlitchEffect
            type="shift"
            intensity={0.4}
            frequency={0.08} // Rare glitches
            duration={60}
            frame={frame - taglineStart}
            fps={fps}
          >
            <div
              style={{
                fontSize: 36,
                color: '#ffffff',
                fontFamily: 'sans-serif',
                fontStyle: 'italic',
                letterSpacing: '0.05em',
                opacity: 0.9,
              }}
            >
              {tagline}
            </div>
          </GlitchEffect>
        )}
      </div>

      {/* Decorative corner elements */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          width: 80,
          height: 80,
          borderTop: '4px solid #ff0080',
          borderLeft: '4px solid #ff0080',
          opacity: frame >= 10 ? 0.6 : 0,
          boxShadow: '0 0 15px #ff0080',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          width: 80,
          height: 80,
          borderTop: '4px solid #00ffff',
          borderRight: '4px solid #00ffff',
          opacity: frame >= 30 ? 0.6 : 0,
          boxShadow: '0 0 15px #00ffff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          width: 80,
          height: 80,
          borderBottom: '4px solid #ffff00',
          borderLeft: '4px solid #ffff00',
          opacity: frame >= 50 ? 0.6 : 0,
          boxShadow: '0 0 15px #ffff00',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          width: 80,
          height: 80,
          borderBottom: '4px solid #ff00ff',
          borderRight: '4px solid #ff00ff',
          opacity: frame >= 70 ? 0.6 : 0,
          boxShadow: '0 0 15px #ff00ff',
        }}
      />

      {/* Center accent lines */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 100,
          width: Math.min(frame * 10, 400),
          height: 2,
          backgroundColor: '#ff0080',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: 100,
          width: Math.min(frame * 10, 400),
          height: 2,
          backgroundColor: '#00ffff',
          opacity: 0.5,
        }}
      />

      {/* Subtle noise texture */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      />

      {/* Scanlines */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.02) 2px, rgba(255, 255, 255, 0.02) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Pulsing center dot (subtle) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          opacity: 0.3 + Math.sin(frame * 0.2) * 0.2,
          boxShadow: '0 0 20px #ffffff',
        }}
      />
    </div>
  );
}

export default GlitchTransition;
