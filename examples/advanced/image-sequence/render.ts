/**
 * Image Sequence Export - Render Script
 *
 * Demonstrates exporting a template as a sequence of image frames
 * using the ImageSequenceExporter.
 *
 * Usage:
 *   npx tsx render.ts
 *   npx tsx render.ts --format jpeg --quality 85
 *   npx tsx render.ts --manifest --pattern "shot-{number}"
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type { Template } from '@rendervid/core';
import { createImageSequenceExporter } from '@rendervid/renderer-node';

// Load the template
const templatePath = join(__dirname, 'template.json');
const template: Template = JSON.parse(readFileSync(templatePath, 'utf-8'));

// Parse command line arguments
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
      } else {
        args[key] = 'true';
      }
    }
  }

  return args;
}

async function main() {
  const args = parseArgs();
  const format = (args.format as 'png' | 'jpeg' | 'webp') || 'png';
  const quality = args.quality ? parseInt(args.quality, 10) : 90;
  const pattern = args.pattern || 'frame-{number}';
  const generateManifest = args.manifest === 'true';

  const outputDir = join(__dirname, 'output');
  const exporter = createImageSequenceExporter();

  console.log('Exporting image sequence...');
  console.log(`  Format: ${format}`);
  console.log(`  Quality: ${quality}`);
  console.log(`  Pattern: ${pattern}`);
  console.log(`  Manifest: ${generateManifest}`);
  console.log(`  Output: ${outputDir}`);

  const result = await exporter.export({
    template,
    outputDir,
    format,
    quality,
    namingPattern: pattern,
    generateManifest,
    onProgress: (progress) => {
      if (progress.phase === 'rendering') {
        const eta = progress.eta ? ` ETA: ${progress.eta.toFixed(1)}s` : '';
        process.stdout.write(
          `\r  Rendering: ${progress.currentFrame}/${progress.totalFrames} (${progress.percent.toFixed(1)}%)${eta}`
        );
      }
    },
  });

  console.log('\n');

  if (result.success) {
    console.log('Export complete!');
    console.log(`  Frames: ${result.frameCount}`);
    console.log(`  Total size: ${((result.fileSize || 0) / 1024).toFixed(1)} KB`);
    console.log(`  Render time: ${(result.renderTime / 1000).toFixed(2)}s`);
  } else {
    console.error('Export failed:', result.error);
    process.exit(1);
  }
}

main().catch(console.error);
