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
  TextSpan,
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
  GifLayer,
  GifLayerProps,
  CanvasLayer,
  CanvasLayerProps,
  CaptionLayer,
  CaptionLayerProps,
  CaptionCue,
  CaptionFormat,
  CanvasDrawCommand,
  CanvasDrawCommandType,
  CanvasGradientConfig,
  CanvasGradientStop,
  CanvasGradientType,
} from './layer';

// Three.js 3D Layers
export type {
  ThreeLayer,
  ThreeLayerProps,
  ThreeCameraConfig,
  PerspectiveCameraConfig,
  OrthographicCameraConfig,
  CameraType,
  ThreeLightConfig,
  AmbientLightConfig,
  DirectionalLightConfig,
  PointLightConfig,
  SpotLightConfig,
  HemisphereLightConfig,
  LightType,
  ThreeGeometry,
  BoxGeometry,
  SphereGeometry,
  CylinderGeometry,
  ConeGeometry,
  TorusGeometry,
  PlaneGeometry,
  GLTFGeometry,
  Text3DGeometry,
  GeometryType,
  ThreeMaterialConfig,
  StandardMaterialConfig,
  BasicMaterialConfig,
  PhongMaterialConfig,
  PhysicalMaterialConfig,
  NormalMaterialConfig,
  MatCapMaterialConfig,
  MaterialType,
  TextureConfig,
  ThreeMeshConfig,
  Vector3,
  Rotation3,
  Color,
} from './three';

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

// Motion Blur
export type {
  MotionBlurConfig,
  MotionBlurQuality,
  ResolvedMotionBlurConfig,
} from './motion-blur';
export {
  MOTION_BLUR_QUALITY_PRESETS,
  DEFAULT_MOTION_BLUR_CONFIG,
  resolveMotionBlurConfig,
  validateMotionBlurConfig,
  mergeMotionBlurConfigs,
} from './motion-blur';

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

// Audio Effects
export type {
  AudioEffect,
  EQEffect,
  EQBand,
  ReverbEffect,
  CompressorEffect,
  DelayEffect,
  GainEffect,
  LowPassFilter,
  HighPassFilter,
  VolumeKeyframe,
  VolumeEnvelope,
  AudioMixerTrack,
  AudioMixerConfig,
} from './audio-effects';

// Encoding
export type {
  VideoCodec,
  ProResProfile,
  AudioCodec,
  EncodingConfig,
} from './encoding';

// Fonts
export type {
  CustomFontWeight,
  CustomFontStyle,
  FontDisplay,
  FontSource,
  FontFamily,
  FontConfiguration,
} from './fonts';

// Registry / Marketplace
export type {
  TemplateManifest,
  RegistrySearchResult,
  RegistryPackage,
} from './registry';
