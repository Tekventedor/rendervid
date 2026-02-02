import React, { useEffect, useRef } from 'react';
import type { Template } from '@rendervid/core';
import { TemplateRenderer } from '@rendervid/renderer-browser';

export interface PreviewProps {
  template: Template;
  currentFrame: number;
  isPlaying: boolean;
  onFrameChange?: (frame: number) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
  width?: number;
  height?: number;
  className?: string;
}

export function Preview({
  template,
  currentFrame,
  isPlaying,
  onFrameChange,
  onPlayingChange,
  width,
  height,
  className = '',
}: PreviewProps) {
  const { width: templateWidth, height: templateHeight, fps = 30 } = template.output;
  const displayWidth = width || templateWidth;
  const displayHeight = height || templateHeight;
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(performance.now());
  const accumulatedTimeRef = useRef<number>(0);

  // Handle playback
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const totalFrames = getTotalFrames(template);
    const frameTime = 1000 / fps;
    lastTimeRef.current = performance.now();
    accumulatedTimeRef.current = 0;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      accumulatedTimeRef.current += deltaTime;

      if (accumulatedTimeRef.current >= frameTime) {
        const framesToAdvance = Math.floor(accumulatedTimeRef.current / frameTime);
        accumulatedTimeRef.current %= frameTime;

        let nextFrame = currentFrame + framesToAdvance;
        if (nextFrame >= totalFrames) {
          nextFrame = 0; // Loop
        }

        if (onFrameChange) {
          onFrameChange(nextFrame);
        }
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentFrame, template, fps, onFrameChange]);

  return (
    <div className={`rendervid-preview ${className}`}>
      <div
        style={{
          width: displayWidth,
          height: displayHeight,
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <TemplateRenderer
          scenes={template.composition.scenes}
          frame={currentFrame}
          fps={fps}
          width={templateWidth}
          height={templateHeight}
        />
      </div>
    </div>
  );
}

function getTotalFrames(template: Template): number {
  const scenes = template.composition.scenes as any[];
  if (scenes.length === 0) return 0;
  return Math.max(...scenes.map((s: any) => s.endFrame || 0));
}
