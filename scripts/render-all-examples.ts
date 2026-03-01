#!/usr/bin/env npx tsx

import { createNodeRenderer } from '@rendervid/renderer-node';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const examples = [
  'examples/physics/falling-boxes',
  'examples/particles/explosion-mvp',
  'examples/animations/keyframe-cube',
  'examples/behaviors/orbiting-cube',
  'examples/particles/fire-explosion',
  'examples/animations/complex-path',
  'examples/behaviors/complex-motion',
  'examples/physics/collision-demo',
];

async function renderExample(examplePath: string) {
  const templatePath = path.join(examplePath, 'template.json');
  const outputPath = path.join(examplePath, 'output.mp4');
  const gifPath = path.join(examplePath, 'output.gif');

  console.log(`\n📹 Rendering: ${examplePath}`);

  if (!fs.existsSync(templatePath)) {
    console.log('  ⚠️  No template.json found');
    return;
  }

  try {
    const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
    const renderer = createNodeRenderer();

    console.log('  Rendering video...');
    const result = await renderer.renderVideo({
      template,
      outputPath,
      onProgress: (p) => {
        if (p.phase === 'rendering') {
          process.stdout.write(`\r  Progress: ${p.percent.toFixed(0)}%`);
        }
      },
    });

    if (!result.success) {
      console.log(`\n  ❌ Failed: ${result.error}`);
      return;
    }

    console.log(`\n  ✅ Video: ${outputPath}`);

    // Create GIF
    console.log('  Creating GIF...');
    execSync(
      `ffmpeg -y -i "${outputPath}" -vf "fps=15,scale=640:-1:flags=lanczos" "${gifPath}" 2>/dev/null`,
      { stdio: 'pipe' }
    );
    console.log(`  ✅ GIF: ${gifPath}`);

  } catch (error: any) {
    console.log(`\n  ❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🎬 Rendering all gaming examples...');

  for (const example of examples) {
    await renderExample(example);
  }

  console.log('\n✅ Done!');
}

main();
