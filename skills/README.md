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

### Quick Start

1. **Prerequisites**
   ```bash
   # Install FFmpeg (required for video rendering)
   brew install ffmpeg  # macOS
   sudo apt install ffmpeg  # Ubuntu/Debian
   choco install ffmpeg  # Windows
   ```

2. **Build the MCP Server**
   ```bash
   cd mcp
   pnpm install
   pnpm build
   ```

3. **Configure Your AI Editor** (see sections below)

For detailed installation instructions, see the [main MCP server documentation](../mcp/README.md).

---

## Using Rendervid Skills in AI Editors

The Rendervid MCP server enables you to generate videos and images using natural language in your favorite AI editor. Here's how to set it up:

### Claude Desktop

1. **Open Claude Desktop config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add Rendervid MCP server:**
   ```json
   {
     "mcpServers": {
       "rendervid": {
         "command": "node",
         "args": ["/absolute/path/to/rendervid/mcp/build/index.js"]
       }
     }
   }
   ```

3. **Restart Claude Desktop**

4. **Test it:**
   ```
   "What Rendervid tools do you have?"
   "Create a 5-second Instagram story with text 'Hello World'"
   ```

---

### Cursor

1. **Open Cursor Settings** (Cmd/Ctrl + ,)

2. **Search for "MCP"** or navigate to Features → Model Context Protocol

3. **Add configuration:**
   ```json
   {
     "mcpServers": {
       "rendervid": {
         "command": "node",
         "args": ["/absolute/path/to/rendervid/mcp/build/index.js"]
       }
     }
   }
   ```

4. **Restart Cursor**

5. **Usage:**
   - Use the @ symbol to reference Rendervid tools
   - Or simply ask in natural language: "Generate a YouTube thumbnail"

---

### Windsurf

1. **Open Windsurf Settings**

2. **Navigate to MCP Servers section**

3. **Add server configuration:**
   - **Name**: Rendervid
   - **Command**: `node`
   - **Args**: `/absolute/path/to/rendervid/mcp/build/index.js`

4. **Save and restart Windsurf**

5. **Test:**
   ```
   "List available social media templates"
   "Create a TikTok video template"
   ```

---

### Cline / Roo Cline

1. **Open Cline Settings** (gear icon in Cline panel)

2. **Go to MCP Servers tab**

3. **Add new server:**
   ```json
   {
     "rendervid": {
       "command": "node",
       "args": ["/absolute/path/to/rendervid/mcp/build/index.js"]
     }
   }
   ```

4. **Restart VS Code**

---

### Continue.dev

1. **Open Continue config** (`~/.continue/config.json`)

2. **Add to `mcpServers` section:**
   ```json
   {
     "mcpServers": {
       "rendervid": {
         "command": "node",
         "args": ["/absolute/path/to/rendervid/mcp/build/index.js"]
       }
     }
   }
   ```

3. **Restart Continue extension**

---

## Common Usage Patterns

Once configured, you can use Rendervid skills in natural language:

### Discovery
```
"Show me what Rendervid can do"
"What animation presets are available?"
"List all layer types"
```

### Browse Examples
```
"Show me social media templates"
"What marketing video templates exist?"
"List all example categories"
```

### Generate Videos
```
"Create a 5-second Instagram story with 'Summer Sale' and blue background"
"Generate a YouTube thumbnail for 'Best Practices 2024'"
"Make a TikTok video with animated text 'New Product Launch'"
```

### Generate Images
```
"Create a PNG thumbnail with 'Tutorial' text"
"Generate a social media image for Instagram"
"Make a product showcase image"
```

### Validate Templates
```
"Validate this template: [paste JSON]"
"Check if this template is correct"
```

### Load Examples
```
"Load the Instagram story example"
"Show me the animated bar chart template"
"Get the product showcase template"
```

---

## How It Works

Each skill is designed to be used by AI agents through the MCP protocol:

1. **Discovery** - Use `get_capabilities` to learn what's possible
2. **Exploration** - Use `list_examples` to browse 50+ templates
3. **Loading** - Use `get_example` to load specific templates
4. **Validation** - Use `validate_template` to check templates
5. **Rendering** - Use `render_video` or `render_image` to create content

The AI agent automatically:
- Understands your natural language request
- Selects the appropriate tool(s)
- Constructs the required JSON
- Calls the MCP server
- Presents the results

---

## Example Workflows

### Create Social Media Content
```
User: "I need an Instagram story for a flash sale"

AI uses:
1. list_examples({ category: "social-media" })
2. get_example({ examplePath: "social-media/instagram-story" })
3. render_video({
     template: {...},
     inputs: { title: "Flash Sale", subtitle: "50% Off!" },
     format: "mp4"
   })
```

### Generate Data Visualization
```
User: "Create an animated bar chart showing Q1 sales"

AI uses:
1. get_example({ examplePath: "data-visualization/animated-bar-chart" })
2. Modifies template with sales data
3. render_video({ template, inputs, format: "mp4" })
```

### Validate Custom Template
```
User: "Check if my template is valid: [JSON]"

AI uses:
1. validate_template({ template: {...} })
2. Reports any errors or warnings
3. Suggests fixes if needed
```

---

## Troubleshooting

### Tools Not Showing Up

1. **Check server path is absolute:**
   ```bash
   # Find absolute path
   cd /path/to/rendervid/mcp
   pwd
   # Use output in config
   ```

2. **Verify server builds:**
   ```bash
   cd mcp
   pnpm build
   node build/index.js  # Should start without errors
   ```

3. **Check logs:**
   - **Claude Desktop**: `~/Library/Logs/Claude/mcp-server-rendervid.log`
   - **Cursor**: Check VS Code developer tools console
   - **Windsurf**: Check application logs

### FFmpeg Not Found

```bash
# Install FFmpeg
brew install ffmpeg  # macOS
sudo apt install ffmpeg  # Ubuntu
choco install ffmpeg  # Windows

# Verify installation
ffmpeg -version
```

### Node Version Issues

The MCP server requires Node.js 20+:

```bash
# Check version
node --version

# If too old, upgrade
nvm install 22
nvm use 22
```

Then update your MCP config to use the full Node.js path:
```json
{
  "command": "/path/to/node/v22/bin/node",
  "args": ["/absolute/path/to/rendervid/mcp/build/index.js"]
}
```

---

## Advanced Usage

### Custom Output Paths

```
"Generate a video and save it to ~/Videos/output.mp4"
```

The AI agent will use the `outputPath` parameter.

### Quality Control

```
"Create a high-quality 4K video"
"Generate a draft quality video for preview"
```

The AI agent will adjust `quality` and dimensions.

### Multiple Formats

```
"Generate both MP4 and GIF versions"
```

The AI agent will call `render_video` twice with different formats.

---

## Skills Workflow

```
┌─────────────────────────────────────────────┐
│  User Request (Natural Language)            │
│  "Create an Instagram story"                │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  AI Agent (Claude, Cursor, etc.)            │
│  - Understands intent                       │
│  - Selects appropriate MCP tool             │
│  - Constructs parameters                    │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Rendervid MCP Server                       │
│  - Validates input                          │
│  - Executes tool (render_video, etc.)       │
│  - Returns result                           │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Result Presented to User                   │
│  - Video file path                          │
│  - Dimensions, duration, file size          │
│  - Preview or success message               │
└─────────────────────────────────────────────┘
```

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
