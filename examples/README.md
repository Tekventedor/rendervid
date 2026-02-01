# Rendervid Examples

This directory contains runnable examples demonstrating how to create videos and images with Rendervid.

## Quick Start

```bash
# Install dependencies
pnpm install

# List all available examples
pnpm run examples:list

# Render a specific example
pnpm run examples:render getting-started/01-hello-world

# Render with custom output path
pnpm run examples:render instagram-story --output ./my-story.mp4
```

## Example Categories

### Getting Started
Simple examples to learn the basics:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./getting-started/01-hello-world/preview.gif) | [01-hello-world](./getting-started/01-hello-world/) | Minimal text animation | Video |
| ![](./getting-started/02-first-video/preview.gif) | [02-first-video](./getting-started/02-first-video/) | Simple 5-second video with text | Video |
| ![](./getting-started/03-first-image/preview.png) | [03-first-image](./getting-started/03-first-image/) | Social media image generator | Image |
| ![](./getting-started/04-image-slideshow/preview.gif) | [04-image-slideshow](./getting-started/04-image-slideshow/) | Slideshow with fade transitions | Video |

### Social Media
Ready-to-use templates for social platforms:

| Preview | Example | Dimensions | Platform |
|---------|---------|------------|----------|
| ![](./social-media/instagram-story/preview.gif) | [instagram-story](./social-media/instagram-story/) | 1080x1920 (9:16) | Instagram Stories |
| ![](./social-media/instagram-post/preview.gif) | [instagram-post](./social-media/instagram-post/) | 1080x1080 (1:1) | Instagram Feed |
| ![](./social-media/youtube-thumbnail/preview.png) | [youtube-thumbnail](./social-media/youtube-thumbnail/) | 1280x720 (16:9) | YouTube |
| ![](./social-media/tiktok-video/preview.gif) | [tiktok-video](./social-media/tiktok-video/) | 1080x1920 (9:16) | TikTok |
| ![](./social-media/twitter-card/preview.gif) | [twitter-card](./social-media/twitter-card/) | 1200x630 | Twitter/X |
| ![](./social-media/linkedin-banner/preview.gif) | [linkedin-banner](./social-media/linkedin-banner/) | 1584x396 | LinkedIn |

### Marketing
Templates for marketing and promotional content:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./marketing/product-showcase/preview.gif) | [product-showcase](./marketing/product-showcase/) | Feature product with details | Video |
| ![](./marketing/sale-announcement/preview.gif) | [sale-announcement](./marketing/sale-announcement/) | Promotional sale video | Video |
| ![](./marketing/testimonial-video/preview.gif) | [testimonial-video](./marketing/testimonial-video/) | Customer testimonial | Video |
| ![](./marketing/before-after/preview.gif) | [before-after](./marketing/before-after/) | Before/after comparison | Video |
| ![](./marketing/logo-reveal/preview.gif) | [logo-reveal](./marketing/logo-reveal/) | Animated logo reveal | Video |
| ![](./marketing/pricing-table/preview.gif) | [pricing-table](./marketing/pricing-table/) | 3-tier pricing comparison | Video |

### Data Visualization
Animated data visualizations:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./data-visualization/animated-bar-chart/preview.gif) | [animated-bar-chart](./data-visualization/animated-bar-chart/) | Animated bar chart | Video |
| ![](./data-visualization/line-graph/preview.gif) | [line-graph](./data-visualization/line-graph/) | Animated line graph | Video |
| ![](./data-visualization/pie-chart/preview.gif) | [pie-chart](./data-visualization/pie-chart/) | Pie chart reveal | Video |
| ![](./data-visualization/counter-animation/preview.gif) | [counter-animation](./data-visualization/counter-animation/) | Counting numbers | Video |
| ![](./data-visualization/progress-dashboard/preview.gif) | [progress-dashboard](./data-visualization/progress-dashboard/) | Progress indicators | Video |

### Advanced
Advanced animation techniques:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./advanced/parallax-effect/preview.gif) | [parallax-effect](./advanced/parallax-effect/) | Multi-layer depth illusion | Video |
| ![](./advanced/kinetic-typography/preview.gif) | [kinetic-typography](./advanced/kinetic-typography/) | Dynamic text animations | Video |

### E-commerce
Templates for online stores and sales:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./ecommerce/flash-sale/preview.gif) | [flash-sale](./ecommerce/flash-sale/) | Urgency countdown sale | Video |
| ![](./ecommerce/product-launch/preview.gif) | [product-launch](./ecommerce/product-launch/) | New product announcement | Video |
| ![](./ecommerce/product-comparison/preview.gif) | [product-comparison](./ecommerce/product-comparison/) | Side-by-side comparison | Video |
| ![](./ecommerce/discount-reveal/preview.gif) | [discount-reveal](./ecommerce/discount-reveal/) | Promo code reveal | Video |

### Events
Templates for event announcements:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./events/event-countdown/preview.gif) | [event-countdown](./events/event-countdown/) | Days/hours/minutes countdown | Video |
| ![](./events/save-the-date/preview.gif) | [save-the-date](./events/save-the-date/) | Elegant invitation style | Video |
| ![](./events/webinar-promo/preview.gif) | [webinar-promo](./events/webinar-promo/) | Speaker + topic + date | Video |
| ![](./events/conference-intro/preview.gif) | [conference-intro](./events/conference-intro/) | Speaker introduction card | Video |

