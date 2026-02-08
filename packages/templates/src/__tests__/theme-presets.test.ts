/**
 * Detailed Theme Presets Tests
 *
 * In-depth validation of each theme preset's color palette,
 * typography, spacing, animation, and consistency requirements.
 */

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
import type { Theme, ThemePreset } from '../themes';

const hexPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
const rgbaPattern = /^rgba?\(/;

function isValidColor(color: string): boolean {
  return hexPattern.test(color) || rgbaPattern.test(color) || color === 'transparent';
}

describe('Theme Presets - Detailed Validation', () => {
  describe('modernTheme', () => {
    it('should have correct name and description', () => {
      expect(modernTheme.name).toBe('Modern');
      expect(modernTheme.description).toContain('Clean');
    });

    it('should use Inter font family', () => {
      expect(modernTheme.typography.fontFamily).toContain('Inter');
    });

    it('should have blue primary color', () => {
      expect(modernTheme.colors.primary).toBe('#3B82F6');
    });

    it('should use easeInOutCubic easing', () => {
      expect(modernTheme.animation.easing).toBe('easeInOutCubic');
    });

    it('should have a dark background', () => {
      expect(modernTheme.colors.background).toBe('#0F172A');
    });

    it('should have gradient with primary and secondary', () => {
      expect(modernTheme.colors.gradient).toContain('#3B82F6');
      expect(modernTheme.colors.gradient).toContain('#8B5CF6');
    });
  });

  describe('minimalTheme', () => {
    it('should have correct name', () => {
      expect(minimalTheme.name).toBe('Minimal');
    });

    it('should use light background', () => {
      expect(minimalTheme.colors.background).toBe('#FFFFFF');
    });

    it('should use dark text', () => {
      expect(minimalTheme.colors.text).toBe('#18181B');
    });

    it('should have smaller border radii', () => {
      expect(minimalTheme.borderRadius.sm).toBeLessThanOrEqual(modernTheme.borderRadius.sm);
    });

    it('should use faster animation timing', () => {
      expect(minimalTheme.animation.duration).toBeLessThan(modernTheme.animation.duration);
    });

    it('should use easeOut easing for simpler feel', () => {
      expect(minimalTheme.animation.easing).toBe('easeOut');
    });
  });

  describe('boldTheme', () => {
    it('should have correct name', () => {
      expect(boldTheme.name).toBe('Bold');
    });

    it('should use vibrant primary color', () => {
      expect(boldTheme.colors.primary).toBe('#FF3366');
    });

    it('should use larger font sizes', () => {
      expect(boldTheme.typography.baseFontSize).toBeGreaterThanOrEqual(modernTheme.typography.baseFontSize);
    });

    it('should use easeOutBack for dramatic animations', () => {
      expect(boldTheme.animation.easing).toBe('easeOutBack');
    });

    it('should have colored shadows', () => {
      expect(boldTheme.shadows.sm).toContain('rgba(255,51,102');
    });

    it('should have 3-color gradient', () => {
      expect(boldTheme.colors.gradient.length).toBe(3);
    });

    it('should use Bebas Neue for headings', () => {
      expect(boldTheme.typography.headingFamily).toContain('Bebas Neue');
    });

    it('should have faster animation duration', () => {
      expect(boldTheme.animation.duration).toBeLessThan(modernTheme.animation.duration);
    });
  });

  describe('elegantTheme', () => {
    it('should have correct name', () => {
      expect(elegantTheme.name).toBe('Elegant');
    });

    it('should use gold-like primary color', () => {
      expect(elegantTheme.colors.primary).toBe('#C9A962');
    });

    it('should use serif fonts', () => {
      expect(elegantTheme.typography.fontFamily).toContain('Garamond');
      expect(elegantTheme.typography.headingFamily).toContain('Playfair');
    });

    it('should have wider spacing', () => {
      expect(elegantTheme.spacing.sm).toBeGreaterThanOrEqual(modernTheme.spacing.sm);
    });

    it('should have slower animations', () => {
      expect(elegantTheme.animation.duration).toBeGreaterThan(modernTheme.animation.duration);
    });

    it('should use easeInOutQuad easing', () => {
      expect(elegantTheme.animation.easing).toBe('easeInOutQuad');
    });

    it('should have larger stagger delay', () => {
      expect(elegantTheme.animation.stagger).toBeGreaterThan(modernTheme.animation.stagger);
    });
  });

  describe('techTheme', () => {
    it('should have correct name', () => {
      expect(techTheme.name).toBe('Tech');
    });

    it('should use cyan-like primary color', () => {
      expect(techTheme.colors.primary).toBe('#00D4FF');
    });

    it('should use Space Grotesk font', () => {
      expect(techTheme.typography.fontFamily).toContain('Space Grotesk');
    });

    it('should use Orbitron for headings', () => {
      expect(techTheme.typography.headingFamily).toContain('Orbitron');
    });

    it('should have glowing shadows', () => {
      expect(techTheme.shadows.sm).toContain('rgba(0,212,255');
    });

    it('should use easeOutExpo easing', () => {
      expect(techTheme.animation.easing).toBe('easeOutExpo');
    });

    it('should have 3-color gradient', () => {
      expect(techTheme.colors.gradient.length).toBe(3);
    });
  });

  describe('natureTheme', () => {
    it('should have correct name', () => {
      expect(natureTheme.name).toBe('Nature');
    });

    it('should use green primary color', () => {
      expect(natureTheme.colors.primary).toBe('#22C55E');
    });

    it('should use light green background', () => {
      expect(natureTheme.colors.background).toBe('#F0FDF4');
    });

    it('should have larger border radii for organic feel', () => {
      expect(natureTheme.borderRadius.sm).toBeGreaterThan(modernTheme.borderRadius.sm);
    });

    it('should use easeInOutSine easing', () => {
      expect(natureTheme.animation.easing).toBe('easeInOutSine');
    });
  });

  describe('sunsetTheme', () => {
    it('should have correct name', () => {
      expect(sunsetTheme.name).toBe('Sunset');
    });

    it('should use orange primary color', () => {
      expect(sunsetTheme.colors.primary).toBe('#F97316');
    });

    it('should use warm pink secondary', () => {
      expect(sunsetTheme.colors.secondary).toBe('#EC4899');
    });

    it('should have 3-color gradient', () => {
      expect(sunsetTheme.colors.gradient.length).toBe(3);
    });

    it('should use easeOutQuart easing', () => {
      expect(sunsetTheme.animation.easing).toBe('easeOutQuart');
    });
  });

  describe('oceanTheme', () => {
    it('should have correct name', () => {
      expect(oceanTheme.name).toBe('Ocean');
    });

    it('should use blue primary color', () => {
      expect(oceanTheme.colors.primary).toBe('#0EA5E9');
    });

    it('should have dark blue background', () => {
      expect(oceanTheme.colors.background).toBe('#0C1929');
    });

    it('should have blue-tinted shadows', () => {
      expect(oceanTheme.shadows.md).toContain('rgba(14,165,233');
    });

    it('should use easeInOutQuad easing', () => {
      expect(oceanTheme.animation.easing).toBe('easeInOutQuad');
    });
  });

  describe('darkTheme', () => {
    it('should have correct name', () => {
      expect(darkTheme.name).toBe('Dark');
    });

    it('should have very dark background', () => {
      expect(darkTheme.colors.background).toBe('#09090B');
    });

    it('should have light text', () => {
      expect(darkTheme.colors.text).toBe('#FAFAFA');
    });

    it('should use Inter font (same as modern)', () => {
      expect(darkTheme.typography.fontFamily).toContain('Inter');
    });

    it('should have dark shadows', () => {
      expect(darkTheme.shadows.sm).toContain('rgba(0,0,0');
    });
  });

  describe('lightTheme', () => {
    it('should have correct name', () => {
      expect(lightTheme.name).toBe('Light');
    });

    it('should have white background', () => {
      expect(lightTheme.colors.background).toBe('#FFFFFF');
    });

    it('should have dark text', () => {
      expect(lightTheme.colors.text).toBe('#09090B');
    });

    it('should use Inter font (same as modern)', () => {
      expect(lightTheme.typography.fontFamily).toContain('Inter');
    });

    it('should have subtle shadows', () => {
      expect(lightTheme.shadows.xl).toContain('0.15');
    });
  });
});

describe('Theme Presets - Cross-validation', () => {
  const allThemes = Object.entries(themes);

  describe('Color system consistency', () => {
    allThemes.forEach(([name, theme]) => {
      it(`${name}: should have valid hex colors for core palette`, () => {
        expect(theme.colors.primary).toMatch(hexPattern);
        expect(theme.colors.secondary).toMatch(hexPattern);
        expect(theme.colors.background).toMatch(hexPattern);
        expect(theme.colors.surface).toMatch(hexPattern);
        expect(theme.colors.text).toMatch(hexPattern);
        expect(theme.colors.textMuted).toMatch(hexPattern);
        expect(theme.colors.success).toMatch(hexPattern);
        expect(theme.colors.warning).toMatch(hexPattern);
        expect(theme.colors.error).toMatch(hexPattern);
      });

      it(`${name}: should have at least 2 gradient colors`, () => {
        expect(theme.colors.gradient.length).toBeGreaterThanOrEqual(2);
      });

      it(`${name}: gradient should include primary color`, () => {
        expect(theme.colors.gradient).toContain(theme.colors.primary);
      });
    });
  });

  describe('Typography consistency', () => {
    allThemes.forEach(([name, theme]) => {
      it(`${name}: should have all required font sizes`, () => {
        const sizes = theme.typography.sizes;
        expect(sizes.xs).toBeDefined();
        expect(sizes.sm).toBeDefined();
        expect(sizes.base).toBeDefined();
        expect(sizes.lg).toBeDefined();
        expect(sizes.xl).toBeDefined();
        expect(sizes['2xl']).toBeDefined();
        expect(sizes['3xl']).toBeDefined();
        expect(sizes['4xl']).toBeDefined();
        expect(sizes['5xl']).toBeDefined();
      });

      it(`${name}: should have increasing font sizes`, () => {
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

      it(`${name}: should have all required font weights`, () => {
        const { weights } = theme.typography;
        expect(weights.light).toBeDefined();
        expect(weights.normal).toBeDefined();
        expect(weights.medium).toBeDefined();
        expect(weights.semibold).toBeDefined();
        expect(weights.bold).toBeDefined();
        expect(weights.extrabold).toBeDefined();
      });

      it(`${name}: should have increasing font weights`, () => {
        const { weights } = theme.typography;
        expect(weights.light).toBeLessThan(weights.normal);
        expect(weights.normal).toBeLessThan(weights.medium);
        expect(weights.medium).toBeLessThan(weights.semibold);
        expect(weights.semibold).toBeLessThan(weights.bold);
        expect(weights.bold).toBeLessThan(weights.extrabold);
      });

      it(`${name}: base font size should be reasonable (14-20)`, () => {
        expect(theme.typography.baseFontSize).toBeGreaterThanOrEqual(14);
        expect(theme.typography.baseFontSize).toBeLessThanOrEqual(20);
      });
    });
  });

  describe('Spacing consistency', () => {
    allThemes.forEach(([name, theme]) => {
      it(`${name}: should have increasing spacing values`, () => {
        const { spacing } = theme;
        expect(spacing.xs).toBeLessThan(spacing.sm);
        expect(spacing.sm).toBeLessThan(spacing.md);
        expect(spacing.md).toBeLessThan(spacing.lg);
        expect(spacing.lg).toBeLessThan(spacing.xl);
        expect(spacing.xl).toBeLessThan(spacing['2xl']);
        expect(spacing['2xl']).toBeLessThan(spacing['3xl']);
      });
    });
  });

  describe('Border radius consistency', () => {
    allThemes.forEach(([name, theme]) => {
      it(`${name}: none should be 0`, () => {
        expect(theme.borderRadius.none).toBe(0);
      });

      it(`${name}: full should be 9999px`, () => {
        expect(theme.borderRadius.full).toBe('9999px');
      });

      it(`${name}: should have increasing radius values`, () => {
        expect(theme.borderRadius.sm).toBeLessThanOrEqual(theme.borderRadius.md);
        expect(theme.borderRadius.md).toBeLessThanOrEqual(theme.borderRadius.lg);
        expect(theme.borderRadius.lg).toBeLessThanOrEqual(theme.borderRadius.xl);
      });
    });
  });

  describe('Animation timing consistency', () => {
    allThemes.forEach(([name, theme]) => {
      it(`${name}: should have fast < duration < slow`, () => {
        expect(theme.animation.fast).toBeLessThan(theme.animation.duration);
        expect(theme.animation.duration).toBeLessThan(theme.animation.slow);
      });

      it(`${name}: fast should be approximately half of duration`, () => {
        const ratio = theme.animation.fast / theme.animation.duration;
        expect(ratio).toBeGreaterThanOrEqual(0.3);
        expect(ratio).toBeLessThanOrEqual(0.7);
      });

      it(`${name}: slow should be approximately double duration`, () => {
        const ratio = theme.animation.slow / theme.animation.duration;
        expect(ratio).toBeGreaterThanOrEqual(1.5);
        expect(ratio).toBeLessThanOrEqual(3);
      });

      it(`${name}: stagger should be positive`, () => {
        expect(theme.animation.stagger).toBeGreaterThan(0);
      });

      it(`${name}: easing should be a non-empty string`, () => {
        expect(theme.animation.easing.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Shadow consistency', () => {
    allThemes.forEach(([name, theme]) => {
      it(`${name}: should have all shadow sizes defined as non-empty strings`, () => {
        expect(theme.shadows.sm.length).toBeGreaterThan(0);
        expect(theme.shadows.md.length).toBeGreaterThan(0);
        expect(theme.shadows.lg.length).toBeGreaterThan(0);
        expect(theme.shadows.xl.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('getTheme function', () => {
  it('should return correct theme for each preset name', () => {
    const presetNames: ThemePreset[] = [
      'modern', 'minimal', 'bold', 'elegant', 'tech',
      'nature', 'sunset', 'ocean', 'dark', 'light',
    ];

    presetNames.forEach((name) => {
      const theme = getTheme(name);
      expect(theme).toBeDefined();
      expect(theme.name.length).toBeGreaterThan(0);
    });
  });

  it('should return the same instance as the exported constant', () => {
    expect(getTheme('modern')).toBe(modernTheme);
    expect(getTheme('minimal')).toBe(minimalTheme);
    expect(getTheme('bold')).toBe(boldTheme);
    expect(getTheme('elegant')).toBe(elegantTheme);
    expect(getTheme('tech')).toBe(techTheme);
    expect(getTheme('nature')).toBe(natureTheme);
    expect(getTheme('sunset')).toBe(sunsetTheme);
    expect(getTheme('ocean')).toBe(oceanTheme);
    expect(getTheme('dark')).toBe(darkTheme);
    expect(getTheme('light')).toBe(lightTheme);
  });
});

describe('themes registry', () => {
  it('should contain exactly 10 themes', () => {
    expect(Object.keys(themes)).toHaveLength(10);
  });

  it('should be a const object (frozen-like)', () => {
    // The themes object is declared as `const`, verifying it has the expected keys
    const keys = Object.keys(themes);
    expect(keys).toEqual([
      'modern', 'minimal', 'bold', 'elegant', 'tech',
      'nature', 'sunset', 'ocean', 'dark', 'light',
    ]);
  });

  it('should have unique theme names', () => {
    const names = Object.values(themes).map((t) => t.name);
    const uniqueNames = [...new Set(names)];
    expect(names.length).toBe(uniqueNames.length);
  });

  it('should have unique descriptions', () => {
    const descriptions = Object.values(themes).map((t) => t.description);
    const uniqueDescs = [...new Set(descriptions)];
    expect(descriptions.length).toBe(uniqueDescs.length);
  });

  it('should have unique primary colors', () => {
    const primaries = Object.values(themes).map((t) => t.colors.primary);
    const uniquePrimaries = [...new Set(primaries)];
    expect(primaries.length).toBe(uniquePrimaries.length);
  });
});

describe('Dark vs Light theme contrast', () => {
  it('dark theme should have lighter text than background', () => {
    // Dark background + light text
    const bg = parseInt(darkTheme.colors.background.slice(1), 16);
    const text = parseInt(darkTheme.colors.text.slice(1), 16);
    expect(text).toBeGreaterThan(bg);
  });

  it('light theme should have darker text than background', () => {
    // Light background + dark text
    const bg = parseInt(lightTheme.colors.background.slice(1), 16);
    const text = parseInt(lightTheme.colors.text.slice(1), 16);
    expect(text).toBeLessThan(bg);
  });
});
