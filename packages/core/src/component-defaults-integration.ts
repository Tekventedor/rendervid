/**
 * Component Defaults Manager Integration Guide
 *
 * Shows how to integrate ComponentDefaultsManager with TemplateProcessor
 * and the rendering pipeline.
 */

import type { CustomLayer } from './types/layer';
import {
  ComponentDefaultsManager,
  createDefaultComponentDefaultsManager,
  type FrameAwareProps,
  type PropResolutionResult,
} from './component-defaults';

/**
 * Extension for CustomLayer with resolved props
 */
export interface ResolvedCustomLayer extends CustomLayer {
  /** Props that have been resolved with defaults and validation */
  __resolvedProps?: Record<string, unknown>;
  /** Validation warnings from prop resolution */
  __propWarnings?: string[];
  /** Validation errors from prop resolution */
  __propErrors?: Array<{
    property: string;
    error: string;
  }>;
}

/**
 * Helper class to integrate ComponentDefaultsManager with rendering
 */
export class ComponentPropsResolver {
  private defaultsManager: ComponentDefaultsManager;

  constructor(defaultsManager?: ComponentDefaultsManager) {
    this.defaultsManager =
      defaultsManager || createDefaultComponentDefaultsManager();
  }

  /**
   * Resolve props for a custom layer
   *
   * This should be called before rendering each frame
   */
  resolveLayerProps(
    layer: CustomLayer,
    frame: number,
    fps: number,
    totalFrames: number,
    sceneDuration: number,
    layerWidth: number,
    layerHeight: number
  ): PropResolutionResult {
    if (layer.type !== 'custom' || !layer.customComponent) {
      return {
        props: {},
        warnings: [],
        errors: [],
        isValid: true,
      };
    }

    const { name: componentName } = layer.customComponent;
    const layerProps = layer.customComponent.props || {};

    // Create frame-aware data
    const frameData: FrameAwareProps = {
      frame,
      fps,
      totalFrames,
      layerSize: {
        width: layerWidth,
        height: layerHeight,
      },
      sceneDuration,
    };

    // Resolve props with defaults and validation
    return this.defaultsManager.resolveProps(
      componentName,
      layerProps,
      frameData
    );
  }

  /**
   * Register component configuration
   */
  registerComponent(
    name: string,
    config: Parameters<ComponentDefaultsManager['register']>[1]
  ): void {
    this.defaultsManager.register(name, config);
  }

  /**
   * Get defaults manager for direct access
   */
  getManager(): ComponentDefaultsManager {
    return this.defaultsManager;
  }
}

/**
 * Example: How to use ComponentDefaultsManager in a rendering loop
 *
 * @example
 * ```typescript
 * const resolver = new ComponentPropsResolver();
 *
 * // In your rendering loop:
 * for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
 *   for (const layer of scene.layers) {
 *     if (layer.type === 'custom') {
 *       const propResolution = resolver.resolveLayerProps(
 *         layer,
 *         frameNum,
 *         30,
 *         totalFrames,
 *         sceneDuration,
 *         1920,
 *         1080
 *       );
 *
 *       if (!propResolution.isValid) {
 *         console.error('Invalid props for', layer.id, propResolution.errors);
 *       }
 *
 *       // Use propResolution.props to render the component
 *       renderCustomComponent(layer.customComponent.name, propResolution.props);
 *     }
 *   }
 * }
 * ```
 */

/**
 * Template Processor Integration
 *
 * Shows how to integrate with TemplateProcessor
 */
export function integrateWithTemplateProcessor() {
  // This is a pseudo-code example showing the pattern
  const example = `
  // In TemplateProcessor class:

  private componentDefaults: ComponentDefaultsManager;

  constructor(defaultsManager?: ComponentDefaultsManager) {
    this.componentDefaults =
      defaultsManager || createDefaultComponentDefaultsManager();
  }

  // Update renderScene method:
  renderScene(scene, frame, fps, totalFrames) {
    const sceneDuration = scene.endFrame - scene.startFrame;

    for (const layer of scene.layers) {
      if (layer.type === 'custom') {
        const frameData: FrameAwareProps = {
          frame,
          fps,
          totalFrames,
          layerSize: {
            width: layer.size.width,
            height: layer.size.height,
          },
          sceneDuration,
        };

        const propResolution = this.componentDefaults.resolveProps(
          layer.customComponent.name,
          layer.customComponent.props,
          frameData
        );

        if (!propResolution.isValid) {
          console.error(\`Invalid props for \${layer.id}:\`, propResolution.errors);
        }

        // Store resolved props on the layer for use by renderer
        (layer as any).__resolvedProps = propResolution.props;
        (layer as any).__propWarnings = propResolution.warnings;
        (layer as any).__propErrors = propResolution.errors.map(e => ({
          property: e.property,
          error: e.error
        }));
      }
    }
  }
  `;

  return example;
}

/**
 * NodeRenderer Integration
 *
 * Shows how to integrate with NodeRenderer
 */
