import { createNodeRenderer } from '@rendervid/renderer-node';
import { getGifOptimizationPreset } from '@rendervid/core';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const templatePath = path.join(__dirname, 'template.json');
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

  const renderer = createNodeRenderer();

  // Get the social media preset for optimal GIF settings
  const preset = getGifOptimizationPreset('social');

  console.log('Rendering animated GIF with social media preset...');
  console.log(`  Max size: ${preset.maxFileSize / 1024 / 1024}MB`);
  console.log(`  Colors: ${preset.colors}`);
  console.log(`  FPS: ${preset.fps}`);

  const result = await renderer.renderGif({
    template,
    outputPath: path.join(__dirname, 'output.gif'),
    colors: preset.colors,
    dither: preset.dither,
    loop: 0, // Infinite loop
    optimizationLevel: 'basic',
    maxFileSize: preset.maxFileSize,
    onProgress: (progress) => {
      const percent = Math.round(progress.percent);
      process.stderr.write(`\r[${progress.phase}] ${percent}%`);
    },
  });

  console.log('');

  if (result.success) {
    console.log('GIF rendered successfully!');
    console.log(`  Output: ${result.outputPath}`);
    console.log(`  Size: ${((result.fileSize ?? 0) / 1024).toFixed(1)}KB`);
    console.log(`  Dimensions: ${result.width}x${result.height}`);
    console.log(`  Frames: ${result.frameCount}`);
    console.log(`  Render time: ${(result.renderTime / 1000).toFixed(1)}s`);
  } else {
    console.error('GIF render failed:', result.error);
    process.exit(1);
  }
}

main().catch(console.error);
