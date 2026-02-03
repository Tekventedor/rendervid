/**
 * GPU Rendering Demo
 *
 * This example demonstrates the GPU rendering capabilities in Rendervid Phase 2.
 * It shows how to:
 * 1. Use GPU rendering by default
 * 2. Explicitly enable/disable GPU
 * 3. Handle GPU fallback scenarios
 * 4. Monitor GPU status through logs
 */

import { createFrameCapturer } from '@rendervid/renderer-node';

// Example template for demonstration
const exampleTemplate = {
  name: 'GPU Rendering Demo',
  output: {
    type: 'video',
    width: 1920,
    height: 1080,
    fps: 30,
  },
  inputs: [],
  composition: {
    scenes: [
      {
        id: 'scene-1',
        startFrame: 0,
        endFrame: 90,
        layers: [
          {
            id: 'background',
            type: 'rectangle',
            position: { x: 0, y: 0 },
            size: { width: 1920, height: 1080 },
            props: {
              fill: '#2c3e50',
            },
          },
          {
            id: 'title',
            type: 'text',
            position: { x: 960, y: 400 },
            size: { width: 1200, height: 100 },
            props: {
              text: 'GPU Rendering Demo',
              fontSize: 72,
              fontFamily: 'Arial, sans-serif',
              color: '#ecf0f1',
              textAlign: 'center',
            },
          },
          {
            id: 'subtitle',
            type: 'text',
            position: { x: 960, y: 520 },
            size: { width: 1200, height: 60 },
            props: {
              text: 'Hardware-Accelerated Video Rendering',
              fontSize: 36,
              fontFamily: 'Arial, sans-serif',
              color: '#95a5a6',
              textAlign: 'center',
            },
          },
        ],
      },
    ],
  },
};

/**
 * Example 1: Default behavior (GPU enabled)
 */
