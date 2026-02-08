#!/usr/bin/env node

/**
 * Docker worker script
 * Renders frames for a chunk and encodes to video
 *
 * Uses the browser-renderer bundle for actual template rendering
 * (same approach as frame-capturer.ts in renderer-node).
 */

const { chromium } = require('playwright-core');
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');
const { spawn } = require('child_process');

const DATA_PATH = '/data';
const BUNDLE_PATH = '/app/browser-renderer.global.js';

async function main() {
  const jobId = process.env.JOB_ID;
  const chunkId = parseInt(process.env.CHUNK_ID || '0');
  const startFrame = parseInt(process.env.START_FRAME || '0');
  const endFrame = parseInt(process.env.END_FRAME || '0');

  console.log(`[Worker] Starting chunk ${chunkId} (frames ${startFrame}-${endFrame})`);

  // Load template
  const templatePath = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'template.json');
  const template = JSON.parse(readFileSync(templatePath, 'utf-8'));

  // Load manifest to get codec/format settings
  const manifestPath = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'manifest.json');
  let manifest = {};
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  } catch (e) {
    console.log('[Worker] No manifest found, using defaults');
  }

  // Determine codec and format from manifest or template
  const codec = manifest.codec || template.output.codec || 'libx264';
  const isProRes = codec === 'prores' || codec === 'prores_ks';
  const isTransparent = template.output.background === 'transparent' || isProRes;
  const fileExt = isProRes ? 'mov' : 'mp4';

  console.log(`[Worker] Codec: ${codec}, ProRes: ${isProRes}, Transparent: ${isTransparent}, Format: ${fileExt}`);

  // Create temp directory for frames
  const tempDir = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'temp', `chunk-${chunkId}`);
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  // Load browser renderer bundle
  let rendererCode = null;
  try {
    rendererCode = readFileSync(BUNDLE_PATH, 'utf-8');
    console.log('[Worker] Browser renderer bundle loaded');
  } catch (e) {
    console.warn('[Worker] Browser renderer bundle not found at', BUNDLE_PATH, '- using fallback');
  }

  // Launch browser
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();

  // Set viewport
  await page.setViewportSize({
    width: template.output.width,
    height: template.output.height,
  });

  // Build the render HTML (matching frame-capturer.ts approach)
  const templateJson = JSON.stringify(template);
  const inputsJson = JSON.stringify(manifest.inputs || {});
  const bgStyle = isTransparent ? 'background: transparent;' : 'background: #000;';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob: file:; img-src * data: blob: file: 'unsafe-inline'; media-src * data: blob: file:;">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            width: ${template.output.width}px;
            height: ${template.output.height}px;
            overflow: hidden;
            ${bgStyle}
          }
          #root {
            width: ${template.output.width}px;
            height: ${template.output.height}px;
            position: relative;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.RENDERVID_TEMPLATE = ${templateJson};
          window.RENDERVID_INPUTS = ${inputsJson};
          window.RENDERVID_CURRENT_FRAME = 0;
          window.RENDERVID_REGISTRY_COMPONENTS = [];
          window.RENDERVID_CUSTOM_COMPONENTS = {};

          window.renderFrame = function(frame) {
            window.RENDERVID_CURRENT_FRAME = frame;
            if (window.__rendervidRenderFrame) {
              window.__rendervidRenderFrame(frame);
            }
          };

          window.RENDERVID_READY = true;
        </script>
      </body>
    </html>
  `;

  await page.setContent(html);

  // Wait for page to be ready
  await page.waitForFunction(() => window.RENDERVID_READY === true, { timeout: 10000 });

  // Inject the browser renderer bundle if available
  if (rendererCode) {
    await page.addScriptTag({ content: rendererCode });
    console.log('[Worker] Browser renderer injected');

    // Wait for renderer to initialize
    await page.waitForFunction(
      () => typeof window.__rendervidRenderFrame === 'function',
      { timeout: 15000 }
    );
    console.log('[Worker] Renderer initialized');
  }

  // Preload media assets (images, etc.)
  await preloadMedia(page, template);

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  console.log('[Worker] Fonts loaded');

  // Render frames
  for (let frame = startFrame; frame <= endFrame; frame++) {
    // Call render function and wait for frame to be ready
    await page.evaluate((f) => {
      window.renderFrame(f);
    }, frame);

    // Wait for next animation frame to ensure rendering is complete
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      omitBackground: isTransparent,
    });

    const framePath = join(tempDir, `frame-${String(frame).padStart(6, '0')}.png`);
    writeFileSync(framePath, screenshot);

    if ((frame - startFrame + 1) % 10 === 0) {
      console.log(`[Worker] Rendered ${frame - startFrame + 1}/${endFrame - startFrame + 1} frames`);
    }
  }

  await browser.close();

  console.log(`[Worker] Rendering complete, encoding chunk...`);

  // Encode chunk with FFmpeg
  const fps = template.output.fps || 30;
  const chunkPath = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'chunks', `chunk-${chunkId}.${fileExt}`);
  const chunksDir = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'chunks');

  if (!existsSync(chunksDir)) {
    mkdirSync(chunksDir, { recursive: true });
  }

  // Build FFmpeg args based on codec
  const ffmpegArgs = [
    '-framerate', String(fps),
    '-start_number', String(startFrame),
    '-i', join(tempDir, 'frame-%06d.png'),
  ];

  if (isProRes) {
    ffmpegArgs.push(
      '-c:v', 'prores_ks',
      '-profile:v', '4444',
      '-pix_fmt', 'yuva444p10le',
      '-vendor', 'apl0'
    );
  } else {
    ffmpegArgs.push(
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-pix_fmt', 'yuv420p'
    );
  }

  ffmpegArgs.push('-y', chunkPath);

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    ffmpeg.stderr.on('data', (data) => {
      const line = data.toString();
      if (line.includes('frame=')) {
        process.stdout.write('.');
      }
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`\n[Worker] Chunk ${chunkId} encoded successfully`);
        resolve();
      } else {
        reject(new Error(`FFmpeg failed with code ${code}`));
      }
    });
  });

  // Write progress
  const progressPath = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'progress', `worker-${chunkId}.json`);
  const progressDir = join(DATA_PATH, 'rendervid', 'jobs', jobId, 'progress');

  if (!existsSync(progressDir)) {
    mkdirSync(progressDir, { recursive: true });
  }

  writeFileSync(
    progressPath,
    JSON.stringify({
      chunkId,
      status: 'completed',
      framesRendered: endFrame - startFrame + 1,
      totalFrames: endFrame - startFrame + 1,
      timestamp: new Date().toISOString(),
    })
  );

  console.log(`[Worker] Chunk ${chunkId} complete`);
}

/**
 * Preload media assets referenced in the template
 */
async function preloadMedia(page, template) {
  const mediaUrls = [];

  const scenes = template.composition?.scenes || template.scenes || [];
  if (scenes.length > 0) {
    for (const scene of scenes) {
      if (scene.layers) {
        for (const layer of scene.layers) {
          if (layer.type === 'image' || layer.type === 'video' || layer.type === 'audio') {
            const src = layer.props && layer.props.src;
            if (src && !String(src).startsWith('data:')) {
              mediaUrls.push({ url: String(src), type: layer.type });
            }
          }
        }
      }
    }
  }

  if (mediaUrls.length === 0) return;

  console.log(`[Worker] Preloading ${mediaUrls.length} media assets...`);

  await page.evaluate((media) => {
    return Promise.all(
      media.map(({ url, type }) => {
        return new Promise((resolve) => {
          if (type === 'image') {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve();
            img.onerror = () => {
              console.error('[Preload] Failed to load image:', url);
              resolve();
            };
            img.src = url;
          } else {
            resolve();
          }
        });
      })
    );
  }, mediaUrls);

  console.log('[Worker] Media preloaded');
}

main().catch((error) => {
  console.error('[Worker] Error:', error);
  process.exit(1);
});
