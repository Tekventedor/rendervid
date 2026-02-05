import type { Layer } from './layer';
import type { MotionBlurConfig } from './motion-blur';

/**
 * Scene transition types.
 */
export type TransitionType =
  | 'cut'           // Instant switch
  | 'fade'          // Crossfade
  | 'slide'         // Slide in direction
  | 'wipe'          // Wipe in direction
  | 'zoom'          // Zoom in/out
  | 'rotate'        // Rotate transition
  | 'flip'          // 3D flip effect
  | 'blur'          // Blur transition
  | 'circle'        // Circular reveal
  | 'push'          // Push transition
  | 'crosszoom'     // Cross zoom effect
  | 'glitch'        // Glitch effect
  | 'dissolve'      // Dissolve effect
  | 'cube'          // 3D cube rotation
  | 'swirl'         // Swirl/spiral effect
  | 'diagonal-wipe' // Diagonal wipe
  | 'iris';         // Iris in/out

/**
 * Transition direction.
 */
export type TransitionDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Scene transition configuration.
 */
export interface SceneTransition {
  /** Transition type */
  type: TransitionType;
  /** Duration in frames */
  duration: number;
  /** Direction (for directional transitions) */
  direction?: TransitionDirection;
  /** Easing function */
  easing?: string;
}

/**
 * Background image fit modes.
 */
export type BackgroundFit = 'cover' | 'contain' | 'fill' | 'none';

/**
 * Scene definition.
 *
 * A scene is a segment of the composition with its own layers and timing.
 *
 * @example
 * ```typescript
 * const scene: Scene = {
 *   id: 'intro',
 *   name: 'Introduction',
 *   startFrame: 0,
 *   endFrame: 150,
 *   backgroundColor: '#1a1a2e',
 *   layers: [
 *     { id: 'title', type: 'text', ... },
 *   ],
 *   transition: {
 *     type: 'fade',
 *     duration: 30,
 *   },
 * };
 * ```
 */
export interface Scene {
  /**
   * Unique scene identifier
   */
  id: string;

  /**
   * Display name
   */
  name?: string;

  /**
   * Start frame (0-based, inclusive)
   */
  startFrame: number;

  /**
   * End frame (exclusive)
   */
  endFrame: number;

  /**
   * Scene background color
   */
  backgroundColor?: string;

  /**
   * Scene background image URL
   */
  backgroundImage?: string;

  /**
   * Background image fit mode
   */
  backgroundFit?: BackgroundFit;

  /**
   * Scene background video URL
   */
  backgroundVideo?: string;

  /**
   * Transition to next scene
   */
  transition?: SceneTransition;

  /**
   * Motion blur configuration (scene-level config)
   */
  motionBlur?: MotionBlurConfig;

  /**
   * Layers in this scene
   */
  layers: Layer[];
}

/**
 * Asset type.
 */
export type AssetType = 'image' | 'video' | 'audio' | 'font' | 'lottie';

/**
 * Asset definition for preloading.
 */
export interface AssetDefinition {
  /** Unique asset ID */
  id: string;
  /** Asset type */
  type: AssetType;
  /** Asset URL */
  url: string;
  /** Optional display name */
  name?: string;
}

/**
 * Composition containing scenes and assets.
 *
 * @example
 * ```typescript
 * const composition: Composition = {
 *   scenes: [
 *     { id: 'scene1', startFrame: 0, endFrame: 100, layers: [] },
 *     { id: 'scene2', startFrame: 100, endFrame: 200, layers: [] },
 *   ],
 *   assets: [
 *     { id: 'logo', type: 'image', url: '/logo.png' },
 *   ],
 * };
 * ```
 */
export interface Composition {
  /**
   * Scenes in the composition.
   * Scenes should not overlap and should be in chronological order.
   */
  scenes: Scene[];

  /**
   * Global assets to preload before rendering.
   */
  assets?: AssetDefinition[];
}

/**
 * Calculate total duration from scenes.
 */
export function getCompositionDuration(composition: Composition): number {
  if (composition.scenes.length === 0) return 0;
  return Math.max(...composition.scenes.map((s) => s.endFrame));
}

/**
 * Get scene at a specific frame.
 */
export function getSceneAtFrame(composition: Composition, frame: number): Scene | undefined {
  return composition.scenes.find(
    (scene) => frame >= scene.startFrame && frame < scene.endFrame
  );
}

/**
 * Validate scene ordering (no overlaps, chronological).
 */
export function validateSceneOrder(scenes: Scene[]): boolean {
  for (let i = 0; i < scenes.length - 1; i++) {
    const current = scenes[i];
    const next = scenes[i + 1];
    if (current.endFrame > next.startFrame) {
      return false; // Overlap detected
    }
  }
  return true;
}
