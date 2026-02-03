/**
 * GPU-Accelerated Encoding Demo
 *
 * This example demonstrates how to use GPU-accelerated video encoding
 * with automatic detection, explicit encoder selection, and vendor-specific options.
 *
 * Run with: node examples/gpu-encoding-demo.js
 */

const { createFFmpegEncoder, detectGPUCapabilities } = require('../dist/index.js');
const path = require('path');

async function demonstrateAutoGPU() {
  console.log('\n=== Demo 1: Automatic GPU Detection ===\n');

  const encoder = createFFmpegEncoder();

  // GPU acceleration is enabled by default if available
  // The encoder will automatically detect and use the best GPU encoder
  const options = {
    inputPattern: path.join(__dirname, 'frames/frame-%05d.png'),
    outputPath: path.join(__dirname, 'output-auto-gpu.mp4'),
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: {
      enabled: true, // Auto-detect and use GPU if available
      fallbackToSoftware: true, // Fallback to software if GPU fails
    },
  };

  console.log('Encoding with automatic GPU detection...');
  console.log('The encoder will select the best available GPU encoder for your system.');
}

async function demonstrateExplicitEncoder() {
  console.log('\n=== Demo 2: Explicit Encoder Selection ===\n');

  const encoder = createFFmpegEncoder();

  // Detect GPU first to see what's available
  const gpuInfo = await detectGPUCapabilities();

  if (!gpuInfo.available) {
    console.log('No GPU available, skipping explicit encoder demo');
    return;
  }

  console.log('Available encoders:', gpuInfo.encoders.join(', '));

  // Explicitly select an encoder
  const preferredEncoder = gpuInfo.recommendedEncoder;

  const options = {
    inputPattern: path.join(__dirname, 'frames/frame-%05d.png'),
    outputPath: path.join(__dirname, 'output-explicit-gpu.mp4'),
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: {
      enabled: true,
      preferredEncoder: preferredEncoder,
      fallbackToSoftware: true,
    },
  };

  console.log(`Encoding with explicit encoder: ${preferredEncoder}`);
}

async function demonstrateNVENCOptions() {
  console.log('\n=== Demo 3: NVIDIA NVENC with Custom Options ===\n');

  const gpuInfo = await detectGPUCapabilities();

  if (gpuInfo.vendor !== 'nvidia') {
    console.log('NVIDIA GPU not detected, skipping NVENC demo');
    return;
  }

  const encoder = createFFmpegEncoder();

  const options = {
    inputPattern: path.join(__dirname, 'frames/frame-%05d.png'),
    outputPath: path.join(__dirname, 'output-nvenc.mp4'),
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: {
      enabled: true,
      preferredEncoder: 'h264_nvenc',
      fallbackToSoftware: true,
      nvenc: {
        preset: 'p4', // Balanced quality/performance (p1=fastest, p7=slowest/best)
        tune: 'hq', // High quality mode
        rc: 'vbr', // Variable bitrate
      },
    },
  };

  console.log('Encoding with NVIDIA NVENC...');
  console.log('Options: preset=p4, tune=hq, rc=vbr');
}

async function demonstrateVideoToolboxOptions() {
  console.log('\n=== Demo 4: Apple VideoToolbox with Custom Options ===\n');

  const gpuInfo = await detectGPUCapabilities();

  if (gpuInfo.vendor !== 'apple') {
    console.log('Apple GPU not detected, skipping VideoToolbox demo');
    return;
  }

  const encoder = createFFmpegEncoder();

  const options = {
    inputPattern: path.join(__dirname, 'frames/frame-%05d.png'),
    outputPath: path.join(__dirname, 'output-videotoolbox.mp4'),
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: {
      enabled: true,
      preferredEncoder: 'h264_videotoolbox',
      fallbackToSoftware: true,
      videotoolbox: {
        allow_sw: true, // Allow software fallback
        realtime: false, // Disable realtime mode for better quality
      },
    },
  };

  console.log('Encoding with Apple VideoToolbox...');
  console.log('Options: allow_sw=true, realtime=false');
}

async function demonstrateQSVOptions() {
  console.log('\n=== Demo 5: Intel Quick Sync Video with Custom Options ===\n');

  const gpuInfo = await detectGPUCapabilities();

  if (gpuInfo.vendor !== 'intel') {
    console.log('Intel GPU not detected, skipping QSV demo');
    return;
  }

  const encoder = createFFmpegEncoder();

  const options = {
    inputPattern: path.join(__dirname, 'frames/frame-%05d.png'),
    outputPath: path.join(__dirname, 'output-qsv.mp4'),
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: {
      enabled: true,
      preferredEncoder: 'h264_qsv',
      fallbackToSoftware: true,
      qsv: {
        preset: 'medium', // Encoding speed preset
        look_ahead: true, // Enable look-ahead for better quality
      },
    },
  };

  console.log('Encoding with Intel Quick Sync Video...');
  console.log('Options: preset=medium, look_ahead=true');
}

