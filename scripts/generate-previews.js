#!/usr/bin/env node

/**
 * Preview Generator for Rendervid Examples
 *
 * Generates animated GIF previews for video templates and PNG for image templates.
 * Uses Puppeteer to render HTML representations and ImageMagick to create GIFs.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const { TemplateProcessor } = require('../packages/core/dist/index.js');

const EXAMPLES_DIR = path.join(__dirname, '..', 'examples');
const CATEGORIES = [
  'getting-started',
  'social-media',
  'marketing',
  'data-visualization',
  'advanced',
  'ecommerce',
  'events',
  'content',
  'education',
  'real-estate',
  'streaming',
  'fitness',
  'food',
  'showcase',
  '3d',
  'backgrounds',
  'effects',
  'custom-components',
  'cinematic',
  'fashion',
  'finance',
  'motion-blur',
  'social',
  'tech',
  'youtube-lower-third',
];
const TEMP_DIR = path.join(__dirname, '..', '.temp-frames');

const GIF_MAX_FRAMES = 240; // Max frames in GIF for file size (increased for full videos)
const MAX_DIMENSION = 400;

/**
 * Collect all example templates from the examples directory
 */
function collectExamples() {
  const examples = [];
  const templateProcessor = new TemplateProcessor();

  for (const category of CATEGORIES) {
    const categoryPath = path.join(EXAMPLES_DIR, category);
    if (!fs.existsSync(categoryPath)) continue;

    const dirs = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const dir of dirs) {
      const templatePath = path.join(categoryPath, dir, 'template.json');
      if (fs.existsSync(templatePath)) {
        try {
          let template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

          // Build defaults from inputs if not present
          if (!template.defaults && template.inputs) {
            template.defaults = {};
            for (const input of template.inputs) {
              if (input.default !== undefined) {
                template.defaults[input.key] = input.default;
              } else if (input.defaultValue !== undefined) {
                template.defaults[input.key] = input.defaultValue;
              }
            }
          }

          // Resolve template variables with defaults
          if (template.defaults) {
            template = templateProcessor.resolveInputs(template, template.defaults);
          }

          examples.push({
            path: `${category}/${dir}`,
            dir: path.join(categoryPath, dir),
            name: dir,
            template,
          });
        } catch (e) {
          console.error(`Error parsing ${templatePath}: ${e.message}`);
        }
      }
    }
  }

  return examples;
}


/**
 * Generate HTML using the browser renderer
 * This uses the same React renderer as video generation, ensuring all features work
 */
