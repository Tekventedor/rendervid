import React, { useMemo, useEffect } from 'react';
import { getCompositionDuration, getSceneAtFrame, TemplateProcessor } from '@rendervid/core';
import type { Scene, Layer } from '@rendervid/core';
import type { PlayerProps } from '../types';

const templateProcessor = new TemplateProcessor();
import { usePlayback } from '../hooks/usePlayback';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { Timeline } from './Timeline';
import { Controls } from './Controls';
import { LayerRenderer } from './LayerRenderer';

const defaultStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#0a0a0a',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  viewport: {
    position: 'relative' as const,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  canvas: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    height: '100%',
  },
};

/**
 * Get layers visible at a specific frame
 */
function getVisibleLayers(scene: Scene, frame: number): Layer[] {
  const sceneLocalFrame = frame - scene.startFrame;
  const sceneDuration = scene.endFrame - scene.startFrame;

  return scene.layers.filter((layer) => {
    // Check layer visibility window using 'from' and 'duration' properties
    const layerStart = layer.from ?? 0;
    const layerDuration = layer.duration ?? -1;
    const layerEnd = layerDuration === -1 ? sceneDuration : layerStart + layerDuration;

    // Filter out hidden layers
    if (layer.hidden) return false;

    return sceneLocalFrame >= layerStart && sceneLocalFrame < layerEnd;
  });
}

/**
 * Player component for previewing Rendervid templates
 */
export function Player({
  template,
  inputs = {},
  width: customWidth,
  height: customHeight,
  controls = true,
  autoplay = false,
  loop = false,
  speed = 1,
  className,
  style,
  onComplete,
  onFrameChange,
  onPlayStateChange,
  renderLayer,
  onExport,
}: PlayerProps): React.ReactElement {
  // Resolve input placeholders
  const resolvedTemplate = useMemo(() => {
    if (!inputs || Object.keys(inputs).length === 0) return template;
    return templateProcessor.resolveInputs(template, inputs);
  }, [template, inputs]);

  const { width: templateWidth, height: templateHeight, fps = 30 } = resolvedTemplate.output;
  const { scenes } = resolvedTemplate.composition;

  const width = customWidth ?? templateWidth;
  const height = customHeight ?? templateHeight;

  // Calculate total frames
  const totalFrames = useMemo(() => {
    return getCompositionDuration(resolvedTemplate.composition);
  }, [resolvedTemplate.composition]);

  // Playback hook
  const { state, controls: playbackControls } = usePlayback({
    fps,
    totalFrames,
    loop,
    initialSpeed: speed,
    autoplay,
    onComplete,
    onFrameChange,
  });

  // Keyboard controls
  useKeyboardControls({
    controls: playbackControls,
    state,
    enabled: true,
  });

  // Notify on play state change
  useEffect(() => {
    onPlayStateChange?.(state.isPlaying);
  }, [state.isPlaying, onPlayStateChange]);

  // Get current scene
  const currentScene = useMemo(() => {
    return getSceneAtFrame(resolvedTemplate.composition, state.currentFrame);
  }, [resolvedTemplate.composition, state.currentFrame]);

  // Get visible layers
  const visibleLayers = useMemo(() => {
    if (!currentScene) return [];
    return getVisibleLayers(currentScene, state.currentFrame);
  }, [currentScene, state.currentFrame]);

  // Calculate aspect ratio for scaling
  const aspectRatio = templateWidth / templateHeight;

  const viewportStyle: React.CSSProperties = {
    ...defaultStyles.viewport,
    aspectRatio: `${templateWidth} / ${templateHeight}`,
    maxWidth: width,
    maxHeight: height,
  };

  return (
    <div
      className={className}
      style={{
        ...defaultStyles.container,
        width: width,
        ...style,
      }}
    >
      {/* Viewport */}
      <div style={viewportStyle}>
        <div style={defaultStyles.canvas}>
          {currentScene ? (
            visibleLayers.map((layer) => (
              <LayerRenderer
                key={layer.id}
                layer={layer}
                frame={state.currentFrame}
                scene={currentScene}
                customRender={renderLayer}
              />
            ))
          ) : (
            <div style={defaultStyles.emptyState}>
              No scene at frame {state.currentFrame}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {controls && (
        <div style={defaultStyles.controlsContainer}>
          <Timeline
            currentFrame={state.currentFrame}
            totalFrames={totalFrames}
            scenes={scenes}
            fps={fps}
            onSeek={playbackControls.seekToFrame}
            isPlaying={state.isPlaying}
          />
          <Controls
            state={state}
            controls={playbackControls}
            onExport={onExport ? () => onExport(resolvedTemplate) : undefined}
          />
        </div>
      )}
    </div>
  );
}
