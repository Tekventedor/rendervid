/**
 * Font type definitions for Rendervid
 *
 * Comprehensive type system for font loading, configuration, and management
 * supporting Google Fonts, custom font uploads, and system fonts.
 */

/**
 * Numeric font weights from 100 (Thin) to 900 (Black)
 */
export type NumericFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Named font weight aliases for common weights
 */
export type NamedFontWeight =
  | 'thin'       // 100
  | 'extralight' // 200
  | 'light'      // 300
  | 'normal'     // 400
  | 'medium'     // 500
  | 'semibold'   // 600
  | 'bold'       // 700
  | 'extrabold'  // 800
  | 'black';     // 900

/**
 * Font weight - supports both numeric values (100-900) and named weights
 */
export type FontWeight = NumericFontWeight | NamedFontWeight;

/**
 * Font style - normal or italic
 */
export type FontStyle = 'normal' | 'italic';

/**
 * Font category classification
 */
export type FontCategory =
  | 'sans-serif'   // Modern, clean fonts without serifs
  | 'serif'        // Traditional fonts with serifs
  | 'monospace'    // Fixed-width fonts for code
  | 'display'      // Decorative fonts for headlines
  | 'handwriting'; // Script and handwritten style fonts

/**
 * Font loading strategy
 * - eager: Load font immediately when template is parsed
 * - lazy: Load font only when it's about to be rendered
 * - preload: Load font in parallel with other resources using browser preload
 */
export type FontLoadingStrategy = 'eager' | 'lazy' | 'preload';

/**
 * Font display strategy for controlling FOIT (Flash of Invisible Text)
 * and FOUT (Flash of Unstyled Text)
 *
 * - swap: Show fallback immediately, swap when font loads (recommended)
 * - block: Hide text briefly, then show with font (can cause FOIT)
 * - fallback: Show fallback if font takes too long
 * - optional: Use font if cached, otherwise use fallback
 * - auto: Browser decides (usually behaves like 'block')
 */
export type FontDisplay = 'swap' | 'block' | 'fallback' | 'optional' | 'auto';

/**
 * Font format for web fonts
 */
export type FontFormat = 'woff2' | 'woff' | 'ttf' | 'otf' | 'eot';

/**
 * Google Font definition for loading fonts from Google Fonts API
 */
export interface GoogleFontDefinition {
  /**
   * Font family name as it appears on Google Fonts
   * @example "Roboto", "Open Sans", "Playfair Display"
   */
  family: string;

  /**
   * Font weights to load (numeric values 100-900)
   * If not specified, defaults to [400] (normal weight)
   * @example [400, 700] // Load normal and bold
   */
  weights?: NumericFontWeight[];

  /**
   * Font styles to load
   * If not specified, defaults to ['normal']
   * @example ['normal', 'italic']
   */
  styles?: FontStyle[];

  /**
   * Character subsets to include
   * Common options: 'latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'
   * If not specified, defaults to ['latin']
   * @example ['latin', 'latin-ext']
   */
  subsets?: string[];

  /**
   * Font display strategy
   * Controls how the font behaves while loading
   * @default 'swap'
   */
  display?: FontDisplay;

  /**
   * Optional text parameter for font subsetting
   * When provided, Google Fonts will return a subset containing only these characters
   * Significantly reduces file size for specific use cases
   * @example "Hello World" // Only load glyphs for these characters
   */
  text?: string;

  /**
   * Whether this is a variable font
   * Variable fonts support a range of weights/styles in a single file
   */
  variable?: boolean;
}

/**
 * Custom font definition for uploaded or externally hosted fonts
 */
export interface CustomFontDefinition {
  /**
   * Font family name to use in CSS
   * @example "MyBrandFont", "CustomSerif"
   */
  family: string;

  /**
   * URL or upload ID for the font file
   * Can be:
   * - Full URL: "https://cdn.example.com/fonts/mybrand.woff2"
   * - Upload ID: "upload_abc123" (resolved by font manager)
   * - Data URI: "data:font/woff2;base64,..."
   */
  source: string;

  /**
   * Font weight this file represents
   * @default 400
   */
  weight?: NumericFontWeight;

  /**
   * Font style this file represents
   * @default 'normal'
   */
  style?: FontStyle;