function generateHTML(template, frame, viewportWidth, viewportHeight) {
  const { width, height } = template.output;
  const scale = Math.min(viewportWidth / width, viewportHeight / height);
  const bundlePath = path.join(__dirname, '..', 'packages', 'renderer-node', 'dist', 'browser-renderer.global.js');
  const bundleCode = fs.readFileSync(bundlePath, 'utf-8');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; img-src * data: blob: 'unsafe-inline';">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${viewportWidth}px;height:${viewportHeight}px;overflow:hidden;background:#000}
.viewport{width:${viewportWidth}px;height:${viewportHeight}px;position:relative;overflow:hidden;background:#000}
#root{position:absolute;top:0;left:0;width:${width}px;height:${height}px;transform:scale(${scale});transform-origin:top left}
</style>
</head>
<body>
<div class="viewport">
  <div id="root"></div>
</div>
<script>
${bundleCode}
window.RENDERVID_TEMPLATE = ${JSON.stringify(template)};
window.RENDERVID_CURRENT_FRAME = ${frame};
window.RENDERVID_INPUTS = {};
</script>
</body>
</html>`;
}

/**
 * Calculate output dimensions maintaining aspect ratio
 */
function getOutputSize(width, height, maxDim) {
  if (width >= height) {
    const w = Math.min(width, maxDim);
    return { width: w, height: Math.round(w * height / width) };
  } else {
    const h = Math.min(height, maxDim);
    return { width: Math.round(h * width / height), height: h };
  }
}

/**
 * Generate PNG preview for image templates
 */
async function generatePNG(browser, example) {
  const { template, dir } = example;
  const { width, height } = template.output;
  const out = getOutputSize(width, height, 600);

  const page = await browser.newPage();
  await page.setViewport({ width: out.width, height: out.height });

  const html = generateHTML(template, 9999, out.width, out.height);
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Wait for the browser renderer to be ready
  await page.waitForFunction(() => window.RENDERVID_READY === true, { timeout: 5000 });
  await new Promise(r => setTimeout(r, 500)); // Wait for React to render

  const previewPath = path.join(dir, 'preview.png');
  await page.screenshot({ path: previewPath });
  await page.close();

  return previewPath;
}

/**
 * Generate animated GIF for video templates
 *
 * The GIF plays at the same speed as the video (or a portion of it for long videos).
 * - For videos <= GIF_MAX_DURATION seconds: shows entire video at correct speed
 * - For longer videos: shows first GIF_MAX_DURATION seconds at correct speed
 */
async function generateGIF(browser, example) {
  const { template, dir, name } = example;
  const { width, height, fps = 30, duration = 5 } = template.output;
  const out = getOutputSize(width, height, MAX_DIMENSION);

  const totalFrames = fps * duration;

  // Calculate GIF parameters to maintain correct playback speed
  // Show full video duration, but limit total frames for file size
  const gifDuration = duration;
  const gifFrameCount = Math.min(totalFrames, GIF_MAX_FRAMES);

  // frameStep: how many video frames to skip between each GIF frame
  const frameStep = Math.max(1, Math.floor(totalFrames / gifFrameCount));

  // delay: time between GIF frames in 1/100th seconds
  // To maintain correct speed: delay = frameStep * (100 / fps)
  const gifDelay = Math.round(frameStep * 100 / fps);

  const frameDir = path.join(TEMP_DIR, name);
  fs.mkdirSync(frameDir, { recursive: true });

  const page = await browser.newPage();
  await page.setViewport({ width: out.width, height: out.height });

  const framePaths = [];
  const actualFrameCount = Math.ceil((fps * gifDuration) / frameStep);

  for (let i = 0; i < actualFrameCount; i++) {
    const frame = i * frameStep;
    if (frame >= totalFrames) break;

    const html = generateHTML(template, frame, out.width, out.height);

    // Only wait for network on first frame (fonts load), then use faster strategy
    if (i === 0) {
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.waitForFunction(() => window.RENDERVID_READY === true, { timeout: 5000 });
      await new Promise(r => setTimeout(r, 500)); // Extra wait for React to render on first frame
    } else {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.RENDERVID_READY === true, { timeout: 5000 });
      await new Promise(r => setTimeout(r, 50)); // Small delay for React to render
    }

    const framePath = path.join(frameDir, `frame-${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    framePaths.push(framePath);
  }

  await page.close();

  const previewPath = path.join(dir, 'preview.gif');
  try {
    execSync(`magick -delay ${gifDelay} -loop 0 "${frameDir}/frame-*.png" "${previewPath}"`, { stdio: 'pipe' });
  } catch {
    execSync(`convert -delay ${gifDelay} -loop 0 "${frameDir}/frame-*.png" "${previewPath}"`, { stdio: 'pipe' });
  }

  // Cleanup
  framePaths.forEach(f => fs.unlinkSync(f));
  fs.rmdirSync(frameDir);

  return previewPath;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const forceRegenerate = args.includes('--force');
  const parallelArg = args.find(arg => arg.startsWith('--parallel'));
  const parallelCount = parallelArg ? parseInt(parallelArg.split('=')[1] || '8') : 8;

  console.log('\n📸 Generating Previews\n' + '='.repeat(40));

  let examples = collectExamples();
  console.log(`Found ${examples.length} examples`);

  // If --force flag is used, delete existing preview files
  if (forceRegenerate) {
    console.log('🗑️  Force mode: Deleting existing preview files...\n');
    for (const example of examples) {
      const previewGif = path.join(example.dir, 'preview.gif');
      const previewPng = path.join(example.dir, 'preview.png');
      if (fs.existsSync(previewGif)) fs.unlinkSync(previewGif);
      if (fs.existsSync(previewPng)) fs.unlinkSync(previewPng);
    }
  } else {
    // Skip examples that already have preview files
    const examplesWithoutPreviews = examples.filter(example => {
      const isVideo = example.template.output.type === 'video';
      const previewPath = isVideo
        ? path.join(example.dir, 'preview.gif')
        : path.join(example.dir, 'preview.png');
      return !fs.existsSync(previewPath);
    });

    const skipped = examples.length - examplesWithoutPreviews.length;
    if (skipped > 0) {
      console.log(`⏭️  Skipping ${skipped} examples with existing previews`);
      console.log('   (use --force to regenerate all)\n');
    } else {
      console.log('');
    }

    examples = examplesWithoutPreviews;
  }

  if (examples.length === 0) {
    console.log('✅ All previews already exist. Nothing to generate.\n');
    return;
  }

  fs.mkdirSync(TEMP_DIR, { recursive: true });

  if (parallelCount > 1) {
    console.log(`⚡ Running ${parallelCount} parallel instances\n`);
  }

  // Create browser instances for parallel processing
  const browsers = await Promise.all(
    Array.from({ length: parallelCount }, () =>
      puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
        ],
      })
    )
  );

  let success = 0;
  let current = 0;

  // Process examples in parallel batches
  const processExample = async (example, browserIndex) => {
    try {
      const isVideo = example.template.output.type === 'video';
      const previewPath = isVideo
        ? await generateGIF(browsers[browserIndex], example)
        : await generatePNG(browsers[browserIndex], example);
      console.log(`  ✅ ${example.path}`);
      return true;
    } catch (e) {
      console.error(`  ❌ ${example.path}: ${e.message}`);
      return false;
    }
  };

  // Process in batches
  while (current < examples.length) {
    const batch = examples.slice(current, current + parallelCount);
    const results = await Promise.all(
      batch.map((example, index) => processExample(example, index))
    );
    success += results.filter(Boolean).length;
    current += parallelCount;
  }

  // Close all browsers
  await Promise.all(browsers.map(browser => browser.close()));

  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }

  console.log('\n' + '='.repeat(40));
  console.log(`Generated ${success}/${examples.length} previews\n`);
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
