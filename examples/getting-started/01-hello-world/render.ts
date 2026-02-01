/**
 * Hello World - Render Script
 *
 * This script demonstrates how to render the hello-world template programmatically.
 *
 * Usage:
 *   npx tsx render.ts
 *   npx tsx render.ts --message "Custom Message"
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type { Template } from '@rendervid/core';

// Load the template
const templatePath = join(__dirname, 'template.json');
const template: Template = JSON.parse(readFileSync(templatePath, 'utf-8'));

// Parse command line arguments for custom inputs
function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1];
      if (value && !value.startsWith('--')) {
        args[key] = value;
        i++;
      }
    }
  }

  return args;
}

async function main() {
  const customInputs = parseArgs();

  // Merge custom inputs with defaults
  const inputs = {
    message: customInputs.message || template.defaults?.message || 'Hello, World!',
    backgroundColor:
      customInputs.backgroundColor || template.defaults?.backgroundColor || '#1a1a2e',
    textColor: customInputs.textColor || template.defaults?.textColor || '#ffffff',
  };

  console.log('Rendering Hello World template...');
  console.log('Inputs:', inputs);
  console.log('Output:', template.output);

  // Note: Actual rendering requires @rendervid/renderer-node
  // This script demonstrates the template loading and input handling

  console.log('\nTo render this template, use:');
  console.log('  pnpm run examples:render getting-started/01-hello-world');
}

main().catch(console.error);
