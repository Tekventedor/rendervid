#!/usr/bin/env node

/**
 * Generate README.md for every example
 *
 * Reads each template.json and writes a README.md that:
 *  - Describes what the example demonstrates
 *  - Embeds the animated GIF preview
 *  - Links to the MP4 download
 *  - Lists configurable inputs
 *  - Shows the output dimensions / duration
 *
 * Usage:
 *   node examples/generate-readmes.mjs [filter]
 *
 * Examples:
 *   node examples/generate-readmes.mjs          # all examples
 *   node examples/generate-readmes.mjs effects  # only effects/*
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filter = process.argv[2] || '';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findTemplates(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findTemplates(full));
    } else if (entry === 'template.json') {
      results.push(full);
    }
  }
  return results;
}

/** Convert snake_case or kebab-case or camelCase to Title Case */
function titleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/** Return a fallback description based on category and template name */
function inferDescription(relPath, template) {
  const parts = relPath.split('/');
  const category = parts[0];
  const exampleName = parts[parts.length - 1];
  const name = template.name || titleCase(exampleName);

  const categoryDescriptions = {
    '3d': 'Interactive 3D scene rendered with React Three Fiber and WebGL.',
    'animations': 'Animation demonstrating timing, easing, and motion techniques.',
    'backgrounds': 'Animated background effect for use as video backdrops.',
    'behaviors': 'Physics or behavioral simulation demonstrating movement patterns.',
    'cinematic': 'Cinematic-quality motion graphic for broadcast or film production.',
    'content': 'Content card template for social media or marketing.',
    'custom-components': 'Custom React component integration showcasing advanced compositing.',
    'data-visualization': 'Animated data visualization chart or graph.',
    'ecommerce': 'E-commerce promotional video template.',
    'education': 'Educational content template for online learning.',
    'effects': 'Visual effect or shader demonstrating renderer capabilities.',
    'events': 'Event promotion or announcement video template.',
    'fashion': 'Fashion or lifestyle promotional content.',
    'finance': 'Financial data visualization or dashboard template.',
    'fitness': 'Fitness and health content template.',
    'food': 'Food and beverage promotional video template.',
    'getting-started': 'Introductory example for new users of RenderVid.',
    'marketing': 'Marketing and advertising video template.',
    'particles': 'Particle system simulation demonstrating renderer capabilities.',
    'physics': 'Physics simulation using Matter.js for realistic object behavior.',
    'real-estate': 'Real estate listing or property showcase template.',
    'showcase': 'Showcase of built-in capabilities and features.',
    'social': 'Social media content template.',
    'social-media': 'Platform-specific social media template.',
    'streaming': 'Live streaming overlay or transition template.',
    'tech': 'Technology company or software product template.',
    'youtube-lower-third': 'Lower-third overlay for YouTube videos.',
  };

  return `${name}. ${categoryDescriptions[category] || 'Example demonstrating RenderVid capabilities.'}`;
}

