import type { Composition } from './composition';
import type { InputDefinition } from './input';
import type { CustomComponentDefinition } from './component';
import type { FontConfiguration } from '../fonts/types';

/**
 * Author information for a template.
 */
export interface TemplateAuthor {
  /** Author name */
  name: string;
  /** Author website URL */
  url?: string;
  /** Author email */
  email?: string;
}

/**
 * Output configuration for the template.
 */
export interface OutputConfig {
  /**
   * Output type - video or static image
   */
  type: 'video' | 'image';

  /**
   * Canvas width in pixels
   * @example 1920
   */
  width: number;

  /**
   * Canvas height in pixels
   * @example 1080
   */
  height: number;

  /**
   * Frames per second (video only)
   * @default 30
   */
  fps?: number;

  /**
   * Duration in seconds (video only)
   * @example 10
   */
  duration?: number;

  /**
   * Background color (CSS color string)
   * @default '#000000'
   */
  backgroundColor?: string;
}

/**
 * Complete template structure.
 *
 * A template defines the structure, inputs, and composition of a video or image.
 * Templates are JSON-serializable and can be shared, stored, and used by AI agents.
 *
 * @example
 * ```typescript
 * const template: Template = {
 *   name: 'Simple Text Animation',
 *   output: {
 *     type: 'video',
 *     width: 1920,
 *     height: 1080,
 *     fps: 30,
 *     duration: 5,
 *   },
 *   inputs: [
 *     { key: 'title', type: 'string', label: 'Title', required: true },
 *   ],
 *   composition: {
 *     scenes: [{ id: 'main', startFrame: 0, endFrame: 150, layers: [] }],
 *   },
 * };
 * ```
 */
export interface Template {
  // ═══════════════════════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════════════════════

  /**
   * Unique identifier (optional, for reference only)
   */
  id?: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Description of what this template creates
   */
  description?: string;

  /**
   * Semantic version (e.g., '1.0.0')
   */
  version?: string;

  /**
   * Author information
   */
  author?: TemplateAuthor;

  /**
   * Categorization tags
   */
  tags?: string[];

  /**
   * Template thumbnail URL
   */
  thumbnail?: string;

  // ═══════════════════════════════════════════════════════════════
  // OUTPUT CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  /**
   * Output configuration (dimensions, format, etc.)
   */
  output: OutputConfig;

  // ═══════════════════════════════════════════════════════════════
  // INPUT DEFINITIONS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Define customizable inputs that users can provide
   */
  inputs: InputDefinition[];

  /**
   * Default values for inputs
   */
  defaults?: Record<string, unknown>;

  // ═══════════════════════════════════════════════════════════════
  // CUSTOM COMPONENTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Custom React components used in this template.
   * Can be references to pre-registered components, URLs, or inline code.
   */
  customComponents?: Record<string, CustomComponentDefinition>;

  // ═══════════════════════════════════════════════════════════════
  // FONT CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  /**
   * Font configuration for this template.
   *
   * Defines Google Fonts and custom fonts to be loaded for text layers.
   * Supports multiple font families with various weights and styles.
   *
   * Fonts are loaded before rendering begins to ensure text appears correctly.
   * If a font fails to load, the specified fallback fonts will be used.
   *
   * @optional This field is optional for backward compatibility.
   * Templates without font configuration will use system fonts only.
   *
   * @example
   * ```typescript
   * fonts: {
   *   google: [
   *     {
   *       family: 'Roboto',
   *       weights: [400, 700],
   *       styles: ['normal', 'italic']
   *     }
   *   ],
   *   custom: [
   *     {
   *       family: 'MyBrand',
   *       source: 'https://cdn.example.com/mybrand.woff2',
   *       weight: 700
   *     }
   *   ],
   *   fallbacks: {
   *     'Roboto': ['Arial', 'Helvetica', 'sans-serif']
   *   }
   * }
   * ```
   */
  fonts?: FontConfiguration;

  // ═══════════════════════════════════════════════════════════════
  // COMPOSITION
  // ═══════════════════════════════════════════════════════════════

  /**
   * The composition containing scenes and layers
   */
  composition: Composition;
}

/**
 * Minimal template for quick creation.
 * Missing fields will use defaults.
 */
export type PartialTemplate = Partial<Template> & Pick<Template, 'name' | 'output' | 'composition'>;
