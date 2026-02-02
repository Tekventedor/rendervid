import React from 'react';
import { WaveBackground } from '@rendervid/components';
import type { VideoConfig } from '@rendervid/core';

/**
 * Ocean Wave Background Template
 *
 * A serene ocean-themed template featuring multiple layers of flowing
 * waves in blue and teal colors. Perfect for beach, ocean, or summer
 * themed content.
 *
 * Perfect for:
 * - Beach resorts and hotels
 * - Summer events
 * - Travel and tourism
 * - Wellness and relaxation content
 * - Ocean conservation messages
 */

export const config: VideoConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 6, // 6 seconds
};

interface WaveOceanProps {
  frame: number;
  title?: string;
  subtitle?: string;
  waveColors?: string[];
  waveSpeed?: number;
  waveCount?: number;
  amplitude?: number;
}

export function WaveOcean({
  frame,
  title = 'ENDLESS SUMMER',
  subtitle = 'Dive into paradise',
  waveColors = ['#0ea5e9', '#06b6d4', '#14b8a6'],
  waveSpeed = 0.3,
  waveCount = 3,
  amplitude = 60,
}: WaveOceanProps) {
  const fps = config.fps || 30;

  // Title animation - fade in with wave effect
  const titleStartFrame = 20;
  const titleDuration = 40;
  const titleProgress = Math.max(0, Math.min(1, (frame - titleStartFrame) / titleDuration));
  const titleOpacity = titleProgress;
  const titleY = 420 + (1 - titleProgress) * 30; // Slide up

  // Subtitle animation - delayed fade in
  const subtitleStartFrame = 50;
  const subtitleDuration = 35;
  const subtitleProgress = Math.max(0, Math.min(1, (frame - subtitleStartFrame) / subtitleDuration));
  const subtitleOpacity = subtitleProgress;

  // Floating animation for title
  const floatOffset = Math.sin((frame / fps) * 2) * 5;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0c4a6e', // Deep ocean blue
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sky gradient background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, #7dd3fc 0%, #38bdf8 40%, #0ea5e9 100%)',
        }}
      />

      {/* Wave Background - from bottom */}
      <WaveBackground
        frame={frame}
        fps={fps}
        colors={waveColors}
        waveCount={waveCount}
        amplitude={amplitude}
        frequency={0.015}
        speed={waveSpeed}
        direction="bottom"
        opacity={0.9}
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
        {/* Decorative Sun/Circle */}
        <div
          style={{
            position: 'absolute',
            top: '150px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            opacity: 0.3 + titleProgress * 0.4,
            boxShadow: '0 0 60px rgba(251, 191, 36, 0.6)',
            filter: 'blur(2px)',
          }}
        />

        {/* Main Title */}
        {frame >= titleStartFrame && (
          <div
            style={{
              opacity: titleOpacity,
              position: 'absolute',
              top: `${titleY + floatOffset}px`,
            }}
          >
            <h1
              style={{
                fontSize: '100px',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                margin: 0,
                padding: '0 60px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)',
                letterSpacing: '6px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
            >
              {title}
            </h1>
          </div>
        )}

        {/* Subtitle */}
        {frame >= subtitleStartFrame && (
          <div
            style={{
              opacity: subtitleOpacity,
              position: 'absolute',
              top: '580px',
            }}
          >
            <p
              style={{
                fontSize: '40px',
                fontWeight: '300',
                color: '#f0f9ff',
                textAlign: 'center',
                margin: 0,
                padding: '0 60px',
                letterSpacing: '3px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              {subtitle}
            </p>
          </div>
        )}

        {/* Decorative Wave Icon */}
        {frame >= subtitleStartFrame && (
          <div
            style={{
              position: 'absolute',
              bottom: '100px',
              opacity: subtitleOpacity * 0.6,
            }}
          >
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
              <path
                d="M0 20 Q 15 10, 30 20 T 60 20"
                stroke="#ffffff"
                strokeWidth="3"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M0 30 Q 15 20, 30 30 T 60 30"
                stroke="#ffffff"
                strokeWidth="3"
                fill="none"
                opacity="0.3"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Subtle overlay for depth */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 40%, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default WaveOcean;
