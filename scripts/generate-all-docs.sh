#!/bin/bash
set -e

echo "🚀 Generating all Rendervid documentation..."

# Generate MCP skills documentation
echo ""
echo "📚 Generating MCP skills documentation..."
cd mcp
pnpm build
pnpm generate:skills
cd ..

echo ""
echo "✅ All documentation generated successfully!"
echo "📁 Skills documentation: ./skills/"
echo ""
echo "Generated files:"
echo "- 6 individual skill markdown files"
echo "- skills-registry.json (machine-readable)"
echo "- README.md (human-readable overview)"
