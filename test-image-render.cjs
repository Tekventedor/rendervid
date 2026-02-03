#!/usr/bin/env node
const { createNodeRenderer } = require('./packages/renderer-node/dist/index.js');
const path = require('path');
const os = require('os');

const testTemplate = {
  name: "Image Fix Test",
  output: {
    type: "video",
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 2
  },
  inputs: [],
  defaults: {},
  composition: {
    scenes: [
      {
        id: "test",
        startFrame: 0,
        endFrame: 60,
        layers: [
          {
            id: "bg",
            type: "shape",
            position: { x: 0, y: 0 },
            size: { width: 1920, height: 1080 },
            props: { shape: "rectangle", fill: "#000000" }
          },
          {
            id: "test-image",
            type: "image",
            position: { x: 460, y: 290 },
            size: { width: 1000, height: 500 },
            props: {
              src: "https://www.photomaticai.com/images/processed/ai-generated-images/models_flux-dev_ai-image-generator_soft-retro_1970s_Soft_Retro_Living_Room.webp",
              fit: "cover"
            }
          },
          {
            id: "label",
            type: "text",
            position: { x: 100, y: 100 },
            size: { width: 1720, height: 100 },
            props: {
              text: "IMAGE TEST - Check if image is visible",
              fontSize: 48,
              fontWeight: "bold",
              color: "#00ff00",
              textAlign: "center"
            }
          }
        ]
      }
    ]
  }
};

async function test() {
  console.log('Testing image rendering with renderWaitTime: 300ms\n');
  const outputPath = path.join(os.homedir(), 'Downloads', 'image-fix-test.mp4');

  try {
    const renderer = createNodeRenderer();
    const result = await renderer.renderVideo({
      template: testTemplate,
      inputs: {},
      outputPath,
      codec: 'libx264',
      quality: 23,
      renderWaitTime: 300,
      onProgress: (p) => {
        if (p.phase === 'preparing') console.log('Preparing...');
        if (p.phase === 'rendering' && p.currentFrame % 15 === 0) {
          console.log(`Frame ${p.currentFrame}/${p.totalFrames}`);
        }
      }
    });

    if (result.success) {
      console.log(`\n✓ Success: ${outputPath}`);
      console.log(`  ${(result.fileSize / 1024).toFixed(2)} KB, ${(result.renderTime / 1000).toFixed(1)}s`);
    } else {
      console.log(`✗ Failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
  }
}

test();