export function integrateWithNodeRenderer() {
  // This is a pseudo-code example showing the pattern
  const example = `
  // In NodeRenderer class:

  private componentPropsResolver: ComponentPropsResolver;

  constructor(options: NodeRendererOptions = {}) {
    this.componentPropsResolver = new ComponentPropsResolver(
      options.componentDefaultsManager
    );
  }

  // In renderFrame method, when handling custom layers:
  private async handleCustomLayer(
    layer: CustomLayer,
    frameNum: number,
    fps: number,
    totalFrames: number,
    sceneDuration: number
  ) {
    const propResolution = this.componentPropsResolver.resolveLayerProps(
      layer,
      frameNum,
      fps,
      totalFrames,
      sceneDuration,
      layer.size.width,
      layer.size.height
    );

    if (!propResolution.isValid) {
      console.error(
        \`Cannot render custom component \${layer.id}:\`,
        propResolution.errors
      );
      return;
    }

    // Render component with resolved props
    await this.page.evaluate((props, componentName) => {
      const component = window.RENDERVID_CUSTOM_COMPONENTS[componentName];
      if (!component) {
        console.error(\`Component \${componentName} not found\`);
        return;
      }
      // Render with props
      component(props);
    }, propResolution.props, layer.customComponent.name);
  }
  `;

  return example;
}

/**
 * Example template with proper defaults
 */
export const exampleTemplateWithDefaults = {
  name: 'Stock Chart Animation',
  description: 'Animated stock price chart with statistics',
  version: '1.0.0',
  output: {
    type: 'video' as const,
    width: 1080,
    height: 1920,
    fps: 30,
    duration: 10,
  },
  inputs: [],
  defaults: {},
  customComponents: {
    AnimatedLineChart: {
      type: 'inline' as const,
      code: 'function AnimatedLineChart(props) { /* ... */ }',
      description: 'Animated line chart component',
      defaults: {
        optional: {
          animationDuration: 3,
          colors: ['#00f2ea', '#ff0050'],
          showGrid: true,
          showLabels: true,
        },
      },
    },
  },
  composition: {
    scenes: [
      {
        id: 'chart-scene',
        startFrame: 60,
        endFrame: 240,
        layers: [
          {
            id: 'chart-background',
            type: 'shape' as const,
            position: { x: 0, y: 0 },
            size: { width: 1080, height: 1920 },
            props: {
              shape: 'rectangle' as const,
              fill: '#0a0e27',
            },
          },
          {
            id: 'animated-chart',
            type: 'custom' as const,
            position: { x: 80, y: 300 },
            size: { width: 920, height: 660 },
            customComponent: {
              name: 'AnimatedLineChart',
              // Props can be partial - defaults will be applied
              props: {
                // Override specific defaults
                colors: ['#ff0000', '#00ff00'],
                // Rest will come from component defaults
              },
            },
          },
        ],
      },
    ],
  },
};

/**
 * Proper way to request custom components from AI agents
 */
export const improvedMCPPrompt = `
## Custom Component Development for RenderVid

When creating a custom component, follow these rules:

### 1. Component Props Structure

Every component receives these auto-injected props:
\`\`\`typescript
{
  frame: number;           // Current frame (0 to totalFrames-1)
  fps: number;             // Video frame rate
  totalFrames: number;     // Total frames in composition
  sceneDuration: number;   // Frames in current scene
  layerSize: {
    width: number;
    height: number;
  };
}
\`\`\`

### 2. Register Component Defaults

Define defaults in the template:
\`\`\`json
{
  "customComponents": {
    "MyComponent": {
      "type": "inline",
      "code": "function MyComponent(props) { ... }",
      "defaults": {
        "optional": {
          "duration": 3,
          "colors": ["#00f2ea"],
          "showLabels": true
        }
      }
    }
  }
}
\`\`\`

### 3. Template Layer Configuration

Always pass required props in the layer:
\`\`\`json
{
  "type": "custom",
  "customComponent": {
    "name": "MyComponent",
    "props": {
      "colors": ["#ff0050"]  // Override defaults
    }
  }
}
\`\`\`

### 4. Component Implementation

Write frame-aware animations:
\`\`\`javascript
function AnimatedChart(props) {
  const { frame, fps, totalFrames, layerSize } = props;

  // Calculate animation progress
  const progress = frame / totalFrames;

  // Create SVG with animation
  return React.createElement('svg', {
    width: layerSize.width,
    height: layerSize.height
  },
    // Use progress to animate elements
  );
}
\`\`\`

### 5. Critical Rules

✓ DO:
- Accept all auto-injected props (frame, fps, totalFrames, layerSize)
- Return React.createElement (no JSX)
- Use frame to calculate animation progress
- Convert numbers to strings for text nodes
- Define prop schema for validation

✗ DON'T:
- Leave props empty ({})
- Use string concatenation in text nodes
- Assume JSX will work
- Hard-code animation durations without reading props
- Ignore validation warnings
`;
