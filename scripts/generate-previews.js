#!/usr/bin/env node

/**
 * Preview Generator
 *
 * Generates preview images for all example templates.
 * - Video templates: Animated GIF (preview.gif)
 * - Image templates: Static PNG (preview.png)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const puppeteer = require('puppeteer');

const EXAMPLES_DIR = path.join(__dirname, '..', 'examples');
const CATEGORIES = ['getting-started', 'social-media', 'marketing', 'data-visualization'];
const TEMP_DIR = path.join(__dirname, '..', '.temp-frames');

// GIF settings
const GIF_FRAME_COUNT = 24; // Number of frames in the GIF
const GIF_DELAY = 8; // Delay between frames (in 1/100s, 8 = 80ms = ~12fps)

/**
 * Replace all template variables {{key}} with values from defaults
 */
function replaceTemplateVariables(obj, defaults) {
  if (!defaults) return obj;

  if (typeof obj === 'string') {
    let result = obj;
    for (const [key, value] of Object.entries(defaults)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
    }
    return result;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceTemplateVariables(item, defaults));
  }

  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceTemplateVariables(value, defaults);
    }
    return result;
  }

  return obj;
}

/**
 * Collect all example templates
 */
function collectExamples() {
  const examples = [];

  for (const category of CATEGORIES) {
    const categoryPath = path.join(EXAMPLES_DIR, category);
    if (!fs.existsSync(categoryPath)) continue;

    const dirs = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const dir of dirs) {
      const templatePath = path.join(categoryPath, dir, 'template.json');
      if (fs.existsSync(templatePath)) {
        try {
          const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
          examples.push({
            path: `${category}/${dir}`,
            dir: path.join(categoryPath, dir),
            category,
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
 * Easing functions for animations
 */
const easings = {
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeIn: (t) => t * t * t,
  easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  bounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

/**
 * Calculate animation properties at a specific frame
 */
function getAnimationState(animation, currentFrame, fps) {
  const { type, effect, delay = 0, duration = 30 } = animation;
  const startFrame = delay;
  const endFrame = delay + duration;

  // Before animation starts
  if (currentFrame < startFrame) {
    if (type === 'entrance') {
      return getInitialState(effect);
    }
    return {};
  }

  // After animation ends
  if (currentFrame >= endFrame) {
    if (type === 'entrance') {
      return {}; // Fully visible, no transforms
    }
    if (type === 'exit') {
      return getInitialState(effect);
    }
    return {};
  }

  // During animation
  const progress = (currentFrame - startFrame) / duration;
  const eased = easings.easeOut(progress);

  if (type === 'entrance') {
    return interpolateState(getInitialState(effect), {}, eased);
  }

  if (type === 'exit') {
    return interpolateState({}, getInitialState(effect), eased);
  }

  if (type === 'emphasis') {
    // Pulse effect
    const pulseProgress = Math.sin(progress * Math.PI * 2);
    if (effect === 'pulse') {
      return { scale: 1 + pulseProgress * 0.1 };
    }
  }

  return {};
}

/**
 * Get initial state for an animation effect
 */
function getInitialState(effect) {
  switch (effect) {
    case 'fadeIn':
    case 'fadeOut':
      return { opacity: 0 };
    case 'slideInUp':
    case 'slideOutDown':
      return { opacity: 0, translateY: 50 };
    case 'slideInDown':
    case 'slideOutUp':
      return { opacity: 0, translateY: -50 };
    case 'slideInLeft':
    case 'slideOutRight':
      return { opacity: 0, translateX: -100 };
    case 'slideInRight':
    case 'slideOutLeft':
      return { opacity: 0, translateX: 100 };
    case 'scaleIn':
    case 'scaleOut':
      return { opacity: 0, scale: 0.5 };
    case 'zoomIn':
      return { opacity: 0, scale: 0.3 };
    case 'bounceIn':
      return { opacity: 0, scale: 0.3 };
    default:
      return { opacity: 0 };
  }
}

/**
 * Interpolate between two states
 */
function interpolateState(from, to, progress) {
  const result = {};

  // Opacity
  const fromOpacity = from.opacity !== undefined ? from.opacity : 1;
  const toOpacity = to.opacity !== undefined ? to.opacity : 1;
  if (fromOpacity !== toOpacity) {
    result.opacity = fromOpacity + (toOpacity - fromOpacity) * progress;
  }

  // TranslateX
  const fromX = from.translateX || 0;
  const toX = to.translateX || 0;
  if (fromX !== toX) {
    result.translateX = fromX + (toX - fromX) * progress;
  }

  // TranslateY
  const fromY = from.translateY || 0;
  const toY = to.translateY || 0;
  if (fromY !== toY) {
    result.translateY = fromY + (toY - fromY) * progress;
  }

  // Scale
  const fromScale = from.scale !== undefined ? from.scale : 1;
  const toScale = to.scale !== undefined ? to.scale : 1;
  if (fromScale !== toScale) {
    result.scale = fromScale + (toScale - fromScale) * progress;
  }

  return result;
}

/**
 * Generate HTML preview for a template at a specific frame
 */
function generatePreviewHTML(template, currentFrame = 0) {
  const { width, height, fps = 30 } = template.output;

  // Get the current scene based on frame
  const scenes = template.composition.scenes || [];
  let currentScene = scenes[0];

  for (const scene of scenes) {
    if (currentFrame >= scene.startFrame && currentFrame < scene.endFrame) {
      currentScene = scene;
      break;
    }
  }

  const layers = currentScene?.layers || [];

  // Replace template variables with defaults
  const defaults = template.defaults || {};
  const processedLayers = replaceTemplateVariables(layers, defaults);

  const layerElements = processedLayers
    .map((layer) => {
      const { id, type, position, size, opacity, props, animations = [] } = layer;
      const x = position?.x || 0;
      const y = position?.y || 0;
      const w = size?.width || 100;
      const h = size?.height || 100;
      let op = opacity !== undefined ? opacity : 1;

      // Calculate animation state relative to scene start
      const sceneStartFrame = currentScene?.startFrame || 0;
      const relativeFrame = currentFrame - sceneStartFrame;

      let translateX = 0;
      let translateY = 0;
      let scale = 1;

      for (const animation of animations) {
        const state = getAnimationState(animation, relativeFrame, fps);
        if (state.opacity !== undefined) op *= state.opacity;
        if (state.translateX) translateX += state.translateX;
        if (state.translateY) translateY += state.translateY;
        if (state.scale !== undefined) scale *= state.scale;
      }

      let transform = '';
      if (translateX !== 0 || translateY !== 0 || scale !== 1) {
        transform = `transform: translate(${translateX}px, ${translateY}px) scale(${scale});`;
      }

      let style = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${w}px;
      height: ${h}px;
      opacity: ${op};
      ${transform}
    `;

      let content = '';

      if (type === 'shape' && props) {
        const { shape, fill, gradient, borderRadius } = props;

        if (gradient) {
          const colors = gradient.colors || [];
          const colorStops = colors.map((c) => {
            // Handle "transparent" color
            const color = c.color === 'transparent' ? 'rgba(0,0,0,0)' : c.color;
            return `${color} ${c.offset * 100}%`;
          }).join(', ');

          if (gradient.type === 'linear') {
            const angle = gradient.angle || 0;
            style += `background: linear-gradient(${angle}deg, ${colorStops});`;
          } else if (gradient.type === 'radial') {
            style += `background: radial-gradient(circle, ${colorStops});`;
          }
        } else if (fill) {
          style += `background: ${fill};`;
        }

        if (borderRadius) {
          style += `border-radius: ${borderRadius}px;`;
        }

        if (shape === 'ellipse') {
          style += `border-radius: 50%;`;
        }
      } else if (type === 'text' && props) {
        const { text, fontSize, fontWeight, color, textAlign, fontFamily, letterSpacing, lineHeight } = props;

        style += `
        font-size: ${fontSize || 16}px;
        font-weight: ${fontWeight || 'normal'};
        color: ${color || '#fff'};
        text-align: ${textAlign || 'left'};
        font-family: ${fontFamily || 'Inter, system-ui, sans-serif'};
        display: flex;
        align-items: center;
        justify-content: ${textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'};
      `;

        if (letterSpacing) {
          style += `letter-spacing: ${letterSpacing}px;`;
        }
        if (lineHeight) {
          style += `line-height: ${lineHeight};`;
        }

        content = `<span>${text || ''}</span>`;
      }

      return `<div id="${id}" style="${style}">${content}</div>`;
    })
    .join('\n');

  // Get background color from scene or use default
  const bgColor = currentScene?.backgroundColor || '#000';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .canvas {
      position: relative;
      width: ${width}px;
      height: ${height}px;
      background: ${bgColor};
    }
  </style>
</head>
<body>
  <div class="canvas">
    ${layerElements}
  </div>
</body>
</html>
`;
}

/**
 * Generate static PNG preview for image templates
 */
async function generatePNGPreview(browser, example) {
  const { template, dir } = example;
  const { width, height } = template.output;

  // Scale down large images
  const scale = Math.min(1, 800 / Math.max(width, height));
  const scaledWidth = Math.round(width * scale);
  const scaledHeight = Math.round(height * scale);

  const page = await browser.newPage();
  await page.setViewport({ width: scaledWidth, height: scaledHeight, deviceScaleFactor: 1 });

  const html = generatePreviewHTML(template, 9999); // High frame = all animations complete
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);

  const previewPath = path.join(dir, 'preview.png');
  await page.screenshot({ path: previewPath, type: 'png' });

  await page.close();
  return previewPath;
}

/**
 * Generate animated GIF preview for video templates using ImageMagick
 */
async function generateGIFPreview(browser, example) {
  const { template, dir, name } = example;
  const { width, height, fps = 30, duration = 5 } = template.output;

  // Scale down for GIF (max 480px width for reasonable file size)
  const scale = Math.min(1, 480 / width);
  const gifWidth = Math.round(width * scale);
  const gifHeight = Math.round(height * scale);

  const totalFrames = fps * duration;
  const frameStep = Math.max(1, Math.floor(totalFrames / GIF_FRAME_COUNT));

  // Create temp directory for frames
  const frameDir = path.join(TEMP_DIR, name);
  if (!fs.existsSync(frameDir)) {
    fs.mkdirSync(frameDir, { recursive: true });
  }

  const page = await browser.newPage();
  await page.setViewport({ width: gifWidth, height: gifHeight, deviceScaleFactor: 1 });

  // Generate frames
  const framePaths = [];
  for (let i = 0; i < GIF_FRAME_COUNT; i++) {
    const currentFrame = i * frameStep;
    const html = generatePreviewHTML(template, currentFrame);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Wait for fonts on first frame
    if (i === 0) {
      await page.evaluate(() => document.fonts.ready);
    }

    const framePath = path.join(frameDir, `frame-${String(i).padStart(3, '0')}.png`);
    await page.screenshot({ path: framePath, type: 'png' });
    framePaths.push(framePath);
  }

  await page.close();

  // Use ImageMagick to create GIF
  const previewPath = path.join(dir, 'preview.gif');
  try {
    execSync(
      `magick -delay ${GIF_DELAY} -loop 0 -dispose previous ${frameDir}/frame-*.png -resize ${gifWidth}x${gifHeight} "${previewPath}"`,
      { stdio: 'pipe' }
    );
  } catch (e) {
    // Try with convert command (older ImageMagick)
    execSync(
      `convert -delay ${GIF_DELAY} -loop 0 -dispose previous ${frameDir}/frame-*.png -resize ${gifWidth}x${gifHeight} "${previewPath}"`,
      { stdio: 'pipe' }
    );
  }

  // Clean up temp frames
  for (const framePath of framePaths) {
    fs.unlinkSync(framePath);
  }
  fs.rmdirSync(frameDir);

  return previewPath;
}

/**
 * Generate preview for an example
 */
async function generatePreview(browser, example) {
  const { template } = example;
  const isVideo = template.output.type === 'video';

  if (isVideo) {
    const previewPath = await generateGIFPreview(browser, example);
    console.log(`  ✅ ${example.path}/preview.gif (animated)`);
    return previewPath;
  } else {
    const previewPath = await generatePNGPreview(browser, example);
    console.log(`  ✅ ${example.path}/preview.png (static)`);
    return previewPath;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n📸 Generating Preview Images\n');
  console.log('='.repeat(50));

  const examples = collectExamples();
  console.log(`Found ${examples.length} examples\n`);

  // Create temp directory
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const generated = [];

  try {
    for (const example of examples) {
      try {
        const previewPath = await generatePreview(browser, example);
        generated.push(previewPath);
      } catch (e) {
        console.error(`  ❌ ${example.path}: ${e.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Generated ${generated.length}/${examples.length} previews\n`);

  return generated;
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
