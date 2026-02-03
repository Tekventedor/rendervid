/**
 * Component Defaults Manager
 *
 * Manages default values, prop schemas, and validation for custom components.
 * Handles merging defaults with provided props and auto-injecting frame-aware props.
 */

import type { JSONSchema7 } from './types/schema';

/**
 * Frame-aware props that are automatically injected by the renderer
 */
export interface FrameAwareProps {
  /** Current frame number (0 to totalFrames-1) */
  frame: number;
  /** Frames per second of the video */
  fps: number;
  /** Total number of frames in the composition */
  totalFrames: number;
  /** Size of the layer { width, height } */
  layerSize: {
    width: number;
    height: number;
  };
  /** Duration of the current scene in frames */
  sceneDuration: number;
}

/**
 * Component default values configuration
 */
export interface ComponentDefaults {
  /** Required props that must be provided */
  required?: Record<string, unknown>;
  /** Optional props with fallback values */
  optional?: Record<string, unknown>;
  /** Props that should be excluded from auto-injection */
  excludeAutoInject?: string[];
}

/**
 * Component schema with validation rules
 */
export interface ComponentSchema {
  properties?: Record<string, PropertySchema>;
  required?: string[];
  additionalProperties?: boolean;
}

/**
 * Individual property schema
 */
export interface PropertySchema {
  type: string | string[];
  description?: string;
  default?: unknown;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  enum?: unknown[];
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
}

/**
 * Component configuration including defaults and schema
 */
export interface ComponentConfig {
  name: string;
  description?: string;
  defaults?: ComponentDefaults;
  schema?: ComponentSchema | JSONSchema7;
  examples?: Record<string, unknown>;
}

/**
 * Validation error details
 */
export interface ValidationError {
  property: string;
  value: unknown;
  error: string;
  schema?: PropertySchema;
}

/**
 * Prop resolution result
 */
export interface PropResolutionResult {
  props: Record<string, unknown>;
  warnings: string[];
  errors: ValidationError[];
  isValid: boolean;
}

/**
 * ComponentDefaultsManager
 *
 * Manages default values, validation, and prop resolution for custom components.
 * Ensures components receive required frame-aware props and validated configuration.
 *
 * @example
 * ```typescript
 * const manager = new ComponentDefaultsManager();
 *
 * // Register component defaults
 * manager.register('AnimatedChart', {
 *   defaults: {
 *     optional: {
 *       animationDuration: 3,
 *       colors: ['#00f2ea', '#ff0050'],
 *       showGrid: true
 *     }
 *   },
 *   schema: {
 *     properties: {
 *       animationDuration: { type: 'number', minimum: 0.1, maximum: 10 },
 *       colors: { type: 'array', items: { type: 'string' } }
 *     }
 *   }
 * });
 *
 * // Resolve component props
 * const resolved = manager.resolveProps('AnimatedChart', {
 *   colors: ['#ff0000']  // Override defaults
 * }, frameData);
 * ```
 */
export class ComponentDefaultsManager {
  private registry: Map<string, ComponentConfig> = new Map();
  private readonly defaultFrameAwareDefaults: ComponentDefaults = {
    optional: {
      animationDuration: 3,
      easing: 'easeOutCubic',
      delayFrames: 0,
      opacity: 1,
    },
    excludeAutoInject: [],
  };

  /**
   * Register a component configuration with defaults and schema
   */
  register(name: string, config: ComponentConfig): void {
    this.registry.set(name, {
      ...config,
      defaults: {
        ...this.defaultFrameAwareDefaults,
        ...config.defaults,
      },
    });
  }

  /**
   * Unregister a component
   */
  unregister(name: string): boolean {
    return this.registry.delete(name);
  }

  /**
   * Get component configuration
   */
  getConfig(name: string): ComponentConfig | undefined {
    return this.registry.get(name);
  }

  /**
   * Get default values for a component
   */
  getDefaults(name: string): ComponentDefaults {
    const config = this.registry.get(name);
    if (!config) {
      return this.defaultFrameAwareDefaults;
    }
    return config.defaults || this.defaultFrameAwareDefaults;
  }

  /**
   * Get schema for a component
   */
  getSchema(name: string): ComponentSchema | JSONSchema7 | undefined {
    return this.registry.get(name)?.schema;
  }

