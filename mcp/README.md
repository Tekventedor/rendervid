# Rendervid MCP Server

Model Context Protocol (MCP) server that enables AI agents to generate videos and images using Rendervid.

## Overview

This MCP server exposes Rendervid's video and image generation capabilities through 6 tools that AI agents can use to create visual content from JSON templates.

### Available Tools

1. **render_video** - Generate videos from templates
2. **render_image** - Generate single images/frames
3. **validate_template** - Validate template JSON structure
4. **get_capabilities** - Discover available features
5. **list_examples** - Browse 50+ example templates
6. **get_example** - Load specific example templates

## Installation

### Prerequisites

- Node.js 20.0.0 or higher
- FFmpeg (for video rendering)
- pnpm (for development)

### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use:
```bash
choco install ffmpeg
```

### Building the MCP Server

```bash
# From the repository root
cd mcp

# Install dependencies
pnpm install

# Build the server
pnpm build
```

This will create the executable at `mcp/build/index.js`.

## Configuration

### Claude Desktop

Add to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

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

Replace `/absolute/path/to/rendervid` with the actual path to your rendervid repository.

After updating the config:
1. Quit Claude Desktop completely
2. Restart Claude Desktop
3. Look for the 🔌 icon indicating MCP servers are connected

### Cursor

Add to `.cursor/mcp.json` in your project:

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

Restart Cursor to load the server.

### Windsurf

Add to Windsurf's settings under MCP Servers:

```json
{
  "rendervid": {
    "command": "node",
    "args": ["/absolute/path/to/rendervid/mcp/build/index.js"]
  }
}
```

### Google Antigravite

Configure in your Antigravite settings under Model Context Protocol:

```json
{
  "rendervid": {
    "type": "stdio",
    "command": "node",
    "args": ["/absolute/path/to/rendervid/mcp/build/index.js"]
  }
}
```

## Usage Examples

### 1. Discover Capabilities

Ask your AI assistant:
> "What can Rendervid do? Show me the available capabilities."

This will call `get_capabilities` to show all layer types, animations, easing functions, and output formats.

### 2. Browse Examples

> "Show me available Rendervid examples for social media"

This calls `list_examples` with category filter to show Instagram, TikTok, YouTube templates.

### 3. Load and Customize an Example

> "Load the Instagram story example and customize it with my brand colors"

The AI will:
1. Call `get_example` to load the template
2. Show you the customizable inputs
3. Help you modify the template

### 4. Create a Video from Scratch

> "Create a 5-second video with the title 'Summer Sale' that fades in and pulses"

The AI will:
1. Use `get_capabilities` to check available animations
2. Create a template JSON structure
3. ⚠️ **CRITICAL:** Call `validate_template` to ensure correctness and check media URLs
4. Call `render_video` to generate the output (only if validation passes)

### 5. Generate Social Media Content

> "Create an Instagram story (1080x1920) promoting our new product launch"

The AI will create an appropriate template or use an example.

### 6. Create Data Visualizations

> "Generate an animated bar chart showing Q4 sales data"

The AI can use the bar chart example or create a custom template.

## Common Workflows

### Workflow 1: Quick Start with Examples

```
1. User: "Show me marketing templates"
   → AI calls list_examples({ category: "marketing" })

2. User: "Load the product showcase template"
   → AI calls get_example({ examplePath: "marketing/product-showcase" })

3. User: "Render it with my product name and image"
   → AI calls render_video with customized inputs
```

### Workflow 2: Create Custom Template

```
1. User: "I want to create a custom animated quote card"
   → AI calls get_capabilities to see what's available

2. User: "Use fadeIn animation with a gradient background"
   → AI creates template JSON

3. ⚠️ CRITICAL: AI validates with validate_template
   → Catches broken image URLs, invalid structure, missing fields
   → Prevents black/broken videos before wasting render time

4. AI renders with render_video or render_image (only after validation passes)
```

### Workflow 3: Iterate on Design

```
1. Load example template
2. Customize colors, text, timing
3. ⚠️ Validate changes with validate_template (catches broken URLs early)
4. Render (only after validation passes)
5. Review output
6. Adjust and re-render (always validate before each render)
```

