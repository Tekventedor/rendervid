import type { Template } from '../types/template';
import type { Layer, TextLayer } from '../types/layer';
import type {
  FontConfiguration,
  GoogleFontDefinition,
  CustomFontDefinition,
  FontReference,
  LoadedFonts,
} from './types';
import { FontLoadingError } from './types';

/**
 * System font fallback mappings for different font categories.
 */
const FALLBACK_MAP: Record<string, string[]> = {
  // Sans-Serif
  Roboto: ['Arial', 'Helvetica', 'sans-serif'],
  'Open Sans': ['Arial', 'Helvetica', 'sans-serif'],
  Lato: ['Arial', 'Helvetica', 'sans-serif'],
  Montserrat: ['Arial', 'Helvetica', 'sans-serif'],
  Poppins: ['Arial', 'Helvetica', 'sans-serif'],
  Inter: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'],
  'Work Sans': ['Arial', 'Helvetica', 'sans-serif'],
  'Plus Jakarta Sans': ['Arial', 'Helvetica', 'sans-serif'],
  Nunito: ['Arial', 'Helvetica', 'sans-serif'],
  Raleway: ['Arial', 'Helvetica', 'sans-serif'],
  Ubuntu: ['Arial', 'Helvetica', 'sans-serif'],
  'Source Sans Pro': ['Arial', 'Helvetica', 'sans-serif'],

  // Serif
  'Playfair Display': ['Georgia', 'Times New Roman', 'serif'],
  Merriweather: ['Georgia', 'Cambria', 'serif'],
  Lora: ['Georgia', 'Times New Roman', 'serif'],
  'PT Serif': ['Georgia', 'Times New Roman', 'serif'],
  'EB Garamond': ['Garamond', 'Georgia', 'serif'],
  'Libre Baskerville': ['Baskerville', 'Georgia', 'serif'],
  'Crimson Text': ['Georgia', 'Times New Roman', 'serif'],

  // Monospace
  'Roboto Mono': ['Consolas', 'Monaco', 'Courier New', 'monospace'],
  'JetBrains Mono': ['Consolas', 'Monaco', 'monospace'],
  'Fira Code': ['Cascadia Code', 'Consolas', 'monospace'],
  'Source Code Pro': ['Consolas', 'Monaco', 'monospace'],
  'IBM Plex Mono': ['Consolas', 'Monaco', 'monospace'],
  Inconsolata: ['Consolas', 'Monaco', 'monospace'],

  // Display
  'Bebas Neue': ['Impact', 'Arial Black', 'sans-serif'],
  Oswald: ['Arial', 'Helvetica', 'sans-serif'],
  Pacifico: ['cursive'],
  Lobster: ['cursive'],
};

/**
 * Default fallbacks by generic font family.
 */
const GENERIC_FALLBACKS: Record<string, string[]> = {
  'sans-serif': ['Arial', 'Helvetica', 'sans-serif'],
  serif: ['Georgia', 'Times New Roman', 'serif'],
  monospace: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
  cursive: ['cursive'],
  fantasy: ['fantasy'],
};

/**
 * FontManager coordinates font loading for templates.
 *
 * Features:
 * - Loads Google Fonts and custom fonts
 * - Extracts fonts from template layers
 * - Manages fallback font stacks
 * - Handles timeouts and errors gracefully
 * - Verifies fonts are ready before rendering
 *
 * @example
 * ```typescript
 * const fontManager = new FontManager();
 *
 * // Load fonts from configuration
 * const result = await fontManager.loadFonts({
 *   google: [{ family: 'Roboto', weights: [400, 700] }],
 *   custom: [{ family: 'MyFont', source: '/fonts/myfont.woff2' }],
 * });
 *
 * // Extract fonts from template
 * const fonts = fontManager.extractFontsFromTemplate(template);
 *
 * // Get fallback stack
 * const stack = fontManager.getFallbackStack('Roboto');
 * // Returns: "'Roboto', Arial, Helvetica, sans-serif"
 * ```
 */
export class FontManager {
  private readonly loadTimeout: number;
  private readonly injectedStyles: Set<string> = new Set();

