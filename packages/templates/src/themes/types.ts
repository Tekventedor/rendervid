/**
 * Color palette for a theme
 */
export interface ThemeColors {
  /** Primary brand color */
  primary: string;
  /** Secondary accent color */
  secondary: string;
  /** Background color */
  background: string;
  /** Surface/card background */
  surface: string;
  /** Primary text color */
  text: string;
  /** Secondary/muted text color */
  textMuted: string;
  /** Success/positive color */
  success: string;
  /** Warning color */
  warning: string;
  /** Error/danger color */
  error: string;
  /** Gradient colors array */
  gradient: string[];
}

/**
 * Typography settings
 */
export interface ThemeTypography {
  /** Primary font family */
  fontFamily: string;
  /** Heading font family */
  headingFamily: string;
  /** Monospace font family */
  monoFamily: string;
  /** Base font size */
  baseFontSize: number;
  /** Font sizes scale */
  sizes: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
  };
  /** Font weights */
  weights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
}

/**
 * Spacing scale
 */
export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

/**
 * Animation timing settings
 */
export interface ThemeAnimation {
  /** Default duration in frames */
  duration: number;
  /** Fast animation duration */
  fast: number;
  /** Slow animation duration */
  slow: number;
  /** Stagger delay between items */
  stagger: number;
  /** Default easing */
  easing: string;
}

/**
 * Complete theme definition
 */
export interface Theme {
  /** Theme name */
  name: string;
  /** Theme description */
  description: string;
  /** Color palette */
  colors: ThemeColors;
  /** Typography settings */
  typography: ThemeTypography;
  /** Spacing scale */
  spacing: ThemeSpacing;
  /** Border radius values */
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: string;
  };
  /** Shadow presets */
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  /** Animation settings */
  animation: ThemeAnimation;
}

/**
 * Theme preset names
 */
export type ThemePreset =
  | 'modern'
  | 'minimal'
  | 'bold'
  | 'elegant'
  | 'tech'
  | 'nature'
  | 'sunset'
  | 'ocean'
  | 'dark'
  | 'light';