  /**
   * Resolve component props with defaults and frame-aware props
   *
   * @param componentName - Name of the component
   * @param layerProps - Props provided in the template layer
   * @param frameData - Frame-aware data from renderer
   * @returns Resolved props with defaults applied and validation results
   */
  resolveProps(
    componentName: string,
    layerProps: Record<string, unknown> = {},
    frameData: FrameAwareProps
  ): PropResolutionResult {
    const config = this.registry.get(componentName);
    const defaults = config?.defaults || this.defaultFrameAwareDefaults;
    const schema = config?.schema;

    const resolved: Record<string, unknown> = {};
    const warnings: string[] = [];
    const errors: ValidationError[] = [];

    // 1. Apply default values
    if (defaults.optional) {
      Object.assign(resolved, defaults.optional);
    }

    if (defaults.required) {
      Object.assign(resolved, defaults.required);
    }

    // 2. Override with layer-provided props
    Object.assign(resolved, layerProps);

    // 3. Auto-inject frame-aware props (unless excluded)
    const excludeList = defaults.excludeAutoInject || [];
    const frameAwareKeys = Object.keys(frameData) as Array<keyof FrameAwareProps>;

    for (const key of frameAwareKeys) {
      if (!excludeList.includes(key)) {
        resolved[key] = frameData[key];
      }
    }

    // 4. Validate against schema if provided
    if (schema) {
      const validationResult = this.validateProps(resolved, schema);
      errors.push(...validationResult.errors);
      warnings.push(...validationResult.warnings);
    }

    // 5. Check for required props
    if (defaults.required) {
      for (const requiredProp of Object.keys(defaults.required)) {
        if (!(requiredProp in resolved)) {
          errors.push({
            property: requiredProp,
            value: undefined,
            error: `Required prop "${requiredProp}" is missing`,
          });
        }
      }
    }

    return {
      props: resolved,
      warnings,
      errors,
      isValid: errors.length === 0,
    };
  }

