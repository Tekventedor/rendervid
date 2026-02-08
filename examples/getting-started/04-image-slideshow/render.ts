/**
 * Image Slideshow - Render Script
 *
 * Generates preview GIF and MP4 video for the image slideshow example.
 *
 * Usage:
 *   npx tsx render.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { createNodeRenderer } from '@rendervid/renderer-node';
import type { Template } from '@rendervid/core';

const templatePath = join(__dirname, 'template.json');
const rawTemplate = JSON.parse(readFileSync(templatePath, 'utf-8'));

// Pre-resolve template variables using defaults
function resolveTemplate(template: any): Template {
  const defaults = template.defaults || {};
  const json = JSON.stringify(template);
  const resolved = json.replace(/\{\{(\w+)\}\}/g, (_match: string, key: string) => {
    return defaults[key] !== undefined ? String(defaults[key]) : `{{${key}}}`;
  });
  const parsed = JSON.parse(resolved);
  // Remove fields that might confuse the renderer
  delete parsed.inputs;
  delete parsed.defaults;
  delete parsed.name;
  delete parsed.description;
  delete parsed.version;
  return parsed as Template;
}

async function main() {
  const template = resolveTemplate(rawTemplate);

  const renderer = createNodeRenderer({
    gpu: { rendering: true, encoding: 'auto', fallback: true },
  });

  const outputDir = __dirname;

  // Render MP4
  console.log('Rendering MP4...');
  const mp4Result = await renderer.renderVideo({
    template,
    outputPath: join(outputDir, 'video.mp4'),
    codec: 'libx264',
    quality: 23,
    pixelFormat: 'yuv420p',
    useStreaming: true,
    onProgress: (p) => {
      if (p.phase === 'rendering') {
        process.stdout.write(`\r  Rendering: frame ${p.currentFrame}/${p.totalFrames} (${p.percent?.toFixed(0)}%)`);
      }
    },
  });

  if (mp4Result.success) {
    console.log(`\n  MP4 done: ${(mp4Result.fileSize! / 1024 / 1024).toFixed(1)}MB`);
  } else {
    console.error('\n  MP4 failed:', mp4Result.error);
    return;
  }

  // Generate GIF from MP4 using ffmpeg directly
  console.log('Generating GIF from MP4...');
  const { execSync } = await import('child_process');

  const gifPath = join(outputDir, 'preview.gif');
  const palettePath = '/tmp/rendervid-palette.png';

  // Two-pass GIF with palette for quality
  execSync(
    `ffmpeg -y -i "${join(outputDir, 'video.mp4')}" -vf "fps=10,scale=640:-1:flags=lanczos,palettegen=max_colors=128" "${palettePath}"`,
    { stdio: 'pipe' }
  );
  execSync(
    `ffmpeg -y -i "${join(outputDir, 'video.mp4')}" -i "${palettePath}" -lavfi "fps=10,scale=640:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=floyd_steinberg" "${gifPath}"`,
    { stdio: 'pipe' }
  );

  const fs = await import('fs/promises');
  const gifStats = await fs.stat(gifPath);
  console.log(`  GIF done: ${(gifStats.size / 1024 / 1024).toFixed(1)}MB`);

  console.log('Done!');
}

main().catch(console.error);
