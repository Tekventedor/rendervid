/**
 * First Image - Render Script
 *
 * Usage:
 *   npx tsx render.ts
 *   npx tsx render.ts --headline "My Headline" --tagline "My Tagline"
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
    headline: customInputs.headline || template.defaults?.headline || 'Your Amazing Content',
    tagline: customInputs.tagline || template.defaults?.tagline || 'Click to learn more',
    brandName: customInputs.brandName || template.defaults?.brandName || 'Your Brand',
    primaryColor: customInputs.primaryColor || template.defaults?.primaryColor || '#8b5cf6',
    backgroundColor: customInputs.backgroundColor || template.defaults?.backgroundColor || '#18181b',
  };

  console.log('Rendering First Image template...');
  console.log('Inputs:', inputs);
  console.log('Output:', template.output);

  console.log('\nTo render this template, use:');
  console.log('  pnpm run examples:render getting-started/03-first-image');
}

main().catch(console.error);
