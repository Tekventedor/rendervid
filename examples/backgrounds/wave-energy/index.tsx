import React from 'react';
import { WaveBackground } from '@rendervid/components';
import type { VideoConfig } from '@rendervid/core';

/**
 * Energetic Wave Background Template
 *
 * A high-energy template featuring fast-moving waves from both top
 * and bottom with vibrant purple and pink gradients. Perfect for
 * modern tech, music, gaming, and energetic content.
 *
 * Perfect for:
 * - Tech product launches
 * - Gaming tournaments
 * - Music releases
 * - Fitness and sports events
 * - Modern brand presentations
 * - Dynamic announcements
 */

export const config: VideoConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 5, // 5 seconds for high energy
};

interface WaveEnergyProps {
  frame: number;
  title?: string;
  subtitle?: string;
  tagline?: string;
  waveColors?: string[];
  waveSpeed?: number;
  waveCount?: number;
  amplitude?: number;
}

export function WaveEnergy({
  frame,
  title = 'UNLEASH',
  subtitle = 'THE POWER',
  tagline = 'Next Generation Technology',
  waveColors = ['#8b5cf6', '#d946ef', '#ec4899'],
  waveSpeed = 0.8,
  waveCount = 3,
  amplitude = 70,
}: WaveEnergyProps) {
  const fps = config.fps || 30;

  // Fast, energetic animations
  const titleStartFrame = 10;
  const titleDuration = 25;
  const titleProgress = Math.max(0, Math.min(1, (frame - titleStartFrame) / titleDuration));

  // Elastic ease out for punchy entrance
  const elasticProgress = titleProgress < 1
    ? 1 - Math.pow(1 - titleProgress, 3) * Math.cos(titleProgress * Math.PI * 2.5)
    : 1;

  const titleOpacity = titleProgress;
  const titleScale = 0.5 + elasticProgress * 0.5;

  // Subtitle - staggered entrance
  const subtitleStartFrame = 25;
  const subtitleDuration = 20;
  const subtitleProgress = Math.max(0, Math.min(1, (frame - subtitleStartFrame) / subtitleDuration));
  const subtitleOpacity = subtitleProgress;
  const subtitleScale = 0.5 + subtitleProgress * 0.5;

  // Tagline - delayed
  const taglineStartFrame = 50;
  const taglineDuration = 30;
  const taglineProgress = Math.max(0, Math.min(1, (frame - taglineStartFrame) / taglineDuration));
  const taglineOpacity = taglineProgress;

  // Pulse effect on title
  const pulseScale = 1 + Math.sin((frame / fps) * 8) * 0.02;

  // Glitch-like color shift effect
  const glitchOffset = Math.sin(frame * 0.5) * 2;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dark gradient background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, #1a0a2e 0%, #0a0a0a 100%)',
        }}
      />

      {/* Wave Background - Top waves */}
      <WaveBackground
        frame={frame}
        fps={fps}
        colors={waveColors}
        waveCount={waveCount}
        amplitude={amplitude}
        frequency={0.02}
        speed={waveSpeed}
        direction="top"
        opacity={0.4}
        width="100%"
        height="100%"
      />

      {/* Wave Background - Bottom waves (faster) */}
      <WaveBackground
        frame={frame}
        fps={fps}
        colors={waveColors}
        waveCount={waveCount}
        amplitude={amplitude * 1.2}
        frequency={0.025}
        speed={waveSpeed * 1.3}
        direction="bottom"
        opacity={0.4}
        width="100%"
        height="100%"
      />

      {/* Content Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* Main Title - First Line */}
        {frame >= titleStartFrame && (
          <div
            style={{
              opacity: titleOpacity,
              transform: `scale(${titleScale * pulseScale})`,
            }}
          >
            <h1
              style={{
                fontSize: '140px',
                fontWeight: '900',
                color: '#ffffff',
                textAlign: 'center',
                margin: 0,
                padding: 0,
                textShadow: `
                  ${glitchOffset}px 0 0 #8b5cf6,
                  ${-glitchOffset}px 0 0 #ec4899,
                  0 0 40px rgba(139, 92, 246, 0.6),
                  0 0 80px rgba(236, 72, 153, 0.4)
                `,
                letterSpacing: '12px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                textTransform: 'uppercase',
              }}
            >
              {title}
            </h1>
          </div>
        )}

        {/* Subtitle - Second Line */}
        {frame >= subtitleStartFrame && (
          <div
            style={{
              opacity: subtitleOpacity,
              transform: `scale(${subtitleScale})`,
              marginTop: '-20px',
            }}
          >
            <h2
              style={{
                fontSize: '140px',
                fontWeight: '900',
                color: '#ffffff',
                textAlign: 'center',
                margin: 0,
                padding: 0,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '12px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                textTransform: 'uppercase',
                textShadow: '0 0 40px rgba(139, 92, 246, 0.6)',
              }}
            >
              {subtitle}
            </h2>
          </div>
        )}

        {/* Decorative Line */}
        {frame >= subtitleStartFrame && (
          <div
            style={{
              marginTop: '40px',
              width: `${Math.min(600, subtitleProgress * 600)}px`,
              height: '4px',
              background: 'linear-gradient(90deg, transparent 0%, #8b5cf6 20%, #ec4899 80%, transparent 100%)',
              opacity: subtitleOpacity,
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)',
            }}
          />
        )}

        {/* Tagline */}
        {frame >= taglineStartFrame && (
          <div
            style={{
              opacity: taglineOpacity,
              marginTop: '60px',
            }}
          >
            <p
              style={{
                fontSize: '32px',
                fontWeight: '600',
                color: '#d4d4d8',
                textAlign: 'center',
                margin: 0,
                padding: '0 60px',
                letterSpacing: '4px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                textTransform: 'uppercase',
              }}
            >
              {tagline}
            </p>
          </div>
        )}

        {/* Energy particles/dots decoration */}
        {frame >= titleStartFrame && (
          <>
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const radius = 350 + Math.sin((frame / fps) * 3 + i) * 30;
              const x = 960 + Math.cos(angle + (frame / fps) * 2) * radius;
              const y = 540 + Math.sin(angle + (frame / fps) * 2) * radius;
              const size = 4 + Math.sin((frame / fps) * 4 + i) * 2;
              const particleOpacity = 0.3 + Math.sin((frame / fps) * 5 + i) * 0.3;

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: '50%',
                    backgroundColor: i % 2 === 0 ? '#8b5cf6' : '#ec4899',
                    opacity: particleOpacity * titleOpacity,
                    boxShadow: `0 0 ${size * 3}px ${i % 2 === 0 ? '#8b5cf6' : '#ec4899'}`,
                  }}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Vignette effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default WaveEnergy;
