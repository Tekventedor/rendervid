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

export { BlurText } from './BlurText';
export type { BlurTextProps, BlurEasing, BlurMode } from './BlurText';

export { WaveText } from './WaveText';
export type { WaveTextProps, WaveDirection } from './WaveText';

export { StaggerText } from './StaggerText';
export type { StaggerTextProps, StaggerEasing, StaggerAnimation } from './StaggerText';

export { BounceText } from './BounceText';
export type { BounceTextProps, BounceMode, BounceDirection } from './BounceText';

export { RevealText } from './RevealText';
export type { RevealTextProps, RevealEasing, RevealMode, RevealStyle, RevealDirection } from './RevealText';

export { ShinyText } from './ShinyText';
export type { ShinyTextProps, ShineDirection } from './ShinyText';

export { SplitText } from './SplitText';
export type { SplitTextProps, SplitTextEasing, SplitTextMode, SplitTextAnimation } from './SplitText';
