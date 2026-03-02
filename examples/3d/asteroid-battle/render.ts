#!/usr/bin/env tsx

import { createNodeRenderer } from '../../../packages/renderer-node/dist/index.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const EXAMPLE_DIR = __dirname;

async function main() {
  console.log('\n🚀 Rendering Asteroid Battle - Space Combat Example...\n');

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

  console.log('🎥 Rendering video at 4K with highest quality settings...');
  const startTime = Date.now();

  await renderer.renderVideo({
    template,
    outputPath,
    hardwareAcceleration: { enabled: false },
    bitrate: '16M',
    preset: 'slow',
  });

  const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Video rendered in ${renderTime}s: ${outputPath}\n`);

  console.log('🎨 Generating preview GIF...');
  const gifPath = join(EXAMPLE_DIR, 'preview.gif');
  const maxDuration = Math.min(8, template.output.duration);
  const scale = Math.floor(template.output.width / 2);

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
  }

  console.log('📸 Extracting preview frames...');
  const previewFrames = [1, 3, 5, 8];
  for (const t of previewFrames) {
    const previewPath = join(EXAMPLE_DIR, `preview-${t}s.png`);
    try {
      execSync(
        `ffmpeg -y -i "${outputPath}" -ss ${t} -vframes 1 "${previewPath}"`,
        { stdio: 'inherit' }
      );
    } catch (error) {
      console.error(`❌ Frame extraction failed at ${t}s`);
    }
  }
  console.log(`✅ Preview frames created\n`);

  const oldOutputPath = join(EXAMPLE_DIR, 'output.mp4');
  if (existsSync(oldOutputPath)) {
    const { unlinkSync } = await import('fs');
    unlinkSync(oldOutputPath);
  }

  console.log('✅ All done!\n');
  console.log(`Files created:`);
  console.log(`  - video.mp4 (${renderTime}s render time)`);
  console.log(`  - preview.gif (${maxDuration}s @ 15 FPS)\n`);
  console.log('Scene contains:');
  console.log('  - Player fighter (body + cockpit + wings + engine glow)');
  console.log('  - 4 enemy ships (cones with autoRotate)');
  console.log('  - Planet with orbital ring');
  console.log('  - Moon');
  console.log('  - 5 asteroids (low-poly spheres)');
  console.log('  - Explosion debris (5 glowing pieces)');
  console.log('  - Game HUD (hull/shield/energy bars, score, radar, crosshair)\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
