#!/usr/bin/env tsx

import { createBrowserRenderer } from '@rendervid/renderer-browser';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('Loading template...');
  const templatePath = join(__dirname, 'time-running-out.json');
  const template = JSON.parse(readFileSync(templatePath, 'utf-8'));

  console.log('Creating renderer...');
  const renderer = createBrowserRenderer();

  console.log('Rendering video (this may take a few minutes)...');
  console.log(`- Resolution: ${template.output.width}x${template.output.height}`);
  console.log(`- FPS: ${template.output.fps}`);
  console.log(`- Duration: ${template.output.duration}s`);
  console.log(`- Total frames: ${template.output.fps * template.output.duration}`);

  const startTime = Date.now();

  const result = await renderer.renderVideo({
    template,
    format: 'mp4',
    onProgress: (progress) => {
      const percent = (progress.percentage || 0).toFixed(1);
      const eta = progress.estimatedTimeRemaining
        ? `ETA: ${Math.ceil(progress.estimatedTimeRemaining)}s`
        : '';
      console.log(`Progress: ${percent}% - Frame ${progress.currentFrame}/${progress.totalFrames} - ${progress.phase} ${eta}`);
    }
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n✅ Video rendered successfully!');
  console.log(`- Duration: ${result.duration}s`);
  console.log(`- Size: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- Frames: ${result.frameCount}`);
  console.log(`- Render time: ${duration}s`);

  // Save video
  const outputPath = join(__dirname, 'time-running-out.mp4');
  const buffer = Buffer.from(await result.blob.arrayBuffer());
  writeFileSync(outputPath, buffer);
  console.log(`\n💾 Saved to: ${outputPath}`);

  // Clean up
  renderer.dispose();
}

main().catch(console.error);
