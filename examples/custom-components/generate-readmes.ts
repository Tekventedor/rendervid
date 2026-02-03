#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

function generateReadme(exampleName: string): string {
  const templatePath = join(__dirname, exampleName, 'template.json');

  if (!existsSync(templatePath)) {
    console.log(`⚠️  Template not found for ${exampleName}`);
    return '';
  }

  const template = JSON.parse(readFileSync(templatePath, 'utf-8'));

  // Extract custom components
  const customComponents = template.customComponents || {};
  const customComponentNames = Object.keys(customComponents);

  // Extract layers
  const layers = template.composition?.scenes?.[0]?.layers || [];
  const customLayers = layers.filter((l: any) => l.type === 'custom');

  // Format title
  const title = template.name || exampleName;

  return `# ${title}

${template.description || 'Custom component example showcasing advanced effects in Rendervid.'}

## Preview

![Preview](preview.gif)

**[Download Video (MP4)](video.mp4)**

## Specifications

| Property | Value |
|----------|-------|
| Resolution | ${template.output.width}x${template.output.height} |
| FPS | ${template.output.fps} |
| Duration | ${template.output.duration}s |
| Total Frames | ${template.output.fps * template.output.duration} |

## Custom Components

${customComponentNames.length > 0 ? customComponentNames.map(name => {
  const comp = customComponents[name];
  return `### ${name}

**Type:** \`${comp.type}\`${comp.description ? `\n**Description:** ${comp.description}` : ''}

${comp.type === 'inline' ? `**Code Length:** ${comp.code?.length || 0} characters` : ''}
${comp.type === 'url' ? `**URL:** ${comp.url}` : ''}
${comp.type === 'reference' ? `**Reference:** ${comp.reference}` : ''}

${comp.type === 'inline' ? `#### Props Interface
\`\`\`typescript
{
  frame: number;         // Current frame (auto)
  fps: number;           // Frames per second (auto)
  sceneDuration: number; // Total frames (auto)
  layerSize: {          // Layer dimensions (auto)
    width: number;
    height: number;
  };
  // + custom props from layer
}
\`\`\`` : ''}
`;
}).join('\n') : '_No custom components in this template_'}

## Layer Composition

This template uses **${layers.length} layer${layers.length !== 1 ? 's' : ''}**:

${layers.map((layer: any, i: number) => {
  const layerType = layer.type === 'custom'
    ? `custom (\`${layer.customComponent?.name}\`)`
    : layer.type;

  let details = '';
  if (layer.type === 'custom' && layer.customComponent?.props) {
    const props = Object.entries(layer.customComponent.props)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join(', ');
    details = props ? `\n   Props: ${props}` : '';
  } else if (layer.type === 'text' && layer.props?.text) {
    details = `\n   Text: "${layer.props.text}"`;
  }

  return `${i + 1}. **${layer.id}** (${layerType})${details}`;
}).join('\n')}

## Key Features

${customLayers.length > 0 ? `- ✅ **${customLayers.length} Custom Component${customLayers.length !== 1 ? 's' : ''}** - Advanced React-based effects\n` : ''}- ✅ **Frame-Based Animation** - Smooth deterministic rendering
- ✅ **High FPS** - ${template.output.fps} FPS for ${template.output.fps >= 60 ? 'ultra-smooth' : 'smooth'} motion
${customComponentNames.some((n: string) => customComponents[n].type === 'inline') ? '- ✅ **Inline Components** - React code defined directly in template\n' : ''}- ✅ **Reusable** - Edit \`template.json\` to customize

## Usage

### Render This Example

\`\`\`bash
# From the custom-components directory
pnpm tsx render-all-examples.ts ${exampleName}

# Or use the browser renderer directly
pnpm tsx ../render-example.ts ${exampleName}/template.json
\`\`\`

### Customize

Edit \`template.json\` to modify:

${customLayers.length > 0 ? `- **Component Props** - Adjust custom component properties
` : ''}- **Colors** - Change color values throughout
- **Duration** - Adjust \`output.duration\`
- **Resolution** - Modify \`output.width\` and \`output.height\`
- **Text** - Update any text layer content

${template.inputs && template.inputs.length > 0 ? `
### Input Variables

This template accepts the following inputs:

${template.inputs.map((input: any) => `- **${input.key}** (\`${input.type}\`)${input.required ? ' _required_' : ''} - ${input.label || input.key}`).join('\n')}

\`\`\`typescript
await renderer.renderVideo({
  template,
  inputs: {
${template.inputs.map((input: any) => `    ${input.key}: ${input.default ? JSON.stringify(input.default) : `"your-value-here"`},`).join('\n')}
  }
});
\`\`\`
` : ''}

## Technical Details

${customComponentNames.length > 0 ? `
### Component Implementation

${customComponentNames.map(name => {
  const comp = customComponents[name];
  if (comp.type === 'inline' && comp.code) {
    // Show first 500 chars of code
    const codePreview = comp.code.substring(0, 500);
    const truncated = comp.code.length > 500;

    return `#### ${name}

\`\`\`javascript
${codePreview}${truncated ? '\n... [truncated]' : ''}
\`\`\`

${comp.description || ''}
`;
  }
  return '';
}).filter(Boolean).join('\n')}
` : ''}

### Performance

- **Render Time**: ~${Math.ceil((template.output.fps * template.output.duration) / 15)} seconds (estimated)
- **Output Size**: ~${Math.ceil((template.output.width * template.output.height * template.output.fps * template.output.duration) / 10000000)} MB (estimated)
- **Complexity**: ${layers.length <= 3 ? 'Low' : layers.length <= 6 ? 'Medium' : 'High'} (${layers.length} layers)

## Related Examples

${customLayers.length > 0 ? '- [All Custom Component Examples](../README.md)\n' : ''}- [Getting Started Examples](../../getting-started/)
- [Template Documentation](../../../docs/custom-components.md)

---

**Created with Rendervid** | [GitHub](https://github.com/QualityUnit/rendervid) | [Documentation](https://github.com/QualityUnit/rendervid#readme)
`;
}

async function main() {
  const examplesDir = __dirname;

  // Get all example directories
  const examples = readdirSync(examplesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => !dirent.name.startsWith('.') && !dirent.name.startsWith('_') && dirent.name !== 'node_modules' && dirent.name !== 'renders')
    .map(dirent => dirent.name)
    .sort();

  console.log(`\n📝 Generating READMEs for ${examples.length} examples...\n`);

  for (const exampleName of examples) {
    const readmePath = join(examplesDir, exampleName, 'README.md');

    // Skip if README already exists (like time-running-out)
    if (existsSync(readmePath)) {
      console.log(`⏭️  ${exampleName}: README already exists, skipping...`);
      continue;
    }

    console.log(`📄 ${exampleName}: Generating README...`);

    const content = generateReadme(exampleName);

    if (content) {
      writeFileSync(readmePath, content);
      console.log(`✅ ${exampleName}: README created`);
    }
  }

  console.log('\n✅ All READMEs generated!\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
