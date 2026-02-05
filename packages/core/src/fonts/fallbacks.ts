/**
 * Font Fallback System
 *
 * Comprehensive fallback font stacks for all catalog fonts.
 * Maps each Google Font to appropriate system fonts for graceful degradation.
 * Includes platform-specific fallbacks (macOS, Windows, Android).
 */

/**
 * Font fallback mappings
 *
 * Maps Google Font families to arrays of fallback system fonts.
 * Fallbacks are ordered by preference and include platform-specific fonts.
 */
export const FONT_FALLBACKS: Record<string, string[]> = {
  // ==================== Sans-Serif Fonts ====================

  // Modern, clean sans-serif fonts
  'Roboto': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Open Sans': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Lato': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Montserrat': [
    'Avenir Next',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Poppins': [
    'Avenir',
    'Avenir Next',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Inter': [
    '-apple-system',
    'BlinkMacSystemFont',
    'SF Pro Display',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Raleway': [
    'Avenir Next',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Nunito': [
    'Avenir',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Ubuntu': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Work Sans': [
    '-apple-system',
    'BlinkMacSystemFont',
    'SF Pro Text',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Noto Sans': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Rubik': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Source Sans 3': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Mukta': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Kanit': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Barlow': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Manrope': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'DM Sans': [
    '-apple-system',
    'BlinkMacSystemFont',
    'SF Pro Text',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Nunito Sans': [
    'Avenir',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Quicksand': [
    'Avenir',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Verdana',
    'sans-serif',
  ],
  'Josefin Sans': [
    'Avenir Next',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Cabin': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Hind': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Karla': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Oxygen': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Asap': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Exo 2': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'IBM Plex Sans': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Arimo': [
    'Arial',
    'Helvetica Neue',
    'Helvetica',
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif',
  ],
  'Titillium Web': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Heebo': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Assistant': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Fira Sans': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Anton': [
    'Impact',
    'Arial Black',
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif',
  ],
  'Dosis': [
    'Avenir',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Plus Jakarta Sans': [
    '-apple-system',
    'BlinkMacSystemFont',
    'SF Pro Text',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Outfit': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Space Grotesk': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Urbanist': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Lexend': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Mulish': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Red Hat Display': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Figtree': [
    '-apple-system',
    'BlinkMacSystemFont',
    'SF Pro Text',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Archivo': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Jost': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Public Sans': [
    '-apple-system',
    'BlinkMacSystemFont',
    'SF Pro Text',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Cairo': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Comfortaa': [
    'Avenir',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Verdana',
    'sans-serif',
  ],
  'ABeeZee': [
    'Verdana',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  'Be Vietnam Pro': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],

  // ==================== Serif Fonts ====================

  'Playfair Display': [
    'Didot',
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Merriweather': [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Lora': [
    'Palatino',
    'Palatino Linotype',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'serif',
  ],
  'PT Serif': [
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Libre Baskerville': [
    'Baskerville',
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Crimson Text': [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'EB Garamond': [
    'Garamond',
    'Baskerville',
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Noto Serif': [
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Source Serif 4': [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Bitter': [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'serif',
  ],
  'Cormorant Garamond': [
    'Garamond',
    'Baskerville',
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Spectral': [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Alegreya': [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'serif',
  ],
  'Abril Fatface': [
    'Didot',
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Cardo': [
    'Garamond',
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Volkhov': [
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'Domine': [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'serif',
  ],
  'Tinos': [
    'Times New Roman',
    'Times',
    'Georgia',
    'serif',
  ],
  'Archivo Black': [
    'Impact',
    'Arial Black',
    'Georgia',
    'sans-serif',
  ],
  'IBM Plex Serif': [
    'Georgia',
    'Times New Roman',
    'Times',
    'serif',
  ],

  // ==================== Monospace Fonts ====================

  'Roboto Mono': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'JetBrains Mono': [
    'SF Mono',
    'Menlo',
    'Monaco',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'Fira Code': [
    'SF Mono',
    'Menlo',
    'Monaco',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'Source Code Pro': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'Inconsolata': [
    'Menlo',
    'Monaco',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'Space Mono': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'IBM Plex Mono': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'Courier Prime': [
    'Courier New',
    'Courier',
    'SF Mono',
    'Monaco',
    'Menlo',
    'monospace',
  ],
  'Anonymous Pro': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'Overpass Mono': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'PT Mono': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'Ubuntu Mono': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'Noto Sans Mono': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'Red Hat Mono': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'DM Mono': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],

  // ==================== Display Fonts ====================

  'Bebas Neue': [
    'Impact',
    'Arial Black',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'Oswald': [
    'Impact',
    'Arial Narrow',
    'Arial',
    'sans-serif',
  ],
  'Righteous': [
    'Impact',
    'Arial Black',
    'Arial',
    'sans-serif',
  ],
  'Pacifico': [
    'Brush Script MT',
    'cursive',
    'sans-serif',
  ],
  'Lobster': [
    'Brush Script MT',
    'cursive',
    'sans-serif',
  ],
  'Permanent Marker': [
    'Comic Sans MS',
    'cursive',
    'sans-serif',
  ],
  'Bangers': [
    'Impact',
    'Arial Black',
    'cursive',
    'sans-serif',
  ],
  'Fredoka': [
    'Comic Sans MS',
    'Trebuchet MS',
    'Verdana',
    'sans-serif',
  ],
  'Russo One': [
    'Impact',
    'Arial Black',
    'Arial',
    'sans-serif',
  ],
  'Alfa Slab One': [
    'Impact',
    'Arial Black',
    'Arial',
    'sans-serif',
  ],
  'Caveat': [
    'Brush Script MT',
    'cursive',
    'sans-serif',
  ],
  'Shadows Into Light': [
    'Comic Sans MS',
    'cursive',
    'sans-serif',
  ],
  'Staatliches': [
    'Impact',
    'Arial Black',
    'Arial',
    'sans-serif',
  ],
  'Concert One': [
    'Impact',
    'Arial Black',
    'Arial',
    'sans-serif',
  ],
};

/**
 * Generic fallback stacks by category
 */
export const GENERIC_FALLBACKS: Record<string, string[]> = {
  'sans-serif': [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  'serif': [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  'monospace': [
    'SF Mono',
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'Courier',
    'monospace',
  ],
  'display': [
    'Impact',
    'Arial Black',
    'Arial',
    'sans-serif',
  ],
};

/**
 * Get the complete CSS font-family string with fallbacks
 *
 * @param fontFamily - The primary font family name
 * @returns CSS font-family string with fallbacks
 *
 * @example
 * ```ts
 * const fontStack = getFallbackStack('Roboto');
 * // Returns: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
 * ```
 */
export function getFallbackStack(fontFamily: string): string {
  const fallbacks = FONT_FALLBACKS[fontFamily] || GENERIC_FALLBACKS['sans-serif'];

  // Quote font names that contain spaces or special characters
  const quotedPrimary = fontFamily.includes(' ') || fontFamily.includes('-')
    ? `"${fontFamily}"`
    : fontFamily;

  // Quote fallback fonts that contain spaces
  const quotedFallbacks = fallbacks.map(font => {
    if (font.includes(' ') && !font.startsWith('-')) {
      return `"${font}"`;
    }
    return font;
  });

  return `${quotedPrimary}, ${quotedFallbacks.join(', ')}`;
}

/**
 * Get an array of fallback fonts for a given font family
 *
 * @param fontFamily - The primary font family name
 * @returns Array of fallback font names
 *
 * @example
 * ```ts
 * const fallbacks = getFallbackFonts('Roboto');
 * // Returns: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', ...]
 * ```
 */
export function getFallbackFonts(fontFamily: string): string[] {
  return FONT_FALLBACKS[fontFamily] || GENERIC_FALLBACKS['sans-serif'];
}

/**
 * Check if a font family has a custom fallback mapping
 *
 * @param fontFamily - The font family name to check
 * @returns True if custom fallback exists, false otherwise
 *
 * @example
 * ```ts
 * if (hasCustomFallback('Roboto')) {
 *   console.log('Custom fallback stack available');
 * }
 * ```
 */
export function hasCustomFallback(fontFamily: string): boolean {
  return fontFamily in FONT_FALLBACKS;
}

/**
 * Get fallback stack by font category
 *
 * @param category - Font category (sans-serif, serif, monospace, display)
 * @returns Array of fallback font names for the category
 *
 * @example
 * ```ts
 * const serifFallbacks = getFallbacksByCategory('serif');
 * // Returns: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif']
 * ```
 */
export function getFallbacksByCategory(
  category: 'sans-serif' | 'serif' | 'monospace' | 'display'
): string[] {
  return GENERIC_FALLBACKS[category] || GENERIC_FALLBACKS['sans-serif'];
}

/**
 * Get all available font families with custom fallbacks
 *
 * @returns Array of font family names that have custom fallback mappings
 *
 * @example
 * ```ts
 * const availableFonts = getAvailableFallbackFonts();
 * console.log(`${availableFonts.length} fonts with custom fallbacks`);
 * ```
 */
export function getAvailableFallbackFonts(): string[] {
  return Object.keys(FONT_FALLBACKS);
}

/**
 * Get fallback statistics
 *
 * @returns Object containing fallback system statistics
 *
 * @example
 * ```ts
 * const stats = getFallbackStats();
 * console.log(`Total mappings: ${stats.totalMappings}`);
 * console.log(`By category:`, stats.byCategory);
 * ```
 */
export function getFallbackStats() {
  const fonts = Object.keys(FONT_FALLBACKS);
  const byCategory: Record<string, number> = {
    'sans-serif': 0,
    'serif': 0,
    'monospace': 0,
    'display': 0,
  };

  // Simple heuristic to categorize fonts based on known patterns
  fonts.forEach(font => {
    if (font.includes('Mono') || font === 'Inconsolata' || font === 'Courier Prime' || font === 'Anonymous Pro') {
      byCategory.monospace++;
    } else if (
      font === 'Playfair Display' || font === 'Merriweather' || font === 'Lora' ||
      font === 'PT Serif' || font === 'Libre Baskerville' || font === 'Crimson Text' ||
      font === 'EB Garamond' || font === 'Noto Serif' || font === 'Source Serif 4' ||
      font === 'Bitter' || font === 'Cormorant Garamond' || font === 'Spectral' ||
      font === 'Alegreya' || font === 'Abril Fatface' || font === 'Cardo' ||
      font === 'Volkhov' || font === 'Domine' || font === 'Tinos' || font === 'IBM Plex Serif'
    ) {
      byCategory.serif++;
    } else if (
      font === 'Bebas Neue' || font === 'Oswald' || font === 'Righteous' ||
      font === 'Pacifico' || font === 'Lobster' || font === 'Permanent Marker' ||
      font === 'Bangers' || font === 'Fredoka' || font === 'Russo One' ||
      font === 'Alfa Slab One' || font === 'Caveat' || font === 'Shadows Into Light' ||
      font === 'Staatliches' || font === 'Concert One'
    ) {
      byCategory.display++;
    } else {
      byCategory['sans-serif']++;
    }
  });

  return {
    totalMappings: fonts.length,
    byCategory,
    genericCategories: Object.keys(GENERIC_FALLBACKS).length,
  };
}
