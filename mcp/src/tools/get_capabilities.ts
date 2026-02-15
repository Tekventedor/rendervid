import { RendervidEngine } from '@rendervid/core';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('get_capabilities');

export const getCapabilitiesTool = {
  name: 'get_capabilities',
  description: `Discover all available features and capabilities of the Rendervid engine.

This tool returns a comprehensive overview of what Rendervid can do, including:

**Layer Types:**
- text: Rich text with typography, fonts, alignment
- image: Display images with fit options (cover, contain, fill)
- video: Play video clips with timing controls
- shape: Rectangles, ellipses, polygons, stars, paths
- audio: Background music and sound effects
- group: Container for organizing layers
- lottie: Lottie animations
- custom: Custom React components (create new components with inline React code!)

**Scene & Layer Visibility:**
- Scenes and layers support a "hidden" property (boolean)
- hidden: true — the scene/layer is skipped during rendering
- Useful for temporarily disabling content without deleting it
- Example: { "id": "scene-1", "hidden": true, ... } or { "id": "layer-1", "hidden": true, ... }

**Animation Presets (40+):**
- Entrance: fadeIn, slideIn, zoomIn, bounceIn, rotateIn, etc.
- Exit: fadeOut, slideOut, zoomOut, bounceOut, rotateOut, etc.
- Emphasis: pulse, shake, bounce, swing, wobble, flash, etc.

**Easing Functions (30+):**
- Linear, ease, easeIn, easeOut, easeInOut
- Cubic bezier variants (Quad, Cubic, Quart, Quint, Sine, Expo, Circ, Back, Elastic, Bounce)
- Custom cubic-bezier and spring functions

**Output Formats:**
- Video: MP4, WebM, MOV, GIF
- Image: PNG, JPEG, WebP
- Codecs: H.264, H.265, VP8, VP9, AV1, ProRes

**Styling Features:**
- Blend modes (multiply, screen, overlay, etc.)
- Filters (blur, brightness, grayscale, etc.)
- Fonts (built-in, Google Fonts, custom fonts)
- Tailwind CSS support

Use this to understand what's possible when creating templates, especially for AI-generated content.
The capabilities object includes detailed schemas and examples for each element type.`,
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export async function executeGetCapabilities(): Promise<string> {
  try {
    logger.info('Getting capabilities');

    // Create engine instance
    const engine = new RendervidEngine();

    // Get capabilities
    const capabilities = engine.getCapabilities();

    // Format for better readability
    const formatted = {
      version: capabilities.version,
      runtime: capabilities.runtime,

      elements: Object.entries(capabilities.elements).map(([type, info]) => ({
        type,
        description: info.description,
        category: info.category,
        animatable: info.animatable,
        allowChildren: info.allowChildren,
        exampleProps: info.example,
      })),

      animations: {
        entrance: capabilities.animations.entrance,
        exit: capabilities.animations.exit,
        emphasis: capabilities.animations.emphasis,
        total: capabilities.animations.entrance.length +
               capabilities.animations.exit.length +
               capabilities.animations.emphasis.length,
      },

      easings: {
        available: capabilities.easings,
        count: capabilities.easings.length,
      },

      styling: {
        blendModes: capabilities.blendModes,
        filters: capabilities.filters,
      },

      fonts: {
        builtin: capabilities.fonts.builtin,
        supportsGoogleFonts: capabilities.fonts.googleFonts,
        supportsCustomFonts: capabilities.fonts.customFonts,
      },

      output: {
        video: {
          formats: capabilities.output.video.formats,
          codecs: capabilities.output.video.codecs,
          maxResolution: `${capabilities.output.video.maxWidth}x${capabilities.output.video.maxHeight}`,
          maxDuration: `${capabilities.output.video.maxDuration}s`,
          maxFps: capabilities.output.video.maxFps,
        },
        image: {
          formats: capabilities.output.image.formats,
          maxResolution: `${capabilities.output.image.maxWidth}x${capabilities.output.image.maxHeight}`,
        },
      },

      features: capabilities.features,
    };

    logger.info('Capabilities retrieved', {
      elementCount: formatted.elements.length,
      animationCount: formatted.animations.total,
      easingCount: formatted.easings.count,
    });

    return JSON.stringify(formatted, null, 2);
  } catch (error) {
    logger.error('Failed to get capabilities', { error });

    const errorMessage = error instanceof Error ? error.message : String(error);

    return JSON.stringify({
      error: 'Failed to get capabilities',
      details: errorMessage,
    }, null, 2);
  }
}
