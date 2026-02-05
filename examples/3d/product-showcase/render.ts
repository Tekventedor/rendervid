#!/usr/bin/env tsx

import { createNodeRenderer } from '../../../packages/renderer-node/dist/index.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const EXAMPLE_DIR = __dirname;

async function main() {
  console.log('\n🎬 Rendering Product Showcase Example...\n');

  // Load template
  const templatePath = join(EXAMPLE_DIR, 'template.json');
  const template = JSON.parse(readFileSync(templatePath, 'utf-8'));

  console.log(`Template: ${template.name}`);
  console.log(`Duration: ${template.output.duration}s @ ${template.output.fps} FPS`);
  console.log(`Resolution: ${template.output.width}x${template.output.height}\n`);

  // Create renderer with GPU acceleration
  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,
      encoding: 'auto',
      fallback: true,
    },
  });

  // Render video
  const outputPath = join(EXAMPLE_DIR, 'video.mp4');

  console.log('🎥 Rendering video...');
  const startTime = Date.now();

  await renderer.renderVideo({
    template,
    outputPath,
  });

  const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Video rendered in ${renderTime}s: ${outputPath}\n`);

  // Generate GIF preview
  console.log('🎨 Generating preview GIF...');

  const gifPath = join(EXAMPLE_DIR, 'preview.gif');
  const maxDuration = Math.min(5, template.output.duration);
  const scale = Math.floor(template.output.width / 2); // 50% width

  try {
    execSync(
      `ffmpeg -y -i "${outputPath}" ` +
      `-vf "fps=15,scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" ` +
      `-t ${maxDuration} ` +
      `-loop 0 ` +
      `"${gifPath}"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ GIF created: ${gifPath}\n`);
  } catch (error) {
    console.error('❌ GIF generation failed:', error);
    process.exit(1);
  }

  // Extract a preview frame
  console.log('📸 Extracting preview frame...');
  const previewPath = join(EXAMPLE_DIR, 'preview.png');
  const frameTime = template.output.duration / 2; // Middle of video

  try {
    execSync(
      `ffmpeg -y -i "${outputPath}" -ss ${frameTime} -vframes 1 "${previewPath}"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ Preview frame created: ${previewPath}\n`);
  } catch (error) {
    console.error('❌ Preview frame extraction failed:', error);
  }

  console.log('✅ All done!\n');
  console.log(`Files created:`);
  console.log(`  - video.mp4 (${renderTime}s render time)`);
  console.log(`  - preview.gif (${maxDuration}s @ 15 FPS, ${scale}px wide)`);
  console.log(`  - preview.png (frame at ${frameTime}s)\n`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
