#!/usr/bin/env node

/**
 * Video Generator for Rendervid Examples
 *
 * Generates MP4 videos from templates using Puppeteer and FFmpeg.
 * Renders all frames at native resolution and fps for smooth animations.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
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
];
const TEMP_DIR = path.join(__dirname, '..', '.temp-video-frames');
const AUDIO_FILE = path.join(__dirname, '..', 'examples', 'showcase', 'background-music.mp3');

// Video output settings
const OUTPUT_SCALE = 0.5; // Scale down for smaller file size (0.5 = half resolution)
const MAX_WIDTH = 1280;
const MAX_HEIGHT = 720;

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
 * Collect all example templates
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
          if (template.output.type === 'video') {
            examples.push({
              path: `${category}/${dir}`,
              dir: path.join(categoryPath, dir),
              name: dir,
              template,
            });
          }
        } catch (e) {
          console.error(`Error parsing ${templatePath}: ${e.message}`);
        }
      }
    }
  }

  return examples;
}

/**
 * Easing functions
 */
const easingFunctions = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeOutBack: t => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  easeOutElastic: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
  easeOutBounce: t => {
    const n1 = 7.5625; const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  easeOutCirc: t => Math.sqrt(1 - Math.pow(t - 1, 2)),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
};

/**
 * Calculate animation properties at a given frame
 */
function getAnimationState(animations, frame, layerProps) {
  let opacity = 1;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;
  let rotate = 0;

  for (const anim of animations || []) {
    const { type, effect, delay = 0, duration = 30, easing = 'easeOutCubic' } = anim;
    const start = delay;
    const end = delay + duration;
    const easingFn = easingFunctions[easing] || easingFunctions.easeOutCubic;

    if (type === 'entrance') {
      if (frame < start) {
        opacity = 0;
        if (effect === 'scaleIn' || effect === 'zoomIn') scale = 0;
        if (effect === 'slideInUp') translateY = 100;
        if (effect === 'slideInDown') translateY = -100;
        if (effect === 'slideInLeft') translateX = -100;
        if (effect === 'slideInRight') translateX = 100;
        if (effect === 'bounceIn') scale = 0;
        if (effect === 'rotateIn') { rotate = -180; scale = 0; }
      } else if (frame < end) {
        const rawProgress = (frame - start) / duration;
        const progress = easingFn(rawProgress);

        if (effect === 'fadeIn') {
          opacity = progress;
        } else if (effect === 'scaleIn' || effect === 'zoomIn') {
          opacity = progress;
          scale = progress;
        } else if (effect === 'slideInUp') {
          opacity = progress;
          translateY = 100 * (1 - progress);
        } else if (effect === 'slideInDown') {
          opacity = progress;
          translateY = -100 * (1 - progress);
        } else if (effect === 'slideInLeft') {
          opacity = progress;
          translateX = -100 * (1 - progress);
        } else if (effect === 'slideInRight') {
          opacity = progress;
          translateX = 100 * (1 - progress);
        } else if (effect === 'bounceIn') {
          opacity = progress;
          scale = easingFunctions.easeOutBounce(rawProgress);
        } else if (effect === 'rotateIn') {
          opacity = progress;
          rotate = -180 * (1 - progress);
          scale = progress;
        } else {
          opacity = progress;
        }
      }
    } else if (type === 'exit') {
      if (frame >= start && frame < end) {
        const rawProgress = (frame - start) / duration;
        const progress = easingFn(rawProgress);

        if (effect === 'fadeOut') {
          opacity = 1 - progress;
        } else if (effect === 'scaleOut' || effect === 'zoomOut') {
          opacity = 1 - progress;
          scale = 1 - progress;
        } else {
          opacity = 1 - progress;
        }
      } else if (frame >= end) {
        opacity = 0;
      }
    } else if (type === 'emphasis') {
      if (frame >= start && frame < end) {
        const rawProgress = (frame - start) / duration;

        if (effect === 'pulse') {
          scale = 1 + 0.1 * Math.sin(rawProgress * Math.PI * 2);
        } else if (effect === 'shake') {
          translateX = 5 * Math.sin(rawProgress * Math.PI * 8);
        }
      }
    }
  }

  return { opacity, translateX, translateY, scale, rotate };
}

/**
 * Check if template uses custom components
 */
