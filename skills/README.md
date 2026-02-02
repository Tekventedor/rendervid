# Rendervid MCP Skills

Auto-generated documentation for the Rendervid Model Context Protocol (MCP) server.

**Generated:** 2026-02-02T05:40:05.602Z

## Overview

The Rendervid MCP server provides 6 tools that enable AI agents to generate videos and images from JSON templates.

## Available Skills


### Discovery

- [`get_capabilities`](./get_capabilities.md) - Discover all available features and capabilities of the Rendervid engine.

This tool returns a comprehensive overview of what Rendervid can do, including:

**Layer Types:**
- text: Rich text with typography, fonts, alignment
- image: Display images with fit options (cover, contain, fill)
- video: Play video clips with timing controls
- shape: Rectangles, ellipses, polygons, stars, paths
- audio: Background music and sound effects
- group: Container for organizing layers
- lottie: Lottie animations
- custom: Custom React components

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
The capabilities object includes detailed schemas and examples for each element type.

### Examples

- [`get_example`](./get_example.md) - Load a specific example template by path.

This tool retrieves a complete example template including:
- template: The full Rendervid JSON template ready to use
- readme: Documentation explaining how the template works (if available)
- path: The example path for reference

The template can be used immediately with render_video or render_image tools.
You can also modify the template's inputs or structure before rendering.

**Example paths format:**
category/example-name

**Common examples:**
- getting-started/01-hello-world: Simplest template, animated text
- getting-started/02-first-video: Basic 5-second video
- social-media/instagram-story: 1080x1920 Instagram story template
- social-media/youtube-thumbnail: 1280x720 YouTube thumbnail
- marketing/product-showcase: Product feature video
- data-visualization/animated-bar-chart: Animated bar chart

**Using the template:**
1. Load example: get_example({ examplePath: "category/name" })
2. Review template structure and inputs
3. Customize inputs with your own values
4. Render with render_video or render_image

**Customizing:**
Templates have an "inputs" array defining what can be customized.
Each input has a key, type, label, and default value.
Pass your custom values to the inputs parameter when rendering.

Example:
{
  "inputs": [
    { "key": "title", "type": "string", "default": "Hello" },
    { "key": "color", "type": "color", "default": "#3B82F6" }
  ]
}

Render with: { inputs: { title: "My Title", color: "#FF0000" } }
- [`list_examples`](./list_examples.md) - Browse the collection of 50+ ready-to-use Rendervid template examples.

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

### Rendering

- [`render_image`](./render_image.md) - Generate a single image from a Rendervid template.

This tool renders a static image by:
1. Accepting a Rendervid template (same JSON structure as video templates)
2. Rendering a specific frame (default: frame 0)
3. Exporting as PNG, JPEG, or WebP

Ideal for:
- Social media images (Instagram posts, Twitter cards, LinkedIn banners)
- Thumbnails (YouTube, blog posts, video covers)
- Static graphics (quotes, announcements, infographics)
- Previewing video frames

You can use the same template for both video and image output.
For video templates, specify which frame to capture (0-based index).
For image templates (output.type: "image"), the frame parameter is ignored.

The template format is identical to video templates, supporting:
- Multiple layers (text, images, shapes)
- Animations (will be evaluated at the specified frame)
- Dynamic inputs
- Full styling capabilities

Example use:
- Render frame 0 of a video template as a thumbnail
- Generate social media post images with custom text
- Create preview images for video content
- [`render_video`](./render_video.md) - Generate a video file from a Rendervid JSON template.

This tool renders a complete video by:
1. Accepting a Rendervid template (JSON structure defining scenes, layers, animations)
2. Merging provided input values with template defaults
3. Rendering all frames using a headless browser
4. Encoding frames into a video file using FFmpeg

The template uses a declarative JSON format that describes:
- Output dimensions, FPS, and duration
- Dynamic inputs (variables that can be customized)
- Scenes with layers (text, images, shapes, video, audio)
- Animations (entrance, exit, emphasis effects with 40+ presets)
- Easing functions (30+ options for smooth motion)

Common use cases:
- Social media content (Instagram stories, TikTok videos, YouTube thumbnails)
- Marketing videos (product showcases, sale announcements, testimonials)
- Data visualizations (animated charts, graphs, dashboards)
- Educational content (course intros, lesson titles)

The output path will be created automatically. You can specify format, quality, and FPS.
Rendering progress is reported with frame counts and time estimates.

Example template structure:
{
  "name": "My Video",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5 },
  "inputs": [{ "key": "title", "type": "string", "label": "Title", "default": "Hello" }],
  "composition": { "scenes": [{ "id": "main", "startFrame": 0, "endFrame": 150, "layers": [...] }] }
}

### Validation

- [`validate_template`](./validate_template.md) - Validate a Rendervid template JSON structure.

This tool performs comprehensive validation of a template to ensure it's properly formatted and ready for rendering.

Validation checks include:
- Template structure (name, output, composition)
- Output configuration (type, dimensions, fps, duration)
- Input definitions (keys, types, defaults)
- Scene structure (IDs, frame ranges)
- Layer configuration (types, positions, sizes, props)
- Animation definitions (types, effects, timing, easing)
- Component references and props
- Data consistency (frame ranges, input references)

Returns:
- valid: boolean indicating if template is valid
- errors: array of validation errors (if any)
- warnings: array of validation warnings (if any)

Use this before rendering to catch issues early, or when:
- Creating new templates
- Modifying existing templates
- Debugging template issues
- Verifying AI-generated templates

The validator provides detailed error messages with paths to help fix issues quickly.

## Installation

See the [main MCP server documentation](../mcp/README.md) for installation instructions.

## Usage

Each skill is designed to be used by AI agents through the MCP protocol. The skills can be:

1. **Discovered** using `get_capabilities`
2. **Explored** using `list_examples`
3. **Used** through the rendering tools
4. **Validated** using `validate_template`

## Documentation Structure

- Individual tool documentation: `[tool-name].md`
- Skills registry: `skills-registry.json`
- This README: `README.md`

## Updating Documentation

This documentation is auto-generated from the source code. To update:

```bash
cd mcp
pnpm generate:skills
```

The script reads tool definitions from `mcp/src/tools/` and generates:
- Individual skill Markdown files
- Skills registry JSON
- This README

## Contributing

To add a new skill:

1. Create a new tool file in `mcp/src/tools/`
2. Export a tool definition with `name`, `description`, and `inputSchema`
3. Run `pnpm generate:skills` to update documentation

## Related Resources

- [MCP Server Documentation](../mcp/README.md)
- [Rendervid Core Documentation](https://github.com/QualityUnit/rendervid)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
