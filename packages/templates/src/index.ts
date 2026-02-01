// Themes
export {
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
} from './themes';

export type {
  Theme,
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
  ThemeAnimation,
  ThemePreset,
} from './themes';

// Scenes
export {
  // Registry and utilities
  sceneTemplates,
  getSceneTemplate,
  getScenesByCategory,
  searchScenes,
  getSceneCategories,
  getSceneTags,
  aspectRatioResolutions,
  getResolution,
  // Intro
  TitleReveal,
  LogoReveal,
  // Lower third
  ModernLowerThird,
  // Social
  SocialPromo,
  // Stats
  AnimatedStats,
  // Quote
  TestimonialQuote,
  // CTA
  CallToAction,
  // Countdown
  CountdownTimer,
  // Product
  ProductShowcase,
  // Text animation
  KineticText,
  // Transition
  WipeTransition,
} from './scenes';

export type {
  SceneCategory,
  AspectRatio,
  BaseSceneInputs,
  SceneTemplate,
  SceneTemplateInput,
  SceneGenerateOptions,
  TitleRevealInputs,
  LogoRevealInputs,
  LowerThirdInputs,
  SocialPromoInputs,
  AnimatedStatsInputs,
  StatItem,
  TestimonialInputs,
  CallToActionInputs,
  CountdownInputs,
  ProductShowcaseInputs,
  KineticTextInputs,
  WipeTransitionInputs,
} from './scenes';
