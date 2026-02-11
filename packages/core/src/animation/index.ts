// Easings
export {
  easingMap,
  getEasing,
  getAllEasingNames,
  parseEasing,
  parseCubicBezier,
  parseSpring,
  createCubicBezier,
  createSpring,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
} from './easings';

// Interpolation
export {
  interpolate,
  getValueAtFrame,
  getPropertiesAtFrame,
  compileAnimation,
  mergeProperties,
  applyAnimatedProperties,
} from './interpolation';

// Presets
export type { PresetDefinition, PresetOptions } from './presets';
export {
  presets,
  getPreset,
  getAllPresetNames,
  getPresetsByType,
  generatePresetKeyframes,
} from './presets';

// Color interpolation
export {
  interpolateColors,
  parseColor,
  colorToString,
} from './color';
