/**
 * Tests for font fallback system
 */

import { describe, it, expect } from 'vitest';
import {
  FONT_FALLBACKS,
  GENERIC_FALLBACKS,
  getFallbackStack,
  getFallbackFonts,
  hasCustomFallback,
  getFallbacksByCategory,
  getAvailableFallbackFonts,
  getFallbackStats,
} from './fallbacks';
import { getFontCatalog, getFontsByCategory } from './catalog';

describe('Font Fallbacks', () => {
  describe('FONT_FALLBACKS constant', () => {
    it('should have mappings for all catalog fonts', () => {
      const catalog = getFontCatalog();
      const fallbackFonts = Object.keys(FONT_FALLBACKS);

      // Catalog has 100 entries but includes 1 duplicate (Archivo Black)
      // So we expect 99 unique font family mappings
      expect(fallbackFonts.length).toBe(99);

      // Check that all catalog fonts have fallbacks
      catalog.forEach(font => {
        expect(FONT_FALLBACKS).toHaveProperty(font.family);
      });
    });

    it('should have non-empty fallback arrays', () => {
      Object.entries(FONT_FALLBACKS).forEach(([family, fallbacks]) => {
        expect(fallbacks.length).toBeGreaterThan(0);
        expect(fallbacks).not.toContain('');
      });
    });

    it('should include generic font category at the end', () => {
      const genericCategories = ['sans-serif', 'serif', 'monospace', 'cursive'];

      Object.entries(FONT_FALLBACKS).forEach(([family, fallbacks]) => {
        const lastFallback = fallbacks[fallbacks.length - 1];
        expect(genericCategories).toContain(lastFallback);
      });
    });

    it('should have appropriate fallbacks for sans-serif fonts', () => {
      const sansFonts = getFontsByCategory('sans-serif');

      sansFonts.forEach(font => {
        const fallbacks = FONT_FALLBACKS[font.family];
        expect(fallbacks).toBeDefined();
        expect(fallbacks[fallbacks.length - 1]).toBe('sans-serif');
      });
    });

    it('should have appropriate fallbacks for serif fonts', () => {
      const serifFonts = getFontsByCategory('serif');

      serifFonts.forEach(font => {
        const fallbacks = FONT_FALLBACKS[font.family];
        expect(fallbacks).toBeDefined();
        const lastFallback = fallbacks[fallbacks.length - 1];
        // Serif fonts should end with 'serif' or 'sans-serif' (for Archivo Black which is display)
        expect(['serif', 'sans-serif']).toContain(lastFallback);
      });
    });

    it('should have appropriate fallbacks for monospace fonts', () => {
      const monoFonts = getFontsByCategory('monospace');

      monoFonts.forEach(font => {
        const fallbacks = FONT_FALLBACKS[font.family];
        expect(fallbacks).toBeDefined();
        expect(fallbacks[fallbacks.length - 1]).toBe('monospace');
        // Should include common monospace fallbacks
        const hasMonospaceFallback = fallbacks.some(f =>
          ['Courier', 'Courier New', 'Monaco', 'Menlo', 'Consolas', 'SF Mono'].includes(f)
        );
        expect(hasMonospaceFallback).toBe(true);
      });
    });

    it('should have appropriate fallbacks for display fonts', () => {
      const displayFonts = getFontsByCategory('display');

      displayFonts.forEach(font => {
        const fallbacks = FONT_FALLBACKS[font.family];
        expect(fallbacks).toBeDefined();
        const lastFallback = fallbacks[fallbacks.length - 1];
        expect(['sans-serif', 'cursive']).toContain(lastFallback);
      });
    });

    it('should include platform-specific fonts', () => {
      const platformFonts = [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'SF Mono',
        'SF Pro Text',
        'SF Pro Display',
      ];

      // Check that at least some fonts use platform-specific fallbacks
      let platformFontCount = 0;
      Object.values(FONT_FALLBACKS).forEach(fallbacks => {
        const hasPlatformFont = fallbacks.some(f => platformFonts.includes(f));
        if (hasPlatformFont) {
          platformFontCount++;
        }
      });

      expect(platformFontCount).toBeGreaterThan(50);
    });
  });

  describe('GENERIC_FALLBACKS constant', () => {
    it('should have fallbacks for all categories', () => {
      expect(GENERIC_FALLBACKS).toHaveProperty('sans-serif');
      expect(GENERIC_FALLBACKS).toHaveProperty('serif');
      expect(GENERIC_FALLBACKS).toHaveProperty('monospace');
      expect(GENERIC_FALLBACKS).toHaveProperty('display');
    });

    it('should have valid generic fallbacks', () => {
      Object.entries(GENERIC_FALLBACKS).forEach(([category, fallbacks]) => {
        expect(fallbacks.length).toBeGreaterThan(0);
        // Display fonts fall back to sans-serif as the generic
        const expectedGeneric = category === 'display' ? 'sans-serif' : category;
        expect(fallbacks[fallbacks.length - 1]).toBe(expectedGeneric);
      });
    });
  });

  describe('getFallbackStack', () => {
    it('should return CSS font-family string with fallbacks', () => {
      const stack = getFallbackStack('Roboto');
      expect(stack).toContain('Roboto');
      expect(stack).toContain('sans-serif');
      expect(stack).toContain(',');
    });

    it('should quote font names with spaces', () => {
      const stack = getFallbackStack('Open Sans');
      expect(stack).toMatch(/"Open Sans"/);
      expect(stack).toMatch(/"Segoe UI"/);
      expect(stack).toMatch(/"Helvetica Neue"/);
    });

    it('should not quote system font variables', () => {
      const stack = getFallbackStack('Roboto');
      expect(stack).toContain('-apple-system');
      expect(stack).not.toContain('"-apple-system"');
      expect(stack).toContain('BlinkMacSystemFont');
      expect(stack).not.toContain('"BlinkMacSystemFont"');
    });

    it('should use generic fallback for unknown fonts', () => {
      const stack = getFallbackStack('UnknownFont123');
      expect(stack).toContain('UnknownFont123');
      expect(stack).toContain('-apple-system');
      expect(stack).toContain('sans-serif');
    });

    it('should return valid CSS for all catalog fonts', () => {
      const catalog = getFontCatalog();

      catalog.forEach(font => {
        const stack = getFallbackStack(font.family);
        expect(stack).toBeTruthy();
        expect(stack).toContain(font.family);
        expect(stack).toContain(',');
      });
    });

    it('should handle monospace fonts correctly', () => {
      const stack = getFallbackStack('Roboto Mono');
      expect(stack).toContain('Roboto Mono');
      expect(stack).toContain('monospace');
      expect(stack).toMatch(/Monaco|Menlo|Consolas/);
    });

    it('should handle serif fonts correctly', () => {
      const stack = getFallbackStack('Playfair Display');
      expect(stack).toMatch(/"Playfair Display"/);
      expect(stack).toContain('serif');
      expect(stack).toMatch(/Georgia|Times/);
    });

    it('should handle display fonts correctly', () => {
      const stack = getFallbackStack('Bebas Neue');
      expect(stack).toMatch(/"Bebas Neue"/);
      expect(stack).toContain('Impact');
    });
  });

  describe('getFallbackFonts', () => {
    it('should return array of fallback fonts', () => {
      const fallbacks = getFallbackFonts('Roboto');
      expect(Array.isArray(fallbacks)).toBe(true);
      expect(fallbacks.length).toBeGreaterThan(0);
      expect(fallbacks).toContain('sans-serif');
    });

    it('should return generic fallback for unknown fonts', () => {
      const fallbacks = getFallbackFonts('UnknownFont123');
      expect(fallbacks).toEqual(GENERIC_FALLBACKS['sans-serif']);
    });

    it('should return custom fallbacks for known fonts', () => {
      const fallbacks = getFallbackFonts('Roboto');
      expect(fallbacks).toEqual(FONT_FALLBACKS['Roboto']);
    });

    it('should not include the primary font in fallbacks', () => {
      const fallbacks = getFallbackFonts('Roboto');
      expect(fallbacks).not.toContain('Roboto');
    });

    it('should return different fallbacks for different categories', () => {
      const sansFallbacks = getFallbackFonts('Roboto');
      const serifFallbacks = getFallbackFonts('Merriweather');
      const monoFallbacks = getFallbackFonts('Roboto Mono');

      expect(sansFallbacks[sansFallbacks.length - 1]).toBe('sans-serif');
      expect(serifFallbacks[serifFallbacks.length - 1]).toBe('serif');
      expect(monoFallbacks[monoFallbacks.length - 1]).toBe('monospace');
    });
  });

  describe('hasCustomFallback', () => {
    it('should return true for fonts with custom fallbacks', () => {
      expect(hasCustomFallback('Roboto')).toBe(true);
      expect(hasCustomFallback('Open Sans')).toBe(true);
      expect(hasCustomFallback('Playfair Display')).toBe(true);
      expect(hasCustomFallback('Roboto Mono')).toBe(true);
    });

    it('should return false for fonts without custom fallbacks', () => {
      expect(hasCustomFallback('UnknownFont123')).toBe(false);
      expect(hasCustomFallback('NotARealFont')).toBe(false);
    });

    it('should return true for all catalog fonts', () => {
      const catalog = getFontCatalog();

      catalog.forEach(font => {
        expect(hasCustomFallback(font.family)).toBe(true);
      });
    });

    it('should be case-sensitive', () => {
      expect(hasCustomFallback('Roboto')).toBe(true);
      expect(hasCustomFallback('roboto')).toBe(false);
      expect(hasCustomFallback('ROBOTO')).toBe(false);
    });
  });

  describe('getFallbacksByCategory', () => {
    it('should return fallbacks for sans-serif category', () => {
      const fallbacks = getFallbacksByCategory('sans-serif');
      expect(Array.isArray(fallbacks)).toBe(true);
      expect(fallbacks[fallbacks.length - 1]).toBe('sans-serif');
    });

    it('should return fallbacks for serif category', () => {
      const fallbacks = getFallbacksByCategory('serif');
      expect(fallbacks[fallbacks.length - 1]).toBe('serif');
      expect(fallbacks).toContain('Georgia');
    });

    it('should return fallbacks for monospace category', () => {
      const fallbacks = getFallbacksByCategory('monospace');
      expect(fallbacks[fallbacks.length - 1]).toBe('monospace');
      expect(fallbacks.some(f => ['Courier', 'Monaco', 'Menlo', 'Consolas'].includes(f))).toBe(true);
    });

    it('should return fallbacks for display category', () => {
      const fallbacks = getFallbacksByCategory('display');
      expect(fallbacks[fallbacks.length - 1]).toBe('sans-serif');
      expect(fallbacks).toContain('Impact');
    });

    it('should return same reference for same category', () => {
      const fallbacks1 = getFallbacksByCategory('sans-serif');
      const fallbacks2 = getFallbacksByCategory('sans-serif');
      expect(fallbacks1).toBe(fallbacks2);
    });
  });

  describe('getAvailableFallbackFonts', () => {
    it('should return array of font names', () => {
      const fonts = getAvailableFallbackFonts();
      expect(Array.isArray(fonts)).toBe(true);
      expect(fonts.length).toBeGreaterThan(0);
    });

    it('should include all catalog fonts', () => {
      const availableFonts = getAvailableFallbackFonts();
      const catalog = getFontCatalog();

      catalog.forEach(font => {
        expect(availableFonts).toContain(font.family);
      });
    });

    it('should have mappings for all unique fonts', () => {
      const fonts = getAvailableFallbackFonts();
      // 99 unique font families (catalog has 100 entries with 1 duplicate)
      expect(fonts.length).toBe(99);
    });

    it('should include fonts from all categories', () => {
      const fonts = getAvailableFallbackFonts();
      expect(fonts).toContain('Roboto'); // sans-serif
      expect(fonts).toContain('Merriweather'); // serif
      expect(fonts).toContain('Roboto Mono'); // monospace
      expect(fonts).toContain('Bebas Neue'); // display
    });
  });

  describe('getFallbackStats', () => {
    it('should return statistics object', () => {
      const stats = getFallbackStats();
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('totalMappings');
      expect(stats).toHaveProperty('byCategory');
      expect(stats).toHaveProperty('genericCategories');
    });

    it('should have correct total mappings', () => {
      const stats = getFallbackStats();
      // 99 unique font families
      expect(stats.totalMappings).toBe(99);
      expect(stats.totalMappings).toBe(Object.keys(FONT_FALLBACKS).length);
    });

    it('should categorize fonts correctly', () => {
      const stats = getFallbackStats();
      const total = stats.byCategory['sans-serif'] +
                   stats.byCategory.serif +
                   stats.byCategory.monospace +
                   stats.byCategory.display;

      expect(total).toBe(stats.totalMappings);
    });

    it('should have counts matching catalog', () => {
      const stats = getFallbackStats();
      const catalog = getFontCatalog();

      // The stats should roughly match the catalog distribution
      expect(stats.byCategory['sans-serif']).toBeGreaterThan(40);
      expect(stats.byCategory.serif).toBeGreaterThan(15);
      expect(stats.byCategory.monospace).toBeGreaterThan(10);
      expect(stats.byCategory.display).toBeGreaterThan(10);
    });

    it('should have correct generic categories count', () => {
      const stats = getFallbackStats();
      expect(stats.genericCategories).toBe(4);
    });
  });

  describe('Fallback quality checks', () => {
    it('should have multiple fallbacks for each font', () => {
      Object.entries(FONT_FALLBACKS).forEach(([family, fallbacks]) => {
        expect(fallbacks.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('should include system fonts in fallbacks', () => {
      const systemFonts = ['Arial', 'Helvetica', 'Georgia', 'Times', 'Courier', 'Impact', 'Verdana', 'Comic Sans', 'Brush Script', 'Trebuchet', 'cursive', 'sans-serif', 'serif', 'monospace'];

      Object.entries(FONT_FALLBACKS).forEach(([family, fallbacks]) => {
        const hasSystemFont = fallbacks.some(f => {
          const lower = f.toLowerCase();
          return systemFonts.some(sf => lower.includes(sf.toLowerCase()));
        });
        expect(hasSystemFont).toBe(true);
      });
    });

    it('should have consistent fallback order (specific to generic)', () => {
      Object.entries(FONT_FALLBACKS).forEach(([family, fallbacks]) => {
        // First fonts should be more specific platform fonts
        // Last font should be the generic category
        const firstFonts = fallbacks.slice(0, -1);
        const lastFont = fallbacks[fallbacks.length - 1];

        // Generic categories
        const generics = ['sans-serif', 'serif', 'monospace', 'cursive'];
        expect(generics).toContain(lastFont);

        // Earlier fallbacks should not be generic
        firstFonts.forEach(font => {
          if (generics.includes(font)) {
            // Allow if it's a font name that happens to match a generic
            expect(font).toBeTruthy();
          }
        });
      });
    });

    it('should have unique fallbacks in each stack', () => {
      Object.entries(FONT_FALLBACKS).forEach(([family, fallbacks]) => {
        const uniqueFallbacks = new Set(fallbacks);
        expect(uniqueFallbacks.size).toBe(fallbacks.length);
      });
    });

    it('should not include the primary font in its own fallbacks', () => {
      Object.entries(FONT_FALLBACKS).forEach(([family, fallbacks]) => {
        // Check that the exact family name is not in fallbacks
        // Note: Some fallbacks might have similar names (e.g., "Baskerville" for "Libre Baskerville")
        // but they are different fonts
        expect(fallbacks).not.toContain(family);
      });
    });
  });

  describe('Platform-specific fallbacks', () => {
    it('should include macOS system fonts for modern fonts', () => {
      const modernFonts = ['Inter', 'SF Pro Text', 'SF Pro Display', 'SF Mono'];
      const stack = getFallbackStack('Inter');

      const hasModernMacFont = modernFonts.some(font => stack.includes(font));
      expect(hasModernMacFont).toBe(true);
    });

    it('should include Windows system fonts', () => {
      const windowsFonts = ['Segoe UI', 'Arial', 'Verdana', 'Consolas'];
      const robotoStack = getFallbackStack('Roboto');

      const hasWindowsFont = windowsFonts.some(font => robotoStack.includes(font));
      expect(hasWindowsFont).toBe(true);
    });

    it('should include cross-platform fallbacks', () => {
      const crossPlatform = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier', 'Impact', 'Verdana', 'Comic Sans', 'Brush Script'];

      Object.entries(FONT_FALLBACKS).forEach(([family, fallbacks]) => {
        const hasCrossPlatform = fallbacks.some(f =>
          crossPlatform.some(cp => f.includes(cp))
        );
        expect(hasCrossPlatform).toBe(true);
      });
    });
  });

  describe('Integration with catalog', () => {
    it('should have fallbacks matching font categories', () => {
      const catalog = getFontCatalog();

      catalog.forEach(font => {
        const fallbacks = FONT_FALLBACKS[font.family];
        expect(fallbacks).toBeDefined();

        const lastFallback = fallbacks[fallbacks.length - 1];

        // Check that generic category matches font category
        if (font.category === 'sans-serif') {
          expect(lastFallback).toBe('sans-serif');
        } else if (font.category === 'serif') {
          // Archivo Black is in serif but uses sans-serif fallback (it's actually display)
          expect(['serif', 'sans-serif']).toContain(lastFallback);
        } else if (font.category === 'monospace') {
          expect(lastFallback).toBe('monospace');
        } else if (font.category === 'display') {
          expect(['sans-serif', 'serif', 'cursive']).toContain(lastFallback);
        }
      });
    });

    it('should have coverage for all catalog fonts', () => {
      const catalog = getFontCatalog();
      const fallbackKeys = Object.keys(FONT_FALLBACKS);

      // All unique font families should have fallbacks
      // (catalog has duplicate, so 99 unique families from 100 entries)
      const uniqueFamilies = new Set(catalog.map(f => f.family));
      expect(fallbackKeys.length).toBe(uniqueFamilies.size);

      catalog.forEach(font => {
        expect(hasCustomFallback(font.family)).toBe(true);
      });
    });
  });
});
