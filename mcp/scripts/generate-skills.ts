#!/usr/bin/env node
/**
 * Auto-generates MCP skills documentation from source code
 * Follows Remotion skills format with YAML frontmatter + Markdown
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { zodToJsonSchema } from 'zod-to-json-schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths (relative to build/scripts/ where this compiled script runs)
const TOOLS_DIR = path.join(__dirname, '../../src/tools');
const SKILLS_OUTPUT_DIR = path.join(__dirname, '../../../skills');
const BUILD_DIR = path.join(__dirname, '../tools');

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
}

interface SkillMetadata {
  name: string;
  description: string;
  tags: string[];
  category: string;
  inputSchema: any;
  examples: string[];
}

/**
 * Extract tool definitions from compiled build files
 */
async function extractToolDefinitions(): Promise<Record<string, ToolDefinition>> {
  const tools: Record<string, ToolDefinition> = {};

  // List all tool files
  const toolFiles = fs.readdirSync(TOOLS_DIR)
    .filter(file => file.endsWith('.ts') && !file.includes('.test.'));

  console.log(`Found ${toolFiles.length} tool files`);

  for (const file of toolFiles) {
    const toolName = path.basename(file, '.ts');
    const buildFilePath = path.join(BUILD_DIR, file.replace('.ts', '.js'));

    try {
      // Import the compiled tool definition
      const toolModule = await import(`file://${buildFilePath}`);

      // Look for *Tool export (e.g., renderVideoTool, getCapabilitiesTool)
      const toolExport = Object.keys(toolModule).find(key => key.endsWith('Tool'));

      if (toolExport) {
        const toolDef = toolModule[toolExport];

        if (toolDef && toolDef.name && toolDef.description) {
          tools[toolName] = {
            name: toolDef.name,
            description: toolDef.description,
            inputSchema: toolDef.inputSchema
          };
          console.log(`✓ Extracted: ${toolDef.name}`);
        }
      } else {
        console.log(`✗ No *Tool export found in ${toolName}`);
      }
    } catch (error) {
      console.error(`✗ Failed to extract ${toolName}:`, error);
    }
  }

  return tools;
}

/**
 * Read source file to extract JSDoc comments and examples
 */
