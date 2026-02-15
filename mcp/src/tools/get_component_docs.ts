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

Common properties available on ALL layer types:
- hidden: boolean (optional) — Hide the layer from rendering without deleting it
- locked: boolean (optional) — Lock the layer in the editor (prevents accidental edits)

Scenes also support:
- hidden: boolean (optional) — Hide entire scene from rendering

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
    description: `Use custom React components for advanced effects and animations.

IMPORTANT: You can create NEW custom components using THREE methods:

1. **inline** - Write React code directly in the template (RECOMMENDED for AI agents)
2. **url** - Load components from a CDN or URL
3. **reference** - Use pre-registered components

Custom components enable effects that built-in components cannot achieve:
- Animated counters and timers
- Particle systems and physics
- Data visualizations and charts
- 3D effects and transformations
- Procedural graphics and SVG animations
- Complex frame-based animations`,
    required: ['id', 'type', 'position', 'size', 'customComponent'],

    howToDefineComponents: {
      description: `Define custom components in the template's "customComponents" field at the root level:`,

      method1_inline: {
        type: 'inline',
        description: 'Write React code as a string in the template. Best for AI-generated components.',
        structure: {
          customComponents: {
            'ComponentName': {
              type: 'inline',
              code: 'function ComponentName(props) { /* React code here */ return React.createElement(...); }',
              description: 'Optional description of what the component does'
            }
          }
        },
        exampleTemplate: {
          name: 'Animated Counter Example',
          customComponents: {
            'AnimatedCounter': {
              type: 'inline',
              code: 'function AnimatedCounter(props) { const progress = Math.min(props.frame / (props.fps * 2), 1); const value = Math.floor(props.from + (props.to - props.from) * progress); return React.createElement("div", { style: { fontSize: "72px", fontWeight: "bold", color: "#00ffff" } }, value); }',
              description: 'Animated number counter with easing'
            }
          },
          output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 3 },
          composition: {
            scenes: [{
              layers: [{
                id: 'counter',
                type: 'custom',
                position: { x: 960, y: 540 },
                size: { width: 400, height: 200 },
                customComponent: {
                  name: 'AnimatedCounter',
                  props: { from: 0, to: 100 }
                }
              }]
            }]
          }
        },
        componentInterface: {
          description: 'Every custom component receives these props automatically:',
          props: {
            frame: 'Current frame number (0, 1, 2, ...)',
            fps: 'Frames per second (e.g., 30, 60)',
            sceneDuration: 'Total frames in the scene',
            layerSize: { width: 'Layer width in pixels', height: 'Layer height in pixels' },
            yourCustomProps: 'Any props you define in customComponent.props'
          }
        },
        rules: [
          'Use React.createElement() to create elements (no JSX)',
          'Components must be deterministic (same frame = same output)',
          'Calculate animations based on props.frame',
          'No side effects (fetch, setTimeout, setInterval)',
          'No external state or imports',
          'Return a single React element'
        ]
      },

      method2_url: {
        type: 'url',
        description: 'Load component from a CDN or HTTPS URL',
        structure: {
          customComponents: {
            'MyChart': {
              type: 'url',
              url: 'https://cdn.example.com/MyChart.js'
            }
          }
        },
        note: 'Must use HTTPS. Component file must export as default or named export.'
      },

      method3_reference: {
        type: 'reference',
        description: 'Reference a pre-registered component from the built-in library',
        structure: {
          customComponents: {
            'Particles': {
              type: 'reference',
              reference: 'particle-system'
            }
          }
        },
        availableBuiltInComponents: [
          'particle-system',
          'typewriter-effect',
          'glitch-effect',
          'three-scene',
          'svg-drawing',
          'metaballs',
          'aurora-background',
          'wave-background'
        ]
      }
    },

    customComponent: {
      name: {
        type: 'string',
        required: true,
        description: 'Name of the component defined in customComponents field',
        example: 'AnimatedCounter',
      },
      props: {
        type: 'object',
        required: false,
        description: 'Custom props to pass to the component (in addition to auto props)',
        example: { from: 0, to: 100, color: '#00ffff' },
      },
    },

    fullWorkingExample: {
      description: 'Complete template with inline custom component (ready to render)',
      template: {
        name: 'Fast Clock Example',
        output: { type: 'video', width: 1920, height: 1080, fps: 60, duration: 5 },
        customComponents: {
          'FastClock': {
            type: 'inline',
            code: 'function FastClock(props) { const time = (props.frame / props.fps) * (props.speed || 1); const seconds = Math.floor(time % 60); const angle = seconds * 6; const rad = (angle - 90) * Math.PI / 180; const cx = props.layerSize.width / 2; const cy = props.layerSize.height / 2; const length = Math.min(cx, cy) * 0.8; const x2 = cx + Math.cos(rad) * length; const y2 = cy + Math.sin(rad) * length; return React.createElement("svg", { width: props.layerSize.width, height: props.layerSize.height }, React.createElement("circle", { cx: cx, cy: cy, r: Math.min(cx, cy) * 0.9, fill: "transparent", stroke: props.color || "#fff", strokeWidth: 4 }), React.createElement("line", { x1: cx, y1: cy, x2: x2, y2: y2, stroke: "#ff0000", strokeWidth: 3 })); }',
            description: 'Animated analog clock with rotating second hand'
          }
        },
        composition: {
          scenes: [{
            layers: [{
              id: 'clock',
              type: 'custom',
              position: { x: 960, y: 540 },
              size: { width: 400, height: 400 },
              customComponent: {
                name: 'FastClock',
                props: { speed: 10, color: '#ffffff' }
              }
            }]
          }]
        }
      }
    },

    example: {
      description: 'Using a custom component in a layer',
      id: 'my-custom-element',
      type: 'custom',
      position: { x: 960, y: 540 },
      size: { width: 800, height: 400 },
      customComponent: {
        name: 'AnimatedCounter',
        props: {
          from: 0,
          to: 100,
          color: '#00ffff'
        }
      }
    },

    importantNotes: [
      '✅ You CAN create new components with inline React code',
      '✅ Components are defined in template.customComponents (root level)',
      '✅ Use type: "inline" to write React code directly in the template',
      '✅ Components receive frame, fps, sceneDuration, layerSize automatically',
      '✅ Same component can be used multiple times with different props',
      '⚠️ Components must be deterministic (frame-based, no randomness)',
      '⚠️ Use React.createElement(), not JSX syntax',
      '⚠️ No external dependencies or imports allowed in inline code'
    ]
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
