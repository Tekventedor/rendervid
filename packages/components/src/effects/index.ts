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

export { FuzzyText } from './FuzzyText';
export type { FuzzyTextProps, FuzzyEasing, FuzzyMode } from './FuzzyText';
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

export { FlipText } from './FlipText';
export type { FlipTextProps, FlipTextEasing, FlipTextMode, FlipAxis, FlipDirection } from './FlipText';

export { ScrambleText } from './ScrambleText';
export type { ScrambleTextProps, ScrambleEasing, ScrambleMode, ScrambleCharset } from './ScrambleText';

export { TextTrail } from './TextTrail';
export type { TextTrailProps, TrailDirection } from './TextTrail';

export { NeonText } from './NeonText';
export type { NeonTextProps, NeonAnimationMode } from './NeonText';

export { DistortText } from './DistortText';
export type { DistortTextProps, DistortionType } from './DistortText';

export { MorphText } from './MorphText';
export type { MorphTextProps, MorphEasing } from './MorphText';

export { LetterMorph } from './LetterMorph';
export type { LetterMorphProps, MorphMode } from './LetterMorph';
export type { MorphEasing as LetterMorphEasing } from './LetterMorph';

export { NoiseBackground } from './NoiseBackground';
export type { NoiseBackgroundProps, NoiseType } from './NoiseBackground';

export { NoiseDistortion } from './NoiseDistortion';
export type { NoiseDistortionProps } from './NoiseDistortion';
