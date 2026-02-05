/**
 * Motion Blur Configuration and Utilities
 *
 * Implements temporal supersampling for cinematic motion blur effect.
 * Renders multiple sub-frames at fractional time offsets per output frame,
 * then composites with weighted averaging.
 */

/**
 * Quality preset levels for motion blur
 */
export type MotionBlurQuality = 'low' | 'medium' | 'high' | 'ultra';

/**
 * Motion blur configuration
 */
export interface MotionBlurConfig {
  /** Enable/disable motion blur */
  enabled: boolean;

  /**
   * Shutter angle in degrees (0-360)
   * - 180° = cinematic standard (half frame exposure)
   * - 360° = full frame exposure (maximum blur)
   * - 90° = fast shutter (minimal blur)
   * @default 180
   */
  shutterAngle?: number;

  /**
   * Number of temporal samples per frame (2-32)
   * Higher values = smoother blur but slower rendering
   * @default 10
   */
  samples?: number;

  /**
   * Quality preset (overrides samples and shutterAngle unless explicitly set)
   * @default 'medium'
   */
  quality?: MotionBlurQuality;

  /**
   * Enable adaptive sampling (reduce samples on static frames)
   * @default false
   */
  adaptive?: boolean;

  /**
   * Minimum samples for adaptive mode (must be ≤ samples)
   * @default 3
   */
  minSamples?: number;

  /**
   * Motion detection sensitivity for adaptive sampling (0-1)
   * Lower values = more aggressive reduction
   * @default 0.01
   */
  motionThreshold?: number;

  /**
   * Enable stochastic (random) sampling to reduce banding
   * Adds random jitter to sample times for better quality
   * @default false
   */
  stochastic?: boolean;

  /**
   * Blur amount multiplier per layer (0-2)
   * 0 = no blur, 1 = normal, 2 = double blur
   * @default 1.0
   */
  blurAmount?: number;

  /**
   * Blur only on specific axis
   * @default 'both'
   */
  blurAxis?: 'x' | 'y' | 'both';

  /**
   * Variable sample rate mode
   * Auto-adjusts samples based on motion magnitude
   * @default false
   */
  variableSampleRate?: boolean;

  /**
   * Maximum samples for variable sample rate mode
   * @default samples
   */
  maxSamples?: number;

  /**
   * Preview mode - use minimal samples for fast iteration
   * @default false
   */
  preview?: boolean;
}

/**
 * Fully resolved motion blur configuration (all optional fields filled)
 */
export type ResolvedMotionBlurConfig = Required<MotionBlurConfig>;

/**
 * Quality preset definitions
 */
export const MOTION_BLUR_QUALITY_PRESETS: Record<MotionBlurQuality, Required<Pick<MotionBlurConfig, 'samples' | 'shutterAngle'>>> = {
  low: { samples: 5, shutterAngle: 180 },
  medium: { samples: 10, shutterAngle: 180 },
  high: { samples: 16, shutterAngle: 180 },
  ultra: { samples: 32, shutterAngle: 180 },
};

/**
 * Default motion blur configuration values
 */
export const DEFAULT_MOTION_BLUR_CONFIG: ResolvedMotionBlurConfig = {
  enabled: false,
  shutterAngle: 180,
  samples: 10,
  quality: 'medium',
  adaptive: false,
  minSamples: 3,
  motionThreshold: 0.01,
  stochastic: false,
  blurAmount: 1.0,
  blurAxis: 'both',
  variableSampleRate: false,
  maxSamples: 10,
  preview: false,
};

/**
 * Resolve motion blur configuration with defaults
 * Applies quality presets if specified, then fills remaining defaults
 */
export function resolveMotionBlurConfig(config?: MotionBlurConfig): ResolvedMotionBlurConfig {
  if (!config) {
    return { ...DEFAULT_MOTION_BLUR_CONFIG };
  }

  // Start with defaults
  const resolved: ResolvedMotionBlurConfig = { ...DEFAULT_MOTION_BLUR_CONFIG };

  // Apply quality preset if specified (but allow explicit overrides)
  if (config.quality) {
    const preset = MOTION_BLUR_QUALITY_PRESETS[config.quality];
    if (config.samples === undefined) {
      resolved.samples = preset.samples;
    }
    if (config.shutterAngle === undefined) {
      resolved.shutterAngle = preset.shutterAngle;
    }
    resolved.quality = config.quality;
  }

  // Apply explicit config values (overrides presets and defaults)
  Object.assign(resolved, config);

  return resolved;
}

