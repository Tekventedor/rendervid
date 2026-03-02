#!/usr/bin/env tsx

import { createNodeRenderer } from '../../../packages/renderer-node/dist/index.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const EXAMPLE_DIR = __dirname;

async function main() {
  console.log('\n🎬 Rendering Falling Boxes Example...\n');

  const templatePath = join(EXAMPLE_DIR, 'template.json');
  const template = JSON.parse(readFileSync(templatePath, 'utf-8'));

  console.log(`Template: ${template.name}`);
  console.log(`Duration: ${template.output.duration}s @ ${template.output.fps} FPS`);
  console.log(`Resolution: ${template.output.width}x${template.output.height}\n`);

  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,
      encoding: 'none',
      fallback: true,
    },
  });

  const outputPath = join(EXAMPLE_DIR, 'video.mp4');

  console.log('🎥 Rendering video...');
  const startTime = Date.now();

  await renderer.renderVideo({
    template,
    outputPath,
    hardwareAcceleration: { enabled: false },
    bitrate: '8M',
    preset: 'slow',
  });

  const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Video rendered in ${renderTime}s: ${outputPath}\n`);

  console.log('🎨 Generating preview GIF...');

  const gifPath = join(EXAMPLE_DIR, 'preview.gif');
  const scale = Math.floor(template.output.width / 2); // 960px

  try {
    execSync(
      `ffmpeg -y -i "${outputPath}" ` +
      `-vf "fps=15,scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" ` +
      `-t ${template.output.duration} ` +
      `-loop 0 ` +
      `"${gifPath}"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ GIF created: ${gifPath}\n`);
  } catch (error) {
    console.error('❌ GIF generation failed:', error);
    process.exit(1);
  }

  // Clean up old output files
  for (const old of ['output.mp4', 'output.gif']) {
    const p = join(EXAMPLE_DIR, old);
    if (existsSync(p)) {
      const { unlinkSync } = await import('fs');
      unlinkSync(p);
      console.log(`🗑️  Removed ${old}`);
    }
  }

  console.log('\n✅ All done!\n');
  console.log(`Files created:`);
  console.log(`  - video.mp4 (${renderTime}s render time)`);
  console.log(`  - preview.gif (${template.output.duration}s @ 15 FPS, ${scale}px wide)\n`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
