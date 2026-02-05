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
} from './animation';

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
