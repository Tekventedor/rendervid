/**
 * GPU Integration Example - Phase 4 (TypeScript)
 *
 * This example demonstrates type-safe GPU acceleration API usage.
 */

import {
  createNodeRenderer,
  type NodeRenderer,
  type GPUConfig,
  type GPUEncodingType,
} from '@rendervid/renderer-node';
import type { Template } from '@rendervid/core';

// Create a simple template for testing
const template: Template = {
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

/**
 * Example 1: Default GPU Configuration
 * Both rendering and encoding are GPU-accelerated by default
 */
async function defaultGPUConfig(): Promise<void> {
  console.log('\n=== Default GPU Configuration ===\n');

  // No GPU config needed - defaults to GPU enabled
  const renderer: NodeRenderer = createNodeRenderer();

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-default.mp4',
  });

  console.log('✓ Video rendered with default GPU configuration');
}

/**
 * Example 2: Explicit GPU Configuration with All Options
 */
async function explicitGPUConfig(): Promise<void> {
  console.log('\n=== Explicit GPU Configuration ===\n');

  const gpuConfig: GPUConfig = {
    rendering: true,  // GPU rendering via Chrome
    encoding: 'auto', // Auto-detect GPU encoder
    fallback: true,   // Fallback to software if needed
  };

  const renderer: NodeRenderer = createNodeRenderer({
    gpu: gpuConfig,
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-explicit.mp4',
  });

  console.log('✓ Video rendered with explicit GPU configuration');
}

/**
 * Example 3: Type-Safe Vendor Selection
 */
async function vendorSelection(): Promise<void> {
  console.log('\n=== Vendor Selection ===\n');

  // Type-safe encoding vendor selection
  const vendors: GPUEncodingType[] = [
    'auto',
    'nvidia',
    'intel',
    'amd',
    'apple',
    'none',
  ];

  for (const encoding of vendors) {
    console.log(`Testing with encoding: ${encoding}`);

    const gpuConfig: GPUConfig = {
      rendering: true,
      encoding,
      fallback: true, // Important: allow fallback for testing
    };

    const renderer: NodeRenderer = createNodeRenderer({
      gpu: gpuConfig,
    });

    try {
      await renderer.renderVideo({
        template,
        outputPath: `./output/gpu-${encoding}.mp4`,
      });
      console.log(`  ✓ Success with ${encoding}`);
    } catch (error) {
      console.log(`  ✗ Failed with ${encoding}:`, (error as Error).message);
    }
  }
}

/**
 * Example 4: GPU Rendering Only (Software Encoding)
 */
async function gpuRenderingOnly(): Promise<void> {
  console.log('\n=== GPU Rendering Only ===\n');

  const gpuConfig: GPUConfig = {
    rendering: true,
    encoding: 'none', // Disable GPU encoding
  };

  const renderer: NodeRenderer = createNodeRenderer({
    gpu: gpuConfig,
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-rendering-only.mp4',
  });

  console.log('✓ Video rendered with GPU rendering + software encoding');
}

/**
 * Example 5: GPU Encoding Only (Software Rendering)
 */
async function gpuEncodingOnly(): Promise<void> {
  console.log('\n=== GPU Encoding Only ===\n');

  const gpuConfig: GPUConfig = {
    rendering: false, // Disable GPU rendering
    encoding: 'auto',
  };

  const renderer: NodeRenderer = createNodeRenderer({
    gpu: gpuConfig,
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-encoding-only.mp4',
  });

  console.log('✓ Video rendered with software rendering + GPU encoding');
}

/**
 * Example 6: Fully Software Mode
 */
async function softwareMode(): Promise<void> {
  console.log('\n=== Fully Software Mode ===\n');

  const gpuConfig: GPUConfig = {
    rendering: false,
    encoding: 'none',
  };

  const renderer: NodeRenderer = createNodeRenderer({
    gpu: gpuConfig,
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/software-only.mp4',
  });

  console.log('✓ Video rendered in full software mode');
}

/**
 * Example 7: Strict GPU Mode (No Fallback)
 */
async function strictGPUMode(): Promise<void> {
  console.log('\n=== Strict GPU Mode (No Fallback) ===\n');

  const gpuConfig: GPUConfig = {
    rendering: true,
    encoding: 'auto',
    fallback: false, // Throw error if GPU unavailable
  };

  const renderer: NodeRenderer = createNodeRenderer({
    gpu: gpuConfig,
  });

  try {
    await renderer.renderVideo({
      template,
      outputPath: './output/gpu-strict.mp4',
    });
    console.log('✓ Video rendered in strict GPU mode');
  } catch (error) {
    console.error('✗ Error (expected if no GPU):', (error as Error).message);
  }
}