## Template Structure

Templates are JSON objects with this structure:

```json
{
  "name": "Template Name",
  "description": "What this template does",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 5
  },
  "fonts": {
    "google": [
      { "family": "Roboto", "weights": [400, 700] }
    ]
  },
  "inputs": [
    {
      "key": "title",
      "type": "string",
      "label": "Title Text",
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
            "id": "text-1",
            "type": "text",
            "position": { "x": 960, "y": 540 },
            "size": { "width": 800, "height": 100 },
            "props": {
              "text": "{{title}}",
              "fontFamily": "Roboto",
              "fontWeight": 700,
              "fontSize": 72,
              "color": "#FFFFFF"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
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

### Font Support (NEW in v0.2.0)

Rendervid now supports **100+ Google Fonts** and custom fonts. See [`FONTS.md`](./FONTS.md) for details.

Quick example:
```json
{
  "fonts": {
    "google": [
      { "family": "Roboto", "weights": [400, 700] }
    ]
  }
}
```

Then use in text layers:
```json
{
  "type": "text",
  "props": {
    "fontFamily": "Roboto",
    "fontWeight": 700
  }
}
```

## Creating Custom Components with Inline React Code

**IMPORTANT:** You can create NEW custom components by writing React code directly in templates! This is one of Rendervid's most powerful features for AI agents.

### Why Use Custom Components?

Built-in components (text, image, shape) are limited to static or simple animations. Custom components enable:
- ✅ Animated counters and timers
- ✅ Particle systems and physics simulations
- ✅ Data visualizations and charts
- ✅ 3D effects with CSS transforms
- ✅ Procedural graphics and SVG animations
- ✅ Complex frame-based calculations

### How to Create Custom Components

Add a `customComponents` field to your template at the root level:

```json
{
  "name": "Video with Custom Component",
  "customComponents": {
    "AnimatedCounter": {
      "type": "inline",
      "code": "function AnimatedCounter(props) { const progress = Math.min(props.frame / (props.fps * 2), 1); const value = Math.floor(props.from + (props.to - props.from) * progress); return React.createElement('div', { style: { fontSize: '72px', fontWeight: 'bold', color: '#00ffff' } }, value); }",
      "description": "Animated number counter"
    }
  },
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 3 },
  "composition": {
    "scenes": [{
      "layers": [{
        "id": "counter",
        "type": "custom",
        "position": { "x": 960, "y": 540 },
        "size": { "width": 400, "height": 200 },
        "customComponent": {
          "name": "AnimatedCounter",
          "props": { "from": 0, "to": 100 }
        }
      }]
    }]
  }
}
```

### Component Interface

Every custom component automatically receives these props:

```typescript
{
  frame: number;         // Current frame (0, 1, 2, ...)
  fps: number;           // Frames per second (30, 60)
  sceneDuration: number; // Total frames in scene
  layerSize: {
    width: number;       // Layer width
    height: number;      // Layer height
  };
  // + your custom props from customComponent.props
}
```

### Rules for Inline Components

1. ✅ **Use `React.createElement()`** - No JSX syntax
2. ✅ **Frame-based animations** - Calculate from `props.frame`
3. ✅ **Pure functions** - Same frame = same output
4. ❌ **No side effects** - No fetch, setTimeout, setInterval
5. ❌ **No external imports** - No require() or import
6. ❌ **No DOM access** - No document or window

### Complete Working Example

```json
{
  "name": "Time Running Out Demo",
  "customComponents": {
    "FastClock": {
      "type": "inline",
      "code": "function FastClock(props) { const time = (props.frame / props.fps) * props.speed; const seconds = Math.floor(time % 60); const angle = seconds * 6; const rad = (angle - 90) * Math.PI / 180; const cx = props.layerSize.width / 2; const cy = props.layerSize.height / 2; const r = Math.min(cx, cy) * 0.9; const length = r * 0.8; const x2 = cx + Math.cos(rad) * length; const y2 = cy + Math.sin(rad) * length; return React.createElement('svg', { width: props.layerSize.width, height: props.layerSize.height }, React.createElement('circle', { cx: cx, cy: cy, r: r, fill: 'transparent', stroke: props.color || '#fff', strokeWidth: 4 }), React.createElement('line', { x1: cx, y1: cy, x2: x2, y2: y2, stroke: '#ff0000', strokeWidth: 3, strokeLinecap: 'round' })); }"
    }
  },
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 60, "duration": 5 },
  "composition": {
    "scenes": [{
      "layers": [
        {
          "id": "clock-left",
          "type": "custom",
          "position": { "x": 400, "y": 540 },
          "size": { "width": 300, "height": 300 },
          "customComponent": {
            "name": "FastClock",
            "props": { "speed": 10, "color": "#ff6b6b" }
          }
        },
        {
          "id": "clock-right",
          "type": "custom",
          "position": { "x": 1520, "y": 540 },
          "size": { "width": 300, "height": 300 },
          "customComponent": {
            "name": "FastClock",
            "props": { "speed": 10, "color": "#6baaff" }
          }
        },
        {
          "id": "text",
          "type": "text",
          "position": { "x": 960, "y": 540 },
          "size": { "width": 600, "height": 200 },
          "props": {
            "text": "TIME IS RUNNING OUT",
            "fontSize": 48,
            "fontWeight": "bold",
            "color": "#ffffff",
            "textAlign": "center"
          }
        }
      ]
    }]
  }
}
```

This template creates two animated analog clocks showing time running at 10x speed with warning text in the center!

### AI Agent Workflow

When a user asks for a custom visual effect:

1. **Check if built-in components suffice** - Use get_capabilities
2. **If custom component needed** - Write inline React code
3. **Add to template** - Include in customComponents field
4. **Use in layers** - Reference by name in composition
5. **Validate** - Call validate_template
6. **Render** - Call render_video

### Three Component Types

| Type | When to Use | Security |
|------|-------------|----------|
| **inline** | AI-generated, one-time components | ⚠️ Validated |
| **url** | Shared components from CDN | ⚠️ HTTPS only |
| **reference** | Pre-built library components | ✅ Trusted |

For more details, use the `get_component_docs` tool with `componentType: "custom"`.

## Troubleshooting

### Server Not Appearing in Claude Desktop

1. Check the config file path is correct
2. Ensure absolute paths are used (not relative)
3. Verify the build directory exists: `ls mcp/build/index.js`
4. Check the logs: `~/Library/Logs/Claude/mcp*.log` (macOS)
5. Completely quit and restart Claude Desktop

### FFmpeg Not Found

```bash
# Verify FFmpeg is installed
ffmpeg -version

