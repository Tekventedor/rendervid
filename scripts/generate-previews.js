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
];
const TEMP_DIR = path.join(__dirname, '..', '.temp-frames');

const GIF_FRAME_COUNT = 30;
const GIF_DELAY = 6;
const MAX_DIMENSION = 400;

/**
 * Replace {{key}} with values from defaults object
 */
function replaceVars(obj, defaults) {
  if (!defaults || !obj) return obj;

  if (typeof obj === 'string') {
    let result = obj;
    for (const [key, value] of Object.entries(defaults)) {
      result = result.split(`{{${key}}}`).join(String(value));
    }
    return result;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceVars(item, defaults));
  }

  if (typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceVars(value, defaults);
    }
    return result;
  }

  return obj;
}

/**
 * Collect all example templates from the examples directory
 */
function collectExamples() {
  const examples = [];

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
          const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
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
 * Calculate animation opacity at a given frame
 */
function getOpacity(animations, frame) {
  let opacity = 1;

  for (const anim of animations || []) {
    const { type, delay = 0, duration = 30 } = anim;
    const start = delay;
    const end = delay + duration;

    if (type === 'entrance') {
      if (frame < start) {
        opacity = 0;
      } else if (frame < end) {
        const progress = (frame - start) / duration;
        opacity *= Math.min(1, progress);
      }
    } else if (type === 'exit') {
      if (frame >= start && frame < end) {
        const progress = (frame - start) / duration;
        opacity *= Math.max(0, 1 - progress);
      } else if (frame >= end) {
        opacity = 0;
      }
    }
  }

  return opacity;
}

/**
 * Generate HTML for a single frame
 */
function generateHTML(template, frame, viewportWidth, viewportHeight) {
  const { width, height } = template.output;
  const scale = Math.min(viewportWidth / width, viewportHeight / height);
  const defaults = template.defaults || {};

  // Find current scene
  const scenes = template.composition?.scenes || [];
  let scene = scenes[0];
  for (const s of scenes) {
    if (frame >= s.startFrame && frame < s.endFrame) {
      scene = s;
      break;
    }
  }

  if (!scene) return '<html><body style="background:#000"></body></html>';

  const sceneFrame = frame - (scene.startFrame || 0);
  const layers = replaceVars(scene.layers || [], defaults);

  const elements = layers.map(layer => {
    const { id, type, position, size, props, opacity = 1, animations } = layer;
    const x = position?.x || 0;
    const y = position?.y || 0;
    const w = size?.width || 100;
    const h = size?.height || 100;

    const animOpacity = getOpacity(animations, sceneFrame);
    const finalOpacity = opacity * animOpacity;

    let css = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;opacity:${finalOpacity};`;
    let inner = '';

    if (type === 'shape' && props) {
      const { shape, fill, gradient, borderRadius } = props;

      if (gradient) {
        const stops = (gradient.colors || [])
          .map(c => `${c.color === 'transparent' ? 'rgba(0,0,0,0)' : c.color} ${c.offset * 100}%`)
          .join(',');
        if (gradient.type === 'radial') {
          css += `background:radial-gradient(circle,${stops});`;
        } else {
          css += `background:linear-gradient(${gradient.angle || 0}deg,${stops});`;
        }
      } else if (fill) {
        css += `background:${fill};`;
      }

      if (borderRadius) css += `border-radius:${borderRadius}px;`;
      if (shape === 'ellipse') css += `border-radius:50%;`;

    } else if (type === 'text' && props) {
      const { text, fontSize, fontWeight, color, textAlign, fontFamily } = props;
      css += `font-size:${fontSize || 16}px;`;
      css += `font-weight:${fontWeight || 'normal'};`;
      css += `color:${color || '#fff'};`;
      css += `font-family:${fontFamily || 'Inter,sans-serif'};`;
      css += `display:flex;align-items:center;`;
      css += `justify-content:${textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'};`;
      inner = `<span>${text || ''}</span>`;
    } else if (type === 'image' && props) {
      const { src, fit = 'cover', borderRadius } = props;
      css += `overflow:hidden;`;
      if (borderRadius) css += `border-radius:${borderRadius}px;`;
      inner = `<img src="${src}" style="width:100%;height:100%;object-fit:${fit};" crossorigin="anonymous" />`;
    } else if (type === 'video' && props) {
      const { src, fit = 'cover', borderRadius } = props;
      css += `overflow:hidden;`;
      if (borderRadius) css += `border-radius:${borderRadius}px;`;
      // For preview, use video element - Puppeteer will capture the current frame
      inner = `<video src="${src}" style="width:100%;height:100%;object-fit:${fit};" autoplay muted loop crossorigin="anonymous"></video>`;
    }

    return `<div id="${id}" style="${css}">${inner}</div>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${viewportWidth}px;height:${viewportHeight}px;overflow:hidden;background:#000}
.viewport{width:${viewportWidth}px;height:${viewportHeight}px;position:relative;overflow:hidden;background:#000}
.canvas{position:absolute;top:0;left:0;width:${width}px;height:${height}px;background:#000;font-family:Inter,sans-serif;transform:scale(${scale});transform-origin:top left}
</style>
</head>
<body>
<div class="viewport"><div class="canvas">${elements}</div></div>
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
  await new Promise(r => setTimeout(r, 500)); // Wait for fonts

  const previewPath = path.join(dir, 'preview.png');
  await page.screenshot({ path: previewPath });
  await page.close();

  return previewPath;
}

/**
 * Generate animated GIF for video templates
 */
async function generateGIF(browser, example) {
  const { template, dir, name } = example;
  const { width, height, fps = 30, duration = 5 } = template.output;
  const out = getOutputSize(width, height, MAX_DIMENSION);

  const totalFrames = fps * duration;
  const frameStep = Math.max(1, Math.floor(totalFrames / GIF_FRAME_COUNT));

  const frameDir = path.join(TEMP_DIR, name);
  fs.mkdirSync(frameDir, { recursive: true });

  const page = await browser.newPage();
  await page.setViewport({ width: out.width, height: out.height });

  const framePaths = [];
  for (let i = 0; i < GIF_FRAME_COUNT; i++) {
    const frame = i * frameStep;
    const html = generateHTML(template, frame, out.width, out.height);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    if (i === 0) {
      await new Promise(r => setTimeout(r, 500)); // Wait for fonts on first frame
    }

    const framePath = path.join(frameDir, `frame-${String(i).padStart(3, '0')}.png`);
    await page.screenshot({ path: framePath });
    framePaths.push(framePath);
  }

  await page.close();

  const previewPath = path.join(dir, 'preview.gif');
  try {
    execSync(`magick -delay ${GIF_DELAY} -loop 0 "${frameDir}/frame-*.png" "${previewPath}"`, { stdio: 'pipe' });
  } catch {
    execSync(`convert -delay ${GIF_DELAY} -loop 0 "${frameDir}/frame-*.png" "${previewPath}"`, { stdio: 'pipe' });
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
  console.log('\n📸 Generating Previews\n' + '='.repeat(40));

  const examples = collectExamples();
  console.log(`Found ${examples.length} examples\n`);

  fs.mkdirSync(TEMP_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  let success = 0;

  for (const example of examples) {
    try {
      const isVideo = example.template.output.type === 'video';
      const previewPath = isVideo
        ? await generateGIF(browser, example)
        : await generatePNG(browser, example);
      console.log(`  ✅ ${example.path}`);
      success++;
    } catch (e) {
      console.error(`  ❌ ${example.path}: ${e.message}`);
    }
  }

  await browser.close();

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
