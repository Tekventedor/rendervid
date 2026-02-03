#!/usr/bin/env tsx

import { createBrowserRenderer } from '@rendervid/renderer-browser';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface RenderOptions {
  exampleName: string;
  skipIfExists?: boolean;
  generateGif?: boolean;
}

async function renderExample({ exampleName, skipIfExists = true, generateGif = true }: RenderOptions) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📹 Rendering: ${exampleName}`);
  console.log('='.repeat(60));

  const exampleDir = join(__dirname, exampleName);
  const templatePath = join(exampleDir, 'template.json');
  const mp4Path = join(exampleDir, 'video.mp4');
  const gifPath = join(exampleDir, 'preview.gif');

  // Check if files already exist
  if (skipIfExists && existsSync(mp4Path) && existsSync(gifPath)) {
    console.log('✅ Video and GIF already exist, skipping...');
    return;
  }

  // Check if template exists
  if (!existsSync(templatePath)) {
    console.log(`❌ Template not found: ${templatePath}`);
    return;
  }

  // Load template
  console.log('📄 Loading template...');
  const template = JSON.parse(readFileSync(templatePath, 'utf-8'));

  console.log(`   Resolution: ${template.output.width}x${template.output.height}`);
  console.log(`   FPS: ${template.output.fps}`);
  console.log(`   Duration: ${template.output.duration}s`);
  console.log(`   Total frames: ${template.output.fps * template.output.duration}`);

  // Create renderer
  const renderer = createBrowserRenderer();

  // Render video
  console.log('🎬 Starting render...');
  const startTime = Date.now();

  try {
    const result = await renderer.renderVideo({
      template,
      format: 'mp4',
      onProgress: (progress) => {
        if (progress.currentFrame % 30 === 0 || progress.currentFrame === progress.totalFrames) {
          const percent = (progress.percentage || 0).toFixed(1);
          const eta = progress.estimatedTimeRemaining
            ? `ETA: ${Math.ceil(progress.estimatedTimeRemaining)}s`
            : '';
          console.log(`   Progress: ${percent}% - Frame ${progress.currentFrame}/${progress.totalFrames} ${eta}`);
        }
      }
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n✅ Video rendered successfully!');
    console.log(`   Duration: ${result.duration}s`);
    console.log(`   Size: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Frames: ${result.frameCount}`);
    console.log(`   Render time: ${duration}s`);

    // Save MP4
    if (!skipIfExists || !existsSync(mp4Path)) {
      const buffer = Buffer.from(await result.blob.arrayBuffer());
      writeFileSync(mp4Path, buffer);
      console.log(`💾 Saved MP4: ${mp4Path}`);
    }

    // Generate GIF preview
    if (generateGif && (!skipIfExists || !existsSync(gifPath))) {
      console.log('🎨 Generating GIF preview...');

      // Use ffmpeg to create optimized GIF
      // - Scale to 50% width for smaller file size
      // - FPS reduced to 15 for smaller file size
      // - Max 5 seconds or full duration if shorter
      const maxDuration = Math.min(5, template.output.duration);
      const scale = Math.floor(template.output.width / 2);

      await execAsync(
        `ffmpeg -y -i "${mp4Path}" -vf "fps=15,scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -t ${maxDuration} -loop 0 "${gifPath}"`
      );

      console.log(`✅ GIF created: ${gifPath}`);
    }

    renderer.dispose();
  } catch (error) {
    console.error('❌ Render failed:', error);
    renderer.dispose();
    throw error;
  }
}

async function main() {
  const examplesDir = __dirname;

  // Get all example directories
  const examples = readdirSync(examplesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => !dirent.name.startsWith('.') && !dirent.name.startsWith('_') && dirent.name !== 'node_modules' && dirent.name !== 'renders')
    .map(dirent => dirent.name)
    .sort();

  console.log(`\n🎬 Found ${examples.length} examples to render:`);
  examples.forEach((name, i) => console.log(`   ${i + 1}. ${name}`));

  // Check if specific example was requested
  const requestedExample = process.argv[2];

  if (requestedExample) {
    if (examples.includes(requestedExample)) {
      await renderExample({
        exampleName: requestedExample,
        skipIfExists: false, // Force re-render when explicitly requested
        generateGif: true
      });
    } else {
      console.error(`\n❌ Example not found: ${requestedExample}`);
      console.log(`\nAvailable examples: ${examples.join(', ')}`);
      process.exit(1);
    }
  } else {
    // Render all examples
    for (const example of examples) {
      try {
        await renderExample({
          exampleName: example,
          skipIfExists: true,
          generateGif: true
        });
      } catch (error) {
        console.error(`❌ Failed to render ${example}:`, error);
        // Continue with next example
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All examples processed!');
  console.log('='.repeat(60) + '\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
