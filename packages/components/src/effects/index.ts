/**
 * Effects Module
 *
 * Visual effects components for Rendervid.
 * These components add special visual effects to your videos.
 *
 * @module effects
 */

export { ParticleSystem } from './ParticleSystem';
export type {
  ParticleSystemProps,
  ParticleType,
  ParticleDirection,
  ParticleEffect,
} from './ParticleSystem';

export { ThreeScene } from './ThreeScene';
export type { ThreeSceneProps, Vector3 } from './ThreeScene';

export { GlitchEffect } from './GlitchEffect';
export type { GlitchEffectProps, GlitchType } from './GlitchEffect';

export { SVGDrawing } from './SVGDrawing';
export type { SVGDrawingProps, AnimationMode, EasingFunction } from './SVGDrawing';

// TODO: Implement additional effect components like:
// - ChromaticAberration
// - BlurEffect

export { TypewriterEffect } from './TypewriterEffect';
export type {
  TypewriterEffectProps,
  FrameAwareProps,
  TypingSpeed,
  CursorStyle,
  TypingMode,
  BackspaceConfig,
  WordDelayConfig,
} from './TypewriterEffect';
export { LottieAnimation } from './LottieAnimation';
export type { LottieAnimationProps, LottieAnimationData } from './LottieAnimation';

export { MetaBalls } from './MetaBalls';
export type { MetaBallsProps, MovementPattern } from './MetaBalls';