### Content Creation
Templates for content creators:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./content/podcast-teaser/preview.gif) | [podcast-teaser](./content/podcast-teaser/) | Episode preview with waveform | Video |
| ![](./content/blog-promo/preview.gif) | [blog-promo](./content/blog-promo/) | Blog post promotion | Video |
| ![](./content/quote-card/preview.gif) | [quote-card](./content/quote-card/) | Inspirational quote design | Video |
| ![](./content/news-headline/preview.gif) | [news-headline](./content/news-headline/) | Breaking news style | Video |

### Education
Templates for educational content:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./education/course-intro/preview.gif) | [course-intro](./education/course-intro/) | Course title + instructor | Video |
| ![](./education/lesson-title/preview.gif) | [lesson-title](./education/lesson-title/) | Chapter/lesson title card | Video |
| ![](./education/certificate/preview.gif) | [certificate](./education/certificate/) | Achievement certificate | Video |

### Real Estate
Templates for property listings:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./real-estate/property-listing/preview.gif) | [property-listing](./real-estate/property-listing/) | Property details card | Video |
| ![](./real-estate/price-drop/preview.gif) | [price-drop](./real-estate/price-drop/) | Price reduction alert | Video |
| ![](./real-estate/open-house/preview.gif) | [open-house](./real-estate/open-house/) | Open house announcement | Video |

### Streaming
Templates for streamers and gamers:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./streaming/stream-starting/preview.gif) | [stream-starting](./streaming/stream-starting/) | "Starting Soon" screen | Video |
| ![](./streaming/end-screen/preview.gif) | [end-screen](./streaming/end-screen/) | Subscribe/follow CTA | Video |
| ![](./streaming/highlight-intro/preview.gif) | [highlight-intro](./streaming/highlight-intro/) | Game highlight intro | Video |

### Fitness
Templates for fitness content:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./fitness/workout-timer/preview.gif) | [workout-timer](./fitness/workout-timer/) | Exercise interval timer | Video |
| ![](./fitness/progress-tracker/preview.gif) | [progress-tracker](./fitness/progress-tracker/) | Weekly/monthly progress | Video |

### Food & Restaurant
Templates for restaurants and food content:

| Preview | Example | Description | Output |
|---------|---------|-------------|--------|
| ![](./food/menu-item/preview.gif) | [menu-item](./food/menu-item/) | Dish showcase with price | Video |
| ![](./food/daily-special/preview.gif) | [daily-special](./food/daily-special/) | Today's special promotion | Video |
| ![](./food/recipe-card/preview.gif) | [recipe-card](./food/recipe-card/) | Recipe title card | Video |

## CLI Commands

### List Examples
```bash
pnpm run examples:list
```
Shows all available examples with descriptions.

### Preview Example
```bash
pnpm run examples:preview <example-path>
```
Opens a live preview in your browser.

### Render Example
```bash
pnpm run examples:render <example-path> [options]

Options:
  --output, -o    Output file path (default: ./output/<example-name>.<ext>)
  --format, -f    Output format: mp4, webm, gif (default: mp4)
  --quality, -q   Quality: low, medium, high (default: high)
```

### Generate All Previews
```bash
pnpm run examples:generate-previews
```
Regenerates all preview GIFs and thumbnails (used in CI).

## Template Structure

Each example follows this structure:

```
example-name/
├── README.md           # Tutorial and documentation
├── template.json       # The Rendervid template
├── preview.gif         # Animated preview for videos (auto-generated)
├── preview.png         # Static preview for images (auto-generated)
└── assets/             # Optional: SVG images, fonts, etc.
    └── icon.svg
```

## Creating Your Own Examples

1. Create a new directory under the appropriate category
2. Create a `template.json` with your Rendervid template
3. Create a `render.ts` script for rendering
4. Add a `README.md` with documentation
5. Run `pnpm run examples:generate-previews` to create preview assets

## Template JSON Format

```json
{
  "name": "My Template",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 5
  },
  "inputs": [
    {
      "key": "title",
      "type": "string",
      "label": "Title",
      "description": "Main headline text",
      "required": true,
      "default": "Hello World"
    }
  ],
  "composition": {
    "scenes": [
      {
        "id": "main",
        "startFrame": 0,
        "endFrame": 150,
        "layers": [
          {
            "id": "title",
            "type": "text",
            "position": { "x": 960, "y": 540 },
            "size": { "width": 800, "height": 100 },
            "props": {
              "text": "{{title}}",
              "fontSize": 72,
              "fontWeight": "bold",
              "color": "#FFFFFF",
              "textAlign": "center"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
                "delay": 0,
                "duration": 30
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Learn More

- [Rendervid Documentation](../README.md)
- [Template Reference](../packages/core/README.md)
- [Animation Presets](../packages/core/src/animation/presets.ts)
- [Theme System](../packages/templates/src/themes/)
