import { zodToJsonSchema } from 'zod-to-json-schema';
import { ListExamplesInputSchema } from '../types.js';
import { listAllExamples, getExampleCategories } from '../utils/examples.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('list_examples');

export const listExamplesTool = {
  name: 'list_examples',
  description: `Browse the collection of 50+ ready-to-use Rendervid template examples.

This tool lists available example templates organized by category. Each example includes:
- name: Template name
- category: Category (getting-started, social-media, marketing, etc.)
- path: Path to use with get_example tool
- description: What the template does
- outputType: 'video' or 'image'
- dimensions: Output resolution (e.g., "1920x1080")

**Categories:**
- getting-started: Simple examples to learn basics (Hello World, First Video, etc.)
- social-media: Platform-specific templates (Instagram, TikTok, YouTube, Twitter, LinkedIn)
- marketing: Promotional content (Product Showcase, Sale Announcement, Testimonials, Logo Reveal)
- data-visualization: Animated charts (Bar Chart, Line Graph, Pie Chart, Counter, Dashboard)
- ecommerce: Online store content (Flash Sale, Product Launch, Comparison, Discount)
- events: Event announcements (Countdown, Save the Date, Webinar, Conference)
- content: Creator content (Podcast Teaser, Blog Promo, Quote Card, News Headline)
- education: Educational content (Course Intro, Lesson Title, Certificate)
- real-estate: Property listings (Listing, Price Drop, Open House)
- streaming: Streamer content (Stream Starting, End Screen, Highlight Intro)
- fitness: Fitness content (Workout Timer, Progress Tracker)
- food: Restaurant content (Menu Item, Daily Special, Recipe Card)
- advanced: Advanced techniques (Parallax, Kinetic Typography)
- showcase: Feature demonstrations (All Fonts, All Animations, All Easing, etc.)

Use the category parameter to filter by category, or omit to see all examples.
After finding an example, use get_example to load its template and customize it.`,
  inputSchema: zodToJsonSchema(ListExamplesInputSchema),
};

export async function executeListExamples(args: unknown): Promise<string> {
  try {
    // Parse input
    const input = ListExamplesInputSchema.parse(args);

    logger.info('Listing examples', { category: input.category || 'all' });

    // Get examples
    const examples = await listAllExamples(input.category);

    // Group by category for better display
    const byCategory: Record<string, typeof examples> = {};

    for (const example of examples) {
      if (!byCategory[example.category]) {
        byCategory[example.category] = [];
      }
      byCategory[example.category].push(example);
    }

    // Get all categories for reference
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
        message: 'Use get_example with the "path" field to load a specific example template',
        example: 'get_example({ examplePath: "getting-started/01-hello-world" })',
      },
    }, null, 2);
  } catch (error) {
    logger.error('Failed to list examples', { error });

    const errorMessage = error instanceof Error ? error.message : String(error);

    return JSON.stringify({
      error: 'Failed to list examples',
      details: errorMessage,
    }, null, 2);
  }
}
