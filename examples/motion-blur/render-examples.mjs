#!/usr/bin/env node

/**
 * Render Motion Blur Examples
 *
 * Generates example videos showing motion blur effects
 */

import { createNodeRenderer } from '@rendervid/renderer-node';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Rendering Motion Blur Examples\n');
console.log('This will take several minutes due to motion blur...\n');

const examples = [
  {
    name: 'basic',
    description: 'Basic motion blur demo',
    motionBlur: { enabled: true, quality: 'medium' }
  },
  {
    name: 'basic-no-blur',
    description: 'Basic demo without motion blur (for comparison)',
    motionBlur: { enabled: false },
    templateFile: 'basic.json'
  },
  {
    name: 'comparison',
    description: 'Side-by-side comparison',
    motionBlur: { enabled: true, quality: 'high' }
  },
  {
    name: 'advanced',
    description: 'Advanced features showcase',
    motionBlur: { enabled: true, quality: 'high', stochastic: true }
  },
  {
    name: 'preview-mode',
    description: 'Fast preview mode demo',
    motionBlur: { enabled: true, preview: true }
  }
];

for (const example of examples) {
  const templateFile = example.templateFile || `${example.name.replace('-no-blur', '')}.json`;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Rendering: ${example.name}`);
  console.log(`Description: ${example.description}`);
  console.log(`Template: ${templateFile}`);
  console.log(`Motion Blur: ${example.motionBlur.enabled ? `Enabled (${example.motionBlur.quality || 'custom'})` : 'Disabled'}`);
  console.log(`${'='.repeat(60)}\n`);

  const template = JSON.parse(readFileSync(join(__dirname, templateFile), 'utf-8'));

  const renderer = createNodeRenderer();
  const startTime = Date.now();

  try {
    const result = await renderer.renderVideo({
      template,
      inputs: {},
      outputPath: join(__dirname, `${example.name}.mp4`),
      hardwareAcceleration: { enabled: false }, // Force software for quality
      bitrate: '8M',
      preset: 'slow',
      motionBlur: example.motionBlur,
      onProgress: (progress) => {
        if (progress.phase === 'rendering') {
          const percent = progress.percent.toFixed(1);
          const frame = `${progress.currentFrame}/${progress.totalFrames}`;
          const fps = progress.fps ? progress.fps.toFixed(1) : 'N/A';
          const eta = progress.eta ? `${Math.ceil(progress.eta)}s` : 'calculating...';

          if (progress.currentFrame % 10 === 0 || progress.currentFrame === progress.totalFrames) {
            console.log(`  [${percent}%] Frame ${frame} | ${fps} fps | ETA: ${eta}`);
          }
        } else if (progress.phase === 'encoding') {
          console.log(`  Encoding video... ${progress.percent.toFixed(1)}%`);
        }
      }
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (result.success) {
      const sizeMB = (result.fileSize / (1024 * 1024)).toFixed(2);
      console.log(`\n✓ SUCCESS`);
      console.log(`  Output: ${result.outputPath}`);
      console.log(`  Duration: ${result.duration}s`);
      console.log(`  Size: ${sizeMB} MB`);
      console.log(`  Render time: ${elapsed}s`);
      console.log(`  Frame count: ${result.frameCount}`);
    } else {
      console.error(`\n✗ FAILED: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n✗ ERROR: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log('All examples rendered successfully!');
console.log(`${'='.repeat(60)}\n`);

console.log('Generated files:');
examples.forEach(ex => {
  console.log(`  - ${ex.name}.mp4`);
});

console.log('\nNext steps:');
console.log('  1. Play the videos to see the motion blur effect');
console.log('  2. Compare basic.mp4 with basic-no-blur.mp4');
console.log('  3. Extract preview frames with FFmpeg:');
console.log('     ffmpeg -i basic.mp4 -vf "select=eq(n\\,45)" -vframes 1 preview.png');
console.log('     ffmpeg -i basic-no-blur.mp4 -vf "select=eq(n\\,45)" -vframes 1 preview-no-blur.png');
