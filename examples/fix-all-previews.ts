#!/usr/bin/env tsx

import { readdirSync, existsSync, renameSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const EXAMPLES_DIR = __dirname;

interface ExampleStatus {
  path: string;
  name: string;
  hasTemplate: boolean;
  hasVideo: boolean;
  hasOutput: boolean;
  hasGif: boolean;
  needsRename: boolean;
  needsGif: boolean;
}

function scanExamples(): ExampleStatus[] {
  const examples: ExampleStatus[] = [];

  // Find all category directories
  const categories = readdirSync(EXAMPLES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
    .map(d => d.name);

  for (const category of categories) {
    const categoryDir = join(EXAMPLES_DIR, category);
    const exampleDirs = readdirSync(categoryDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .map(d => d.name);

    for (const exampleName of exampleDirs) {
      const examplePath = join(categoryDir, exampleName);

      const hasTemplate = existsSync(join(examplePath, 'template.json'));
      const hasVideo = existsSync(join(examplePath, 'video.mp4'));
      const hasOutput = existsSync(join(examplePath, 'output.mp4'));
      const hasGif = existsSync(join(examplePath, 'preview.gif'));

      const needsRename = hasOutput && !hasVideo;
      const needsGif = hasTemplate && !hasGif;

      if (hasTemplate && (needsRename || needsGif)) {
        examples.push({
          path: examplePath,
          name: `${category}/${exampleName}`,
          hasTemplate,
          hasVideo,
          hasOutput,
          hasGif,
          needsRename,
          needsGif,
        });
      }
    }
  }

  return examples;
}

function renameOutputToVideo(example: ExampleStatus): void {
  const outputPath = join(example.path, 'output.mp4');
  const videoPath = join(example.path, 'video.mp4');

  if (existsSync(outputPath)) {
    renameSync(outputPath, videoPath);
    console.log(`  ✅ Renamed output.mp4 → video.mp4`);
  }
}

function generateGif(example: ExampleStatus): void {
  const videoPath = join(example.path, 'video.mp4');
  const gifPath = join(example.path, 'preview.gif');

  if (!existsSync(videoPath)) {
    console.log(`  ⚠️  video.mp4 not found, skipping GIF`);
    return;
  }

  try {
    // Get video duration
    const durationOutput = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`,
      { encoding: 'utf-8' }
    );
    const duration = parseFloat(durationOutput.trim());
    const maxDuration = Math.min(5, duration);

    // Get video dimensions
    const dimensionsOutput = execSync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`,
      { encoding: 'utf-8' }
    );
    const width = parseInt(dimensionsOutput.trim());
    const scale = Math.floor(width / 2); // 50% width

    console.log(`  🎨 Generating GIF (${maxDuration}s, ${scale}px wide)...`);

    execSync(
      `ffmpeg -y -v error -i "${videoPath}" ` +
      `-vf "fps=15,scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" ` +
      `-t ${maxDuration} ` +
      `-loop 0 ` +
      `"${gifPath}"`,
      { stdio: 'pipe' }
    );

    const gifSize = statSync(gifPath).size;
    const gifSizeKB = Math.round(gifSize / 1024);
    console.log(`  ✅ GIF created (${gifSizeKB}KB)`);
  } catch (error) {
    console.error(`  ❌ GIF generation failed:`, error.message);
  }
}

async function main() {
  console.log('\n🔍 Scanning all examples...\n');

  const examples = scanExamples();

  if (examples.length === 0) {
    console.log('✅ All examples are up to date!\n');
    return;
  }

  console.log(`Found ${examples.length} examples that need fixing:\n`);

  for (const example of examples) {
    console.log(`📁 ${example.name}`);

    if (example.needsRename) {
      renameOutputToVideo(example);
    }

    if (example.needsGif) {
      generateGif(example);
    }

    console.log('');
  }

  console.log(`\n✅ Fixed ${examples.length} examples!\n`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
