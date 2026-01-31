import React from 'react';
import type { Layer } from '@rendervid/core';
import { ImageLayer } from './ImageLayer';
import { TextLayer } from './TextLayer';
import { VideoLayer } from './VideoLayer';
import { ShapeLayer } from './ShapeLayer';
import { AudioLayer } from './AudioLayer';
import { GroupLayer } from './GroupLayer';
import { LottieLayer } from './LottieLayer';
import { CustomLayer } from './CustomLayer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomComponentType = React.ComponentType<any>;

export interface LayerRendererProps {
  layer: Layer;
  frame: number;
  fps: number;
  sceneDuration: number;
  isPlaying?: boolean;
  registry?: Map<string, CustomComponentType>;
}

/**
 * Renders a layer based on its type.
 */
export function LayerRenderer({
  layer,
  frame,
  fps,
  sceneDuration,
  isPlaying = true,
  registry,
}: LayerRendererProps) {
  // Check if layer should be visible at current frame
  const layerStart = layer.from ?? 0;
  const layerDuration = layer.duration ?? sceneDuration;
  const layerEnd = layerStart + layerDuration;

  if (frame < layerStart || frame >= layerEnd) {
    return null;
  }

  // Check if layer is hidden
  if (layer.hidden) {
    return null;
  }

  // Calculate local frame (relative to layer start)
  const localFrame = frame - layerStart;

  const commonProps = {
    frame: localFrame,
    fps,
    sceneDuration: layerDuration,
  };

  switch (layer.type) {
    case 'image':
      return <ImageLayer layer={layer} {...commonProps} />;

    case 'text':
      return <TextLayer layer={layer} {...commonProps} />;

    case 'video':
      return <VideoLayer layer={layer} {...commonProps} isPlaying={isPlaying} />;

    case 'shape':
      return <ShapeLayer layer={layer} {...commonProps} />;

    case 'audio':
      return <AudioLayer layer={layer} {...commonProps} isPlaying={isPlaying} />;

    case 'group':
      return (
        <GroupLayer
          layer={layer}
          {...commonProps}
          isPlaying={isPlaying}
          registry={registry}
        />
      );

    case 'lottie':
      return <LottieLayer layer={layer} {...commonProps} />;

    case 'custom':
      return (
        <CustomLayer
          layer={layer}
          {...commonProps}
          registry={registry}
        />
      );

    default:
      console.warn(`Unknown layer type: ${(layer as Layer).type}`);
      return null;
  }
}