# If not found, install it
brew install ffmpeg  # macOS
```

### Render Fails with Permission Error

Ensure the output directory exists and is writable:
```bash
mkdir -p /path/to/output
chmod 755 /path/to/output
```

### Template Validation Errors

Use the `validate_template` tool to get detailed error messages:
```
validate_template({
  template: { ... }
})
```

Common issues:
- Missing required fields (output.type, output.width, output.height)
- Invalid frame ranges (endFrame must be > startFrame)
- Layer missing required properties (id, type, position, size)
- Animation effect not found (check get_capabilities for valid effects)

### Build Errors

```bash
# Clean and rebuild
cd mcp
pnpm clean
pnpm install
pnpm build
```

### Debugging

Enable debug logging:
```json
{
  "mcpServers": {
    "rendervid": {
      "command": "node",
      "args": ["/absolute/path/to/rendervid/mcp/build/index.js"],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

Check logs in:
- **Claude Desktop:** `~/Library/Logs/Claude/` (macOS)
- **Cursor:** Check the MCP output panel
- **Server stderr:** All logs go to stderr (not stdout)

## Testing

### Test Server Manually

```bash
# Start the server
node mcp/build/index.js

# It should wait for MCP protocol messages on stdin
# Use Ctrl+C to exit
```

### Test with MCP Inspector

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Run the server with inspector
mcp-inspector node mcp/build/index.js
```

This opens a web UI to test the tools interactively.

### Test Individual Tools

Create a test script:

```typescript
import { executeGetCapabilities } from './tools/get_capabilities.js';

// Test get_capabilities
const result = await executeGetCapabilities();
console.log(result);
```

## Development

### Project Structure

```
mcp/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── types.ts              # TypeScript types and Zod schemas
│   ├── tools/                # Tool implementations
│   │   ├── render_video.ts
│   │   ├── render_image.ts
│   │   ├── validate_template.ts
│   │   ├── get_capabilities.ts
│   │   ├── list_examples.ts
│   │   └── get_example.ts
│   └── utils/                # Utility functions
│       ├── logger.ts         # Stderr logging
│       └── examples.ts       # Example template utilities
├── build/                    # Compiled output (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
pnpm build      # Compile TypeScript
pnpm dev        # Watch mode
pnpm typecheck  # Type check without building
pnpm clean      # Remove build directory
```

### Adding a New Tool

1. Create `src/tools/my_tool.ts`:
```typescript
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

const MyToolInputSchema = z.object({
  // Define inputs
});

export const myTool = {
  name: 'my_tool',
  description: 'Detailed description for AI',
  inputSchema: zodToJsonSchema(MyToolInputSchema),
};

export async function executeMyTool(args: unknown): Promise<string> {
  // Implementation
  return JSON.stringify({ result: 'success' });
}
```

2. Register in `src/index.ts`:
```typescript
import { myTool, executeMyTool } from './tools/my_tool.js';

// Add to ListToolsRequestSchema handler
tools: [...existingTools, myTool]

// Add to CallToolRequestSchema handler
case 'my_tool':
  result = await executeMyTool(args);
  break;
```

3. Rebuild and test

4. **Generate documentation:**
```bash
pnpm generate:skills
```

This automatically creates skill documentation in `/skills/` from your tool definition.

### Auto-Generating Skills Documentation

The MCP server includes an auto-documentation generator that creates skills documentation from source code:

**What it generates:**
- Individual skill Markdown files (one per tool)
- Skills registry JSON (machine-readable format)
- README with categorized overview

**How it works:**
1. Reads tool definitions from `mcp/src/tools/`
2. Extracts Zod schemas and converts to JSON Schema
3. Parses JSDoc comments for detailed descriptions
4. Generates Markdown in Remotion skills format
5. Outputs to `/skills/` directory at repository root

**To regenerate documentation:**
```bash
cd mcp
pnpm generate:skills
```

**Integration with CI:**
- GitHub Actions automatically regenerates docs on source changes
- See `.github/workflows/generate-docs.yml`
- Commits are marked with `[skip ci]` to prevent loops

### Best Practices

1. **No stdout usage** - All logging must go to stderr
2. **Detailed descriptions** - Help AI understand what each tool does
3. **Input validation** - Use Zod schemas for type safety
4. **Error handling** - Return JSON with error details
5. **User-friendly messages** - Help users fix common issues
6. **Examples in descriptions** - Show AI how to use tools

## Examples

### Render a Simple Video

```typescript
// AI generates this call
render_video({
  template: {
    name: "Hello World",
    output: {
      type: "video",
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 3
    },
    composition: {
      scenes: [{
        id: "main",
        startFrame: 0,
        endFrame: 90,
        layers: [{
          id: "text",
          type: "text",
          position: { x: 960, y: 540 },
          size: { width: 800, height: 100 },
          props: {
            text: "Hello, World!",
            fontSize: 72,
            color: "#FFFFFF"
          }
        }]
      }]
    }
  },
  outputPath: "./output/hello.mp4"
})
```

### Generate Instagram Story

```typescript
// Load example
get_example({
  examplePath: "social-media/instagram-story"
})

// Customize and render
render_video({
  template: { /* loaded template */ },
  inputs: {
    headline: "New Product Launch",
    subtext: "Coming Soon",
    backgroundColor: "#E91E63",
    accentColor: "#FFFFFF"
  },
  outputPath: "./output/story.mp4"
})
```

## Resources

- [Rendervid Documentation](../)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Template Examples](../examples/)
- [Animation Presets](../packages/core/src/animation/presets.ts)

## Support

- **Issues:** [GitHub Issues](https://github.com/QualityUnit/rendervid/issues)
- **Discussions:** [GitHub Discussions](https://github.com/QualityUnit/rendervid/discussions)

## License

See [LICENSE](../LICENSE) - FlowHunt Attribution License
