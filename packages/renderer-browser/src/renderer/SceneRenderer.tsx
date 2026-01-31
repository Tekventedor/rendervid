import React from 'react';
import type { Scene } from '@rendervid/core';
import { LayerRenderer } from '../layers/LayerRenderer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomComponentType = React.ComponentType<any>;

export interface SceneRendererProps {
  /** Scene to render */
  scene: Scene;
  /** Current frame number */
  frame: number;
  /** Frames per second */
  fps: number;
  /** Output width */
  width: number;
  /** Output height */
  height: number;
  /** Whether the scene is playing (for audio/video sync) */
  isPlaying?: boolean;
  /** Custom component registry */
  registry?: Map<string, CustomComponentType>;
}

/**
 * Calculate scene duration in frames.
 */
function getSceneDuration(scene: Scene): number {
  return scene.endFrame - scene.startFrame;
}

/**
 * Renders a complete scene with all its layers.
 */
export function SceneRenderer({
  scene,
  frame,
  fps,
  width,
  height,
  isPlaying = true,
  registry,
}: SceneRendererProps) {
  const sceneDuration = getSceneDuration(scene) / fps;

  // Resolve scene background style
  const backgroundStyle: React.CSSProperties = {};
  if (scene.backgroundColor) {
    backgroundStyle.backgroundColor = scene.backgroundColor;
  }
  if (scene.backgroundImage) {
    backgroundStyle.backgroundImage = `url(${scene.backgroundImage})`;
    backgroundStyle.backgroundSize = scene.backgroundFit || 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundRepeat = 'no-repeat';
  }

  // Sort layers by their order in the array (first = behind, last = front)
  const sortedLayers = [...(scene.layers || [])];

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        backgroundColor: '#000000',
        ...backgroundStyle,
      }}
    >
      {sortedLayers.map((layer) => (
        <LayerRenderer
          key={layer.id}
          layer={layer}
          frame={frame}
          fps={fps}
          sceneDuration={sceneDuration}
          isPlaying={isPlaying}
          registry={registry}
        />
      ))}
    </div>
  );
}

export interface TemplateRendererProps {
  /** Template scenes */
  scenes: Scene[];
  /** Current frame number (global) */
  frame: number;
  /** Frames per second */
  fps: number;
  /** Output width */
  width: number;
  /** Output height */
  height: number;
  /** Whether the scene is playing */
  isPlaying?: boolean;
  /** Custom component registry */
  registry?: Map<string, CustomComponentType>;
}

/**
 * Renders the appropriate scene based on the current frame.
 */
export function TemplateRenderer({
  scenes,
  frame,
  fps,
  width,
  height,
  isPlaying = true,
  registry,
}: TemplateRendererProps) {
  // Find the current scene based on frame
  let currentScene: Scene | null = null;
  let localFrame = frame;

  for (const scene of scenes) {
    if (frame >= scene.startFrame && frame < scene.endFrame) {
      currentScene = scene;
      localFrame = frame - scene.startFrame;
      break;
    }
  }

  // If no scene found, try to show the last frame of the last scene
  if (!currentScene && scenes.length > 0) {
    const lastScene = scenes[scenes.length - 1];
    if (frame >= lastScene.endFrame) {
      currentScene = lastScene;
      localFrame = lastScene.endFrame - lastScene.startFrame - 1;
    }
  }

  if (!currentScene) {
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: '#000000',
        }}
      />
    );
  }

  return (
    <SceneRenderer
      scene={currentScene}
      frame={localFrame}
      fps={fps}
      width={width}
      height={height}
      isPlaying={isPlaying}
      registry={registry}
    />
  );
}

/**
 * Calculate total duration of all scenes in seconds.
 */
export function calculateTotalDuration(scenes: Scene[]): number {
  if (scenes.length === 0) return 0;
  const lastScene = scenes[scenes.length - 1];
  return lastScene.endFrame / 30; // Assume 30fps as default, caller should provide fps
}

/**
 * Calculate total frames for all scenes.
 */
export function calculateTotalFrames(scenes: Scene[], _fps: number): number {
  if (scenes.length === 0) return 0;
  const lastScene = scenes[scenes.length - 1];
  return lastScene.endFrame;
}

/**
 * Get scene at specific frame.
 */
export function getSceneAtFrame(
  scenes: Scene[],
  frame: number,
  _fps: number
): { scene: Scene; localFrame: number; sceneIndex: number } | null {
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    if (frame >= scene.startFrame && frame < scene.endFrame) {
      return {
        scene,
        localFrame: frame - scene.startFrame,
        sceneIndex: i,
      };
    }
  }

  // Return last frame of last scene if beyond duration
  if (scenes.length > 0) {
    const lastScene = scenes[scenes.length - 1];
    if (frame >= lastScene.endFrame) {
      return {
        scene: lastScene,
        localFrame: lastScene.endFrame - lastScene.startFrame - 1,
        sceneIndex: scenes.length - 1,
      };
    }
  }

  return null;
}
