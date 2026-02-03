/**
 * GPU Integration Example - Phase 4
 *
 * This example demonstrates the integrated GPU acceleration API for both
 * rendering (Chrome GPU acceleration) and encoding (FFmpeg hardware encoders).
 *
 * Features:
 * - Unified GPU configuration via `gpu` option
 * - Control both rendering and encoding acceleration
 * - Auto-detection or explicit vendor selection
 * - Automatic fallback to software mode
 */

const { createNodeRenderer } = require('@rendervid/renderer-node');

// Create a simple template for testing
const template = {
  id: 'gpu-integration-test',
  name: 'GPU Integration Test',
  description: 'Test template for GPU acceleration',
  version: '1.0.0',
  output: {
    width: 1920,
    height: 1080,
    fps: 30,
  },
  composition: {
    type: 'Sequence',
    id: 'main',
    duration: 90, // 3 seconds at 30fps
    children: [
      {
        type: 'AbsoluteFill',
        id: 'background',
        children: [
          {
            type: 'div',
            id: 'text',
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
            children: 'GPU Acceleration Demo',
          },
        ],
      },
    ],
  },
  defaults: {},
};

// =============================================================================
// Example 1: Default Configuration (GPU enabled for both rendering and encoding)
// =============================================================================
async function example1_DefaultGPU() {
  console.log('\n=== Example 1: Default Configuration ===\n');

  // By default, GPU is enabled for both rendering and encoding
  const renderer = createNodeRenderer();

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-default.mp4',
  });

  console.log('Video rendered with default GPU configuration');
}

// =============================================================================
// Example 2: Explicit GPU Configuration
// =============================================================================
async function example2_ExplicitGPU() {
  console.log('\n=== Example 2: Explicit GPU Configuration ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,  // Enable GPU rendering (Chrome GPU acceleration)
      encoding: 'auto', // Auto-detect best GPU encoder
      fallback: true,   // Fallback to software if GPU unavailable
    },
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-explicit.mp4',
  });

  console.log('Video rendered with explicit GPU configuration');
}

// =============================================================================
// Example 3: GPU Rendering Only (Software Encoding)
// =============================================================================
async function example3_GPURenderingOnly() {
  console.log('\n=== Example 3: GPU Rendering Only ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,   // Enable GPU rendering
      encoding: 'none',  // Disable GPU encoding (use software encoder)
      fallback: true,
    },
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-rendering-only.mp4',
  });

  console.log('Video rendered with GPU rendering + software encoding');
}

// =============================================================================
// Example 4: GPU Encoding Only (Software Rendering)
// =============================================================================
async function example4_GPUEncodingOnly() {
  console.log('\n=== Example 4: GPU Encoding Only ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: false,  // Disable GPU rendering
      encoding: 'auto',  // Enable GPU encoding
      fallback: true,
    },
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-encoding-only.mp4',
  });

  console.log('Video rendered with software rendering + GPU encoding');
}

// =============================================================================
// Example 5: Fully Software Mode (No GPU)
// =============================================================================
async function example5_SoftwareOnly() {
  console.log('\n=== Example 5: Fully Software Mode ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: false,  // Disable GPU rendering
      encoding: 'none',  // Disable GPU encoding
      fallback: true,
    },
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/software-only.mp4',
  });

  console.log('Video rendered in full software mode');
}

// =============================================================================
// Example 6: Explicit Vendor Selection (NVIDIA)
// =============================================================================
async function example6_ExplicitVendor_NVIDIA() {
  console.log('\n=== Example 6: Explicit Vendor - NVIDIA ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,
      encoding: 'nvidia', // Force NVIDIA NVENC encoder
      fallback: true,     // Fallback to software if NVENC unavailable
    },
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-nvidia.mp4',
  });

  console.log('Video rendered with NVIDIA NVENC encoder (or fallback)');
}

// =============================================================================
// Example 7: Explicit Vendor Selection (Apple)
// =============================================================================
async function example7_ExplicitVendor_Apple() {
  console.log('\n=== Example 7: Explicit Vendor - Apple ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,
      encoding: 'apple', // Force Apple VideoToolbox encoder
      fallback: true,    // Fallback to software if VideoToolbox unavailable
    },
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-apple.mp4',
  });

  console.log('Video rendered with Apple VideoToolbox encoder (or fallback)');
}

// =============================================================================
// Example 8: Explicit Vendor Selection (Intel)
// =============================================================================
async function example8_ExplicitVendor_Intel() {
  console.log('\n=== Example 8: Explicit Vendor - Intel ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,
      encoding: 'intel', // Force Intel Quick Sync Video encoder
      fallback: true,    // Fallback to software if QSV unavailable
    },
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-intel.mp4',
  });

  console.log('Video rendered with Intel Quick Sync Video encoder (or fallback)');
}

