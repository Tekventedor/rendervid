---
name: list_examples
description: Browse the collection of 50+ ready-to-use Rendervid template examples.

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
After finding an example, use get_example to load its template and customize it.
tags: [templates, examples, mcp, rendervid]
category: examples
---

# list_examples

Browse the collection of 50+ ready-to-use Rendervid template examples.

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
After finding an example, use get_example to load its template and customize it.

## When to Use

Use this tool when you need to:
- Browse available template examples
- Filter examples by category
- Discover ready-to-use templates
- Learn from example implementations

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string |  |  |


## Input Schema

```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string"
    }
  },
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

## Examples


## Related Tools

- [`get_example`](./get_example.md)
- [`get_capabilities`](./get_capabilities.md)

## Error Handling

This tool provides detailed error messages when:
- Invalid template structure
- Missing required parameters
- Unsupported formats or options
- File system errors

Always check the returned error messages for troubleshooting guidance.

## Best Practices

