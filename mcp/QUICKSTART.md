# Quick Start Guide

Get up and running with the Rendervid MCP Server in 5 minutes.

## Step 1: Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt install ffmpeg
```

**Windows:**
```bash
choco install ffmpeg
```

## Step 2: Build the Server

```bash
# Navigate to the mcp directory
cd /path/to/rendervid/mcp

# Install dependencies
pnpm install

# Build the server
pnpm build
```

## Step 3: Get Your Absolute Path

```bash
# From the mcp directory
pwd
# Example output: /Users/yourname/projects/rendervid/mcp
```

## Step 4: Configure Claude Desktop

**macOS:** Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** Edit `%APPDATA%/Claude/claude_desktop_config.json`

Add this configuration (replace with YOUR path):

```json
{
  "mcpServers": {
    "rendervid": {
      "command": "node",
      "args": ["/Users/yourname/projects/rendervid/mcp/build/index.js"]
    }
  }
}
```

## Step 5: Restart Claude Desktop

1. Completely quit Claude Desktop (Cmd+Q on Mac, Alt+F4 on Windows)
2. Restart Claude Desktop
3. Look for the 🔌 icon - it means MCP servers are connected!

## Step 6: Test It!

Open a new conversation in Claude and try:

> "What Rendervid capabilities are available?"

Claude should call the `get_capabilities` tool and show you all available features.

## Your First Video

Try this:

> "Show me Rendervid examples for social media"

Then:

> "Load the Instagram story example and render it with the title 'Hello World' and my brand color #FF5733"

Claude will:
1. Call `list_examples` to show social media templates
2. Call `get_example` to load the Instagram story template
3. ⚠️ Call `validate_template` to check the template and media URLs
4. Call `render_video` to generate your customized video (only if validation passes)

## Common First Tasks

### Browse Examples
> "List all Rendervid marketing templates"

### Create a Simple Video
> "Create a 5-second video with centered text saying 'Welcome' that fades in"

### Generate a Social Media Post
> "Create an Instagram post (1080x1080) with my product announcement"

### Validate a Template
> "Validate this Rendervid template: [paste JSON]"

## Troubleshooting

### "No MCP servers connected"

1. Check your config file path is correct
2. Verify you used the ABSOLUTE path (not relative)
3. Check the build exists: `ls mcp/build/index.js`
4. Look at Claude's logs: `~/Library/Logs/Claude/mcp*.log` (macOS)

### "FFmpeg not found"

```bash
# Verify FFmpeg is installed
ffmpeg -version
```

If not found, install it (see Step 1).

### Server builds but doesn't work

```bash
# Clean and rebuild
cd mcp
pnpm clean
pnpm build

# Test server starts
pnpm test
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Browse [example templates](../examples/) for inspiration
- Check out [INSTALL.md](./INSTALL.md) for other editors (Cursor, Windsurf, etc.)
- See [template structure](./README.md#template-structure) to understand how templates work

## Getting Help

- Check the [Troubleshooting section](./README.md#troubleshooting) in README
- Look at example templates in `../examples/`
- Open an issue on [GitHub](https://github.com/QualityUnit/rendervid/issues)

## Tips

1. **Start with examples** - Don't create templates from scratch initially
2. **Use get_capabilities** - See what's available before building
3. ⚠️ **ALWAYS validate first** - Use `validate_template` before rendering to catch broken image URLs and structural errors (prevents black/broken videos)
4. **Check logs** - If something fails, stderr logs show detailed errors
5. **Absolute paths** - Always use absolute paths for output files

Happy rendering! 🎥
