import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('get_easing_docs');

const GetEasingDocsInputSchema = z.object({
  category: z.string().optional().describe('Easing category: "basic", "in", "out", "inout", "back", "bounce", "elastic", or "all"'),
});

export const getEasingDocsTool = {
  name: 'get_easing_docs',
  description: `Get documentation for easing functions (motion curves).

Easing functions control the speed/acceleration of animations over time.

Categories:
- basic: Simple linear easing
- in: Start slow, end fast (acceleration)
- out: Start fast, end slow (deceleration) - RECOMMENDED for most animations
- inout: Start and end slow, fast in middle
- back: Overshoot and return (anticipation/follow-through)
- bounce: Bouncing effect
- elastic: Springy, elastic effect

Examples:
- get_easing_docs({ category: "out" }) - Most commonly used
- get_easing_docs({ category: "all" }) - List all easings`,
  inputSchema: zodToJsonSchema(GetEasingDocsInputSchema),
};

const EASING_DOCS = {
  basic: {
    description: 'Simple linear easing with constant speed',
    easings: {
      linear: {
        description: 'Constant speed from start to end',
        use: 'Mechanical movements, continuous rotations',
        curve: 'Straight line',
      },
    },
  },
  in: {
    description: 'Start slow, accelerate to fast (ease in)',
    easings: {
      easeInQuad: {
        description: 'Quadratic acceleration',
        use: 'Objects falling, entering with weight',
        curve: 'Gentle acceleration',
      },
      easeInCubic: {
        description: 'Cubic acceleration - smooth and natural',
        use: 'Exit animations, objects moving away',
        curve: 'Medium acceleration',
      },
      easeInQuart: {
        description: 'Quartic acceleration',
        use: 'Heavy, weighty movements',
        curve: 'Strong acceleration',
      },
      easeInQuint: {
        description: 'Quintic acceleration',
        use: 'Very heavy objects',
        curve: 'Very strong acceleration',
      },
      easeInSine: {
        description: 'Sinusoidal acceleration',
        use: 'Smooth, gentle starts',
        curve: 'Gentle sine curve',
      },
      easeInExpo: {
        description: 'Exponential acceleration',
        use: 'Dramatic, explosive starts',
        curve: 'Dramatic acceleration',
      },
      easeInCirc: {
        description: 'Circular acceleration',
        use: 'Smooth, natural movements',
        curve: 'Circular curve',
      },
    },
  },
  out: {
    description: 'Start fast, decelerate to slow (ease out) - MOST COMMON',
    easings: {
      easeOutQuad: {
        description: 'Quadratic deceleration',
        use: 'Gentle entrances, UI elements appearing',
        curve: 'Gentle deceleration',
        recommended: true,
      },
      easeOutCubic: {
        description: 'Cubic deceleration - very natural and commonly used',
        use: 'DEFAULT CHOICE for most entrance animations',
        curve: 'Medium deceleration',
        recommended: true,
      },
      easeOutQuart: {
        description: 'Quartic deceleration',
        use: 'Smooth, settling movements',
        curve: 'Strong deceleration',
      },
      easeOutQuint: {
        description: 'Quintic deceleration',
        use: 'Very smooth stops',
        curve: 'Very strong deceleration',
      },
      easeOutSine: {
        description: 'Sinusoidal deceleration',
        use: 'Gentle, flowing movements',
        curve: 'Gentle sine curve',
        recommended: true,
      },
      easeOutExpo: {
        description: 'Exponential deceleration',
        use: 'Dramatic stops, zoom effects',
        curve: 'Dramatic deceleration',
      },
      easeOutCirc: {
        description: 'Circular deceleration',
        use: 'Natural, smooth stops',
        curve: 'Circular curve',
      },
    },
  },
  inout: {
    description: 'Start and end slow, fast in middle (ease in-out)',
    easings: {
      easeInOutQuad: {
        description: 'Quadratic in-out',
        use: 'Smooth transitions between states',
        curve: 'S-curve, gentle',
      },
      easeInOutCubic: {
        description: 'Cubic in-out - natural and balanced',
        use: 'Emphasis animations, continuous movements',
        curve: 'S-curve, medium',
        recommended: true,
      },
      easeInOutQuart: {
        description: 'Quartic in-out',
        use: 'Smooth, weighty movements',
        curve: 'S-curve, strong',
      },
      easeInOutQuint: {
        description: 'Quintic in-out',
        use: 'Very smooth transitions',
        curve: 'S-curve, very strong',
      },
      easeInOutSine: {
        description: 'Sinusoidal in-out',
        use: 'Gentle, flowing transitions',
        curve: 'Smooth S-curve',
        recommended: true,
      },
      easeInOutExpo: {
        description: 'Exponential in-out',
        use: 'Dramatic movements',
        curve: 'Steep S-curve',
      },
      easeInOutCirc: {
        description: 'Circular in-out',
        use: 'Natural transitions',
        curve: 'Circular S-curve',
      },
    },
  },
  back: {
    description: 'Overshoot target then return (anticipation/follow-through)',
    easings: {
      easeInBack: {
        description: 'Pull back before accelerating forward',
        use: 'Anticipation before movement, wind-up effects',
        curve: 'Goes negative before positive',
      },
      easeOutBack: {
        description: 'Overshoot then settle - playful and bouncy',
        use: 'POPULAR for entrance animations, playful UI',
        curve: 'Overshoots then returns',
        recommended: true,
      },
      easeInOutBack: {
        description: 'Pull back, overshoot, then settle',
        use: 'Exaggerated, cartoon-style movements',
        curve: 'Overshoots both ends',
      },
    },
  },
  bounce: {
    description: 'Bouncing ball physics',
    easings: {
      easeInBounce: {
        description: 'Bounce before accelerating',
        use: 'Bounce before entering',
        curve: 'Multiple bounces at start',
      },
      easeOutBounce: {
        description: 'Bounce after landing - very playful',
        use: 'Bouncing entrances, playful UI elements',
        curve: 'Multiple bounces at end',
        recommended: true,
      },
      easeInOutBounce: {
        description: 'Bounce at both ends',
        use: 'Exaggerated bouncy effects',
        curve: 'Bounces at start and end',
      },
    },
  },
  elastic: {
    description: 'Spring/elastic physics - overshoots multiple times',
    easings: {
      easeInElastic: {
        description: 'Elastic wind-up',
        use: 'Spring loading, elastic pull-back',
        curve: 'Oscillates before moving',
      },
      easeOutElastic: {
        description: 'Elastic spring forward - very bouncy',
        use: 'Spring-loaded entrances, elastic UI',
        curve: 'Oscillates after moving',
        recommended: false,
        note: 'Use sparingly - can be too much',
      },
      easeInOutElastic: {
        description: 'Elastic at both ends',
        use: 'Extreme elastic effects',
        curve: 'Oscillates at both ends',
        recommended: false,
        note: 'Very exaggerated - rarely needed',
      },
    },
  },
};

