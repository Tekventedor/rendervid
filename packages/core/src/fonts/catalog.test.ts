/**
 * Tests for font catalog
 */

import { describe, it, expect } from 'vitest';
import {
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

describe('Font Catalog', () => {
  describe('getFontCatalog', () => {
    it('should return all fonts', () => {
      const catalog = getFontCatalog();
      expect(catalog).toBeDefined();
      expect(catalog.length).toBeGreaterThan(0);
      expect(catalog.length).toBe(100);
    });

    it('should return a new array each time', () => {
      const catalog1 = getFontCatalog();
      const catalog2 = getFontCatalog();
      expect(catalog1).not.toBe(catalog2);
      expect(catalog1).toEqual(catalog2);
    });
  });

  describe('getFontsByCategory', () => {
    it('should filter sans-serif fonts', () => {
      const fonts = getFontsByCategory('sans-serif');
      expect(fonts.length).toBeGreaterThan(0);
      fonts.forEach(font => {
        expect(font.category).toBe('sans-serif');
      });
      expect(fonts.length).toBe(50);
    });

    it('should filter serif fonts', () => {
      const fonts = getFontsByCategory('serif');
      expect(fonts.length).toBeGreaterThan(0);
      fonts.forEach(font => {
        expect(font.category).toBe('serif');
      });
      expect(fonts.length).toBe(20);
    });

    it('should filter monospace fonts', () => {
      const fonts = getFontsByCategory('monospace');
      expect(fonts.length).toBeGreaterThan(0);
      fonts.forEach(font => {
        expect(font.category).toBe('monospace');
      });
      expect(fonts.length).toBe(15);
    });

    it('should filter display fonts', () => {
      const fonts = getFontsByCategory('display');
      expect(fonts.length).toBeGreaterThan(0);
      fonts.forEach(font => {
        expect(font.category).toBe('display');
      });
      expect(fonts.length).toBe(15);
    });
  });

  describe('getFontMetadata', () => {
    it('should return metadata for existing font', () => {
      const roboto = getFontMetadata('Roboto');
      expect(roboto).toBeDefined();
      expect(roboto?.family).toBe('Roboto');
      expect(roboto?.category).toBe('sans-serif');
      expect(roboto?.weights).toContain(400);
    });

    it('should return undefined for non-existent font', () => {
      const font = getFontMetadata('NonExistentFont123');
      expect(font).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const font = getFontMetadata('roboto'); // lowercase
      expect(font).toBeUndefined();
    });
  });

  describe('getPopularFonts', () => {
    it('should return top 50 fonts', () => {
      const popular = getPopularFonts();
      expect(popular.length).toBe(50);
    });

    it('should be sorted by popularity', () => {
      const popular = getPopularFonts();
      for (let i = 1; i < popular.length; i++) {
        expect(popular[i].popularity).toBeGreaterThan(popular[i - 1].popularity);
      }
    });

    it('should include Roboto as most popular', () => {
      const popular = getPopularFonts();
      expect(popular[0].family).toBe('Roboto');
      expect(popular[0].popularity).toBe(1);
    });
  });

  describe('getVariableFonts', () => {
    it('should return only variable fonts', () => {
      const fonts = getVariableFonts();
      expect(fonts.length).toBeGreaterThan(0);
      fonts.forEach(font => {
        expect(font.variable).toBe(true);
      });
    });

    it('should include Inter', () => {
      const fonts = getVariableFonts();
      const inter = fonts.find(f => f.family === 'Inter');
      expect(inter).toBeDefined();
    });
  });

  describe('searchFonts', () => {
    it('should find fonts by partial name match', () => {
      const results = searchFonts('Mono');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(font => {
        expect(font.family.toLowerCase()).toContain('mono');
      });
    });

    it('should be case-insensitive', () => {
      const results1 = searchFonts('roboto');
      const results2 = searchFonts('ROBOTO');
      const results3 = searchFonts('Roboto');
      expect(results1).toEqual(results2);
      expect(results1).toEqual(results3);
    });

    it('should return empty array for no matches', () => {
      const results = searchFonts('ZzzNonExistent999');
      expect(results).toEqual([]);
    });
  });

  describe('getFontsByWeight', () => {
    it('should find fonts with all specified weights', () => {
      const fonts = getFontsByWeight([400, 700], true);
      expect(fonts.length).toBeGreaterThan(0);
      fonts.forEach(font => {
        expect(font.weights).toContain(400);
        expect(font.weights).toContain(700);
      });
    });

    it('should find fonts with any specified weight', () => {
      const fonts = getFontsByWeight([100, 900], false);
      expect(fonts.length).toBeGreaterThan(0);
      fonts.forEach(font => {
        const hasWeight = font.weights.includes(100) || font.weights.includes(900);
        expect(hasWeight).toBe(true);
      });
    });
  });

  describe('getFontsWithItalic', () => {
    it('should return only fonts with italic support', () => {
      const fonts = getFontsWithItalic();
      expect(fonts.length).toBeGreaterThan(0);
      fonts.forEach(font => {
        expect(font.styles).toContain('italic');
      });
    });
  });

  describe('getCatalogStats', () => {
    it('should return correct statistics', () => {
      const stats = getCatalogStats();
      expect(stats.total).toBe(100);
      expect(stats.byCategory['sans-serif']).toBe(50);
      expect(stats.byCategory['serif']).toBe(20);
      expect(stats.byCategory['monospace']).toBe(15);
      expect(stats.byCategory['display']).toBe(15);
      expect(stats.variable).toBeGreaterThan(0);
      expect(stats.withItalic).toBeGreaterThan(0);
    });
  });

  describe('isFontAvailable', () => {
    it('should return true for available fonts', () => {
      expect(isFontAvailable('Roboto')).toBe(true);
      expect(isFontAvailable('Open Sans')).toBe(true);
      expect(isFontAvailable('Inter')).toBe(true);
    });

    it('should return false for non-existent fonts', () => {
      expect(isFontAvailable('NonExistentFont')).toBe(false);
    });

    it('should be case-sensitive', () => {
      expect(isFontAvailable('roboto')).toBe(false);
      expect(isFontAvailable('Roboto')).toBe(true);
    });
  });

  describe('getRandomFonts', () => {
    it('should return requested number of fonts', () => {
      const fonts = getRandomFonts(5);
      expect(fonts.length).toBe(5);
    });

    it('should return 1 font by default', () => {
      const fonts = getRandomFonts();
      expect(fonts.length).toBe(1);
    });

    it('should return different fonts on multiple calls', () => {
      const fonts1 = getRandomFonts(10);
      const fonts2 = getRandomFonts(10);
      // Should be very unlikely to get the same fonts in the same order
      const sameOrder = fonts1.every((f, i) => f.family === fonts2[i].family);
      expect(sameOrder).toBe(false);
    });
  });

  describe('Font metadata structure', () => {
    it('should have all required fields', () => {
      const font = getFontMetadata('Roboto');
      expect(font).toBeDefined();
      if (font) {
        expect(font.family).toBeDefined();
        expect(font.category).toBeDefined();
        expect(font.weights).toBeDefined();
        expect(font.styles).toBeDefined();
        expect(font.subsets).toBeDefined();
        expect(font.preview).toBeDefined();
        expect(font.variable).toBeDefined();
        expect(font.popularity).toBeDefined();
      }
    });

    it('should have valid categories', () => {
      const catalog = getFontCatalog();
      const validCategories = ['sans-serif', 'serif', 'monospace', 'display'];
      catalog.forEach(font => {
        expect(validCategories).toContain(font.category);
      });
    });

    it('should have valid styles', () => {
      const catalog = getFontCatalog();
      const validStyles = ['normal', 'italic'];
      catalog.forEach(font => {
        font.styles.forEach(style => {
          expect(validStyles).toContain(style);
        });
      });
    });

    it('should have positive weights', () => {
      const catalog = getFontCatalog();
      catalog.forEach(font => {
        expect(font.weights.length).toBeGreaterThan(0);
        font.weights.forEach(weight => {
          expect(weight).toBeGreaterThan(0);
          expect(weight).toBeLessThanOrEqual(900);
        });
      });
    });
  });
});
