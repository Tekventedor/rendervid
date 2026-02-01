# Quick Installation Guide

## Prerequisites

1. **Node.js 20+** - Check with `node --version`
2. **FFmpeg** - Required for video rendering
3. **pnpm** - For building (or use npm/yarn)

## Install FFmpeg

### macOS
```bash
brew install ffmpeg
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

### Windows
```bash
choco install ffmpeg
# or download from https://ffmpeg.org/download.html
```

Verify installation:
```bash
ffmpeg -version
```

## Build the MCP Server

```bash
# From the rendervid repository root
cd mcp

# Install dependencies (only needed once)
pnpm install

# Build the server
pnpm build

# Test the server starts
pnpm test
```

The built server will be at: `mcp/build/index.js`

## Configure Your AI Editor

### Claude Desktop

1. Find your config file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

2. Add the MCP server configuration:

```json
{
  "mcpServers": {
    "rendervid": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/rendervid/mcp/build/index.js"]
    }
  }
}
```

**Important**: Replace `/ABSOLUTE/PATH/TO/rendervid` with the actual absolute path!

3. Completely quit Claude Desktop (Cmd+Q / Alt+F4)
4. Restart Claude Desktop
5. Look for the 🔌 icon indicating MCP servers are connected

### Cursor

1. Create or edit `.cursor/mcp.json` in your project
2. Add the same configuration as above
3. Restart Cursor

### Windsurf

1. Open Settings → MCP Servers
2. Add the server configuration
3. Restart Windsurf

### Google Antigravite

1. Open Settings → Model Context Protocol
2. Add server with type "stdio"
3. Restart Antigravite

## Verify Installation

Ask your AI assistant:

> "What Rendervid tools are available?"

You should see the 6 tools listed:
- render_video
- render_image
- validate_template
- get_capabilities
- list_examples
- get_example

## Troubleshooting

### Server not appearing

1. Check config file path is correct
2. Use absolute paths (not relative)
3. Verify build exists: `ls mcp/build/index.js`
4. Check logs:
   - macOS: `~/Library/Logs/Claude/mcp*.log`
   - Windows: `%APPDATA%/Claude/logs/`

### Build fails

```bash
cd mcp
pnpm clean
pnpm install
pnpm build
```

### FFmpeg not found

```bash
# Verify FFmpeg is installed
ffmpeg -version

# If not, install it (see above)
```

## Next Steps

See [README.md](./README.md) for:
- Detailed usage examples
- Common workflows
- Template structure
- Advanced configuration
- Development guide
