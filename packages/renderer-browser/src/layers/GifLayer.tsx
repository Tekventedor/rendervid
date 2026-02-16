import React, { useEffect, useRef, useState } from 'react';
import type { GifLayer as GifLayerType } from '@rendervid/core';
import { getGifFrameAtTime } from '@rendervid/core';
import { useLayerAnimation } from '../hooks/useLayerAnimation';
import { resolveStyle } from '../styles/resolver';
import { decodeGif, type DecodedGif } from '../utils/gif-decoder';

export interface GifLayerProps {
  layer: GifLayerType;
  frame: number;
  fps: number;
  sceneDuration: number;
}

export function GifLayer({ layer, frame, fps, sceneDuration }: GifLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [decodedGif, setDecodedGif] = useState<DecodedGif | null>(null);
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);

  const {
    src,
    fit = 'cover',
    loop = true,
    speed = 1,
  } = layer.props;

  // Resolve layer style
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};

  // Fetch and decode GIF
  useEffect(() => {
    if (!src) return;

    let cancelled = false;

    const loadGif = async () => {
      try {
        let buffer: ArrayBuffer;

        if (src.startsWith('data:')) {
          // Data URL
          const resp = await fetch(src);
          buffer = await resp.arrayBuffer();
        } else {
          const resp = await fetch(src);
          buffer = await resp.arrayBuffer();
        }

        if (cancelled) return;
        const decoded = decodeGif(buffer);
        setDecodedGif(decoded);
      } catch (err) {
        console.warn('Failed to decode GIF:', err);
      }
    };

    loadGif();
    return () => { cancelled = true; };
  }, [src]);

  // Paint current frame on canvas
  useEffect(() => {
    if (!decodedGif || !canvasRef.current) return;

    const { metadata, frames } = decodedGif;
    if (frames.length === 0) return;

    const timeMs = (frame / fps) * 1000;
    const frameIndex = getGifFrameAtTime(metadata, timeMs, loop, speed);
    const imageData = frames[Math.min(frameIndex, frames.length - 1)];

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx || !imageData) return;

    canvasRef.current.width = metadata.width;
    canvasRef.current.height = metadata.height;
    ctx.putImageData(imageData, 0, 0);
  }, [decodedGif, frame, fps, loop, speed]);

  // Apply anchor point
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - (layer.size.width * anchor.x);
  const top = layer.position.y - (layer.size.height * anchor.y);

  // Map fit to object-fit
  const objectFit = fit === 'fill' ? 'fill' as const : fit as 'cover' | 'contain' | 'none';

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
        overflow: 'hidden',
        ...layerStyle,
        ...animationStyle,
      }}
      className={layer.className}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
        }}
      />
    </div>
  );
}
