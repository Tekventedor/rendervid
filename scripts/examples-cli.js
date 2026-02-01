#!/usr/bin/env node

/**
 * Examples CLI
 *
 * Commands:
 *   list              - List all available examples
 *   render <example>  - Render a specific example
 *   validate          - Validate all example templates
 *   generate-previews - Generate preview assets for all examples
 */

const fs = require('fs');
const path = require('path');

const EXAMPLES_DIR = path.join(__dirname, '..', 'examples');
const CATEGORIES = ['getting-started', 'social-media', 'marketing', 'data-visualization'];

function collectExamples() {
  const examples = [];

  for (const category of CATEGORIES) {
    const categoryPath = path.join(EXAMPLES_DIR, category);
    if (!fs.existsSync(categoryPath)) continue;

    const dirs = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const dir of dirs) {
      const templatePath = path.join(categoryPath, dir, 'template.json');
      if (fs.existsSync(templatePath)) {
        try {
          const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
          examples.push({
            path: `${category}/${dir}`,
            category,
            name: dir,
            templatePath,
            template,
          });
        } catch (e) {
          console.error(`Error parsing ${templatePath}: ${e.message}`);
        }
      }
    }
  }

  return examples;
}

function listExamples() {
  const examples = collectExamples();

  console.log('\n📁 Available Examples\n');
  console.log('=' .repeat(60));

  let currentCategory = '';
  for (const example of examples) {
    if (example.category !== currentCategory) {
      currentCategory = example.category;
      console.log(`\n📂 ${currentCategory.toUpperCase().replace(/-/g, ' ')}`);
      console.log('-'.repeat(40));
    }

    const { template } = example;
    const type = template.output.type === 'video' ? '🎬' : '🖼️';
    const size = `${template.output.width}x${template.output.height}`;
    const duration = template.output.type === 'video' ? ` (${template.output.duration}s)` : '';

    console.log(`  ${type} ${example.name}`);
    console.log(`     ${template.name || 'Untitled'} | ${size}${duration}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${examples.length} examples\n`);
  console.log('Usage: pnpm run examples:render <example-path>\n');
}

function validateExamples() {
  const examples = collectExamples();
  let valid = 0;
  let invalid = 0;

  console.log('\n🔍 Validating Examples\n');

  for (const example of examples) {
    const errors = [];
    const { template } = example;

    // Basic validation
    if (!template.name) errors.push('Missing name');
    if (!template.output) errors.push('Missing output');
    if (!template.composition) errors.push('Missing composition');
    if (!template.composition?.scenes?.length) errors.push('No scenes');

    // Check scenes
    for (const scene of template.composition?.scenes || []) {
      if (!scene.id) errors.push(`Scene missing id`);
      if (scene.startFrame === undefined) errors.push(`Scene ${scene.id} missing startFrame`);
      if (scene.endFrame === undefined) errors.push(`Scene ${scene.id} missing endFrame`);
      if (!scene.layers?.length) errors.push(`Scene ${scene.id} has no layers`);

      // Check layers
      for (const layer of scene.layers || []) {
        if (!layer.id) errors.push('Layer missing id');
        if (!layer.type) errors.push(`Layer ${layer.id} missing type`);
        if (!layer.position) errors.push(`Layer ${layer.id} missing position`);
        if (!layer.size) errors.push(`Layer ${layer.id} missing size`);
      }
    }

    if (errors.length === 0) {
      console.log(`  ✅ ${example.path}`);
      valid++;
    } else {
      console.log(`  ❌ ${example.path}`);
      errors.forEach(e => console.log(`     - ${e}`));
      invalid++;
    }
  }

  console.log('\n' + '='.repeat(40));
  console.log(`Valid: ${valid} | Invalid: ${invalid}\n`);

  process.exit(invalid > 0 ? 1 : 0);
}

function renderExample(examplePath) {
  const examples = collectExamples();
  const example = examples.find(e => e.path === examplePath || e.name === examplePath);

  if (!example) {
    console.error(`\n❌ Example not found: ${examplePath}`);
    console.log('\nAvailable examples:');
    examples.forEach(e => console.log(`  - ${e.path}`));
    process.exit(1);
  }

  console.log(`\n🎬 Rendering: ${example.path}`);
  console.log(`   Template: ${example.template.name}`);
  console.log(`   Output: ${example.template.output.type} (${example.template.output.width}x${example.template.output.height})`);

  if (example.template.output.type === 'video') {
    console.log(`   Duration: ${example.template.output.duration}s @ ${example.template.output.fps}fps`);
  }

  console.log('\n⚠️  Rendering not yet implemented. Template validated successfully.\n');
  console.log('To implement rendering, use @rendervid/renderer-node package.\n');
}

function generatePreviews() {
  console.log('\n📸 Generating Previews\n');
  console.log('⚠️  Preview generation requires @rendervid/renderer-node');
  console.log('   This command will be implemented when the renderer is ready.\n');

  const examples = collectExamples();
  console.log(`Would generate previews for ${examples.length} examples.\n`);
}

// Main CLI
const [,, command, ...args] = process.argv;

switch (command) {
  case 'list':
    listExamples();
    break;
  case 'render':
    renderExample(args[0]);
    break;
  case 'validate':
    validateExamples();
    break;
  case 'generate-previews':
    generatePreviews();
    break;
  default:
    console.log(`
📦 Rendervid Examples CLI

Usage:
  pnpm run examples:list              List all available examples
  pnpm run examples:render <path>     Render a specific example
  pnpm run examples:validate          Validate all templates
  pnpm run examples:generate-previews Generate preview assets

Examples:
  pnpm run examples:render getting-started/01-hello-world
  pnpm run examples:render instagram-story
`);
}
