#!/usr/bin/env node

/**
 * Preview Generator
 *
 * Generates preview images (PNG) for all example templates.
 * Uses Puppeteer to render HTML representations of templates.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const EXAMPLES_DIR = path.join(__dirname, '..', 'examples');
const CATEGORIES = ['getting-started', 'social-media', 'marketing', 'data-visualization'];

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
 * Generate HTML preview for a template
 */
function generatePreviewHTML(template) {
  const { width, height } = template.output;
  const scene = template.composition.scenes[0];
  const layers = scene?.layers || [];

  // Sort layers by their order (assuming they're in correct z-order)
  const layerElements = layers
    .map((layer) => {
      const { id, type, position, size, opacity, props } = layer;
      const x = position?.x || 0;
      const y = position?.y || 0;
      const w = size?.width || 100;
      const h = size?.height || 100;
      const op = opacity !== undefined ? opacity : 1;

      let style = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${w}px;
      height: ${h}px;
      opacity: ${op};
    `;

      let content = '';

      if (type === 'shape' && props) {
        const { shape, fill, gradient, borderRadius } = props;

        if (gradient) {
          const colors = gradient.colors || [];
          const colorStops = colors
            .map((c) => `${c.color} ${c.offset * 100}%`)
            .join(', ');

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
        const {
          text,
          fontSize,
          fontWeight,
          color,
          textAlign,
          fontFamily,
          letterSpacing,
          lineHeight,
        } = props;

        style += `
        font-size: ${fontSize || 16}px;
        font-weight: ${fontWeight || 'normal'};
        color: ${color || '#000'};
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

        // Replace template variables with default values
        let displayText = text || '';
        if (template.defaults) {
          for (const [key, value] of Object.entries(template.defaults)) {
            displayText = displayText.replace(`{{${key}}}`, String(value));
          }
        }
        // Remove any remaining template variables
        displayText = displayText.replace(/\{\{[^}]+\}\}/g, '');

        content = `<span>${displayText}</span>`;
      }

      return `<div id="${id}" style="${style}">${content}</div>`;
    })
    .join('\n');

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
      background: #000;
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
 * Generate preview image for an example
 */
async function generatePreview(browser, example) {
  const { template, dir, name } = example;
  const { width, height } = template.output;

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });

  const html = generatePreviewHTML(template);
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  const previewPath = path.join(dir, 'preview.png');
  await page.screenshot({ path: previewPath, type: 'png' });

  await page.close();

  console.log(`  ✅ ${example.path}/preview.png`);
  return previewPath;
}

/**
 * Main function
 */
async function main() {
  console.log('\n📸 Generating Preview Images\n');
  console.log('='.repeat(50));

  const examples = collectExamples();
  console.log(`Found ${examples.length} examples\n`);

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

  console.log('\n' + '='.repeat(50));
  console.log(`Generated ${generated.length}/${examples.length} previews\n`);

  return generated;
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
