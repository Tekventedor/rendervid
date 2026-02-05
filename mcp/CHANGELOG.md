# Changelog

All notable changes to the Rendervid MCP Server will be documented in this file.

## [0.1.1] - 2026-02-04

### Fixed
- **Critical: Server crash prevention** - Added comprehensive error handling to ensure the MCP server never crashes without returning a proper error response
  - Added `unhandledRejection` handler to catch unhandled promise rejections
  - Added `uncaughtException` handler to prevent process termination on unexpected errors
  - Wrapped template validation in try-catch to handle malformed templates gracefully
  - Wrapped renderer initialization in try-catch to handle system configuration issues
  - Wrapped video rendering in try-catch to handle rendering failures properly
  - Enhanced error serialization with multi-level fallbacks to ensure responses are always sent
- **Improved error messages** - All error responses now include:
  - `success: false` flag for easy detection
  - Detailed error messages with context
  - Actionable suggestions for fixing issues
  - Stack traces for debugging (when applicable)
  - Timestamps for error tracking

### Changed
- Error responses are now more structured and actionable for AI agents
- All tool execution errors are logged to stderr with structured format
- Error handling is now defensive with multiple fallback layers

### Documentation
- Added `ERROR_HANDLING.md` documenting the error handling architecture
- Documented expected behavior for various error scenarios
- Added testing guidelines for error handling

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