  /**
   * Create a new FontManager.
   *
   * @param options - Configuration options
   * @param options.timeout - Font loading timeout in milliseconds (default: 10000)
   */
  constructor(options: { timeout?: number } = {}) {
    this.loadTimeout = options.timeout ?? 10000;
  }

  /**
   * Load fonts from configuration.
   *
   * Loads Google Fonts and custom fonts, with timeout and error handling.
   * Fonts that fail to load will be included in the `failed` array.
   *
   * @param config - Font configuration
   * @returns Promise resolving to loaded fonts result
   *
   * @example
   * ```typescript
   * const result = await fontManager.loadFonts({
   *   google: [
   *     { family: 'Roboto', weights: [400, 700] },
   *     { family: 'Playfair Display', styles: ['normal', 'italic'] },
   *   ],
   * });
   *
   * console.log(`Loaded ${result.loaded.length} fonts in ${result.loadTime}ms`);
   * if (result.failed.length > 0) {
   *   console.warn(`Failed to load: ${result.failed.map(f => f.family).join(', ')}`);
   * }
   * ```
   */
  async loadFonts(config: FontConfiguration): Promise<LoadedFonts> {
    const startTime = Date.now();
    const loaded: FontReference[] = [];
    const failed: FontReference[] = [];

    const promises: Promise<void>[] = [];

    // Load Google Fonts
    if (config.google) {
      for (const font of config.google) {
        promises.push(
          this.loadGoogleFont(font)
            .then(() => {
              const weights = font.weights ?? [400];
              const styles = font.styles ?? ['normal'];
              for (const weight of weights) {
                for (const style of styles) {
                  loaded.push({ family: font.family, weight, style });
                }
              }
            })
            .catch((error) => {
              console.error(`Failed to load Google Font ${font.family}:`, error);
              failed.push({ family: font.family });
            })
        );
      }
    }

    // Load custom fonts
    if (config.custom) {
      for (const font of config.custom) {
        promises.push(
          this.loadCustomFont(font)
            .then(() => {
              loaded.push({
                family: font.family,
                weight: font.weight ?? 400,
                style: font.style ?? 'normal',
              });
            })
            .catch((error) => {
              console.error(`Failed to load custom font ${font.family}:`, error);
              failed.push({
                family: font.family,
                weight: font.weight,
                style: font.style,
              });
            })
        );
      }
    }

    // Wait for all fonts with timeout
    await Promise.all(promises);

    // Wait for browser to finish loading fonts
    await this.waitForFontsReady();

    const loadTime = Date.now() - startTime;

    return { loaded, failed, loadTime };
  }

  /**
   * Extract all fonts used in a template.
   *
   * Scans all text layers and extracts unique font family/weight/style combinations.
   *
   * @param template - Template to extract fonts from
   * @returns Set of font references used in the template
   *
   * @example
   * ```typescript
   * const fonts = fontManager.extractFontsFromTemplate(template);
   * console.log(`Template uses ${fonts.size} unique fonts`);
   * fonts.forEach(font => {
   *   console.log(`- ${font.family} ${font.weight} ${font.style}`);
   * });
   * ```
   */
  extractFontsFromTemplate(template: Template): Set<FontReference> {
    const fonts = new Set<FontReference>();

    const extractFromLayers = (layers: Layer[]) => {
      for (const layer of layers) {
        if (layer.type === 'text') {
          const textLayer = layer as TextLayer;
          const fontFamily = textLayer.props.fontFamily;

          if (fontFamily) {
            // Parse font weight
            let weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 = 400;
            if (textLayer.props.fontWeight) {
              const fw = textLayer.props.fontWeight;
              if (typeof fw === 'number') {
                weight = fw as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
              } else if (typeof fw === 'string') {
                if (fw === 'bold') {
                  weight = 700;
                } else if (fw === 'normal') {
                  weight = 400;
                } else {
                  const parsed = parseInt(fw, 10);
                  if ([100, 200, 300, 400, 500, 600, 700, 800, 900].includes(parsed)) {
                    weight = parsed as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
                  }
                }
              }
            }

            const style = textLayer.props.fontStyle ?? 'normal';

            // Add to set (using JSON stringification for Set uniqueness)
            const fontRef: FontReference = {
              family: fontFamily,
              weight,
              style,
            };

            // Check if this combination already exists
            let exists = false;
            for (const existing of fonts) {
              if (
                existing.family === fontRef.family &&
                existing.weight === fontRef.weight &&
                existing.style === fontRef.style
              ) {
                exists = true;
                break;
              }
            }

            if (!exists) {
              fonts.add(fontRef);
            }
          }
        }

        // Recursively check group layers
        if (layer.type === 'group' && 'children' in layer) {
          extractFromLayers(layer.children);
        }
      }
    };

    // Extract from all scenes
    for (const scene of template.composition.scenes) {
      extractFromLayers(scene.layers);
    }

    return fonts;
  }

