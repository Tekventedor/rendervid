import type { Theme } from './types';

/**
 * Modern theme - Clean, professional, versatile
 */
export const modernTheme: Theme = {
  name: 'Modern',
  description: 'Clean and professional design for business content',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient: ['#3B82F6', '#8B5CF6'],
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
    monoFamily: 'JetBrains Mono, monospace',
    baseFontSize: 16,
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 },
  borderRadius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: '9999px' },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.15)',
  },
  animation: { duration: 30, fast: 15, slow: 60, stagger: 5, easing: 'easeInOutCubic' },
};

/**
 * Minimal theme - Simple, clean, focused
 */
export const minimalTheme: Theme = {
  name: 'Minimal',
  description: 'Simple and clean design with focus on content',
  colors: {
    primary: '#18181B',
    secondary: '#71717A',
    background: '#FFFFFF',
    surface: '#F4F4F5',
    text: '#18181B',
    textMuted: '#71717A',
    success: '#16A34A',
    warning: '#CA8A04',
    error: '#DC2626',
    gradient: ['#18181B', '#3F3F46'],
  },
  typography: {
    fontFamily: 'SF Pro Display, system-ui, sans-serif',
    headingFamily: 'SF Pro Display, system-ui, sans-serif',
    monoFamily: 'SF Mono, monospace',
    baseFontSize: 16,
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 },
  borderRadius: { none: 0, sm: 2, md: 4, lg: 8, xl: 12, full: '9999px' },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.03)',
    md: '0 2px 4px rgba(0,0,0,0.05)',
    lg: '0 4px 8px rgba(0,0,0,0.08)',
    xl: '0 8px 16px rgba(0,0,0,0.1)',
  },
  animation: { duration: 24, fast: 12, slow: 48, stagger: 4, easing: 'easeOut' },
};

/**
 * Bold theme - High impact, energetic
 */
export const boldTheme: Theme = {
  name: 'Bold',
  description: 'High-energy design for impactful content',
  colors: {
    primary: '#FF3366',
    secondary: '#FFCC00',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textMuted: '#888888',
    success: '#00FF88',
    warning: '#FFCC00',
    error: '#FF3366',
    gradient: ['#FF3366', '#FFCC00', '#00FF88'],
  },
  typography: {
    fontFamily: 'Poppins, system-ui, sans-serif',
    headingFamily: 'Bebas Neue, Impact, sans-serif',
    monoFamily: 'Fira Code, monospace',
    baseFontSize: 18,
    sizes: { xs: 14, sm: 16, base: 18, lg: 22, xl: 28, '2xl': 36, '3xl': 48, '4xl': 64, '5xl': 80 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 900 },
  },
  spacing: { xs: 8, sm: 12, md: 20, lg: 32, xl: 48, '2xl': 64, '3xl': 96 },
  borderRadius: { none: 0, sm: 4, md: 8, lg: 16, xl: 24, full: '9999px' },
  shadows: {
    sm: '0 2px 4px rgba(255,51,102,0.2)',
    md: '0 4px 8px rgba(255,51,102,0.3)',
    lg: '0 8px 16px rgba(255,51,102,0.4)',
    xl: '0 16px 32px rgba(255,51,102,0.5)',
  },
  animation: { duration: 20, fast: 10, slow: 40, stagger: 3, easing: 'easeOutBack' },
};

/**
 * Elegant theme - Sophisticated, luxurious
 */
