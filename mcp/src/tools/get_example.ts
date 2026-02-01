import { zodToJsonSchema } from 'zod-to-json-schema';
import { GetExampleInputSchema } from '../types.js';
import { readExampleTemplate, readExampleReadme, exampleExists } from '../utils/examples.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('get_example');

export const getExampleTool = {
  name: 'get_example',
  description: `Load a specific example template by path.

This tool retrieves a complete example template including:
- template: The full Rendervid JSON template ready to use
- readme: Documentation explaining how the template works (if available)
- path: The example path for reference

The template can be used immediately with render_video or render_image tools.
You can also modify the template's inputs or structure before rendering.

**Example paths format:**
category/example-name

**Common examples:**
- getting-started/01-hello-world: Simplest template, animated text
- getting-started/02-first-video: Basic 5-second video
- social-media/instagram-story: 1080x1920 Instagram story template
- social-media/youtube-thumbnail: 1280x720 YouTube thumbnail
- marketing/product-showcase: Product feature video
- data-visualization/animated-bar-chart: Animated bar chart

**Using the template:**
1. Load example: get_example({ examplePath: "category/name" })
2. Review template structure and inputs
3. Customize inputs with your own values
4. Render with render_video or render_image

**Customizing:**
Templates have an "inputs" array defining what can be customized.
Each input has a key, type, label, and default value.
Pass your custom values to the inputs parameter when rendering.

Example:
{
  "inputs": [
    { "key": "title", "type": "string", "default": "Hello" },
    { "key": "color", "type": "color", "default": "#3B82F6" }
  ]
}

Render with: { inputs: { title: "My Title", color: "#FF0000" } }`,
  inputSchema: zodToJsonSchema(GetExampleInputSchema),
};

export async function executeGetExample(args: unknown): Promise<string> {
  try {
    // Parse input
    const input = GetExampleInputSchema.parse(args);

    logger.info('Getting example', { examplePath: input.examplePath });

    // Check if example exists
    const exists = await exampleExists(input.examplePath);

    if (!exists) {
      return JSON.stringify({
        error: `Example not found: ${input.examplePath}`,
        suggestion: 'Use list_examples to see available examples',
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
      suggestion: 'Check that the example path is correct using list_examples',
    }, null, 2);
  }
}