/** Generate README markdown for a single template */
function generateReadme(templatePath) {
  const dir = dirname(templatePath);
  const relPath = relative(__dirname, dir);

  let template;
  try {
    template = JSON.parse(readFileSync(templatePath, 'utf-8'));
  } catch (e) {
    console.error(`  ✗ Invalid JSON: ${relPath}`);
    return null;
  }

  const name = template.name || titleCase(relPath.split('/').pop());
  const description = template.description || inferDescription(relPath, template);
  const output = template.output || {};
  const outputType = output.type || 'video';
  const width = output.width || 1920;
  const height = output.height || 1080;
  const fps = output.fps || 30;
  const duration = output.duration;
  const inputs = template.inputs || [];
  const customComponents = template.customComponents || {};
  const componentNames = Object.keys(customComponents);

  // Relative path from this example dir back to the examples root
  const depth = relPath.split('/').length;
  const toExamples = '../'.repeat(depth);
  const toRoot = '../'.repeat(depth + 1);

  // Check which output files already exist
  const hasGif = existsSync(join(dir, 'preview.gif'));
  const hasMp4 = existsSync(join(dir, 'output.mp4'));
  const hasPng = existsSync(join(dir, 'output.png'));
  const hasPreviewPng = existsSync(join(dir, 'preview.png'));

  // ── Build markdown ────────────────────────────────────────────────────────

  const lines = [];

  // Title
  lines.push(`# ${name}`);
  lines.push('');

  // Description
  lines.push(`> ${description}`);
  lines.push('');

  // Preview
  if (outputType === 'image') {
    if (hasPng) {
      lines.push('## Preview');
      lines.push('');
      lines.push('![Preview](output.png)');
      lines.push('');
    } else {
      lines.push('## Preview');
      lines.push('');
      lines.push('*Run `node examples/render-all.mjs` to generate the preview image.*');
      lines.push('');
    }
  } else {
    lines.push('## Preview');
    lines.push('');
    if (hasGif) {
      lines.push('![Preview](preview.gif)');
      lines.push('');
      if (hasMp4) {
        lines.push('**[📥 Download MP4](output.mp4)**');
        lines.push('');
      }
    } else if (hasPreviewPng) {
      lines.push('![Preview frame](preview.png)');
      lines.push('');
      if (hasMp4) {
        lines.push('**[📥 Download MP4](output.mp4)** · *GIF preview renders after `node examples/render-all.mjs`*');
        lines.push('');
      }
    } else {
      lines.push('*Run `node examples/render-all.mjs` to generate the preview GIF and MP4.*');
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');

  // Details table
  lines.push('## Details');
  lines.push('');
  lines.push('| Property | Value |');
  lines.push('|----------|-------|');
  lines.push(`| **Resolution** | ${width} × ${height} |`);

  if (outputType === 'video') {
    if (duration) lines.push(`| **Duration** | ${duration}s |`);
    lines.push(`| **FPS** | ${fps} |`);
    lines.push(`| **Output** | Video (MP4) |`);
  } else {
    lines.push(`| **Output** | Image (PNG) |`);
  }

  if (componentNames.length > 0) {
    lines.push(`| **Custom Components** | ${componentNames.join(', ')} |`);
  }

  lines.push('');

  // Inputs
  if (inputs.length > 0) {
    lines.push('## Inputs');
    lines.push('');
    lines.push('| Key | Type | Default | Description |');
    lines.push('|-----|------|---------|-------------|');
    for (const input of inputs) {
      const key = input.key || '';
      const type = input.type || 'string';
      const label = input.label || '';
      const def = input.default !== undefined ? `\`${JSON.stringify(input.default)}\`` : '—';
      const required = input.required ? ' *(required)*' : '';
      lines.push(`| \`${key}\` | ${type} | ${def} | ${label}${required} |`);
    }
    lines.push('');
  }

  // Usage
  lines.push('## Usage');
  lines.push('');
  lines.push('```bash');
  lines.push(`# Render this example`);
  lines.push(`node examples/render-all.mjs "${relPath}"`);
  lines.push('');
  lines.push(`# Or render all examples`);
  lines.push(`node examples/render-all.mjs`);
  lines.push('```');
  lines.push('');

  if (inputs.length > 0) {
    lines.push('Customize inputs via the MCP server or by editing `template.json`:');
    lines.push('');
    lines.push('```json');
    const exampleInputs = {};
    for (const input of inputs.slice(0, 3)) {
      if (input.default !== undefined) {
        exampleInputs[input.key] = input.default;
      }
    }
    lines.push(JSON.stringify({ inputs: exampleInputs }, null, 2));
    lines.push('```');
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(`*Part of the [RenderVid examples](${toExamples}README.md) · [RenderVid](${toRoot}README.md)*`);
  lines.push('');

  return lines.join('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║   RenderVid — Generate Example READMEs                     ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

const allTemplates = findTemplates(__dirname).sort();
const templates = filter
  ? allTemplates.filter(p => p.includes(filter))
  : allTemplates;

console.log(`Generating READMEs for ${templates.length} examples${filter ? ` matching "${filter}"` : ''}...\n`);

let written = 0;
let failed = 0;

for (const templatePath of templates) {
  const dir = dirname(templatePath);
  const relPath = relative(__dirname, dir);
  const readmePath = join(dir, 'README.md');

  const content = generateReadme(templatePath);
  if (!content) {
    failed++;
    continue;
  }

  writeFileSync(readmePath, content, 'utf-8');
  written++;
  console.log(`  ✓ ${relPath}`);
}

console.log(`\n  ✅ Written: ${written}`);
if (failed > 0) console.log(`  ❌ Failed: ${failed}`);
console.log('');