function hasCustomComponents(template) {
  const scenes = template.composition?.scenes || [];
  for (const scene of scenes) {
    const layers = scene.layers || [];
    for (const layer of layers) {
      if (layer.type === 'custom') {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if template uses scene transitions
 */
function hasSceneTransitions(template) {
  const scenes = template.composition?.scenes || [];
  for (const scene of scenes) {
    if (scene.transition && scene.transition.duration > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Generate HTML using the browser renderer (for templates with custom components)
 */
function generateHTMLWithRenderer(template, frame, viewportWidth, viewportHeight) {
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
 * Generate HTML for a single frame (for templates without custom components)
 */
function generateHTML(template, frame, viewportWidth, viewportHeight, exampleDir) {
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

  // Build font imports
  const fontFamilies = new Set(['Inter']);
  for (const layer of layers) {
    if (layer.type === 'text' && layer.props?.fontFamily) {
      fontFamilies.add(layer.props.fontFamily);
    }
  }
  const fontImports = Array.from(fontFamilies)
    .map(f => `family=${f.replace(/\s+/g, '+')}:wght@400;500;600;700;800`)
    .join('&');

  const elements = layers.map(layer => {
    const { id, type, position, size, props, opacity: baseOpacity = 1, animations, filter, filters } = layer;
    const x = position?.x || 0;
    const y = position?.y || 0;
    const w = size?.width || 100;
    const h = size?.height || 100;

    const animState = getAnimationState(animations, sceneFrame, props);
    const finalOpacity = baseOpacity * animState.opacity;

    let transform = '';
    if (animState.translateX !== 0 || animState.translateY !== 0) {
      transform += `translate(${animState.translateX}px, ${animState.translateY}px) `;
    }
    if (animState.scale !== 1) {
      transform += `scale(${animState.scale}) `;
    }
    if (animState.rotate !== 0) {
      transform += `rotate(${animState.rotate}deg) `;
    }

    let css = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;opacity:${finalOpacity};`;
    if (transform) {
      css += `transform:${transform};transform-origin:center center;`;
    }

    // Handle both filter (string) and filters (array) formats
    if (filter) {
      css += `filter:${filter};`;
    } else if (filters && filters.length > 0) {
      const filterString = filters.map(f => {
        const { type, value } = f;
        // Convert filter type and value to CSS filter function
        if (type === 'blur') return `blur(${value}px)`;
        if (type === 'brightness') return `brightness(${value}%)`;
        if (type === 'contrast') return `contrast(${value}%)`;
        if (type === 'grayscale') return `grayscale(${value}%)`;
        if (type === 'sepia') return `sepia(${value}%)`;
        if (type === 'hue-rotate') return `hue-rotate(${value}deg)`;
        if (type === 'invert') return `invert(${value}%)`;
        if (type === 'saturate') return `saturate(${value}%)`;
        if (type === 'drop-shadow') return `drop-shadow(${value})`;
        return '';
      }).filter(Boolean).join(' ');
      if (filterString) css += `filter:${filterString};`;
    }

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
      const { text, fontSize, fontWeight, color, textAlign, fontFamily, lineHeight } = props;
      css += `font-size:${fontSize || 16}px;`;
      css += `font-weight:${fontWeight || 'normal'};`;
      css += `color:${color || '#fff'};`;
      css += `font-family:'${fontFamily || 'Inter'}',sans-serif;`;
      if (lineHeight) css += `line-height:${lineHeight};`;
      css += `display:flex;align-items:center;`;
      css += `justify-content:${textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'};`;
      css += `text-align:${textAlign || 'left'};`;
      inner = `<span>${text || ''}</span>`;
    } else if (type === 'image' && props) {
      const { src, fit = 'cover', borderRadius } = props;
      css += `overflow:hidden;`;
      if (borderRadius) css += `border-radius:${borderRadius}px;`;
      // Convert relative paths to data URLs for local files
      let imgSrc = src;
      if (src && !src.startsWith('http') && !src.startsWith('data:')) {
        const imgPath = path.resolve(exampleDir, src);
        if (fs.existsSync(imgPath)) {
          const imgBuffer = fs.readFileSync(imgPath);
          const ext = path.extname(imgPath).toLowerCase();
          const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                          ext === '.png' ? 'image/png' :
                          ext === '.gif' ? 'image/gif' :
                          ext === '.webp' ? 'image/webp' : 'image/jpeg';
          imgSrc = `data:${mimeType};base64,${imgBuffer.toString('base64')}`;
        }
      }
      inner = `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:${fit};" />`;
    } else if (type === 'video' && props) {
      const { src, fit = 'cover', borderRadius } = props;
      css += `overflow:hidden;`;
      if (borderRadius) css += `border-radius:${borderRadius}px;`;
      // For videos, use file:// URLs (they work better than data URLs for video)
      let videoSrc = src;
      if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('file://')) {
        videoSrc = 'file://' + path.resolve(exampleDir, src);
      }
      inner = `<video src="${videoSrc}" style="width:100%;height:100%;object-fit:${fit};" autoplay muted loop></video>`;
    }

    return `<div id="${id}" style="${css}">${inner}</div>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; img-src * data: blob: 'unsafe-inline';">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?${fontImports}&display=swap" rel="stylesheet">
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
 * Calculate output dimensions
 */
function getOutputSize(width, height) {
  let w = Math.round(width * OUTPUT_SCALE);
  let h = Math.round(height * OUTPUT_SCALE);

  if (w > MAX_WIDTH) {
    h = Math.round(h * MAX_WIDTH / w);
    w = MAX_WIDTH;
  }
  if (h > MAX_HEIGHT) {
    w = Math.round(w * MAX_HEIGHT / h);
    h = MAX_HEIGHT;
  }

  // Ensure even dimensions for video encoding
  w = w % 2 === 0 ? w : w + 1;
  h = h % 2 === 0 ? h : h + 1;

  return { width: w, height: h };
}

/**
 * Generate MP4 video for an example
 */
async function generateVideo(browser, example) {
  const { template, dir, name } = example;
  const { width, height, fps = 30, duration = 5 } = template.output;
  const out = getOutputSize(width, height);
  const totalFrames = fps * duration;

  const frameDir = path.join(TEMP_DIR, name);
  fs.mkdirSync(frameDir, { recursive: true });

  const page = await browser.newPage();

  // Log browser console for debugging
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warn') {
      console.log(`     [Browser ${type}]`, msg.text());
    }
  });

  await page.setViewport({ width: out.width, height: out.height });

  console.log(`     Rendering ${totalFrames} frames...`);

  const timings = { setContent: 0, screenshot: 0 };
  const startRender = Date.now();

  // Check if template uses custom components or scene transitions
  const usesCustomComponents = hasCustomComponents(template);
  const usesSceneTransitions = hasSceneTransitions(template);
  const usesBrowserRenderer = usesCustomComponents || usesSceneTransitions;

  if (usesBrowserRenderer) {
    console.log(`     Using browser renderer (customComponents: ${usesCustomComponents}, transitions: ${usesSceneTransitions})`);
  } else {
    console.log(`     Using direct HTML generation`);
  }

  // Render all frames
  // Track current scene to detect scene changes
  let currentSceneId = null;

  for (let frame = 0; frame < totalFrames; frame++) {
    const html = usesBrowserRenderer
      ? generateHTMLWithRenderer(template, frame, out.width, out.height)
      : generateHTML(template, frame, out.width, out.height, dir);

    // Detect scene change (need to wait for images to load)
    const currentScene = template.composition.scenes.find(
      s => frame >= (s.startFrame || 0) && frame < (s.endFrame || totalFrames)
    );
    const sceneChanged = currentScene && currentScene.id !== currentSceneId;
    if (currentScene) currentSceneId = currentScene.id;

    // Wait for network on first frame and scene changes (images need to load)
    const t1 = Date.now();
    if (frame === 0 || sceneChanged) {
      await page.setContent(html, { waitUntil: 'networkidle0' });
      if (usesBrowserRenderer) {
        // Wait for the renderer to be ready
        await page.waitForFunction(() => window.RENDERVID_READY === true, { timeout: 5000 });
        await new Promise(r => setTimeout(r, 500)); // Extra wait for first render
      } else {
        await new Promise(r => setTimeout(r, 1000)); // Extra wait for fonts/images
      }
    } else {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      if (usesBrowserRenderer) {
        // Wait for the renderer to be ready and render the frame
        await page.waitForFunction(() => window.RENDERVID_READY === true, { timeout: 5000 });
        await new Promise(r => setTimeout(r, 50)); // Small wait for React to render
      }
    }
    timings.setContent += Date.now() - t1;

    const framePath = path.join(frameDir, `frame-${String(frame).padStart(5, '0')}.jpg`);
    const t2 = Date.now();
    await page.screenshot({ path: framePath, type: 'jpeg', quality: 90 });
    timings.screenshot += Date.now() - t2;

    // Progress indicator
    if ((frame + 1) % Math.ceil(totalFrames / 10) === 0) {
      process.stdout.write(`     ${Math.round((frame + 1) / totalFrames * 100)}%\n`);
    }
  }

  const renderTime = Date.now() - startRender;
  console.log(`     Render time: ${(renderTime / 1000).toFixed(1)}s (setContent: ${(timings.setContent / 1000).toFixed(1)}s, screenshot: ${(timings.screenshot / 1000).toFixed(1)}s)`);

  await page.close();

  // Encode video with FFmpeg
  const videoPath = path.join(dir, 'output.mp4');
  const tempVideoPath = path.join(frameDir, 'temp-video.mp4');
  console.log(`     Encoding MP4...`);

  // First encode video without audio
  const encodeStart = Date.now();
  execSync(
    `ffmpeg -y -framerate ${fps} -i "${frameDir}/frame-%05d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 23 -preset ultrafast "${tempVideoPath}"`,
    { stdio: 'pipe' }
  );
  const encodeTime = Date.now() - encodeStart;
  console.log(`     Encode time: ${(encodeTime / 1000).toFixed(1)}s`);

  // Add background music (loop if needed, fade out at end)
  const videoDuration = duration;
  if (fs.existsSync(AUDIO_FILE)) {
    console.log(`     Adding audio...`);
    const audioStart = Date.now();
    try {
      execSync(
        `ffmpeg -y -i "${tempVideoPath}" -stream_loop -1 -i "${AUDIO_FILE}" -c:v copy -c:a aac -b:a 128k -t ${videoDuration} -af "afade=t=out:st=${videoDuration - 0.5}:d=0.5" -shortest "${videoPath}"`,
        { stdio: 'pipe' }
      );
      const audioTime = Date.now() - audioStart;
      console.log(`     Audio time: ${(audioTime / 1000).toFixed(1)}s`);
    } catch (e) {
      // If audio fails, just copy the video without audio
      fs.copyFileSync(tempVideoPath, videoPath);
    }
  } else {
    fs.copyFileSync(tempVideoPath, videoPath);
  }

  // Cleanup frames
  const frames = fs.readdirSync(frameDir);
  frames.forEach(f => fs.unlinkSync(path.join(frameDir, f)));
  fs.rmdirSync(frameDir);

  return videoPath;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const forceRegenerate = args.includes('--force');
  const parallelArg = args.find(arg => arg.startsWith('--parallel'));
  const parallelCount = parallelArg ? parseInt(parallelArg.split('=')[1] || '5') : 1;
  const specificExample = args.find(arg => !arg.startsWith('--') && !arg.includes('parallel'));

  console.log('\n🎬 Generating Videos\n' + '='.repeat(50));

  let examples = collectExamples();

  if (specificExample) {
    examples = examples.filter(e =>
      e.path === specificExample ||
      e.name === specificExample ||
      e.path.includes(specificExample)
    );
    if (examples.length === 0) {
      console.error(`\n❌ No video examples found matching: ${specificExample}`);
      process.exit(1);
    }
  }

  console.log(`Found ${examples.length} video examples`);

  // If --force flag is used, delete existing video files
  if (forceRegenerate) {
    console.log('🗑️  Force mode: Deleting existing output.mp4 files...\n');
    for (const example of examples) {
      const videoPath = path.join(example.dir, 'output.mp4');
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }
  } else {
    // Skip examples that already have video files
    const examplesWithoutVideos = examples.filter(example => {
      const videoPath = path.join(example.dir, 'output.mp4');
      return !fs.existsSync(videoPath);
    });

    const skipped = examples.length - examplesWithoutVideos.length;
    if (skipped > 0) {
      console.log(`⏭️  Skipping ${skipped} examples with existing videos`);
      console.log('   (use --force to regenerate all)\n');
    } else {
      console.log('');
    }

    examples = examplesWithoutVideos;
  }

  if (examples.length === 0) {
    console.log('✅ All videos already exist. Nothing to generate.\n');
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
          '--disable-features=IsolateOrigins,site-per-process', // Required for --disable-web-security to work
        ],
      })
    )
  );

  let success = 0;
  let current = 0;

  // Process examples in parallel batches
  const processExample = async (example, browserIndex) => {
    console.log(`  📹 ${example.path}`);
    try {
      const videoPath = await generateVideo(browsers[browserIndex], example);
      console.log(`     ✅ Created ${path.basename(videoPath)}`);
      return true;
    } catch (e) {
      console.error(`     ❌ Error: ${e.message}`);
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

  console.log('\n' + '='.repeat(50));
  console.log(`Generated ${success}/${examples.length} videos\n`);
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
