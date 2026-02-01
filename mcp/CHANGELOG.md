# Changelog

All notable changes to the Rendervid MCP Server will be documented in this file.

## [0.1.0] - 2026-02-01

### Added
- Initial release of Rendervid MCP Server
- 6 tools for AI agents:
  - `render_video` - Generate videos from JSON templates
  - `render_image` - Generate single images/frames
  - `validate_template` - Validate template JSON structure
  - `get_capabilities` - Discover available features and capabilities
  - `list_examples` - Browse 50+ example templates by category
  - `get_example` - Load specific example templates with metadata
- Stdio transport for MCP protocol
- Comprehensive error handling and validation using Zod
- Logger utility that writes to stderr only (MCP requirement)
- Example utilities for browsing and loading templates
- Support for all Rendervid features:
  - 8 layer types (text, image, video, shape, audio, group, lottie, custom)
  - 40+ animation presets (entrance, exit, emphasis)
  - 30+ easing functions
  - Multiple output formats (MP4, WebM, MOV, GIF for video; PNG, JPEG, WebP for images)
- Installation guides for:
  - Claude Desktop
  - Cursor
  - Windsurf
  - Google Antigravite
- Comprehensive documentation and troubleshooting guide
- Example configuration files
