// Types
export type {
  SceneCategory,
  AspectRatio,
  BaseSceneInputs,
  SceneTemplate,
  SceneTemplateInput,
  SceneGenerateOptions,
} from './types';
export { aspectRatioResolutions, getResolution } from './types';

// Intro scenes
export { TitleReveal, LogoReveal } from './intro';
export type { TitleRevealInputs, LogoRevealInputs } from './intro';

// Lower third scenes
export { ModernLowerThird } from './lower-third';
export type { LowerThirdInputs } from './lower-third';

// Social scenes
export { SocialPromo } from './social';
export type { SocialPromoInputs } from './social';

// Stats scenes
export { AnimatedStats } from './stats';
export type { AnimatedStatsInputs, StatItem } from './stats';

// Quote scenes
export { TestimonialQuote } from './quote';
export type { TestimonialInputs } from './quote';

// CTA scenes
export { CallToAction } from './cta';
export type { CallToActionInputs } from './cta';

// Countdown scenes
export { CountdownTimer } from './countdown';
export type { CountdownInputs } from './countdown';

// Product scenes
export { ProductShowcase } from './product';
export type { ProductShowcaseInputs } from './product';

// Text animation scenes
export { KineticText } from './text-animation';
export type { KineticTextInputs } from './text-animation';

// Transition scenes
export { WipeTransition } from './transition';
export type { WipeTransitionInputs } from './transition';

// Scene registry
import { TitleReveal, LogoReveal } from './intro';
import { ModernLowerThird } from './lower-third';
import { SocialPromo } from './social';
import { AnimatedStats } from './stats';
import { TestimonialQuote } from './quote';
import { CallToAction } from './cta';
import { CountdownTimer } from './countdown';
import { ProductShowcase } from './product';
import { KineticText } from './text-animation';
import { WipeTransition } from './transition';
import type { SceneTemplate, BaseSceneInputs } from './types';

/**
 * Registry of all available scene templates
 */
export const sceneTemplates: SceneTemplate<BaseSceneInputs>[] = [
  TitleReveal as SceneTemplate<BaseSceneInputs>,
  LogoReveal as SceneTemplate<BaseSceneInputs>,
  ModernLowerThird as SceneTemplate<BaseSceneInputs>,
  SocialPromo as SceneTemplate<BaseSceneInputs>,
  AnimatedStats as SceneTemplate<BaseSceneInputs>,
  TestimonialQuote as SceneTemplate<BaseSceneInputs>,
  CallToAction as SceneTemplate<BaseSceneInputs>,
  CountdownTimer as SceneTemplate<BaseSceneInputs>,
  ProductShowcase as SceneTemplate<BaseSceneInputs>,
  KineticText as SceneTemplate<BaseSceneInputs>,
  WipeTransition as SceneTemplate<BaseSceneInputs>,
];

/**
 * Get a scene template by ID
 */
export function getSceneTemplate(id: string): SceneTemplate<BaseSceneInputs> | undefined {
  return sceneTemplates.find((template) => template.id === id);
}

/**
 * Get scene templates by category
 */
export function getScenesByCategory(category: string): SceneTemplate<BaseSceneInputs>[] {
  return sceneTemplates.filter((template) => template.category === category);
}

/**
 * Search scene templates by tags
 */
export function searchScenes(query: string): SceneTemplate<BaseSceneInputs>[] {
  const normalizedQuery = query.toLowerCase();
  return sceneTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(normalizedQuery) ||
      template.description.toLowerCase().includes(normalizedQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
  );
}

/**
 * Get all unique scene categories
 */
export function getSceneCategories(): string[] {
  return [...new Set(sceneTemplates.map((template) => template.category))];
}

/**
 * Get all unique scene tags
 */
export function getSceneTags(): string[] {
  const allTags = sceneTemplates.flatMap((template) => template.tags);
  return [...new Set(allTags)].sort();
}
