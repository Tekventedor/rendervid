/**
 * Google Fonts Catalog
 *
 * Comprehensive catalog of 100+ curated Google Fonts with metadata.
 * Provides utilities to query fonts by category, popularity, and family name.
 */

import catalogData from './catalog-data.json';

/**
 * Font category types
 */
export type FontCategory = 'sans-serif' | 'serif' | 'monospace' | 'display';

/**
 * Font style types
 */
export type FontStyle = 'normal' | 'italic';

/**
 * Font metadata interface
 */
export interface FontMetadata {
  /** Font family name as used in CSS */
  family: string;
  /** Font category */
  category: FontCategory;
  /** Available font weights (e.g., [400, 700]) */
  weights: number[];
  /** Available font styles */
  styles: FontStyle[];
  /** Supported character subsets */
  subsets: string[];
  /** Preview text for the font */
  preview: string;
  /** Whether the font has a variable font version */
  variable: boolean;
  /** Popularity ranking (1 = most popular) */
  popularity: number;
}

/**
 * Font catalog data structure
 */
interface CatalogData {
  fonts: FontMetadata[];
}

// Type assertion for imported JSON
const catalog = catalogData as CatalogData;

/**
 * Get the complete font catalog
 *
 * @returns Array of all font metadata objects
 *
 * @example
 * ```ts
 * const allFonts = getFontCatalog();
 * console.log(`Total fonts: ${allFonts.length}`);
 * ```
 */
export function getFontCatalog(): FontMetadata[] {
  return [...catalog.fonts];
}

/**
 * Get fonts filtered by category
 *
 * @param category - Font category to filter by
 * @returns Array of font metadata objects in the specified category
 *
 * @example
 * ```ts
 * const sansFonts = getFontsByCategory('sans-serif');
 * const serifFonts = getFontsByCategory('serif');
 * const monoFonts = getFontsByCategory('monospace');
 * ```
 */
export function getFontsByCategory(category: FontCategory): FontMetadata[] {
  return catalog.fonts.filter(font => font.category === category);
}

/**
 * Get metadata for a specific font family
 *
 * @param family - Font family name (case-sensitive)
 * @returns Font metadata object or undefined if not found
 *
 * @example
 * ```ts
 * const roboto = getFontMetadata('Roboto');
 * if (roboto) {
 *   console.log(`Weights: ${roboto.weights.join(', ')}`);
 *   console.log(`Variable: ${roboto.variable}`);
 * }
 * ```
 */
export function getFontMetadata(family: string): FontMetadata | undefined {
  return catalog.fonts.find(font => font.family === family);
}

/**
 * Get the top 50 most popular fonts
 *
 * @returns Array of the 50 most popular font metadata objects, sorted by popularity
 *
 * @example
 * ```ts
 * const popular = getPopularFonts();
 * console.log(`Most popular: ${popular[0].family}`);
 * ```
 */
export function getPopularFonts(): FontMetadata[] {
  return catalog.fonts
    .filter(font => font.popularity <= 50)
    .sort((a, b) => a.popularity - b.popularity);
}

/**
 * Get fonts that support variable font technology
 *
 * @returns Array of variable font metadata objects
 *
 * @example
 * ```ts
 * const variableFonts = getVariableFonts();
 * console.log(`Variable fonts: ${variableFonts.length}`);
 * ```
 */
export function getVariableFonts(): FontMetadata[] {
  return catalog.fonts.filter(font => font.variable);
}

/**
 * Search fonts by name (case-insensitive partial match)
 *
 * @param query - Search query string
 * @returns Array of matching font metadata objects
 *
 * @example
 * ```ts
 * const results = searchFonts('mono');
 * // Returns fonts like "Roboto Mono", "JetBrains Mono", etc.
 * ```
 */
export function searchFonts(query: string): FontMetadata[] {
  const lowerQuery = query.toLowerCase();
  return catalog.fonts.filter(font =>
    font.family.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get fonts that support specific weights
 *
 * @param weights - Array of weight values to check for
 * @param matchAll - If true, font must support all weights; if false, any weight
 * @returns Array of font metadata objects supporting the specified weights
 *
 * @example
 * ```ts
 * // Find fonts with both 300 and 700 weights
 * const fonts = getFontsByWeight([300, 700], true);
 *
 * // Find fonts with either 100 or 900 weights
 * const extremes = getFontsByWeight([100, 900], false);
 * ```
 */
export function getFontsByWeight(weights: number[], matchAll: boolean = false): FontMetadata[] {
  return catalog.fonts.filter(font => {
    if (matchAll) {
      return weights.every(weight => font.weights.includes(weight));
    } else {
      return weights.some(weight => font.weights.includes(weight));
    }
  });
}

/**
 * Get fonts that support italic style
 *
 * @returns Array of font metadata objects with italic support
 *
 * @example
 * ```ts
 * const italicFonts = getFontsWithItalic();
 * ```
 */
export function getFontsWithItalic(): FontMetadata[] {
  return catalog.fonts.filter(font => font.styles.includes('italic'));
}

/**
 * Get catalog statistics
 *
 * @returns Object containing catalog statistics
 *
 * @example
 * ```ts
 * const stats = getCatalogStats();
 * console.log(`Total: ${stats.total}`);
 * console.log(`Sans-serif: ${stats.byCategory['sans-serif']}`);
 * ```
 */
export function getCatalogStats() {
  const total = catalog.fonts.length;
  const byCategory = catalog.fonts.reduce((acc, font) => {
    acc[font.category] = (acc[font.category] || 0) + 1;
    return acc;
  }, {} as Record<FontCategory, number>);

  const variableCount = catalog.fonts.filter(f => f.variable).length;
  const withItalic = catalog.fonts.filter(f => f.styles.includes('italic')).length;

  return {
    total,
    byCategory,
    variable: variableCount,
    withItalic,
  };
}

/**
 * Validate if a font family exists in the catalog
 *
 * @param family - Font family name to check
 * @returns True if the font exists in the catalog
 *
 * @example
 * ```ts
 * if (isFontAvailable('Roboto')) {
 *   // Font is available
 * }
 * ```
 */
export function isFontAvailable(family: string): boolean {
  return catalog.fonts.some(font => font.family === family);
}

/**
 * Get random fonts from the catalog
 *
 * @param count - Number of random fonts to return
 * @returns Array of random font metadata objects
 *
 * @example
 * ```ts
 * const randomFonts = getRandomFonts(5);
 * ```
 */
export function getRandomFonts(count: number = 1): FontMetadata[] {
  const shuffled = [...catalog.fonts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
