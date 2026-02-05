/**
 * Font system exports
 *
 * Comprehensive font loading and management system for Rendervid
 */

// Export all font types
export type {
  // Core font types
  FontWeight,
  NumericFontWeight,
  NamedFontWeight,
  FontStyle,
  FontCategory,
  FontLoadingStrategy,
  FontDisplay,
  FontFormat,

  // Font definitions
  GoogleFontDefinition,
  CustomFontDefinition,

  // Font metadata
  FontMetadata,
  LicenseInfo,

  // Font configuration
  FontConfiguration,
  FontFallback,
  FontMetrics,

  // Font loading
  FontLoadingState,
  FontLoadResult,
  FontReference,
  LoadedFonts,

  // Font validation
  FontValidationResult,

  // Font upload
  FontUploadOptions,

  // System fonts
  SystemFont,

  // Font caching
  FontCacheEntry,

  // Helper types
  WeightToNumeric,
} from './types';

// Export font utility functions and classes
export {
  isNumericWeight,
  isNamedWeight,
  weightToNumeric,
  numericToNamedWeight,
  FONT_CONSTANTS,
  FontLoadingError,
} from './types';

// Export FontManager
export { FontManager } from './FontManager';

// Export font catalog
export {
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
} from './catalog';

// Export font fallbacks
export {
  FONT_FALLBACKS,
  GENERIC_FALLBACKS,
  getFallbackStack,
  getFallbackFonts,
  hasCustomFallback,
  getFallbacksByCategory,
  getAvailableFallbackFonts,
  getFallbackStats,
} from './fallbacks';
