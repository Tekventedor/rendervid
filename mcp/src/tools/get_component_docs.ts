import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('get_component_docs');

const GetComponentDocsInputSchema = z.object({
  componentType: z.string().describe('The component/layer type to get documentation for'),
});

export const getComponentDocsTool = {
  name: 'get_component_docs',
  description: `Get detailed documentation for a specific Rendervid component/layer type.

Use this tool when you need detailed information about how to use a specific component.
This is more token-efficient than loading all documentation at once.

Available component types:
- text: Text layers with custom styling
- image: Image layers with various fit modes
- shape: Geometric shapes (rectangle, ellipse, triangle, star, polygon)
- video: Video layers with playback control
- audio: Audio layers for background music/effects
- custom: Custom React components

Example: get_component_docs({ componentType: "text" })`,
  inputSchema: zodToJsonSchema(GetComponentDocsInputSchema),
};

const COMPONENT_DOCS = {
  text: {
    type: 'text',
    description: 'Display text with customizable styling',
    required: ['id', 'type', 'position', 'size', 'props'],
    props: {
      text: {
        type: 'string',
        required: true,
        description: 'The text content to display. Use {{variableName}} for dynamic values',
        example: '{{title}}',
      },
      fontSize: {
        type: 'number',
        required: false,
        default: 16,
        description: 'Font size in pixels',
        example: 48,
      },
      fontFamily: {
        type: 'string',
        required: false,
        default: 'Inter',
        description: 'Font family name. Supports Google Fonts and system fonts',
        example: 'Inter, Roboto, Poppins, Montserrat, Open Sans',
      },
      fontWeight: {
        type: 'string | number',
        required: false,
        default: 'normal',
        description: 'Font weight: "normal", "bold", or numeric (100-900)',
        example: 'bold',
      },
      color: {
        type: 'string',
        required: false,
        default: '#000000',
        description: 'Text color in hex, rgb, rgba, or CSS color name',
        example: '#ffffff',
      },
      textAlign: {
        type: 'string',
        required: false,
        default: 'left',
        description: 'Text alignment: "left", "center", "right", "justify"',
        example: 'center',
      },
      lineHeight: {
        type: 'number',
        required: false,
        default: 1.2,
        description: 'Line height multiplier',
        example: 1.5,
      },
      letterSpacing: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Letter spacing in pixels',
        example: 2,
      },
      textTransform: {
        type: 'string',
        required: false,
        description: 'Text transformation: "uppercase", "lowercase", "capitalize"',
        example: 'uppercase',
      },
      textShadow: {
        type: 'string | object',
        required: false,
        description: 'CSS text-shadow or object with color, blur, offsetX, offsetY',
        example: '2px 2px 4px rgba(0,0,0,0.5)',
      },
      opacity: {
        type: 'number',
        required: false,
        default: 1,
        description: 'Opacity from 0 to 1',
        example: 0.8,
      },
    },
    example: {
      id: 'title',
      type: 'text',
      position: { x: 160, y: 440 },
      size: { width: 1600, height: 200 },
      props: {
        text: '{{title}}',
        fontSize: 72,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: 4,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          delay: 30,
          duration: 20,
        },
      ],
    },
  },

  image: {
    type: 'image',
    description: 'Display an image with various fit modes',
    required: ['id', 'type', 'position', 'size', 'props'],
    props: {
      src: {
        type: 'string',
        required: true,
        description: 'Image URL (http/https) or local file path',
        example: 'https://example.com/image.jpg',
      },
      fit: {
        type: 'string',
        required: false,
        default: 'contain',
        description: 'How to fit the image: "contain" (fit inside), "cover" (fill), "fill" (stretch)',
        example: 'cover',
      },
      opacity: {
        type: 'number',
        required: false,
        default: 1,
        description: 'Image opacity from 0 to 1',
        example: 0.7,
      },
      borderRadius: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Border radius in pixels for rounded corners',
        example: 16,
      },
    },
    example: {
      id: 'background-image',
      type: 'image',
      position: { x: 0, y: 0 },
      size: { width: 1920, height: 1080 },
      props: {
        src: 'https://example.com/background.jpg',
        fit: 'cover',
        opacity: 0.3,
      },
    },
  },

  shape: {
    type: 'shape',
    description: 'Display geometric shapes',
    required: ['id', 'type', 'position', 'size', 'props'],
    props: {
      shape: {
        type: 'string',
        required: true,
        description: 'Shape type: "rectangle", "ellipse", "triangle", "star", "polygon"',
        example: 'rectangle',
      },
      fill: {
        type: 'string',
        required: false,
        description: 'Fill color in hex, rgb, rgba, or CSS color name. Can also be a gradient object',
        example: '#2563eb',
      },
      stroke: {
        type: 'string',
        required: false,
        description: 'Stroke/border color',
        example: '#ffffff',
      },
      strokeWidth: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Stroke width in pixels',
        example: 2,
      },
      gradient: {
        type: 'object',
        required: false,
        description: 'Gradient fill with type ("linear"|"radial") and colors array',
        example: {
          type: 'linear',
          angle: 45,
          colors: [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' },
          ],
        },
      },
      borderRadius: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Border radius for rectangles',
        example: 16,
      },
      sides: {
        type: 'number',
        required: false,
        description: 'Number of sides for polygons',
        example: 6,
      },
      points: {
        type: 'number',
        required: false,
        description: 'Number of points for stars',
        example: 5,
      },
    },
    example: {
      id: 'background',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width: 1920, height: 1080 },
      props: {
        shape: 'rectangle',
        gradient: {
          type: 'linear',
          angle: 135,
          colors: [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' },
          ],
        },
      },
    },
  },

  video: {
    type: 'video',
    description: 'Display video with playback control',
    required: ['id', 'type', 'position', 'size', 'props'],
    props: {
      src: {
        type: 'string',
        required: true,
        description: 'Video URL (http/https) or local file path',
        example: 'https://example.com/video.mp4',
      },
      volume: {
        type: 'number',
        required: false,
        default: 1,
        description: 'Volume from 0 to 1',
        example: 0.5,
      },
      loop: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Whether to loop the video',
        example: true,
      },
      fit: {
        type: 'string',
        required: false,
        default: 'contain',
        description: 'How to fit the video: "contain", "cover", "fill"',
        example: 'cover',
      },
      startTime: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Start playback at this time (seconds)',
        example: 5,
      },
    },
    example: {
      id: 'background-video',
      type: 'video',
      position: { x: 0, y: 0 },
      size: { width: 1920, height: 1080 },
      props: {
        src: 'https://example.com/background.mp4',
        fit: 'cover',
        volume: 0.3,
        loop: true,
      },
    },
  },

  audio: {
    type: 'audio',
    description: 'Add audio/music to the video',
    required: ['id', 'type', 'props'],
    props: {
      src: {
        type: 'string',
        required: true,
        description: 'Audio URL (http/https) or local file path',
        example: 'https://example.com/music.mp3',
      },
      volume: {
        type: 'number',
        required: false,
        default: 1,
        description: 'Volume from 0 to 1',
        example: 0.5,
      },
      loop: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Whether to loop the audio',
        example: true,
      },
      startTime: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Start playback at this time (seconds)',
        example: 2,
      },
      fadeIn: {
        type: 'number',
        required: false,
        description: 'Fade in duration in seconds',
        example: 1,
      },
      fadeOut: {
        type: 'number',
        required: false,
        description: 'Fade out duration in seconds',
        example: 2,
      },
    },
    example: {
      id: 'background-music',
      type: 'audio',
      props: {
        src: 'https://example.com/background-music.mp3',
        volume: 0.3,
        loop: true,
        fadeIn: 1,
        fadeOut: 2,
      },
    },
    note: 'Audio layers do not need position or size properties',
  },

  custom: {
    type: 'custom',
    description: 'Use custom React components for advanced effects',
    required: ['id', 'type', 'position', 'size', 'customComponent'],
    customComponent: {
      name: {
        type: 'string',
        required: true,
        description: 'Component name (e.g., "particle-system", "typewriter-effect")',
        example: 'particle-system',
      },
      props: {
        type: 'object',
        required: true,
        description: 'Component-specific props (varies by component)',
        example: { frame: 0, fps: 30, count: 100 },
      },
    },
    availableComponents: [
      'particle-system',
      'typewriter-effect',
      'glitch-effect',
      'three-scene',
      'svg-drawing',
      'metaballs',
      'aurora-background',
      'wave-background',
    ],
    example: {
      id: 'particles',
      type: 'custom',
      position: { x: 0, y: 0 },
      size: { width: 1920, height: 1080 },
      customComponent: {
        name: 'particle-system',
        props: {
          frame: 0,
          fps: 30,
          count: 100,
          type: 'circle',
          color: '#ffffff',
          size: [2, 8],
          speed: [1, 3],
          direction: 'up',
        },
      },
    },
    note: 'For custom component details, use get_custom_component_docs tool',
  },
};