/**
 * Example 8: Platform-Specific Configuration
 */
async function platformSpecificConfig(): Promise<void> {
  console.log('\n=== Platform-Specific Configuration ===\n');

  // Detect platform and configure accordingly
  const platform = process.platform;
  let encoding: GPUEncodingType;

  switch (platform) {
    case 'darwin':
      encoding = 'apple'; // macOS - use VideoToolbox
      console.log('Detected macOS - using VideoToolbox');
      break;
    case 'win32':
      encoding = 'nvidia'; // Windows - try NVIDIA (with fallback)
      console.log('Detected Windows - trying NVIDIA');
      break;
    case 'linux':
      encoding = 'auto'; // Linux - auto-detect
      console.log('Detected Linux - auto-detecting GPU');
      break;
    default:
      encoding = 'auto';
      console.log('Unknown platform - auto-detecting GPU');
  }

  const gpuConfig: GPUConfig = {
    rendering: true,
    encoding,
    fallback: true, // Always allow fallback for cross-platform code
  };

  const renderer: NodeRenderer = createNodeRenderer({
    gpu: gpuConfig,
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-platform-specific.mp4',
  });

  console.log('✓ Video rendered with platform-specific configuration');
}

/**
 * Example 9: Configuration Builder Pattern
 */
class GPUConfigBuilder {
  private config: GPUConfig = {
    rendering: true,
    encoding: 'auto',
    fallback: true,
  };

  withRendering(enabled: boolean): this {
    this.config.rendering = enabled;
    return this;
  }

  withEncoding(type: GPUEncodingType): this {
    this.config.encoding = type;
    return this;
  }

  withFallback(enabled: boolean): this {
    this.config.fallback = enabled;
    return this;
  }

  build(): GPUConfig {
    return { ...this.config };
  }
}

async function builderPatternExample(): Promise<void> {
  console.log('\n=== Builder Pattern Example ===\n');

  // Build GPU config using builder pattern
  const gpuConfig = new GPUConfigBuilder()
    .withRendering(true)
    .withEncoding('nvidia')
    .withFallback(true)
    .build();

  const renderer: NodeRenderer = createNodeRenderer({
    gpu: gpuConfig,
  });

  await renderer.renderVideo({
    template,
    outputPath: './output/gpu-builder.mp4',
  });

  console.log('✓ Video rendered using builder pattern');
}

/**
 * Example 10: Multiple Renderer Instances with Different Configs
 */
async function multipleRenderers(): Promise<void> {
  console.log('\n=== Multiple Renderer Instances ===\n');

  // Create multiple renderers with different configs
  const gpuRenderer = createNodeRenderer({
    gpu: { rendering: true, encoding: 'auto', fallback: true },
  });

  const softwareRenderer = createNodeRenderer({
    gpu: { rendering: false, encoding: 'none', fallback: true },
  });

  // Render same template with different methods
  console.log('Rendering with GPU...');
  const gpuStart = Date.now();
  await gpuRenderer.renderVideo({
    template,
    outputPath: './output/multi-gpu.mp4',
  });
  const gpuTime = Date.now() - gpuStart;

  console.log('Rendering with Software...');
  const softwareStart = Date.now();
  await softwareRenderer.renderVideo({
    template,
    outputPath: './output/multi-software.mp4',
  });
  const softwareTime = Date.now() - softwareStart;

  console.log('\n--- Performance Comparison ---');
  console.log(`GPU:      ${(gpuTime / 1000).toFixed(2)}s`);
  console.log(`Software: ${(softwareTime / 1000).toFixed(2)}s`);
  console.log(`Speedup:  ${(softwareTime / gpuTime).toFixed(2)}x`);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('GPU Integration Examples - Phase 4 (TypeScript)');
  console.log('================================================');

  // Create output directory
  const fs = await import('fs');
  if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output', { recursive: true });
  }

  // Run examples (uncomment the ones you want to run)
  await defaultGPUConfig();
  // await explicitGPUConfig();
  // await vendorSelection();
  // await gpuRenderingOnly();
  // await gpuEncodingOnly();
  // await softwareMode();
  // await strictGPUMode();
  // await platformSpecificConfig();
  // await builderPatternExample();
  // await multipleRenderers();

  console.log('\n=== All examples completed ===\n');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use as module
export {
  defaultGPUConfig,
  explicitGPUConfig,
  vendorSelection,
  gpuRenderingOnly,
  gpuEncodingOnly,
  softwareMode,
  strictGPUMode,
  platformSpecificConfig,
  builderPatternExample,
  multipleRenderers,
  GPUConfigBuilder,
};
