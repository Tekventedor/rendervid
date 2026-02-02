import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('get_animation_docs');

const GetAnimationDocsInputSchema = z.object({
  animationType: z.string().optional().describe('Animation type: "entrance", "exit", "emphasis", or "all"'),
  effect: z.string().optional().describe('Specific animation effect name (optional)'),
});

export const getAnimationDocsTool = {
  name: 'get_animation_docs',
  description: `Get detailed documentation for Rendervid animation effects.

Use this when you need to know what animation effects are available and how to use them.

Parameters:
- animationType: "entrance", "exit", "emphasis", or "all" (default: "all")
- effect: Get detailed docs for a specific effect (optional)

Examples:
- get_animation_docs({ animationType: "entrance" })
- get_animation_docs({ effect: "fadeIn" })
- get_animation_docs({}) - lists all animations`,
  inputSchema: zodToJsonSchema(GetAnimationDocsInputSchema),
};

const ANIMATION_DOCS = {
  entrance: {
    description: 'Animations that introduce elements into the scene',
    effects: {
      fadeIn: {
        description: 'Fade in from transparent to opaque',
        duration: '15-30 frames typical',
        easing: 'easeOutCubic recommended',
      },
      fadeInUp: {
        description: 'Fade in while moving up',
        duration: '20-30 frames typical',
        easing: 'easeOutCubic recommended',
      },
      fadeInDown: {
        description: 'Fade in while moving down',
        duration: '20-30 frames typical',
        easing: 'easeOutCubic recommended',
      },
      slideInUp: {
        description: 'Slide in from bottom',
        duration: '20-40 frames typical',
        easing: 'easeOutCubic or easeOutBack recommended',
      },
      slideInDown: {
        description: 'Slide in from top',
        duration: '20-40 frames typical',
        easing: 'easeOutCubic or easeOutBack recommended',
      },
      slideInLeft: {
        description: 'Slide in from left',
        duration: '20-40 frames typical',
        easing: 'easeOutCubic recommended',
      },
      slideInRight: {
        description: 'Slide in from right',
        duration: '20-40 frames typical',
        easing: 'easeOutCubic recommended',
      },
      scaleIn: {
        description: 'Scale up from zero',
        duration: '15-25 frames typical',
        easing: 'easeOutBack for bounce effect',
      },
      zoomIn: {
        description: 'Zoom in with slight rotation',
        duration: '20-30 frames typical',
        easing: 'easeOutCubic recommended',
      },
      rotateIn: {
        description: 'Rotate in while fading',
        duration: '25-40 frames typical',
        easing: 'easeOutBack recommended',
      },
      bounceIn: {
        description: 'Bounce in with spring effect',
        duration: '30-50 frames typical',
        easing: 'easeOutBack or easeOutBounce recommended',
      },
    },
    example: {
      type: 'entrance',
      effect: 'fadeIn',
      delay: 30,
      duration: 20,
      easing: 'easeOutCubic',
    },
  },
  exit: {
    description: 'Animations that remove elements from the scene',
    effects: {
      fadeOut: {
        description: 'Fade out from opaque to transparent',
        duration: '15-30 frames typical',
        easing: 'easeInCubic recommended',
      },
      fadeOutUp: {
        description: 'Fade out while moving up',
        duration: '20-30 frames typical',
        easing: 'easeInCubic recommended',
      },
      fadeOutDown: {
        description: 'Fade out while moving down',
        duration: '20-30 frames typical',
        easing: 'easeInCubic recommended',
      },
      slideOutUp: {
        description: 'Slide out to top',
        duration: '20-40 frames typical',
        easing: 'easeInCubic recommended',
      },
      slideOutDown: {
        description: 'Slide out to bottom',
        duration: '20-40 frames typical',
        easing: 'easeInCubic recommended',
      },
      slideOutLeft: {
        description: 'Slide out to left',
        duration: '20-40 frames typical',
        easing: 'easeInCubic recommended',
      },
      slideOutRight: {
        description: 'Slide out to right',
        duration: '20-40 frames typical',
        easing: 'easeInCubic recommended',
      },
      scaleOut: {
        description: 'Scale down to zero',
        duration: '15-25 frames typical',
        easing: 'easeInBack for anticipation',
      },
      zoomOut: {
        description: 'Zoom out with slight rotation',
        duration: '20-30 frames typical',
        easing: 'easeInCubic recommended',
      },
      rotateOut: {
        description: 'Rotate out while fading',
        duration: '25-40 frames typical',
        easing: 'easeInBack recommended',
      },
    },
    example: {
      type: 'exit',
      effect: 'fadeOut',
      delay: 120,
      duration: 20,
      easing: 'easeInCubic',
    },
  },
  emphasis: {
    description: 'Animations that draw attention to existing elements',
    effects: {
      pulse: {
        description: 'Scale up and down repeatedly',
        duration: '30-60 frames typical',
        easing: 'easeInOutCubic recommended',
      },
      shake: {
        description: 'Shake horizontally',
        duration: '20-40 frames typical',
        easing: 'linear recommended',
      },
      bounce: {
        description: 'Bounce up and down',
        duration: '30-60 frames typical',
        easing: 'easeOutBounce recommended',
      },
      swing: {
        description: 'Swing like a pendulum',
        duration: '40-60 frames typical',
        easing: 'easeInOutSine recommended',
      },
      wobble: {
        description: 'Wobble rotation back and forth',
        duration: '30-50 frames typical',
        easing: 'easeInOutSine recommended',
      },
      flash: {
        description: 'Flash opacity on and off',
        duration: '20-40 frames typical',
        easing: 'linear recommended',
      },
      rubberBand: {
        description: 'Stretch and squash like rubber',
        duration: '40-60 frames typical',
        easing: 'easeInOutCubic recommended',
      },
      heartbeat: {
        description: 'Pulse with heartbeat rhythm',
        duration: '60-90 frames typical',
        easing: 'easeInOutQuad recommended',
      },
      float: {
        description: 'Float up and down smoothly',
        duration: '60-120 frames typical',
        easing: 'easeInOutSine recommended',
      },
      spin: {
        description: 'Continuous rotation',
        duration: '60-120 frames typical',
        easing: 'linear recommended',
      },
    },
    example: {
      type: 'emphasis',
      effect: 'pulse',
      delay: 60,
      duration: 40,
      easing: 'easeInOutCubic',
    },
  },
};

