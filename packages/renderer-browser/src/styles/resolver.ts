import type { CSSProperties } from 'react';
import type { LayerStyle, ResolvedStyle, ShadowPreset, BlurPreset, BackgroundGradient } from '@rendervid/core';

/**
 * Shadow preset values.
 */
const shadowPresets: Record<ShadowPreset, string> = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};

/**
 * Blur preset values in pixels.
 */
const blurPresets: Record<BlurPreset, number> = {
  sm: 4,
  md: 12,
  lg: 24,
};

/**
 * Border radius preset values.
 */
const borderRadiusPresets: Record<string, string> = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

/**
 * Font weight presets.
 */
const fontWeightPresets: Record<string, number> = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

/**
 * Convert a gradient configuration to CSS.
 */
function gradientToCSS(gradient: BackgroundGradient): string {
  const { type, from, via, to, direction = 180 } = gradient;

  const colors = via ? `${from}, ${via}, ${to}` : `${from}, ${to}`;

  switch (type) {
    case 'linear':
      return `linear-gradient(${direction}deg, ${colors})`;
    case 'radial':
      return `radial-gradient(circle, ${colors})`;
    case 'conic':
      return `conic-gradient(from ${direction}deg, ${colors})`;
    default:
      return `linear-gradient(${direction}deg, ${colors})`;
  }
}

/**
 * Resolve spacing value (number in px or string as-is).
 */
function resolveSpacing(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return value;
}

/**
 * Resolve border radius value.
 */
function resolveBorderRadius(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  if (value in borderRadiusPresets) return borderRadiusPresets[value];
  return value;
}

/**
 * Resolve font weight value.
 */
function resolveFontWeight(value: string | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  if (value in fontWeightPresets) return fontWeightPresets[value];
  return 400;
}

/**
 * Resolve blur value.
 */
function resolveBlur(value: BlurPreset | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return blurPresets[value] ?? 0;
}

/**
 * Resolve box shadow value.
 */
function resolveBoxShadow(value: ShadowPreset | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (value in shadowPresets) return shadowPresets[value as ShadowPreset];
  return value;
}

/**
 * Map justify content values.
 */
function mapJustifyContent(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const map: Record<string, string> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  };
  return map[value] || value;
}

/**
 * Map align items values.
 */
function mapAlignItems(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const map: Record<string, string> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    stretch: 'stretch',
    baseline: 'baseline',
  };
  return map[value] || value;
}

/**
 * Build CSS filter string from style properties.
 */
function buildFilter(style: LayerStyle): string | undefined {
  const filters: string[] = [];

  if (style.blur !== undefined) {
    const blurValue = resolveBlur(style.blur as BlurPreset | number);
    if (blurValue) filters.push(`blur(${blurValue}px)`);
  }
  if (style.brightness !== undefined) {
    filters.push(`brightness(${style.brightness / 100})`);
  }
  if (style.contrast !== undefined) {
    filters.push(`contrast(${style.contrast / 100})`);
  }
  if (style.grayscale !== undefined) {
    filters.push(`grayscale(${style.grayscale}%)`);
  }
  if (style.saturate !== undefined) {
    filters.push(`saturate(${style.saturate / 100})`);
  }
  if (style.sepia !== undefined) {
    filters.push(`sepia(${style.sepia}%)`);
  }
  if (style.hueRotate !== undefined) {
    filters.push(`hue-rotate(${style.hueRotate}deg)`);
  }
  if (style.invert !== undefined) {
    filters.push(`invert(${style.invert}%)`);
  }

  return filters.length > 0 ? filters.join(' ') : undefined;
}

/**
 * Resolve LayerStyle to CSSProperties.
 */
