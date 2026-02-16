import React, { useMemo } from 'react';
import type { CaptionLayer as CaptionLayerType, CaptionCue } from '@rendervid/core';
import { parseCaptions, getActiveCues } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';

export interface CaptionLayerProps {
  layer: CaptionLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
}

export function CaptionLayer({ layer, frame, fps, sceneDuration }: CaptionLayerProps) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  const {
    content,
    format,
    cues: propCues,
    fontSize = 32,
    fontFamily = 'sans-serif',
    fontWeight = 'normal',
    color = '#ffffff',
    backgroundColor = 'rgba(0, 0, 0, 0.75)',
    textAlign = 'center',
    padding = 8,
    borderRadius = 4,
    lineHeight = 1.4,
  } = layer.props;

  // Parse cues from content or use provided cues array
  const cues: CaptionCue[] = useMemo(() => {
    if (propCues && propCues.length > 0) return propCues;
    if (content) return parseCaptions(content, format);
    return [];
  }, [content, format, propCues]);

  // Calculate current time in seconds
  const currentTime = frame / fps;

  // Find active cues
  const activeCues = getActiveCues(cues, currentTime);

  // Resolve layer style
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};

  // Apply anchor point
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - (layer.size.width * anchor.x);
  const top = layer.position.y - (layer.size.height * anchor.y);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
        opacity: layer.opacity ?? 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        ...layerStyle,
        ...animationStyle,
      }}
      className={layer.className}
    >
      {activeCues.length > 0 && (
        <div
          style={{
            backgroundColor,
            padding: `${padding}px ${padding * 2}px`,
            borderRadius: `${borderRadius}px`,
            maxWidth: '90%',
          }}
        >
          {activeCues.map((cue, i) => (
            <div
              key={i}
              style={{
                fontSize: `${fontSize}px`,
                fontFamily,
                fontWeight: fontWeight as string,
                color,
                textAlign: textAlign as React.CSSProperties['textAlign'],
                lineHeight,
                whiteSpace: 'pre-wrap',
              }}
            >
              {cue.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