const QUICK_RECOMMENDATIONS = {
  'entrance-animations': 'easeOutCubic or easeOutBack',
  'exit-animations': 'easeInCubic',
  'emphasis-animations': 'easeInOutCubic or easeInOutSine',
  'playful-ui': 'easeOutBack or easeOutBounce',
  'smooth-professional': 'easeOutCubic or easeOutQuad',
  'mechanical': 'linear',
  'dramatic': 'easeOutExpo or easeInExpo',
};

export async function executeGetEasingDocs(args: unknown): Promise<string> {
  try {
    const input = GetEasingDocsInputSchema.parse(args);
    const category = input.category?.toLowerCase() || 'all';

    logger.info('Getting easing documentation', { category });

    if (category === 'all') {
      const allEasings: Record<string, string[]> = {};
      let total = 0;

      for (const [cat, data] of Object.entries(EASING_DOCS)) {
        allEasings[cat] = Object.keys(data.easings);
        total += allEasings[cat].length;
      }

      return JSON.stringify({
        easings: allEasings,
        total,
        quickRecommendations: QUICK_RECOMMENDATIONS,
        mostCommon: [
          'easeOutCubic - Best default for entrances',
          'easeInCubic - Best default for exits',
          'easeInOutCubic - Best default for emphasis',
          'easeOutBack - Playful, bouncy entrances',
          'linear - Continuous motion',
        ],
        usage: {
          example: {
            type: 'entrance',
            effect: 'fadeIn',
            delay: 30,
            duration: 20,
            easing: 'easeOutCubic',
          },
          note: 'Easing is optional - defaults to linear if not specified',
        },
      }, null, 2);
    }

    const categoryData = EASING_DOCS[category as keyof typeof EASING_DOCS];
    if (!categoryData) {
      return JSON.stringify({
        error: `Unknown easing category: ${category}`,
        available: ['basic', 'in', 'out', 'inout', 'back', 'bounce', 'elastic', 'all'],
        suggestion: 'Use category: "out" for most entrance animations',
      }, null, 2);
    }

    const response: any = {
      category,
      description: categoryData.description,
      easings: categoryData.easings,
      count: Object.keys(categoryData.easings).length,
    };

    // Add recommendations for this category
    if (category === 'out') {
      response.note = 'RECOMMENDED category for most entrance animations';
      response.topPicks = ['easeOutCubic', 'easeOutBack', 'easeOutQuad'];
    } else if (category === 'in') {
      response.note = 'Best for exit animations';
      response.topPicks = ['easeInCubic'];
    } else if (category === 'inout') {
      response.note = 'Best for emphasis animations';
      response.topPicks = ['easeInOutCubic', 'easeInOutSine'];
    }

    return JSON.stringify(response, null, 2);
  } catch (error) {
    logger.error('Failed to get easing docs', { error });

    if (error instanceof z.ZodError) {
      return JSON.stringify({
        error: 'Invalid input',
        details: error.errors,
      }, null, 2);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      error: 'Failed to get easing documentation',
      details: errorMessage,
    }, null, 2);
  }
}