export function resolveStyle(style: LayerStyle): CSSProperties {
  const css: CSSProperties = {};

  // Spacing
  if (style.padding !== undefined) css.padding = resolveSpacing(style.padding);
  if (style.paddingX !== undefined) {
    css.paddingLeft = resolveSpacing(style.paddingX);
    css.paddingRight = resolveSpacing(style.paddingX);
  }
  if (style.paddingY !== undefined) {
    css.paddingTop = resolveSpacing(style.paddingY);
    css.paddingBottom = resolveSpacing(style.paddingY);
  }
  if (style.paddingTop !== undefined) css.paddingTop = resolveSpacing(style.paddingTop);
  if (style.paddingRight !== undefined) css.paddingRight = resolveSpacing(style.paddingRight);
  if (style.paddingBottom !== undefined) css.paddingBottom = resolveSpacing(style.paddingBottom);
  if (style.paddingLeft !== undefined) css.paddingLeft = resolveSpacing(style.paddingLeft);
  if (style.margin !== undefined) css.margin = resolveSpacing(style.margin);
  if (style.marginX !== undefined) {
    css.marginLeft = resolveSpacing(style.marginX);
    css.marginRight = resolveSpacing(style.marginX);
  }
  if (style.marginY !== undefined) {
    css.marginTop = resolveSpacing(style.marginY);
    css.marginBottom = resolveSpacing(style.marginY);
  }

  // Borders
  if (style.borderRadius !== undefined) css.borderRadius = resolveBorderRadius(style.borderRadius);
  if (style.borderTopLeftRadius !== undefined) css.borderTopLeftRadius = resolveBorderRadius(style.borderTopLeftRadius);
  if (style.borderTopRightRadius !== undefined) css.borderTopRightRadius = resolveBorderRadius(style.borderTopRightRadius);
  if (style.borderBottomRightRadius !== undefined) css.borderBottomRightRadius = resolveBorderRadius(style.borderBottomRightRadius);
  if (style.borderBottomLeftRadius !== undefined) css.borderBottomLeftRadius = resolveBorderRadius(style.borderBottomLeftRadius);
  if (style.borderWidth !== undefined) css.borderWidth = style.borderWidth;
  if (style.borderColor !== undefined) css.borderColor = style.borderColor;
  if (style.borderStyle !== undefined) css.borderStyle = style.borderStyle;

  // Shadows
  if (style.boxShadow !== undefined) css.boxShadow = resolveBoxShadow(style.boxShadow);

  // Backgrounds
  if (style.backgroundColor !== undefined) css.backgroundColor = style.backgroundColor;
  if (style.backgroundGradient !== undefined) {
    css.backgroundImage = gradientToCSS(style.backgroundGradient);
  }
  if (style.backgroundImage !== undefined) {
    css.backgroundImage = `url(${style.backgroundImage})`;
  }
  if (style.backgroundSize !== undefined) css.backgroundSize = style.backgroundSize;
  if (style.backgroundPosition !== undefined) css.backgroundPosition = style.backgroundPosition;
  if (style.backdropBlur !== undefined) {
    const blurValue = resolveBlur(style.backdropBlur as BlurPreset | number);
    if (blurValue) css.backdropFilter = `blur(${blurValue}px)`;
  }

  // Typography
  if (style.fontFamily !== undefined) css.fontFamily = style.fontFamily;
  if (style.fontSize !== undefined) css.fontSize = resolveSpacing(style.fontSize);
  if (style.fontWeight !== undefined) css.fontWeight = resolveFontWeight(style.fontWeight);
  if (style.lineHeight !== undefined) css.lineHeight = style.lineHeight;
  if (style.letterSpacing !== undefined) css.letterSpacing = resolveSpacing(style.letterSpacing);
  if (style.textAlign !== undefined) css.textAlign = style.textAlign;
  if (style.textColor !== undefined) css.color = style.textColor;
  if (style.textShadow !== undefined) css.textShadow = style.textShadow;
  if (style.textDecoration !== undefined) css.textDecoration = style.textDecoration;
  if (style.textTransform !== undefined) css.textTransform = style.textTransform;
  if (style.wordBreak !== undefined) css.wordBreak = style.wordBreak;
  if (style.whiteSpace !== undefined) css.whiteSpace = style.whiteSpace;

  // Layout
  if (style.display !== undefined) css.display = style.display;
  if (style.flexDirection !== undefined) css.flexDirection = style.flexDirection;
  if (style.flexWrap !== undefined) css.flexWrap = style.flexWrap;
  if (style.justifyContent !== undefined) css.justifyContent = mapJustifyContent(style.justifyContent);
  if (style.alignItems !== undefined) css.alignItems = mapAlignItems(style.alignItems);
  if (style.alignContent !== undefined) css.alignContent = mapAlignItems(style.alignContent);
  if (style.gap !== undefined) css.gap = resolveSpacing(style.gap);
  if (style.rowGap !== undefined) css.rowGap = resolveSpacing(style.rowGap);
  if (style.columnGap !== undefined) css.columnGap = resolveSpacing(style.columnGap);

  // Effects (filter)
  const filter = buildFilter(style);
  if (filter) css.filter = filter;

  // Overflow
  if (style.overflow !== undefined) css.overflow = style.overflow;
  if (style.overflowX !== undefined) css.overflowX = style.overflowX;
  if (style.overflowY !== undefined) css.overflowY = style.overflowY;

  // Raw CSS pass-through
  if (style.css) {
    Object.assign(css, style.css);
  }

  return css;
}

/**
 * Merge className with resolved LayerStyle.
 */
export function mergeStyles(
  className?: string,
  style?: LayerStyle
): ResolvedStyle {
  return {
    className: className || '',
    style: style ? resolveStyle(style) : {},
  };
}

/**
 * Get the style class name (for external CSS class support).
 * This is a pass-through for now, but could be extended to support
 * utility class transformations (e.g., Tailwind-to-CSS).
 */
export function getStyleClassName(className: string): string {
  return className;
}

export type { ResolvedStyle } from '@rendervid/core';
