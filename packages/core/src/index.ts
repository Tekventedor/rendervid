// Engine
export {
  RendervidEngine,
  getDefaultRegistry,
  type EngineOptions,
  type EngineCapabilities,
  type ElementCapability,
  type RenderVideoOptions,
  type RenderImageOptions,
  type VideoResult,
  type ImageResult,
  type RenderProgress,
} from './engine';

// Types
export * from './types';

// Template Processing
export { TemplateProcessor } from './template/TemplateProcessor';

// Component Defaults Manager
export {
  ComponentDefaultsManager,
  createDefaultComponentDefaultsManager,
  type FrameAwareProps,
  type ComponentDefaults,
  type ComponentSchema,
  type PropertySchema,
  type ComponentConfig,
  type ValidationError as ComponentValidationError,
  type PropResolutionResult,
} from './component-defaults';

// Component Defaults Integration
export {
  ComponentPropsResolver,
  type ResolvedCustomLayer,
} from './component-defaults-integration';

// Validation
export {
  validateTemplate,
  validateInputs,
  getTemplateSchema,
  getLayerSchema,
  templateSchema,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
} from './validation';

// Animation
export {
  // Easings
  getEasing,
  getAllEasingNames,
  parseEasing,
  createCubicBezier,
  createSpring,
  // Interpolation
  interpolate,
  getValueAtFrame,
  getPropertiesAtFrame,
  compileAnimation,
  // Presets
  getPreset,
  getAllPresetNames,
  getPresetsByType,
  generatePresetKeyframes,
  type PresetDefinition,
  type PresetOptions,
  // Color interpolation
  interpolateColors,
  parseColor,
  colorToString,
} from './animation';

// Random
export {
  random,
  randomRange,
  randomInt,
  createRandom,
} from './utils/random';

// Noise
export {
  noise2D,
  noise3D,
  perlin2D,
  perlin3D,
  worley2D,
  worley3D,
  valueNoise2D,
  valueNoise3D,
} from './utils/noise';

// Noise Helpers
export {
  fbm,
  turbulence,
  ridgedNoise,
  domainWarp,
  animatedNoise,
  type NoiseFn2D,
  type FractalNoiseOptions,
} from './utils/noise-helpers';

// GIF Utilities
export {
  getGifFrameAtTime,
  type GifFrame,
  type GifMetadata,
} from './utils/gif';

// GIF Optimizer
export {
  estimateGifFileSize,
  calculateOptimalColors,
  getGifOptimizationPreset,
  type GifOptimizationPreset,
} from './utils/gif-optimizer';

// SVG Export
export {
  exportAnimatedSvg,
  type SvgExportResult,
  type UnsupportedLayerInfo,
} from './export/svg-exporter';

// Text Utilities
export {
  measureText,
  fitText,
  type TextMeasurement,
  type MeasureTextOptions,
  type FitTextOptions,
  type FitTextResult,
} from './utils/text';

// Audio Visualization
export {
  getAudioData,
  visualizeAudio,
  visualizeAudioWaveform,
  getWaveformPortion,
  getAudioDuration,
  createSmoothSvgPath,
  type AudioData,
  type VisualizeAudioOptions,
  type VisualizeWaveformOptions,
  type WaveformPortionOptions,
} from './utils/audio';

// SVG Path Utilities
export {
  evolvePath,
  getLength,
  getPointAtLength,
  getTangentAtLength,
  getBoundingBox,
  scalePath,
  translatePath,
  resetPath,
  reversePath,
  interpolatePath,
  getSubpaths,
  normalizePath,
} from './utils/paths';

// Fonts
export type {
  FontWeight,
  NumericFontWeight,
  NamedFontWeight,
  FontStyle,
  FontCategory,
  FontLoadingStrategy,
  FontDisplay,
  FontFormat,
  GoogleFontDefinition,
  CustomFontDefinition,
  FontMetadata,
  LicenseInfo,
  FontConfiguration,
  FontFallback,
  FontMetrics,
  FontLoadingState,
  FontLoadResult,
  FontReference,
  LoadedFonts,
  FontValidationResult,
  FontUploadOptions,
  SystemFont,
  FontCacheEntry,
  WeightToNumeric,
} from './fonts';
export {
  isNumericWeight,
  isNamedWeight,
  weightToNumeric,
  numericToNamedWeight,
  FONT_CONSTANTS,
  FontLoadingError,
  FontManager,
  // Font catalog
  getFontCatalog,
  getFontsByCategory,
  getFontMetadata,
  getPopularFonts,
  getVariableFonts,
  searchFonts,
  getFontsByWeight,
  getFontsWithItalic,
  getCatalogStats,
  isFontAvailable,
  getRandomFonts,
} from './fonts';