  /**
   * Font file format
   * Used to generate proper @font-face src with format() hint
   * @default 'woff2'
   */
  format?: FontFormat;

  /**
   * Font display strategy
   * @default 'swap'
   */
  display?: FontDisplay;

  /**
   * Unicode range this font covers
   * Allows browsers to only download fonts for the characters actually used
   * @example "U+0000-00FF, U+0131, U+0152-0153"
   */
  unicodeRange?: string;

  /**
   * Optional descriptors for font-face rule
   * Can include font-stretch, font-feature-settings, etc.
   */
  descriptors?: Record<string, string>;
}

/**
 * License information for fonts
 */
export interface LicenseInfo {
  /**
   * License type
   */
  type: 'OFL' | 'Apache' | 'MIT' | 'proprietary' | 'custom';

  /**
   * URL to full license text
   */
  url: string;

  /**
   * Whether commercial use is allowed
   */
  allowsCommercial: boolean;

  /**
   * Whether attribution is required
   */
  requiresAttribution: boolean;

  /**
   * Any specific restrictions or requirements
   * @example ["Cannot sell fonts standalone", "Must include copyright notice"]
   */
  restrictions?: string[];
}

/**
 * Font metadata catalog entry
 *
 * Contains comprehensive information about a font for discovery,
 * preview, and proper loading configuration.
 */
export interface FontMetadata {
  /**
   * Font family name
   */
  family: string;

  /**
   * Font category classification
   */
  category: FontCategory;

  /**
   * Available font weights
   * @example [100, 300, 400, 700, 900]
   */
  variants: NumericFontWeight[];

  /**
   * Available font styles
   * @example ['normal', 'italic']
   */
  styles: FontStyle[];

  /**
   * Available character subsets
   * @example ['latin', 'latin-ext', 'cyrillic', 'greek']
   */
  subsets: string[];

  /**
   * Preview text to demonstrate the font
   * @example "The quick brown fox jumps over the lazy dog"
   */
  preview: string;

  /**
   * Google Fonts API URL if this is a Google Font
   * @example "https://fonts.google.com/specimen/Roboto"
   */
  googleFontsUrl?: string;

  /**
   * Whether this is a variable font
   * Variable fonts support continuous weight/width variations
   */
  variable?: boolean;

  /**
   * License information
   */
  license: LicenseInfo;

  /**
   * Popularity rank (lower is more popular)
   * Based on Google Fonts usage statistics
   * @example 1 (most popular), 100, 500
   */
  popularity?: number;

  /**
   * Human-readable description of the font
   * @example "Roboto is a neo-grotesque sans-serif typeface designed by Google"
   */
  description?: string;

  /**
   * Designer/creator of the font
   * @example "Christian Robertson"
   */
  designer?: string;

  /**
   * Year the font was released
   * @example 2011
   */
  releaseYear?: number;

  /**
   * Tags for categorization and search
   * @example ["modern", "geometric", "clean", "professional"]
   */
  tags?: string[];
}

/**
 * Font fallback configuration
 *
 * Defines fallback fonts to use while the primary font is loading
 * or if it fails to load.
 */
export interface FontFallback {
  /**
   * Primary font family name
   */
  primary: string;

  /**
   * Fallback font stack
   * Listed in priority order
   * @example ["Arial", "Helvetica", "sans-serif"]
   */
  fallbacks: string[];

  /**
   * Whether to use metric-matched fallbacks
   * When true, attempts to find system fonts with similar metrics
   * to reduce layout shift when font loads
   */
  metricMatched?: boolean;

  /**
   * Precomputed font metrics for fallback matching
   * Used to calculate size-adjust, ascent-override, etc.
   */
  metrics?: FontMetrics;
}

/**
 * Font metrics for fallback matching
 *
 * These metrics help create metric-matched fallbacks that reduce
 * layout shift when the primary font loads.
 */
export interface FontMetrics {
  /**
   * Font family name
   */
  familyName: string;

  /**
   * Units per em (typically 1000 or 2048)
   */
  unitsPerEm: number;

  /**
   * Ascender height (above baseline)
   */
  ascent: number;

  /**
   * Descender depth (below baseline)
   */
  descent: number;

  /**
   * Line gap (space between lines)
   */
  lineGap: number;

  /**
   * Cap height (height of capital letters)
   */
  capHeight: number;

  /**
   * x-height (height of lowercase x)
   */
  xHeight: number;