export async function executeGetComponentDocs(args: unknown): Promise<string> {
  try {
    const input = GetComponentDocsInputSchema.parse(args);
    const componentType = input.componentType.toLowerCase();

    logger.info('Getting component documentation', { componentType });

    const docs = COMPONENT_DOCS[componentType as keyof typeof COMPONENT_DOCS];

    if (!docs) {
      const available = Object.keys(COMPONENT_DOCS).join(', ');
      return JSON.stringify({
        error: `Unknown component type: ${componentType}`,
        available: available,
        suggestion: `Use one of: ${available}`,
      }, null, 2);
    }

    logger.info('Component documentation retrieved', { componentType });

    const response: any = {
      componentType: docs.type,
      description: docs.description,
      required: docs.required,
      example: docs.example,
    };

    // Add optional fields if they exist
    if ('props' in docs) response.props = docs.props;
    if ('customComponent' in docs) response.customComponent = docs.customComponent;
    if ('note' in docs) response.note = docs.note;
    if ('availableComponents' in docs) response.availableComponents = docs.availableComponents;

    return JSON.stringify(response, null, 2);
  } catch (error) {
    logger.error('Failed to get component docs', { error });

    if (error instanceof z.ZodError) {
      return JSON.stringify({
        error: 'Invalid input',
        details: error.errors,
      }, null, 2);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      error: 'Failed to get component documentation',
      details: errorMessage,
    }, null, 2);
  }
}
