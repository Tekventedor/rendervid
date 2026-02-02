import React from 'react';
import { GlitchEffect, GradientText, Shape } from '@rendervid/components';
import type { VideoConfig } from '@rendervid/core';

/**
 * Glitchy Title Intro Template
 *
 * A cyberpunk-style title card with dramatic glitch effects.
 * Perfect for tech content, gaming videos, or edgy introductions.
 */

export const config: VideoConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 6, // 6 seconds
};

interface TemplateProps {
  frame: number;
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

export function GlitchTitle({
  frame,
  title = 'SYSTEM BREACH',
  subtitle = 'Access Granted',
  accentColor = '#00ff00'
}: TemplateProps) {
  const fps = config.fps || 30;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dark gradient background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a1a 100%)',
        }}
      />

      {/* Grid overlay for tech aesthetic */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.3,
        }}
      />

      {/* Animated accent bars */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '40%',
          width: Math.min((frame / 20) * 100, 500),
          height: 4,
          backgroundColor: accentColor,
          boxShadow: `0 0 20px ${accentColor}`,
          transition: 'width 0.1s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: '40%',
          width: Math.min((frame / 20) * 100, 500),
          height: 4,
          backgroundColor: accentColor,
          boxShadow: `0 0 20px ${accentColor}`,
          transition: 'width 0.1s',
        }}
      />

      {/* Main title with RGB split glitch */}
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
        {frame >= 15 && (
          <GlitchEffect
            type="rgb-split"
            intensity={0.9}
            frequency={0.2}
            duration={120}
            frame={frame - 15}
            fps={fps}
          >
            <div style={{ marginBottom: 30 }}>
              <GradientText
                text={title}
                colors={['#ff0080', '#00ffff', '#ffff00']}
                fontSize={120}
                fontWeight="bold"
                fontFamily="'Arial Black', sans-serif"
                style={{
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textShadow: `0 0 30px ${accentColor}`,
                }}
              />
            </div>
          </GlitchEffect>
        )}

        {/* Subtitle with scramble effect */}
        {frame >= 45 && (
          <GlitchEffect
            type="scramble"
            intensity={0.6}
            frequency={0.15}
            duration={100}
            frame={frame - 45}
            fps={fps}
          >
            <div
              style={{
                fontSize: 42,
                color: accentColor,
                fontFamily: 'monospace',
                fontWeight: '600',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textShadow: `0 0 15px ${accentColor}`,
              }}
            >
              {subtitle}
            </div>
          </GlitchEffect>
        )}
      </div>

      {/* Corner accents */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          width: 60,
          height: 60,
          borderTop: `3px solid ${accentColor}`,
          borderLeft: `3px solid ${accentColor}`,
          opacity: frame >= 30 ? 1 : 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderBottom: `3px solid ${accentColor}`,
          borderRight: `3px solid ${accentColor}`,
          opacity: frame >= 30 ? 1 : 0,
        }}
      />

      {/* Scanline effect */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.7) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default GlitchTitle;
