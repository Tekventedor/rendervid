import React from 'react';
import type { Scene, ComponentRegistry } from '@rendervid/core';
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
  registry?: ComponentRegistry;
}

/**
 * Calculate scene duration in frames.
 */
function getSceneDuration(scene: Scene): number {
  return scene.endFrame - scene.startFrame;
}

/**
 * Convert ComponentRegistry to Map for backward compatibility with LayerRenderer.
 */
function registryToMap(registry?: ComponentRegistry): Map<string, CustomComponentType> | undefined {
  if (!registry) return undefined;

  const map = new Map<string, CustomComponentType>();
  const components = registry.list();

  for (const info of components) {
    const component = registry.get(info.name);
    if (component) {
      map.set(info.name, component as CustomComponentType);
    }
  }

  return map;
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
  // sceneDuration should be in frames, not seconds
  const sceneDuration = getSceneDuration(scene);

  // Convert registry to map for LayerRenderer
  const registryMap = React.useMemo(() => registryToMap(registry), [registry]);

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
          registry={registryMap}
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
  registry?: ComponentRegistry;
}

/**
 * Renders the appropriate scene based on the current frame with transition support.
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
  // Find the current scene and check for transitions
  let currentScene: Scene | null = null;
  let nextScene: Scene | null = null;
  let currentSceneIndex = -1;
  let localFrame = frame;
  let transitionProgress = 0;
  let transitionType: string | null = null;
  let transitionDirection: string | undefined = undefined;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    if (frame >= scene.startFrame && frame < scene.endFrame) {
      currentScene = scene;
      currentSceneIndex = i;
      localFrame = frame - scene.startFrame;

      // Check if we're in a transition period
      if (scene.transition && scene.transition.duration > 0 && i < scenes.length - 1) {
        const transitionStart = scene.endFrame - scene.transition.duration;
        if (frame >= transitionStart && frame < scene.endFrame) {
          nextScene = scenes[i + 1];
          transitionType = scene.transition.type;
          transitionDirection = scene.transition.direction;
          transitionProgress = (frame - transitionStart) / scene.transition.duration;
        }
      }
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

  // If no transition, render single scene
  if (!nextScene || !transitionType) {
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

  // Render transition between two scenes
  const nextLocalFrame = 0; // Next scene starts at frame 0

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
      }}
    >
      <TransitionRenderer
        outgoingScene={currentScene}
        incomingScene={nextScene}
        outgoingFrame={localFrame}
        incomingFrame={nextLocalFrame}
        progress={transitionProgress}
        transitionType={transitionType}
        direction={transitionDirection}
        fps={fps}
        width={width}
        height={height}
        isPlaying={isPlaying}
        registry={registry}
      />
    </div>
  );
}

interface TransitionRendererProps {
  outgoingScene: Scene;
  incomingScene: Scene;
  outgoingFrame: number;
  incomingFrame: number;
  progress: number;
  transitionType: string;
  direction?: string;
  fps: number;
  width: number;
  height: number;
  isPlaying: boolean;
  registry?: ComponentRegistry;
}

function TransitionRenderer({
  outgoingScene,
  incomingScene,
  outgoingFrame,
  incomingFrame,
  progress,
  transitionType,
  direction = 'left',
  fps,
  width,
  height,
  isPlaying,
  registry,
}: TransitionRendererProps) {
  const getTransitionStyle = (): React.CSSProperties => {
    switch (transitionType) {
      case 'fade': {
        return {
          opacity: 1 - progress,
        };
      }
      case 'slide': {
        const offset = progress * 100;
        if (direction === 'left') {
          return { transform: `translateX(-${offset}%)` };
        } else if (direction === 'right') {
          return { transform: `translateX(${offset}%)` };
        } else if (direction === 'up') {
          return { transform: `translateY(-${offset}%)` };
        } else if (direction === 'down') {
          return { transform: `translateY(${offset}%)` };
        }
        return { transform: `translateX(-${offset}%)` };
      }
      case 'zoom': {
        const scale = 1 - progress;
        return {
          transform: `scale(${scale})`,
          opacity: scale,
        };
      }
      case 'wipe': {
        const offset = progress * 100;
        if (direction === 'left') {
          return { clipPath: `inset(0 ${offset}% 0 0)` };
        } else if (direction === 'right') {
          return { clipPath: `inset(0 0 0 ${offset}%)` };
        } else if (direction === 'up') {
          return { clipPath: `inset(0 0 ${offset}% 0)` };
        } else if (direction === 'down') {
          return { clipPath: `inset(${offset}% 0 0 0)` };
        }
        return { clipPath: `inset(0 ${offset}% 0 0)` };
      }
      case 'cut':
      default:
        return progress > 0.5 ? { opacity: 0 } : {};
    }
  };

  const getIncomingStyle = (): React.CSSProperties => {
    switch (transitionType) {
      case 'fade': {
        return {
          opacity: progress,
        };
      }
      case 'slide': {
        const offset = (1 - progress) * 100;
        if (direction === 'left') {
          return { transform: `translateX(${offset}%)` };
        } else if (direction === 'right') {
          return { transform: `translateX(-${offset}%)` };
        } else if (direction === 'up') {
          return { transform: `translateY(${offset}%)` };
        } else if (direction === 'down') {
          return { transform: `translateY(-${offset}%)` };
        }
        return { transform: `translateX(${offset}%)` };
      }
      case 'zoom': {
        const scale = progress;
        return {
          transform: `scale(${scale})`,
          opacity: scale,
        };
      }
      case 'wipe': {
        return {}; // Wipe only affects outgoing scene
      }
      case 'cut':
      default:
        return progress > 0.5 ? {} : { opacity: 0 };
    }
  };

  return (
    <>
      {/* Outgoing scene */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          ...getTransitionStyle(),
        }}
      >
        <SceneRenderer
          scene={outgoingScene}
          frame={outgoingFrame}
          fps={fps}
          width={width}
          height={height}
          isPlaying={isPlaying}
          registry={registry}
        />
      </div>

      {/* Incoming scene */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          ...getIncomingStyle(),
        }}
      >
        <SceneRenderer
          scene={incomingScene}
          frame={incomingFrame}
          fps={fps}
          width={width}
          height={height}
          isPlaying={isPlaying}
          registry={registry}
        />
      </div>
    </>
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
