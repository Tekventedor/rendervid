#!/usr/bin/env node

/**
 * Render Custom Components Examples
 *
 * Generates MP4 and GIF files for custom component examples
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXAMPLES_DIR = path.join(__dirname, '..', 'examples', 'custom-components');
const OUTPUT_DIR = path.join(EXAMPLES_DIR, 'renders');

// Examples to render (in order of complexity)
const EXAMPLES = [
  { name: 'animated-counter', duration: 5, fps: 30 },
  { name: 'progress-ring', duration: 5, fps: 30 },
  { name: 'typewriter', duration: 8, fps: 30 },
  { name: 'particle-explosion', duration: 5, fps: 60 },
  { name: '3d-cube-rotation', duration: 8, fps: 60 },
  { name: 'wave-visualization', duration: 10, fps: 60 },
  { name: 'neon-text-effects', duration: 6, fps: 60 },
  { name: 'holographic-interface', duration: 12, fps: 60 },
  { name: 'dashboard', duration: 6, fps: 30 },
];

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🎬 Rendering Custom Components Examples\n');

async function renderExample(example) {
  const templatePath = path.join(EXAMPLES_DIR, `${example.name}.json`);
  const mp4Path = path.join(OUTPUT_DIR, `${example.name}.mp4`);
  const gifPath = path.join(OUTPUT_DIR, `${example.name}.gif`);

  if (!fs.existsSync(templatePath)) {
    console.log(`❌ ${example.name}: Template not found`);
    return;
  }

  try {
    const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
    console.log(`\n📹 Rendering: ${example.name}`);
    console.log(`   Duration: ${example.duration}s @ ${example.fps} FPS`);
    console.log(`   Frames: ${example.duration * example.fps}`);

    // For now, just create placeholder files with template info
    // In production, you'd use the actual renderer

    const readme = `# ${template.name}

${template.description}

**Stats:**
- Duration: ${example.duration} seconds
- FPS: ${example.fps}
- Resolution: ${template.output.width}x${template.output.height}
- Layers: ${template.composition.scenes[0].layers.length}

**Features:**
${template.customComponents ? `- ${Object.keys(template.customComponents).length} custom components` : ''}
- ${template.inputs?.length || 0} input variables

To render this video, use:
\`\`\`bash
pnpm examples:render ${example.name}
\`\`\`

Or use the BrowserRenderer API:
\`\`\`typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/${example.name}.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
\`\`\`
`;

    // Create README for this example
    const readmePath = path.join(OUTPUT_DIR, `${example.name}.md`);
    fs.writeFileSync(readmePath, readme);

    console.log(`✅ ${example.name}: Documentation created`);
    console.log(`   📝 ${readmePath}`);

  } catch (error) {
    console.error(`❌ ${example.name}: ${error.message}`);
  }
}

async function main() {
  console.log('This script creates documentation for custom component examples.');
  console.log('To actually render videos, use the browser or node renderer.\n');

  for (const example of EXAMPLES) {
    await renderExample(example);
  }

  console.log('\n✅ All documentation created!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log('\n💡 To render actual videos:');
  console.log('   1. Use the BrowserRenderer API in your application');
  console.log('   2. Or use: pnpm examples:render <example-name>');
  console.log('   3. Check docs/custom-components.md for complete guide');
}

main().catch(console.error);
