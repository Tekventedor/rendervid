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

// Charts
export {
  BarChart,
  LineChart,
  PieChart,
} from './charts';

// Social Media
export {
  SocialCard,
  QuoteCard,
  ProductCard,
} from './social';

// Transitions
export {
  SceneTransition,
  LowerThird,
  CallToAction,
} from './transitions';

// Effects
export {
  ThreeScene,
  ParticleSystem,
  GlitchEffect,
  SVGDrawing,
  LottieAnimation,
  TypewriterEffect,
  MetaBalls,
  BlurText,
  FuzzyText,
  SplitText,
  FlipText,
  BounceText,
  ShinyText,
  WaveText,
  StaggerText,
  RevealText,
  ScrambleText,
  NeonText,
  TextTrail,
  LetterMorph,
  MorphText,
  DistortText,
  NoiseBackground,
  NoiseDistortion,
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
  BlurTextProps,
  BlurEasing,
  BlurMode,
  FuzzyTextProps,
  FuzzyEasing,
  FuzzyMode,
  SplitTextProps,
  SplitTextEasing,
  SplitTextMode,
  SplitTextAnimation,
  FlipTextProps,
  FlipTextEasing,
  FlipTextMode,
  FlipAxis,
  FlipDirection,
  BounceTextProps,
  BounceMode,
  BounceDirection,
  ShinyTextProps,
  ShineDirection,
  WaveTextProps,
  WaveDirection,
  StaggerTextProps,
  StaggerAnimation,
  StaggerEasing,
  RevealTextProps,
  RevealMode,
  RevealStyle,
  RevealDirection,
  RevealEasing,
  ScrambleTextProps,
  ScrambleMode,
  ScrambleEasing,
  ScrambleCharset,
  NeonTextProps,
  NeonAnimationMode,
  TextTrailProps,
  TrailDirection,
  LetterMorphProps,
  MorphMode,
  LetterMorphEasing,
  MorphTextProps,
  MorphEasing,
  DistortTextProps,
  DistortionType,
  NoiseBackgroundProps,
  NoiseType,
  NoiseDistortionProps,
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

// Chart Types
export type {
  BarChartProps,
  LineChartProps,
  PieChartProps,
  PieChartData,
} from './charts';

// Social Media Types
export type {
  SocialCardProps,
  QuoteCardProps,
  ProductCardProps,
} from './social';

// Transition Types
export type {
  SceneTransitionProps,
  LowerThirdProps,
  CallToActionProps,
} from './transitions';