  /**
   * Average character width
   */
  avgWidth?: number;
}

/**
 * Template-level font configuration
 *
 * Defines all fonts used in a template and how they should be loaded.
 */
export interface FontConfiguration {
  /**
   * Google Fonts to load
   * @example [{ family: "Roboto", weights: [400, 700] }]
   */
  google?: GoogleFontDefinition[];

  /**
   * Custom fonts to load
   * @example [{ family: "MyBrand", source: "https://cdn.example.com/mybrand.woff2" }]
   */
  custom?: CustomFontDefinition[];

  /**
   * Font loading strategy
   * Controls when and how fonts are loaded
   * @default 'eager'
   */
  strategy?: FontLoadingStrategy;

  /**
   * Fallback font configurations
   * Maps primary font families to their fallback stacks
   * @example { "Roboto": ["Arial", "Helvetica", "sans-serif"] }
   */
  fallbacks?: Record<string, string[]>;

  /**
   * Timeout for font loading in milliseconds
   * If a font doesn't load within this time, fallback is used
   * @default 10000 (10 seconds)
   */
  timeout?: number;

  /**
   * Whether to preload fonts in parallel with other resources
   * Uses <link rel="preload"> for better performance
   * @default true
   */
  preload?: boolean;

  /**
   * Whether to subset fonts based on template text content
   * Reduces file size by only including used characters
   * @default false
   */
  subset?: boolean;
}

/**
 * Font loading state
 */
export type FontLoadingState =
  | 'unloaded'   // Font has not been requested yet
  | 'loading'    // Font is currently being loaded
  | 'loaded'     // Font loaded successfully
  | 'error'      // Font failed to load
  | 'timeout';   // Font loading timed out

/**
 * Font loading result
 */
export interface FontLoadResult {
  /**
   * Font family that was loaded
   */
  family: string;

  /**
   * Weight that was loaded
   */
  weight: NumericFontWeight;

  /**
   * Style that was loaded
   */
  style: FontStyle;

  /**
   * Loading state
   */
  state: FontLoadingState;

  /**
   * Error message if loading failed
   */
  error?: string;

  /**
   * Time taken to load in milliseconds
   */
  loadTime?: number;

  /**
   * Font file size in bytes
   */
  fileSize?: number;

  /**
   * Whether this font was served from cache
   */
  cached?: boolean;
}

/**
 * Font validation result
 */
export interface FontValidationResult {
  /**
   * Whether the font is valid
   */
  valid: boolean;

  /**
   * Validation errors
   */
  errors: string[];

  /**
   * Validation warnings
   */
  warnings: string[];

  /**
   * Extracted font metadata
   */
  metadata?: Partial<FontMetadata>;
}

/**
 * Options for font upload
 */
export interface FontUploadOptions {
  /**
   * Custom family name override
   * If not provided, uses the font's internal family name
   */
  family?: string;

  /**
   * Whether to convert to WOFF2 format
   * @default true
   */
  convertToWoff2?: boolean;

  /**
   * Whether to validate the font file
   * @default true
   */
  validate?: boolean;

  /**
   * Maximum file size in bytes
   * @default 4194304 (4MB)
   */
  maxSize?: number;

  /**
   * Whether to parse and extract metadata
   * @default true
   */
  extractMetadata?: boolean;
}

/**
 * System font information
 *
 * Represents fonts available on the system without needing to load
 */
export interface SystemFont {
  /**
   * Font family name
   */
  family: string;

  /**
   * Available styles on the system
   */
  styles: FontStyle[];

  /**
   * Available weights on the system
   */
  weights: NumericFontWeight[];

  /**
   * Font category
   */
  category?: FontCategory;

  /**
   * Whether this is a web-safe font
   * Web-safe fonts are available on most systems
   */
  webSafe?: boolean;
}

/**
 * Font cache entry
 */
export interface FontCacheEntry {
  /**
   * Cache key
   */
  key: string;

  /**
   * Font family
   */
  family: string;

  /**
   * Font data (ArrayBuffer or URL)
   */
  data: ArrayBuffer | string;

  /**
   * When this entry was cached
   */
  cachedAt: number;

  /**
   * When this entry expires
   */
  expiresAt: number;

  /**
   * Cache entry size in bytes
   */
  size: number;

