/**
 * Font weight options for custom fonts.
 */
export type CustomFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Font style options.
 */
export type CustomFontStyle = 'normal' | 'italic' | 'oblique';

/**
 * Font display strategy for loading custom fonts.
 * Controls how fonts are displayed while loading.
 */
export type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';

/**
 * Font source definition for a specific font variant.
 * Supports both URL and local font sources.
 */
export interface FontSource {
  /**
   * URL to the font file (e.g., .woff2, .woff, .ttf, .otf)
   * Can be relative or absolute URL
   */
  url?: string;

  /**
   * Local font name to check before downloading
   * Can specify multiple local names as an array
   */
  local?: string | string[];

  /**
   * Font format (e.g., 'woff2', 'woff', 'truetype', 'opentype')
   * Usually inferred from URL extension, but can be explicit
   */
  format?: 'woff2' | 'woff' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg';

  /**
   * Font weight this source applies to
   * @default 400
   */
  weight?: CustomFontWeight;

  /**
   * Font style this source applies to
   * @default 'normal'
   */
  style?: CustomFontStyle;
}

/**
 * Font family definition with all its variants and sources.
 * Defines a complete font family that can be loaded and used in templates.
 */
export interface FontFamily {
  /**
   * Font family name as it will be referenced in CSS
   * This is the name used in fontFamily properties
   * @example 'Inter', 'Roboto', 'Custom Font'
   */
  family: string;

  /**
   * List of font sources for different weights and styles
   * Each source can define a specific variant of the font
   */
  sources: FontSource[];

  /**
   * Font display strategy
   * @default 'swap'
   */
  display?: FontDisplay;

  /**
   * Fallback fonts to use while loading or if font fails
   * @example ['Arial', 'sans-serif']
   */
  fallback?: string[];

  /**
   * Whether to preload this font for better performance
   * Preloaded fonts are loaded with higher priority
   * @default false
   */
  preload?: boolean;
}

/**
 * Complete font configuration for a template.
 * Defines all custom fonts that should be loaded for rendering.
 */
export interface FontConfiguration {
  /**
   * List of font families to load
   * Each font family can have multiple variants (weights/styles)
   */
  families: FontFamily[];

  /**
   * Base path for resolving relative font URLs
   * If not specified, URLs are resolved relative to the template location
   */
  basePath?: string;
}
