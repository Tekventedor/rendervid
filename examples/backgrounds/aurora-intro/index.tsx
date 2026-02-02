import React from 'react';
import { AuroraBackground } from '@rendervid/components';
import type { VideoConfig } from '@rendervid/core';

/**
 * Aurora Northern Lights Intro Template
 *
 * A stunning intro animation featuring the AuroraBackground component
 * with vibrant northern lights effects, centered title with fade-in
 * animation, and elegant subtitle text.
 *
 * Perfect for:
 * - Product launches
 * - Brand introductions
 * - Event openings
 * - Social media content
 */

export const config: VideoConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 6, // 6 seconds
};

interface AuroraIntroProps {
  frame: number;
  title?: string;
  subtitle?: string;
  auroraColors?: string[];
  speed?: number;
  blur?: number;
  opacity?: number;
}

export function AuroraIntro({
  frame,
  title = 'WELCOME',
  subtitle = 'Experience the Magic',
  auroraColors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'],
  speed = 0.8,
  blur = 40,
  opacity = 0.6,
}: AuroraIntroProps) {
  const fps = config.fps || 30;
  const totalFrames = (config.duration || 6) * fps;

  // Title fade-in animation
  const titleStartFrame = 30; // Start at 1 second
  const titleDuration = 45; // 1.5 seconds fade-in
  const titleProgress = Math.max(0, Math.min(1, (frame - titleStartFrame) / titleDuration));
  const titleOpacity = titleProgress;
  const titleScale = 0.8 + titleProgress * 0.2; // Scale from 0.8 to 1.0

  // Subtitle fade-in animation (delayed)
  const subtitleStartFrame = 60; // Start at 2 seconds
  const subtitleDuration = 30; // 1 second fade-in
  const subtitleProgress = Math.max(0, Math.min(1, (frame - subtitleStartFrame) / subtitleDuration));
  const subtitleOpacity = subtitleProgress;
  const subtitleY = 650 - (1 - subtitleProgress) * 20; // Slide up slightly

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a1f',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Aurora Background */}
      <AuroraBackground
        colors={auroraColors}
        speed={speed}
        blur={blur}
        opacity={opacity}
        frame={frame}
        totalFrames={totalFrames}
        fps={fps}
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
        {/* Main Title */}
        {frame >= titleStartFrame && (
          <div
            style={{
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              transition: 'all 0.3s ease-out',
            }}
          >
            <h1
              style={{
                fontSize: '120px',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                margin: 0,
                padding: '0 60px',
                textShadow: '0 0 40px rgba(255, 255, 255, 0.5), 0 0 80px rgba(102, 126, 234, 0.3)',
                letterSpacing: '8px',
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
              top: `${subtitleY}px`,
            }}
          >
            <p
              style={{
                fontSize: '36px',
                fontWeight: '300',
                color: '#e2e8f0',
                textAlign: 'center',
                margin: 0,
                padding: '0 60px',
                letterSpacing: '2px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
            >
              {subtitle}
            </p>
          </div>
        )}

        {/* Decorative Line */}
        {frame >= subtitleStartFrame && (
          <div
            style={{
              position: 'absolute',
              top: '730px',
              width: `${Math.min(400, subtitleProgress * 400)}px`,
              height: '2px',
              backgroundColor: '#ffffff',
              opacity: subtitleOpacity * 0.5,
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AuroraIntro;
