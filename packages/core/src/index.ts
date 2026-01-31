// Engine
export {
  RendervidEngine,
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
