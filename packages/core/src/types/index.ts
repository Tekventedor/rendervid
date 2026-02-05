// Template
export type {
  Template,
  PartialTemplate,
  TemplateAuthor,
  OutputConfig,
} from './template';

// Composition
export type {
  Composition,
  Scene,
  SceneTransition,
  TransitionType,
  TransitionDirection,
  BackgroundFit,
  AssetDefinition,
  AssetType,
} from './composition';
export {
  getCompositionDuration,
  getSceneAtFrame,
  validateSceneOrder,
} from './composition';

// Layers
export type {
  Layer,
  LayerBase,
  LayerType,
  LayerProps,
  Position,
  Size,
  Scale,
  Anchor,
  Shadow,
  BlendMode,
  // Specific layers
  ImageLayer,
  ImageLayerProps,
  ImageFit,
  VideoLayer,
  VideoLayerProps,
  VideoFit,
  TextLayer,
  TextLayerProps,
  TextAlign,
  VerticalAlign,
  FontWeight,
  TextStroke,
  TextShadow,
  Padding,
  ShapeLayer,
  ShapeLayerProps,
  ShapeType,
  Gradient,
  GradientStop,
  AudioLayer,
  AudioLayerProps,
  GroupLayer,
  GroupLayerProps,
  LottieLayer,
  LottieLayerProps,
  CustomLayer,
  CustomLayerProps,
  CustomComponentRef,
} from './layer';

// Animation
export type {
  Animation,
  AnimationType,
  AnimationPreset,
  EntranceAnimation,
  ExitAnimation,
  EmphasisAnimation,
  Keyframe,
  AnimatableProperties,
  Easing,
  EasingName,
  EasingFunction,
  CompiledAnimation,
} from './animation';

// Style
export type {
  LayerStyle,
  ResolvedStyle,
  ShadowPreset,
  BlurPreset,
  BackgroundGradient,
} from './style';

// Filter
export type {
  Filter,
  FilterType,
  FilterAnimation,
} from './filter';
export { filterToCSS, filtersToCSS } from './filter';

// Input
export type {
  InputDefinition,
  InputType,
  InputValidation,
  InputUI,
  EnumOption,
} from './input';

// Component
export type {
  ComponentRegistry,
  ComponentInfo,
  CustomComponentDefinition,
  ComponentSourceType,
  ComponentType,
} from './component';

// Schema
export type { JSONSchema7, JSONSchema7TypeName } from './schema';

// Fonts
export type {
  CustomFontWeight,
  CustomFontStyle,
  FontDisplay,
  FontSource,
  FontFamily,
  FontConfiguration,
} from './fonts';