export const elegantTheme: Theme = {
  name: 'Elegant',
  description: 'Sophisticated design for premium content',
  colors: {
    primary: '#C9A962',
    secondary: '#8B7355',
    background: '#1A1A1A',
    surface: '#2A2A2A',
    text: '#F5F5F5',
    textMuted: '#A0A0A0',
    success: '#7CB342',
    warning: '#C9A962',
    error: '#C62828',
    gradient: ['#C9A962', '#8B7355'],
  },
  typography: {
    fontFamily: 'Cormorant Garamond, Georgia, serif',
    headingFamily: 'Playfair Display, Georgia, serif',
    monoFamily: 'Courier New, monospace',
    baseFontSize: 18,
    sizes: { xs: 12, sm: 14, base: 18, lg: 22, xl: 28, '2xl': 36, '3xl': 48, '4xl': 60, '5xl': 72 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: { xs: 8, sm: 16, md: 24, lg: 40, xl: 56, '2xl': 80, '3xl': 120 },
  borderRadius: { none: 0, sm: 2, md: 4, lg: 8, xl: 12, full: '9999px' },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.2)',
    md: '0 4px 12px rgba(0,0,0,0.25)',
    lg: '0 8px 24px rgba(0,0,0,0.3)',
    xl: '0 16px 48px rgba(0,0,0,0.35)',
  },
  animation: { duration: 45, fast: 20, slow: 90, stagger: 8, easing: 'easeInOutQuad' },
};

/**
 * Tech theme - Futuristic, digital
 */
export const techTheme: Theme = {
  name: 'Tech',
  description: 'Futuristic design for technology content',
  colors: {
    primary: '#00D4FF',
    secondary: '#7B61FF',
    background: '#0D0D0D',
    surface: '#161616',
    text: '#E0E0E0',
    textMuted: '#808080',
    success: '#00FF9F',
    warning: '#FFB800',
    error: '#FF4757',
    gradient: ['#00D4FF', '#7B61FF', '#FF00FF'],
  },
  typography: {
    fontFamily: 'Space Grotesk, system-ui, sans-serif',
    headingFamily: 'Orbitron, sans-serif',
    monoFamily: 'JetBrains Mono, monospace',
    baseFontSize: 16,
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 22, '2xl': 28, '3xl': 36, '4xl': 48, '5xl': 64 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 },
  borderRadius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: '9999px' },
  shadows: {
    sm: '0 0 8px rgba(0,212,255,0.2)',
    md: '0 0 16px rgba(0,212,255,0.3)',
    lg: '0 0 32px rgba(0,212,255,0.4)',
    xl: '0 0 64px rgba(0,212,255,0.5)',
  },
  animation: { duration: 24, fast: 12, slow: 48, stagger: 4, easing: 'easeOutExpo' },
};

/**
 * Nature theme - Organic, calming
 */
export const natureTheme: Theme = {
  name: 'Nature',
  description: 'Organic design inspired by nature',
  colors: {
    primary: '#22C55E',
    secondary: '#84CC16',
    background: '#F0FDF4',
    surface: '#DCFCE7',
    text: '#14532D',
    textMuted: '#166534',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#DC2626',
    gradient: ['#22C55E', '#84CC16', '#A3E635'],
  },
  typography: {
    fontFamily: 'Nunito, system-ui, sans-serif',
    headingFamily: 'Quicksand, sans-serif',
    monoFamily: 'Source Code Pro, monospace',
    baseFontSize: 16,
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 32, '4xl': 40, '5xl': 52 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 },
  borderRadius: { none: 0, sm: 8, md: 16, lg: 24, xl: 32, full: '9999px' },
  shadows: {
    sm: '0 2px 4px rgba(34,197,94,0.1)',
    md: '0 4px 8px rgba(34,197,94,0.15)',
    lg: '0 8px 16px rgba(34,197,94,0.2)',
    xl: '0 16px 32px rgba(34,197,94,0.25)',
  },
  animation: { duration: 36, fast: 18, slow: 72, stagger: 6, easing: 'easeInOutSine' },
};

/**
 * Sunset theme - Warm, vibrant
 */
