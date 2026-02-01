import type { Template, Scene, Layer } from '@rendervid/core';
import type { Theme } from '../themes/types';

/**
 * Scene template category
 */
export type SceneCategory =
  | 'intro'
  | 'outro'
  | 'title'
  | 'lower-third'
  | 'transition'
  | 'social'
  | 'promo'
  | 'quote'
  | 'stats'
  | 'testimonial'
  | 'call-to-action'
  | 'logo-reveal'
  | 'text-animation'
  | 'slideshow';

/**
 * Scene template aspect ratio
 */
export type AspectRatio =
  | '16:9'    // YouTube, standard video
  | '9:16'    // TikTok, Instagram Stories, YouTube Shorts
  | '1:1'     // Instagram post, Facebook
  | '4:5'     // Instagram portrait
  | '4:3';    // Traditional TV

/**
 * Common scene template inputs
 */
export interface BaseSceneInputs {
  /** Primary headline text */
  headline?: string;
  /** Secondary/subtitle text */
  subtitle?: string;
  /** Description or body text */
  description?: string;
  /** Brand name */
  brandName?: string;
  /** Logo image URL */
  logoUrl?: string;
  /** Background image URL */
  backgroundUrl?: string;
  /** Background video URL */
  backgroundVideoUrl?: string;
  /** Primary color override */
  primaryColor?: string;
  /** Background color override */
  backgroundColor?: string;
}

/**
 * Scene template definition
 */
export interface SceneTemplate<TInputs extends BaseSceneInputs = BaseSceneInputs> {
  /** Unique template ID */
  id: string;
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Template category */
  category: SceneCategory;
  /** Tags for search/filtering */
  tags: string[];
  /** Supported aspect ratios */
  aspectRatios: AspectRatio[];
  /** Default aspect ratio */
  defaultAspectRatio: AspectRatio;
  /** Duration in seconds */
  duration: number;
  /** Default theme */
  defaultTheme: string;
  /** Preview thumbnail URL */
  thumbnail?: string;
  /** Input field definitions */
  inputs: SceneTemplateInput[];
  /** Default input values */
  defaults: Partial<TInputs>;
  /** Generate the full template */
  generate: (inputs: TInputs, options: SceneGenerateOptions) => Template;
}

/**
 * Scene template input definition
 */
export interface SceneTemplateInput {
  key: string;
  type: 'string' | 'number' | 'color' | 'image' | 'video' | 'boolean' | 'select';
  label: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

/**
 * Options for generating a scene
 */
export interface SceneGenerateOptions {
  /** Aspect ratio */
  aspectRatio: AspectRatio;
  /** Theme to use */
  theme: Theme;
  /** Frames per second */
  fps: number;
  /** Override duration in seconds */
  duration?: number;
}

/**
 * Resolution configuration for aspect ratios
 */
export const aspectRatioResolutions: Record<AspectRatio, { width: number; height: number }> = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '4:3': { width: 1440, height: 1080 },
};

/**
 * Get resolution for aspect ratio
 */
export function getResolution(aspectRatio: AspectRatio): { width: number; height: number } {
  return aspectRatioResolutions[aspectRatio];
}
