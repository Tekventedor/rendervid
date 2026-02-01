import { describe, it, expect } from 'vitest';
import {
  themes,
  getTheme,
  modernTheme,
  minimalTheme,
  boldTheme,
  elegantTheme,
  techTheme,
  natureTheme,
  sunsetTheme,
  oceanTheme,
  darkTheme,
  lightTheme,
} from '../themes';
import type { Theme } from '../themes';

describe('Themes', () => {
  describe('themes registry', () => {
    it('should have 10 themes', () => {
      expect(Object.keys(themes)).toHaveLength(10);
    });

    it('should include all expected themes', () => {
      const themeNames = Object.keys(themes);
      expect(themeNames).toContain('modern');
      expect(themeNames).toContain('minimal');
      expect(themeNames).toContain('bold');
      expect(themeNames).toContain('elegant');
      expect(themeNames).toContain('tech');
      expect(themeNames).toContain('nature');
      expect(themeNames).toContain('sunset');
      expect(themeNames).toContain('ocean');
      expect(themeNames).toContain('dark');
      expect(themeNames).toContain('light');
    });
  });

  describe('getTheme', () => {
    it('should return a theme by name', () => {
      const theme = getTheme('modern');
      expect(theme).toBeDefined();
      expect(theme.name).toBe('Modern');
    });

    it('should return different themes by name', () => {
      expect(getTheme('bold').name).toBe('Bold');
      expect(getTheme('elegant').name).toBe('Elegant');
      expect(getTheme('tech').name).toBe('Tech');
    });
  });

  describe('Theme structure', () => {
    const allThemes: Theme[] = [
      modernTheme,
      minimalTheme,
      boldTheme,
      elegantTheme,
      techTheme,
      natureTheme,
      sunsetTheme,
      oceanTheme,
      darkTheme,
      lightTheme,
    ];

    allThemes.forEach((theme) => {
      describe(`${theme.name} theme`, () => {
        it('should have required properties', () => {
          expect(theme.name).toBeDefined();
          expect(theme.description).toBeDefined();
          expect(theme.colors).toBeDefined();
          expect(theme.typography).toBeDefined();
          expect(theme.spacing).toBeDefined();
          expect(theme.borderRadius).toBeDefined();
          expect(theme.shadows).toBeDefined();
          expect(theme.animation).toBeDefined();
        });

        it('should have valid colors', () => {
          expect(theme.colors.primary).toBeDefined();
          expect(theme.colors.secondary).toBeDefined();
          expect(theme.colors.background).toBeDefined();
          expect(theme.colors.surface).toBeDefined();
          expect(theme.colors.text).toBeDefined();
          expect(theme.colors.textMuted).toBeDefined();
          expect(theme.colors.success).toBeDefined();
          expect(theme.colors.warning).toBeDefined();
          expect(theme.colors.error).toBeDefined();
          expect(theme.colors.gradient).toBeDefined();
          expect(Array.isArray(theme.colors.gradient)).toBe(true);
        });

        it('should have valid typography', () => {
          expect(theme.typography.fontFamily).toBeDefined();
          expect(theme.typography.headingFamily).toBeDefined();
          expect(theme.typography.monoFamily).toBeDefined();
          expect(theme.typography.baseFontSize).toBeGreaterThan(0);
          expect(theme.typography.sizes).toBeDefined();
          expect(theme.typography.weights).toBeDefined();
        });

        it('should have valid spacing', () => {
          expect(theme.spacing.xs).toBeGreaterThan(0);
          expect(theme.spacing.sm).toBeGreaterThan(0);
          expect(theme.spacing.md).toBeGreaterThan(0);
          expect(theme.spacing.lg).toBeGreaterThan(0);
          expect(theme.spacing.xl).toBeGreaterThan(0);
          expect(theme.spacing['2xl']).toBeGreaterThan(0);
          expect(theme.spacing['3xl']).toBeGreaterThan(0);
        });

        it('should have valid animation settings', () => {
          expect(theme.animation.duration).toBeGreaterThan(0);
          expect(theme.animation.fast).toBeGreaterThan(0);
          expect(theme.animation.slow).toBeGreaterThan(0);
          expect(theme.animation.stagger).toBeGreaterThan(0);
          expect(theme.animation.easing).toBeDefined();
        });

        it('should have valid border radius', () => {
          expect(theme.borderRadius.none).toBe(0);
          expect(theme.borderRadius.sm).toBeGreaterThanOrEqual(0);
          expect(theme.borderRadius.md).toBeGreaterThan(0);
          expect(theme.borderRadius.lg).toBeGreaterThan(0);
          expect(theme.borderRadius.xl).toBeGreaterThan(0);
          expect(theme.borderRadius.full).toBeDefined();
        });

        it('should have valid shadows', () => {
          expect(theme.shadows.sm).toBeDefined();
          expect(theme.shadows.md).toBeDefined();
          expect(theme.shadows.lg).toBeDefined();
          expect(theme.shadows.xl).toBeDefined();
        });
      });
    });
  });

  describe('Theme color formats', () => {
    it('should have valid hex color codes', () => {
      const hexPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

      Object.values(themes).forEach((theme) => {
        expect(theme.colors.primary).toMatch(hexPattern);
        expect(theme.colors.background).toMatch(hexPattern);
        expect(theme.colors.text).toMatch(hexPattern);
      });
    });
  });

  describe('Theme typography sizes', () => {
    it('should have increasing font sizes', () => {
      Object.values(themes).forEach((theme) => {
        const { sizes } = theme.typography;
        expect(sizes.xs).toBeLessThan(sizes.sm);
        expect(sizes.sm).toBeLessThan(sizes.base);
        expect(sizes.base).toBeLessThan(sizes.lg);
        expect(sizes.lg).toBeLessThan(sizes.xl);
        expect(sizes.xl).toBeLessThan(sizes['2xl']);
        expect(sizes['2xl']).toBeLessThan(sizes['3xl']);
        expect(sizes['3xl']).toBeLessThan(sizes['4xl']);
        expect(sizes['4xl']).toBeLessThan(sizes['5xl']);
      });
    });
  });

  describe('Theme animation timing', () => {
    it('should have fast < duration < slow', () => {
      Object.values(themes).forEach((theme) => {
        expect(theme.animation.fast).toBeLessThan(theme.animation.duration);
        expect(theme.animation.duration).toBeLessThan(theme.animation.slow);
      });
    });
  });
});