function extractSourceMetadata(toolName: string): { jsdoc: string; examples: string[] } {
  const sourcePath = path.join(TOOLS_DIR, `${toolName}.ts`);
  const source = fs.readFileSync(sourcePath, 'utf-8');

  // Extract JSDoc comments (simplified)
  const jsdocMatch = source.match(/\/\*\*([\s\S]*?)\*\//);
  const jsdoc = jsdocMatch ? jsdocMatch[1].trim() : '';

  // Extract code examples from comments
  const exampleMatches = source.matchAll(/@example\s+([\s\S]*?)(?=\n\s*\*\s*@|\n\s*\*\/)/g);
  const examples = Array.from(exampleMatches).map(match => match[1].trim());

  return { jsdoc, examples };
}

/**
 * Categorize tools
 */
function categorizeTool(toolName: string): string {
  if (toolName.includes('render')) return 'rendering';
  if (toolName.includes('validate')) return 'validation';
  if (toolName.includes('capabilities')) return 'discovery';
  if (toolName.includes('example')) return 'examples';
  return 'utilities';
}

/**
 * Generate tags for a tool
 */
function generateTags(toolName: string, description: string): string[] {
  const tags: string[] = [];

  // Add category-based tags
  if (toolName.includes('video')) tags.push('video', 'rendering');
  if (toolName.includes('image')) tags.push('image', 'rendering');
  if (toolName.includes('validate')) tags.push('validation', 'quality');
  if (toolName.includes('capabilities')) tags.push('discovery', 'metadata');
  if (toolName.includes('example')) tags.push('templates', 'examples');

  // Add description-based tags
  if (description.toLowerCase().includes('template')) tags.push('templates');
  if (description.toLowerCase().includes('generate')) tags.push('generation');
  if (description.toLowerCase().includes('json')) tags.push('json');

  // Always include
  tags.push('mcp', 'rendervid');

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Format JSON Schema as Markdown table
 */
function formatSchemaAsTable(schema: any): string {
  if (!schema.properties) return 'No parameters required.';

  let table = '| Parameter | Type | Required | Description |\n';
  table += '|-----------|------|----------|-------------|\n';

  const properties = schema.properties;
  const required = schema.required || [];

  for (const [key, prop] of Object.entries(properties)) {
    const p = prop as any;
    const type = p.type || 'any';
    const isRequired = required.includes(key) ? '✓' : '';
    const desc = p.description || '';
    table += `| \`${key}\` | ${type} | ${isRequired} | ${desc} |\n`;
  }

  return table;
}

/**
 * Generate SKILL.md content for a tool
 */
function generateSkillMarkdown(tool: ToolDefinition, metadata: SkillMetadata): string {
  const { jsdoc, examples } = extractSourceMetadata(metadata.name);

  let content = `---
name: ${tool.name}
description: ${tool.description}
tags: [${metadata.tags.join(', ')}]
category: ${metadata.category}
---

# ${tool.name}

${tool.description}

## When to Use

Use this tool when you need to:
`;

  // Add use cases based on tool type
  if (tool.name.includes('render_video')) {
    content += `- Generate video files from JSON templates
- Create animated content programmatically
- Export videos in various formats (MP4, WebM, MOV, GIF)
- Apply custom animations and effects
`;
  } else if (tool.name.includes('render_image')) {
    content += `- Generate static images from templates
- Create thumbnails or preview images
- Export frames at specific timestamps
- Generate images in PNG, JPEG, or WebP formats
`;
  } else if (tool.name.includes('validate')) {
    content += `- Validate template JSON structure before rendering
- Catch errors early in the development process
- Get detailed error messages and suggestions
- Ensure template compatibility
`;
  } else if (tool.name.includes('capabilities')) {
    content += `- Discover available Rendervid features
- Learn about supported layer types and animations
- Check available output formats
- Understand engine limitations
`;
  } else if (tool.name.includes('list_examples')) {
    content += `- Browse available template examples
- Filter examples by category
- Discover ready-to-use templates
- Learn from example implementations
`;
  } else if (tool.name.includes('get_example')) {
    content += `- Load a specific example template
- View example documentation
- Understand template structure
- Use as a starting point for custom templates
`;
  }

  content += `
## Parameters

${formatSchemaAsTable(metadata.inputSchema)}

## Input Schema

\`\`\`json
${JSON.stringify(metadata.inputSchema, null, 2)}
\`\`\`

## Examples

`;

  // Add examples from code comments
  if (examples.length > 0) {
    examples.forEach((example, i) => {
      content += `### Example ${i + 1}\n\n\`\`\`typescript\n${example}\n\`\`\`\n\n`;
    });
  } else {
    // Add default example based on tool type
    if (tool.name === 'render_video') {
      content += `### Basic Video Generation

\`\`\`json
{
  "template": {
    "name": "Hello World",
    "output": {
      "type": "video",
      "width": 1920,
      "height": 1080,
      "fps": 30,
      "duration": 5
    },
    "composition": {
      "scenes": [{
        "id": "main",
        "startFrame": 0,
        "endFrame": 150,
        "layers": [{
          "id": "text",
          "type": "text",
          "props": { "text": "Hello World!" }
        }]
      }]
    }
  },
  "inputs": {},
  "format": "mp4",
  "quality": "high"
}
\`\`\`
`;
    }
  }

  content += `
## Related Tools

`;

  // Add related tools
  const relatedTools = getRelatedTools(tool.name);
  relatedTools.forEach(related => {
    content += `- [\`${related}\`](./${related}.md)\n`;
  });

  content += `
## Error Handling

This tool provides detailed error messages when:
- Invalid template structure
- Missing required parameters
- Unsupported formats or options
- File system errors

Always check the returned error messages for troubleshooting guidance.

## Best Practices

`;

  // Add best practices based on tool type
  if (tool.name.includes('render')) {
    content += `- Validate templates before rendering to catch errors early
- Use appropriate quality settings for your use case
- Monitor file sizes for web delivery
- Handle errors gracefully in production
`;
  } else if (tool.name.includes('validate')) {
    content += `- Always validate templates before rendering
- Read error messages carefully for quick fixes
- Check warnings for potential issues
- Use validation during development
`;
  }

  return content;
}

/**
 * Get related tools for a given tool
 */
function getRelatedTools(toolName: string): string[] {
  const related: Record<string, string[]> = {
    'render_video': ['render_image', 'validate_template', 'get_example'],
    'render_image': ['render_video', 'validate_template', 'get_example'],
    'validate_template': ['render_video', 'render_image', 'get_capabilities'],
    'get_capabilities': ['validate_template', 'list_examples'],
    'list_examples': ['get_example', 'get_capabilities'],
    'get_example': ['list_examples', 'render_video', 'render_image']
  };

  return related[toolName] || [];
}

/**
 * Generate skills registry JSON
 */
function generateSkillsRegistry(tools: Record<string, ToolDefinition>): any {
  return {
    server: 'rendervid-mcp-server',
    version: '0.1.0',
    generated: new Date().toISOString(),
    description: 'Model Context Protocol server for Rendervid - enables AI agents to generate videos and images',
    skills: Object.entries(tools).map(([name, tool]) => ({
      name: tool.name,
      description: tool.description,
      category: categorizeTool(name),
      tags: generateTags(name, tool.description),
      inputSchema: tool.inputSchema
    }))
  };
}

/**
 * Generate main README for skills directory
 */
function generateSkillsReadme(tools: Record<string, ToolDefinition>): string {
  const categories = new Map<string, ToolDefinition[]>();

  // Group tools by category
  Object.entries(tools).forEach(([name, tool]) => {
    const category = categorizeTool(name);
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(tool);
  });

  let content = `# Rendervid MCP Skills

Auto-generated documentation for the Rendervid Model Context Protocol (MCP) server.

**Generated:** ${new Date().toISOString()}

## Overview

The Rendervid MCP server provides ${Object.keys(tools).length} tools that enable AI agents to generate videos and images from JSON templates.

## Available Skills

`;

  // Add tools by category
  for (const [category, toolList] of categories) {
    content += `\n### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;

    toolList.forEach(tool => {
      const filename = Object.keys(tools).find(k => tools[k] === tool);
      content += `- [\`${tool.name}\`](./${filename}.md) - ${tool.description}\n`;
    });
  }

  content += `
## Installation

See the [main MCP server documentation](../mcp/README.md) for installation instructions.

## Usage

Each skill is designed to be used by AI agents through the MCP protocol. The skills can be:

1. **Discovered** using \`get_capabilities\`
2. **Explored** using \`list_examples\`
3. **Used** through the rendering tools
4. **Validated** using \`validate_template\`

## Documentation Structure

- Individual tool documentation: \`[tool-name].md\`
- Skills registry: \`skills-registry.json\`
- This README: \`README.md\`

## Updating Documentation

This documentation is auto-generated from the source code. To update:

\`\`\`bash
cd mcp
pnpm generate:skills
\`\`\`

The script reads tool definitions from \`mcp/src/tools/\` and generates:
- Individual skill Markdown files
- Skills registry JSON
- This README

## Contributing

To add a new skill:

1. Create a new tool file in \`mcp/src/tools/\`
2. Export a tool definition with \`name\`, \`description\`, and \`inputSchema\`
3. Run \`pnpm generate:skills\` to update documentation

## Related Resources

- [MCP Server Documentation](../mcp/README.md)
- [Rendervid Core Documentation](https://github.com/QualityUnit/rendervid)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
`;

  return content;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Generating MCP Skills Documentation...\n');

  // Create output directory
  if (!fs.existsSync(SKILLS_OUTPUT_DIR)) {
    fs.mkdirSync(SKILLS_OUTPUT_DIR, { recursive: true });
  }

  // Extract tool definitions
  console.log('📖 Extracting tool definitions...');
  const tools = await extractToolDefinitions();

  if (Object.keys(tools).length === 0) {
    console.error('❌ No tools found! Make sure to build the project first.');
    process.exit(1);
  }

  console.log(`\n✓ Found ${Object.keys(tools).length} tools\n`);

  // Generate individual skill files
  console.log('📝 Generating skill documentation files...');
  for (const [name, tool] of Object.entries(tools)) {
    const metadata: SkillMetadata = {
      name,
      description: tool.description,
      tags: generateTags(name, tool.description),
      category: categorizeTool(name),
      inputSchema: tool.inputSchema,
      examples: []
    };

    const markdown = generateSkillMarkdown(tool, metadata);
    const outputPath = path.join(SKILLS_OUTPUT_DIR, `${name}.md`);
    fs.writeFileSync(outputPath, markdown);
    console.log(`  ✓ Generated ${name}.md`);
  }

  // Generate skills registry
  console.log('\n📋 Generating skills registry...');
  const registry = generateSkillsRegistry(tools);
  const registryPath = path.join(SKILLS_OUTPUT_DIR, 'skills-registry.json');
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log('  ✓ Generated skills-registry.json');

  // Generate main README
  console.log('\n📚 Generating skills README...');
  const readme = generateSkillsReadme(tools);
  const readmePath = path.join(SKILLS_OUTPUT_DIR, 'README.md');
  fs.writeFileSync(readmePath, readme);
  console.log('  ✓ Generated README.md');

  console.log('\n✅ Skills documentation generated successfully!');
  console.log(`📁 Output directory: ${SKILLS_OUTPUT_DIR}`);
  console.log(`📊 Total files: ${Object.keys(tools).length + 2}`);
}

// Run the script
main().catch(error => {
  console.error('❌ Error generating skills:', error);
  process.exit(1);
});
