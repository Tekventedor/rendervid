import { z } from 'zod';

/**
 * Zod schema for template JSON validation
 */
export const TemplateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  output: z.object({
    type: z.enum(['video', 'image']),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fps: z.number().int().positive().optional(),
    duration: z.number().positive().optional(),
  }),
  inputs: z.array(z.object({
    key: z.string(),
    type: z.string(),
    label: z.string(),
    description: z.string().optional(),
    required: z.boolean().optional(),
    default: z.any().optional(),
  })).optional(),
  defaults: z.record(z.any()).optional(),
  composition: z.object({
    scenes: z.array(z.any()),
  }),
});

/**
 * Zod schema for render_video tool input
 */
export const RenderVideoInputSchema = z.object({
  template: TemplateSchema,
  inputs: z.record(z.any()).optional().default({}),
  outputPath: z.string(),
  format: z.enum(['mp4', 'webm', 'mov', 'gif']).optional().default('mp4'),
  quality: z.enum(['draft', 'standard', 'high', 'lossless']).optional().default('high'),
  fps: z.number().int().positive().optional(),
  renderWaitTime: z.number().int().positive().optional().describe('Time to wait after rendering before capturing each frame (ms, default: 50). Increase for complex animations or slow-loading content.'),
});

/**
 * Zod schema for render_image tool input
 */
export const RenderImageInputSchema = z.object({
  template: TemplateSchema,
  inputs: z.record(z.any()).optional().default({}),
  outputPath: z.string(),
  format: z.enum(['png', 'jpeg', 'webp']).optional().default('png'),
  quality: z.number().int().min(1).max(100).optional().default(90),
  frame: z.number().int().nonnegative().optional().default(0),
  renderWaitTime: z.number().int().positive().optional().describe('Time to wait after rendering before capturing (ms, default: 50). Increase for complex animations or slow-loading content.'),
});

/**
 * Zod schema for validate_template tool input
 */
export const ValidateTemplateInputSchema = z.object({
  template: z.any(),
});

/**
 * Zod schema for list_examples tool input
 */
export const ListExamplesInputSchema = z.object({
  category: z.string().optional(),
});

/**
 * Zod schema for get_example tool input
 */
export const GetExampleInputSchema = z.object({
  examplePath: z.string(),
});

/**
 * Example metadata structure
 */
export interface ExampleMetadata {
  name: string;
  category: string;
  path: string;
  description: string;
  outputType: 'video' | 'image';
  dimensions: string;
}

/**
 * Tool result types
 */
export interface RenderResult {
  success: boolean;
  outputPath: string;
  duration?: number;
  fileSize: number;
  width: number;
  height: number;
  renderTime: number;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    path: string;
    message: string;
  }>;
  warnings?: Array<{
    path: string;
    message: string;
  }>;
}

export interface CapabilitiesResult {
  version: string;
  elements: Record<string, {
    description: string;
    category: string;
    animatable: boolean;
  }>;
  animations: {
    entrance: string[];
    exit: string[];
    emphasis: string[];
  };
  easings: string[];
  fonts: {
    builtin: string[];
    googleFonts: boolean;
  };
  output: {
    video: {
      formats: string[];
      codecs: string[];
      maxWidth: number;
      maxHeight: number;
      maxDuration: number;
      maxFps: number;
    };
    image: {
      formats: string[];
      maxWidth: number;
      maxHeight: number;
    };
  };
}
