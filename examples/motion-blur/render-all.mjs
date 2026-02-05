#!/usr/bin/env node

/**
 * Render All Motion Blur Examples
 *
 * Generates MP4 videos and animated GIFs for all examples
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createNodeRenderer } = require('../../packages/renderer-node/dist/index.js');

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║   Motion Blur Examples - Complete Rendering               ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

const examples = [
  {
    name: 'basic',
    description: 'Basic motion blur demonstration',
    template: 'basic.json',
    motionBlur: { enabled: true, quality: 'medium' },
    gifSettings: { fps: 15, scale: 960 }
  },
  {
    name: 'basic-no-blur',
    description: 'Same as basic but without motion blur (comparison)',
    template: 'basic.json',
    motionBlur: { enabled: false },
    gifSettings: { fps: 15, scale: 960 }
  },
  {
    name: 'comparison',
    description: 'Side-by-side comparison',
    template: 'comparison.json',
    motionBlur: { enabled: true, quality: 'high' },
    gifSettings: { fps: 12, scale: 960 }
  },
  {
    name: 'advanced',
    description: 'Advanced features showcase',
    template: 'advanced.json',
    motionBlur: { enabled: true, quality: 'high', stochastic: true },
    gifSettings: { fps: 10, scale: 960 }
  },
  {
    name: 'preview-mode',
    description: 'Fast preview mode (2 samples)',
    template: 'preview-mode.json',
    motionBlur: { enabled: true, preview: true },
    gifSettings: { fps: 15, scale: 960 }
  }
];

async function checkFFmpeg() {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch (error) {
    console.error('❌ FFmpeg is required but not installed');
    console.error('   Install: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)');
    return false;
  }
}

async function createGIF(mp4Path, gifPath, settings) {
  const { fps, scale } = settings;
  console.log(`  Creating animated GIF (${fps}fps, ${scale}px wide)...`);

  try {
    const command = `ffmpeg -i "${mp4Path}" -vf "fps=${fps},scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 -y "${gifPath}"`;
    await execAsync(command);
    return true;
  } catch (error) {
    console.error(`  ⚠️  GIF creation failed: ${error.message}`);
    return false;
  }
}

async function extractPreviewFrame(mp4Path, pngPath, frameNumber) {
  console.log(`  Extracting preview frame #${frameNumber}...`);

  try {
    const command = `ffmpeg -i "${mp4Path}" -vf "select=eq(n\\,${frameNumber})" -vframes 1 -y "${pngPath}"`;
    await execAsync(command);
    return true;
  } catch (error) {
    console.error(`  ⚠️  Frame extraction failed: ${error.message}`);
    return false;
  }
}

const totalExamples = examples.length;
let successCount = 0;
let failCount = 0;

// Check FFmpeg first
if (!await checkFFmpeg()) {
  console.log('\nSkipping GIF creation (FFmpeg not available)');
  console.log('Videos will still be rendered.\n');
}

for (let i = 0; i < examples.length; i++) {
  const example = examples[i];
  const num = i + 1;

  console.log(`\n[${'='.repeat(60)}]`);
  console.log(`  Example ${num}/${totalExamples}: ${example.name}`);
  console.log(`[${'='.repeat(60)}]`);
  console.log(`  Description: ${example.description}`);
  console.log(`  Template: ${example.template}`);
  console.log(`  Motion Blur: ${example.motionBlur.enabled ? `Enabled (${example.motionBlur.quality || example.motionBlur.preview ? 'preview' : 'custom'})` : 'Disabled'}`);
  console.log('');

  const templatePath = join(__dirname, example.template);

  if (!existsSync(templatePath)) {
    console.error(`  ❌ Template not found: ${templatePath}\n`);
    failCount++;
    continue;
  }

  const template = JSON.parse(readFileSync(templatePath, 'utf-8'));
  const mp4Path = join(__dirname, `${example.name}.mp4`);
  const gifPath = join(__dirname, `${example.name}.gif`);
  const pngPath = join(__dirname, `${example.name}-preview.png`);

  const renderer = createNodeRenderer();
  const startTime = Date.now();

  try {
    console.log('  Rendering video...');

    const result = await renderer.renderVideo({
      template,
      inputs: {},
      outputPath: mp4Path,
      hardwareAcceleration: { enabled: false },
      bitrate: '8M',
      preset: 'medium',
      motionBlur: example.motionBlur,
      onProgress: (progress) => {
        if (progress.phase === 'rendering' && progress.currentFrame % 10 === 0) {
          const percent = progress.percent.toFixed(1);
          const frame = `${progress.currentFrame}/${progress.totalFrames}`;
          const fps = progress.fps ? progress.fps.toFixed(1) : 'N/A';
          const eta = progress.eta ? `${Math.ceil(progress.eta)}s` : 'calculating...';
          console.log(`    [${percent}%] Frame ${frame} | ${fps} fps | ETA: ${eta}`);
        } else if (progress.phase === 'encoding' && progress.percent % 20 === 0) {
          console.log(`    Encoding... ${progress.percent.toFixed(1)}%`);
        }
      }
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (result.success) {
      const sizeMB = (result.fileSize / (1024 * 1024)).toFixed(2);
      console.log(`\n  ✅ Video rendered successfully!`);
      console.log(`    File: ${example.name}.mp4`);
      console.log(`    Duration: ${result.duration}s`);
      console.log(`    Size: ${sizeMB} MB`);
      console.log(`    Render time: ${elapsed}s`);
      console.log(`    Frames: ${result.frameCount}`);

      // Create GIF
      const ffmpegAvailable = await checkFFmpeg();
      if (ffmpegAvailable) {
        const gifSuccess = await createGIF(mp4Path, gifPath, example.gifSettings);
        if (gifSuccess) {
          console.log(`  ✅ GIF created: ${example.name}.gif`);
        }

        // Extract preview frame (middle of video)
        const midFrame = Math.floor(result.frameCount / 2);
        const pngSuccess = await extractPreviewFrame(mp4Path, pngPath, midFrame);
        if (pngSuccess) {
          console.log(`  ✅ Preview frame: ${example.name}-preview.png`);
        }
      }

      successCount++;
    } else {
      console.error(`\n  ❌ Rendering failed: ${result.error}`);
      failCount++;
    }
  } catch (error) {
    console.error(`\n  ❌ Error: ${error.message}`);
    console.error(error.stack);
    failCount++;
  }
}

console.log(`\n\n[${'='.repeat(60)}]`);
console.log('  RENDERING COMPLETE');
console.log(`[${'='.repeat(60)}]`);
console.log(`\n  Total: ${totalExamples} examples`);
console.log(`  ✅ Success: ${successCount}`);
console.log(`  ❌ Failed: ${failCount}`);

if (successCount > 0) {
  console.log(`\n  Generated files:`);
  for (const example of examples) {
    const mp4 = join(__dirname, `${example.name}.mp4`);
    const gif = join(__dirname, `${example.name}.gif`);
    const png = join(__dirname, `${example.name}-preview.png`);

    if (existsSync(mp4)) {
      console.log(`    ✓ ${example.name}.mp4`);
      if (existsSync(gif)) {
        console.log(`    ✓ ${example.name}.gif`);
      }
      if (existsSync(png)) {
        console.log(`    ✓ ${example.name}-preview.png`);
      }
    }
  }
}

console.log(`\n  Next steps:`);
console.log(`    1. View the videos to see motion blur in action`);
console.log(`    2. Compare basic.mp4 with basic-no-blur.mp4`);
console.log(`    3. Check the GIFs for documentation previews`);
console.log(`    4. The README.md will be updated with GIF embeds\n`);

process.exit(failCount > 0 ? 1 : 0);
