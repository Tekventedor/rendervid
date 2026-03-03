#!/usr/bin/env node

/**
 * Universal Render-All Script
 *
 * Renders ALL 125 examples in highest quality:
 *  - Videos: bitrate 8M (1080p) / 16M (4K), preset slow, software encoding
 *  - Images: PNG, quality 100
 *  - Animated GIFs and preview PNG frames extracted for each video
 *
 * Usage:
 *   node examples/render-all.mjs [filter]
 *
 * Examples:
 *   node examples/render-all.mjs          # render all
 *   node examples/render-all.mjs 3d       # render only examples matching "3d"
 *   node examples/render-all.mjs effects  # render only effects/*
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename, relative } from 'path';
import { fileURLToPath } from 'url';
import { exec, execFile } from 'child_process';
import { promisify } from 'util';
import { createRequire } from 'module';
import { readdirSync, statSync } from 'fs';

const require = createRequire(import.meta.url);
const { createNodeRenderer } = require('../packages/renderer-node/dist/index.js');

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filter = process.argv[2] || '';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findTemplates(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findTemplates(full));
    } else if (entry === 'template.json') {
      results.push(full);
    }
  }
  return results;
}

async function checkFFmpeg() {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch {
    return false;
  }
}

async function createGIF(mp4Path, gifPath, fps = 12, scale = 960) {
  const cmd = `ffmpeg -i "${mp4Path}" -vf "fps=${fps},scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 -y "${gifPath}"`;
  try {
    await execAsync(cmd);
    return true;
  } catch (e) {
    console.error(`  ⚠️  GIF failed: ${e.message.split('\n')[0]}`);
    return false;
  }
}

async function extractPreviewFrame(mp4Path, pngPath, frameNumber = 1) {
  const cmd = `ffmpeg -i "${mp4Path}" -vf "select=eq(n\\\\,${frameNumber})" -vframes 1 -y "${pngPath}"`;
  try {
    await execAsync(cmd);
    return true;
  } catch (e) {
    console.error(`  ⚠️  Frame extract failed: ${e.message.split('\n')[0]}`);
    return false;
  }
}

// ─── README Generator ─────────────────────────────────────────────────────────

function titleCase(str) {
  return str.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, c => c.toUpperCase());
}

const categoryDescriptions = {
  '3d': 'Interactive 3D scene rendered with React Three Fiber and WebGL.',
  'animations': 'Animation demonstrating timing, easing, and motion techniques.',
  'backgrounds': 'Animated background effect for use as video backdrops.',
  'behaviors': 'Physics or behavioral simulation demonstrating movement patterns.',
  'cinematic': 'Cinematic-quality motion graphic for broadcast or film production.',
  'content': 'Content card template for social media or marketing.',
  'custom-components': 'Custom React component integration showcasing advanced compositing.',
  'data-visualization': 'Animated data visualization chart or graph.',
  'ecommerce': 'E-commerce promotional video template.',
  'education': 'Educational content template for online learning.',
  'effects': 'Visual effect or shader demonstrating renderer capabilities.',
  'events': 'Event promotion or announcement video template.',
  'fashion': 'Fashion or lifestyle promotional content.',
  'finance': 'Financial data visualization or dashboard template.',
  'fitness': 'Fitness and health content template.',
  'food': 'Food and beverage promotional video template.',
  'getting-started': 'Introductory example for new users of RenderVid.',
  'marketing': 'Marketing and advertising video template.',
  'particles': 'Particle system simulation demonstrating renderer capabilities.',
  'physics': 'Physics simulation using Matter.js for realistic object behavior.',
  'real-estate': 'Real estate listing or property showcase template.',
  'showcase': 'Showcase of built-in capabilities and features.',
  'social': 'Social media content template.',
  'social-media': 'Platform-specific social media template.',
  'streaming': 'Live streaming overlay or transition template.',
  'tech': 'Technology company or software product template.',
  'youtube-lower-third': 'Lower-third overlay for YouTube videos.',
};

function generateReadme(dir, template, relPath, renderedType) {
  const name = template.name || titleCase(relPath.split('/').pop());
  const category = relPath.split('/')[0];
  const description = template.description ||
    `${name}. ${categoryDescriptions[category] || 'Example demonstrating RenderVid capabilities.'}`;

  const output = template.output || {};
  const outputType = output.type || 'video';
  const width = output.width || 1920;
  const height = output.height || 1080;
  const fps = output.fps || 30;
  const duration = output.duration;
  const inputs = template.inputs || [];
  const componentNames = Object.keys(template.customComponents || {});

  const depth = relPath.split('/').length;
  const toExamples = '../'.repeat(depth);
  const toRoot = '../'.repeat(depth + 1);

  const hasGif = existsSync(join(dir, 'preview.gif'));
  const hasMp4 = existsSync(join(dir, 'output.mp4'));
  const hasPng = existsSync(join(dir, 'output.png'));

  const lines = [];

  lines.push(`# ${name}`, '');
  lines.push(`> ${description}`, '');
  lines.push('## Preview', '');

  if (outputType === 'image') {
    lines.push(hasPng ? '![Preview](output.png)' : '*Run `node examples/render-all.mjs` to generate the preview.*');
  } else {
    if (hasGif) {
      lines.push('![Preview](preview.gif)', '');
      if (hasMp4) lines.push('**[📥 Download MP4](output.mp4)**');
    } else if (hasMp4) {
      lines.push('**[📥 Download MP4](output.mp4)**', '', '*Animated GIF preview available after running `node examples/generate-readmes.mjs`*');
    } else {
      lines.push('*Run `node examples/render-all.mjs` to generate the preview GIF and MP4.*');
    }
  }

  lines.push('', '---', '', '## Details', '');
  lines.push('| Property | Value |', '|----------|-------|');
  lines.push(`| **Resolution** | ${width} × ${height} |`);
  if (outputType === 'video') {
    if (duration) lines.push(`| **Duration** | ${duration}s |`);
    lines.push(`| **FPS** | ${fps} |`, `| **Output** | Video (MP4) |`);
  } else {
    lines.push(`| **Output** | Image (PNG) |`);
  }
  if (componentNames.length > 0) lines.push(`| **Custom Components** | ${componentNames.join(', ')} |`);
  lines.push('');

  if (inputs.length > 0) {
    lines.push('## Inputs', '');
    lines.push('| Key | Type | Default | Description |', '|-----|------|---------|-------------|');
    for (const input of inputs) {
      const def = input.default !== undefined ? `\`${JSON.stringify(input.default)}\`` : '—';
      const req = input.required ? ' *(required)*' : '';
      lines.push(`| \`${input.key}\` | ${input.type || 'string'} | ${def} | ${input.label || ''}${req} |`);
    }
    lines.push('');
  }

  lines.push('## Usage', '');
  lines.push('```bash', `node examples/render-all.mjs "${relPath}"`, '```', '');

  if (inputs.length > 0) {
    lines.push('Customize inputs via the MCP server or by editing `template.json`.');
    lines.push('');
  }

  lines.push('---', '');
  lines.push(`*Part of the [RenderVid examples](${toExamples}README.md) · [RenderVid](${toRoot}README.md)*`, '');

  try {
    writeFileSync(join(dir, 'README.md'), lines.join('\n'), 'utf-8');
  } catch (e) {
    console.error(`  ⚠️  README write failed: ${e.message}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║   RenderVid — Universal Render-All (Highest Quality)        ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

const ffmpegAvailable = await checkFFmpeg();
if (!ffmpegAvailable) {
  console.warn('⚠️  FFmpeg not found — GIF/preview generation will be skipped\n');
}

// Discover all templates
const examplesDir = __dirname;
const allTemplates = findTemplates(examplesDir).sort();

// Apply filter
const templates = filter
  ? allTemplates.filter(p => p.includes(filter))
  : allTemplates;

if (templates.length === 0) {
  console.error(`No templates found matching filter: "${filter}"`);
  process.exit(1);
}

console.log(`Found ${templates.length} templates${filter ? ` matching "${filter}"` : ''}\n`);

const renderer = createNodeRenderer();

let successCount = 0;
let failCount = 0;
let skipCount = 0;
const results = [];

for (let i = 0; i < templates.length; i++) {
  const templatePath = templates[i];
  const relPath = templatePath.replace(examplesDir + '/', '').replace('/template.json', '');
  const outputDir = dirname(templatePath);

  console.log(`\n[${'─'.repeat(60)}]`);
  console.log(`  [${i + 1}/${templates.length}] ${relPath}`);
  console.log(`[${'─'.repeat(60)}]`);

  let template;
  try {
    template = JSON.parse(readFileSync(templatePath, 'utf-8'));
  } catch (e) {
    console.error(`  ❌ Invalid JSON: ${e.message}`);
    failCount++;
    results.push({ path: relPath, status: 'fail', reason: 'invalid JSON' });
    continue;
  }

  const outputType = template.output?.type || 'video';
  const width = template.output?.width || 1920;
  const height = template.output?.height || 1080;
  const is4K = width >= 3840;

  // Determine quality settings
  const bitrate = is4K ? '16M' : '8M';
  const quality = { bitrate, preset: 'slow', hardwareAcceleration: { enabled: false } };

  const startTime = Date.now();

  if (outputType === 'image') {
    // ── Image render ──────────────────────────────────────────────
    const pngPath = join(outputDir, 'output.png');
    console.log(`  Type: image (${width}×${height})`);
    console.log(`  Output: ${basename(outputDir)}/output.png`);

    try {
      const result = await renderer.renderImage({
        template,
        inputs: {},
        outputPath: pngPath,
        format: 'png',
        quality: 100,
        renderWaitTime: 500,
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      if (result.success) {
        const sizeKB = (result.fileSize / 1024).toFixed(0);
        console.log(`  ✅ ${sizeKB} KB | ${elapsed}s`);
        generateReadme(outputDir, template, relPath, 'image');
        successCount++;
        results.push({ path: relPath, status: 'ok', type: 'image', size: sizeKB + 'KB', time: elapsed + 's' });
      } else {
        console.error(`  ❌ ${result.error}`);
        failCount++;
        results.push({ path: relPath, status: 'fail', reason: result.error });
      }
    } catch (e) {
      console.error(`  ❌ ${e.message}`);
      failCount++;
      results.push({ path: relPath, status: 'fail', reason: e.message });
    }

  } else {
    // ── Video render ──────────────────────────────────────────────
    const mp4Path = join(outputDir, 'output.mp4');
    const gifPath = join(outputDir, 'preview.gif');
    const previewPath = join(outputDir, 'preview.png');

    const duration = template.output?.duration || 5;
    const fps = template.output?.fps || 30;
    const totalFrames = Math.round(duration * fps);

    console.log(`  Type: video (${width}×${height} @ ${fps}fps, ${duration}s, ${is4K ? '4K' : '1080p'})`);
    console.log(`  Quality: bitrate=${bitrate}, preset=slow, software encoding`);

    try {
      const result = await renderer.renderVideo({
        template,
        inputs: {},
        outputPath: mp4Path,
        ...quality,
        renderWaitTime: 800,
        onProgress: (progress) => {
          if (progress.phase === 'rendering' && progress.currentFrame % 15 === 0) {
            const pct = progress.percent.toFixed(1);
            const f = `${progress.currentFrame}/${progress.totalFrames}`;
            const fps2 = progress.fps ? progress.fps.toFixed(1) : '—';
            process.stdout.write(`\r    [${pct}%] frame ${f} | ${fps2} fps   `);
          }
        },
      });

      process.stdout.write('\n');
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      if (result.success) {
        const sizeMB = (result.fileSize / (1024 * 1024)).toFixed(2);
        console.log(`  ✅ ${sizeMB} MB | ${result.frameCount} frames | ${elapsed}s`);

        if (ffmpegAvailable) {
          const gifFps = fps >= 30 ? 15 : 12;
          const gifScale = is4K ? 960 : 960;
          await createGIF(mp4Path, gifPath, gifFps, gifScale);
          const midFrame = Math.max(1, Math.floor(result.frameCount / 2));
          await extractPreviewFrame(mp4Path, previewPath, midFrame);
        }

        generateReadme(outputDir, template, relPath, 'video');
        successCount++;
        results.push({ path: relPath, status: 'ok', type: 'video', size: sizeMB + 'MB', time: elapsed + 's' });
      } else {
        console.error(`  ❌ ${result.error}`);
        failCount++;
        results.push({ path: relPath, status: 'fail', reason: result.error });
      }
    } catch (e) {
      console.error(`  ❌ ${e.message}`);
      failCount++;
      results.push({ path: relPath, status: 'fail', reason: e.message });
    }
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n\n${'═'.repeat(62)}`);
console.log('  RENDERING COMPLETE');
console.log(`${'═'.repeat(62)}`);
console.log(`\n  Total:   ${templates.length}`);
console.log(`  ✅ OK:    ${successCount}`);
console.log(`  ❌ Failed: ${failCount}`);
if (skipCount > 0) console.log(`  ⏭  Skipped: ${skipCount}`);

if (failCount > 0) {
  console.log('\n  Failed templates:');
  for (const r of results.filter(r => r.status === 'fail')) {
    console.log(`    ✗ ${r.path}: ${r.reason || 'unknown error'}`);
  }
}

console.log('\n  Output files per template directory:');
console.log('    • output.mp4  — full quality video');
console.log('    • output.png  — image render (for image templates)');
console.log('    • preview.gif — animated preview GIF (15fps, 960px wide)');
console.log('    • preview.png — mid-frame still\n');

process.exit(failCount > 0 ? 1 : 0);