  /**
   * Wait for document.fonts.ready.
   *
   * This ensures all fonts are loaded before rendering to prevent
   * FOIT (Flash of Invisible Text) and FOUT (Flash of Unstyled Text).
   *
   * @param timeout - Optional timeout in milliseconds (uses instance timeout if not provided)
   * @returns Promise that resolves when fonts are ready or timeout occurs
   *
   * @example
   * ```typescript
   * await fontManager.waitForFontsReady();
   * // Fonts are now ready for rendering
   * ```
   */
  async waitForFontsReady(timeout?: number): Promise<void> {
    const maxWait = timeout ?? this.loadTimeout;

    // Check if we're in a browser environment
    if (typeof document === 'undefined' || !document.fonts) {
      // Node.js environment or no Font Loading API support
      return;
    }

    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.warn('Font loading timeout reached, continuing with fallbacks');
        resolve();
      }, maxWait);
    });

    const readyPromise = document.fonts.ready.then(() => {
      // Fonts are ready
    });

    await Promise.race([readyPromise, timeoutPromise]);
  }

  /**
   * Verify that specific fonts are loaded.
   *
   * Checks if fonts are available using the CSS Font Loading API.
   *
   * @param fonts - Array of font references to verify
   * @returns True if all fonts are loaded, false otherwise
   *
   * @example
   * ```typescript
   * const allLoaded = fontManager.verifyFontsLoaded([
   *   { family: 'Roboto', weight: 400 },
   *   { family: 'Roboto', weight: 700 },
   * ]);
   * if (!allLoaded) {
   *   console.warn('Some fonts are not loaded');
   * }
   * ```
   */
  verifyFontsLoaded(fonts: FontReference[]): boolean {
    // Check if we're in a browser environment
    if (typeof document === 'undefined' || !document.fonts) {
      // Can't verify in Node.js environment
      return true;
    }

    for (const font of fonts) {
      const weight = font.weight ?? 400;
      const style = font.style ?? 'normal';
      const fontSpec = `${style} ${weight} 16px "${font.family}"`;

      if (!document.fonts.check(fontSpec)) {
        console.error(`Font not loaded: ${font.family} (${weight} ${style})`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get CSS fallback font stack for a font family.
   *
   * Returns a CSS font-family value with appropriate fallbacks.
   *
   * @param fontFamily - Primary font family name
   * @param customFallbacks - Optional custom fallback array
   * @returns CSS font-family string with fallbacks
   *
   * @example
   * ```typescript
   * const stack = fontManager.getFallbackStack('Roboto');
   * // Returns: "'Roboto', Arial, Helvetica, sans-serif"
   *
   * const customStack = fontManager.getFallbackStack('MyFont', ['Arial', 'sans-serif']);
   * // Returns: "'MyFont', Arial, sans-serif"
   * ```
   */
  getFallbackStack(fontFamily: string, customFallbacks?: string[]): string {
    const fallbacks =
      customFallbacks ??
      FALLBACK_MAP[fontFamily] ??
      GENERIC_FALLBACKS['sans-serif'];

    return `'${fontFamily}', ${fallbacks.join(', ')}`;
  }

  /**
   * Load a Google Font.
   *
   * @internal
   */
  private async loadGoogleFont(definition: GoogleFontDefinition): Promise<void> {
    const weights = definition.weights ?? [400];
    const styles = definition.styles ?? ['normal'];
    const subsets = definition.subsets ?? ['latin'];
    const display = definition.display ?? 'swap';

    // Build Google Fonts API URL
    const family = definition.family.replace(/ /g, '+');
    const weightsParam = weights.join(';');

    // Build italic variants if needed
    const variants: string[] = [];
    for (const style of styles) {
      if (style === 'italic') {
        variants.push(`ital,wght@1,${weightsParam}`);
      } else {
        variants.push(`wght@${weightsParam}`);
      }
    }

    const subsetsParam = subsets.join(',');
    const url = `https://fonts.googleapis.com/css2?family=${family}:${variants.join(';')}&subset=${subsetsParam}&display=${display}`;

    // Check if already loaded
    if (this.injectedStyles.has(url)) {
      return;
    }

    try {
      // Fetch and inject CSS
      const response = await this.fetchWithTimeout(url, this.loadTimeout);
      const css = await response.text();
      this.injectFontCSS(css);
      this.injectedStyles.add(url);

      // Load font faces
      await this.loadFontFaces(definition.family, weights, styles);
    } catch (error) {
      throw new FontLoadingError(
        `Failed to load Google Font: ${definition.family}`,
        definition.family,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Load a custom font.
   *
   * @internal
   */
  private async loadCustomFont(definition: CustomFontDefinition): Promise<void> {
    const weight = definition.weight ?? 400;
    const style = definition.style ?? 'normal';
    const format = definition.format ?? 'woff2';
    const display = definition.display ?? 'swap';

    // Generate @font-face CSS
    const css = this.generateFontFaceCSS({
      family: definition.family,
      src: definition.source,
      weight,
      style,
      format,
      display,
      unicodeRange: definition.unicodeRange,
    });

    // Check if already loaded
    if (this.injectedStyles.has(css)) {
      return;
    }

    try {
      // Inject CSS
      this.injectFontCSS(css);
      this.injectedStyles.add(css);

      // Load font face
      await this.loadFontFaces(definition.family, [weight], [style]);
    } catch (error) {
      throw new FontLoadingError(
        `Failed to load custom font: ${definition.family}`,
        definition.family,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Generate @font-face CSS rule.
   *
   * @internal
   */
  private generateFontFaceCSS(options: {
    family: string;
    src: string;
    weight: number;
    style: string;
    format: string;
    display: string;
    unicodeRange?: string;
  }): string {
    const { family, src, weight, style, format, display, unicodeRange } = options;

    let css = '@font-face {\n';
    css += `  font-family: '${family}';\n`;
    css += `  src: url('${src}') format('${format}');\n`;
    css += `  font-weight: ${weight};\n`;
    css += `  font-style: ${style};\n`;
    css += `  font-display: ${display};\n`;

    if (unicodeRange) {
      css += `  unicode-range: ${unicodeRange};\n`;
    }

    css += '}\n';

    return css;
  }

  /**
   * Inject CSS into the document.
   *
   * @internal
   */
  private injectFontCSS(css: string): void {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      return;
    }

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Load font faces using Font Loading API.
   *
   * @internal
   */
  private async loadFontFaces(
    family: string,
    weights: number[],
    styles: string[]
  ): Promise<void> {
    // Check if we're in a browser environment
    if (typeof FontFace === 'undefined') {
      // Node.js environment, skip font loading
      return;
    }

    const promises: Promise<void>[] = [];

    for (const weight of weights) {
      for (const style of styles) {
        const promise = this.loadFontFace(family, weight, style);
        promises.push(promise);
      }
    }

    await Promise.all(promises);
  }

  /**
   * Load a single font face.
   *
   * @internal
   */
  private async loadFontFace(
    family: string,
    weight: number,
    style: string
  ): Promise<void> {
    if (typeof FontFace === 'undefined' || typeof document === 'undefined') {
      return;
    }

    try {
      // Create FontFace instance
      const fontFace = new FontFace(
        family,
        `local('${family}')`,
        { weight: weight.toString(), style }
      );

      // Load with timeout
      const loadPromise = fontFace.load();
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Font load timeout')), this.loadTimeout);
      });

      await Promise.race([loadPromise, timeoutPromise]);

      // Add to document
      document.fonts.add(fontFace);
    } catch (error) {
      // Font loading failed, but we'll continue with fallback
      console.warn(`Failed to load font face: ${family} ${weight} ${style}`, error);
    }
  }

  /**
   * Fetch with timeout.
   *
   * @internal
   */
  private async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Fetch timeout');
      }
      throw error;
    }
  }
}