async function example1_DefaultGPU() {
  console.log('\n=== Example 1: Default Behavior (GPU Enabled) ===');

  const capturer = createFrameCapturer({
    template: exampleTemplate,
  });

  try {
    await capturer.initialize();
    console.log('✓ Capturer initialized successfully');

    // Capture a frame
    const frameBuffer = await capturer.captureFrame(0);
    console.log(`✓ Captured frame: ${frameBuffer.length} bytes`);

    await capturer.close();
    console.log('✓ Capturer closed');
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

/**
 * Example 2: Explicitly disable GPU
 */
async function example2_DisableGPU() {
  console.log('\n=== Example 2: Explicitly Disable GPU ===');

  const capturer = createFrameCapturer({
    template: exampleTemplate,
    useGPU: false,
  });

  try {
    await capturer.initialize();
    console.log('✓ Capturer initialized with software rendering');

    const frameBuffer = await capturer.captureFrame(0);
    console.log(`✓ Captured frame: ${frameBuffer.length} bytes`);

    await capturer.close();
    console.log('✓ Capturer closed');
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

/**
 * Example 3: Explicitly enable GPU
 */
async function example3_EnableGPU() {
  console.log('\n=== Example 3: Explicitly Enable GPU ===');

  const capturer = createFrameCapturer({
    template: exampleTemplate,
    useGPU: true,
  });

  try {
    await capturer.initialize();
    console.log('✓ Capturer initialized with GPU rendering');

    const frameBuffer = await capturer.captureFrame(0);
    console.log(`✓ Captured frame: ${frameBuffer.length} bytes`);

    await capturer.close();
    console.log('✓ Capturer closed');
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

/**
 * Example 4: GPU with environment variable control
 */
async function example4_EnvironmentControl() {
  console.log('\n=== Example 4: Environment Variable Control ===');

  // GPU can be controlled via environment variable
  const useGPU = process.env.DISABLE_GPU !== 'true';
  console.log(`GPU setting from environment: ${useGPU ? 'enabled' : 'disabled'}`);

  const capturer = createFrameCapturer({
    template: exampleTemplate,
    useGPU,
  });

  try {
    await capturer.initialize();
    console.log('✓ Capturer initialized');

    const frameBuffer = await capturer.captureFrame(0);
    console.log(`✓ Captured frame: ${frameBuffer.length} bytes`);

    await capturer.close();
    console.log('✓ Capturer closed');
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

/**
 * Example 5: Performance comparison
 */
async function example5_PerformanceComparison() {
  console.log('\n=== Example 5: Performance Comparison ===');

  const frames = [0, 15, 30, 45, 60];

  // Test with GPU
  console.log('\n--- With GPU Enabled ---');
  const gpuCapturer = createFrameCapturer({
    template: exampleTemplate,
    useGPU: true,
  });

  try {
    await gpuCapturer.initialize();
    const gpuStart = Date.now();

    for (const frame of frames) {
      await gpuCapturer.captureFrame(frame);
    }

    const gpuTime = Date.now() - gpuStart;
    console.log(`✓ Captured ${frames.length} frames in ${gpuTime}ms`);
    console.log(`  Average: ${(gpuTime / frames.length).toFixed(2)}ms per frame`);

    await gpuCapturer.close();
  } catch (error) {
    console.error('✗ Error with GPU:', error.message);
  }

  // Test without GPU
  console.log('\n--- With GPU Disabled (Software Rendering) ---');
  const softwareCapturer = createFrameCapturer({
    template: exampleTemplate,
    useGPU: false,
  });

  try {
    await softwareCapturer.initialize();
    const softwareStart = Date.now();

    for (const frame of frames) {
      await softwareCapturer.captureFrame(frame);
    }

    const softwareTime = Date.now() - softwareStart;
    console.log(`✓ Captured ${frames.length} frames in ${softwareTime}ms`);
    console.log(`  Average: ${(softwareTime / frames.length).toFixed(2)}ms per frame`);

    await softwareCapturer.close();
  } catch (error) {
    console.error('✗ Error with software rendering:', error.message);
  }
}

/**
 * Example 6: Using with custom Puppeteer options
 */
async function example6_CustomOptions() {
  console.log('\n=== Example 6: Custom Puppeteer Options ===');

  const capturer = createFrameCapturer({
    template: exampleTemplate,
    useGPU: true,
    puppeteerOptions: {
      headless: true,
      args: [
        '--window-position=0,0',
      ],
    },
  });

  try {
    await capturer.initialize();
    console.log('✓ Capturer initialized with custom options');

    const frameBuffer = await capturer.captureFrame(0);
    console.log(`✓ Captured frame: ${frameBuffer.length} bytes`);

    await capturer.close();
    console.log('✓ Capturer closed');
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

// Run all examples
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         GPU Rendering Demo - Rendervid Phase 2             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    await example1_DefaultGPU();
    await example2_DisableGPU();
    await example3_EnableGPU();
    await example4_EnvironmentControl();
    await example5_PerformanceComparison();
    await example6_CustomOptions();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                   All Examples Complete                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n✗ Fatal error:', error);
    process.exit(1);
  }
}

// Run the examples
main().catch(console.error);

/**
 * Usage Instructions:
 *
 * 1. Run with default settings:
 *    node examples/gpu-rendering-demo.js
 *
 * 2. Disable GPU via environment variable:
 *    DISABLE_GPU=true node examples/gpu-rendering-demo.js
 *
 * 3. Watch for GPU status messages:
 *    Look for "[FrameCapturer] GPU rendering enabled" in the output
 *
 * Expected Output:
 * - GPU enabled messages when using default or explicit GPU
 * - GPU disabled messages when explicitly disabled
 * - Performance comparison showing GPU vs software rendering
 * - Fallback messages if GPU initialization fails
 *
 * Notes:
 * - GPU rendering requires a GPU-capable system
 * - Automatic fallback occurs if GPU fails to initialize
 * - Software rendering is always available as fallback
 * - Performance gains vary by template complexity
 */
