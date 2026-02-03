#!/usr/bin/env node
const { createNodeRenderer } = require('./packages/renderer-node/dist/index.js');
const path = require('path');
const os = require('os');

const testTemplate = {
  name: "Debug Test",
  output: {
    type: "video",
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 1
  },
  inputs: [],
  defaults: {},
  composition: {
    scenes: [
      {
        id: "test",
        startFrame: 0,
        endFrame: 30,
        layers: [
          {
            id: "bg",
            type: "shape",
            position: { x: 0, y: 0 },
            size: { width: 1920, height: 1080 },
            props: { shape: "rectangle", fill: "#ff0000" } // Red background to confirm it's rendering
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
          }
        ]
      }
    ]
  }
};

async function debug() {
  console.log('=== DEBUGGING IMAGE RENDERING ===\n');

  const outputPath = path.join(os.homedir(), 'Downloads', 'debug-test.mp4');

  try {
    const renderer = createNodeRenderer();

    // We'll capture just one frame as an image to debug
    const result = await renderer.renderImage({
      template: testTemplate,
      inputs: {},
      outputPath: path.join(os.homedir(), 'Downloads', 'debug-frame.png'),
      frame: 15,
      renderWaitTime: 1000, // Give it extra time
    });

    if (result.success) {
      console.log(`✓ Frame captured: ~/Downloads/debug-frame.png`);
      console.log(`  ${(result.fileSize / 1024).toFixed(2)} KB`);
      console.log('\nCheck the frame:');
      console.log('  - Should have RED background (confirms rendering works)');
      console.log('  - Should have retro living room image in center');
      console.log('\nIf red background but NO image:');
      console.log('  → Image layer is being rendered but <img> tag is not loading the image');
    } else {
      console.log(`✗ Failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
    console.error(error.stack);
  }
}

debug();