  /**
   * Validate props against schema
   */
  private validateProps(
    props: Record<string, unknown>,
    schema: ComponentSchema | JSONSchema7
  ): {
    errors: ValidationError[];
    warnings: string[];
  } {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Handle JSONSchema7 format
    const properties = (schema as any).properties || {};
    const required = (schema as any).required || [];

    // Validate each property
    for (const [propName, propValue] of Object.entries(props)) {
      const propSchema = properties[propName];

      if (!propSchema) {
        if (!(schema as any).additionalProperties) {
          warnings.push(
            `Property "${propName}" is not defined in schema and additionalProperties is false`
          );
        }
        continue;
      }

      // Type validation
      const typeError = this.validateType(propValue, propSchema);
      if (typeError) {
        errors.push({
          property: propName,
          value: propValue,
          error: typeError,
          schema: propSchema,
        });
      }

      // Range validation for numbers
      if (typeof propValue === 'number') {
        if (
          propSchema.minimum !== undefined &&
          propValue < propSchema.minimum
        ) {
          errors.push({
            property: propName,
            value: propValue,
            error: `Value ${propValue} is less than minimum ${propSchema.minimum}`,
            schema: propSchema,
          });
        }
        if (
          propSchema.maximum !== undefined &&
          propValue > propSchema.maximum
        ) {
          errors.push({
            property: propName,
            value: propValue,
            error: `Value ${propValue} is greater than maximum ${propSchema.maximum}`,
            schema: propSchema,
          });
        }
      }

      // String length validation
      if (typeof propValue === 'string') {
        if (
          propSchema.minLength !== undefined &&
          propValue.length < propSchema.minLength
        ) {
          errors.push({
            property: propName,
            value: propValue,
            error: `String length ${propValue.length} is less than minimum ${propSchema.minLength}`,
            schema: propSchema,
          });
        }
        if (
          propSchema.maxLength !== undefined &&
          propValue.length > propSchema.maxLength
        ) {
          errors.push({
            property: propName,
            value: propValue,
            error: `String length ${propValue.length} is greater than maximum ${propSchema.maxLength}`,
            schema: propSchema,
          });
        }
      }

      // Enum validation
      if (propSchema.enum && !propSchema.enum.includes(propValue)) {
        errors.push({
          property: propName,
          value: propValue,
          error: `Value must be one of: ${propSchema.enum.join(', ')}`,
          schema: propSchema,
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate type of a value against schema type
   */
  private validateType(value: unknown, schema: PropertySchema): string | null {
    const schemaType = schema.type;
    const actualType = this.getActualType(value);

    if (!schemaType) {
      return null; // No type specified, skip validation
    }

    const allowedTypes = Array.isArray(schemaType)
      ? schemaType
      : [schemaType];

    if (!allowedTypes.includes(actualType)) {
      return `Expected type ${allowedTypes.join(' or ')}, got ${actualType}`;
    }

    return null;
  }

  /**
   * Get actual type of a value
   */
  private getActualType(value: unknown): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Object) return 'object';
    return typeof value;
  }

  /**
   * Merge multiple prop sets with proper precedence
   *
   * Precedence: layerProps > defaults.required > defaults.optional > frameAwareDefaults
   */
  mergeProps(
    componentName: string,
    ...propSets: Array<Record<string, unknown>>
  ): Record<string, unknown> {
    const config = this.registry.get(componentName);
    const defaults = config?.defaults || this.defaultFrameAwareDefaults;

    const merged: Record<string, unknown> = {};

    // Start with default optional values
    if (defaults.optional) {
      Object.assign(merged, defaults.optional);
    }

    // Add default required values
    if (defaults.required) {
      Object.assign(merged, defaults.required);
    }

    // Apply provided prop sets in order
    for (const props of propSets) {
      Object.assign(merged, props);
    }

    return merged;
  }

  /**
   * List all registered components
   */
  listComponents(): Array<{
    name: string;
    description?: string;
    hasDefaults: boolean;
    hasSchema: boolean;
  }> {
    const components: Array<{
      name: string;
      description?: string;
      hasDefaults: boolean;
      hasSchema: boolean;
    }> = [];

    for (const [name, config] of this.registry.entries()) {
      components.push({
        name,
        description: config.description,
        hasDefaults: !!config.defaults,
        hasSchema: !!config.schema,
      });
    }

    return components;
  }
}

/**
 * Create a default instance with common component configurations
 */
export function createDefaultComponentDefaultsManager(): ComponentDefaultsManager {
  const manager = new ComponentDefaultsManager();

  // Register AnimatedLineChart defaults
  manager.register('AnimatedLineChart', {
    name: 'AnimatedLineChart',
    description: 'Animated line chart for stock prices with gradient and glow effects',
    defaults: {
      optional: {
        animationDuration: 3,
        easing: 'easeOutCubic',
        showGrid: true,
        showLabels: true,
        colors: ['#00f2ea', '#ff0050'],
      },
    },
    schema: {
      properties: {
        animationDuration: {
          type: 'number',
          description: 'Duration of the animation in seconds',
          minimum: 0.1,
          maximum: 10,
          default: 3,
        },
        easing: {
          type: 'string',
          description: 'Animation easing function',
          enum: ['linear', 'easeInQuad', 'easeOutQuad', 'easeOutCubic'],
          default: 'easeOutCubic',
        },
        showGrid: {
          type: 'boolean',
          description: 'Show grid lines in the chart',
          default: true,
        },
        showLabels: {
          type: 'boolean',
          description: 'Show axis labels',
          default: true,
        },
        colors: {
          type: 'array',
          description: 'Gradient colors as hex strings',
          items: { type: 'string' },
        },
        frame: {
          type: 'number',
          description: 'Current animation frame (auto-injected)',
        },
        fps: {
          type: 'number',
          description: 'Frames per second (auto-injected)',
        },
        layerSize: {
          type: 'object',
          description: 'Layer dimensions (auto-injected)',
        },
      },
    },
  });

  // Register AuroraBackground defaults
  manager.register('AuroraBackground', {
    name: 'AuroraBackground',
    description: 'Flowing gradient aurora/northern lights effect',
    defaults: {
      optional: {
        colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'],
        speed: 0.8,
        blur: 40,
        opacity: 0.6,
        width: '100%',
        height: '100%',
      },
    },
    schema: {
      properties: {
        colors: {
          type: 'array',
          description: 'Aurora colors as hex strings',
          items: { type: 'string' },
        },
        speed: {
          type: 'number',
          minimum: 0.1,
          maximum: 2,
          default: 0.8,
          description: 'Animation speed multiplier',
        },
        blur: {
          type: 'number',
          minimum: 10,
          maximum: 80,
          default: 40,
          description: 'Blur amount in pixels',
        },
        opacity: {
          type: 'number',
          minimum: 0.1,
          maximum: 1,
          default: 0.6,
          description: 'Background opacity',
        },
      },
    },
  });

  // Register WaveBackground defaults
  manager.register('WaveBackground', {
    name: 'WaveBackground',
    description: 'Animated fluid wave background',
    defaults: {
      optional: {
        colors: ['#0ea5e9', '#06b6d4', '#14b8a6'],
        speed: 0.5,
        waveCount: 3,
        amplitude: 50,
        frequency: 0.02,
        opacity: 1,
        width: '100%',
        height: '100%',
      },
    },
    schema: {
      properties: {
        colors: {
          type: 'array',
          description: 'Wave colors as hex strings',
          items: { type: 'string' },
        },
        speed: {
          type: 'number',
          minimum: 0.1,
          maximum: 2,
          default: 0.5,
        },
        waveCount: {
          type: 'number',
          minimum: 1,
          maximum: 10,
          default: 3,
        },
        amplitude: {
          type: 'number',
          minimum: 10,
          maximum: 100,
          default: 50,
        },
      },
    },
  });

  return manager;
}
