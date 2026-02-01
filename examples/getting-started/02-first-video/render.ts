/**
 * First Video - Render Script
 *
 * Usage:
 *   npx tsx render.ts
 *   npx tsx render.ts --title "My Title" --subtitle "My Subtitle"
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type { Template } from '@rendervid/core';

const templatePath = join(__dirname, 'template.json');
const template: Template = JSON.parse(readFileSync(templatePath, 'utf-8'));

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

  const inputs = {
    title: customInputs.title || template.defaults?.title || 'Welcome to Rendervid',
    subtitle:
      customInputs.subtitle ||
      template.defaults?.subtitle ||
      'Create stunning videos programmatically',
    primaryColor: customInputs.primaryColor || template.defaults?.primaryColor || '#3b82f6',
    backgroundColor: customInputs.backgroundColor || template.defaults?.backgroundColor || '#0f172a',
  };

  console.log('Rendering First Video template...');
  console.log('Inputs:', inputs);
  console.log('Output:', template.output);

  console.log('\nTo render this template, use:');
  console.log('  pnpm run examples:render getting-started/02-first-video');
}

main().catch(console.error);
