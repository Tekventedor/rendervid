import { zodToJsonSchema } from 'zod-to-json-schema';
import { GetExampleInputSchema } from '../types.js';
import { readExampleTemplate, readExampleReadme, exampleExists, listAllExamples, getExampleCategories } from '../utils/examples.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('get_example');

export const getExampleTool = {
  name: 'get_example',
  description: `Browse and load Rendervid example templates.

Without examplePath: lists all available examples (50+) organized by category.
With examplePath: loads a specific example template ready to render.

Categories: getting-started, social-media, marketing, data-visualization, ecommerce, events, content, education, real-estate, streaming, fitness, food, advanced, showcase

Example paths: "getting-started/01-hello-world", "social-media/instagram-story", "marketing/product-showcase"

After loading, use render_video or render_image to render the template.`,
  inputSchema: zodToJsonSchema(GetExampleInputSchema),
};

export async function executeGetExample(args: unknown): Promise<string> {
  try {
    // Parse input
    const input = GetExampleInputSchema.parse(args);

    // If no examplePath provided, list examples
    if (!input.examplePath) {
      return await listExamples(input.category);
    }

    logger.info('Getting example', { examplePath: input.examplePath });

    // Check if example exists
    const exists = await exampleExists(input.examplePath);

    if (!exists) {
      return JSON.stringify({
        error: `Example not found: ${input.examplePath}`,
        suggestion: 'Use get_example() without arguments to list all available examples',
        hint: 'Path format should be: category/example-name (e.g., "getting-started/01-hello-world")',
      }, null, 2);
    }

    // Load template and readme
    const template = await readExampleTemplate(input.examplePath);
    const readme = await readExampleReadme(input.examplePath);

    // Extract useful information from template
    const templateObj = template as {
      name?: string;
      description?: string;
      inputs?: Array<{
        key: string;
        type: string;
        label: string;
        description?: string;
        required?: boolean;
        default?: unknown;
      }>;
      output?: {
        type?: string;
        width?: number;
        height?: number;
        fps?: number;
        duration?: number;
      };
      defaults?: Record<string, unknown>;
    };

    const inputsSummary = templateObj.inputs?.map(input => ({
      key: input.key,
      type: input.type,
      label: input.label,
      description: input.description,
      required: input.required ?? false,
      default: input.default,
    })) || [];

    const outputInfo = {
      type: templateObj.output?.type || 'video',
      dimensions: `${templateObj.output?.width || 1920}x${templateObj.output?.height || 1080}`,
      fps: templateObj.output?.fps,
      duration: templateObj.output?.duration,
    };

    logger.info('Example loaded', {
      examplePath: input.examplePath,
      name: templateObj.name,
      inputCount: inputsSummary.length,
    });

    return JSON.stringify({
      path: input.examplePath,
      name: templateObj.name,
      description: templateObj.description,
      output: outputInfo,
      inputs: inputsSummary,
      defaults: templateObj.defaults,
      template,
      readme,
      usage: {
        message: 'Use this template with render_video or render_image',
        renderVideo: 'render_video({ template: <template>, inputs: { ... }, outputPath: "output.mp4" })',
        renderImage: 'render_image({ template: <template>, inputs: { ... }, outputPath: "output.png" })',
      },
    }, null, 2);
  } catch (error) {
    logger.error('Failed to get example', { error });

    const errorMessage = error instanceof Error ? error.message : String(error);

    return JSON.stringify({
      error: 'Failed to load example',
      details: errorMessage,
      suggestion: 'Use get_example() without arguments to list all available examples',
    }, null, 2);
  }
}

async function listExamples(category?: string): Promise<string> {
  logger.info('Listing examples', { category: category || 'all' });

  const examples = await listAllExamples(category);

  // Group by category
  const byCategory: Record<string, typeof examples> = {};
  for (const example of examples) {
    if (!byCategory[example.category]) {
      byCategory[example.category] = [];
    }
    byCategory[example.category].push(example);
  }

  const allCategories = await getExampleCategories();

  logger.info('Examples listed', {
    total: examples.length,
    categories: Object.keys(byCategory).length,
  });

  return JSON.stringify({
    totalExamples: examples.length,
    categories: Object.keys(byCategory),
    allCategories,
    examples: byCategory,
    usage: {
      message: 'Use get_example with examplePath to load a specific template',
      example: 'get_example({ examplePath: "getting-started/01-hello-world" })',
    },
  }, null, 2);
}
