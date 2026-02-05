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
  inputs: z.record(z.any()).optional().default({})
    .describe('Template variables. Example: {"title": "Hello World"}'),
  outputPath: z.string()
    .describe('Output file path. Use ~/Downloads/, ~/Desktop/, or ~/Documents/ on macOS'),
  format: z.enum(['mp4', 'webm', 'mov', 'gif']).optional().default('mp4')
    .describe('Video format. mp4 = Best compatibility (default), webm = Web optimized, mov = macOS native'),
  quality: z.enum(['draft', 'standard', 'high', 'lossless']).optional().default('high')
    .describe('Quality preset. draft = Fast preview, standard = Balanced, high = Production (default), lossless = Uncompressed'),
  fps: z.number().int().positive().optional()
    .describe('Override template fps. Common: 24 = Film, 30 = Standard, 60 = Smooth'),
  renderWaitTime: z.number().int().positive().optional().default(100)
    .describe('Wait time in ms before capturing frames. 100 = fast/default, 200 = text-only, 500-800 = with complex images/videos'),
});

/**
 * Zod schema for render_image tool input
 */
export const RenderImageInputSchema = z.object({
  template: TemplateSchema,
  inputs: z.record(z.any()).optional().default({})
    .describe('Template variables. Example: {"title": "Hello World"}'),
  outputPath: z.string()
    .describe('Output file path. Use ~/Downloads/, ~/Desktop/, or ~/Documents/ on macOS'),
  format: z.enum(['png', 'jpeg', 'webp']).optional().default('png')
    .describe('Image format. png = Lossless (default), jpeg = Compressed/smaller, webp = Modern/efficient'),
  quality: z.number().int().min(1).max(100).optional().default(90)
    .describe('Quality for JPEG/WebP. 1-100. Higher = better quality, larger file. Default: 90'),
  frame: z.number().int().nonnegative().optional().default(0)
    .describe('Frame number to capture (0-based). 0 = first frame, N = frame after N frames'),
  renderWaitTime: z.number().int().positive().optional().default(100)
    .describe('Wait time in ms before capturing. 100 = fast/default, 200 = text-only, 500-800 = with complex images'),
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