  /**
   * Font metadata
   */
  metadata?: Partial<FontMetadata>;
}

/**
 * Helper type for converting named weights to numeric weights
 */
export type WeightToNumeric<T extends FontWeight> =
  T extends 'thin' ? 100 :
  T extends 'extralight' ? 200 :
  T extends 'light' ? 300 :
  T extends 'normal' ? 400 :
  T extends 'medium' ? 500 :
  T extends 'semibold' ? 600 :
  T extends 'bold' ? 700 :
  T extends 'extrabold' ? 800 :
  T extends 'black' ? 900 :
  T extends NumericFontWeight ? T :
  never;

/**
 * Type guard to check if a weight is numeric
 */
export function isNumericWeight(weight: FontWeight): weight is NumericFontWeight {
  return typeof weight === 'number';
}

/**
 * Type guard to check if a weight is named
 */
export function isNamedWeight(weight: FontWeight): weight is NamedFontWeight {
  return typeof weight === 'string';
}

/**
 * Convert named weight to numeric weight
 */
export function weightToNumeric(weight: FontWeight): NumericFontWeight {
  if (isNumericWeight(weight)) {
    return weight;
  }

  const weightMap: Record<NamedFontWeight, NumericFontWeight> = {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  };

  return weightMap[weight];
}

/**
 * Convert numeric weight to named weight
 */
export function numericToNamedWeight(weight: NumericFontWeight): NamedFontWeight {
  const weightMap: Record<NumericFontWeight, NamedFontWeight> = {
    100: 'thin',
    200: 'extralight',
    300: 'light',
    400: 'normal',
    500: 'medium',
    600: 'semibold',
    700: 'bold',
    800: 'extrabold',
    900: 'black',
  };

  return weightMap[weight];
}

/**
 * Font reference for identifying a specific font variant
 * Used to track which fonts are used in templates
 */
export interface FontReference {
  /**
   * Font family name
   */
  family: string;

  /**
   * Font weight
   */
  weight?: NumericFontWeight;

  /**
   * Font style
   */
  style?: FontStyle;
}

/**
 * Result of loading fonts
 */
export interface LoadedFonts {
  /**
   * Successfully loaded font references
   */
  loaded: FontReference[];

  /**
   * Failed font references
   */
  failed: FontReference[];

  /**
   * Total time taken to load fonts in milliseconds
   */
  loadTime: number;
}

/**
 * Font loading error class
 */
export class FontLoadingError extends Error {
  /**
   * Font family that failed to load
   */
  readonly family: string;

  /**
   * Original error that caused the failure
   */
  readonly cause?: Error;

  constructor(message: string, family: string, cause?: Error) {
    super(message);
    this.name = 'FontLoadingError';
    this.family = family;
    this.cause = cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FontLoadingError);
    }
  }
}

/**
 * Constants for common font configurations
 */
export const FONT_CONSTANTS = {
  /**
   * Default font weights to load if none specified
   */
  DEFAULT_WEIGHTS: [400, 700] as const,

  /**
   * Default font styles to load if none specified
   */
  DEFAULT_STYLES: ['normal'] as const,

  /**
   * Default character subset
   */
  DEFAULT_SUBSET: ['latin'] as const,

  /**
   * Default font display strategy
   */
  DEFAULT_DISPLAY: 'swap' as const,

  /**
   * Default font loading strategy
   */
  DEFAULT_LOADING_STRATEGY: 'eager' as const,

  /**
   * Default timeout for font loading (10 seconds)
   */
  DEFAULT_TIMEOUT: 10000 as const,

  /**
   * Maximum file size for font uploads (4MB)
   */
  MAX_UPLOAD_SIZE: 4194304 as const,

  /**
   * Supported font formats in order of preference
   */
  SUPPORTED_FORMATS: ['woff2', 'woff', 'ttf', 'otf'] as const,

  /**
   * Web-safe font fallback stacks
   */
  WEB_SAFE_FALLBACKS: {
    'sans-serif': ['Arial', 'Helvetica', 'sans-serif'],
    'serif': ['Georgia', 'Times New Roman', 'serif'],
    'monospace': ['Courier New', 'Courier', 'monospace'],
    'display': ['Impact', 'Arial Black', 'sans-serif'],
    'handwriting': ['Comic Sans MS', 'cursive'],
  } as const,
} as const;