export async function executeGetAnimationDocs(args: unknown): Promise<string> {
  try {
    const input = GetAnimationDocsInputSchema.parse(args);
    const animationType = input.animationType?.toLowerCase() || 'all';
    const effect = input.effect?.toLowerCase();

    logger.info('Getting animation documentation', { animationType, effect });

    // If specific effect requested, find it
    if (effect) {
      for (const [type, data] of Object.entries(ANIMATION_DOCS)) {
        if (data.effects[effect as keyof typeof data.effects]) {
          const effectData = data.effects[effect as keyof typeof data.effects] as any;
          return JSON.stringify({
            effect,
            type,
            description: effectData.description,
            duration: effectData.duration,
            easing: effectData.easing,
            usage: {
              type,
              effect,
              delay: 30,
              duration: 20,
              easing: 'easeOutCubic',
            },
            notes: [
              `Delay and duration are in FRAMES (at 30fps: 30 frames = 1 second)`,
              `Typical delay: 0-60 frames (0-2 seconds)`,
              `Combine with easing functions for smooth motion`,
            ],
          }, null, 2);
        }
      }

      return JSON.stringify({
        error: `Unknown animation effect: ${effect}`,
        suggestion: 'Use get_animation_docs({ animationType: "entrance" }) to list available effects',
      }, null, 2);
    }

    // Return all or specific type
    if (animationType === 'all') {
      const summary = {
        entrance: Object.keys(ANIMATION_DOCS.entrance.effects),
        exit: Object.keys(ANIMATION_DOCS.exit.effects),
        emphasis: Object.keys(ANIMATION_DOCS.emphasis.effects),
      };

      return JSON.stringify({
        animations: summary,
        total: {
          entrance: summary.entrance.length,
          exit: summary.exit.length,
          emphasis: summary.emphasis.length,
        },
        usage: {
          structure: {
            type: 'entrance | exit | emphasis',
            effect: 'fadeIn | slideUp | pulse | ...',
            delay: 'number (frames)',
            duration: 'number (frames)',
            easing: 'easeOutCubic | linear | ...',
          },
          example: ANIMATION_DOCS.entrance.example,
          notes: [
            'Add animations array to any layer',
            'Multiple animations can be applied to one layer',
            'Timing is in FRAMES: 30 frames = 1 second at 30fps',
            'Use get_animation_docs({ effect: "fadeIn" }) for specific effect details',
          ],
        },
      }, null, 2);
    }

    const typeData = ANIMATION_DOCS[animationType as keyof typeof ANIMATION_DOCS];
    if (!typeData) {
      return JSON.stringify({
        error: `Unknown animation type: ${animationType}`,
        available: ['entrance', 'exit', 'emphasis', 'all'],
      }, null, 2);
    }

    return JSON.stringify({
      type: animationType,
      description: typeData.description,
      effects: typeData.effects,
      example: typeData.example,
      notes: [
        'Delay and duration are in FRAMES (at 30fps: 30 frames = 1 second)',
        'Combine with easing functions for smooth motion',
        `Use get_animation_docs({ effect: "fadeIn" }) for specific effect details`,
      ],
    }, null, 2);
  } catch (error) {
    logger.error('Failed to get animation docs', { error });

    if (error instanceof z.ZodError) {
      return JSON.stringify({
        error: 'Invalid input',
        details: error.errors,
      }, null, 2);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      error: 'Failed to get animation documentation',
      details: errorMessage,
    }, null, 2);
  }
}