/**
 * Validate motion blur configuration
 * @returns Array of error messages (empty if valid)
 */
export function validateMotionBlurConfig(config: MotionBlurConfig): string[] {
  const errors: string[] = [];

  // Validate shutterAngle
  if (config.shutterAngle !== undefined) {
    if (config.shutterAngle < 0 || config.shutterAngle > 360) {
      errors.push('shutterAngle must be between 0 and 360 degrees');
    }
  }

  // Validate samples
  if (config.samples !== undefined) {
    if (!Number.isInteger(config.samples)) {
      errors.push('samples must be an integer');
    } else if (config.samples < 2 || config.samples > 32) {
      errors.push('samples must be between 2 and 32');
    }
  }

  // Validate minSamples
  if (config.minSamples !== undefined) {
    if (!Number.isInteger(config.minSamples)) {
      errors.push('minSamples must be an integer');
    } else if (config.minSamples < 2) {
      errors.push('minSamples must be at least 2');
    }

    // Check minSamples <= samples (if both specified)
    if (config.samples !== undefined && config.minSamples > config.samples) {
      errors.push('minSamples must be less than or equal to samples');
    }
  }

  // Validate motionThreshold
  if (config.motionThreshold !== undefined) {
    if (config.motionThreshold < 0.0001 || config.motionThreshold > 1.0) {
      errors.push('motionThreshold must be between 0.0001 and 1.0');
    }
  }

  // Validate quality preset
  if (config.quality !== undefined) {
    const validQualities: MotionBlurQuality[] = ['low', 'medium', 'high', 'ultra'];
    if (!validQualities.includes(config.quality)) {
      errors.push(`quality must be one of: ${validQualities.join(', ')}`);
    }
  }

  // Validate blurAmount
  if (config.blurAmount !== undefined) {
    if (config.blurAmount < 0 || config.blurAmount > 2) {
      errors.push('blurAmount must be between 0 and 2');
    }
  }

  // Validate blurAxis
  if (config.blurAxis !== undefined) {
    const validAxes = ['x', 'y', 'both'];
    if (!validAxes.includes(config.blurAxis)) {
      errors.push(`blurAxis must be one of: ${validAxes.join(', ')}`);
    }
  }

  // Validate maxSamples
  if (config.maxSamples !== undefined) {
    if (!Number.isInteger(config.maxSamples)) {
      errors.push('maxSamples must be an integer');
    } else if (config.maxSamples < 2 || config.maxSamples > 32) {
      errors.push('maxSamples must be between 2 and 32');
    }

    // Check maxSamples >= samples (if both specified)
    if (config.samples !== undefined && config.maxSamples < config.samples) {
      errors.push('maxSamples must be greater than or equal to samples');
    }
  }

  return errors;
}

/**
 * Merge multiple motion blur configurations with precedence
 * Priority: layer > scene > global
 *
 * If any config has enabled: false, the result is disabled (no merge)
 * Otherwise, merge fields with more specific configs overriding general ones
 */
export function mergeMotionBlurConfigs(
  global?: MotionBlurConfig,
  scene?: MotionBlurConfig,
  layer?: MotionBlurConfig
): MotionBlurConfig | undefined {
  // Collect non-undefined configs in priority order (highest first)
  const configs = [layer, scene, global].filter((c): c is MotionBlurConfig => c !== undefined);

  if (configs.length === 0) {
    return undefined;
  }

  // If any config explicitly disables, return disabled
  const hasExplicitDisable = configs.some(c => c.enabled === false);
  if (hasExplicitDisable) {
    return { enabled: false };
  }

  // Merge configs (later configs override earlier ones)
  const merged: MotionBlurConfig = { enabled: true };

  // Apply in reverse priority order so higher priority overrides
  for (let i = configs.length - 1; i >= 0; i--) {
    const config = configs[i];
    Object.assign(merged, config);
  }

  return merged;
}
