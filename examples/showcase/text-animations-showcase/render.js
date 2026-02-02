#!/usr/bin/env node

const path = require('path');
const { NodeRenderer } = require('../../../packages/renderer-node/dist/index.js');

async function main() {
  const templatePath = path.join(__dirname, 'template.json');
  const outputPath = path.join(__dirname, 'output.mp4');

  console.log('🎬 Rendering Text Animations Showcase...');
  console.log('📁 Template:', templatePath);
  console.log('📹 Output:', outputPath);

  const renderer = new NodeRenderer();

  try {
    await renderer.render({
      templatePath,
      outputPath,
      inputs: {},
      options: {
        quality: 'high',
        verbose: true,
      },
    });

    console.log('✅ Video rendered successfully!');
    console.log('📹 Output:', outputPath);
  } catch (error) {
    console.error('❌ Rendering failed:', error);
    process.exit(1);
  }
}

main();
