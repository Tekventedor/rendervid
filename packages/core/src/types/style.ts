import type { CSSProperties } from 'react';

/**
 * Shadow preset values (Tailwind-like).
 */
export type ShadowPreset = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Blur preset values (Tailwind-like).
 */
export type BlurPreset = 'sm' | 'md' | 'lg';

/**
 * Background gradient configuration.
 */
export interface BackgroundGradient {
  /** Gradient type */
  type: 'linear' | 'radial' | 'conic';
  /** Start color */
  from: string;
  /** Middle color (optional) */
  via?: string;
  /** End color */
  to: string;
  /** Direction in degrees (for linear) */
  direction?: number;
}

/**
 * Layer style properties (Tailwind-like utilities).
 *
 * These properties are resolved to CSS at render time.
 * Use `className` for actual Tailwind classes if Tailwind is configured.
 *
 * @example
 * ```typescript
 * const style: LayerStyle = {
 *   padding: 16,
 *   borderRadius: 'lg',
 *   boxShadow: '2xl',
 *   backgroundGradient: {
 *     type: 'linear',
 *     from: '#ff0000',
 *     to: '#0000ff',
 *     direction: 45,
 *   },
 * };
 * ```
 */
export interface LayerStyle {
  // ═══════════════════════════════════════════════════════════════
  // SPACING
  // ═══════════════════════════════════════════════════════════════

  /** Padding (px or Tailwind value like 'p-4') */
  padding?: string | number;
  /** Horizontal padding */
  paddingX?: string | number;
  /** Vertical padding */
  paddingY?: string | number;
  /** Top padding */
  paddingTop?: string | number;
  /** Right padding */
  paddingRight?: string | number;
  /** Bottom padding */
  paddingBottom?: string | number;
  /** Left padding */
  paddingLeft?: string | number;
  /** Margin */
  margin?: string | number;
  /** Horizontal margin */
  marginX?: string | number;
  /** Vertical margin */
  marginY?: string | number;

  // ═══════════════════════════════════════════════════════════════
  // BORDERS
  // ═══════════════════════════════════════════════════════════════

  /** Border radius (px or preset like 'lg', 'full') */
  borderRadius?: string | number;
  /** Top-left border radius */
  borderTopLeftRadius?: string | number;
  /** Top-right border radius */
  borderTopRightRadius?: string | number;
  /** Bottom-right border radius */
  borderBottomRightRadius?: string | number;
  /** Bottom-left border radius */
  borderBottomLeftRadius?: string | number;
  /** Border width */
  borderWidth?: number;
  /** Border color */
  borderColor?: string;
  /** Border style */
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';

  // ═══════════════════════════════════════════════════════════════
  // SHADOWS
  // ═══════════════════════════════════════════════════════════════

  /** Box shadow (preset or CSS value) */
  boxShadow?: ShadowPreset | string;

  // ═══════════════════════════════════════════════════════════════
  // BACKGROUNDS
  // ═══════════════════════════════════════════════════════════════

  /** Background color */
  backgroundColor?: string;
  /** Background gradient */
  backgroundGradient?: BackgroundGradient;
  /** Background image URL */
  backgroundImage?: string;
  /** Background size */
  backgroundSize?: 'cover' | 'contain' | 'auto' | string;
  /** Background position */
  backgroundPosition?: string;
  /** Backdrop blur (preset or px) */
  backdropBlur?: BlurPreset | number;

  // ═══════════════════════════════════════════════════════════════
  // TYPOGRAPHY
  // ═══════════════════════════════════════════════════════════════

  /** Font family */
  fontFamily?: string;
  /** Font size (px or preset) */
  fontSize?: string | number;
  /** Font weight */
  fontWeight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black' | number;
  /** Line height */
  lineHeight?: string | number;
  /** Letter spacing */
  letterSpacing?: string | number;
  /** Text alignment */
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  /** Text color */
  textColor?: string;
  /** Text shadow (CSS value) */
  textShadow?: string;
  /** Text decoration */
  textDecoration?: 'none' | 'underline' | 'line-through';
  /** Text transform */
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Word break */
  wordBreak?: 'normal' | 'break-all' | 'break-word';
  /** White space handling */
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT
  // ═══════════════════════════════════════════════════════════════

  /** Display type */
  display?: 'flex' | 'grid' | 'block' | 'inline' | 'inline-flex' | 'inline-block' | 'none';
  /** Flex direction */
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Flex wrap */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Justify content */
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Align items */
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Align content */
  alignContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Gap between items */
  gap?: string | number;
  /** Row gap */
  rowGap?: string | number;
  /** Column gap */
  columnGap?: string | number;

  // ═══════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════

  /** Blur (preset or px) */
  blur?: BlurPreset | number;
  /** Brightness (0-200, 100 = normal) */
  brightness?: number;
  /** Contrast (0-200, 100 = normal) */
  contrast?: number;
  /** Grayscale (0-100) */
  grayscale?: number;
  /** Saturation (0-200, 100 = normal) */
  saturate?: number;
  /** Sepia (0-100) */
  sepia?: number;
  /** Hue rotation (0-360 degrees) */
  hueRotate?: number;
  /** Invert (0-100) */
  invert?: number;

  // ═══════════════════════════════════════════════════════════════
  // OVERFLOW
  // ═══════════════════════════════════════════════════════════════

  /** Overflow behavior */
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  /** Horizontal overflow */
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  /** Vertical overflow */
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';

  // ═══════════════════════════════════════════════════════════════
  // RAW CSS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Pass-through raw CSS properties.
   * Use for properties not covered by LayerStyle.
   */
  css?: CSSProperties;
}

/**
 * Resolved style ready for rendering.
 */
export interface ResolvedStyle {
  /** Tailwind class names (if using Tailwind) */
  className: string;
  /** Inline CSS properties */
  style: CSSProperties;
}
