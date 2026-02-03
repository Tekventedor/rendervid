import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createDefaultComponentDefaultsManager } from '@rendervid/core';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('get_component_defaults');

const GetComponentDefaultsInputSchema = z.object({
  componentName: z.string().optional().describe('Name of a specific custom component to get defaults for (e.g., "AnimatedLineChart"). If not provided, lists all available components.'),
});

export const getComponentDefaultsTool = {
  name: 'get_component_defaults',
  description: `Get default values, validation schemas, and configuration for custom components.

This tool shows you:
- Available custom components with pre-configured defaults
- Default values for each component's props
- Validation rules (types, ranges, enums)
- Required vs optional props
- Examples of how to use each component

Use this when:
1. Creating custom component layers in templates
2. Understanding what default values are available
3. Learning validation constraints for props
4. Getting examples of proper component configuration

Available pre-configured components:
- AnimatedLineChart: Animated line charts with gradients
- AuroraBackground: Northern lights/aurora effect
- WaveBackground: Fluid wave animations

Example: get_component_defaults({ componentName: "AnimatedLineChart" })
Or: get_component_defaults({}) to list all components`,
  inputSchema: zodToJsonSchema(GetComponentDefaultsInputSchema),
};

export async function executeGetComponentDefaults(args: unknown): Promise<string> {
  try {
    // Validate input
    const input = GetComponentDefaultsInputSchema.parse(args);

    // Create the defaults manager
    const manager = createDefaultComponentDefaultsManager();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const managerAny = manager as any;

    if (input.componentName) {
      // Get specific component defaults
      logger.info('Getting component defaults', { componentName: input.componentName });

      const config = managerAny.getConfig(input.componentName);

      if (!config) {
        const components = manager.listComponents();
        const availableNames = components.map(c => c.name).join(', ');

        return JSON.stringify({
          success: false,
          error: `Component "${input.componentName}" not found`,
          availableComponents: components.map(c => ({
            name: c.name,
            description: c.description,
            hasDefaults: c.hasDefaults,
            hasSchema: c.hasSchema,
          })),
          hint: `Available components: ${availableNames}`,
        }, null, 2);
      }

      return JSON.stringify({
        success: true,
        component: {
          name: config.name,
          description: config.description || 'No description provided',
          defaults: config.defaults || {
            required: {},
            optional: {},
          },
          schema: config.schema || {
            properties: {},
          },
          examples: config.examples,
        },
        usage: generateComponentUsageExample(config.name, config.defaults),
      }, null, 2);
    } else {
      // List all components
      logger.info('Listing all components with defaults');

      const components = manager.listComponents();

      const componentDetails = components.map(comp => {
        const config = managerAny.getConfig(comp.name);
        return {
          name: comp.name,
          description: comp.description,
          hasDefaults: comp.hasDefaults,
          hasSchema: comp.hasSchema,
          defaults: config?.defaults || null,
        };
      });

      return JSON.stringify({
        success: true,
        totalComponents: componentDetails.length,
        components: componentDetails,
        hint: 'Use get_component_defaults({ componentName: "ComponentName" }) to get detailed defaults and schema for a specific component',
      }, null, 2);
    }
  } catch (error) {
    logger.error('Get component defaults failed', { error });

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (error instanceof z.ZodError) {
      return JSON.stringify({
        success: false,
        error: 'Invalid input parameters',
        validationErrors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      }, null, 2);
    }

    return JSON.stringify({
      success: false,
      error: errorMessage,
    }, null, 2);
  }
}

function generateComponentUsageExample(
  componentName: string,
  defaults: any
): string {
  return `
When using "${componentName}" in a template:

1. MINIMAL USAGE (relies on defaults):
{
  "type": "custom",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 1080 },
  "customComponent": {
    "name": "${componentName}",
    "props": {
      // Just provide values you want to override
      // All other props will use defaults automatically
    }
  }
}

2. WITH CUSTOM VALUES:
{
  "type": "custom",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 800, "height": 600 },
  "customComponent": {
    "name": "${componentName}",
    "props": {
      // Override specific defaults
      // Example props shown in detailed component documentation
    }
  }
}

3. WHAT YOU GET AUTOMATICALLY:
All custom components receive these auto-injected props:
- frame: Current animation frame (0 to totalFrames-1)
- fps: Video frame rate (e.g., 30)
- totalFrames: Total frames in composition
- sceneDuration: Frames in current scene
- layerSize: { width, height } of the layer

Default values provided:
${defaults ? JSON.stringify(defaults, null, 2) : 'None'}

4. VALIDATION RULES:
See the "schema" field above for validation constraints on props.
Props that don't match the schema will be warned about during rendering.
`;
}