// =============================================================================
// Example 9: Explicit Vendor Selection (AMD)
// =============================================================================
async function example9_ExplicitVendor_AMD() {
  console.log('\n=== Example 9: Explicit Vendor - AMD ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,
      encoding: 'amd',  // Force AMD AMF encoder
      fallback: true,   // Fallback to software if AMF unavailable
    },
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-amd.mp4',
  });

  console.log('Video rendered with AMD AMF encoder (or fallback)');
}

// =============================================================================
// Example 10: No Fallback (Strict GPU Mode)
// =============================================================================
async function example10_NoFallback() {
  console.log('\n=== Example 10: No Fallback (Strict GPU Mode) ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,
      encoding: 'auto',
      fallback: false,  // Don't fallback - throw error if GPU unavailable
    },
  });

  try {
    await renderer.renderVideo({
      template,
      outputPath: './output/gpu-no-fallback.mp4',
    });
    console.log('Video rendered with strict GPU mode');
  } catch (error) {
    console.error('Error (expected if no GPU):', error.message);
  }
}

// =============================================================================
// Example 11: Advanced FFmpeg Options with GPU
// =============================================================================
async function example11_AdvancedFFmpegOptions() {
  console.log('\n=== Example 11: Advanced FFmpeg Options ===\n');

  const renderer = createNodeRenderer({
    gpu: {
      rendering: true,
      encoding: 'auto',
      fallback: true,
    },
    ffmpeg: {
      // Optional: specify custom FFmpeg path
      // ffmpegPath: '/usr/local/bin/ffmpeg',

      // Note: Hardware acceleration is now controlled via gpu.encoding
      // The old hardwareAcceleration option is still supported for backward compatibility
      // but the new gpu.encoding approach is recommended
    },
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-advanced.mp4',
    codec: 'libx264', // Software codec name (will be replaced by GPU codec if available)
    quality: 23,      // Quality setting (CRF for software, mapped for GPU)
    pixelFormat: 'yuv420p',
  });

  console.log('Video rendered with advanced FFmpeg options');
}

// =============================================================================
// Example 12: Performance Comparison
// =============================================================================
async function example12_PerformanceComparison() {
  console.log('\n=== Example 12: Performance Comparison ===\n');

  // Test 1: Full GPU acceleration
  console.log('Test 1: Full GPU Acceleration');
  const gpuStart = Date.now();
  const gpuRenderer = createNodeRenderer({
    gpu: { rendering: true, encoding: 'auto', fallback: true },
  });
  await gpuRenderer.renderVideo({
    template,
    outputPath: './output/perf-gpu.mp4',
  });
  const gpuTime = Date.now() - gpuStart;
  console.log(`  Time: ${(gpuTime / 1000).toFixed(2)}s`);

  // Test 2: Software only
  console.log('\nTest 2: Software Only');
  const softwareStart = Date.now();
  const softwareRenderer = createNodeRenderer({
    gpu: { rendering: false, encoding: 'none', fallback: true },
  });
  await softwareRenderer.renderVideo({
    template,
    outputPath: './output/perf-software.mp4',
  });
  const softwareTime = Date.now() - softwareStart;
  console.log(`  Time: ${(softwareTime / 1000).toFixed(2)}s`);

  // Results
  console.log('\n--- Performance Comparison ---');
  console.log(`GPU:      ${(gpuTime / 1000).toFixed(2)}s`);
  console.log(`Software: ${(softwareTime / 1000).toFixed(2)}s`);
  console.log(`Speedup:  ${(softwareTime / gpuTime).toFixed(2)}x`);
}

// =============================================================================
// Main execution
// =============================================================================
async function main() {
  console.log('GPU Integration Examples - Phase 4');
  console.log('===================================');

  // Create output directory
  const fs = require('fs');
  if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output', { recursive: true });
  }

  // Run examples (uncomment the ones you want to run)

  // Basic examples
  await example1_DefaultGPU();
  // await example2_ExplicitGPU();
  // await example3_GPURenderingOnly();
  // await example4_GPUEncodingOnly();
  // await example5_SoftwareOnly();

  // Vendor-specific examples
  // await example6_ExplicitVendor_NVIDIA();
  // await example7_ExplicitVendor_Apple();
  // await example8_ExplicitVendor_Intel();
  // await example9_ExplicitVendor_AMD();

  // Advanced examples
  // await example10_NoFallback();
  // await example11_AdvancedFFmpegOptions();
  // await example12_PerformanceComparison();

  console.log('\n=== All examples completed ===\n');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use as module
module.exports = {
  example1_DefaultGPU,
  example2_ExplicitGPU,
  example3_GPURenderingOnly,
  example4_GPUEncodingOnly,
  example5_SoftwareOnly,
  example6_ExplicitVendor_NVIDIA,
  example7_ExplicitVendor_Apple,
  example8_ExplicitVendor_Intel,
  example9_ExplicitVendor_AMD,
  example10_NoFallback,
  example11_AdvancedFFmpegOptions,
  example12_PerformanceComparison,
};