async function demonstrateAMFOptions() {
  console.log('\n=== Demo 6: AMD AMF with Custom Options ===\n');

  const gpuInfo = await detectGPUCapabilities();

  if (gpuInfo.vendor !== 'amd') {
    console.log('AMD GPU not detected, skipping AMF demo');
    return;
  }

  const encoder = createFFmpegEncoder();

  const options = {
    inputPattern: path.join(__dirname, 'frames/frame-%05d.png'),
    outputPath: path.join(__dirname, 'output-amf.mp4'),
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    hardwareAcceleration: {
      enabled: true,
      preferredEncoder: 'h264_amf',
      fallbackToSoftware: true,
      amf: {
        quality: 'balanced', // Speed, balanced, or quality
        rc: 'vbr_latency', // Rate control mode
      },
    },
  };

  console.log('Encoding with AMD AMF...');
  console.log('Options: quality=balanced, rc=vbr_latency');
}

async function demonstrateConfigLevelSettings() {
  console.log('\n=== Demo 7: Config-Level Hardware Acceleration ===\n');

  // Hardware acceleration can be configured at the encoder level
  // These settings will apply to all encode operations unless overridden
  const encoder = createFFmpegEncoder({
    hardwareAcceleration: {
      enabled: true,
      fallbackToSoftware: true,
    },
  });

  const options = {
    inputPattern: path.join(__dirname, 'frames/frame-%05d.png'),
    outputPath: path.join(__dirname, 'output-config-level.mp4'),
    fps: 30,
    width: 1920,
    height: 1080,
    quality: 23,
    // No hardwareAcceleration specified here - uses config-level settings
  };

  console.log('Encoding with config-level hardware acceleration settings...');
}

async function demonstrateDisableGPU() {
  console.log('\n=== Demo 8: Explicitly Disable GPU Acceleration ===\n');

  const encoder = createFFmpegEncoder();

  const options = {
    inputPattern: path.join(__dirname, 'frames/frame-%05d.png'),
    outputPath: path.join(__dirname, 'output-no-gpu.mp4'),
    fps: 30,
    width: 1920,
    height: 1080,
    codec: 'libx264', // Software codec
    quality: 23,
    hardwareAcceleration: {
      enabled: false, // Explicitly disable GPU acceleration
    },
  };

  console.log('Encoding with GPU acceleration disabled...');
  console.log('Using software codec: libx264');
}

async function main() {
  console.log('=== GPU-Accelerated Encoding Demo ===');
  console.log('This demo shows various ways to use GPU acceleration in Rendervid');

  // First, detect what GPU capabilities are available
  console.log('\n=== System GPU Information ===\n');
  const gpuInfo = await detectGPUCapabilities();

  console.log('GPU Available:', gpuInfo.available);
  console.log('Vendor:', gpuInfo.vendor);
  if (gpuInfo.model) {
    console.log('Model:', gpuInfo.model);
  }
  console.log('Available Encoders:', gpuInfo.encoders.join(', ') || 'none');
  if (gpuInfo.recommendedEncoder) {
    console.log('Recommended:', gpuInfo.recommendedEncoder);
  }

  // Run demos (Note: These are for demonstration only and won't actually encode
  // unless you have frame files available)
  console.log('\n=== Usage Examples ===');
  console.log('The following examples show different configuration options.');
  console.log('To actually run encoding, ensure you have frame files available.\n');

  await demonstrateAutoGPU();
  await demonstrateExplicitEncoder();
  await demonstrateNVENCOptions();
  await demonstrateVideoToolboxOptions();
  await demonstrateQSVOptions();
  await demonstrateAMFOptions();
  await demonstrateConfigLevelSettings();
  await demonstrateDisableGPU();

  console.log('\n=== Summary ===\n');
  console.log('Key Features:');
  console.log('- Automatic GPU detection and encoder selection');
  console.log('- Explicit encoder selection for fine control');
  console.log('- Vendor-specific options (NVENC, VideoToolbox, QSV, AMF)');
  console.log('- Automatic fallback to software encoding on GPU failure');
  console.log('- Config-level and per-encode settings');
  console.log('- Full backward compatibility with software encoding');

  console.log('\n=== Demo Complete ===\n');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
