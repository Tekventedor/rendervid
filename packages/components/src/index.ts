// Components
export {
  Text,
  GradientText,
  Image,
  Shape,
  Container,
  Counter,
  ProgressBar,
  Typewriter,
  Fade,
  Slide,
  Scale,
  Rotate,
} from './components';

// Backgrounds
export {
  AuroraBackground,
  WaveBackground,
} from './backgrounds';

// Effects
export {
  ThreeScene,
  ParticleSystem,
  GlitchEffect,
  SVGDrawing,
  LottieAnimation,
  TypewriterEffect,
  MetaBalls,
} from './effects';
export type {
  ThreeSceneProps,
  ParticleSystemProps,
  SVGDrawingProps,
  AnimationMode,
  EasingFunction,
  LottieAnimationProps,
  LottieAnimationData,
  GlitchType,
  TypewriterEffectProps,
  MetaBallsProps,
} from './effects';

// Utilities
export {
  lerp,
  clamp,
  getProgress,
  easeIn,
  easeOut,
  easeInOut,
  easeInOutCubic,
  spring,
  frameToTime,
  timeToFrame,
} from './utils';

// Registry
export {
  ComponentRegistry,
  createDefaultRegistry,
  getDefaultRegistry,
  resetDefaultRegistry,
  defaultRegistry,
} from './registry';
export type {
  ComponentMetadata,
  RegisteredComponent,
  ListComponentsOptions,
} from './registry';

// Types
export type {
  BaseComponentProps,
  AnimatedProps,
  TextProps,
  ImageProps,
  VideoProps,
  ShapeProps,
  GradientTextProps,
  CounterProps,
  ProgressBarProps,
  TypewriterProps,
  FadeProps,
  SlideProps,
  ScaleProps,
  RotateProps,
  ContainerProps,
  AuroraBackgroundProps,
  WaveBackgroundProps,
  Vector3,
  GlitchEffectProps,
} from './types';