export const sunsetTheme: Theme = {
  name: 'Sunset',
  description: 'Warm gradient design for vibrant content',
  colors: {
    primary: '#F97316',
    secondary: '#EC4899',
    background: '#1F1020',
    surface: '#2D1B2E',
    text: '#FFF7ED',
    textMuted: '#FDBA74',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F43F5E',
    gradient: ['#F97316', '#EC4899', '#8B5CF6'],
  },
  typography: {
    fontFamily: 'DM Sans, system-ui, sans-serif',
    headingFamily: 'Sora, sans-serif',
    monoFamily: 'Fira Code, monospace',
    baseFontSize: 16,
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 22, '2xl': 28, '3xl': 36, '4xl': 48, '5xl': 64 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 },
  borderRadius: { none: 0, sm: 6, md: 12, lg: 20, xl: 28, full: '9999px' },
  shadows: {
    sm: '0 2px 8px rgba(249,115,22,0.2)',
    md: '0 4px 16px rgba(249,115,22,0.3)',
    lg: '0 8px 32px rgba(249,115,22,0.4)',
    xl: '0 16px 64px rgba(249,115,22,0.5)',
  },
  animation: { duration: 30, fast: 15, slow: 60, stagger: 5, easing: 'easeOutQuart' },
};

/**
 * Ocean theme - Cool, calming
 */
export const oceanTheme: Theme = {
  name: 'Ocean',
  description: 'Cool blue design inspired by the sea',
  colors: {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    background: '#0C1929',
    surface: '#132F4C',
    text: '#E0F2FE',
    textMuted: '#7DD3FC',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient: ['#0EA5E9', '#06B6D4', '#14B8A6'],
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
    headingFamily: 'Outfit, sans-serif',
    monoFamily: 'IBM Plex Mono, monospace',
    baseFontSize: 16,
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 32, '4xl': 42, '5xl': 56 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 },
  borderRadius: { none: 0, sm: 6, md: 12, lg: 18, xl: 24, full: '9999px' },
  shadows: {
    sm: '0 2px 8px rgba(14,165,233,0.15)',
    md: '0 4px 16px rgba(14,165,233,0.2)',
    lg: '0 8px 32px rgba(14,165,233,0.25)',
    xl: '0 16px 64px rgba(14,165,233,0.3)',
  },
  animation: { duration: 36, fast: 18, slow: 72, stagger: 6, easing: 'easeInOutQuad' },
};

/**
 * Dark theme - Default dark mode
 */
export const darkTheme: Theme = {
  name: 'Dark',
  description: 'Default dark theme for all content types',
  colors: {
    primary: '#60A5FA',
    secondary: '#A78BFA',
    background: '#09090B',
    surface: '#18181B',
    text: '#FAFAFA',
    textMuted: '#A1A1AA',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    gradient: ['#60A5FA', '#A78BFA'],
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
    monoFamily: 'Fira Code, monospace',
    baseFontSize: 16,
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 },
  borderRadius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: '9999px' },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.4)',
    lg: '0 10px 15px rgba(0,0,0,0.5)',
    xl: '0 20px 25px rgba(0,0,0,0.6)',
  },
  animation: { duration: 30, fast: 15, slow: 60, stagger: 5, easing: 'easeInOutCubic' },
};

/**
 * Light theme - Default light mode
 */
export const lightTheme: Theme = {
  name: 'Light',
  description: 'Default light theme for all content types',
  colors: {
    primary: '#2563EB',
    secondary: '#7C3AED',
    background: '#FFFFFF',
    surface: '#F4F4F5',
    text: '#09090B',
    textMuted: '#71717A',
    success: '#16A34A',
    warning: '#CA8A04',
    error: '#DC2626',
    gradient: ['#2563EB', '#7C3AED'],
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Inter, system-ui, sans-serif',
    monoFamily: 'Fira Code, monospace',
    baseFontSize: 16,
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48 },
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 },
  borderRadius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: '9999px' },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.07)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.15)',
  },
  animation: { duration: 30, fast: 15, slow: 60, stagger: 5, easing: 'easeInOutCubic' },
};

/**
 * All theme presets
 */
export const themes = {
  modern: modernTheme,
  minimal: minimalTheme,
  bold: boldTheme,
  elegant: elegantTheme,
  tech: techTheme,
  nature: natureTheme,
  sunset: sunsetTheme,
  ocean: oceanTheme,
  dark: darkTheme,
  light: lightTheme,
} as const;

/**
 * Get theme by name
 */
export function getTheme(name: keyof typeof themes): Theme {
  return themes[name];
}
