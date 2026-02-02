import React from 'react';
import { GlitchEffect, Text } from '@rendervid/components';
import type { VideoConfig } from '@rendervid/core';

/**
 * Glitch Reveal Template
 *
 * Text starts heavily glitched and gradually becomes clear.
 * Multiple glitch types transition for a dramatic reveal effect.
 */

export const config: VideoConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 6, // 6 seconds
};

interface TemplateProps {
  frame: number;
  text?: string;
  finalText?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function GlitchReveal({
  frame,
  text = 'TRANSMISSION INCOMING',
  finalText = 'MESSAGE DECODED',
  backgroundColor = '#000000',
  textColor = '#ffffff'
}: TemplateProps) {
  const fps = config.fps || 30;
  const totalFrames = (config.duration || 6) * fps;

  // Calculate intensity that decreases over time
  // Starts at 1.0, ends at 0
  const progress = Math.min(frame / totalFrames, 1);
  const intensity = Math.max(1.0 - progress, 0);

  // Determine which glitch type to use based on progress
  // Transition: scramble -> noise -> rgb-split -> shift -> slice -> none
  let glitchType: 'scramble' | 'noise' | 'rgb-split' | 'shift' | 'slice' = 'scramble';

  if (progress < 0.2) {
    glitchType = 'scramble'; // 0-20%: Most chaotic
  } else if (progress < 0.4) {
    glitchType = 'noise'; // 20-40%: Digital noise
  } else if (progress < 0.6) {
    glitchType = 'rgb-split'; // 40-60%: Color separation
  } else if (progress < 0.8) {
    glitchType = 'shift'; // 60-80%: Position shifts
  } else {
    glitchType = 'slice'; // 80-100%: Subtle slicing
  }

  // Frequency decreases as well (more glitches at start, fewer at end)
  const frequency = 0.5 * (1 - progress * 0.8); // 0.5 -> 0.1

  // Show initial text for first 70%, then fade to final text
  const displayText = progress < 0.7 ? text : finalText;

  // Calculate opacity for fade transition
  const textOpacity = progress < 0.7
    ? 1
    : progress < 0.85
      ? 1 - ((progress - 0.7) / 0.15)
      : 0;

  const finalTextOpacity = progress < 0.7
    ? 0
    : progress < 0.85
      ? (progress - 0.7) / 0.15
      : 1;

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
      {/* Noise overlay - fades out over time */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
          opacity: intensity * 0.3,
          pointerEvents: 'none',
        }}
      />

      {/* Animated scan line */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: 3,
          backgroundColor: textColor,
          top: `${(frame * 3) % 1080}px`,
          opacity: intensity * 0.5,
          boxShadow: `0 0 20px ${textColor}`,
        }}
      />

      {/* Main content container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%',
          textAlign: 'center',
        }}
      >
        {/* Initial glitched text */}
        {progress < 0.85 && (
          <GlitchEffect
            type={glitchType}
            intensity={intensity}
            frequency={frequency}
            duration={150}
            frame={frame}
            fps={fps}
          >
            <div
              style={{
                fontSize: 96,
                color: textColor,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                opacity: textOpacity,
                textShadow: intensity > 0.5 ? `0 0 ${intensity * 30}px ${textColor}` : 'none',
              }}
            >
              {displayText}
            </div>
          </GlitchEffect>
        )}

        {/* Final clear text */}
        {progress >= 0.7 && (
          <div
            style={{
              position: progress < 0.85 ? 'absolute' : 'relative',
              top: progress < 0.85 ? '50%' : 'auto',
              left: progress < 0.85 ? '50%' : 'auto',
              transform: progress < 0.85 ? 'translate(-50%, -50%)' : 'none',
              width: '100%',
              fontSize: 96,
              color: textColor,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              opacity: finalTextOpacity,
            }}
          >
            {finalText}
          </div>
        )}
      </div>

      {/* Progress indicator bars */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const segmentProgress = progress * 5;
          const isActive = segmentProgress > i;
          const isCurrent = segmentProgress >= i && segmentProgress < i + 1;

          return (
            <div
              key={i}
              style={{
                width: 60,
                height: 6,
                backgroundColor: isActive ? textColor : 'rgba(255, 255, 255, 0.2)',
                opacity: isCurrent ? 0.5 + Math.sin(frame * 0.3) * 0.5 : 1,
                boxShadow: isActive ? `0 0 10px ${textColor}` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Stage indicator text */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 18,
          color: textColor,
          fontFamily: 'monospace',
          opacity: 0.6,
          letterSpacing: '0.1em',
        }}
      >
        {progress < 0.2 && 'INITIALIZING...'}
        {progress >= 0.2 && progress < 0.4 && 'PROCESSING...'}
        {progress >= 0.4 && progress < 0.6 && 'DECODING...'}
        {progress >= 0.6 && progress < 0.8 && 'STABILIZING...'}
        {progress >= 0.8 && progress < 0.95 && 'FINALIZING...'}
        {progress >= 0.95 && 'COMPLETE'}
      </div>

      {/* Scanline overlay */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.02) 2px, rgba(255, 255, 255, 0.02) 4px)',
          pointerEvents: 'none',
          opacity: intensity * 0.5,
        }}
      />
    </div>
  );
}

export default GlitchReveal;
